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


urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v1/login/', views.login_view, name='login'),
    path('api/v1/check-permission/<int:user_id>/<int:module_id>/', views.check_module_permission, name='check-permission'),

]