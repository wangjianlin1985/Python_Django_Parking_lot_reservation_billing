from django.contrib import admin
from apps.CarModel.models import CarModel

# Register your models here.

admin.site.register(CarModel,admin.ModelAdmin)