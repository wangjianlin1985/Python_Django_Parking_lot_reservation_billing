"""PythonProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import include, url
from django.views.static import serve #需要导入
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^media/(?P<path>.*)$', serve, {'document_root':settings.MEDIA_ROOT}),#这部分很重要
    url(r'^UserInfo/', include('apps.UserInfo.urls', namespace='UserInfo')),  # 用户模块
    url(r'^Region/', include('apps.Region.urls', namespace='Region')),  # 区域模块
    url(r'^SpaceInfo/', include('apps.SpaceInfo.urls', namespace='SpaceInfo')),  # 停车位模块
    url(r'^Car/', include('apps.Car.urls', namespace='Car')),  # 车辆模块
    url(r'^CarModel/', include('apps.CarModel.urls', namespace='CarModel')),  # 车型模块
    url(r'^Park/', include('apps.Park.urls', namespace='Park')),  # 车辆停车模块
    url(r'^SpaceOrder/', include('apps.SpaceOrder.urls', namespace='SpaceOrder')),  # 车位预约模块
    url(r'^Leaveword/', include('apps.Leaveword.urls', namespace='Leaveword')),  # 留言模块
    url(r'^Notice/', include('apps.Notice.urls', namespace='Notice')),  # 新闻公告模块

    url(r'^', include("apps.Index.urls", namespace="Index")),  # 首页模块

    url(r'^tinymce/', include('tinymce.urls')),
]
