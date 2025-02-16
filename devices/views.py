from datetime import datetime
from decimal import Decimal

from django.db.models import Count, DecimalField, F
from django.db.models.functions import Floor
from django.utils.dateparse import parse_date
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from devices.models import Device, DeviceDataPoints
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
        cpf = self.request.GET.get('cpf', None)
        start_date = self.request.GET.get('start_date')
        end_date = self.request.GET.get('end_date')

        start_date = parse_date(start_date) if start_date else None
        end_date = parse_date(end_date) if end_date else None

        filters = {}

        if start_date:
            filters['timestamp__gte'] = start_date
        if end_date:
            filters['timestamp__lte'] = end_date

        if cpf:
            device = Device.objects.get(linked_employee__cpf=cpf, device_type__name='Tag')
            filters['device'] = device

        query = DeviceDataPoints.objects.filter(**filters)

        formatted_data = self.to_heatmap(query)
        return Response({'xyd': formatted_data})

    def to_heatmap(self, instance):
        query = instance
        # Calcular grid no banco de dados
        cell_size = Decimal(0.1)
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

        return formatted_data
