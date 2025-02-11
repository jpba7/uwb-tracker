from rest_framework import serializers

from devices.models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField('get_full_name')
    created_at = serializers.SerializerMethodField('get_formatted_created_at')

    class Meta:
        model = Employee
        fields = [
            'id',
            'name',
            'cpf',
            'email',
            'phone',
            'emergency_contact',
            'created_at']

    def get_full_name(self, obj: Employee) -> str:
        return str(obj)

    def get_formatted_created_at(self, obj: Employee) -> str:
        return obj.created_at.strftime('%d/%m/%Y')
