from datetime import datetime
from decimal import Decimal

import numpy as np
from django.db.models import Count, F, DecimalField
from django.db.models.functions import Floor
from django.utils.dateparse import parse_date
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from devices.models import DeviceDataPoints
from devices.serializers import DeviceDatapointSerializer


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

        return datapoints.order_by('timestamp')


class DeviceDataPointHeatMap(APIView):
    permission_classes = [AllowAny]  # TODO REMOVER

    def get(self, request):
        device_id = self.request.GET.get('device_id', None)
        cell_size = Decimal(0.1)

        # Agregar dados no nível do banco de dados
        query = DeviceDataPoints.objects.all()
        if device_id:
            query = query.filter(device_id=device_id)

        # Calcular grid no banco de dados
        heatmap_data = query.annotate(
            grid_x=Floor(F('x') / cell_size, output_field=DecimalField(max_digits=10, decimal_places=2)),
            grid_y=Floor(F('y') / cell_size, output_field=DecimalField(max_digits=10, decimal_places=2))
        ).values('grid_x', 'grid_y').annotate(
            count=Count('id')
        ).values_list('grid_x', 'grid_y', 'count')

        # Converter para formato final
        total_points = sum(point[2] for point in heatmap_data)
        formatted_data = [
            [
                round(float(x * cell_size), 1),
                round(float(y * cell_size), 1),
                round((count / total_points) * 100, 5)
            ]
            for x, y, count in heatmap_data
        ]

        return Response({'xyd': formatted_data})
