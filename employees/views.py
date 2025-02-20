from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from django.views import View
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import EmployeeSerializer
from .models import Employee
from .forms import CreateEmployee


class EmployeesList(ListAPIView):
    permission_classes = [AllowAny]  # TODO REMOVER
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.all()

@method_decorator(csrf_exempt, name='dispatch')
class EmployeeCreate(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            form = CreateEmployee(data)
            if form.is_valid():
                employee = form.save()
                return JsonResponse({
                    'id': employee.id,
                    'message': 'Employee created successfully'
                })
            else:
                return JsonResponse(form.errors, status=400)
        except Exception as e:
            return JsonResponse({'non_field_errors': [str(e)]}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class EmployeeUpdate(View):
    def put(self, request, id):
        try:
            data = json.loads(request.body)
            employee = Employee.objects.get(id=id)
            form = CreateEmployee(data, instance=employee)
            if form.is_valid():
                employee = form.save()
                return JsonResponse({
                    'id': employee.id,
                    'message': 'Employee updated successfully'
                })
            else:
                return JsonResponse(form.errors, status=400)
        except Employee.DoesNotExist:
            return JsonResponse({'non_field_errors': ['Employee not found']}, status=404)
        except Exception as e:
            return JsonResponse({'non_field_errors': [str(e)]}, status=400)
