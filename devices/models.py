import logging
from datetime import datetime

from django.db import models
from django.db.models import Q
from django.utils import timezone


class DeviceManager(models.Manager):
    def get_or_create_tag(self, tag_id: str):
        device_type, _ = DeviceType.objects.get_or_create(name='Tag')
        device, _ = self.get_or_create(
            name=tag_id,
            defaults={
                'device_type': device_type,
            }
        )
        return device


class Device(models.Model):
    name = models.CharField(max_length=100, verbose_name='Nome do Dispositivo')
    device_type = models.ForeignKey('DeviceType', on_delete=models.CASCADE, verbose_name='Tipo de Dispositivo')
    creation_date = models.DateTimeField(auto_now_add=True, verbose_name='Data de Criação')
    linked_employee = models.OneToOneField('employees.Employee', on_delete=models.CASCADE, null=True, verbose_name='Funcionário Vinculado')
    is_active = models.BooleanField(default=True, verbose_name='Ativo')
    objects: DeviceManager = DeviceManager()

    class Meta:
        verbose_name = 'Dispositivo'
        verbose_name_plural = 'Dispositivos'

    def __str__(self):
        return f'{self.device_type.name}: {self.name}'

    def save(self, *args, **kwargs):
        if self.pk:
            try:
                old_instance = Device.objects.get(pk=self.pk)
                if old_instance.linked_employee != self.linked_employee:
                    if old_instance.linked_employee:
                        DeviceUserHistory.objects.get(device=self, is_active=True).close_history()
                    if self.linked_employee:
                        # Primeiro salvamos o Device
                        super().save(*args, **kwargs)
                        # Depois criamos o histórico
                        DeviceUserHistory.objects.create(
                            device=self, 
                            start_date=datetime.now().replace(hour=0, minute=0, second=1), 
                            employee=self.linked_employee
                        )
                        return  # Retornamos aqui pois já salvamos
            except Device.DoesNotExist:
                logging.error('[Device Save] Device not found, unexpected behaviour.')
            except DeviceUserHistory.DoesNotExist:
                logging.error('[Device Save] Previous DeviceUserHistory not found, creating new one.')
                if self.linked_employee:
                    # Primeiro salvamos o Device
                    super().save(*args, **kwargs)
                    # Depois criamos o histórico
                    DeviceUserHistory.objects.create(
                        device=self, 
                        start_date=datetime.now().replace(hour=0, minute=0, second=1), 
                        employee=self.linked_employee
                    )
                    return  # Retornamos aqui pois já salvamos
        elif self.linked_employee:  # Novo objeto com linked_employee
            # Primeiro salvamos o Device
            super().save(*args, **kwargs)
            # Depois criamos o histórico
            DeviceUserHistory.objects.create(
                device=self, 
                start_date=datetime.now().replace(hour=0, minute=0, second=1), 
                employee=self.linked_employee
            )
            return  # Retornamos aqui pois já salvamos

        # Se chegou aqui, salvamos normalmente
        super().save(*args, **kwargs)


class DeviceType(models.Model):
    name = models.CharField(max_length=100, verbose_name='Tipo de Dispositivo')

    class Meta:
        verbose_name = 'Tipo de Dispositivo'
        verbose_name_plural = 'Tipos de Dispositivos'

    def __str__(self):
        return str(self.name)


class DeviceDataPointManager(models.Manager):
    def get_xy_points_from_history_list(self, history_list: list[tuple[Device, datetime, datetime]]):
        # Cria um Q object para combinar todas as condições
        queries = Q()
        for device, start_date, end_date in history_list:
            # Inicia com a condição do device que é obrigatória
            device_query = Q(device=device)

            # Adiciona filtros de data apenas se não forem None
            if start_date:
                if timezone.is_naive(start_date):
                    start_date = timezone.make_aware(start_date)
                device_query &= Q(timestamp__gte=start_date)
            if end_date:
                if timezone.is_naive(end_date):
                    end_date = timezone.make_aware(end_date)
                device_query &= Q(timestamp__lte=end_date)

            # Combina com as queries anteriores
            queries |= device_query

        return self.filter(queries)


class DeviceDataPoints(models.Model):
    device = models.ForeignKey('Device', on_delete=models.CASCADE, verbose_name='Dispositivo')
    x = models.DecimalField(max_digits=10, decimal_places=2)
    y = models.DecimalField(max_digits=10, decimal_places=2)
    z = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Data de Registro')
    objects: DeviceDataPointManager = DeviceDataPointManager()

    class Meta:
        verbose_name = 'Coordenadas do Dispositivo'
        verbose_name_plural = 'Coordenadas dos Dispositivos'

    def __str__(self) -> str:
        return f'{self.device.name} ({self.timestamp}): {self.x}, {self.y}, {self.z}'


class DeviceUserHistoryManager(models.Manager):
    def get_all_device_history_from_employee(self, employee) -> list[tuple[Device, datetime, datetime]]:
        all_histories_list = []
        all_histories = self.filter(employee=employee)
        for history in all_histories:
            all_histories_list.append((history.device, history.start_date, history.end_date))

        return all_histories_list


class DeviceUserHistory(models.Model):
    device = models.ForeignKey('Device', on_delete=models.CASCADE, verbose_name='Dispositivo')
    employee = models.ForeignKey('employees.Employee', on_delete=models.CASCADE, verbose_name='Funcionário')
    start_date = models.DateTimeField(verbose_name='Data de Início')
    end_date = models.DateTimeField(null=True, verbose_name='Data de Fim')
    is_active = models.BooleanField(default=True, verbose_name='Ativo')
    objects: DeviceUserHistoryManager = DeviceUserHistoryManager()

    def __str__(self) -> str:
        formatted_date = self.start_date.strftime('%d/%m/%Y')
        return f'{self.device.name} - {self.employee} ({formatted_date})'

    class Meta:
        verbose_name = 'Histórico de Uso do Dispositivo'
        verbose_name_plural = 'Históricos de Uso dos Dispositivos'

    def close_history(self):
        self.end_date = datetime.now()
        self.is_active = False
        self.save()

        return self
