 angular.module('app', []).controller('appCtrl', function($scope) {
     var baseUrl = $.getparam("url");
     var par = $.getparam("par")
     var grid;

     var fields = {
         MEASURE_NBR: { type: "int" }, //量具id
         MEASURE_TYPE: { type: "string" }, //量具类型
         MEASURE_NO: { type: "string" }, //量具编号
         MEASURE_NAME: { type: "string" }, //量具名称（设备名称）
         MANUFACTURER: { type: "string" }, //制造商
         BUY_DATE: { type: "date" }, //购买日期
         MEASURE_RANG: { type: "string" }, //规格、精度及测量范围
         RELEASE_POSITION: { type: "string" }, //发放位置/放置位置
         CALIBRATION_CYCLE: { type: "int" }, //校准周期
         LAST_CALIBRATION_DATE: { type: "date" }, //上次校验时间
         NEXT_CALIBRATION_DATE: { type: "date" }, //计划下次校验时间
         MEASURE_STATE: { type: "int" }, //状态
         CALIBRATION_TYPE: { type: "int" }, //校准方式
         MEMO: { type: "string" }, //备注
         IS_SCRAP: { type: "int" }, //是否报废
         SCRAP_MEMO: { type: "string" }, //报废备注（原因）
     };

     var cols = [];
     cols.push({ field: "MEASURE_NBR", title: "量具id", width: 120, sortable: true, filterable: false, hidden: true });
     cols.push({ field: "MEASURE_TYPE", title: "类型", width: 110, sortable: true, filterable: false, hidden: false });
     cols.push({ field: "MEASURE_NO", title: "编号", width: 80, sortable: true, filterable: false });
     cols.push({ field: "MEASURE_NAME", title: "量具名称", width: 110, sortable: true, filterable: false });
     cols.push({ field: "MANUFACTURER", title: "制造商", width: 110, sortable: true, filterable: false });

     cols.push({ field: "BUY_DATE", title: "购买日期", width: 120, sortable: true, filterable: false, format: "{0: yyyy/MM/dd}" });
     cols.push({ field: "MEASURE_RANG", title: "规格、精度及测量范围", width: 150, sortable: true, filterable: false });
     cols.push({ field: "RELEASE_POSITION", title: "发放位置", width: 100, sortable: true, filterable: false });
     cols.push({ field: "CALIBRATION_CYCLE", title: "校准周期(月)", width: 90, sortable: true, filterable: false });
     cols.push({ field: "LAST_CALIBRATION_DATE", title: "上次校验时间", width: 110, sortable: true, filterable: false, format: "{0: yyyy/MM/dd}" });
     cols.push({ field: "NEXT_CALIBRATION_DATE", title: "计划下次校验时间", width: 120, sortable: true, filterable: false, format: "{0: yyyy/MM/dd}" });
     cols.push({ field: "MEASURE_STATE", title: "状态", width: 80, sortable: true, filterable: false, template: kendo.template($("#MEASURE_STATE").html()) });
     cols.push({ field: "CALIBRATION_TYPE", title: "校准方式", width: 80, sortable: true, filterable: false, template: kendo.template($("#CALIBRATION_TYPE").html()) });
     cols.push({ field: "MEMO", title: "备注", width: 120, sortable: true, filterable: false });


     $.post(baseUrl, JSON.parse(par), function(data) {
         if (data.Status == 0) {
             grid = $("#grid").kendoGrid({
                 //toolbar: ["pdf", 'excel'],
                 columns: cols,
                 filterable: { mode: "row" },
                 dataSource: forData(data.Data.List),
                 height: $('body').height() - 50,
                 selectable: "row",
                 sortable: true,
                 resizable: true,
                 pageable: {
                     pageSize: 100,
                     pageSizes: [20, 30, 50, 100, 200, 500]
                 },
                 pdf: {
                     allPages: true
                 },
                 excel: {
                     allPages: true
                 }
             });
             var grid = $("#grid").data("kendoGrid");
         } else {
             BzAlert(data.Message);
         }
     })

     //日期格式转换
     function forData(data) {
         if (data != null) {
             for (var i = 0; i < data.length; i++) {
                 if (data[i].BUY_DATE != undefined)
                     data[i].BUY_DATE = moment(data[i].BUY_DATE).format("YYYY/MM/DD");

                 if (data[i].LAST_CALIBRATION_DATE != undefined)
                     data[i].LAST_CALIBRATION_DATE = moment(data[i].LAST_CALIBRATION_DATE).format("YYYY/MM/DD");

                 if (data[i].NEXT_CALIBRATION_DATE != undefined)
                     data[i].NEXT_CALIBRATION_DATE = moment(data[i].NEXT_CALIBRATION_DATE).format("YYYY/MM/DD");
             }
         }
         return data;
     }
 });