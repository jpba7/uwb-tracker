from datetime import datetime

from django.utils.dateparse import parse_date
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from devices.models import DeviceDataPoints
from devices.serializer import DeviceDatapointSerializer


class DeviceDataPointList(ListAPIView):
    permission_classes = [AllowAny]  # TODO REMOVER
    serializer_class = DeviceDatapointSerializer
    paginate_by = 100

    def get_queryset(self):
        datapoints = None
        start_date = self.request.GET.get('start_date', None)
        end_date = self.request.GET.get('end_date', None)

        if start_date:
            start_date = parse_date(start_date)
            datapoints = DeviceDataPoints.objects.filter(timestamp__gte=start_date)
        if end_date:
            end_date = parse_date(end_date)
            if not datapoints:
                datapoints = DeviceDataPoints.objects.filter(timestamp__lte=end_date)
            else:
                datapoints = datapoints.filter(timestamp__lte=end_date)
        if not datapoints:
            datapoints = DeviceDataPoints.objects.filter(
                timestamp__gte=datetime(2023, 1, 1), timestamp__lte=datetime(2023, 1, 2))  # TODO MUDAR PARA HOJE

        return datapoints
