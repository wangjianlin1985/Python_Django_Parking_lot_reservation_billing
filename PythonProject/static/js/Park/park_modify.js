$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Park/update/" + $("#park_parkId_modify").val(),
		type : "get",
		data : {
			//parkId : $("#park_parkId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (park, response, status) {
			$.messager.progress("close");
			if (park) { 
				$("#park_parkId_modify").val(park.parkId);
				$("#park_parkId_modify").validatebox({
					required : true,
					missingMessage : "请输入记录id",
					editable: false
				});
				$("#park_carObj_carId_modify").combobox({
					url:"/Car/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"carId",
					textField:"carNo",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#park_carObj_carId_modify").combobox("select", park.carObjPri);
						//var data = $("#park_carObj_carId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#park_carObj_carId_edit").combobox("select", data[0].carId);
						//}
					}
				});
				$("#park_userObj_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#park_userObj_user_name_modify").combobox("select", park.userObjPri);
						//var data = $("#park_userObj_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#park_userObj_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#park_spaceObj_spaceId_modify").combobox({
					url:"/SpaceInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"spaceId",
					textField:"spaceNo",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#park_spaceObj_spaceId_modify").combobox("select", park.spaceObjPri);
						//var data = $("#park_spaceObj_spaceId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#park_spaceObj_spaceId_edit").combobox("select", data[0].spaceId);
						//}
					}
				});
				$("#park_startTime_modify").datetimebox({
					value: park.startTime,
					required: true,
					showSeconds: true,
				});
				$("#park_endTime_modify").datetimebox({
					value: park.endTime,
					required: true,
					showSeconds: true,
				});
				$("#park_price_modify").val(park.price);
				$("#park_price_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入车位价格",
					invalidMessage : "车位价格输入不对",
				});
				$("#park_timeSpan_modify").val(park.timeSpan);
				$("#park_timeSpan_modify").validatebox({
					required : true,
					missingMessage : "请输入停车时长",
				});
				$("#park_parkMoney_modify").val(park.parkMoney);
				$("#park_parkMoney_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入停车费用",
					invalidMessage : "停车费用输入不对",
				});
				$("#park_parkMemo_modify").val(park.parkMemo);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#parkModifyButton").click(function(){ 
		if ($("#parkModifyForm").form("validate")) {
			$("#parkModifyForm").form({
			    url:"Park/update/" + $("#park_parkId_modify").val(),
			    onSubmit: function(){
					if($("#parkEditForm").form("validate"))  {
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
			$("#parkModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
