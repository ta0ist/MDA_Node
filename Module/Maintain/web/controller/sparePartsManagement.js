 var grid, grid_1, grid_2;
 var baseUrl = "/SparePartsManagement/";
 var validator;
 var addviewModel;
 var previewModel;
 var Inoutviewmodel;
 $(function() {
     var fields = {
         PART_NBR: { type: "string" },
         PART_NAME: { type: "string" },
         PART_NO: { type: "string" },
         SPECIFICATION: { type: "string" },
         PART_TYPE: { type: "string" },
         PRICE: { type: "number" },
         INVENTORY: { type: "number" },
         UNIT: { type: "string" },
         MIN_INVENTORY: { type: "number" },
         MAX_INVENTORY: { type: "number" },
         MANUFACTUER: { type: "string" },
         INVENTORY: { type: "number" },
         MEMO: { type: "string" }
     };
     var cols = [];
     cols.push({ field: "PART_NBR", title: '配件ID', width: 80, sortable: true, filterable: true, hidden: true });
     cols.push({ field: "PART_NAME", title: '配件名称', width: 80, sortable: true, filterable: { extra: false } });
     cols.push({ field: "PART_NO", title: '配件编号', width: 80, sortable: true, filterable: { extra: false } });
     cols.push({ field: "SPECIFICATION", title: '规格型号', width: 80, sortable: true, filterable: false });
     cols.push({ field: "PART_TYPE", title: '规格类型', width: 80, sortable: true, filterable: { extra: false } });
     cols.push({ field: "PRICE", title: '单价', width: 80, sortable: true, filterable: false });
     cols.push({ field: "TOTAL_PRICE", title: '总价', width: 80, sortable: true, filterable: false, hidden: true });
     cols.push({ field: "UNIT", title: '单位', width: 80, sortable: true, filterable: false });
     cols.push({ field: "MIN_INVENTORY", title: '最大库存', width: 80, sortable: true, filterable: false });
     cols.push({ field: "MAX_INVENTORY", title: '最小库存', width: 80, sortable: true, filterable: false });
     cols.push({ field: "INVENTORY", title: '当前库存', width: 80, sortable: true, filterable: false });
     cols.push({ field: "MANUFACTUER", title: '生产厂商', width: 80, sortable: true, filterable: false });
     cols.push({ field: "MEMO", title: '描述', width: 80, sortable: true, filterable: false });
     cols.push({
         command: [
             { name: "aa", text: '编辑' + '<i class="icon-edit"></i>', className: "btn purple", click: f_edit },
             { name: "bb", text: '出库' + '<i class="icon-circle-arrow-right"></i>', className: "btn green ", click: f_out },
             { name: "cc", text: '入库' + '<i class="icon-circle-arrow-left"></i>', className: "btn green ", click: f_int }
         ],
         title: '操作',
         width: 200
     });


     grid_1 = $("#grid_1").grid({
         //checkBoxColumn: false,
         baseUrl: baseUrl, //调用的URL
         selectable: "single", //行选择方式
         scrollable: true,
         editable: false, //是否可编辑
         autoBind: false,
         height: 300,
         resizeGridWidth: true, //列宽度可调
         isPage: true,
         customsearch: true,
         server: true, //服务器端刷新，包括排序，筛选等
         actionUrl: ["GetMemberlist", "", "", "DelList"], //读、新增、更改、删除的URLaction
         custom: {
             PrimaryKey: "PART_NBR",
             fields: fields,
             cols: cols
         }
     });

     var fields_2 = {
         STOCK_NBR: { type: "string" },
         STOCK_TYPE: { type: "string" },
         INOUT_DATE: { type: "date" },
         INOUT_NO: { type: "string" },
         SUPPLIER: { type: "string" },
         INOUT_TYPE: { type: "string" },
         MEMO: { type: "string" },
         STOCK_NBR: { type: "string" },
         PART_NBR: { type: "string" },
         PART_COUNT: { type: "number" },
         INVENTORY_INIT: { type: "number" },
         INVENTORY_FINAL: { type: "number" },
         MAC_NAME: { type: "string" },
         MEM_NAME: { type: "string" }
     };
     var cols_2 = [];
     cols_2.push({ field: "STOCK_NBR", title: "ID", width: 80, sortable: true, filterable: false, hidden: true });
     cols_2.push({
         field: "STOCK_TYPE",
         title: '出入库',
         width: 80,
         sortable: true,
         filterable: {
             ui: STOCK_TYPE_Filter,
             extra: false
         },
         template: kendo.template($("#template_INOUT").html())
     });
     cols_2.push({ field: "INOUT_DATE", title: '出入库日期', format: "{0: yyyy/MM/dd HH:mm}", width: 120, sortable: true, filterable: false });
     cols_2.push({ field: "INOUT_NO", title: '单号', width: 150, sortable: true, filterable: { extra: false } });
     cols_2.push({ field: "SUPPLIER", title: '供应商', width: 80, sortable: true, filterable: false });
     cols_2.push({ field: "INOUT_TYPE", title: '出入库类型', width: 80, sortable: true, filterable: false, template: kendo.template($("#template_IN").html()) });
     cols_2.push({ field: "PART_NBR", title: '配件ID', width: 80, sortable: true, filterable: false, hidden: true });
     cols_2.push({ field: "PART_COUNT", title: '出入库数', width: 80, sortable: true, filterable: false });
     cols_2.push({ field: "INVENTORY_INIT", title: '期初库存', width: 80, sortable: true, filterable: false });
     cols_2.push({ field: "INVENTORY_FINAL", title: '期末库存', width: 80, sortable: true, filterable: false });
     cols_2.push({ field: "MAC_NAME", title: '使用设备', width: 80, sortable: true, filterable: false });
     cols_2.push({ field: "MEM_NAME", title: '领用人员', width: 80, sortable: true, filterable: false });
     cols_2.push({ field: "MEMO", title: '描述', width: 80, sortable: true, filterable: false });
     //cols_2.push({
     //    command: [
     //        { name: "aa", text: $.Translate("Common.EDIT") + '<i class="icon-edit"></i>', className: "btn purple", click: f_edit }
     //    ],
     //    title: $.Translate("Common.OPERATOR"), width: 200
     //});
     function STOCK_TYPE_Filter(element) {
         element.kendoDropDownList({
             optionLabel: "--选择--",
             dataTextField: "name",
             dataValueField: "id",
             dataSource: [
                 { name: "入库", id: 1 },
                 { name: "出库", id: 2 }
             ]
         });
     }
     grid_2 = $("#grid_2").grid({
         //checkBoxColumn: false,
         baseUrl: "/SparePartsManagement/", //调用的URL
         selectable: "single", //行选择方式
         scrollable: true,
         editable: false, //是否可编辑
         autoBind: false,
         height: 300,
         resizeGridWidth: true, //列宽度可调
         isPage: true,
         customsearch: true,
         //server: true, //服务器端刷新，包括排序，筛选等
         actionUrl: ["GetStocks", "", "", "DelList"], //读、新增、更改、删除的URLaction
         custom: {
             PrimaryKey: "PART_NBR",
             fields: fields_2,
             cols: cols_2
         }
     });

     //Grid
     grid = $("#grid").grid({
         checkBoxColumn: false,
         baseUrl: baseUrl, //调用的URL
         selectable: "single", //行选择方式
         scrollable: true,
         editable: false, //是否可编辑
         autoBind: false,
         height: 300,
         resizeGridWidth: true, //列宽度可调
         isPage: true,
         customsearch: true,
         //server: true, //服务器端刷新，包括排序，筛选等
         actionUrl: ["GetPartByType", "", "", "DelList"], //读、新增、更改、删除的URLaction
         custom: {
             PrimaryKey: "PART_NBR",
             fields: fields,
             cols: cols
         },
         rowClick: function(data) {
             //grid_2.data("bz-grid").ds.transport.options.read.url = "/TpmPart/StockManage/GetStocks";
             //获取该配件的明细
             grid_2.grid("refresh", function() {
                 return [{
                         filters: [
                             { field: "STOCK_TYPE", Operator: "eq", value: 1 },
                             { field: "STOCK_TYPE", Operator: "eq", value: 2 }
                         ],
                         logic: "or"
                     },
                     { field: "PART_NBR", Operator: "eq", value: data[0].PART_NBR }
                 ];
             }, {
                 logic: "and"
             });
         }
     })

     //getTreeData("init");
     function koModel() {
         var self = this;
         self.order_edit = function() {
             //单号维护
             $.get("/SparePartsManagement/GetRules", function(data) {
                 $.x5window("单号规则", kendo.template($("#order-template").html()));
                 previewModel = ko.mapping.fromJS({
                     PREFIX1: ko.observable(data.Data[3].PREFIX),
                     INFIX1: ko.observable(data.Data[3].INFIX),
                     SUFFIX1: ko.observable(data.Data[3].SUFFIX),
                     save: function(e) {
                         var data = [
                             { PREFIX: e.PREFIX1(), INFIX: e.INFIX1(), SUFFIX: e.SUFFIX1(), RULE_NBR: 4 }
                         ];

                         $.ajax({
                             url: "/SparePartsManagement/UpdRules",
                             type: 'post',
                             contentType: 'application/json',
                             data: JSON.stringify(data),
                             success: function(data) {
                                 if (data.Status == 0) {
                                     $("#x5window").data("kendoWindow").close();
                                     BzSuccess(data.Message);
                                 } else {
                                     BzAlert(data.Message);
                                 }
                             }
                         })

                         //  $.post("/SparePartsManagement/UpdRules", JSON.stringify(data), function(data) {
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
         self.order_notice = function() {
             $.x5window("通知", kendo.template($("#popup-notice").html()));
             SEND_MEMBER = $("#SEND_MEMBER").multipleComboxTree({
                 url: "/SparePartsManagement/GetAllMemberAndMemberGroup",
                 url2: "/SparePartsManagement/GetKeywordMemberlist",
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
                     var mm = noticeviewModel.MEMBERS();
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
                             noticeviewModel.MEMBERS.push({
                                 MEMBER_NMR: ko.observable(m),
                                 MEMBER_NAME: ko.observable(data[m]),
                                 USE_PAGE: ko.observable(true),
                                 EMAIL: ko.observable(true)
                             });
                         }
                     }
                 }
             }).data("BZ-multipleComboxTree");
             $.get(baseUrl + "GetAllPartWarnListByName", function(data) {
                 if (data.Status == 0) {
                     var tt = {};
                     for (var item in data.Data) {
                         switch (item) {
                             case "UserPage":
                                 for (var j = 0; j < data.Data[item].length; j++) {
                                     tt[data.Data[item][j].MEMBERID] = {};
                                     tt[data.Data[item][j].MEMBERID].MEMBER_NMR = data.Data[item][j].MEMBERID;
                                     tt[data.Data[item][j].MEMBERID].MEMBERNAME = data.Data[item][j].MEMBERNAME;
                                     tt[data.Data[item][j].MEMBERID].USE_PAGE = true;
                                     tt[data.Data[item][j].MEMBERID].EMAIL = typeof(tt[data.Data[item][j].MEMBERID].EMAIL) == undefined ? false : tt[data.Data[item][j].MEMBERID].EMAIL;

                                 }
                                 break;
                             case "Mail":
                                 for (var j = 0; j < data.Data[item].length; j++) {
                                     if (typeof(tt[data.Data[item][j].MEMBERID]) == "undefined") {
                                         tt[data.Data[item][j].MEMBERID] = {};
                                     }
                                     tt[data.Data[item][j].MEMBERID].MEMBER_NMR = data.Data[item][j].MEMBERID,
                                         tt[data.Data[item][j].MEMBERID].MEMBERNAME = data.Data[item][j].MEMBERNAME,
                                         tt[data.Data[item][j].MEMBERID].USE_PAGE = typeof(tt[data.Data[item][j].MEMBERID].USE_PAGE) == undefined ? false : tt[data.Data[item][j].MEMBERID].USE_PAGE,
                                         tt[data.Data[item][j].MEMBERID].EMAIL = true;
                                 }
                                 break;
                         }
                     }
                     var members = [];
                     for (var s in tt) {
                         var tjson = {};
                         tjson.MEMBER_NMR = ko.observable(tt[s].MEMBER_NMR);
                         tjson.MEMBER_NAME = ko.observable(tt[s].MEMBERNAME);
                         tjson.USE_PAGE = ko.observable(tt[s].USE_PAGE);
                         tjson.EMAIL = ko.observable(tt[s].EMAIL);
                         members.push(tjson);
                     }
                     noticeviewModel = ko.mapping.fromJS({
                         allUSE_PAGE: ko.observable(false),
                         allEMAIL: ko.observable(false),
                         MEMBERS: ko.observableArray(members),
                         allusepage: function(e) {
                             e.allUSE_PAGE(!e.allUSE_PAGE());
                             var obj = noticeviewModel.MEMBERS();
                             for (var i = 0; i < obj.length; i++) {
                                 obj[i].USE_PAGE(e.allUSE_PAGE());
                             }
                         },
                         allemail: function(e) {
                             e.allEMAIL(!e.allEMAIL());
                             var obj = noticeviewModel.MEMBERS();
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
                             noticeviewModel.MEMBERS.remove(item)
                         },
                         save: function(e) {
                             //发送消息
                             var obj = noticeviewModel.MEMBERS();
                             var SendList = ["UserPage", "Mail"];
                             var SendListData = [];
                             for (var p = 0; p < SendList.length; p++) {
                                 var tjson = {};
                                 tjson.TYPENAME = SendList[p];
                                 //tjson.NoticeSource = "";
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
                                 tjson.MemberList = dd;
                                 SendListData.push(tjson);
                             }
                             var datap = {
                                 partWarnConfigList: SendListData
                             }


                             $.ajax({
                                 url: baseUrl + "ModifyPartWarnConfig",
                                 type: 'post',
                                 contentType: 'application/json',
                                 data: JSON.stringify(data),
                                 success: function(datap) {
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

                             //  $.post(baseUrl + "ModifyPartWarnConfig", JSON.stringify(datap), function(data) {
                             //      if (data.Status == 0) {
                             //          $("#x5window").data("kendoWindow").close();
                             //          //setUrl("GetParts");
                             //          refreshGrid();
                             //          BzSuccess(data.Message);
                             //      } else {
                             //          BzAlert(data.Message);
                             //      }
                             //  });
                         }
                     });
                     ko.applyBindings(noticeviewModel, document.getElementById("nviewmodel"));
                 } else {
                     BzAlert(data.Message);
                 }
             });

         };
         self.tree_refresh = function() {
             getTreeData("refresh");
         };
         self.grid_add = function(e) {
             $.x5window('新增', kendo.template($("#popup-add").html()));
             addOrEdit(); //新增
         };
     }
     var u = new koModel();
     ko.applyBindings(u);

     $("#tree_expand").toggle(function() {
         $("#orgnizetree").data("kendoTreeView").expand(".k-item");
     }, function() {
         $("#orgnizetree").data("kendoTreeView").collapse(".k-item");
     });
     $('#filter').bind('keypress', function(event) {
         if (event.keyCode == "13") {
             getDataByKeyWord();
         }
     });
     setUrl("GetParts");
     grid.grid("refresh");
 });

 function getTreeData(ss) {
     $.get(baseUrl + "GetPartType", function(data) {
         if (data.Status == 0) {
             var type = [];
             for (var i = 0; i < data.Data.length; i++) {
                 var tjson = {
                     text: data.Data[i],
                     type: "PART_TYPE"
                 }
                 type.push(tjson);
             }

             datasouce.push({ text: '所有配件', type: "all" });
             if (type.length > 0) {
                 datasouce.push({ text: "按类型", type: "null", items: type, expanded: true });
             } else {
                 datasouce.push({ text: "按类型", type: "null" });
             }
             datasouce.push({
                 text: "库存预警",
                 expanded: true,
                 type: "stock",
                 items: [
                     { text: "高于上限", type: "stockHigh" },
                     { text: "低于上限", type: "stockLow" }
                 ]
             });
             if (ss == "init") {
                 $("#orgnizetree").kendoTreeView({
                     dataSource: {
                         data: datasouce
                     },
                     template: kendo.template($("#treeview-template").html()),
                     select: function(e) {
                         var type = $(e.node).find('[attr="treenode"]').attr("type");
                         if (type == "all") {
                             setUrl("GetParts");
                             grid.grid("refresh", function() {
                                 return [];
                             });
                         } else if (type == "PART_TYPE") {
                             setUrl("GetPartByType");
                             grid.grid("refresh", function() {
                                 var treeobj = $("#orgnizetree").data("kendoTreeView");
                                 var selectedNode = treeobj.select();
                                 return [
                                     { field: "PART_TYPE", Operator: "eq", value: $(e.node).find('[attr="treenode"]').text() }
                                 ];
                             });
                         } else if (type == "stockHigh") {

                         } else if (type == "stockLow") {

                         }
                     }
                 }).data("kendoTreeView"); //.collapse(".k-item");
             } else {
                 $("#orgnizetree").data("kendoTreeView").setDataSource(new kendo.data.HierarchicalDataSource({
                     data: datasouce
                 }));
             }
             //刷新所有
             var treeview = $("#orgnizetree").data("kendoTreeView")
             treeview.select($(".k-item:first"));
             setUrl("GetParts");
             grid.grid("refresh");
         } else {
             BzAlert(data.Message);
         }
     });
 }

 function addOrEdit(dataItem) {
     //App.initUniform();
     //验证
     validator = $("#memberviewmodel").validate({
         rules: {
             PART_NAME: { required: true },
             PART_NO: { required: true },
             SPECIFICATION: { required: true },
             PART_TYPE: { required: true }
         },
         messages: {
             PART_NAME: { required: '不为空！' },
             PART_NO: { required: '不为空！' },
             SPECIFICATION: { required: '不为空！' },
             PART_TYPE: { required: '不为空！' }
         }
     });


     addviewModel = ko.mapping.fromJS({
         PART_NAME: ko.observable(dataItem == undefined ? "" : dataItem.PART_NAME),
         PART_NO: ko.observable(dataItem == undefined ? "" : dataItem.PART_NO),
         SPECIFICATION: ko.observable(dataItem == undefined ? "" : dataItem.SPECIFICATION),
         PART_TYPE: ko.observable(dataItem == undefined ? "" : dataItem.PART_TYPE),
         UNIT: ko.observable(dataItem == undefined ? "" : dataItem.UNIT),
         MANUFACTUER: ko.observable(dataItem == undefined ? "" : dataItem.MANUFACTUER),
         MEMO: ko.observable(dataItem == undefined ? "" : dataItem.MEMO),
         save: function(e) {
             if (validator.form()) {
                 var data = {
                     PART_NBR: dataItem == undefined ? "" : dataItem.PART_NBR,
                     PART_NAME: e.PART_NAME(),
                     PART_NO: e.PART_NO(),
                     SPECIFICATION: e.SPECIFICATION(),
                     PART_TYPE: e.PART_TYPE(),
                     UNIT: e.UNIT(),
                     MANUFACTUER: e.MANUFACTUER(),
                     MEMO: e.MEMO(),
                     PRICE: $("#PRICE").data("kendoNumericTextBox").value(),
                     MIN_INVENTORY: $("#MIN_INVENTORY").data("kendoNumericTextBox").value(),
                     MAX_INVENTORY: $("#MAX_INVENTORY").data("kendoNumericTextBox").value(),
                     INVENTORY: $("#INVENTORY").data("kendoNumericTextBox").value(),
                 }
                 if (dataItem == undefined) { //新增
                     $.ajax({
                         url: baseUrl + "AddPart",
                         type: 'post',
                         contentType: 'application/json',
                         data: JSON.stringify(data),
                         success: function(data) {
                             if (data.Status == 0) {
                                 $("#x5window").data("kendoWindow").close();
                                 setUrl("GetParts");
                                 refreshGrid();
                                 BzSuccess(data.Message);
                             } else {
                                 BzAlert(data.Message);
                             }
                         }
                     })

                     //  $.post(baseUrl + "AddPart", JSON.stringify(data), function(data) {
                     //      if (data.Status == 0) {
                     //          $("#x5window").data("kendoWindow").close();
                     //          setUrl("GetParts");
                     //          refreshGrid();
                     //          BzSuccess(data.Message);
                     //      } else {
                     //          BzAlert(data.Message);
                     //      }
                     //  });
                 } else {
                     $.ajax({
                         url: baseUrl + "UpdPart",
                         type: 'post',
                         contentType: 'application/json',
                         data: JSON.stringify(data),
                         success: function(data) {
                             if (data.Status == 0) {
                                 $("#x5window").data("kendoWindow").close();
                                 setUrl("GetParts");
                                 refreshGrid();
                                 BzSuccess(data.Message);
                             } else {
                                 BzAlert(data.Message);
                             }
                         }
                     })

                     //  $.post(baseUrl + "UpdPart", JSON.stringify(data), function(data) {
                     //      if (data.Status == 0) {
                     //          $("#x5window").data("kendoWindow").close();
                     //          setUrl("GetParts");
                     //          refreshGrid();
                     //          BzSuccess(data.Message);
                     //      } else {
                     //          BzAlert(data.Message);
                     //      }
                     //  });
                 }
             }
         }
     });
     ko.applyBindings(addviewModel, document.getElementById("memberviewmodel"));
     $("#PRICE").kendoNumericTextBox({ format: "c2", min: 0, value: dataItem == undefined ? 0 : dataItem.PRICE });
     $("#MIN_INVENTORY").kendoNumericTextBox({ format: "n0", min: 0, value: dataItem == undefined ? 0 : dataItem.MIN_INVENTORY });
     $("#MAX_INVENTORY").kendoNumericTextBox({ format: "n0", min: 0, value: dataItem == undefined ? 0 : dataItem.MAX_INVENTORY });
     $("#INVENTORY").kendoNumericTextBox({ format: "n0", min: 0, value: dataItem == undefined ? 0 : dataItem.INVENTORY });
 }

 function setUrl(method) {
     grid.data("bz-grid").ds.transport.options.read.url = baseUrl + method;
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
             return [{
                 filters: [{
                         field: "PART_NAME",
                         Operator: "contains",
                         value: $("#filter").val()
                     },
                     {
                         field: "PART_NO",
                         Operator: "contains",
                         value: $("#filter").val()
                     }
                 ],
                 logic: "or"
             }];
         });
     }
 }

 function f_edit(e) {
     $.x5window('编辑', kendo.template($("#popup-add").html()));
     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
     addOrEdit(dataItem); //编辑
 }

 function f_out(e) {

     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
     if (dataItem.INVENTORY <= 0) {
         BzAlert("该配件无库存,不能出库");
         return;
     }
     $.x5window("出库", kendo.template($("#out-template").html()));
     //App.initUniform();

     $("#OUT_TYPE").kendoComboBox({
         dataTextField: "text",
         dataValueField: "value",
         dataSource: [
             { text: "采购退货出库", value: 1 },
             { text: "销售提货出库", value: 2 },
             { text: "对账出库", value: 5 },
             { text: "保养出库", value: 3 },
             { text: "维修出库", value: 4 }
             //{ text: "保养出库", value: 6 },
             //{ text: "维修出库", value: 7 }
         ],
         value: "DEFAULT",
         select: function(e) {
             var dataItem = this.dataItem(e.item.index());
             if (dataItem.value == 3 || dataItem.value == 6) {
                 Inoutviewmodel.maintainOrRepair(1);
             } else if (dataItem.value == 4 || dataItem.value == 7) {
                 Inoutviewmodel.maintainOrRepair(2);
             } else {
                 Inoutviewmodel.maintainOrRepair(0);
             }
         }
     }).data("kendoComboBox").value(1);


     APPLAY_NO = $("#APPLAY_NO").multipleComboxTree({
         url: "/MaintenanceWrite/GetApplay_NO",
         url2: "/MaintenanceWrite/GetApplay_NO",
         type: 10,
         inputheight: 20,
         width: 171,
         diffwidth: 37,
         diffinputwidth: 13,
         multiple: false,
         tree: false
     }).data("BZ-multipleComboxTree");

     MAINTAIN_NO = $("#MAINTAIN_NO").multipleComboxTree({
         url: "/MaintenancePlan/GetAllNoMaintainList",
         url2: "/MaintenancePlan/GetAllNoMaintainList",
         type: 9,
         inputheight: 20,
         width: 171,
         diffwidth: 37,
         diffinputwidth: 13,
         multiple: false,
         tree: false
     }).data("BZ-multipleComboxTree");

     MAC_NBRS = $("#MAC_NBR").comboxTree({
         url: "/Alarm/GetAllMachineAndMachineGroup",
         url2: "/Alarm/GetKeywordMachinelist",
         data: { groupID: 0 },
         treetemplate: $("#treeview-template_out").html(),
         width: 172,
         diffwidth: 36,
         type: 2,

     }).data("BZ-comboxTree");

     PEO_NBRS = $("#OPERATOR").comboxTree({
         url: "/account/GetAllMemberAndMemberGroup",
         url2: "/account/GetKeywordMemberlist",
         data: { groupID: 0 },
         treetemplate: $("#treeview-template_out").html(),
         width: 172,
         diffwidth: 36,
         type: 4,

     }).data("BZ-comboxTree");

     var dataarray = [{
         PART_NBR: dataItem.PART_NBR,
         PART_NO: dataItem.PART_NO,
         PART_NAME: dataItem.PART_NAME,
         PART_TYPE: dataItem.PART_TYPE,
         OUT_NUM: 1,
         PRICE: dataItem.PRICE,
         TOTAL_PRICE: dataItem.PRICE,
         INVENTORY_INIT: dataItem.INVENTORY,
         INVENTORY_FINAL: dataItem.INVENTORY - 1,
         outnumshow: false,
         partnoshow: false
     }];
     Inoutviewmodel = ko.mapping.fromJS({
         STOCK_TYPE: ko.observable(2), //出库
         //INOUT_TYPE: ko.observable(""),//出库类型
         MEMO: ko.observable(""),
         parts: ko.observableArray(dataarray), //出库配件
         allparts: ko.observableArray([]), //所有配件
         totalPrice: ko.observable(dataarray[0].TOTAL_PRICE), //总金额
         index: ko.observable(0), //索引
         maintainOrRepair: ko.observable(0),
         save: function(e) {
             var partslist = [];
             var parts = this.parts();
             for (var i = 0; i < parts.length; i++) {
                 var info = {
                     //STOCK_TYPE: this.STOCK_TYPE(),//出库
                     //INOUT_TYPE: $("#OUT_TYPE").data("kendoComboBox").value(),//出库类型
                     PART_NBR: parts[i].PART_NBR(), //配件ID
                     PART_COUNT: parts[i].OUT_NUM(), //出库数
                     INVENTORY_INIT: parts[i].INVENTORY_INIT(), //期初库存
                     INVENTORY_FINAL: parts[i].INVENTORY_FINAL(), //期末库存
                     //INOUT_DATE: moment(Date()).format("YY-MM-DD HH:mm"),
                     //MAC_NBR: MAC_NBRS.rData,
                     //MEM_NBR: PEO_NBRS.rData,
                     //MEMO: this.MEMO()
                 };
                 partslist.push(info);
             }
             var INOUT_ID = [];
             var INOUT_TYPE = $("#OUT_TYPE").data("kendoComboBox").value();
             if (INOUT_TYPE == 3) {
                 for (var m in $("#MAINTAIN_NO").data("BZ-multipleComboxTree").dataAarry) {
                     INOUT_ID.push(m);
                 }
             } else if (INOUT_TYPE == 4) {
                 for (var m in $("#APPLAY_NO").data("BZ-multipleComboxTree").dataAarry) {
                     INOUT_ID.push(m);
                 }
             }
             if (MAC_NBRS.rData == null || PEO_NBRS.rData == null) {
                 BzAlert('不为空！');
                 return;
             }
             var stockinfo = {
                 Stock: {
                     STOCK_TYPE: this.STOCK_TYPE(), //出库
                     INOUT_TYPE: INOUT_TYPE, //出库类型
                     MAC_NBR: MAC_NBRS.rData,
                     MEM_NBR: PEO_NBRS.rData,
                     MEMO: this.MEMO(),
                     INOUT_ID: parseInt(INOUT_ID[0])
                 },
                 PartList: partslist
             }

             $.ajax({
                 url: baseUrl + "AddOutStock",
                 type: 'post',
                 contentType: 'application/json',
                 data: JSON.stringify(stockinfo),
                 success: function(data) {
                     if (data.Status == 0) {
                         grid.grid("refresh", function() {
                             return [];
                         });
                         $("#x5window").data("kendoWindow").close();
                         BzSuccess(data.Message);
                     } else {
                         BzAlert(data.Message);
                     }
                 }
             })

             //  $.post("/TpmPart/StockManage/AddOutStock", JSON.stringify(stockinfo), function(data) {
             //      if (data.Status == 0) {
             //          grid.grid("refresh", function() {
             //              return [];
             //          });
             //          $("#x5window").data("kendoWindow").close();
             //          BzSuccess(data.Message);
             //      } else {
             //          BzAlert(data.Message);
             //      }
             //  });
             Inoutviewmodel.parts;
         },
         //筛选配件
         searchPart: function(e, event) {
             e.partnoshow(true);
             $(event.currentTarget).find("input").focus()
             $.get(baseUrl + "GetParts", function(data) {
                 //过滤配件
                 var ndata = [];
                 for (var i = 0; i < data.Data.List.length; i++) {
                     var has = false;
                     for (var j = 0; j < Inoutviewmodel.parts().length; j++) {
                         if (data.Data.List[i].PART_NO == Inoutviewmodel.parts()[j].PART_NO()) {
                             has = true;
                         }
                     }
                     if (!has) {
                         ndata.push(data.Data.List[i]);
                     }
                 }
                 Inoutviewmodel.allparts(ndata);
                 //ko.mapping.fromJS(data, Inoutviewmodel);
                 $("#partList").css({
                     top: ($(event.currentTarget).find("input").offset().top - $("#x5window").parent().offset().top - 25) + "px",
                     left: "28px"
                 }).show();
                 event.stopPropagation();
             });
             Inoutviewmodel.index(parseInt($(event.currentTarget).attr("index")));

         },
         //选择配件
         selectPart: function(e, event) {
             var index = Inoutviewmodel.index();
             var obj = Inoutviewmodel.parts()[index];
             obj.PART_NBR(e.PART_NBR);
             obj.PART_NO(e.PART_NO);
             obj.PART_NAME(e.PART_NAME);
             obj.PART_TYPE(e.PART_TYPE);
             obj.OUT_NUM(1);
             obj.PRICE(e.PRICE);
             obj.TOTAL_PRICE(e.PRICE);
             obj.INVENTORY_INIT(e.INVENTORY);
             obj.INVENTORY_FINAL(e.INVENTORY - 1);
             //更新总金额
             Inoutviewmodel.updateTotalPrice();
         },
         formclick: function() {
             $("#partList").hide();
         },
         //配件编号移除焦点事件
         partNoRemoveFouse: function(e) {
             e.partnoshow(false);

         },
         coutnum: function(e, event) {
             e.outnumshow(true);
             $(event.currentTarget).find("input").focus()
         },
         deleteItem: function(item) {
             Inoutviewmodel.parts.remove(item)
             Inoutviewmodel.updateTotalPrice();
         },
         updateTotalPrice: function() {
             var tprice = 0;
             for (var i = 0; i < Inoutviewmodel.parts().length; i++) {
                 tprice = tprice + Inoutviewmodel.parts()[i].TOTAL_PRICE();
             }
             Inoutviewmodel.totalPrice(tprice);
         },
         //新增配件
         addItem: function(e, event) {
             var data = {
                 PART_NBR: ko.observable(""),
                 PART_NO: ko.observable(""),
                 PART_NAME: ko.observable(""),
                 PART_TYPE: ko.observable(""),
                 OUT_NUM: ko.observable(0),
                 PRICE: ko.observable(0.00),
                 TOTAL_PRICE: ko.observable(0.00),
                 INVENTORY_INIT: ko.observable(0),
                 INVENTORY_FINAL: ko.observable(0),
                 outnumshow: ko.observable(false),
                 partnoshow: ko.observable(false)
             }
             this.parts.push(data);
         },
         ml: function() { //更新 Part.Msg1
             this.outnumshow(false);
             //计算总金额 htc:170425
             //this.TOTAL_PRICE(this.OUT_NUM() * this.TOTAL_PRICE());
             this.TOTAL_PRICE(this.OUT_NUM() * this.PRICE());
             if ((parseInt(this.INVENTORY_INIT()) - parseInt(this.OUT_NUM())) < 0) {
                 BzAlert(String.format('出库数{0}不能大于期初库存{1}', this.OUT_NUM(), this.INVENTORY_INIT()));
                 this.OUT_NUM(this.INVENTORY_INIT() - this.INVENTORY_FINAL());
                 return;
             }
             this.INVENTORY_FINAL(parseInt(this.INVENTORY_INIT()) - parseInt(this.OUT_NUM()));
             Inoutviewmodel.updateTotalPrice();
         }
     });
     ko.applyBindings(Inoutviewmodel, document.getElementById("Inoutviewmodel"));
 };
 //入库
 function f_int(e) {
     $.x5window("入库", kendo.template($("#in-template").html()));
     //App.initUniform();
     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

     PEO_NBRS = $("#OPERATOR").comboxTree({
         url: "/account/GetAllMemberAndMemberGroup",
         url2: "/account/GetKeywordMemberlist",
         data: { groupID: 0 },
         treetemplate: $("#treeview-template_out").html(),
         width: 172,
         diffwidth: 36,
         type: 4,

     }).data("BZ-comboxTree");


     $("#IN_TYPE").kendoComboBox({
         dataTextField: "text",
         dataValueField: "value",
         dataSource: [
             { text: "采购入库", value: 1 },
             { text: "生产入库", value: 2 },
             { text: "对账入库", value: 5 },
             { text: "保养入库", value: 3 },
             { text: "维修入库", value: 4 }
         ],
         value: "DEFAULT"
     }).data("kendoComboBox").value(1);
     var dataarray = [{
         PART_NBR: dataItem.PART_NBR,
         PART_NO: dataItem.PART_NO,
         PART_NAME: dataItem.PART_NAME,
         PART_TYPE: dataItem.PART_TYPE,
         OUT_NUM: 1,
         PRICE: dataItem.PRICE,
         TOTAL_PRICE: dataItem.PRICE,
         INVENTORY_INIT: dataItem.INVENTORY,
         INVENTORY_FINAL: dataItem.INVENTORY + 1,
         outnumshow: false,
         partnoshow: false
     }];
     Inoutviewmodel = ko.mapping.fromJS({
         STOCK_TYPE: ko.observable(1), //入库
         SUPPLIER: ko.observable(""), //供应商
         MEMO: ko.observable(""),
         parts: ko.observableArray(dataarray), //入库配件
         allparts: ko.observableArray([]), //所有配件
         totalPrice: ko.observable(dataarray[0].TOTAL_PRICE), //总金额
         index: ko.observable(0), //索引
         save: function(e) {
             var partslist = [];
             var parts = this.parts();
             for (var i = 0; i < parts.length; i++) {
                 var info = {
                     //STOCK_TYPE: this.STOCK_TYPE(),//出库
                     //INOUT_TYPE: $("#OUT_TYPE").data("kendoComboBox").value(),//出库类型
                     PART_NBR: parts[i].PART_NBR(), //配件ID
                     PART_COUNT: parts[i].OUT_NUM(), //出库数
                     INVENTORY_INIT: parts[i].INVENTORY_INIT(), //期初库存
                     INVENTORY_FINAL: parts[i].INVENTORY_FINAL() //期末库存
                         //INOUT_DATE: moment(Date()).format("YY-MM-DD HH:mm"),
                         //MAC_NBR: MAC_NBRS.rData,
                         //MEM_NBR: PEO_NBRS.rData,
                         //MEMO: this.MEMO()
                 };
                 partslist.push(info);
             }
             if (PEO_NBRS.rData == null) { BzAlert('不为空！'); return; }
             var stockinfo = {
                 Stock: {
                     STOCK_TYPE: this.STOCK_TYPE(), //出库
                     INOUT_TYPE: $("#IN_TYPE").data("kendoComboBox").value(), //出库类型
                     //MAC_NBR: MAC_NBRS.rData,
                     SUPPLIER: this.SUPPLIER(),
                     MEM_NBR: PEO_NBRS.rData,
                     MEMO: this.MEMO()
                 },
                 PartList: partslist
             }

             $.ajax({
                 url: baseUrl + "AddInStock",
                 type: 'post',
                 contentType: 'application/json',
                 data: JSON.stringify(stockinfo),
                 success: function(data) {
                     if (data.Status == 0) {
                         grid.grid("refresh", function() {
                             return [];
                         });
                         $("#x5window").data("kendoWindow").close();
                         BzSuccess(data.Message);
                     } else {
                         BzAlert(data.Message);
                     }
                 }
             })


             //  $.post("/TpmPart/StockManage/AddInStock", JSON.stringify(stockinfo), function(data) {
             //      if (data.Status == 0) {
             //          grid.grid("refresh", function() {
             //              return [];
             //          });
             //          $("#x5window").data("kendoWindow").close();
             //          BzSuccess(data.Message);
             //      } else {
             //          BzAlert(data.Message);
             //      }
             //  });
             Inoutviewmodel.parts;
         },
         //筛选配件
         searchPart: function(e, event) {
             e.partnoshow(true);
             $(event.currentTarget).find("input").focus()
             $.get(baseUrl + "GetParts", function(data) {
                 //过滤配件
                 var ndata = [];
                 for (var i = 0; i < data.Data.List.length; i++) {
                     var has = false;
                     for (var j = 0; j < Inoutviewmodel.parts().length; j++) {
                         if (data.Data.List[i].PART_NO == Inoutviewmodel.parts()[j].PART_NO()) {
                             has = true;
                         }
                     }
                     if (!has) {
                         ndata.push(data.Data.List[i]);
                     }
                 }
                 Inoutviewmodel.allparts(ndata);
                 //ko.mapping.fromJS(data, Inoutviewmodel);
                 $("#partList").css({
                     top: ($(event.currentTarget).find("input").offset().top - $("#x5window").parent().offset().top - 25) + "px",
                     left: "28px"
                 }).show();
                 event.stopPropagation();
             });
             Inoutviewmodel.index(parseInt($(event.currentTarget).attr("index")));

         },
         //选择配件
         selectPart: function(e, event) {
             var index = Inoutviewmodel.index();
             var obj = Inoutviewmodel.parts()[index];
             obj.PART_NBR(e.PART_NBR);
             obj.PART_NO(e.PART_NO);
             obj.PART_NAME(e.PART_NAME);
             obj.PART_TYPE(e.PART_TYPE);
             obj.OUT_NUM(1);
             obj.PRICE(e.PRICE);
             obj.TOTAL_PRICE(e.PRICE);
             obj.INVENTORY_INIT(e.INVENTORY);
             obj.INVENTORY_FINAL(e.INVENTORY + 1);
             //更新总金额
             Inoutviewmodel.updateTotalPrice();
         },
         formclick: function() {
             $("#partList").hide();
         },
         //配件编号移除焦点事件
         partNoRemoveFouse: function(e) {
             e.partnoshow(false);

         },
         coutnum: function(e, event) {
             e.outnumshow(true);
             $(event.currentTarget).find("input").focus()
         },
         deleteItem: function(item) {
             Inoutviewmodel.parts.remove(item)
             Inoutviewmodel.updateTotalPrice();
         },
         updateTotalPrice: function() {
             var tprice = 0;
             for (var i = 0; i < Inoutviewmodel.parts().length; i++) {
                 tprice = tprice + Inoutviewmodel.parts()[i].TOTAL_PRICE();
             }
             Inoutviewmodel.totalPrice(tprice);
         },
         addItem: function(e, event) {
             var data = {
                 PART_NBR: ko.observable(""),
                 PART_NO: ko.observable(""),
                 PART_NAME: ko.observable(""),
                 PART_TYPE: ko.observable(""),
                 OUT_NUM: ko.observable(0),
                 PRICE: ko.observable(0.00),
                 TOTAL_PRICE: ko.observable(0.00),
                 INVENTORY_INIT: ko.observable(0),
                 INVENTORY_FINAL: ko.observable(0),
                 outnumshow: ko.observable(false),
                 partnoshow: ko.observable(false)
             }
             this.parts.push(data);
         },
         ml: function() { //更新
             this.outnumshow(false);
             //计算总金额 htc:170425
             //this.TOTAL_PRICE(this.OUT_NUM() * this.TOTAL_PRICE());
             this.TOTAL_PRICE(this.OUT_NUM() * this.PRICE());

             this.INVENTORY_FINAL(parseInt(this.INVENTORY_INIT()) + parseInt(this.OUT_NUM()));
             Inoutviewmodel.updateTotalPrice();
         }
     });
     ko.applyBindings(Inoutviewmodel, document.getElementById("Inoutviewmodel"));

 }

 function formatPrice(price) {
     return price = price.toFixed(2);
 }