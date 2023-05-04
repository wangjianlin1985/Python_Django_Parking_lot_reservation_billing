$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/CarModel/update/" + $("#carModel_modelId_modify").val(),
		type : "get",
		data : {
			//modelId : $("#carModel_modelId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (carModel, response, status) {
			$.messager.progress("close");
			if (carModel) { 
				$("#carModel_modelId_modify").val(carModel.modelId);
				$("#carModel_modelId_modify").validatebox({
					required : true,
					missingMessage : "请输入车型id",
					editable: false
				});
				$("#carModel_modelName_modify").val(carModel.modelName);
				$("#carModel_modelName_modify").validatebox({
					required : true,
					missingMessage : "请输入车型名称",
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#carModelModifyButton").click(function(){ 
		if ($("#carModelModifyForm").form("validate")) {
			$("#carModelModifyForm").form({
			    url:"CarModel/update/" + $("#carModel_modelId_modify").val(),
			    onSubmit: function(){
					if($("#carModelEditForm").form("validate"))  {
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
			$("#carModelModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
