from django.urls import path
from devices.views import DeviceDataPointList

urlpatterns = [
    path('datapoints', DeviceDataPointList.as_view(), name='device_data_points'),
]
