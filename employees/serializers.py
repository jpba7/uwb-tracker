from rest_framework import serializers
from devices.models import DeviceUserHistory

from employees.models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField('get_formatted_created_at')
    has_device_history = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id',
            'first_name',
            'last_name',
            'cpf',
            'email',
            'phone',
            'emergency_contact',
            'created_at',
            'address',
            'has_device_history']

    def get_formatted_created_at(self, obj: Employee) -> str:
        return obj.created_at.strftime('%d/%m/%Y')

    def get_has_device_history(self, obj):
        return DeviceUserHistory.objects.filter(employee=obj).exists()
