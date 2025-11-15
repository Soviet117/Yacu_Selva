# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class CajaIe(models.Model):
    id_caja_ie = models.AutoField(primary_key=True)
    tipo = models.CharField()
    # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    nonto = models.DecimalField(max_digits=10, decimal_places=5)
    descripcion = models.CharField(blank=True, null=True)
    url_boelta = models.CharField(blank=True, null=True)
    id_trabajador = models.ForeignKey(
        'Trabajador', models.DO_NOTHING, db_column='id_trabajador')
    fecha = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'caja_ie'


class Cliente(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    id_tipo_cliente = models.ForeignKey(
        'TipoCliente', models.DO_NOTHING, db_column='id_tipo_cliente')
    nombre_cliente = models.CharField()
    direccion = models.CharField()
    latitud = models.CharField(blank=True, null=True)
    longitud = models.CharField(blank=True, null=True)
    numero = models.CharField()
    frecuencia = models.CharField()
    referencia = models.CharField()
    sector_lugar = models.CharField()

    class Meta:
        managed = False
        db_table = 'cliente'


class Detalle(models.Model):
    id_detalle = models.AutoField(primary_key=True)
    id_tipo_detalle = models.ForeignKey(
        'TipoDetalle', models.DO_NOTHING, db_column='id_tipo_detalle')
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'detalle'


class EstadoPago(models.Model):
    id_estado = models.AutoField(primary_key=True)
    nom_estado = models.CharField()

    class Meta:
        managed = False
        db_table = 'estado_pago'


class Horario(models.Model):
    id_horario = models.AutoField(primary_key=True)
    entrada = models.TimeField()
    salida = models.TimeField()
    inicio_break = models.TimeField(blank=True, null=True)
    fin_break = models.TimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'horario'


class Inventario(models.Model):
    id_inventario = models.AutoField(primary_key=True)
    id_producto = models.ForeignKey(
        'Producto', models.DO_NOTHING, db_column='id_producto')
    operativos = models.IntegerField()
    necesitan_reparacion = models.IntegerField()
    rotos = models.IntegerField()
    total = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'inventario'


class Modulo(models.Model):
    id_modulo = models.AutoField(primary_key=True)
    nom_modulo = models.CharField()

    class Meta:
        managed = False
        db_table = 'modulo'


class Pago(models.Model):
    id_pago = models.AutoField(primary_key=True)
    yape = models.IntegerField()
    efectivo = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'pago'


class Persona(models.Model):
    id_persona = models.AutoField(primary_key=True)
    nombre_p = models.CharField()
    apellido_p = models.CharField()
    dni_p = models.CharField()
    direccion = models.CharField()
    url_dni = models.CharField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'persona'


class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nom_producto = models.CharField()
    id_tipo_producto = models.ForeignKey(
        'TipoProducto', models.DO_NOTHING, db_column='id_tipo_producto')

    class Meta:
        managed = False
        db_table = 'producto'


class Retorno(models.Model):
    id_retorno = models.AutoField(primary_key=True)
    id_salida = models.ForeignKey(
        'Salida', models.DO_NOTHING, db_column='id_salida')
    cantidad = models.IntegerField()
    id_pago = models.ForeignKey(Pago, models.DO_NOTHING, db_column='id_pago')
    # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    total_cancelado = models.DecimalField(max_digits=10, decimal_places=5)
    id_detalle = models.ForeignKey(
        Detalle, models.DO_NOTHING, db_column='id_detalle')

    class Meta:
        managed = False
        db_table = 'retorno'

class EstadoSalida(models.Model):
    id_estado_salida = models.AutoField(primary_key=True)
    nom_estado_salida = models.CharField()

    class Meta:
        managed = True
        db_table = 'estado_salida'  

class Salida(models.Model):
    id_salida = models.AutoField(primary_key=True)
    id_trabajador = models.ForeignKey(
        'Trabajador', models.DO_NOTHING, db_column='id_trabajador')
    id_producto = models.ForeignKey(
        Producto, models.DO_NOTHING, db_column='id_producto')
    cantidad = models.IntegerField()
    # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    multiplicar_por = models.DecimalField(max_digits=10, decimal_places=5)
    # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    total_cancelar = models.DecimalField(max_digits=10, decimal_places=5)
    id_estado_salida = models.ForeignKey(
        EstadoSalida, models.DO_NOTHING, db_column='id_estado_salida')
    id_estado_pago = models.ForeignKey(
        EstadoPago, models.DO_NOTHING, db_column='id_estado_pago')
    fecha = models.DateField()
    hora = models.TimeField()

    class Meta:
        managed = True
        db_table = 'salida'


class TipoCliente(models.Model):
    id_tipo_cliente = models.AutoField(primary_key=True)
    nom_tipo_cliente = models.CharField()

    class Meta:
        managed = False
        db_table = 'tipo_cliente'


class TipoDetalle(models.Model):
    id_tipo_detalle = models.AutoField(primary_key=True)
    nom_detalle = models.CharField()

    class Meta:
        managed = False
        db_table = 'tipo_detalle'


class TipoProducto(models.Model):
    id_tipo_producto = models.AutoField(primary_key=True)
    nom_tipo_p = models.CharField()
    unidad_medida = models.CharField()
    # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    contenido = models.DecimalField(max_digits=10, decimal_places=5)

    class Meta:
        managed = False
        db_table = 'tipo_producto'


class TipoTrabajador(models.Model):
    id_tipo_trabajador = models.AutoField(primary_key=True)
    nom_tt = models.CharField()

    class Meta:
        managed = False
        db_table = 'tipo_trabajador'


class TipoUserModulo(models.Model):
    id_tipo_user_modulo = models.AutoField(primary_key=True)
    id_tipo_user = models.ForeignKey(
        'TipoUsuario', models.DO_NOTHING, db_column='id_tipo_user')
    id_modulo = models.ForeignKey(
        Modulo, models.DO_NOTHING, db_column='id_modulo')

    class Meta:
        managed = False
        db_table = 'tipo_user_modulo'


class TipoUsuario(models.Model):
    id_tipo_user = models.AutoField(primary_key=True)
    nom_user = models.CharField()

    class Meta:
        managed = False
        db_table = 'tipo_usuario'


class Trabajador(models.Model):
    id_trabajador = models.AutoField(primary_key=True)
    id_persona = models.ForeignKey(
        Persona, models.DO_NOTHING, db_column='id_persona')
    id_tipo_trabajador = models.ForeignKey(
        TipoTrabajador, models.DO_NOTHING, db_column='id_tipo_trabajador')
    id_horario = models.ForeignKey(
        Horario, models.DO_NOTHING, db_column='id_horario')
    # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    sueldo = models.DecimalField(max_digits=10, decimal_places=5)

    class Meta:
        managed = False
        db_table = 'trabajador'


class User(models.Model):
    id_user = models.AutoField(primary_key=True)
    id_trabajador = models.ForeignKey(
        Trabajador, models.DO_NOTHING, db_column='id_trabajador')
    nom_user = models.CharField()
    pass_user = models.CharField()
    id_tipo_user = models.ForeignKey(
        TipoUsuario, models.DO_NOTHING, db_column='id_tipo_user')
    estado = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'user'


class Venta(models.Model):
    id_venta = models.AutoField(primary_key=True)
    id_producto = models.ForeignKey(
        Producto, models.DO_NOTHING, db_column='id_producto')
    cantidad = models.IntegerField()
    # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    precio_v = models.DecimalField(max_digits=10, decimal_places=5)
    # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    cobra_de = models.DecimalField(max_digits=10, decimal_places=5)
    # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    total_cancelar = models.DecimalField(max_digits=10, decimal_places=5)
    id_cliente = models.ForeignKey(
        Cliente, models.DO_NOTHING, db_column='id_cliente')
    fecha = models.DateField()
    hora = models.DateField()
    id_pago = models.ForeignKey(Pago, models.DO_NOTHING, db_column='id_pago')
    id_estado = models.ForeignKey(
        EstadoPago, models.DO_NOTHING, db_column='id_estado')
    # max_digits and decimal_places have been guessed, as this database handles decimal fields as float
    total_cancelado = models.DecimalField(max_digits=10, decimal_places=5)
    id_trabajador = models.ForeignKey(
        Trabajador, models.DO_NOTHING, db_column='id_trabajador')

    class Meta:
        managed = False
        db_table = 'venta'
