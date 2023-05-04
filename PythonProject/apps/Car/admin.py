from django.contrib import admin
from apps.Car.models import Car

# Register your models here.

admin.site.register(Car,admin.ModelAdmin)