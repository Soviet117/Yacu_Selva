from django.db.models import Sum, Q
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from django_filters.rest_framework import DjangoFilterBackend
from . import models,serializer

class personaView(viewsets.ModelViewSet):
    queryset = models.Persona.objects.all()
    serializer_class = serializer.personaSerializer

class salidaView(viewsets.ModelViewSet):
    queryset = models.Salida.objects.all().order_by('-fecha')

    def get_serializer_class(self):
        if self.action in ['create','update','partial_update']:
            return serializer.SalidaWriteSerializer
        return serializer.SalidaReadSerializer

class deliveristaView(viewsets.ModelViewSet):
    #queryset = models.Trabajador.objects.filter(id_tipo_trabajador__id_tipo_trabajador = 3)
    queryset = models.Trabajador.objects.all()
    serializer_class = serializer.DeliveristaSerializer

class productoView(viewsets.ModelViewSet):
    queryset = models.Producto.objects.all()
    serializer_class = serializer.ProductoSerializer
    
class retornoView(viewsets.ModelViewSet):
    queryset = models.Retorno.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id_salida'] 
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return serializer.RetornoWriteSerializer
        return serializer.RetornoReadSerializer

    def get_object(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy']:
            try:
                id_salida = self.kwargs['pk']
                return models.Retorno.objects.get(id_salida=id_salida)
            except models.Retorno.DoesNotExist:
                from rest_framework.exceptions import NotFound
                raise NotFound("No se encontró retorno para la salida con ID {}".format(id_salida))
            except ValueError:
                from rest_framework.exceptions import ValidationError
                raise ValidationError("ID de salida inválido")

        return super().get_object()
    
class RetornoViewRes(viewsets.ModelViewSet):
    queryset = models.Retorno.objects.all()
    serializer_class = serializer.RetornoReadSerializer

    @action(detail=False, methods=['get'])
    def resumen_retornos(self, request):
        hoy = timezone.now().date()
        print("Fecha de hoy:", hoy)
        
        # 👇 FILTRAR por fecha de SALIDA (no de retorno)
        retornos_hoy = models.Retorno.objects.filter(id_salida__fecha=hoy)
        
        # Cálculos
        total_hoy = retornos_hoy.aggregate(
            total=Sum('total_cancelado')  # 👈 Cambiar a 'total_cancelado' según tu diagrama
        )['total'] or 0
        
        total_repartidores = retornos_hoy.filter(
            id_salida__id_trabajador__id_tipo_trabajador=3
        ).aggregate(
            total=Sum('total_cancelado')  # 👈 Cambiar aquí también
        )['total'] or 0
        
        total_no_repartidores = retornos_hoy.exclude(
            id_salida__id_trabajador__id_tipo_trabajador=3
        ).aggregate(
            total=Sum('total_cancelado')  # 👈 Y aquí
        )['total'] or 0

        data = {
            'total_hoy': total_hoy,
            'total_repartidores': total_repartidores,
            'total_no_repartidores': total_no_repartidores
        }
        
        Nserializer = serializer.DataCaja(data)
        return Response(Nserializer.data)
    

class TrabajadorViewSet(viewsets.ModelViewSet):
    queryset = models.Trabajador.objects.select_related(
        'id_persona', 
        'id_tipo_trabajador', 
        'id_horario'
    ).all()
    
    def get_serializer_class(self):
        """Retorna el serializer apropiado según la acción"""
        if self.action == 'list':
            return serializer.TrabajadorListSerializer
        elif self.action == 'retrieve':
            return serializer.TrabajadorReadSerializer
        elif self.action == 'create':
            return serializer.TrabajadorCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return serializer.TrabajadorUpdateSerializer
        return serializer.TrabajadorReadSerializer
    
    def create(self, request, *args, **kwargs):
        """Crear trabajador con persona"""
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        trabajador = ser.save()
        
        # Retornar con el serializer de lectura
        read_serializer = serializer.TrabajadorReadSerializer(trabajador)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Actualizar trabajador y persona"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        ser = self.get_serializer(instance, data=request.data, partial=partial)
        ser.is_valid(raise_exception=True)
        trabajador = ser.save()
        
        # Retornar con el serializer de lectura
        read_serializer = serializer.TrabajadorReadSerializer(trabajador)
        return Response(read_serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Eliminar trabajador"""
        instance = self.get_object()
        persona = instance.id_persona
        
        # Eliminar trabajador
        self.perform_destroy(instance)
        
        # Opcional: Eliminar también la persona si no tiene otros registros asociados
        # if not models.Trabajador.objects.filter(id_persona=persona).exists():
        #     persona.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def por_tipo(self, request):
        """Filtrar trabajadores por tipo"""
        tipo_id = request.query_params.get('tipo_id', None)
        if tipo_id:
            trabajadores = self.queryset.filter(id_tipo_trabajador=tipo_id)
            ser = serializer.TrabajadorListSerializer(trabajadores, many=True)
            return Response(ser.data)
        return Response(
            {"error": "Debe proporcionar tipo_id como parámetro"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['get'])
    def detalle_completo(self, request, pk=None):
        """Obtener detalle completo del trabajador"""
        trabajador = self.get_object()
        ser = serializer.TrabajadorReadSerializer(trabajador)
        return Response(ser.data)
    
class TipoTrabajadorViewSet(viewsets.ModelViewSet):
    queryset = models.TipoTrabajador.objects.all()
    serializer_class = serializer.TipoTrabajadorSerializer

class HorarioViewSet(viewsets.ModelViewSet):
    queryset = models.Horario.objects.all()
    serializer_class = serializer.HorarioSerializer