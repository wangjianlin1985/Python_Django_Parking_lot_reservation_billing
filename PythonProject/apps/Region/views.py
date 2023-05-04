from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.Region.models import Region
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台区域添加
    def get(self,request):

        # 使用模板
        return render(request, 'Region/region_frontAdd.html')

    def post(self, request):
        region = Region() # 新建一个区域对象然后获取参数
        region.regionFloor = request.POST.get('region.regionFloor')
        region.regionName = request.POST.get('region.regionName')
        region.regionDesc = request.POST.get('region.regionDesc')
        region.save() # 保存区域信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改区域
    def get(self, request, regionId):
        context = {'regionId': regionId}
        return render(request, 'Region/region_frontModify.html', context)


class FrontListView(BaseView):  # 前台区域查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        regionFloor = self.getStrParam(request, 'regionFloor')
        # 然后条件组合查询过滤
        regions = Region.objects.all()
        if regionFloor != '':
            regions = regions.filter(regionFloor__contains=regionFloor)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(regions, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        regions_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'regions_page': regions_page,
            'regionFloor': regionFloor,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Region/region_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示区域详情页
    def get(self, request, regionId):
        # 查询需要显示的区域对象
        region = Region.objects.get(regionId=regionId)
        context = {
            'region': region
        }
        # 渲染模板显示
        return render(request, 'Region/region_frontshow.html', context)


class ListAllView(View): # 前台查询所有区域
    def get(self,request):
        regions = Region.objects.all()
        regionList = []
        for region in regions:
            regionObj = {
                'regionId': region.regionId,
                'regionName': region.regionName,
            }
            regionList.append(regionObj)
        return JsonResponse(regionList, safe=False)


class UpdateView(BaseView):  # Ajax方式区域更新
    def get(self, request, regionId):
        # GET方式请求查询区域对象并返回区域json格式
        region = Region.objects.get(regionId=regionId)
        return JsonResponse(region.getJsonObj())

    def post(self, request, regionId):
        # POST方式提交区域修改信息更新到数据库
        region = Region.objects.get(regionId=regionId)
        region.regionFloor = request.POST.get('region.regionFloor')
        region.regionName = request.POST.get('region.regionName')
        region.regionDesc = request.POST.get('region.regionDesc')
        region.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台区域添加
    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'Region/region_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        region = Region() # 新建一个区域对象然后获取参数
        region.regionFloor = request.POST.get('region.regionFloor')
        region.regionName = request.POST.get('region.regionName')
        region.regionDesc = request.POST.get('region.regionDesc')
        region.save() # 保存区域信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新区域
    def get(self, request, regionId):
        context = {'regionId': regionId}
        return render(request, 'Region/region_modify.html', context)


class ListView(BaseView):  # 后台区域列表
    def get(self, request):
        # 使用模板
        return render(request, 'Region/region_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        regionFloor = self.getStrParam(request, 'regionFloor')
        # 然后条件组合查询过滤
        regions = Region.objects.all()
        if regionFloor != '':
            regions = regions.filter(regionFloor__contains=regionFloor)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(regions, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        regions_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        regionList = []
        for region in regions_page:
            region = region.getJsonObj()
            regionList.append(region)
        # 构造模板页面需要的参数
        region_res = {
            'rows': regionList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(region_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除区域信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        regionIds = self.getStrParam(request, 'regionIds')
        regionIds = regionIds.split(',')
        count = 0
        try:
            for regionId in regionIds:
                Region.objects.get(regionId=regionId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出区域信息到excel并下载
    def get(self, request):
        # 收集查询参数
        regionFloor = self.getStrParam(request, 'regionFloor')
        # 然后条件组合查询过滤
        regions = Region.objects.all()
        if regionFloor != '':
            regions = regions.filter(regionFloor__contains=regionFloor)
        #将查询结果集转换成列表
        regionList = []
        for region in regions:
            region = region.getJsonObj()
            regionList.append(region)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(regionList)
        # 设置要导入到excel的列
        columns_map = {
            'regionId': '区域id',
            'regionFloor': '所在楼层',
            'regionName': '区域名称',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'regions.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="regions.xlsx"'
        return response

