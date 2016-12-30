/**
 * Created by qb on 2016/12/21.
 */
var baseUrl = "/Defective/";
var grid;
$(function() {
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    PROD_NO = $("#PROD_NO").multipleComboxTree({
        url: "/Defective/GetProductList",
        url2: "/Defective/GetProductListByKey",
        type: 5,
        multiple: false,
        data: {
            ProNo: 0
        },
        inputheight: 34,
        checkbox: false,
        select: function(data) {}
    }).data("BZ-multipleComboxTree");


    var fields = {
        MAC_NO: { type: "string" },
        MAC_NAME: { type: "string" },
        PLAN_NO: { type: "string" },
        START_DATE: { type: "date" },
        END_DATE: { type: "date" },
        ORDER_TYPE: { type: "string" },
        PROD_NBR: { type: "string" },
        PROD_NAME: { type: "string" },
        CRAFT_NO: { type: "string" },
        CRAFT_NAME: { type: "string" },
        PROC_NO: { type: "string" },
        PROC_NAME: { type: "string" },
        INFERIOR_NO: { type: "string" },
        INFERIOR_NAME: { type: "string" },
        INPUT_NUM: { type: "string" },
        TARGET_NUM: { type: "string" },
        YIELD: { type: "string" },
        COMP_RATE: { type: "string" },
        QUALIFIED_NUM: { type: "string" },
        INFERIOR_NUM: { type: "string" },
        QUALITY_RATE: { type: "string" },
        UNIT: { type: "string" },
        INFERIOR_NUM_RATE: { type: "string" },
        MEN_NO: { type: "string" },
        MAN_NAMES: { type: "string" },
        REPORT_DATE: { type: "date" }
    }

    var cols = [];
    cols.push({ field: "PROD_NO", title: lang.Order.ProductNumber, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "PROD_NAME", title: lang.Order.ProductName, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "PLAN_NO", title: lang.Order.ProductionPlan, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "TASK_NO", title: lang.Order.WorkOrderNo, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "MAC_NO", title: lang.Order.EquipmentSerialNumber, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "MAC_NAME", title: lang.Order.DeviceName, width: 80, sortable: true, filterable: false, hidden: false });

    cols.push({ field: "REPORT_DATE", title: lang.Order.DispatchDate, width: 80, sortable: true, filterable: true, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    cols.push({ field: "END_DATE", title: lang.Order.PlansEndDate, width: 80, sortable: true, filterable: false, hidden: true, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    cols.push({ field: "PROD_NBR", title: "产品nbr", width: 80, sortable: true, filterable: false, hidden: true });
    //cols.push({ field: "CRAFT_NO", title: "工序编号", width: 80, sortable: true, filterable: false, hidden: false });
    //cols.push({ field: "CRAFT_NAME", title: "工序名称", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "INFERIOR_NO", title: lang.Order.ReasonNumber, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "INFERIOR_NAME", title: lang.Order.BecauseName, width: 80, sortable: true, filterable: false, hidden: false });
    //cols.push({ field: "TARGET_NUM", title: "目标产量", width: 80, sortable: true, filterable: false, hidden: false });
    //cols.push({ field: "QUALIFIED_NUM", title: "正品品数", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "INFERIOR_NUM", title: lang.Order.DefectiveGoodsNumber, width: 80, sortable: true, filterable: false, hidden: false });
    //cols.push({ field: "QUALITY_RATE", title: "质量率", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#QUALITY_RATE").html()) });
    //cols.push({ field: "UNIT", title: "单位", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "MEN_NO", title: "操作人员", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "MAN_NAMES", title: lang.Order.Operator, width: 120, sortable: true, filterable: false, hidden: false });

    grid = $("#grid").grid({
        //checkBoxColumn: true,
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        //sort: [{ field: "USER_NBR", dir: "ASC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: false,
        //resizeGridWidth: true,//列宽度可调
        isPage: true,
        height: 400,
        server: true,
        customsearch: true,
        //detailTemplate: kendo.template($("#detail-template").html()),

        actionUrl: ["getPlanSchedule", "", "", ""], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "PLAN_NO",
            fields: fields,
            cols: cols
        }

    });

    $("#search").click(function(data) {
        var startDate = $("#startTime").val();
        var endDate = $("#endTime").val();


        grid.grid("refresh", function() {
            return [
                { field: "PROD_NBR", Operator: "eq", value: PROD_NO.rData },
                { field: "REPORT_DATE", Operator: "gte", value: startDate },
                { field: "REPORT_DATE", Operator: "lte", value: moment(endDate).add(1, 'days') }
            ]
        }, { logic: "and" })
        highchart(startDate, endDate, PROD_NO.rData);
    });



})

function highchart(startDate, endDate) {
    var Prod_nbrList = [];
    Prod_nbrList.push(PROD_NO.rData);
    $.post(baseUrl + "GetDefectiveRateByDate", { startDate: startDate, endDate: endDate, Prod_nbrList: Prod_nbrList }, function(data) {
        if (data.Status == 0) {
            gridr(data.Data.ReasonList, 1);
            gridr(data.Data.MacList, 2);
            gridr(data.Data.ManList, 3);
        }
    })
}

//--------------------------------------------------画图
function gridr(data, type) {
    var categories = [];
    var ydata = [];
    var ur, title;
    if (type == 1) { $("#gridr").empty() } else if (type == 2) { $("#gridm").empty() } else { $("#gridp").empty() }
    for (var i = 0; i < data.length; i++) {

        if (type == 1) {

            categories.push(data[i].REASON_NAME);

            //tjson.data.push(data[i].TIMES * 100);
            ur = '#gridr';
            title = lang.Order.Title_1;
        } else if (type == 2) {

            categories.push(data[i].MAC_NO);
            //tjson.name = data[i].MAC_NAME;
            //tjson.data.push(data[i].INFERIOR_NUM_RATE * 100);
            ur = "#gridm";
            title = lang.Order.Title_2;
        } else {

            categories.push(data[i].MEN_NO);
            //tjson.name = data[i].MEN_NO;
            //tjson.data.push(data[i].INFERIOR_NUM_RATE * 100);
            ur = "#gridp";
            title = lang.Order.Title_3;
        }


        //ydata.push(tjson);
    }

    var tjson = {};

    tjson.data = []
    for (var j = 0; j < categories.length; j++) {
        var datatemp = [];
        if (type == 1) {
            tjson.name = lang.Order.FootTitle_1;
            datatemp = _.where(data, { REASON_NAME: categories[j] })
            if (datatemp.length > 0) {
                for (var n = 0; n < datatemp.length; n++) {
                    tjson.data.push(datatemp[n].NUMERATOR);
                }
            }
        } else if (type == 2) {
            tjson.name = lang.Order.FootTitle_2;
            datatemp = _.where(data, { MAC_NO: categories[j] })
            if (datatemp.length > 0) {
                for (var n = 0; n < datatemp.length; n++) {
                    tjson.data.push(datatemp[n].NUMERATOR);
                }
            }
        } else {
            tjson.name = lang.Order.FootTitle_3;
            datatemp = _.where(data, { MEN_NO: categories[j] })
            if (datatemp.length > 0) {
                for (var n = 0; n < datatemp.length; n++) {
                    tjson.data.push(datatemp[n].NUMERATOR);
                }
            }
        }
    }
    ydata.push(tjson);
    //var par = {
    //    type: "column",
    //    xdata: categories,
    //    ydata: ydata,
    //    stacking: true,
    //    subtitle: ""
    //}
    drawHisChart(ur, ydata, title, categories);
}

//function drawHisChart(ele, data, title) {
//    Chart = $(ele).hisChartStateShare({
//        type: data.type == undefined ? "column" : data.type,
//        title: title,
//        subtitle: data.subtitle == undefined ? "" : data.subtitle,
//        categories: data.xdata == undefined ? [] : data.xdata,
//        dataSource: data.ydata == undefined ? [] : data.ydata,
//        stacking: data.stacking == true ? "normal" : null
//    }).data("BZ-hisChartStateShare");
//}

function drawHisChart(ele, data, title, categories) {
    $(ele).highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: ""
        },
        xAxis: {
            categories: categories,
            labels: {
                rotation: -45,
                align: 'right',
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '个'
            }
        },
        tooltip: {
            pointFormat: lang.Order.DefectiveNumber + '：<b>{point.y}</b>',
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            column: {
                depth: 0,
                dataLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold'
                    },
                    formatter: function() {
                        return (this.y == null) ? "" : this.y;
                    }
                }
            },
            line: {
                depth: 0,
                dataLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold'
                    },
                    formatter: function() {
                        return (this.y == null) ? "" : this.y;
                    }
                }
            }
        },
        series: data
    });
}