from rest_framework import serializers

from devices.models import Device, DeviceDataPoints


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'


class DeviceDatapointSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceDataPoints
        fields = ['x', 'y', 'z', 'timestamp']
