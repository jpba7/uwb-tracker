from django.urls import path
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


class HelloWebpackView(LoginRequiredMixin, TemplateView):
    template_name = 'devices/hello_webpack.html'


urlpatterns = [
    path('hello', HelloWebpackView.as_view(), name='home')
]
