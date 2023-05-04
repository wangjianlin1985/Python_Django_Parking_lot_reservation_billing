from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.Car.models import Car
from apps.CarModel.models import CarModel
from apps.UserInfo.models import UserInfo
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台车辆添加
    def get(self,request):
        carModels = CarModel.objects.all()  # 获取所有车型
        userInfos = UserInfo.objects.all()  # 获取所有用户
        context = {
            'carModels': carModels,
            'userInfos': userInfos,
        }

        # 使用模板
        return render(request, 'Car/car_frontAdd.html', context)

    def post(self, request):
        car = Car() # 新建一个车辆对象然后获取参数
        car.carNo = request.POST.get('car.carNo')
        car.carModelObj = CarModel.objects.get(modelId=request.POST.get('car.carModelObj.modelId'))
        car.pinpai = request.POST.get('car.pinpai')
        try:
            car.carPhoto = self.uploadImageFile(request,'car.carPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        car.youxing = request.POST.get('car.youxing')
        car.haoyouliang = request.POST.get('car.haoyouliang')
        car.chexianriqi = request.POST.get('car.chexianriqi')
        car.zonglicheng = request.POST.get('car.zonglicheng')
        car.carDesc = request.POST.get('car.carDesc')
        car.userObj = UserInfo.objects.get(user_name= request.session.get('user_name'))
        import datetime
        car.addTime = str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        car.save() # 保存车辆信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改车辆
    def get(self, request, carId):
        context = {'carId': carId}
        return render(request, 'Car/car_frontModify.html', context)


class FrontListView(BaseView):  # 前台车辆查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        carNo = self.getStrParam(request, 'carNo')
        carModelObj_modelId = self.getIntParam(request, 'carModelObj.modelId')
        pinpai = self.getStrParam(request, 'pinpai')
        chexianriqi = self.getStrParam(request, 'chexianriqi')
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        addTime = self.getStrParam(request, 'addTime')
        # 然后条件组合查询过滤
        cars = Car.objects.all()
        if carNo != '':
            cars = cars.filter(carNo__contains=carNo)
        if carModelObj_modelId != '0':
            cars = cars.filter(carModelObj=carModelObj_modelId)
        if pinpai != '':
            cars = cars.filter(pinpai__contains=pinpai)
        if chexianriqi != '':
            cars = cars.filter(chexianriqi__contains=chexianriqi)
        if userObj_user_name != '':
            cars = cars.filter(userObj=userObj_user_name)
        if addTime != '':
            cars = cars.filter(addTime__contains=addTime)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(cars, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        cars_page = self.paginator.page(self.currentPage)

        # 获取所有车型
        carModels = CarModel.objects.all()
        # 获取所有用户
        userInfos = UserInfo.objects.all()
        # 构造模板需要的参数
        context = {
            'carModels': carModels,
            'userInfos': userInfos,
            'cars_page': cars_page,
            'carNo': carNo,
            'carModelObj_modelId': int(carModelObj_modelId),
            'pinpai': pinpai,
            'chexianriqi': chexianriqi,
            'userObj_user_name': userObj_user_name,
            'addTime': addTime,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Car/car_frontquery_result.html', context)



class FrontUserListView(BaseView):  # 前台车辆查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        carNo = self.getStrParam(request, 'carNo')
        carModelObj_modelId = self.getIntParam(request, 'carModelObj.modelId')
        pinpai = self.getStrParam(request, 'pinpai')
        chexianriqi = self.getStrParam(request, 'chexianriqi')
        userObj_user_name = request.session.get('user_name')
        addTime = self.getStrParam(request, 'addTime')
        # 然后条件组合查询过滤
        cars = Car.objects.all()
        if carNo != '':
            cars = cars.filter(carNo__contains=carNo)
        if carModelObj_modelId != '0':
            cars = cars.filter(carModelObj=carModelObj_modelId)
        if pinpai != '':
            cars = cars.filter(pinpai__contains=pinpai)
        if chexianriqi != '':
            cars = cars.filter(chexianriqi__contains=chexianriqi)
        if userObj_user_name != '':
            cars = cars.filter(userObj=userObj_user_name)
        if addTime != '':
            cars = cars.filter(addTime__contains=addTime)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(cars, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        cars_page = self.paginator.page(self.currentPage)

        # 获取所有车型
        carModels = CarModel.objects.all()
        # 获取所有用户
        userInfos = UserInfo.objects.all()
        # 构造模板需要的参数
        context = {
            'carModels': carModels,
            'userInfos': userInfos,
            'cars_page': cars_page,
            'carNo': carNo,
            'carModelObj_modelId': int(carModelObj_modelId),
            'pinpai': pinpai,
            'chexianriqi': chexianriqi,
            'userObj_user_name': userObj_user_name,
            'addTime': addTime,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Car/car_userFrontquery_result.html', context)


class FrontShowView(View):  # 前台显示车辆详情页
    def get(self, request, carId):
        # 查询需要显示的车辆对象
        car = Car.objects.get(carId=carId)
        context = {
            'car': car
        }
        # 渲染模板显示
        return render(request, 'Car/car_frontshow.html', context)


class ListAllView(View): # 前台查询所有车辆
    def get(self,request):
        cars = Car.objects.all()
        carList = []
        for car in cars:
            carObj = {
                'carId': car.carId,
                'carNo': car.carNo,
            }
            carList.append(carObj)
        return JsonResponse(carList, safe=False)


class UpdateView(BaseView):  # Ajax方式车辆更新
    def get(self, request, carId):
        # GET方式请求查询车辆对象并返回车辆json格式
        car = Car.objects.get(carId=carId)
        return JsonResponse(car.getJsonObj())

    def post(self, request, carId):
        # POST方式提交车辆修改信息更新到数据库
        car = Car.objects.get(carId=carId)
        car.carNo = request.POST.get('car.carNo')
        car.carModelObj = CarModel.objects.get(modelId=request.POST.get('car.carModelObj.modelId'))
        car.pinpai = request.POST.get('car.pinpai')
        try:
            carPhotoName = self.uploadImageFile(request, 'car.carPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        if carPhotoName != 'img/NoImage.jpg':
            car.carPhoto = carPhotoName
        car.youxing = request.POST.get('car.youxing')
        car.haoyouliang = request.POST.get('car.haoyouliang')
        car.chexianriqi = request.POST.get('car.chexianriqi')
        car.zonglicheng = request.POST.get('car.zonglicheng')
        car.carDesc = request.POST.get('car.carDesc')
        car.userObj = UserInfo.objects.get(user_name=request.POST.get('car.userObj.user_name'))
        car.addTime = request.POST.get('car.addTime')
        car.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台车辆添加
    def get(self,request):
        carModels = CarModel.objects.all()  # 获取所有车型
        userInfos = UserInfo.objects.all()  # 获取所有用户
        context = {
            'carModels': carModels,
            'userInfos': userInfos,
        }

        # 渲染显示模板界面
        return render(request, 'Car/car_add.html', context)

    def post(self, request):
        # POST方式处理图书添加业务
        car = Car() # 新建一个车辆对象然后获取参数
        car.carNo = request.POST.get('car.carNo')
        car.carModelObj = CarModel.objects.get(modelId=request.POST.get('car.carModelObj.modelId'))
        car.pinpai = request.POST.get('car.pinpai')
        try:
            car.carPhoto = self.uploadImageFile(request,'car.carPhoto')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        car.youxing = request.POST.get('car.youxing')
        car.haoyouliang = request.POST.get('car.haoyouliang')
        car.chexianriqi = request.POST.get('car.chexianriqi')
        car.zonglicheng = request.POST.get('car.zonglicheng')
        car.carDesc = request.POST.get('car.carDesc')
        car.userObj = UserInfo.objects.get(user_name=request.POST.get('car.userObj.user_name'))
        car.addTime = request.POST.get('car.addTime')
        car.save() # 保存车辆信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新车辆
    def get(self, request, carId):
        context = {'carId': carId}
        return render(request, 'Car/car_modify.html', context)


class ListView(BaseView):  # 后台车辆列表
    def get(self, request):
        # 使用模板
        return render(request, 'Car/car_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        carNo = self.getStrParam(request, 'carNo')
        carModelObj_modelId = self.getIntParam(request, 'carModelObj.modelId')
        pinpai = self.getStrParam(request, 'pinpai')
        chexianriqi = self.getStrParam(request, 'chexianriqi')
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        addTime = self.getStrParam(request, 'addTime')
        # 然后条件组合查询过滤
        cars = Car.objects.all()
        if carNo != '':
            cars = cars.filter(carNo__contains=carNo)
        if carModelObj_modelId != '0':
            cars = cars.filter(carModelObj=carModelObj_modelId)
        if pinpai != '':
            cars = cars.filter(pinpai__contains=pinpai)
        if chexianriqi != '':
            cars = cars.filter(chexianriqi__contains=chexianriqi)
        if userObj_user_name != '':
            cars = cars.filter(userObj=userObj_user_name)
        if addTime != '':
            cars = cars.filter(addTime__contains=addTime)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(cars, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        cars_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        carList = []
        for car in cars_page:
            car = car.getJsonObj()
            carList.append(car)
        # 构造模板页面需要的参数
        car_res = {
            'rows': carList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(car_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除车辆信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        carIds = self.getStrParam(request, 'carIds')
        carIds = carIds.split(',')
        count = 0
        try:
            for carId in carIds:
                Car.objects.get(carId=carId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出车辆信息到excel并下载
    def get(self, request):
        # 收集查询参数
        carNo = self.getStrParam(request, 'carNo')
        carModelObj_modelId = self.getIntParam(request, 'carModelObj.modelId')
        pinpai = self.getStrParam(request, 'pinpai')
        chexianriqi = self.getStrParam(request, 'chexianriqi')
        userObj_user_name = self.getStrParam(request, 'userObj.user_name')
        addTime = self.getStrParam(request, 'addTime')
        # 然后条件组合查询过滤
        cars = Car.objects.all()
        if carNo != '':
            cars = cars.filter(carNo__contains=carNo)
        if carModelObj_modelId != '0':
            cars = cars.filter(carModelObj=carModelObj_modelId)
        if pinpai != '':
            cars = cars.filter(pinpai__contains=pinpai)
        if chexianriqi != '':
            cars = cars.filter(chexianriqi__contains=chexianriqi)
        if userObj_user_name != '':
            cars = cars.filter(userObj=userObj_user_name)
        if addTime != '':
            cars = cars.filter(addTime__contains=addTime)
        #将查询结果集转换成列表
        carList = []
        for car in cars:
            car = car.getJsonObj()
            carList.append(car)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(carList)
        # 设置要导入到excel的列
        columns_map = {
            'carId': '车辆id',
            'carNo': '车牌',
            'carModelObj': '车型',
            'pinpai': '品牌',
            'youxing': '油型',
            'haoyouliang': '耗油量',
            'chexianriqi': '车险日期',
            'zonglicheng': '总里程',
            'userObj': '所属用户',
            'addTime': '登记时间',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'cars.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="cars.xlsx"'
        return response

