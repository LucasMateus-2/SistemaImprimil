from django.urls import path
from . import views

urlpatterns = [
    path("", views.Home, name="home"),
    path("CalcMetro/", views.CalcMetro, name="calc_metro"),
    path("CalcBobina/", views.CalcBobina, name="calc_bobina"),
]
