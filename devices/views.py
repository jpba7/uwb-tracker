import io
from datetime import datetime, timedelta

import matplotlib.image as mpimg
import pandas as pd
import numpy as np
import seaborn as sns
from django.db.models import Q
from django.http import HttpResponse
from django.utils import timezone
from django.utils.dateparse import parse_date, parse_datetime
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from devices.models import (Device, DeviceDataPoints, DeviceType,
                            DeviceUserHistory)
from devices.serializers import DeviceDatapointSerializer
from employees.models import Employee

from .serializers import (BatchPositionSerializer, DeviceSerializer,
                          DeviceTypeSerializer, DeviceUserHistorySerializer)

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
            today = timezone.now()
            tomorrow = today + timedelta(days=1)
            datapoints = DeviceDataPoints.objects.filter(
                timestamp__gte=today, timestamp__lte=tomorrow)

        return datapoints.order_by('timestamp')


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
        # Amostragem aleatória
        df_sampled = data.sample(n=min(max_sampling, len(data)), random_state=42)

        # Dimensões em polegadas para 755x576 pixels em 100 DPI
        width_inches = 7.55
        height_inches = 5.76

        # Criando figura com dimensões específicas
        fig = Figure(figsize=(width_inches, height_inches))
        fig.patch.set_alpha(0)

        # Criando subplot sem margens
        ax = fig.add_subplot(111)
        ax.set_position([0, 0, 1, 1])
        ax.patch.set_alpha(0)

        # Carregando e exibindo a imagem de fundo
        img = mpimg.imread('frontend/static-local/images/planta_labair.png')
        ax.imshow(img, extent=(-2.8, 6, -0.1, 6.4), aspect='auto')

        # Remove bordas
        for spine in ax.spines.values():
            spine.set_visible(False)

        # Remove ticks e labels
        ax.set_xticks([])
        ax.set_yticks([])

        try:
            # Gerando o heatmap com níveis explícitos e crescentes
            sns.kdeplot(
                data=df_sampled,
                x='x',
                y='y',
                fill=True,
                thresh=0.008,
                levels=50,  # Níveis crescentes de 0 a 1
                bw_adjust=0.18,
                gridsize=200,
                cmap='Spectral_r',
                alpha=0.6,
                ax=ax
            )
        except ValueError:
            # Fallback para um heatmap mais simples se houver erro
            sns.kdeplot(
                data=df_sampled,
                x='x',
                y='y',
                fill=True,
                bw_adjust=0.15,
                cmap='Spectral_r',
                alpha=0.6,
                ax=ax
            )

        # Configurando limites
        ax.set_xlim(-2.8, 6)
        ax.set_ylim(-0.1, 6.4)

        # Removendo margens
        fig.subplots_adjust(left=0, right=1, bottom=0, top=1)

        # Salvando a figura
        buf = io.BytesIO()
        canvas = FigureCanvasAgg(fig)

        # Usando savefig ao invés de print_png para controlar o DPI
        fig.savefig(
            buf,
            format='png',
            dpi=100,
            bbox_inches='tight',
            pad_inches=0,
            transparent=True
        )

        buf.seek(0)
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


class DeviceLastPositionToday(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Pega o timestamp de 30 minutos atrás
        thirty_mins_ago = timezone.now() - timedelta(minutes=30)

        # Pega todos os devices que têm datapoints nos últimos 30 minutos
        devices_with_data = Device.objects.filter(
            devicedatapoints__timestamp__gte=thirty_mins_ago
        ).distinct()

        all_positions = []
        for device in devices_with_data:
            last_position = DeviceDataPoints.objects.filter(
                device=device,
                timestamp__gte=thirty_mins_ago
            ).order_by('-timestamp').first()
            last_position.timestamp = last_position.timestamp.astimezone(timezone.get_current_timezone())

            if last_position:
                all_positions.append({
                    'device_id': device.id,
                    'device_name': device.name,
                    'linked_employee': str(device.linked_employee),
                    'x': last_position.x,
                    'y': last_position.y,
                    'timestamp': last_position.timestamp.strftime('%H:%M:%S %d/%m/%Y')
                })

        return Response(all_positions)


#############
## DEVICES ##
#############

class DeviceViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar dispositivos.
    Fornece endpoints para CRUD e ações adicionais.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = DeviceSerializer
    queryset = Device.objects.all().order_by('id')
    lookup_field = 'id'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                'id': serializer.instance.id,
                'message': 'Device created successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, id=None):
        device = self.get_object()
        device.is_active = not device.is_active
        device.save()

        if not device.is_active:
            # Se estiver desativando, desativa também o histórico ativo
            DeviceUserHistory.objects.filter(
                device=device,
                is_active=True
            ).update(
                is_active=False,
                end_date=timezone.now()
            )

        return Response({
            'id': device.id,
            'is_active': device.is_active,
            'message': f'Dispositivo {"ativado" if device.is_active else "desativado"} com sucesso'
        })

    @action(detail=False, methods=['get'])
    def tag_count(self, request):
        count = self.get_queryset().filter(device_type__name='TAG').count()
        return Response({'count': count})

    @action(detail=False, methods=['get'])
    def active_history(self, request):
        end_date = timezone.now()
        start_date = end_date - timedelta(days=31)

        daily_counts = []

        for day in range(31):  # 0 a 30 dias
            current_date = start_date + timedelta(days=day)
            next_date = current_date + timedelta(days=1)

            # Conta tags criadas até aquela data
            count = self.get_queryset().filter(
                device_type__name='Tag',
                creation_date__lte=next_date
            ).count()

            daily_counts.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'active_tags': count
            })

        return Response(daily_counts)


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

    @action(detail=False, methods=['get'], url_path='active-history')
    def active_history(self, request):
        end_date = timezone.now()
        start_date = end_date - timedelta(days=31)

        daily_counts = []

        for day in range(31):  # 0 a 30 dias
            current_date = start_date + timedelta(days=day)

            # Conta usuários ativos naquele dia
            count = self.get_queryset().filter(start_date__lte=current_date).filter(
                Q(end_date__isnull=True) | Q(end_date__gte=current_date)).count()

            daily_counts.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'active_users': count
            })

        return Response(daily_counts)

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
