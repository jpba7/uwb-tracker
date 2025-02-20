from django.urls import path
from .views import EmployeeDelete, EmployeesList, EmployeeCreate, EmployeeUpdate

urlpatterns = [
    path('api/list', EmployeesList.as_view(), name='employees_list_api'),
    path('api/create', EmployeeCreate.as_view(), name='employee_create_api'),
    path('api/update/<int:id>', EmployeeUpdate.as_view(), name='employee_update_api'),
    path('api/delete/<int:id>', EmployeeDelete.as_view(), name='employee_delete_api'),
]
