from django.shortcuts import render
from rest_framework import generics

from .models import Device
from .serializer import DeviceSerializer
