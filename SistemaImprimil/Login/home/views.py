from django.shortcuts import render
from django.http import HttpRequest, HttpResponse
# Create your views here.
def CalcMetro(request:HttpRequest) -> HttpResponse:
    return render(request, 'CalcMetro.html')

def CalcBobina(request:HttpRequest) -> HttpResponse:
    return render(request, 'CalcBobina.html')

def Home(request:HttpRequest) -> HttpResponse:
    return render(request, 'home.html')