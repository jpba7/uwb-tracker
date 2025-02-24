import io
from datetime import datetime
from decimal import Decimal

import pandas as pd
import seaborn as sns
from django.db.models import Count, DecimalField, F
from django.db.models.functions import Floor
from django.http import HttpResponse
from django.utils.dateparse import parse_date
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure
from rest_framework import generics, status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from devices.models import Device, DeviceDataPoints, DeviceType
from devices.serializers import DeviceDatapointSerializer

from .serializers import DeviceSerializer, DeviceTypeSerializer


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


class DeviceDataPointHeatMapSeaborn(APIView):
    permission_classes = [AllowAny]  # TODO REMOVER

    def get(self, request):
        cpf = self.request.GET.get('cpf')
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

        # Convertendo queryset para DataFrame
        df = pd.DataFrame.from_records(query.values('x', 'y'))

        # Amostragem aleatória - ajuste o frac conforme necessário (ex: 0.1 = 10% dos dados)
        df_sampled = df.sample(n=min(10000, len(df)), random_state=42)

        # Criando figura do matplotlib
        fig = Figure(figsize=(10, 8))
        ax = fig.add_subplot(111)

        # Gerando o heatmap com parâmetros otimizados
        sns.kdeplot(
            data=df_sampled,
            x='x',
            y='y',
            fill=True,
            thresh=0,
            levels=50,  # Reduzindo número de níveis
            bw_adjust=1.5,  # Aumentando a largura de banda
            gridsize=100,  # Reduzindo a resolução do grid
            cmap='viridis',
            ax=ax
        )

        # Salvando a figura em um buffer
        buf = io.BytesIO()
        canvas = FigureCanvasAgg(fig)
        canvas.print_png(buf)

        # Retornando a imagem como resposta HTTP
        response = HttpResponse(buf.getvalue(), content_type='image/png')
        return response


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


class DevicesList(generics.ListAPIView):
    permission_classes = [AllowAny]  # TODO REMOVER
    serializer_class = DeviceSerializer
    queryset = Device.objects.all().order_by('id')


class DeviceCreate(generics.CreateAPIView):
    permission_classes = [AllowAny]  # TODO REMOVER
    serializer_class = DeviceSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                'id': serializer.instance.id,
                'message': 'Device created successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeviceUpdate(generics.UpdateAPIView):
    permission_classes = [AllowAny]  # TODO REMOVER
    serializer_class = DeviceSerializer
    queryset = Device.objects.all()
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response({
                'id': serializer.instance.id,
                'message': 'Device updated successfully'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeviceDelete(generics.DestroyAPIView):
    permission_classes = [AllowAny]  # TODO REMOVER
    queryset = Device.objects.all()
    lookup_field = 'id'


class DeviceTypeList(generics.ListAPIView):
    permission_classes = [AllowAny]  # TODO REMOVER
    serializer_class = DeviceTypeSerializer
    queryset = DeviceType.objects.all().order_by('name')
