from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('hello-webpack/', TemplateView.as_view(template_name='devices/hello_webpack.html'))
]
