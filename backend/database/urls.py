from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'persona', views.personaView, 'persona')
router.register(r'salida', views.salidaView, 'salida')
router.register(r'delivery',views.deliveristaView,'delivery')
router.register(r'producto',views.productoView,'producto')
router.register(r'retorno', views.retornoView, 'retorno')
router.register(r'retorno_res',views.RetornoViewRes,'retorno-res')
router.register(r'trabajadores', views.TrabajadorViewSet, 'trabajador')
router.register(r'dashboard', views.DashboardViewSet, 'dashboard')
router.register(r'tipos-trabajador', views.TipoTrabajadorViewSet, 'tipo-trabajador')
router.register(r'horarios', views.HorarioViewSet, 'horario')
router.register(r'reportes', views.ReportesViewSet, 'reportes')
router.register(r'movimientos-caja', views.MovimientoCajaViewSet, 'movimientos-caja')
router.register(r'clientes', views.ClienteViewSet, basename='clientes')
router.register(r'pos', views.POSViewSet, basename='pos')
router.register(r'operaciones', views.SalidaVentaHibridaViewSet, basename='operaciones')
router.register(r'users', views.UserViewSet, 'users')
router.register(r'tipos-usuario', views.TipoUsuarioViewSet, 'tipos-usuario')
router.register(r'trabajadores-sin-usuario', views.TrabajadorSinUsuarioViewSet, 'trabajadores-sin-usuario')

# Agrupa las rutas del router y las nuevas rutas bajo el mismo prefijo
urlpatterns_v1 = [
    path('', include(router.urls)), # <-- Incluye las rutas del router aquí
    path('login/', views.login_view, name='login'),
    path('check-permission/<int:user_id>/<int:module_id>/', views.check_module_permission, name='check-permission'),
    path('user-modules/<int:user_id>/', views.get_user_modules, name='user-modules'),
    # --- Tus nuevas rutas para backup van aquí, SIN el prefijo 'api/v1/' ---
    path('generar-backup/', views.generar_backup, name='generar_backup'),
    path('descargar-backup/<str:filename>/', views.descargar_backup, name='descargar_backup'),
    # --- Puedes agregar más rutas específicas de v1 aquí ---
]

urlpatterns = [
    path('api/v1/', include(urlpatterns_v1)), # <-- Incluye todo el bloque v1 aquí
    # Aquí puedes agregar otras versiones de la API si las tienes, ej: path('api/v2/', include(urlpatterns_v2)),
]
