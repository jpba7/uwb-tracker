from rest_framework import serializers

from devices.models import Device, DeviceDataPoints, DeviceType, DeviceUserHistory


class DeviceSerializer(serializers.ModelSerializer):
    device_type_name = serializers.CharField(source='device_type.name', read_only=True)
    linked_employee_name = serializers.SerializerMethodField('get_employee_full_name')
    creation_date = serializers.SerializerMethodField('get_formatted_creation_date')

    class Meta:
        model = Device
        fields = [
            'id',
            'name',
            'device_type',
            'device_type_name',
            'mac_address',
            'creation_date',
            'linked_employee',
            'linked_employee_name']

    def get_formatted_creation_date(self, obj: Device) -> str:
        return obj.creation_date.strftime('%d/%m/%Y')

    def get_employee_full_name(self, obj: Device) -> str:
        if obj.linked_employee:
            return f'{obj.linked_employee.first_name} {obj.linked_employee.last_name}'.strip()
        return ''


class DeviceDatapointSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceDataPoints
        fields = ['x', 'y', 'z', 'timestamp']


class DeviceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceType
        fields = ['id', 'name']


class DeviceUserHistorySerializer(serializers.ModelSerializer):
    device_name = serializers.SerializerMethodField()

    class Meta:
        model = DeviceUserHistory
        fields = ['id', 'device', 'device_name', 'employee', 'start_date', 'end_date', 'is_active']

    def get_device_name(self, obj):
        return obj.device.name if obj.device else None


class PositionSerializer(serializers.Serializer):
    tag_id = serializers.CharField()
    timestamp = serializers.FloatField()
    x = serializers.FloatField()
    y = serializers.FloatField()
    z = serializers.FloatField()
    created_at = serializers.DateTimeField()


class BatchPositionSerializer(serializers.Serializer):
    positions = PositionSerializer(many=True)

    def create(self, validated_data):
        positions = validated_data.get('positions', [])
        data_points = []

        for position in positions:
            device = Device.objects.get_or_create_tag(position['tag_id'])

            data_point = DeviceDataPoints(
                device=device,
                x=position['x'],
                y=position['y'],
                z=position['z'],
                timestamp=position['created_at']
            )
            data_points.append(data_point)

        DeviceDataPoints.objects.bulk_create(data_points)
        return {'created': len(data_points)}
