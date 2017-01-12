 $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
 $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
 var grid;
 var baseUrl = "/inferiorMultiple/";
 var validator;
 var addviewModel; //定义1个队象
 var PART_NO_LIST;
 /*********************************************初始化GRID****************************************************************/
 $(function() {
     var fields = {
         PART_NO: { type: "string" },
         TOTAL_PROD_COUNT: { type: "string" },
         PROGRAM_NAME_LIST: { type: "string" },
         PROD_DATE: { type: "Date" },
         TOTAL_INFERIOR_NUM: { type: "string" },
         INFERIOR_REASON_NAME: { type: "string" },
         QUALITIED_NUM: { type: "string" },
         INFERIOR_RATE: { type: "string" }
     };
     var cols = [];
     cols.push({ field: "PART_NO", title: '零件号', width: 80, sortable: true, filterable: false });
     cols.push({ field: "TOTAL_PROD_COUNT", title: '产品总数', width: 80, sortable: true, filterable: false });
     cols.push({ field: "PROGRAM_NAME_LIST", title: '程序号', width: 80, sortable: true, filterable: false });
     cols.push({ field: "PROD_DATE", title: '日期', width: 80, format: "{0: yyyy-MM-dd}", sortable: true, filterable: false });
     cols.push({ field: "TOTAL_INFERIOR_NUM", title: '不良总数', width: 80, sortable: true, filterable: false });
     cols.push({ field: "INFERIOR_REASON_NAME", title: '次品原因', width: 80, sortable: true, filterable: false });
     cols.push({ field: "TOTAL_PROD_COUNT-TOTAL_INFERIOR_NUM", title: '正品数', width: 80, sortable: true, filterable: false });
     cols.push({ field: "INFERIOR_RATE+'%'", title: '不良率', width: 80, sortable: true, filterable: false });
     cols.push({ field: "INFERIOR_RATE+'%'", title: '不良率', width: 80, sortable: true, filterable: false });

     ////Grid
     grid = $("#grid").grid({
         //checkBoxColumn: true,
         baseUrl: baseUrl, //调用的URL
         selectable: "single", //行选择方式
         //sort: [{ field: "USER_NBR", dir: "ASC" }],
         scrollable: true,
         editable: false, //是否可编辑
         autoBind: false,
         resizeGridWidth: true, //列宽度可调
         isPage: true,
         customsearch: true,
         //detailTemplate: kendo.template($("#detail-template").html()),
         //server: true, //服务器端刷新，包括排序，筛选等
         actionUrl: ["getInferiorReasonDataInitList", "", "", "DelList"], //读、新增、更改、删除的URLaction
         custom: {
             // PrimaryKey: "PART_INTERRIOR_NBR",
             fields: fields,
             cols: cols
         }
     });
     ///分页
     $("#contextPage").resize(function() {
         grid.data("bz-grid").resizeGridWidth();
     });
     //点击菜单刷新
     grid.grid("refresh", function() {
         return [
             { field: "Keywords", Operator: "eq", date_begin: $("#startTime").val(), end_dt: $("#endTime").val(), Keywords: $("#PART_NO").val() }
         ];
     });
     ////下拉多选框
     PART_NO_LIST = $("#PART_NO").multipleComboxTree({
         remote: true,
         width: 172,
         type: 11,
         //data: "123",
         url2: "/inferiorMultiple/GetAllPartNoList",
         tree: false
     }).data("BZ-multipleComboxTree");
 });
 /////查询
 function search() {
     var a = PART_NO_LIST.dataAarry;
     var arr = [];
     for (var key in a) {
         arr.push(a[key]);
     }
     grid.grid("refresh", function() {
         return [
             { field: "Keywords", Operator: "contains", date_begin: $("#startTime").val(), end_dt: $("#endTime").val(), Keywords: arr.join(",") }
         ];
     });
 }
 //////////导出
 $("#gird_derive").click(function() {
     var a = PART_NO_LIST.dataAarry;
     var arr = [];
     for (var key in a) {
         arr.push(a[key]);
     }
     var data = {
         Keywords: arr.join(","),
         date_begin: $("#startTime").val(),
         end_dt: $("#endTime").val()
     }
     $.post("/InferiorMultiple/ExportExcelChat", data, function(data) {
         var re = data.Data.split('/');
         var path = re[3];
         location.href = './' + path;
     })
 })



 /**********************************************下载*******************************************************/
 function DownLoad(obj1, obj2) {
     $.download('/InferiorMultiple/DownLoad', obj1, obj2);
 }

 jQuery.download = function(url, data, method) {
     // 获得url和data
     if (url && data) {
         // data 是 string 或者 array/object
         data = typeof data == 'string' ? data : jQuery.param(data);
         // 把参数组装成 form的  input
         var inputs = '';
         jQuery.each(data.split('&'), function() {
             var pair = this.split('=');
             inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
         });
         // request发送请求
         jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
             .appendTo('body').submit().remove();
     };
 };