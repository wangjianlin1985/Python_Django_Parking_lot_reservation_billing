var carModel_manage_tool = null; 
$(function () { 
	initCarModelManageTool(); //建立CarModel管理对象
	carModel_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#carModel_manage").datagrid({
		url : '/CarModel/list',
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
		sortName : "modelId",
		sortOrder : "desc",
		toolbar : "#carModel_manage_tool",
		columns : [[
			{
				field : "modelId",
				title : "车型id",
				width : 70,
			},
			{
				field : "modelName",
				title : "车型名称",
				width : 140,
			},
		]],
	});

	$("#carModelEditDiv").dialog({
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
				if ($("#carModelEditForm").form("validate")) {
					//验证表单 
					if(!$("#carModelEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#carModelEditForm").form({
						    url:"/CarModel/update/" + $("#carModel_modelId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#carModelEditDiv").dialog("close");
			                        carModel_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#carModelEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#carModelEditDiv").dialog("close");
				$("#carModelEditForm").form("reset"); 
			},
		}],
	});
});

function initCarModelManageTool() {
	carModel_manage_tool = {
		init: function() {
		},
		reload : function () {
			$("#carModel_manage").datagrid("reload");
		},
		redo : function () {
			$("#carModel_manage").datagrid("unselectAll");
		},
		search: function() {
			$("#carModel_manage").datagrid("options").queryParams=queryParams; 
			$("#carModel_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#carModelQueryForm").form({
			    url:"/CarModel/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#carModelQueryForm").submit();
		},
		remove : function () {
			var rows = $("#carModel_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var modelIds = [];
						for (var i = 0; i < rows.length; i ++) {
							modelIds.push(rows[i].modelId);
						}
						$.ajax({
							type : "POST",
							url : "/CarModel/deletes",
							data : {
								modelIds : modelIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#carModel_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#carModel_manage").datagrid("loaded");
									$("#carModel_manage").datagrid("load");
									$("#carModel_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#carModel_manage").datagrid("loaded");
									$("#carModel_manage").datagrid("load");
									$("#carModel_manage").datagrid("unselectAll");
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
			var rows = $("#carModel_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/CarModel/update/" + rows[0].modelId,
					type : "get",
					data : {
						//modelId : rows[0].modelId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (carModel, response, status) {
						$.messager.progress("close");
						if (carModel) { 
							$("#carModelEditDiv").dialog("open");
							$("#carModel_modelId_edit").val(carModel.modelId);
							$("#carModel_modelId_edit").validatebox({
								required : true,
								missingMessage : "请输入车型id",
								editable: false
							});
							$("#carModel_modelName_edit").val(carModel.modelName);
							$("#carModel_modelName_edit").validatebox({
								required : true,
								missingMessage : "请输入车型名称",
							});
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
