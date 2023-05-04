from django.db import models
from apps.CarModel.models import CarModel
from apps.UserInfo.models import UserInfo
from tinymce.models import HTMLField


class Car(models.Model):
    carId = models.AutoField(primary_key=True, verbose_name='车辆id')
    carNo = models.CharField(max_length=20, default='', verbose_name='车牌')
    carModelObj = models.ForeignKey(CarModel,  db_column='carModelObj', on_delete=models.PROTECT, verbose_name='车型')
    pinpai = models.CharField(max_length=20, default='', verbose_name='品牌')
    carPhoto = models.ImageField(upload_to='img', max_length='100', verbose_name='车辆照片')
    youxing = models.CharField(max_length=20, default='', verbose_name='油型')
    haoyouliang = models.CharField(max_length=50, default='', verbose_name='耗油量')
    chexianriqi = models.CharField(max_length=20, default='', verbose_name='车险日期')
    zonglicheng = models.CharField(max_length=20, default='', verbose_name='总里程')
    carDesc = HTMLField(max_length=8000, verbose_name='车辆详情')
    userObj = models.ForeignKey(UserInfo,  db_column='userObj', on_delete=models.PROTECT, verbose_name='所属用户')
    addTime = models.CharField(max_length=20, default='', verbose_name='登记时间')

    class Meta:
        db_table = 't_Car'
        verbose_name = '车辆信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        car = {
            'carId': self.carId,
            'carNo': self.carNo,
            'carModelObj': self.carModelObj.modelName,
            'carModelObjPri': self.carModelObj.modelId,
            'pinpai': self.pinpai,
            'carPhoto': self.carPhoto.url,
            'youxing': self.youxing,
            'haoyouliang': self.haoyouliang,
            'chexianriqi': self.chexianriqi,
            'zonglicheng': self.zonglicheng,
            'carDesc': self.carDesc,
            'userObj': self.userObj.name,
            'userObjPri': self.userObj.user_name,
            'addTime': self.addTime,
        }
        return car

