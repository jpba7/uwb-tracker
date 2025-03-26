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
            'creation_date',
            'is_active',
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
    employee_name = serializers.SerializerMethodField('get_employee_full_name')
    formatted_start_date = serializers.SerializerMethodField('get_formatted_start_date')
    formatted_end_date = serializers.SerializerMethodField('get_formatted_end_date')

    class Meta:
        model = DeviceUserHistory
        fields = [
            'id',
            'device',
            'device_name',
            'employee',
            'employee_name',
            'start_date',  # campo original do modelo
            'end_date',    # campo original do modelo
            'formatted_start_date',  # campo formatado apenas para exibição
            'formatted_end_date',    # campo formatado apenas para exibição
            'is_active'
        ]
        read_only_fields = ['formatted_start_date', 'formatted_end_date']

    def validate(self, attrs):
        if not attrs.get('start_date'):
            raise serializers.ValidationError({
                'start_date': 'A data inicial é obrigatória.'
            })
        return attrs

    def create(self, validated_data):
        if not validated_data.get('start_date'):
            raise serializers.ValidationError({
                'start_date': 'A data inicial é obrigatória.'
            })
        return super().create(validated_data)

    def get_device_name(self, obj):
        return obj.device.name if obj.device else None

    def get_employee_full_name(self, obj: DeviceUserHistory) -> str:
        if obj.employee:
            return f'{obj.employee.first_name} {obj.employee.last_name}'.strip()
        return ''

    def get_formatted_start_date(self, obj: DeviceUserHistory) -> str:
        if obj.start_date:
            return obj.start_date.strftime('%d/%m/%Y')
        return ''

    def get_formatted_end_date(self, obj: DeviceUserHistory) -> str:
        if obj.end_date:
            return obj.end_date.strftime('%d/%m/%Y')
        return ''


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
