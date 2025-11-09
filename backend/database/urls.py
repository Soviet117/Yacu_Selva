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


urlpatterns = [
    path('api/v1/', include(router.urls)),
]