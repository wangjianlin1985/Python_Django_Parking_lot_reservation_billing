var spaceOrder_manage_tool = null; 
$(function () { 
	initSpaceOrderManageTool(); //建立SpaceOrder管理对象
	spaceOrder_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#spaceOrder_manage").datagrid({
		url : '/SpaceOrder/list',
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
		sortName : "orderId",
		sortOrder : "desc",
		toolbar : "#spaceOrder_manage_tool",
		columns : [[
			{
				field : "orderId",
				title : "记录id",
				width : 70,
			},
			{
				field : "spaceObj",
				title : "预约车位",
				width : 140,
			},
			{
				field : "userObj",
				title : "预约用户",
				width : 140,
			},
			{
				field : "startTime",
				title : "预约开始时间",
				width : 140,
			},
			{
				field : "endTime",
				title : "预约结束时间",
				width : 140,
			},
			{
				field : "orderMoney",
				title : "预计费用",
				width : 70,
			},
			{
				field : "shenHeState",
				title : "审核状态",
				width : 140,
			},
			{
				field : "orderTime",
				title : "下单时间",
				width : 140,
			},
		]],
	});

	$("#spaceOrderEditDiv").dialog({
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
				if ($("#spaceOrderEditForm").form("validate")) {
					//验证表单 
					if(!$("#spaceOrderEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#spaceOrderEditForm").form({
						    url:"/SpaceOrder/update/" + $("#spaceOrder_orderId_edit").val(),
						    onSubmit: function(){
								if($("#spaceOrderEditForm").form("validate"))  {
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
			                        $("#spaceOrderEditDiv").dialog("close");
			                        spaceOrder_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#spaceOrderEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#spaceOrderEditDiv").dialog("close");
				$("#spaceOrderEditForm").form("reset"); 
			},
		}],
	});
});

function initSpaceOrderManageTool() {
	spaceOrder_manage_tool = {
		init: function() {
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
		},
		reload : function () {
			$("#spaceOrder_manage").datagrid("reload");
		},
		redo : function () {
			$("#spaceOrder_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#spaceOrder_manage").datagrid("options").queryParams;
			queryParams["spaceObj.spaceId"] = $("#spaceObj_spaceId_query").combobox("getValue");
			queryParams["userObj.user_name"] = $("#userObj_user_name_query").combobox("getValue");
			queryParams["startTime"] = $("#startTime").datebox("getValue"); 
			queryParams["endTime"] = $("#endTime").datebox("getValue"); 
			queryParams["shenHeState"] = $("#shenHeState").val();
			queryParams["orderTime"] = $("#orderTime").datebox("getValue"); 
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#spaceOrder_manage").datagrid("options").queryParams=queryParams; 
			$("#spaceOrder_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#spaceOrderQueryForm").form({
			    url:"/SpaceOrder/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#spaceOrderQueryForm").submit();
		},
		remove : function () {
			var rows = $("#spaceOrder_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var orderIds = [];
						for (var i = 0; i < rows.length; i ++) {
							orderIds.push(rows[i].orderId);
						}
						$.ajax({
							type : "POST",
							url : "/SpaceOrder/deletes",
							data : {
								orderIds : orderIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#spaceOrder_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#spaceOrder_manage").datagrid("loaded");
									$("#spaceOrder_manage").datagrid("load");
									$("#spaceOrder_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#spaceOrder_manage").datagrid("loaded");
									$("#spaceOrder_manage").datagrid("load");
									$("#spaceOrder_manage").datagrid("unselectAll");
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
			var rows = $("#spaceOrder_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/SpaceOrder/update/" + rows[0].orderId,
					type : "get",
					data : {
						//orderId : rows[0].orderId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (spaceOrder, response, status) {
						$.messager.progress("close");
						if (spaceOrder) { 
							$("#spaceOrderEditDiv").dialog("open");
							$("#spaceOrder_orderId_edit").val(spaceOrder.orderId);
							$("#spaceOrder_orderId_edit").validatebox({
								required : true,
								missingMessage : "请输入记录id",
								editable: false
							});
							$("#spaceOrder_spaceObj_spaceId_edit").combobox({
								url:"/SpaceInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"spaceId",
							    textField:"spaceNo",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#spaceOrder_spaceObj_spaceId_edit").combobox("select", spaceOrder.spaceObjPri);
									//var data = $("#spaceOrder_spaceObj_spaceId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#spaceOrder_spaceObj_spaceId_edit").combobox("select", data[0].spaceId);
						            //}
								}
							});
							$("#spaceOrder_userObj_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"name",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#spaceOrder_userObj_user_name_edit").combobox("select", spaceOrder.userObjPri);
									//var data = $("#spaceOrder_userObj_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#spaceOrder_userObj_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#spaceOrder_startTime_edit").datetimebox({
								value: spaceOrder.startTime,
							    required: true,
							    showSeconds: true,
							});
							$("#spaceOrder_endTime_edit").datetimebox({
								value: spaceOrder.endTime,
							    required: true,
							    showSeconds: true,
							});
							$("#spaceOrder_orderMoney_edit").val(spaceOrder.orderMoney);
							$("#spaceOrder_orderMoney_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入预计费用",
								invalidMessage : "预计费用输入不对",
							});
							$("#spaceOrder_shenHeState_edit").val(spaceOrder.shenHeState);
							$("#spaceOrder_shenHeState_edit").validatebox({
								required : true,
								missingMessage : "请输入审核状态",
							});
							$("#spaceOrder_orderMemo_edit").val(spaceOrder.orderMemo);
							$("#spaceOrder_orderTime_edit").datetimebox({
								value: spaceOrder.orderTime,
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
