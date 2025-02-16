from datetime import datetime

from django.db import models

from employees.models import Employee


class Device(models.Model):
    name = models.CharField(max_length=100)
    device_type = models.ForeignKey('DeviceType', on_delete=models.CASCADE)
    mac_address = models.CharField(max_length=17)
    creation_date = models.DateTimeField(auto_now_add=True)
    linked_employee = models.ForeignKey('employees.Employee', on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f'{self.device_type.name}: {self.name}'

    def assign_employee_by_cpf(self, cpf: str):  # TODO se mudar o CPF para outro tipo mudar tbm aqui
        employee = Employee.objects.get(cpf=cpf)
        self.linked_employee = employee
        self.save()

        # Cria um novo registro de histórico de uso do dispositivo e desativa o antigo
        DeviceUserHistory.objects.get(device=self, is_active=True).change_employee(employee)

        return self


class DeviceType(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = 'Device Type'
        verbose_name_plural = 'Device Types'

    def __str__(self):
        return str(self.name)


class DeviceDataPoints(models.Model):
    device = models.ForeignKey('Device', on_delete=models.CASCADE)
    x = models.DecimalField(max_digits=10, decimal_places=2)
    y = models.DecimalField(max_digits=10, decimal_places=2)
    z = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Device Data Point'
        verbose_name_plural = 'Device Data Points'

    def __str__(self) -> str:
        return f'{self.device.name} ({self.timestamp}): {self.x}, {self.y}, {self.z}'


class DeviceUserHistory(models.Model):
    device = models.ForeignKey('Device', on_delete=models.CASCADE)
    employee = models.ForeignKey('employees.Employee', on_delete=models.CASCADE)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Device User History'
        verbose_name_plural = 'Device User Histories'

    def change_employee(self, new_employee: Employee):
        self.end_date = datetime.now()
        self.is_active = False
        self.save()

        DeviceUserHistory.objects.create(device=self.device, employee=new_employee)

        return self
