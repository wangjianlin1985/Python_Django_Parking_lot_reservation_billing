var car_manage_tool = null; 
$(function () { 
	initCarManageTool(); //建立Car管理对象
	car_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#car_manage").datagrid({
		url : '/Car/list',
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
		sortName : "carId",
		sortOrder : "desc",
		toolbar : "#car_manage_tool",
		columns : [[
			{
				field : "carId",
				title : "车辆id",
				width : 70,
			},
			{
				field : "carNo",
				title : "车牌",
				width : 140,
			},
			{
				field : "carModelObj",
				title : "车型",
				width : 140,
			},
			{
				field : "pinpai",
				title : "品牌",
				width : 140,
			},
			{
				field : "carPhoto",
				title : "车辆照片",
				width : "70px",
				height: "65px",
				formatter: function(val,row) {
					return "<img src='" + val + "' width='65px' height='55px' />";
				}
 			},
			{
				field : "youxing",
				title : "油型",
				width : 140,
			},
			{
				field : "haoyouliang",
				title : "耗油量",
				width : 140,
			},
			{
				field : "chexianriqi",
				title : "车险日期",
				width : 140,
			},
			{
				field : "zonglicheng",
				title : "总里程",
				width : 140,
			},
			{
				field : "userObj",
				title : "所属用户",
				width : 140,
			},
			{
				field : "addTime",
				title : "登记时间",
				width : 140,
			},
		]],
	});

	$("#carEditDiv").dialog({
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
				if ($("#carEditForm").form("validate")) {
					//验证表单 
					if(!$("#carEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#carEditForm").form({
						    url:"/Car/update/" + $("#car_carId_edit").val(),
						    onSubmit: function(){
								if($("#carEditForm").form("validate"))  {
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
			                        $("#carEditDiv").dialog("close");
			                        car_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#carEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#carEditDiv").dialog("close");
				$("#carEditForm").form("reset"); 
			},
		}],
	});
});

function initCarManageTool() {
	car_manage_tool = {
		init: function() {
			$.ajax({
				url : "/CarModel/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#carModelObj_modelId_query").combobox({ 
					    valueField:"modelId",
					    textField:"modelName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{modelId:0,modelName:"不限制"});
					$("#carModelObj_modelId_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/UserInfo/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#userObj_user_name_query").combobox({ 
					    valueField:"user_name",
					    textField:"name",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{user_name:"",name:"不限制"});
					$("#userObj_user_name_query").combobox("loadData",data); 
				}
			});
			//实例化编辑器
			tinyMCE.init({
				selector: "#car_carDesc_edit",
				theme: 'advanced',
				language: "zh",
				strict_loading_mode: 1,
			});
		},
		reload : function () {
			$("#car_manage").datagrid("reload");
		},
		redo : function () {
			$("#car_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#car_manage").datagrid("options").queryParams;
			queryParams["carNo"] = $("#carNo").val();
			queryParams["carModelObj.modelId"] = $("#carModelObj_modelId_query").combobox("getValue");
			queryParams["pinpai"] = $("#pinpai").val();
			queryParams["chexianriqi"] = $("#chexianriqi").datebox("getValue"); 
			queryParams["userObj.user_name"] = $("#userObj_user_name_query").combobox("getValue");
			queryParams["addTime"] = $("#addTime").datebox("getValue"); 
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#car_manage").datagrid("options").queryParams=queryParams; 
			$("#car_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#carQueryForm").form({
			    url:"/Car/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#carQueryForm").submit();
		},
		remove : function () {
			var rows = $("#car_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var carIds = [];
						for (var i = 0; i < rows.length; i ++) {
							carIds.push(rows[i].carId);
						}
						$.ajax({
							type : "POST",
							url : "/Car/deletes",
							data : {
								carIds : carIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#car_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#car_manage").datagrid("loaded");
									$("#car_manage").datagrid("load");
									$("#car_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#car_manage").datagrid("loaded");
									$("#car_manage").datagrid("load");
									$("#car_manage").datagrid("unselectAll");
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
			var rows = $("#car_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/Car/update/" + rows[0].carId,
					type : "get",
					data : {
						//carId : rows[0].carId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (car, response, status) {
						$.messager.progress("close");
						if (car) { 
							$("#carEditDiv").dialog("open");
							$("#car_carId_edit").val(car.carId);
							$("#car_carId_edit").validatebox({
								required : true,
								missingMessage : "请输入车辆id",
								editable: false
							});
							$("#car_carNo_edit").val(car.carNo);
							$("#car_carNo_edit").validatebox({
								required : true,
								missingMessage : "请输入车牌",
							});
							$("#car_carModelObj_modelId_edit").combobox({
								url:"/CarModel/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"modelId",
							    textField:"modelName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#car_carModelObj_modelId_edit").combobox("select", car.carModelObjPri);
									//var data = $("#car_carModelObj_modelId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#car_carModelObj_modelId_edit").combobox("select", data[0].modelId);
						            //}
								}
							});
							$("#car_pinpai_edit").val(car.pinpai);
							$("#car_pinpai_edit").validatebox({
								required : true,
								missingMessage : "请输入品牌",
							});
							$("#car_carPhotoImg").attr("src", car.carPhoto);
							$("#car_youxing_edit").val(car.youxing);
							$("#car_youxing_edit").validatebox({
								required : true,
								missingMessage : "请输入油型",
							});
							$("#car_haoyouliang_edit").val(car.haoyouliang);
							$("#car_haoyouliang_edit").validatebox({
								required : true,
								missingMessage : "请输入耗油量",
							});
							$("#car_chexianriqi_edit").datebox({
								value: car.chexianriqi,
							    required: true,
							    showSeconds: true,
							});
							$("#car_zonglicheng_edit").val(car.zonglicheng);
							$("#car_zonglicheng_edit").validatebox({
								required : true,
								missingMessage : "请输入总里程",
							});
							tinyMCE.editors['car_carDesc_edit'].setContent(car.carDesc);
							$("#car_userObj_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"name",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#car_userObj_user_name_edit").combobox("select", car.userObjPri);
									//var data = $("#car_userObj_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#car_userObj_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#car_addTime_edit").datetimebox({
								value: car.addTime,
							    required: true,
							    showSeconds: true,
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
