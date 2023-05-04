$(function () {
    //实例化车辆详情编辑器
    tinyMCE.init({
        selector: "#car_carDesc_modify",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Car/update/" + $("#car_carId_modify").val(),
		type : "get",
		data : {
			//carId : $("#car_carId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (car, response, status) {
			$.messager.progress("close");
			if (car) { 
				$("#car_carId_modify").val(car.carId);
				$("#car_carId_modify").validatebox({
					required : true,
					missingMessage : "请输入车辆id",
					editable: false
				});
				$("#car_carNo_modify").val(car.carNo);
				$("#car_carNo_modify").validatebox({
					required : true,
					missingMessage : "请输入车牌",
				});
				$("#car_carModelObj_modelId_modify").combobox({
					url:"/CarModel/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"modelId",
					textField:"modelName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#car_carModelObj_modelId_modify").combobox("select", car.carModelObjPri);
						//var data = $("#car_carModelObj_modelId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#car_carModelObj_modelId_edit").combobox("select", data[0].modelId);
						//}
					}
				});
				$("#car_pinpai_modify").val(car.pinpai);
				$("#car_pinpai_modify").validatebox({
					required : true,
					missingMessage : "请输入品牌",
				});
				$("#car_carPhotoImgMod").attr("src", car.carPhoto);
				$("#car_youxing_modify").val(car.youxing);
				$("#car_youxing_modify").validatebox({
					required : true,
					missingMessage : "请输入油型",
				});
				$("#car_haoyouliang_modify").val(car.haoyouliang);
				$("#car_haoyouliang_modify").validatebox({
					required : true,
					missingMessage : "请输入耗油量",
				});
				$("#car_chexianriqi_modify").datebox({
					value: car.chexianriqi,
					required: true,
					showSeconds: true,
				});
				$("#car_zonglicheng_modify").val(car.zonglicheng);
				$("#car_zonglicheng_modify").validatebox({
					required : true,
					missingMessage : "请输入总里程",
				});
				tinyMCE.editors['car_carDesc_modify'].setContent(car.carDesc);
				$("#car_userObj_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#car_userObj_user_name_modify").combobox("select", car.userObjPri);
						//var data = $("#car_userObj_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#car_userObj_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#car_addTime_modify").datetimebox({
					value: car.addTime,
					required: true,
					showSeconds: true,
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#carModifyButton").click(function(){ 
		if ($("#carModifyForm").form("validate")) {
			$("#carModifyForm").form({
			    url:"Car/update/" + $("#car_carId_modify").val(),
			    onSubmit: function(){
					if($("#carEditForm").form("validate"))  {
	                	$.messager.progress({
							text : "正在提交数据中...",
						});
	                	return true;
	                } else {
	                    return false;
	                }
			    },
			    success:function(data){
			    	$.messager.progress("close");
                	var obj = jQuery.parseJSON(data);
                    if(obj.success){
                        $.messager.alert("消息","信息修改成功！");
                        $(".messager-window").css("z-index",10000);
                        //location.href="frontlist";
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    } 
			    }
			});
			//提交表单
			$("#carModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
