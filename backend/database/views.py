from django.db.models import Sum, Q
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets
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