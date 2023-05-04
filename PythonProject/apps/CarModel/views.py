from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.CarModel.models import CarModel
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台车型添加
    def get(self,request):

        # 使用模板
        return render(request, 'CarModel/carModel_frontAdd.html')

    def post(self, request):
        carModel = CarModel() # 新建一个车型对象然后获取参数
        carModel.modelName = request.POST.get('carModel.modelName')
        carModel.save() # 保存车型信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改车型
    def get(self, request, modelId):
        context = {'modelId': modelId}
        return render(request, 'CarModel/carModel_frontModify.html', context)


class FrontListView(BaseView):  # 前台车型查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        # 然后条件组合查询过滤
        carModels = CarModel.objects.all()
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(carModels, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        carModels_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'carModels_page': carModels_page,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'CarModel/carModel_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示车型详情页
    def get(self, request, modelId):
        # 查询需要显示的车型对象
        carModel = CarModel.objects.get(modelId=modelId)
        context = {
            'carModel': carModel
        }
        # 渲染模板显示
        return render(request, 'CarModel/carModel_frontshow.html', context)


class ListAllView(View): # 前台查询所有车型
    def get(self,request):
        carModels = CarModel.objects.all()
        carModelList = []
        for carModel in carModels:
            carModelObj = {
                'modelId': carModel.modelId,
                'modelName': carModel.modelName,
            }
            carModelList.append(carModelObj)
        return JsonResponse(carModelList, safe=False)


class UpdateView(BaseView):  # Ajax方式车型更新
    def get(self, request, modelId):
        # GET方式请求查询车型对象并返回车型json格式
        carModel = CarModel.objects.get(modelId=modelId)
        return JsonResponse(carModel.getJsonObj())

    def post(self, request, modelId):
        # POST方式提交车型修改信息更新到数据库
        carModel = CarModel.objects.get(modelId=modelId)
        carModel.modelName = request.POST.get('carModel.modelName')
        carModel.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台车型添加
    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'CarModel/carModel_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        carModel = CarModel() # 新建一个车型对象然后获取参数
        carModel.modelName = request.POST.get('carModel.modelName')
        carModel.save() # 保存车型信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新车型
    def get(self, request, modelId):
        context = {'modelId': modelId}
        return render(request, 'CarModel/carModel_modify.html', context)


class ListView(BaseView):  # 后台车型列表
    def get(self, request):
        # 使用模板
        return render(request, 'CarModel/carModel_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        # 然后条件组合查询过滤
        carModels = CarModel.objects.all()
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(carModels, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        carModels_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        carModelList = []
        for carModel in carModels_page:
            carModel = carModel.getJsonObj()
            carModelList.append(carModel)
        # 构造模板页面需要的参数
        carModel_res = {
            'rows': carModelList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(carModel_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除车型信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        modelIds = self.getStrParam(request, 'modelIds')
        modelIds = modelIds.split(',')
        count = 0
        try:
            for modelId in modelIds:
                CarModel.objects.get(modelId=modelId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出车型信息到excel并下载
    def get(self, request):
        # 收集查询参数
        # 然后条件组合查询过滤
        carModels = CarModel.objects.all()
        #将查询结果集转换成列表
        carModelList = []
        for carModel in carModels:
            carModel = carModel.getJsonObj()
            carModelList.append(carModel)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(carModelList)
        # 设置要导入到excel的列
        columns_map = {
            'modelId': '车型id',
            'modelName': '车型名称',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'carModels.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="carModels.xlsx"'
        return response

