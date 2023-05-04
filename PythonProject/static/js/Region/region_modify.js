$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Region/update/" + $("#region_regionId_modify").val(),
		type : "get",
		data : {
			//regionId : $("#region_regionId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (region, response, status) {
			$.messager.progress("close");
			if (region) { 
				$("#region_regionId_modify").val(region.regionId);
				$("#region_regionId_modify").validatebox({
					required : true,
					missingMessage : "请输入区域id",
					editable: false
				});
				$("#region_regionFloor_modify").val(region.regionFloor);
				$("#region_regionFloor_modify").validatebox({
					required : true,
					missingMessage : "请输入所在楼层",
				});
				$("#region_regionName_modify").val(region.regionName);
				$("#region_regionName_modify").validatebox({
					required : true,
					missingMessage : "请输入区域名称",
				});
				$("#region_regionDesc_modify").val(region.regionDesc);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#regionModifyButton").click(function(){ 
		if ($("#regionModifyForm").form("validate")) {
			$("#regionModifyForm").form({
			    url:"Region/update/" + $("#region_regionId_modify").val(),
			    onSubmit: function(){
					if($("#regionEditForm").form("validate"))  {
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
			$("#regionModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
