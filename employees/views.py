from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from .serializers import EmployeeSerializer
from .models import Employee


class EmployeesList(ListAPIView):
    permission_classes = [AllowAny]  # TODO REMOVER
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.all()
