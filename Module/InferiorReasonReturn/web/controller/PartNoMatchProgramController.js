 var grid;
 var baseUrl = "/partNoMatchProgram/";
 var validator;
 var addviewModel;
 $(function() {
     var fields = {
         PART_NO: { type: "string" },
         PART_PRO_NBR: { type: "string" },
         PROGRAM_NO: { type: "string" },
     };
     var cols = [];
     cols.push({ field: "PART_PRO_NBR", title: "", width: 80, sortable: true, filterable: false, hidden: true });
     cols.push({ field: "PART_NO", title: '零件号', width: 80, sortable: true, filterable: false });
     cols.push({ field: "PROGRAM_NO", title: '零件程序号', width: 80, sortable: true, filterable: false });
     cols.push({
         command: [
             { name: "aa", text: '编辑' + '<i class="icon-edit"></i>', className: "btn purple", click: f_edit },
             { name: "bb", text: '删除' + '<i class="icon-remove-sign"></i>', className: "btn red ", click: f_delete }
         ],
         title: '操作',
         width: 200
     });
     //Grid
     grid = $("#grid").grid({
         checkBoxColumn: true,
         baseUrl: baseUrl, //调用的URL
         selectable: "single", //行选择方式
         //sort: [{ field: "USER_NBR", dir: "ASC" }],
         scrollable: true,
         editable: false, //是否可编辑
         autoBind: false,
         resizeGridWidth: true, //列宽度可调
         isPage: true,
         //detailTemplate: kendo.template($("#detail-template").html()),
         //server: true, //服务器端刷新，包括排序，筛选等
         actionUrl: ["getPartMatchProgramInitList", "", "", "DelList"], //读、新增、更改、删除的URLaction
         custom: {
             PrimaryKey: "PART_PRO_NBR",
             fields: fields,
             cols: cols
         }
     });
     $("#contextPage").resize(function() {
         grid.data("bz-grid").resizeGridWidth();
     });

     function koModel() {
         var self = this;
         self.grid_add = function(e) {
             $.x5window('新增', kendo.template($("#popup-add").html()));
             addOrEdit(); //新增          
         };
         self.grid_delete = function() {
             BzConfirm('请确认是否要删除数据', function(e) {
                 if (e) {
                     var dd = grid.data("bz-grid").checkedDataRows();
                     var li = [];
                     for (var i = 0; i < dd.length; i++) {
                         li.push(dd[i].PART_PRO_NBR);
                     }
                     $.post("/partNoMatchProgram/DeletePartNoMacthProgram", { li: li }, function(data) {

                         refreshGrid();
                         BzSuccess('操作成功！');

                     });
                 }
             });
         };
     }
     var u = new koModel();
     ko.applyBindings(u);
     // getDataByKeyWord();
     grid.grid("refresh", function() {
         return [
             { field: "keyword", Operator: "eq", Keywords: $("#filter").val(), Keywords: $("#filter").val() }
         ];
     });

     $('#filter').bind('keypress', function(event) {
         if (event.keyCode == "13") {
             // getDataByKeyWord();

             grid.grid("refresh", function() {
                 return [
                     { field: "PART_NO", Operator: "contains", Keywords: $("#filter").val(), flag: "false" },
                 ];
             });
         }
     });
     $("#search").click(function() {
         grid.grid("refresh", function() {
             return [
                 { field: "PART_NO", Operator: "contains", Keywords: $("#filter").val(), flag: "false" },
             ];
         });
     })
 });

 function addOrEdit(dataItem) {
     //验证
     validator = $("#machineviewmodel").validate({
         rules: {
             MAC_NO: { required: true },
             MAC_NAME: { required: true }
         },
         messages: {
             MAC_NO: { required: '内容不能为空' },
             MAC_NAME: { required: '内容不能为空' }
         }
     });
     addviewModel = ko.mapping.fromJS({
         PART_PRO_NBR: ko.observable(dataItem == undefined ? "" : dataItem.PART_PRO_NBR),
         PART_NO: ko.observable(dataItem == undefined ? "" : dataItem.PART_NO),
         PROGRAM_NO: ko.observable(dataItem == undefined ? "" : dataItem.PROGRAM_NO),
         galleryshow: function(e) {
             if ($("#Gallery").is(":hidden")) {
                 $("#Gallery").show();
             } else {
                 $("#Gallery").hide();
             }
         },
         save: function(e) {
             if (validator.form()) {
                 var treeobj = $("#orgnizetree").data("kendoTreeView");
                 //var selectedNode = treeobj.select();
                 var data = {
                     PART_PRO_NBR: e.PART_PRO_NBR(),
                     PART_NO: e.PART_NO(),
                     PROGRAM_NO: e.PROGRAM_NO(),
                 }
                 if (dataItem == undefined) { //新增
                     $.post("/partNoMatchProgram/AddPartNoMacthProgram", data, function(data) {
                         if (data.Data == 0) {
                             $("#x5window").data("kendoWindow").close();
                             refreshGrid();
                             BzSuccess('操作成功！');
                         } else {
                             BzAlert('该零件程序号已存在！')
                         }


                     });
                 } else {
                     $.post("/partNoMatchProgram/UpdatePartNoMacthProgram", data, function(data) {

                         $("#x5window").data("kendoWindow").close();
                         refreshGrid();
                         BzSuccess('操作成功！');

                     });
                 }
             }
         }
     });
     ko.applyBindings(addviewModel, document.getElementById("machineviewmodel"));
     $.post("/manPartNoProdCount/GetAllPartNoList", function(data) {

         var comboxData = [];
         for (var i = 0; i < data.Data.length; i++) {
             var obj = {};
             obj.text = data.Data[i];
             obj.value = data.Data[i];
             comboxData.push(obj);
         }
         $("#PART_NO").kendoComboBox({
             dataTextField: "text",
             dataValueField: "value",
             dataSource: comboxData,
             value: data.Data[0]
         }).data("kendoComboBox").value(dataItem == undefined ? '请选择零件号' : dataItem.PART_NO);

     });
     $.post("/partNoMatchProgram/GetAllProgramNoList", function(data) {

         var comboxData = [];
         for (var i = 0; i < data.Data.length; i++) {
             var obj = {};
             obj.text = data.Data[i];
             obj.value = data.Data[i];
             comboxData.push(obj);
         }
         $("#PROGRAM_NO").kendoComboBox({
             dataTextField: "text",
             dataValueField: "value",
             dataSource: comboxData,
             value: data.Data[0]
         }).data("kendoComboBox").value(dataItem == undefined ? '请选择程序号' : dataItem.PROGRAM_NO);

     });
 }

 function refreshGrid() {
     if ($("#filter").val() == "") {
         grid.grid("refresh", function() {
             return [
                 { field: "PART_NO", Operator: "contains", Keywords: "", flag: "false" },
             ]

         });
     } else {
         getDataByKeyWord();
     }
 }

 function getDataByKeyWord() { //关键字查询
     var ds = grid.data("bz-grid").ds;
     var parm = {
         page: ds._page,
         pageSize: ds._pageSize,
         keyword: $("#filter").val()
             // userType: parseInt($('.nav-tabs li[class="active"]').attr("value"))
     }
     $.post(baseUrl + "getPartMatchProgramList", parm, function(data) {

         grid.data("bz-grid").ds.data(data.Data);

     });
 }

 function f_edit(e) {
     $.x5window('编辑', kendo.template($("#popup-add").html()));
     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
     addOrEdit(dataItem); //编辑
 }

 function f_delete(e) {
     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
     BzConfirm('请确认是否要删除数据', function(e) {
         if (e) {
             $.post("/partNoMatchProgram/DeletePartNoMacthProgram", { li: [dataItem.PART_PRO_NBR] }, function(data) {

                 refreshGrid();
                 BzSuccess('操作成功！');

             });
         }
     });
 }