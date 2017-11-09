 var grid;
 var u;
 var viewModel;
 var baseUrl = "/MaintenanceRequest/";
 $(function() {
     var fields = {
         APPLAY_NBR: { type: "string" },
         APPLAY_NO: { type: "string" },
         MAC_NBR: { type: "string" },
         MEM_NBR: { type: "string" },
         APPLAY_DATE: { type: "date" },
         URGENCY: { type: "string" },
         REPAIR_STATE: { type: "string" },
         MEMO: { type: "string" }
     };
     var cols = [];
     cols.push({
         field: "REPAIR_STATE",
         title: '维修状态',
         width: 80,
         sortable: true,
         filterable: {
             ui: REPAIR_STATE_Filter,
             extra: false
         },
         template: kendo.template($("#REPAIR_STATE").html())
     });
     cols.push({ field: "APPLAY_NBR", title: "申请ID", width: 80, sortable: true, filterable: false, hidden: true });
     cols.push({ field: "APPLAY_NO", title: "申请单号", width: 80, sortable: true, filterable: { extra: false } });
     cols.push({ field: "MAC_NBR", title: "设备ID", width: 80, sortable: true, filterable: false, hidden: true });
     cols.push({ field: "MAC_NAME", title: "设备名称", width: 80, sortable: true, filterable: false });
     cols.push({ field: "MEM_NBR", title: "申请人ID", width: 80, sortable: true, filterable: false, hidden: true });
     cols.push({ field: "MEM_NAME", title: "申请人", width: 80, sortable: true, filterable: false });
     cols.push({ field: "APPLAY_DATE", title: "申请日期", width: 100, sortable: true, format: "{0: yyyy/MM/dd HH:mm:ss}", filterable: false });
     //cols.push({ field: "URGENCY", title: $.Translate("ServiceMaintain.URGENCY"), width: 80, sortable: true, filterable: false, template: kendo.template($("#URGENCY").html()) });
     //cols.push({ field: "REPAIR_STATE", title: "维修日期", width: 80, sortable: true, filterable: false });
     cols.push({ field: "MEMO", title: "问题描述", width: 200, sortable: true, filterable: false });

     cols.push({
         command: [
             //{ name: "aa", text: $.Translate("Common.EDIT") + '<i class="icon-edit"></i>', className: "btn purple", click: f_edit },
             { name: "bb", text: "删除" + '<i class="icon-remove-sign"></i>', className: "btn red ", click: f_del },
             { name: "cc", text: "执行维修" + '<i class="icon-circle-arrow-right"></i>', className: "btn green ", click: f_goRepair }
         ],
         title: "操作",
         width: 130
     });

     //Grid
     grid = $("#grid").grid({
         checkBoxColumn: false,
         baseUrl: baseUrl, //调用的URL
         selectable: "single", //行选择方式
         scrollable: true,
         editable: false, //是否可编辑
         autoBind: true,
         //height: 300,
         resizeGridWidth: true, //列宽度可调
         isPage: true,
         customsearch: true,
         //server: true, //服务器端刷新，包括排序，筛选等
         actionUrl: ["GetRepairApplayInfos", "", "", ""], //读、新增、更改、删除的URLaction
         custom: {
             PrimaryKey: "APPLAY_NBR",
             fields: fields,
             cols: cols
         }
     })

     //getTreeData("init");
     function koModel() {
         var self = this;
         self.MACS = ko.observableArray([]);
         self.order_edit = function() {
             //单号维护
             $.get("/MaintenanceRequest/GetRules", function(data) {
                 $.x5window("单号规则", kendo.template($("#order-template").html()));
                 previewModel = ko.mapping.fromJS({
                     PREFIX1: ko.observable(data.Data[2].PREFIX),
                     INFIX1: ko.observable(data.Data[2].INFIX),
                     SUFFIX1: ko.observable(data.Data[2].SUFFIX),
                     save: function(e) {
                         var data = [
                             { PREFIX: e.PREFIX1(), INFIX: e.INFIX1(), SUFFIX: e.SUFFIX1(), RULE_NBR: 3 }
                         ];

                         $.ajax({
                                 url: '/MaintenanceRequest/UpdRules',
                                 type: 'post',
                                 data: JSON.stringify(data),
                                 contentType: 'application/json',
                                 success: function(data) {
                                     if (data.Status == 0) {
                                         $("#x5window").data("kendoWindow").close();
                                         BzSuccess(data.Message);
                                     } else {
                                         BzAlert(data.Message);
                                     }
                                 }
                             })
                             //  $.post("/MaintenanceRequest/UpdRules", JSON.stringify(data), function(data) {
                             //      if (data.Status == 0) {
                             //          $("#x5window").data("kendoWindow").close();
                             //          BzSuccess(data.Message);
                             //      } else {
                             //          BzAlert(data.Message);
                             //      }
                             //  });
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
     MAC_NBR = $("#MAC_NBR").comboxTree({
         url: "/Alarm/GetAllMachineAndMachineGroup",
         url2: "/Alarm/GetKeywordMachinelist",
         data: { groupID: 0 },
         treetemplate: $("#treeview-template").html(),
         width: 172,
         diffwidth: 24,
         type: 2

     }).data("BZ-comboxTree");
     $("#URGENCY_TEXT").kendoComboBox({
         dataTextField: "text",
         dataValueField: "value",
         dataSource: [
             { text: "紧急", value: 0 },
             { text: "重大", value: 1 },
             { text: "一般", value: 2 }
         ],
         value: "DEFAULT"
     }).data("kendoComboBox").value(dataItem == undefined ? 1 : parseInt(dataItem.URGENCY));
     //validator = $("#maintainviewmodel").validate({
     //    rules: {
     //        NAME: { required: true },
     //        DEGREE: { required: true },
     //        STATUS_NBR: { required: true },
     //        MEM_COUNT: { required: true }
     //    },
     //    messages: {
     //        NAME: { required: $.Translate("Common.NOT_NULL") },
     //        DEGREE: { required: $.Translate("Common.NOT_NULL") },
     //        STATUS_NBR: { required: $.Translate("Common.NOT_NULL") },
     //        MEM_COUNT: { required: $.Translate("Common.NOT_NULL") }
     //    }
     //});
     addviewModel = ko.mapping.fromJS({
         MEMO: ko.observable(dataItem == undefined ? "" : dataItem.MEMO),
         save: function(e) {
                 //if (validator.form()) {
                 var applayInfo = {
                     APPLAY_NBR: 0, //dataItem == undefined ? "" : dataItem.APPLAY_NBR,
                     MAC_NBR: MAC_NBR.rData,
                     URGENCY: parseInt($("#URGENCY_TEXT").data("kendoComboBox").value()),
                     MEMO: e.MEMO()
                 }

                 if (dataItem == undefined) { //新增
                     if ($('#input_MAC_NBR').val() == '') {
                         BzAlert("请选择设备！");
                         return;
                     }
                     if ($('#MEMO').val() == '') {
                         BzAlert("请输入问题描述！");
                         return;
                     }

                     $.post(baseUrl + "AddRepairApplayInfoService", applayInfo, function(data) {
                         if (data.Status == 0) {
                             $("#x5window").data("kendoWindow").close();
                             refreshGrid();
                             BzSuccess(data.Message);
                         } else {
                             BzAlert(data.Message);
                         }
                     });
                 } else {
                     if ($('#input_MAC_NBR').val() == '') {
                         BzAlert("请选择设备！");
                         return;
                     }
                     if ($('#MEMO').val() == '') {
                         BzAlert("请输入问题描述！");
                         return;
                     }

                     if ($("#URGENCY_TEXT").data("kendoComboBox").value() == "NaN") {
                         BzAlert("不为空");
                         return;
                     }

                     var updapplayInfo = {
                         APPLAY_NBR: dataItem == undefined ? "" : dataItem.APPLAY_NBR,
                         MAC_NBR: MAC_NBR.rData,
                         URGENCY: parseInt($("#URGENCY_TEXT").data("kendoComboBox").value()),
                         REPAIR_STATE: dataItem.REPAIR_STATE,
                         MEMO: e.MEMO()
                     }
                     $.post(baseUrl + "UpdRepairApplayInfo", JSON.stringify(updapplayInfo), function(data) {
                         if (data.Status == 0) {
                             $("#x5window").data("kendoWindow").close();
                             refreshGrid();
                             BzSuccess(data.Message);
                         } else {
                             BzAlert(data.Message);
                         }
                     });
                 }
             }
             //}
     });
     ko.applyBindings(addviewModel, document.getElementById("addviewmodel"));
 }

 function REPAIR_STATE_Filter(element) {
     element.kendoDropDownList({
         optionLabel: "--选择--",
         dataTextField: "name",
         dataValueField: "id",
         dataSource: [
             { name: "未开始", id: 0 },
             { name: "进行中", id: 1 },
             { name: "完成", id: 2 }
         ]
     });
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
                 { field: "APPLAY_NO", Operator: "contains", value: $("#filter").val() }
             ];
         });
     }
 }

 function f_edit(e) {
     $.x5window("编辑", kendo.template($("#popup-add").html()));
     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
     addOrEdit(dataItem); //编辑
 }

 function f_del(e) {
     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
     BzConfirm("是否删除维修申请", function(e) {
         if (e) {
             $.post(baseUrl + "DelRepairApplayInfo", { applayId: dataItem.APPLAY_NBR }, function(data) {
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

 function f_goRepair(e) {
     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

     BzConfirm("是否执行维修?", function(e) {
         if (e) {
             var repairInfo = {
                 APPLAY_NBR: dataItem.APPLAY_NBR,
                 DEGREE: dataItem.URGENCY
             }
             $.post(baseUrl + "AddRepairService", repairInfo, function(data) {
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