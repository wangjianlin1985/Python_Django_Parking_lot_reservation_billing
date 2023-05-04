$(function () {
	$("#park_startTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});


	/*
	$("#park_endTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});
*/

	$("#park_price").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入车位价格',
		invalidMessage : '车位价格输入不对',
	});

	$("#park_timeSpan").validatebox({
		required : true, 
		missingMessage : '请输入停车时长',
	});

	$("#park_parkMoney").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入停车费用',
		invalidMessage : '停车费用输入不对',
	});

	//单击添加按钮
	$("#parkAddButton").click(function () {
		//验证表单 
		if(!$("#parkAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#parkAddForm").form({
			    url:"/Park/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#parkAddForm").form("validate"))  { 
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
                        $("#parkAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#parkAddForm").submit();
		}
	});

	//单击清空按钮
	$("#parkClearButton").click(function () { 
		//$("#parkAddForm").form("clear"); 
		location.reload()
	});
});
