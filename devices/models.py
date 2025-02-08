from django.db import models


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
    measure = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Device Data Point'
        verbose_name_plural = 'Device Data Points'
