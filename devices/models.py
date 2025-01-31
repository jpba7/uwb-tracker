from django.db import models


class Device(models.Model):
    name = models.CharField(max_length=100)
    device_type = models.ForeignKey('DeviceType', on_delete=models.CASCADE)
    mac_address = models.CharField(max_length=17)
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.device_type.name}: {self.name}"


class DeviceType(models.Model):
    name = models.CharField(max_length=100)
