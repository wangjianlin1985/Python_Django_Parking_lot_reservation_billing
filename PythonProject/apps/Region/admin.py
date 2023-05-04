from django.contrib import admin
from apps.Region.models import Region

# Register your models here.

admin.site.register(Region,admin.ModelAdmin)