$(function () {
	//实例化车辆详情编辑器
    tinyMCE.init({
        selector: "#car_carDesc",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
	$("#car_carNo").validatebox({
		required : true, 
		missingMessage : '请输入车牌',
	});

	$("#car_pinpai").validatebox({
		required : true, 
		missingMessage : '请输入品牌',
	});

	$("#car_youxing").validatebox({
		required : true, 
		missingMessage : '请输入油型',
	});

	$("#car_haoyouliang").validatebox({
		required : true, 
		missingMessage : '请输入耗油量',
	});

	$("#car_chexianriqi").datebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#car_zonglicheng").validatebox({
		required : true, 
		missingMessage : '请输入总里程',
	});

	$("#car_addTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	//单击添加按钮
	$("#carAddButton").click(function () {
		//验证表单 
		if(!$("#carAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#carAddForm").form({
			    url:"/Car/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#carAddForm").form("validate"))  { 
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
                    //此处data={"Success":true}是字符串
                	var obj = jQuery.parseJSON(data); 
                    if(obj.success){ 
                        $.messager.alert("消息","保存成功！");
                        $(".messager-window").css("z-index",10000);
                        $("#carAddForm").form("clear");
                        tinyMCE.editors['car_carDesc'].setContent("");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#carAddForm").submit();
		}
	});

	//单击清空按钮
	$("#carClearButton").click(function () { 
		//$("#carAddForm").form("clear"); 
		location.reload()
	});
});
