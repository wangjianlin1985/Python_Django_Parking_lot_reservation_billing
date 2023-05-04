var park_manage_tool = null; 
$(function () { 
	initParkManageTool(); //建立Park管理对象
	park_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#park_manage").datagrid({
		url : '/Park/list',
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
		sortName : "parkId",
		sortOrder : "desc",
		toolbar : "#park_manage_tool",
		columns : [[
			{
				field : "parkId",
				title : "记录id",
				width : 70,
			},
			{
				field : "carObj",
				title : "车辆信息",
				width : 140,
			},
			{
				field : "userObj",
				title : "停车用户",
				width : 140,
			},
			{
				field : "spaceObj",
				title : "停入车位",
				width : 140,
			},
			{
				field : "startTime",
				title : "停车开始时间",
				width : 140,
			},
			{
				field : "endTime",
				title : "停车离开时间",
				width : 140,
			},
			{
				field : "price",
				title : "车位价格",
				width : 70,
			},
			{
				field : "timeSpan",
				title : "停车时长",
				width : 140,
			},
			{
				field : "parkMoney",
				title : "停车费用",
				width : 70,
			},
		]],
	});

	$("#parkEditDiv").dialog({
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
				if ($("#parkEditForm").form("validate")) {
					//验证表单 
					if(!$("#parkEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#parkEditForm").form({
						    url:"/Park/update/" + $("#park_parkId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#parkEditDiv").dialog("close");
			                        park_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#parkEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#parkEditDiv").dialog("close");
				$("#parkEditForm").form("reset"); 
			},
		}],
	});
});

function initParkManageTool() {
	park_manage_tool = {
		init: function() {
			$.ajax({
				url : "/Car/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#carObj_carId_query").combobox({ 
					    valueField:"carId",
					    textField:"carNo",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{carId:0,carNo:"不限制"});
					$("#carObj_carId_query").combobox("loadData",data); 
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
			$.ajax({
				url : "/SpaceInfo/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#spaceObj_spaceId_query").combobox({ 
					    valueField:"spaceId",
					    textField:"spaceNo",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{spaceId:0,spaceNo:"不限制"});
					$("#spaceObj_spaceId_query").combobox("loadData",data); 
				}
			});
		},
		reload : function () {
			$("#park_manage").datagrid("reload");
		},
		redo : function () {
			$("#park_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#park_manage").datagrid("options").queryParams;
			queryParams["carObj.carId"] = $("#carObj_carId_query").combobox("getValue");
			queryParams["userObj.user_name"] = $("#userObj_user_name_query").combobox("getValue");
			queryParams["spaceObj.spaceId"] = $("#spaceObj_spaceId_query").combobox("getValue");
			queryParams["startTime"] = $("#startTime").datebox("getValue"); 
			queryParams["endTime"] = $("#endTime").datebox("getValue"); 
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#park_manage").datagrid("options").queryParams=queryParams; 
			$("#park_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#parkQueryForm").form({
			    url:"/Park/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#parkQueryForm").submit();
		},
		remove : function () {
			var rows = $("#park_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var parkIds = [];
						for (var i = 0; i < rows.length; i ++) {
							parkIds.push(rows[i].parkId);
						}
						$.ajax({
							type : "POST",
							url : "/Park/deletes",
							data : {
								parkIds : parkIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#park_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#park_manage").datagrid("loaded");
									$("#park_manage").datagrid("load");
									$("#park_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#park_manage").datagrid("loaded");
									$("#park_manage").datagrid("load");
									$("#park_manage").datagrid("unselectAll");
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
			var rows = $("#park_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				if(rows[0].endTime != "--") {
					$.messager.alert("警告操作！", "请选择未办理离开的记录", "warning");
					return;
				}
				$.ajax({
					url : "/Park/update/" + rows[0].parkId,
					type : "get",
					data : {
						//parkId : rows[0].parkId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (park, response, status) {
						$.messager.progress("close");
						if (park) { 
							$("#parkEditDiv").dialog("open");
							$("#park_parkId_edit").val(park.parkId);
							$("#park_parkId_edit").validatebox({
								required : true,
								missingMessage : "请输入记录id",
								editable: false
							});
							$("#park_carObj_carId_edit").combobox({
								url:"/Car/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"carId",
							    textField:"carNo",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#park_carObj_carId_edit").combobox("select", park.carObjPri);
									//var data = $("#park_carObj_carId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#park_carObj_carId_edit").combobox("select", data[0].carId);
						            //}
								}
							});
							$("#park_userObj_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"name",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#park_userObj_user_name_edit").combobox("select", park.userObjPri);
									//var data = $("#park_userObj_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#park_userObj_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#park_spaceObj_spaceId_edit").combobox({
								url:"/SpaceInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"spaceId",
							    textField:"spaceNo",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#park_spaceObj_spaceId_edit").combobox("select", park.spaceObjPri);
									//var data = $("#park_spaceObj_spaceId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#park_spaceObj_spaceId_edit").combobox("select", data[0].spaceId);
						            //}
								}
							});
							$("#park_startTime_edit").datetimebox({
								value: park.startTime,
							    required: true,
							    showSeconds: true,
							});
							$("#park_endTime_edit").datetimebox({
								value: park.endTime,
							    required: true,
							    showSeconds: true,
							});
							$("#park_price_edit").val(park.price);
							$("#park_price_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入车位价格",
								invalidMessage : "车位价格输入不对",
							});
							var startTime = $("#park_startTime_edit").val();
							var endTime = $("#park_endTime_edit").val();

							var d1 = new Date(startTime);
							var d2 = new Date(endTime);

							var stopTime = parseFloat((d2 - d1) / 1000 / 3600).toFixed(1);

							$("#park_timeSpan_edit").val(stopTime + "小时");
							$("#park_timeSpan_edit").validatebox({
								required : true,
								missingMessage : "请输入停车时长",
							});
							var costMoney = stopTime * park.price;
							$("#park_parkMoney_edit").val(costMoney.toFixed(2))
							$("#park_parkMoney_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入停车费用",
								invalidMessage : "停车费用输入不对",
							});
							$("#park_parkMemo_edit").val(park.parkMemo);
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
