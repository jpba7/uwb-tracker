from django.db import models
from employees.models import Employee


class Device(models.Model):
    name = models.CharField(max_length=100)
    device_type = models.ForeignKey('DeviceType', on_delete=models.CASCADE)
    mac_address = models.CharField(max_length=17)
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.device_type.name}: {self.name}'


class DeviceType(models.Model):
    name = models.CharField(max_length=100)


class DeviceDataPoints(models.Model):
    device = models.ForeignKey('Device', on_delete=models.CASCADE)
    x = models.DecimalField(max_digits=10, decimal_places=2)
    y = models.DecimalField(max_digits=10, decimal_places=2)
    z = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Device Data Point'
        verbose_name_plural = 'Device Data Points'


class Tag(Device):
    linked_employee = models.ForeignKey('employees.Employee', on_delete=models.CASCADE)
    total_distance = models.DecimalField(max_digits=10, decimal_places=2)
    atual_employee_distance = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.name} - {self.linked_employee}'

    def assign_employee_by_cpf(self, cpf):
        employee = Employee.objects.get(cpf=cpf)
        self.linked_employee = employee
        self.atual_employee_distance = 0
        self.save()
        return self.linked_employee
