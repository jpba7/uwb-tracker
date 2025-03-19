from django.contrib import admin
from .models import Device
from .models import DeviceType
from .models import DeviceUserHistory
from .models import DeviceDataPoints
# Register your models here.
admin.site.register(Device)
admin.site.register(DeviceType)
admin.site.register(DeviceUserHistory)
admin.site.register(DeviceDataPoints)