var spaceInfo_manage_tool = null; 
$(function () { 
	initSpaceInfoManageTool(); //建立SpaceInfo管理对象
	spaceInfo_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#spaceInfo_manage").datagrid({
		url : '/SpaceInfo/list',
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
		sortName : "spaceId",
		sortOrder : "desc",
		toolbar : "#spaceInfo_manage_tool",
		columns : [[
			{
				field : "spaceId",
				title : "记录id",
				width : 70,
			},
			{
				field : "regionObj",
				title : "所在区域",
				width : 140,
			},
			{
				field : "spaceNo",
				title : "车位名称",
				width : 140,
			},
			{
				field : "spacePhoto",
				title : "车位照片",
				width : "70px",
				height: "65px",
				formatter: function(val,row) {
					return "<img src='" + val + "' width='65px' height='55px' />";
				}
 			},
			{
				field : "spacePrice",
				title : "车位价格",
				width : 70,
			},
			{
				field : "spaceState",
				title : "车位状态",
				width : 140,
			},
		]],
	});

	$("#spaceInfoEditDiv").dialog({
		title : "修改管理",
		top: "10px",
		width : 1000,
		height : 600,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#spaceInfoEditForm").form("validate")) {
					//验证表单 
					if(!$("#spaceInfoEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#spaceInfoEditForm").form({
						    url:"/SpaceInfo/update/" + $("#spaceInfo_spaceId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#spaceInfoEditDiv").dialog("close");
			                        spaceInfo_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#spaceInfoEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#spaceInfoEditDiv").dialog("close");
				$("#spaceInfoEditForm").form("reset"); 
			},
		}],
	});
});

function initSpaceInfoManageTool() {
	spaceInfo_manage_tool = {
		init: function() {
			$.ajax({
				url : "/Region/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#regionObj_regionId_query").combobox({ 
					    valueField:"regionId",
					    textField:"regionName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{regionId:0,regionName:"不限制"});
					$("#regionObj_regionId_query").combobox("loadData",data); 
				}
			});
			//实例化编辑器
			tinyMCE.init({
				selector: "#spaceInfo_spaceDesc_edit",
				theme: 'advanced',
				language: "zh",
				strict_loading_mode: 1,
			});
		},
		reload : function () {
			$("#spaceInfo_manage").datagrid("reload");
		},
		redo : function () {
			$("#spaceInfo_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#spaceInfo_manage").datagrid("options").queryParams;
			queryParams["regionObj.regionId"] = $("#regionObj_regionId_query").combobox("getValue");
			queryParams["spaceNo"] = $("#spaceNo").val();
			queryParams["spaceState"] = $("#spaceState").val();
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#spaceInfo_manage").datagrid("options").queryParams=queryParams; 
			$("#spaceInfo_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#spaceInfoQueryForm").form({
			    url:"/SpaceInfo/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#spaceInfoQueryForm").submit();
		},
		remove : function () {
			var rows = $("#spaceInfo_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var spaceIds = [];
						for (var i = 0; i < rows.length; i ++) {
							spaceIds.push(rows[i].spaceId);
						}
						$.ajax({
							type : "POST",
							url : "/SpaceInfo/deletes",
							data : {
								spaceIds : spaceIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#spaceInfo_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#spaceInfo_manage").datagrid("loaded");
									$("#spaceInfo_manage").datagrid("load");
									$("#spaceInfo_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#spaceInfo_manage").datagrid("loaded");
									$("#spaceInfo_manage").datagrid("load");
									$("#spaceInfo_manage").datagrid("unselectAll");
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
			var rows = $("#spaceInfo_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/SpaceInfo/update/" + rows[0].spaceId,
					type : "get",
					data : {
						//spaceId : rows[0].spaceId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (spaceInfo, response, status) {
						$.messager.progress("close");
						if (spaceInfo) { 
							$("#spaceInfoEditDiv").dialog("open");
							$("#spaceInfo_spaceId_edit").val(spaceInfo.spaceId);
							$("#spaceInfo_spaceId_edit").validatebox({
								required : true,
								missingMessage : "请输入记录id",
								editable: false
							});
							$("#spaceInfo_regionObj_regionId_edit").combobox({
								url:"/Region/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"regionId",
							    textField:"regionName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#spaceInfo_regionObj_regionId_edit").combobox("select", spaceInfo.regionObjPri);
									//var data = $("#spaceInfo_regionObj_regionId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#spaceInfo_regionObj_regionId_edit").combobox("select", data[0].regionId);
						            //}
								}
							});
							$("#spaceInfo_spaceNo_edit").val(spaceInfo.spaceNo);
							$("#spaceInfo_spaceNo_edit").validatebox({
								required : true,
								missingMessage : "请输入车位名称",
							});
							$("#spaceInfo_spacePhotoImg").attr("src", spaceInfo.spacePhoto);
							$("#spaceInfo_spacePrice_edit").val(spaceInfo.spacePrice);
							$("#spaceInfo_spacePrice_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入车位价格",
								invalidMessage : "车位价格输入不对",
							});
							$("#spaceInfo_spaceState_edit").val(spaceInfo.spaceState);
							$("#spaceInfo_spaceState_edit").validatebox({
								required : true,
								missingMessage : "请输入车位状态",
							});
							tinyMCE.editors['spaceInfo_spaceDesc_edit'].setContent(spaceInfo.spaceDesc);
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
