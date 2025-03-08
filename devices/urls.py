from django.urls import include, path
from devices.views import DeviceDataPointList
from .views import (DeviceDataPointAnimation, DeviceDataPointHeatMapSeaborn,
                    DeviceDelete, DevicesList, DeviceCreate, DeviceUpdate,
                    DeviceTypeList, DeviceUserHistoryViewSet, BatchPositionCreate)
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'api/device-history', DeviceUserHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('datapoints', DeviceDataPointList.as_view(), name='device_data_points'),
    path('datapoints/heatmap/seaborn',
         DeviceDataPointHeatMapSeaborn.as_view(),
         name='device_data_points_heatmap_seaborn'),
    path('datapoints/animation', DeviceDataPointAnimation.as_view(), name='device-animation'),
    path('api/ros/datapoints/batch', BatchPositionCreate.as_view(), name='batch_position_create'),
    path('api/list', DevicesList.as_view(), name='devices_list_api'),
    path('api/create', DeviceCreate.as_view(), name='device_create_api'),
    path('api/update/<int:id>', DeviceUpdate.as_view(), name='device_update_api'),
    path('api/delete/<int:id>', DeviceDelete.as_view(), name='device_delete_api'),
    path('api/device-types', DeviceTypeList.as_view(), name='device_types_list'),
]
