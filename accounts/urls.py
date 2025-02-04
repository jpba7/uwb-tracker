
from django.urls import path
from django.contrib.auth import logout
from django.shortcuts import redirect


def logout_view(request):
    logout(request)
    return redirect('home')


urlpatterns = [
    path('logout/', logout_view, name='logout'),
]
