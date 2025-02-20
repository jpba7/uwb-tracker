from rest_framework import serializers

from devices.models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField('get_formatted_created_at')

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
            'address']

    def get_formatted_created_at(self, obj: Employee) -> str:
        return obj.created_at.strftime('%d/%m/%Y')
