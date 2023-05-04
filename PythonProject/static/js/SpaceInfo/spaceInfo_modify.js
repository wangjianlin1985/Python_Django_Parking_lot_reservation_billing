$(function () {
    //实例化车位描述编辑器
    tinyMCE.init({
        selector: "#spaceInfo_spaceDesc_modify",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/SpaceInfo/update/" + $("#spaceInfo_spaceId_modify").val(),
		type : "get",
		data : {
			//spaceId : $("#spaceInfo_spaceId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (spaceInfo, response, status) {
			$.messager.progress("close");
			if (spaceInfo) { 
				$("#spaceInfo_spaceId_modify").val(spaceInfo.spaceId);
				$("#spaceInfo_spaceId_modify").validatebox({
					required : true,
					missingMessage : "请输入记录id",
					editable: false
				});
				$("#spaceInfo_regionObj_regionId_modify").combobox({
					url:"/Region/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"regionId",
					textField:"regionName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#spaceInfo_regionObj_regionId_modify").combobox("select", spaceInfo.regionObjPri);
						//var data = $("#spaceInfo_regionObj_regionId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#spaceInfo_regionObj_regionId_edit").combobox("select", data[0].regionId);
						//}
					}
				});
				$("#spaceInfo_spaceNo_modify").val(spaceInfo.spaceNo);
				$("#spaceInfo_spaceNo_modify").validatebox({
					required : true,
					missingMessage : "请输入车位名称",
				});
				$("#spaceInfo_spacePhotoImgMod").attr("src", spaceInfo.spacePhoto);
				$("#spaceInfo_spacePrice_modify").val(spaceInfo.spacePrice);
				$("#spaceInfo_spacePrice_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入车位价格",
					invalidMessage : "车位价格输入不对",
				});
				$("#spaceInfo_spaceState_modify").val(spaceInfo.spaceState);
				$("#spaceInfo_spaceState_modify").validatebox({
					required : true,
					missingMessage : "请输入车位状态",
				});
				tinyMCE.editors['spaceInfo_spaceDesc_modify'].setContent(spaceInfo.spaceDesc);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#spaceInfoModifyButton").click(function(){ 
		if ($("#spaceInfoModifyForm").form("validate")) {
			$("#spaceInfoModifyForm").form({
			    url:"SpaceInfo/update/" + $("#spaceInfo_spaceId_modify").val(),
			    onSubmit: function(){
					if($("#spaceInfoEditForm").form("validate"))  {
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
			$("#spaceInfoModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
