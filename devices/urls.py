from django.urls import path
from devices.views import DeviceDataPointList, DeviceDataPointHeatMap

urlpatterns = [
    path('datapoints', DeviceDataPointList.as_view(), name='device_data_points'),
    path('datapoints/heatmap', DeviceDataPointHeatMap.as_view(), name='device_data_points_heatmap'),
]
