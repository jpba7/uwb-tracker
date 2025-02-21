from django.urls import path
from devices.views import DeviceDataPointList, DeviceDataPointHeatMap
from .views import DeviceDelete, DevicesList, DeviceCreate, DeviceUpdate, DeviceTypeList

urlpatterns = [
    path('datapoints', DeviceDataPointList.as_view(), name='device_data_points'),
    path('datapoints/heatmap', DeviceDataPointHeatMap.as_view(), name='device_data_points_heatmap'),
    path('api/list', DevicesList.as_view(), name='devices_list_api'),
    path('api/create', DeviceCreate.as_view(), name='device_create_api'),
    path('api/update/<int:id>', DeviceUpdate.as_view(), name='device_update_api'),
    path('api/delete/<int:id>', DeviceDelete.as_view(), name='device_delete_api'),
    path('api/device-types', DeviceTypeList.as_view(), name='device_types_list'),
]
