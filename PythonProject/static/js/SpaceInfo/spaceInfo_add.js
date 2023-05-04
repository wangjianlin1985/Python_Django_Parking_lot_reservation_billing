$(function () {
	//实例化车位描述编辑器
    tinyMCE.init({
        selector: "#spaceInfo_spaceDesc",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
	$("#spaceInfo_spaceNo").validatebox({
		required : true, 
		missingMessage : '请输入车位名称',
	});

	$("#spaceInfo_spacePrice").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入车位价格',
		invalidMessage : '车位价格输入不对',
	});

	$("#spaceInfo_spaceState").validatebox({
		required : true, 
		missingMessage : '请输入车位状态',
	});

	//单击添加按钮
	$("#spaceInfoAddButton").click(function () {
		//验证表单 
		if(!$("#spaceInfoAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#spaceInfoAddForm").form({
			    url:"/SpaceInfo/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#spaceInfoAddForm").form("validate"))  { 
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
                        $("#spaceInfoAddForm").form("clear");
                        tinyMCE.editors['spaceInfo_spaceDesc'].setContent("");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#spaceInfoAddForm").submit();
		}
	});

	//单击清空按钮
	$("#spaceInfoClearButton").click(function () { 
		//$("#spaceInfoAddForm").form("clear"); 
		location.reload()
	});
});
