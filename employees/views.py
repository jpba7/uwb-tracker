from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import EmployeeSerializer
from .models import Employee


class EmployeesList(generics.ListAPIView):
    permission_classes = [AllowAny]  # TODO REMOVER
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.all().order_by('id')


class EmployeeCreate(generics.CreateAPIView):
    permission_classes = [AllowAny]  # TODO REMOVER
    serializer_class = EmployeeSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                'id': serializer.instance.id,
                'message': 'Employee created successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeUpdate(generics.UpdateAPIView):
    permission_classes = [AllowAny]  # TODO REMOVER
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.all()
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response({
                'id': serializer.instance.id,
                'message': 'Employee updated successfully'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDelete(generics.DestroyAPIView):
    permission_classes = [AllowAny]  # TODO REMOVER
    queryset = Employee.objects.all()
    lookup_field = 'id'
