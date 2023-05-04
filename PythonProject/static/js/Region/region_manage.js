var region_manage_tool = null; 
$(function () { 
	initRegionManageTool(); //建立Region管理对象
	region_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#region_manage").datagrid({
		url : '/Region/list',
		queryParams: {
			"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
		},
		fit : true,
		fitColumns : true,
		striped : true,
		rownumbers : true,
		border : false,
		pagination : true,
		pageSize : 5,
		pageList : [5, 10, 15, 20, 25],
		pageNumber : 1,
		sortName : "regionId",
		sortOrder : "desc",
		toolbar : "#region_manage_tool",
		columns : [[
			{
				field : "regionId",
				title : "区域id",
				width : 70,
			},
			{
				field : "regionFloor",
				title : "所在楼层",
				width : 140,
			},
			{
				field : "regionName",
				title : "区域名称",
				width : 140,
			},
		]],
	});

	$("#regionEditDiv").dialog({
		title : "修改管理",
		top: "50px",
		width : 700,
		height : 515,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#regionEditForm").form("validate")) {
					//验证表单 
					if(!$("#regionEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#regionEditForm").form({
						    url:"/Region/update/" + $("#region_regionId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#regionEditDiv").dialog("close");
			                        region_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#regionEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#regionEditDiv").dialog("close");
				$("#regionEditForm").form("reset"); 
			},
		}],
	});
});

function initRegionManageTool() {
	region_manage_tool = {
		init: function() {
		},
		reload : function () {
			$("#region_manage").datagrid("reload");
		},
		redo : function () {
			$("#region_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#region_manage").datagrid("options").queryParams;
			queryParams["regionFloor"] = $("#regionFloor").val();
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#region_manage").datagrid("options").queryParams=queryParams; 
			$("#region_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#regionQueryForm").form({
			    url:"/Region/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#regionQueryForm").submit();
		},
		remove : function () {
			var rows = $("#region_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var regionIds = [];
						for (var i = 0; i < rows.length; i ++) {
							regionIds.push(rows[i].regionId);
						}
						$.ajax({
							type : "POST",
							url : "/Region/deletes",
							data : {
								regionIds : regionIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#region_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#region_manage").datagrid("loaded");
									$("#region_manage").datagrid("load");
									$("#region_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#region_manage").datagrid("loaded");
									$("#region_manage").datagrid("load");
									$("#region_manage").datagrid("unselectAll");
									$.messager.alert("消息",data.message);
								}
							},
						});
					}
				});
			} else {
				$.messager.alert("提示", "请选择要删除的记录！", "info");
			}
		},
		edit : function () {
			var rows = $("#region_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/Region/update/" + rows[0].regionId,
					type : "get",
					data : {
						//regionId : rows[0].regionId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (region, response, status) {
						$.messager.progress("close");
						if (region) { 
							$("#regionEditDiv").dialog("open");
							$("#region_regionId_edit").val(region.regionId);
							$("#region_regionId_edit").validatebox({
								required : true,
								missingMessage : "请输入区域id",
								editable: false
							});
							$("#region_regionFloor_edit").val(region.regionFloor);
							$("#region_regionFloor_edit").validatebox({
								required : true,
								missingMessage : "请输入所在楼层",
							});
							$("#region_regionName_edit").val(region.regionName);
							$("#region_regionName_edit").validatebox({
								required : true,
								missingMessage : "请输入区域名称",
							});
							$("#region_regionDesc_edit").val(region.regionDesc);
						} else {
							$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
						}
					}
				});
			} else if (rows.length == 0) {
				$.messager.alert("警告操作！", "编辑记录至少选定一条数据！", "warning");
			}
		},
	};
}
