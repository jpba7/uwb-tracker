from django.urls import include, path
from devices.views import DeviceDataPointList
from .views import (DeviceDataPointAnimation, DeviceDataPointHeatMapSeaborn, DeviceViewSet,
                    DeviceTypeList, DeviceUserHistoryViewSet, BatchPositionCreate, DeviceLastPosition)
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'api/device-history', DeviceUserHistoryViewSet, basename='device-history')
router.register(r'api', DeviceViewSet, basename='device')


urlpatterns = [
    path('', include(router.urls)),
    path('datapoints', DeviceDataPointList.as_view(), name='device_data_points'),
    path('datapoints/heatmap', DeviceDataPointHeatMapSeaborn.as_view(), name='device_data_points_heatmap'),
    path('datapoints/last-position', DeviceLastPosition.as_view(), name='device-last-position'),
    path('datapoints/tracker', DeviceDataPointAnimation.as_view(), name='device-animation'),
    path('api/ros/datapoints/batch', BatchPositionCreate.as_view(), name='batch_position_create'),
    path('api/device-types', DeviceTypeList.as_view(), name='device_types_list'),
]
