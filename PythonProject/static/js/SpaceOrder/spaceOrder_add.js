$(function () {
	$("#spaceOrder_startTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#spaceOrder_endTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#spaceOrder_orderMoney").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入预计费用',
		invalidMessage : '预计费用输入不对',
	});

	$("#spaceOrder_shenHeState").validatebox({
		required : true, 
		missingMessage : '请输入审核状态',
	});

	$("#spaceOrder_orderTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	//单击添加按钮
	$("#spaceOrderAddButton").click(function () {
		//验证表单 
		if(!$("#spaceOrderAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#spaceOrderAddForm").form({
			    url:"/SpaceOrder/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#spaceOrderAddForm").form("validate"))  { 
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
                        $("#spaceOrderAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#spaceOrderAddForm").submit();
		}
	});

	//单击清空按钮
	$("#spaceOrderClearButton").click(function () { 
		//$("#spaceOrderAddForm").form("clear"); 
		location.reload()
	});
});
