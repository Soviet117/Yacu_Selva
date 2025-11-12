from django.db.models import Sum, Q
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
from django_filters.rest_framework import DjangoFilterBackend
from . import models,serializer
from django.http import HttpResponse
from decimal import Decimal    

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
        
        retornos_hoy = models.Retorno.objects.filter(id_salida__fecha=hoy)

        total_hoy = retornos_hoy.aggregate(
            total=Sum('total_cancelado')  
        )['total'] or 0
        
        total_repartidores = retornos_hoy.filter(
            id_salida__id_trabajador__id_tipo_trabajador=3
        ).aggregate(
            total=Sum('total_cancelado')  
        )['total'] or 0
        
        total_no_repartidores = retornos_hoy.exclude(
            id_salida__id_trabajador__id_tipo_trabajador=3
        ).aggregate(
            total=Sum('total_cancelado') 
        )['total'] or 0

        data = {
            'total_hoy': total_hoy,
            'total_repartidores': total_repartidores,
            'total_no_repartidores': total_no_repartidores
        }
        
        Nserializer = serializer.DataCaja(data)
        return Response(Nserializer.data)
    
    @action(detail=False, methods=['get'])
    def resumen_caja_completo(self, request):
        hoy = timezone.now().date()
        
        retornos_hoy = models.Retorno.objects.filter(id_salida__fecha=hoy)
        
        total_hoy = retornos_hoy.aggregate(
            total=Sum('total_cancelado')
        )['total'] or 0
        
        total_repartidores = retornos_hoy.filter(
            id_salida__id_trabajador__id_tipo_trabajador=3
        ).aggregate(
            total=Sum('total_cancelado')
        )['total'] or 0
        
        total_no_repartidores = retornos_hoy.exclude(
            id_salida__id_trabajador__id_tipo_trabajador=3
        ).aggregate(
            total=Sum('total_cancelado')
        )['total'] or 0

        total_egresos = models.CajaIe.objects.filter(
            tipo="egreso",  
        ).aggregate(
            total=Sum('nonto')
        )['total'] or 0

        data = {
            'total_hoy': float(total_hoy),
            'total_repartidores': float(total_repartidores),
            'total_no_repartidores': float(total_no_repartidores),
            'total_egresos': float(total_egresos),
            'balance_neto': float(total_hoy - total_egresos)
        }
        
        return Response(data)
    

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

        read_serializer = serializer.TrabajadorReadSerializer(trabajador)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Actualizar trabajador y persona"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        ser = self.get_serializer(instance, data=request.data, partial=partial)
        ser.is_valid(raise_exception=True)
        trabajador = ser.save()

        read_serializer = serializer.TrabajadorReadSerializer(trabajador)
        return Response(read_serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """Eliminar trabajador"""
        instance = self.get_object()
        persona = instance.id_persona

        self.perform_destroy(instance)
        
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

class DashboardViewSet(viewsets.ViewSet):
    
    def list(self, request):
        return self.estadisticas_principales(request)
    
    @action(detail=False, methods=['get'])
    def estadisticas_principales(self, request):
        hoy = timezone.now().date()
        ayer = hoy - timezone.timedelta(days=1)

        entregas_hoy = models.Salida.objects.filter(fecha=hoy).count()
        entregas_ayer = models.Salida.objects.filter(fecha=ayer).count()
        crecimiento_entregas = self._calcular_crecimiento(entregas_hoy, entregas_ayer)

        ingresos_hoy = models.Venta.objects.filter(fecha=hoy).aggregate(
            total=Sum('total_cancelado')
        )['total'] or 0
        
        ingresos_ayer = models.Venta.objects.filter(fecha=ayer).aggregate(
            total=Sum('total_cancelado')
        )['total'] or 0
        crecimiento_ingresos = self._calcular_crecimiento(ingresos_hoy, ingresos_ayer)

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
            entregas_programadas = models.Salida.objects.filter(fecha=fecha).count()

            entregas_completadas = models.Salida.objects.filter(
                fecha=fecha,
                id_estado_salida=2  
            ).count()

            retornos = models.Retorno.objects.filter(
                id_salida__fecha=fecha
            ).aggregate(
                total_retornos=Sum('cantidad')
            )['total_retornos'] or 0
 
            monto_pendiente = models.Salida.objects.filter(
                fecha=fecha,
                id_estado_pago__in=[2, 3]
            ).aggregate(
                total=Sum('total_cancelar')
            )['total'] or 0

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

        performance_serializer = serializer.PerformanceEntregasSerializer(datos_performance, many=True)
        return Response(performance_serializer.data)

class ReportesViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['post'])
    def generar_reporte(self, request):
        try:
            print("🎯 INICIANDO GENERACIÓN DE REPORTE...")
            
            from . import serializer as app_serializer
            reporte_serializer = app_serializer.ReporteFechasSerializer(data=request.data)
            
            if not reporte_serializer.is_valid():
                print("❌ Error de validación:", reporte_serializer.errors)
                return Response(reporte_serializer.errors, status=400)
            
            data = reporte_serializer.validated_data
            tipo_reporte = data.get('tipo_reporte')
            print(f"📊 Tipo de reporte recibido: {tipo_reporte}")

            from openpyxl import Workbook
            
            wb = Workbook()
            ws = wb.active
            ws.title = "Reporte YacuSelva"

            ws['A1'] = "REPORTE YACU SELVA"
            ws['A2'] = f"Tipo: {tipo_reporte.upper()}"
            ws['A3'] = f"Fecha: {timezone.now().date()}"
            ws['A5'] = "Métricas:"
            ws['A6'] = "Total Ventas Hoy"
            ws['B6'] = models.Venta.objects.filter(fecha=timezone.now().date()).count()
            ws['A7'] = "Total Entregas Hoy" 
            ws['B7'] = models.Salida.objects.filter(fecha=timezone.now().date()).count()
            ws['A8'] = "Trabajadores Activos"
            ws['B8'] = models.User.objects.filter(estado=True).count()

            response = HttpResponse(
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = f'attachment; filename="reporte_{tipo_reporte}.xlsx"'
            
            wb.save(response)
            print("✅ REPORTE GENERADO EXITOSAMENTE!")
            return response
            
        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
            import traceback
            print(f"❌ TRACEBACK: {traceback.format_exc()}")
            return Response(
                {"error": f"Error interno: {str(e)}"}, 
                status=500
            )

class MovimientoCajaViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['post'])
    def registrar_movimiento(self, request):
        try:
            from . import serializer as app_serializer
            
            movimiento_serializer = app_serializer.MovimientoCajaSerializer(data=request.data)
            if not movimiento_serializer.is_valid():
                return Response(movimiento_serializer.errors, status=400)
            
            data = movimiento_serializer.validated_data
            
            trabajador_default = models.Trabajador.objects.first()
            if not trabajador_default:
                return Response({"error": "No hay trabajadores registrados"}, status=400)
            
            movimiento = models.CajaIe.objects.create(
                tipo=data['tipo'],
                nonto=Decimal(str(data['monto'])),
                descripcion=data['descripcion'],
                id_trabajador=trabajador_default
            )
            
            return Response({
                "message": "Movimiento registrado exitosamente",
                "id": movimiento.id_caja_ie,
                "tipo": movimiento.tipo,
                "monto": float(movimiento.nonto),
                "descripcion": movimiento.descripcion
            }, status=201)
            
        except Exception as e:
            print(f"Error registrando movimiento: {str(e)}")
            return Response({"error": str(e)}, status=500)
    
    @action(detail=False, methods=['get'])
    def obtener_movimientos(self, request):
        try:
            movimientos = models.CajaIe.objects.all().select_related('id_trabajador').order_by('-id_caja_ie')[:50]
            
            datos = []
            for mov in movimientos:
                datos.append({
                    'id': mov.id_caja_ie,
                    'fecha': timezone.now().date(),
                    'tipo': mov.tipo,
                    'monto': float(mov.nonto),
                    'descripcion': mov.descripcion,
                    'metodo': 'efectivo',
                    'responsable': mov.id_trabajador.id_persona.nombre_p if mov.id_trabajador else 'N/A'
                })
            
            return Response(datos)
            
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
    @action(detail=False, methods=['get'])
    def movimientos_caja_completos(self, request):
        try:
   
            fecha_inicio = request.GET.get('fechaInicio')
            fecha_fin = request.GET.get('fechaFin')
            tipo = request.GET.get('tipo', 'todos')
            metodo = request.GET.get('metodo', 'todos')
            
            movimientos = []

            retornos = models.Retorno.objects.all()

            if fecha_inicio:
                retornos = retornos.filter(id_salida__fecha__gte=fecha_inicio)
            if fecha_fin:
                retornos = retornos.filter(id_salida__fecha__lte=fecha_fin)
                
            for retorno in retornos:
                movimientos.append({
                    'id': f"R_{retorno.id_retorno}",
                    'fecha': retorno.id_salida.fecha,
                    'hora': retorno.id_salida.hora,
                    'monto': float(retorno.total_cancelado),
                    'tipo': 'ingreso',
                    'metodo': self._determinar_metodo_pago(retorno.id_pago),
                    'descripcion': f"Venta - {retorno.id_salida.id_producto.nom_producto}",
                    'responsable': retorno.id_salida.id_trabajador.id_persona.nombre_p,
                    'origen': 'venta'
                })

            egresos = models.CajaIe.objects.all()

            if tipo == 'ingreso':
                egresos = egresos.none() 
            
            for egreso in egresos:
                movimientos.append({
                    'id': f"E_{egreso.id_caja_ie}",
                    'fecha': timezone.now().date(),
                    'hora': timezone.now().time(),
                    'monto': float(egreso.nonto),
                    'tipo': egreso.tipo, 
                    'metodo': 'efectivo',
                    'descripcion': egreso.descripcion or "Movimiento de caja",
                    'responsable': egreso.id_trabajador.id_persona.nombre_p if egreso.id_trabajador else 'Sistema',
                    'origen': 'caja_manual'
                })
            
            movimientos.sort(key=lambda x: (x['fecha'], x['hora']), reverse=True)

            if tipo in ['ingreso', 'egreso']:
                movimientos = [m for m in movimientos if m['tipo'] == tipo]

            if metodo != 'todos':
                movimientos = [m for m in movimientos if m['metodo'] == metodo]
            
            return Response(movimientos[:100])
            
        except Exception as e:
            print(f"Error obteniendo movimientos: {str(e)}")
            return Response({"error": str(e)}, status=500)

    def _determinar_metodo_pago(self, pago):
        """Determina el método de pago basado en los montos"""
        if pago.yape > 0 and pago.efectivo > 0:
            return 'mixto'
        elif pago.yape > 0:
            return 'yape'
        else:
            return 'efectivo'