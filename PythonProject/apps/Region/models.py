from django.db import models


class Region(models.Model):
    regionId = models.AutoField(primary_key=True, verbose_name='区域id')
    regionFloor = models.CharField(max_length=20, default='', verbose_name='所在楼层')
    regionName = models.CharField(max_length=20, default='', verbose_name='区域名称')
    regionDesc = models.CharField(max_length=800, default='', verbose_name='区域说明')

    class Meta:
        db_table = 't_Region'
        verbose_name = '区域信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        region = {
            'regionId': self.regionId,
            'regionFloor': self.regionFloor,
            'regionName': self.regionName,
            'regionDesc': self.regionDesc,
        }
        return region

