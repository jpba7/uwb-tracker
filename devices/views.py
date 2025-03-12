from django.utils import timezone
import io
from datetime import datetime

import matplotlib.image as mpimg
import pandas as pd
import seaborn as sns
from django.http import HttpResponse
from django.utils.dateparse import parse_date, parse_datetime
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure
from rest_framework import generics, status, viewsets
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action

from devices.models import (Device, DeviceDataPoints, DeviceType,
                            DeviceUserHistory)
from devices.serializers import DeviceDatapointSerializer
from employees.models import Employee

from .serializers import (DeviceSerializer, DeviceTypeSerializer,
                          DeviceUserHistorySerializer, BatchPositionSerializer)


#######################
## DEVICE DATAPOINTS ##
#######################

class DeviceDataPointList(ListAPIView):
    permission_classes = [IsAuthenticated]
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
                timestamp__gte=datetime(2025, 3, 8, 15, 15), timestamp__lte=datetime(2025, 3, 8, 15, 20))  # TODO MUDAR PARA HOJE

        return datapoints.order_by('timestamp')


class DeviceDataPointHeatMapSeaborn(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee_id = self.request.GET.get('employee_id')
        device_id = self.request.GET.get('device_id')
        start_date = self.request.GET.get('start_date')
        end_date = self.request.GET.get('end_date')

        start_date = parse_date(start_date) if start_date else None
        end_date = parse_date(end_date) if end_date else None

        filters = {}

        if start_date:
            filters['timestamp__gte'] = start_date
        if end_date:
            filters['timestamp__lte'] = end_date

        if employee_id:
            query = self.get_datapoints_for_employee(employee_id)
        elif device_id:
            query = self.get_datapoints_by_device_id(device_id)
        else:
            query = DeviceDataPoints.objects.all()

        query = query.filter(**filters)

        # Convertendo queryset para DataFrame
        df = pd.DataFrame.from_records(query.values('x', 'y'))

        # Verifica se o DataFrame está vazio
        if df.empty:
            return Response(
                {'message': 'Não há dados disponíveis para os parâmetros informados.'},
                status=status.HTTP_404_NOT_FOUND
            )

        heatmap_img_bytes = self.create_heatmap_image(df)

        # Retornando a imagem como resposta HTTP
        response = HttpResponse(heatmap_img_bytes, content_type='image/png')
        return response

    def get_datapoints_by_device_id(self, device_id: str):
        # Obtendo os pontos de dados do dispositivo
        device = Device.objects.get(id=device_id)
        xy_points = DeviceDataPoints.objects.filter(device=device)

        return xy_points

    def get_datapoints_for_employee(self, employee_id: str):
        # Obtendo os pontos de dados do funcionário
        employee = Employee.objects.get(id=employee_id)
        history_list = DeviceUserHistory.objects.get_all_device_history_from_employee(employee)
        xy_points = DeviceDataPoints.objects.get_xy_points_from_history_list(history_list)

        return xy_points

    def create_heatmap_image(self, data: pd.DataFrame, max_sampling: int = 10000) -> bytes:
        # Amostragem aleatória - ajuste o frac conforme necessário (ex: 0.1 = 10% dos dados)
        df_sampled = data.sample(n=min(max_sampling, len(data)), random_state=42)

        # Criando figura do matplotlib
        fig = Figure(figsize=(12, 6))
        fig.patch.set_alpha(0)
        fig.tight_layout(pad=0)

        ax = fig.add_subplot(111)
        ax.set_position((0, 0, 1, 1))
        ax.patch.set_alpha(0)

        # Carregando e exibindo a imagem de fundo
        img = mpimg.imread('frontend/dashboard/components/heatmap/planta_labair.png')  # PNG ou JPG
        ax.imshow(img, extent=(-2, 7, 0, 6))

        # Remove as bordas do gráfico
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['bottom'].set_visible(False)
        ax.spines['left'].set_visible(False)

        # Gerando o heatmap com parâmetros otimizados
        sns.kdeplot(
            data=df_sampled,
            x='x',
            y='y',
            fill=True,
            thresh=0.001,
            levels=100,
            bw_adjust=0.5,
            gridsize=100,
            cmap='Spectral_r',
            alpha=0.6,
            ax=ax
        )

        # Configurando os limites do plot para combinar com a imagem
        ax.set_xlim(0, 200)
        ax.set_ylim(0, 100)

        # Salvando a figura em um buffer
        buf = io.BytesIO()
        canvas = FigureCanvasAgg(fig)
        canvas.print_png(buf)

        return buf.getvalue()


class DeviceDataPointAnimation(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee_id = self.request.GET.get('id')
        start_date = self.request.GET.get('start_date')
        end_date = self.request.GET.get('end_date')
        device_id = self.request.GET.get('device_id')

        start_date = parse_date(start_date) if start_date else None
        end_date = parse_date(end_date) if end_date else None

        filters = {}

        if start_date:
            filters['timestamp__gte'] = start_date
        if end_date:
            filters['timestamp__lte'] = end_date

        if employee_id:
            query = self.get_datapoints_for_employee(employee_id)
        elif device_id:
            query = self.get_datapoints_by_device_id(int(device_id))
        else:
            query = DeviceDataPoints.objects.all()

        query = query.filter(**filters)

        # Convertendo queryset para lista de dados
        data_points = list(query.values('x', 'y', 'timestamp').order_by('timestamp'))

        return Response(data_points)

    def get_datapoints_by_device_id(self, device_id: int):
        device = Device.objects.get(id=device_id)
        return DeviceDataPoints.objects.filter(device=device)

    def get_datapoints_for_employee(self, employee_id: str):
        employee = Employee.objects.get(id=employee_id)
        history_list = DeviceUserHistory.objects.get_all_device_history_from_employee(employee)
        return DeviceDataPoints.objects.get_xy_points_from_history_list(history_list)


class DeviceLastPosition(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee_id = self.request.GET.get('id')
        device_id = self.request.GET.get('device_id')

        if employee_id:
            query = self.get_last_position_for_employee(employee_id)
        elif device_id:
            query = self.get_last_position_by_device_id(int(device_id))
        else:
            return Response({'error': 'employee_id ou device_id é obrigatório'},
                            status=status.HTTP_400_BAD_REQUEST)

        if not query.exists():
            return Response({'error': 'Nenhuma posição encontrada'},
                            status=status.HTTP_404_NOT_FOUND)

        # Convertendo queryset para dados
        data_point = query.values('x', 'y', 'timestamp').first()

        return Response(data_point)

    def get_last_position_by_device_id(self, device_id: int):
        device = Device.objects.get(id=device_id)
        return DeviceDataPoints.objects.filter(device=device).order_by('-timestamp')

    def get_last_position_for_employee(self, employee_id: str):
        employee = Employee.objects.get(id=employee_id)
        # Primeiro, precisamos descobrir qual dispositivo está atualmente associado ao funcionário
        current_device = DeviceUserHistory.objects.filter(
            employee_id=employee_id,
            is_active=True
        ).order_by('-start_date').first()

        if current_device:
            # Se encontramos um dispositivo ativo, retornamos a última posição desse dispositivo
            return DeviceDataPoints.objects.filter(
                device=current_device.device
            ).order_by('-timestamp')
        else:
            # Se não encontramos um dispositivo ativo, tentamos buscar o último dispositivo usado
            last_device = DeviceUserHistory.objects.filter(
                employee_id=employee_id
            ).order_by('-end_date').first()

            if last_device:
                return DeviceDataPoints.objects.filter(
                    device=last_device.device
                ).order_by('-timestamp')

            return DeviceDataPoints.objects.none()


#############
## DEVICES ##
#############

class DevicesList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DeviceSerializer
    queryset = Device.objects.all().order_by('id')


class DeviceCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]
    queryset = Device.objects.all()
    lookup_field = 'id'


##################
## DEVICE TYPES ##
##################

class DeviceTypeList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DeviceTypeSerializer
    queryset = DeviceType.objects.all().order_by('name')


#########################
## DEVICE USER HISTORY ##
#########################


class DeviceUserHistoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint para visualização e edição de organizações.
    Compatível com o padrão de UI Material para grids e formulários.
    """
    serializer_class = DeviceUserHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DeviceUserHistory.objects.all().order_by('id')

    @action(detail=False, methods=['get'], url_path='employee/(?P<employee_id>\\d+)')
    def by_employee(self, request, employee_id=None):
        histories = self.get_queryset().filter(employee_id=employee_id).order_by('-start_date')
        serializer = self.get_serializer(histories, many=True)
        return Response(serializer.data)

    # TODO Fazer método de update e create com regras para não sobrepor datas de mesma tag

    def perform_update(self, serializer):
        start_date = self.request.data.get('start_date')
        end_date = self.request.data.get('end_date')

        data = {
            'device_id': self.request.data.get('device'),
            'employee_id': self.request.data.get('employee'),
            'is_active': self.request.data.get('is_active'),
        }

        if start_date:
            naive_dt = parse_datetime(f"{start_date} 00:00:00")
            data['start_date'] = timezone.make_aware(naive_dt)
        if end_date:
            naive_dt = parse_datetime(f"{end_date} 00:00:00")
            data['end_date'] = timezone.make_aware(naive_dt)

        serializer.save(**data)


class BatchPositionCreate(generics.CreateAPIView):
    serializer_class = BatchPositionSerializer
    permission_classes = [AllowAny]  # TODO REMOVER E BOTAR BEARER TOKEN

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            result = serializer.save()
            return Response({
                'message': 'Positions created successfullpy',
                'created': result['created']
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
