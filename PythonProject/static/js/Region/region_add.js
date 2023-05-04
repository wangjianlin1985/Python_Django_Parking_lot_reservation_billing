$(function () {
	$("#region_regionFloor").validatebox({
		required : true, 
		missingMessage : '请输入所在楼层',
	});

	$("#region_regionName").validatebox({
		required : true, 
		missingMessage : '请输入区域名称',
	});

	//单击添加按钮
	$("#regionAddButton").click(function () {
		//验证表单 
		if(!$("#regionAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#regionAddForm").form({
			    url:"/Region/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#regionAddForm").form("validate"))  { 
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
                        $("#regionAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#regionAddForm").submit();
		}
	});

	//单击清空按钮
	$("#regionClearButton").click(function () { 
		//$("#regionAddForm").form("clear"); 
		location.reload()
	});
});
