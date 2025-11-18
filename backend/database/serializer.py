from rest_framework import serializers
from django.utils import timezone
from . import models


class personaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Persona
        fields = '__all__'

class SalidaReadSerializer(serializers.ModelSerializer):
    estado_pago = serializers.CharField(source='id_estado_pago.nom_estado', read_only=True)
    nom_trabajador = serializers.CharField(source='id_trabajador.id_persona.nombre_p',read_only=True)
    nom_producto = serializers.CharField(source='id_producto.nom_producto',read_only=True)
    estado_salida = serializers.CharField(source='id_estado_salida.nom_estado_salida',read_only=True)

    class Meta:
        model = models.Salida
        fields = ['id_salida','nom_trabajador','nom_producto','cantidad',
                  'multiplicar_por','total_cancelar','estado_pago', 'estado_salida','fecha','hora']

class SalidaWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Salida   
        fields = ['id_trabajador','id_producto','cantidad']
    
    def create(self, validated_data):
        now_local = timezone.localtime()

        cantidad = int(validated_data['cantidad'])
        validated_data['multiplicar_por'] = 4.0
        validated_data['total_cancelar'] = validated_data['cantidad'] * validated_data['multiplicar_por']
        validated_data['id_estado_salida'] = models.EstadoSalida.objects.get(id_estado_salida=1)
        validated_data['id_estado_pago'] = models.EstadoPago.objects.get(id_estado=2)
        validated_data['fecha'] = now_local.date()
        validated_data['hora'] = now_local.time()

        salida = super().create(validated_data)
        
        pago = models.Pago.objects.create(
            yape=0,
            efectivo=0
        )

        primer_tipo_detalle = models.TipoDetalle.objects.first()

        detalle = models.Detalle.objects.create(
            id_tipo_detalle=primer_tipo_detalle,
            descripcion=f"Detalle creado automáticamente para salida {salida.id_salida}"
        )
        
        retorno = models.Retorno.objects.create(
            id_salida=salida,
            id_pago=pago,      
            id_detalle=detalle, 
            cantidad=0,
            total_cancelado=0
        )
        
        return salida

class DeliveristaSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='id_trabajador',read_only=True)
    nombre = serializers.CharField(source='id_persona.nombre_p',read_only=True)

    class Meta:
        model = models.Trabajador
        fields = ['id','nombre']

class ProductoSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='id_producto',read_only=True)
    nombre = serializers.CharField(source='nom_producto',read_only=True)

    class Meta:
        model = models.Producto
        fields = ['id','nombre']

class RetornoReadSerializer(serializers.ModelSerializer):
    fecha = serializers.CharField(source='id_salida.fecha',read_only=True)
    hora = serializers.CharField(source='id_salida.hora',read_only=True)
    cantidad_llevada = serializers.CharField(source='id_salida.cantidad',read_only=True)
    estado_pago = serializers.CharField(source='id_salida.id_estado_pago.nom_estado',read_only=True)
    total_cancelar = serializers.CharField(source='id_salida.total_cancelar',read_only=True)
    yape = serializers.CharField(source='id_pago.yape',read_only=True)
    efectivo = serializers.CharField(source='id_pago.efectivo',read_only=True)
    responsable = serializers.CharField(source = 'id_salida.id_trabajador.id_persona.nombre_p',read_only=True)

    class Meta:
        model = models.Retorno
        fields = ['id_retorno','id_salida','fecha','hora','cantidad_llevada','cantidad','total_cancelar',
                  'total_cancelado','id_pago','yape','efectivo','estado_pago','responsable']

