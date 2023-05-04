from django.db import models


class CarModel(models.Model):
    modelId = models.AutoField(primary_key=True, verbose_name='车型id')
    modelName = models.CharField(max_length=20, default='', verbose_name='车型名称')

    class Meta:
        db_table = 't_CarModel'
        verbose_name = '车型信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        carModel = {
            'modelId': self.modelId,
            'modelName': self.modelName,
        }
        return carModel

