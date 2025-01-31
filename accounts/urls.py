
from django.urls import path
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib.auth import views


def logout_view(request):
    logout(request)
    return redirect('home')


urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
]
