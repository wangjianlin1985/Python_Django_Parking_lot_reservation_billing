$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/SpaceOrder/update/" + $("#spaceOrder_orderId_modify").val(),
		type : "get",
		data : {
			//orderId : $("#spaceOrder_orderId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (spaceOrder, response, status) {
			$.messager.progress("close");
			if (spaceOrder) { 
				$("#spaceOrder_orderId_modify").val(spaceOrder.orderId);
				$("#spaceOrder_orderId_modify").validatebox({
					required : true,
					missingMessage : "请输入记录id",
					editable: false
				});
				$("#spaceOrder_spaceObj_spaceId_modify").combobox({
					url:"/SpaceInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"spaceId",
					textField:"spaceNo",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#spaceOrder_spaceObj_spaceId_modify").combobox("select", spaceOrder.spaceObjPri);
						//var data = $("#spaceOrder_spaceObj_spaceId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#spaceOrder_spaceObj_spaceId_edit").combobox("select", data[0].spaceId);
						//}
					}
				});
				$("#spaceOrder_userObj_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#spaceOrder_userObj_user_name_modify").combobox("select", spaceOrder.userObjPri);
						//var data = $("#spaceOrder_userObj_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#spaceOrder_userObj_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#spaceOrder_startTime_modify").datetimebox({
					value: spaceOrder.startTime,
					required: true,
					showSeconds: true,
				});
				$("#spaceOrder_endTime_modify").datetimebox({
					value: spaceOrder.endTime,
					required: true,
					showSeconds: true,
				});
				$("#spaceOrder_orderMoney_modify").val(spaceOrder.orderMoney);
				$("#spaceOrder_orderMoney_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入预计费用",
					invalidMessage : "预计费用输入不对",
				});
				$("#spaceOrder_shenHeState_modify").val(spaceOrder.shenHeState);
				$("#spaceOrder_shenHeState_modify").validatebox({
					required : true,
					missingMessage : "请输入审核状态",
				});
				$("#spaceOrder_orderMemo_modify").val(spaceOrder.orderMemo);
				$("#spaceOrder_orderTime_modify").datetimebox({
					value: spaceOrder.orderTime,
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

	$("#spaceOrderModifyButton").click(function(){ 
		if ($("#spaceOrderModifyForm").form("validate")) {
			$("#spaceOrderModifyForm").form({
			    url:"SpaceOrder/update/" + $("#spaceOrder_orderId_modify").val(),
			    onSubmit: function(){
					if($("#spaceOrderEditForm").form("validate"))  {
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
			$("#spaceOrderModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