class RetornoWriteSerializer(serializers.ModelSerializer):
    efectivo = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        write_only=True, 
        required=False,
        allow_null=True
    )
    yape = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        write_only=True, 
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = models.Retorno
        fields = ['cantidad', 'efectivo', 'yape', 'total_cancelado']
        extra_kwargs = {
            'cantidad': {'required': False},
            'total_cancelado': {'required': False},
        }
    
    def update(self, instance, validated_data):
    
        efectivo = validated_data.pop('efectivo', None)
        yape = validated_data.pop('yape', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if instance.id_pago and (efectivo is not None or yape is not None):
            pago = instance.id_pago
            if efectivo is not None:
                pago.efectivo = efectivo
            if yape is not None:
                pago.yape = yape
            pago.save()
        
        if instance.id_salida:
            salida = instance.id_salida
            
            salida.id_estado_salida = models.EstadoSalida.objects.get(id_estado_salida=2)
            
            if 'total_cancelado' in validated_data:
                total_cancelar = float(salida.total_cancelar)
                total_cancelado = float(instance.total_cancelado)
                
                if total_cancelado == 0:
                    estado_pago_id = 2 
                elif total_cancelado < total_cancelar:
                    estado_pago_id = 3  
                else:  
                    estado_pago_id = 1  
                
                salida.id_estado_pago = models.EstadoPago.objects.get(id_estado=estado_pago_id)
            
            salida.save()
        
        return instance
    
class DataCaja(serializers.Serializer):
    total_hoy = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_repartidores = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_no_repartidores = serializers.DecimalField(max_digits=10, decimal_places=2)


class TrabajadorReadSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()
    nombre_p = serializers.CharField(source='id_persona.nombre_p', read_only=True)
    apellido_p = serializers.CharField(source='id_persona.apellido_p', read_only=True)
    dni_p = serializers.CharField(source='id_persona.dni_p', read_only=True)
    direccion = serializers.CharField(source='id_persona.direccion', read_only=True)
    url_dni = serializers.CharField(source='id_persona.url_dni', read_only=True)
    tipo_trabajador = serializers.CharField(source='id_tipo_trabajador.nom_tt', read_only=True)
    entrada = serializers.TimeField(source='id_horario.entrada', read_only=True)
    salida = serializers.TimeField(source='id_horario.salida', read_only=True)
    inicio_break = serializers.TimeField(source='id_horario.inicio_break', read_only=True)
    fin_break = serializers.TimeField(source='id_horario.fin_break', read_only=True)
    
    class Meta:
        model = models.Trabajador
        fields = [
            'id_trabajador', 'nombre_completo', 'nombre_p', 'apellido_p', 
            'dni_p', 'direccion', 'url_dni', 'tipo_trabajador', 
            'entrada', 'salida', 'inicio_break', 'fin_break', 'sueldo'
        ]
    
    def get_nombre_completo(self, obj):
        return f"{obj.id_persona.nombre_p} {obj.id_persona.apellido_p}"


class TrabajadorCreateSerializer(serializers.ModelSerializer):
    nombre_p = serializers.CharField(write_only=True)
    apellido_p = serializers.CharField(write_only=True)
    dni_p = serializers.CharField(write_only=True)
    direccion = serializers.CharField(write_only=True)
    url_dni = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = models.Trabajador
        fields = [
            'nombre_p', 'apellido_p', 'dni_p', 'direccion', 'url_dni',
            'id_tipo_trabajador', 'id_horario', 'sueldo'
        ]
    
    def create(self, validated_data):
        persona_data = {
            'nombre_p': validated_data.pop('nombre_p'),
            'apellido_p': validated_data.pop('apellido_p'),
            'dni_p': validated_data.pop('dni_p'),
            'direccion': validated_data.pop('direccion'),
            'url_dni': validated_data.pop('url_dni', ''),
        }
        
        persona = models.Persona.objects.create(**persona_data)
        
        trabajador = models.Trabajador.objects.create(
            id_persona=persona,
            **validated_data
        )
        
        return trabajador
    
    def validate_dni_p(self, value):
        """Validar que el DNI no exista"""
        if models.Persona.objects.filter(dni_p=value).exists():
            raise serializers.ValidationError("Ya existe una persona con este DNI.")
        return value

class TrabajadorUpdateSerializer(serializers.ModelSerializer):
    nombre_p = serializers.CharField(required=False)
    apellido_p = serializers.CharField(required=False)
    dni_p = serializers.CharField(required=False)
    direccion = serializers.CharField(required=False)
    url_dni = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = models.Trabajador
        fields = [
            'nombre_p', 'apellido_p', 'dni_p', 'direccion', 'url_dni',
            'id_tipo_trabajador', 'id_horario', 'sueldo'
        ]
    
    def update(self, instance, validated_data):
        persona_data = {}
        persona_fields = ['nombre_p', 'apellido_p', 'dni_p', 'direccion', 'url_dni']
        
        for field in persona_fields:
            if field in validated_data:
                persona_data[field] = validated_data.pop(field)
        
        if persona_data:
            persona = instance.id_persona
            for attr, value in persona_data.items():
                setattr(persona, attr, value)
            persona.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance
    
    def validate_dni_p(self, value):
        """Validar que el DNI no exista en otra persona"""
        persona_actual = self.instance.id_persona
        if models.Persona.objects.filter(dni_p=value).exclude(id_persona=persona_actual.id_persona).exists():
            raise serializers.ValidationError("Ya existe una persona con este DNI.")
        return value

class TrabajadorListSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()
    tipo_trabajador = serializers.CharField(source='id_tipo_trabajador.nom_tt', read_only=True)
    dni = serializers.CharField(source='id_persona.dni_p', read_only=True)
    
    class Meta:
        model = models.Trabajador
        fields = ['id_trabajador', 'nombre_completo', 'dni', 'tipo_trabajador', 'sueldo']
    
    def get_nombre_completo(self, obj):
        return f"{obj.id_persona.nombre_p} {obj.id_persona.apellido_p}"
    
class TipoTrabajadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TipoTrabajador
        fields = ['id_tipo_trabajador', 'nom_tt']

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Horario
        fields = ['id_horario', 'entrada', 'salida', 'inicio_break', 'fin_break']


class DashboardSerializer(serializers.Serializer):
   
    entregas_hoy = serializers.IntegerField()
    crecimiento_entregas = serializers.CharField()
 
    ingresos_hoy = serializers.DecimalField(max_digits=10, decimal_places=2)
    crecimiento_ingresos = serializers.CharField()
    
    total_trabajadores = serializers.IntegerField()
    trabajadores_activos = serializers.IntegerField()
    estado_trabajadores = serializers.CharField() 

class PerformanceEntregasSerializer(serializers.Serializer):
    fecha = serializers.DateField()
    entregas_programadas = serializers.IntegerField()
    entregas_completadas = serializers.IntegerField()
    retornos = serializers.IntegerField()
    eficiencia = serializers.FloatField()  # Porcentaje de efectividad
    monto_pendiente = serializers.DecimalField(max_digits=10, decimal_places=2)

class ReporteFechasSerializer(serializers.Serializer):
    fecha_inicio = serializers.DateField(required=False)
    fecha_fin = serializers.DateField(required=False)
    tipo_reporte = serializers.ChoiceField(
        choices=['diario', 'semanal', 'mensual'],
        required=True
    )

class MovimientoCajaSerializer(serializers.Serializer):
    tipo = serializers.ChoiceField(choices=['ingreso', 'egreso'])
    monto = serializers.DecimalField(max_digits=10, decimal_places=2)
    descripcion = serializers.CharField()
    metodo = serializers.ChoiceField(choices=['efectivo', 'yape', 'transferencia'])
    id_trabajador = serializers.IntegerField()  # ← AÑADIR ESTE CAMPO

# In your serializers.py
class POSSalidaSerializer(serializers.Serializer):
    id_trabajador = serializers.IntegerField()
    id_producto = serializers.IntegerField()
    cantidad = serializers.IntegerField(min_value=1)
    id_cliente = serializers.IntegerField(required=False, allow_null=True)  # Optional for POS
    metodo_pago = serializers.ChoiceField(choices=['efectivo', 'yape', 'transferencia', 'mixto'])


class SalidaVentaHibridaSerializer(serializers.ModelSerializer):
    estado_pago = serializers.CharField(source='id_estado_pago.nom_estado', read_only=True)
    nom_trabajador = serializers.CharField(source='id_trabajador.id_persona.nombre_p', read_only=True)
    nom_producto = serializers.CharField(source='id_producto.nom_producto', read_only=True)
    estado_salida = serializers.CharField(source='id_estado_salida.nom_estado_salida', read_only=True)
    tipo_operacion = serializers.SerializerMethodField()  # 'salida' o 'venta_pos'
    cliente = serializers.SerializerMethodField()
    
    class Meta:
        model = models.Salida
        fields = [
            'id_salida', 'nom_trabajador', 'nom_producto', 'cantidad',
            'multiplicar_por', 'total_cancelar', 'estado_pago', 'estado_salida',
            'fecha', 'hora', 'tipo_operacion', 'cliente'
        ]
    
    def get_tipo_operacion(self, obj):
        return 'salida'
    
    def get_cliente(self, obj):
        # Para salidas normales, no hay cliente específico
        return "Entrega"
    
class VentaPOSSerializer(serializers.ModelSerializer):
    estado_pago = serializers.CharField(source='id_estado.nom_estado', read_only=True)
    nom_trabajador = serializers.CharField(source='id_trabajador.id_persona.nombre_p', read_only=True)
    nom_producto = serializers.CharField(source='id_producto.nom_producto', read_only=True)
    estado_salida = serializers.SerializerMethodField()
    tipo_operacion = serializers.SerializerMethodField()
    cliente = serializers.CharField(source='id_cliente.nombre_cliente', read_only=True)
    multiplicar_por = serializers.DecimalField(source='precio_v', max_digits=10, decimal_places=2, read_only=True)
    total_cancelar = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = models.Venta
        fields = [
            'id_venta', 'nom_trabajador', 'nom_producto', 'cantidad',
            'multiplicar_por', 'total_cancelar', 'estado_pago', 'estado_salida',
            'fecha', 'hora', 'tipo_operacion', 'cliente'
        ]
    
    def get_tipo_operacion(self, obj):
        return 'venta_pos'
    
    def get_estado_salida(self, obj):
        return "Completada"  # Las ventas POS siempre están completadas