 var baseUrl = '/MeasureManager/';
 var groupOrMachine;
 var grid;
 $(function() {
     var measure_typeData = [
         { text: '--选择类型--', value: '--选择类型--' },
         { text: '测试设备', value: '测试设备' },
         { text: '非标量具', value: '非标量具' },
         { text: '工装', value: '工装' },
         { text: '焊机', value: '焊机' },
         { text: '力矩', value: '力矩' },
         { text: '通用量具', value: '通用量具' },
         { text: '压力表制造', value: '压力表制造' },
         { text: '螺纹量具', value: '螺纹量具' },
         { text: '压力表', value: '压力表' }
     ];
     $("#MEASURE_TYPE").kendoComboBox({
         dataTextField: "text",
         dataValueField: "value",
         dataSource: measure_typeData,
         value: "--选择类型--"
     }).data("kendoComboBox");

     var fields = {
         MEASURE_NBR: { type: "int" }, //量具id
         MEASURE_TYPE: { type: "int" }, //量具类型
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
         SCRAP_DATE: { type: "date" } //报废时间
     };
     var cols = [];
     cols.push({ field: "MEASURE_NBR", title: "量具id", width: 120, sortable: true, filterable: false, hidden: true });
     cols.push({ field: "MEASURE_TYPE", title: "类型", width: 80, sortable: true, filterable: false, hidden: false });
     cols.push({ field: "MEASURE_NO", title: "编号", width: 80, sortable: true, filterable: true });
     cols.push({ field: "MEASURE_NAME", title: "量具名称", width: 90, sortable: true, filterable: true });
     cols.push({ field: "MANUFACTURER", title: "制造商", width: 90, sortable: true, filterable: false });
     cols.push({ field: "BUY_DATE", title: "购买日期", width: 90, sortable: true, filterable: false, format: "{0: yyyy/MM/dd}" });
     cols.push({ field: "MEASURE_RANG", title: "规格、精度及测量范围", width: 150, sortable: true, filterable: true });
     cols.push({ field: "RELEASE_POSITION", title: "发放位置", width: 80, sortable: true, filterable: false });
     cols.push({ field: "SCRAP_DATE", title: "报废时间", width: 90, sortable: true, filterable: false, format: "{0: yyyy/MM/dd}" });
     //cols.push({ field: "CALIBRATION_CYCLE", title: "校准周期(月)", width: 90, sortable: true, filterable: false });
     //cols.push({ field: "LAST_CALIBRATION_DATE", title: "上次校验时间", width: 120, sortable: true, filterable: false, format: "{0: yyyy/MM/dd}" });
     //cols.push({ field: "NEXT_CALIBRATION_DATE", title: "计划下次校验时间", width: 120, sortable: true, filterable: false, format: "{0: yyyy/MM/dd}" });
     cols.push({ field: "IS_SCRAP", title: "是否报废", width: 80, sortable: true, filterable: false, template: kendo.template($("#IS_SCRAP").html()) });
     //cols.push({ field: "MEASURE_STATE", title: "状态", width: 80, sortable: true, filterable: false, template: kendo.template($("#MEASURE_STATE").html()) });
     //cols.push({ field: "CALIBRATION_TYPE", title: "校准方式", width: 80, sortable: true, filterable: false, template: kendo.template($("#CALIBRATION_TYPE").html()) });
     cols.push({ field: "MEMO", title: "备注", width: 120, sortable: true, filterable: false });
     cols.push({ field: "SCRAP_MEMO", title: "报废原因", width: 120, sortable: true, filterable: false });

     grid = $("#grid").grid({
         //checkBoxColumn: true,
         baseUrl: baseUrl, //调用的URL
         selectable: "single", //行选择方式
         sort: [{ field: "MEASURE_NBR", dir: "DESC" }],
         scrollable: true,
         editable: false, //是否可编辑
         autoBind: true, //是否绑定数据
         isPage: true, //是否分页
         server: true,
         customsearch: true,

         actionUrl: ["ScarpLookup", "", "", "DelList"], //读、新增、更改、删除的URLaction
         custom: {
             PrimaryKey: "MEASURE_NBR",
             fields: fields,
             cols: cols
         }
     });


     //查询
     function queryMeasure() {
         var measure_type = $("input[name='MEASURE_TYPE_input']").val();
         measure_type == '--选择类型--' ? measure_type = null : measure_type = measure_type;
         var name = $("#filter").val() == '' ? null : $("#filter").val();
         grid.grid("refresh", function() {
             return [
                 { field: "MEASURE_TYPE", Operator: "eq", value: measure_type },
                 { field: "MEASURE_NAME", Operator: "contains", value: name }
             ]
         }, {
             logic: 'and'
         });
     }

     //点击查询
     $("#output").click(function() {
         queryMeasure();
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
 })