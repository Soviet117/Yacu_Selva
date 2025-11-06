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
    
class DashboardViewSet(viewsets.ViewSet):
    
    def list(self, request):
        return self.estadisticas_principales(request)
    
    @action(detail=False, methods=['get'])
    def estadisticas_principales(self, request):
        hoy = timezone.now().date()
        ayer = hoy - timezone.timedelta(days=1)
        
        # 1. ENTREGAS HOY
        entregas_hoy = models.Salida.objects.filter(fecha=hoy).count()
        entregas_ayer = models.Salida.objects.filter(fecha=ayer).count()
        crecimiento_entregas = self._calcular_crecimiento(entregas_hoy, entregas_ayer)
        
        # 2. INGRESOS HOY
        ingresos_hoy = models.Venta.objects.filter(fecha=hoy).aggregate(
            total=Sum('total_cancelado')
        )['total'] or 0
        
        ingresos_ayer = models.Venta.objects.filter(fecha=ayer).aggregate(
            total=Sum('total_cancelado')
        )['total'] or 0
        crecimiento_ingresos = self._calcular_crecimiento(ingresos_hoy, ingresos_ayer)
        
        # 3. TRABAJADORES
        total_trabajadores = models.Trabajador.objects.count()
        trabajadores_activos = models.User.objects.filter(estado=True).count()
        estado_trabajadores = "Todos activos" if trabajadores_activos == total_trabajadores else f"{trabajadores_activos} activos"
        
        data = {
            'entregas_hoy': entregas_hoy,
            'crecimiento_entregas': crecimiento_entregas,
            'ingresos_hoy': ingresos_hoy,
            'crecimiento_ingresos': crecimiento_ingresos,
            'total_trabajadores': total_trabajadores,
            'trabajadores_activos': trabajadores_activos,
            'estado_trabajadores': estado_trabajadores
        }
        
        # ✅ CORREGIR: Usar serializer.DashboardSerializer (con import correcto)
        dashboard_serializer = serializer.DashboardSerializer(data)
        return Response(dashboard_serializer.data)
    
    def _calcular_crecimiento(self, valor_hoy, valor_ayer):
        if valor_ayer == 0:
            return "+100%" if valor_hoy > 0 else "0%"
        
        crecimiento = ((valor_hoy - valor_ayer) / valor_ayer) * 100
        signo = "+" if crecimiento > 0 else ""
        return f"{signo}{crecimiento:.0f}%"
    
    @action(detail=False, methods=['get'])
    def performance_entregas(self, request):
        from datetime import timedelta
        
        hoy = timezone.now().date()
        ultimos_7_dias = [hoy - timedelta(days=i) for i in range(6, -1, -1)]
        
        datos_performance = []
        
        for fecha in ultimos_7_dias:
            # ENTREGAS PROGRAMADAS (Total de salidas del día)
            entregas_programadas = models.Salida.objects.filter(fecha=fecha).count()
            
            # ENTREGAS COMPLETADAS (Salidas con estado = completado)
            entregas_completadas = models.Salida.objects.filter(
                fecha=fecha,
                id_estado_salida=2  # Asumiendo que 2 = Completado
            ).count()
            
            # RETORNOS (Productos que volvieron)
            retornos = models.Retorno.objects.filter(
                id_salida__fecha=fecha
            ).aggregate(
                total_retornos=Sum('cantidad')
            )['total_retornos'] or 0
            
            # MONTO PENDIENTE DE COBRAR
            monto_pendiente = models.Salida.objects.filter(
                fecha=fecha,
                id_estado_pago__in=[2, 3]  # Pendiente o Parcial
            ).aggregate(
                total=Sum('total_cancelar')
            )['total'] or 0
            
            # CÁLCULO DE EFICIENCIA
            eficiencia = 0
            if entregas_programadas > 0:
                eficiencia = (entregas_completadas / entregas_programadas) * 100
            
            datos_performance.append({
                'fecha': fecha,
                'entregas_programadas': entregas_programadas,
                'entregas_completadas': entregas_completadas,
                'retornos': retornos,
                'eficiencia': round(eficiencia, 1),
                'monto_pendiente': float(monto_pendiente)
            })
        
        # ✅ SOLO CAMBIA ESTAS 2 LÍNEAS:
        performance_serializer = serializer.PerformanceEntregasSerializer(datos_performance, many=True)
        return Response(performance_serializer.data)