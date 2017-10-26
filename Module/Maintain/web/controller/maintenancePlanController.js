 var grid;
 var u;
 var viewModel;
 var baseUrl = "/MaintenancePlan/";
 $(function() {
     var fields = {
         PLAN_NBR: { type: "string" },
         NAME: { type: "string" },
         GP_NAME: { type: "string" },
         MAC_NAME: { type: "string" },
         DEGREE: { type: "string" },
         MEM_NBR: { type: "string" },
         STATUS_NAME: { type: "string" },
         MEM_COUNT: { type: "string" },
         DURATION: { type: "string" },
         TASK_NBR: { type: "string" },
         MAINTAIN_UNIT: { type: "string" },
         MEMO: { type: "string" },
         NOTICE_DATE: { type: "date" },
         LAST_CHECK_DATE: { type: "date" }
     };
     var cols = [];
     cols.push({ field: "PLAN_NBR", title: "计划编号", width: 80, sortable: true, filterable: false, hidden: true });
     cols.push({ field: "NAME", title: "保养计划名称", width: 120, sortable: true, filterable: { extra: false } });
     //cols.push({ field: "GP_NAME", title: "组名", width: 80, sortable: true, filterable: false });
     //cols.push({ field: "MAC_NAME", title: "机床名称", width: 80, sortable: true, filterable: false });
     cols.push({ field: "DEGREE", title: "保养级别", width: 80, sortable: true, filterable: false, template: kendo.template($("#DEGREE").html()) });
     cols.push({ field: "MEM_NAME", title: "负责人", width: 80, sortable: true, filterable: { extra: false } });
     cols.push({ field: "STATUS_NAME", title: "设备状态", width: 80, sortable: true, filterable: false });
     cols.push({ field: "MEM_COUNT", title: "人数", width: 60, sortable: true, filterable: false });
     cols.push({ field: "DURATION", title: "预计用时", template: '#: parseFloat((DURATION/3600).toFixed(1)) #h', width: 80, sortable: true, filterable: false });
     cols.push({ field: "NOTICE_DATE", title: "通知时间", width: 150, format: "{0: yyyy/MM/dd HH:mm:ss}", sortable: true, filterable: false });
     cols.push({ field: "LAST_CHECK_DATE", title: "最后保养时间", width: 120, format: "{0: yyyy/MM/dd}", sortable: true, filterable: false });
     cols.push({ field: "TASK_NBR", title: "任务编号", width: 80, sortable: true, filterable: false });
     cols.push({ field: "MAINTAIN_UNIT", title: "维修商", width: 80, sortable: true, filterable: false });
     cols.push({ field: "MEMO", title: "工作内容要求", width: 200, sortable: true, filterable: false });
     cols.push({ field: "CYCLE_TYPE", title: "周期", width: 80, sortable: true, filterable: false, template: kendo.template($("#CYCLE_TYPE1").html()) });
     cols.push({ field: "CYCLE_INTERVAL", title: "保养周期", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#CYCLE_INTERVAL").html()) });
     cols.push({ field: "ADD_TASK", title: "是否通知", width: 80, sortable: true, filterable: false, template: kendo.template($("#ADD_TASK").html()) });
     cols.push({ field: "PLAN_STATE", title: "操作", width: 250, sortable: true, filterable: false, template: kendo.template($("#OPERATOR_PLAN_STATE").html()) });

     //Grid
     grid = $("#grid").grid({
         checkBoxColumn: false,
         baseUrl: baseUrl, //调用的URL
         selectable: "single", //行选择方式
         //sort: [{ field: "USER_NBR", dir: "ASC" }],
         scrollable: true,
         editable: false, //是否可编辑
         autoBind: true,
         //height: 300,
         resizeGridWidth: true, //列宽度可调
         isPage: true,
         customsearch: true,
         //server: true, //服务器端刷新，包括排序，筛选等
         actionUrl: ["GetMaintencePlanList", "", "", "DeleteMaintainPlan"], //读、新增、更改、删除的URLaction
         custom: {
             PrimaryKey: "PLAN_NBR",
             fields: fields,
             cols: cols
         },
         rowClick: function(data) {
             $.post(baseUrl + "GetMaintainMachineByMaintainNo", { MaintainNo: parseInt(data[0].PLAN_NBR) }, function(data) {
                 var macs = [];
                 for (var i = 0; i < data.Data.length; i++) {
                     var planS;
                     if (data.Data[i].PLAN_STATE == 0)
                         planS = '未开始';
                     else if (data.Data[i].PLAN_STATE == 1)
                         planS = '进行中';
                     else
                         planS = '完成';
                     var json = {
                         MAC_NBR: data.Data[i].MAC_NBR,
                         MAC_NAME: data.Data[i].MAC_NAME,
                         PLAN_STATE: planS
                     };
                     macs.push(json);
                 }
                 u.MACS(macs)
                     //ko.mapping.fromJS(u.MACS(macs), viewModel);
             });
         }
     })

     //getTreeData("init");
     function koModel() {
         var self = this;
         self.MACS = ko.observableArray([]);
         self.order_edit = function() {
             //单号维护
             $.get("/TpmPart/StockManage/GetRules", function(data) {
                 $.x5window('单号规则', kendo.template($("#order-template").html()));
                 previewModel = ko.mapping.fromJS({
                     PREFIX1: ko.observable(data.Data[3].PREFIX),
                     INFIX1: ko.observable(data.Data[3].INFIX),
                     SUFFIX1: ko.observable(data.Data[3].SUFFIX),
                     save: function(e) {
                         var data = [
                             { PREFIX: e.PREFIX1(), INFIX: e.INFIX1(), SUFFIX: e.SUFFIX1(), RULE_NBR: 4 }
                         ];

                         $.post("/TpmPart/StockManage/UpdRules", JSON.stringify(data), function(data) {
                             if (data.Status == 0) {
                                 $("#x5window").data("kendoWindow").close();
                                 BzSuccess(data.Message);
                             } else {
                                 BzAlert(data.Message);
                             }
                         });
                     }
                 });
                 ko.applyBindings(previewModel, document.getElementById("fixviewmodel"));
             });
         };
         self.tree_refresh = function() {
             getTreeData("refresh");
         };
         self.grid_add = function(e) {
             $.x5window("新增", kendo.template($("#popup-add").html()));
             addOrEdit(); //新增
         };
     }
     u = new koModel();
     viewModel = ko.applyBindings(u);

     $('#filter').bind('keypress', function(event) {
         if (event.keyCode == "13") {
             getDataByKeyWord();
         }
     });
 });


 function addOrEdit(dataItem) {
     //App.initUniform();
     PEO_NBRS = $("#MEM_NBR").comboxTree({
         url: "/MachineWorkingState/GetAllMemberAndMemberGroup",
         url2: "/MachineWorkingState/GetKeywordMemberlist",
         data: { groupID: 0 },
         treetemplate: $("#treeview-template_out").html(),
         width: 175,
         diffwidth: 36,
         type: 4,

     }).data("BZ-comboxTree");
     $("#DEGREES").kendoComboBox({
         dataTextField: "text",
         dataValueField: "value",
         dataSource: [
             { text: '紧急', value: 0 },
             { text: '重大', value: 1 },
             { text: '一般', value: 2 }
         ],
         value: "DEFAULT"
     }).data("kendoComboBox").value(dataItem == undefined ? 1 : dataItem.DEGREE);
     $("#LastCheckDate").kendoDatePicker({ format: "yyyy/MM/dd", value: dataItem == undefined ? new Date() : dataItem.LastCheckDate });
     $("#CYCLE_INTERVAL_TIME").kendoComboBox({
         dataTextField: "text",
         dataValueField: "value",
         dataSource: [
             { text: "一月检", value: 1 },
             { text: "季检", value: 2 },
             { text: "半年检", value: 3 },
             { text: "年检", value: 4 }
         ],
         value: "DEFAULT"
     }).data("kendoComboBox").value(dataItem == undefined ? 1 : dataItem.DEGREE);
     $("#CYCLE_TYPE").kendoComboBox({
         dataTextField: "text",
         dataValueField: "value",
         dataSource: [
             { text: '时间', value: 0 },
             { text: '产量', value: 1 },
             { text: '运行时间', value: 2 }
         ],
         value: "DEFAULT",
         select: function(e) {
             var dataItem = this.dataItem(e.item.index());
             if (dataItem.value == 0 || dataItem.value == 2) {
                 $("#CYCLE_INTERVAL_TIMES").show();
                 $("#CYCLE_INTERVAL_YIELDS").hide();
             } else {
                 $("#CYCLE_INTERVAL_TIMES").hide();
                 $("#CYCLE_INTERVAL_YIELDS").show();
             }
         }
     }).data("kendoComboBox").value(dataItem == undefined ? 0 : dataItem.CYCLE_TYPE);

     //$("#CYCLE_INTERVAL_TIME").kendoNumericTextBox({ format: "#.# \\h", min: 0, value: dataItem == undefined ? 0 : parseFloat((dataItem.CYCLE_INTERVAL / 3600).toFixed(1)) });
     $("#CYCLE_INTERVAL_YIELD").kendoNumericTextBox({ format: "# \\个", min: 0, value: dataItem == undefined ? 0 : dataItem.CYCLE_INTERVAL });
     var condata = [];
     $.post("/statusdata/GetStatusData", null, function(data) {
         for (var i = 0; i < data.Data.length; i++) {
             var tjson = {
                 text: data.Data[i].NAME,
                 value: data.Data[i].STATUS_NBR
             }
             condata.push(tjson);
         }
         $("#STATUS_NBR").kendoComboBox({
             dataTextField: "text",
             dataValueField: "value",
             dataSource: condata,
             value: "DEFAULT"
         }).data("kendoComboBox").value(dataItem == undefined ? 1 : dataItem.STATUS_NBR);
     });
     MAC_NBR = $("#MAC_NBR").multipleComboxTree({
         url: "/MaintenancePlan/GetAllMachineAndMachineGroup",
         url2: "/MaintenancePlan/GetKeywordMachinelist",
         type: 2,
         width: 175,
         diffwidth: 37,
         inputheight: 20,
         diffinputwidth: 13,
         data: {
             GroupId: 0
         },
         checkbox: true
     }).data("BZ-multipleComboxTree");

     SEND_MEMBER = $("#SEND_MEMBER").multipleComboxTree({
         url: "/MachineWorkingState/GetAllMemberAndMemberGroup",
         url2: "/MachineWorkingState/GetKeywordMemberlist",
         type: 4,
         width: 175,
         diffwidth: 37,
         inputheight: 20,
         diffinputwidth: 13,
         data: {
             GroupId: 0
         },
         checkbox: true,
         select: function(data) {
             //过滤人员
             var mm = addviewModel.MEMBERS();
             var newMem = [];
             for (var m in data) {
                 var has = false;
                 for (var i = 0; i < mm.length; i++) {
                     if (mm[i].MEMBER_NMR() == m) {
                         has = true;
                         break;
                     }
                 }
                 if (!has) {
                     addviewModel.MEMBERS.push({
                         MEMBER_NMR: ko.observable(m),
                         MEMBER_NAME: ko.observable(data[m]),
                         USE_PAGE: ko.observable(true),
                         EMAIL: ko.observable(true)
                     });
                 }
             }
         }
     }).data("BZ-multipleComboxTree");
     validator = $("#maintainviewmodel").validate({
         rules: {
             NAME: { required: true }
         },
         messages: {
             NAME: { required: '不为空！' }
         }
     });
     $("#MEM_COUNT").kendoNumericTextBox({ format: "n0", min: 1, value: dataItem == undefined ? 1 : dataItem.MEM_COUNT });
     $("#DURATION").kendoNumericTextBox({ format: "#.# \\h", min: 0, value: dataItem == undefined ? 0 : parseFloat((dataItem.DURATION / 3600).toFixed(1)) });
     addviewModel = ko.mapping.fromJS({
         NAME: ko.observable(dataItem == undefined ? "" : dataItem.NAME),
         //TASK_NBR: ko.observable(dataItem == undefined ? "" : dataItem.TASK_NBR),
         MAINTAIN_UNIT: ko.observable(dataItem == undefined ? "" : dataItem.MAINTAIN_UNIT),
         MEMO: ko.observable(dataItem == undefined ? "" : dataItem.MEMO),
         NOTICE: ko.observable(false),
         allUSE_PAGE: ko.observable(false),
         allEMAIL: ko.observable(false),
         notice: function(e) {
             e.NOTICE(!e.NOTICE());
         },
         MEMBERS: ko.observableArray([]),
         allusepage: function(e) {
             e.allUSE_PAGE(!e.allUSE_PAGE());
             var obj = addviewModel.MEMBERS();
             for (var i = 0; i < obj.length; i++) {
                 obj[i].USE_PAGE(e.allUSE_PAGE());
             }
         },
         allemail: function(e) {
             e.allEMAIL(!e.allEMAIL());
             var obj = addviewModel.MEMBERS();
             for (var i = 0; i < obj.length; i++) {
                 obj[i].EMAIL(e.allEMAIL());
             }
         },
         usepage: function(e) {
             e.USE_PAGE(!e.USE_PAGE());
         },
         email: function(e) {
             e.EMAIL(!e.EMAIL());
         },
         deleteItem: function(item) {
             addviewModel.MEMBERS.remove(item)
         },
         save: function(e) {
             var machines = [];
             for (var m in MAC_NBR.dataAarry) {
                 machines.push(parseInt(m));
             }
             if (validator.form()) {
                 var interval = 0;
                 if ($("#CYCLE_TYPE").data("kendoComboBox").value() == 1) {
                     interval = $("#CYCLE_INTERVAL_YIELD").data("kendoNumericTextBox").value();
                 } else {
                     interval = $("#CYCLE_INTERVAL_TIME").data("kendoComboBox").value();
                 }
                 var data = {
                         PLAN_NBR: dataItem == undefined ? "" : dataItem.PLAN_NBR,
                         NAME: e.NAME(), //保养名称
                         DEGREE: $("#DEGREES").data("kendoComboBox").value(),
                         MEM_NBR: PEO_NBRS.rData,
                         STATUS_NBR: $("#STATUS_NBR").data("kendoComboBox").value(),
                         MEM_COUNT: $("#MEM_COUNT").data("kendoNumericTextBox").value(),
                         DURATION: $("#DURATION").data("kendoNumericTextBox").value() * 3600,
                         CYCLE_TYPE: $("#CYCLE_TYPE").data("kendoComboBox").value(),
                         CYCLE_INTERVAL: interval,
                         LAST_CHECK_DATE: $("#LastCheckDate").val(),
                         ADD_TASK: e.NOTICE() ? 1 : 0,
                         //TASK_NBR: e.TASK_NBR(),
                         MAINTAIN_UNIT: e.MAINTAIN_UNIT(),
                         MEMO: e.MEMO()
                     }
                     //发送消息
                 var obj = addviewModel.MEMBERS();
                 var SendList = ["UserPage", "Mail"];
                 var SendListData = [];
                 for (var p = 0; p < SendList.length; p++) {
                     var tjson = {};
                     tjson.TypeName = SendList[p];
                     tjson.NoticeSource = "";
                     var dd = [];
                     for (var k = 0; k < obj.length; k++) {
                         if (p == 0) {
                             if (obj[k].USE_PAGE()) {
                                 dd.push(obj[k].MEMBER_NMR())
                             }
                         } else if (p == 1) {
                             if (obj[k].EMAIL()) {
                                 dd.push(obj[k].MEMBER_NMR())
                             }
                         } else if (p == 2) {

                         } else if (p == 3) {

                         }
                     }
                     tjson.Destination = dd.toString();
                     SendListData.push(tjson);
                 }
                 var datap = {
                     MaintainPlan: data,
                     machineids: machines,
                     SendList: SendListData
                 }
                 if (dataItem == undefined) { //新增
                     $.ajax({
                         type: 'post',
                         url: baseUrl + "AddMaintainPlan",
                         contentType: 'application/json',
                         data: JSON.stringify(datap),
                         success: function(data) {
                             if (data.Status == 0) {
                                 $("#x5window").data("kendoWindow").close();
                                 //setUrl("GetParts");
                                 refreshGrid();
                                 BzSuccess(data.Message);
                             } else {
                                 BzAlert(data.Message);
                             }
                         }
                     })

                 } else {
                     $.ajax({
                         type: 'post',
                         url: baseUrl + "ModifyMaintainPlan",
                         contentType: 'application/json',
                         data: JSON.stringify(datap),
                         success: function(data) {
                             if (data.Status == 0) {
                                 $("#x5window").data("kendoWindow").close();
                                 //setUrl("GetParts");
                                 refreshGrid();
                                 BzSuccess(data.Message);
                             } else {
                                 BzAlert(data.Message);
                             }
                         }
                     })
                 }
             }
         }
     });
     ko.applyBindings(addviewModel, document.getElementById("maintainviewmodel"));
 }

 function refreshGrid() {
     grid.grid("refresh", function() {
         return [];
     });
 }

 function getDataByKeyWord() { //关键字查询
     if ($("#filter").val() == "") {
         grid.grid("refresh", function() {
             return [];
         });
     } else {
         grid.grid("refresh", function() {
             return [
                 { field: "PART_NAME", Operator: "contains", value: $("#filter").val() },
                 { field: "PART_NO", Operator: "contains", value: $("#filter").val() }
             ];
         });
     }
 }

 function f_edit(e) {
     $.x5window('编辑', kendo.template($("#popup-add").html()));
     var gridDataSource = grid.data("bz-grid").ds.data();
     var dataItem;
     for (var i = 0; i < gridDataSource.length; i++) {
         if (gridDataSource[i].PLAN_NBR == e) {
             dataItem = gridDataSource[i];
         }
     }
     addOrEdit(dataItem); //编辑
 }

 function f_del(e) {
     var gridDataSource = grid.data("bz-grid").ds.data();
     var dataItem;
     for (var i = 0; i < gridDataSource.length; i++) {
         if (gridDataSource[i].PLAN_NBR == e) {
             dataItem = gridDataSource[i];
         }
     }
     BzConfirm('是否删除保养计划？', function(e) {
         if (e) {
             $.post(baseUrl + "DeleteMaintainPlan", { MaintainNo: dataItem.PLAN_NBR }, function(data) {
                 if (data.Status == 0) {
                     grid.grid("refresh");
                     BzSuccess(data.Message);
                 } else {
                     BzAlert(data.Message);
                 }
             });
         }
     });
 }

 function f_goMaintain(e) {
     var gridDataSource = grid.data("bz-grid").ds.data();
     var dataItem;
     for (var i = 0; i < gridDataSource.length; i++) {
         if (gridDataSource[i].PLAN_NBR == e) {
             dataItem = gridDataSource[i];
         }
     }

     BzConfirm('是否执行保养？', function(e) {
         if (e) {
             var json = {
                 maintainRecord: { PLAN_NBR: dataItem.PLAN_NBR },
                 addReports: true
             }

             $.ajax({
                 type: 'post',
                 contentType: 'application/json',
                 data: JSON.stringify(json),
                 url: baseUrl + "AddMaintainRecord",
                 success: function(data) {
                     if (data.Status == 0) {
                         grid.grid("refresh");
                         BzSuccess(data.Message);
                     } else {
                         BzAlert(data.Message);
                     }
                 }
             })

         }
     });
 }

 function getDataByKeyWord() { //关键字查询
     if ($("#filter").val() == "") {
         grid.grid("refresh", function() {
             return [];
         });
     } else {
         grid.grid("refresh", function() {
             return [
                 { field: "NAME", Operator: "contains", value: $("#filter").val() }
             ];
         });
     }
 }