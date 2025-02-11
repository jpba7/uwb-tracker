from django.urls import path
from .views import EmployeesList

urlpatterns = [
    path('api/list', EmployeesList.as_view(), name='employees_list_api'),
]
