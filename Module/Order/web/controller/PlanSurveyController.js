/**
 * Created by qb on 2016/12/21.
 */
var baseUrl = '/PlanSurvey/';
var ordersurvery;
$(function() {

    var fields = {
        PLAN_STATE: { type: "number" },
        ORDER_NO: { type: "string" },
        PLAN_NO: { type: "string" },
        PLAN_NBR: { type: "string" },
        PROD_NO: { type: "string" },
        PROD_NAME: { type: "string" },
        CRAFT_NO: { type: "string" },
        CRAFT_NAME: { type: "string" },
        INPUT_NUM: { type: "number" },
        TARGET_NUM: { type: "number" },
        YIELD: { type: "number" },
        COMP_RATE: { type: "number" },
        QUALIFIED_NUM: { type: "number" },
        INFERIOR_NUM: { type: "number" },
        QUALITY_RATE: { type: "number" },
        UNIT: { type: "string" },
        PLAN_START: { type: "date" },
        PLAN_END: { type: "date" },
        REAL_START: { type: "date" },
        REAL_END: { type: "date" },
        DEFECTIVE: { type: "string" },
        DEFECTIVE: { type: "string" }
    };
    var cols = [];
    cols.push({ field: "PLAN_STATE", title: lang.Order.StatePlan, width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#PLAN_STATE_TEMPLATE").html()) });
    cols.push({ field: "ORDER_NO", title: lang.Order.Order, width: 120, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "PLAN_NBR", title: lang.Order.Order, width: 120, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "PLAN_NO", title: lang.Order.ProductionPlan, width: 120, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "PROD_NO", title: lang.Order.ProductNumber, width: 120, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "PROD_NAME", title: lang.Order.ProductName, width: 120, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "CRAFT_NO", title: lang.Order.CraftId, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "CRAFT_NAME", title: lang.Order.CraftName, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "INPUT_NUM", title: lang.Order.Inventory, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "TARGET_NUM", title: lang.Order.TargetQuantity, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "YIELD", title: lang.Order.Output, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "COMP_RATE", title: lang.Order.Completion, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "QUALIFIED_NUM", title: lang.Order.QualityGoods, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "INFERIOR_NUM", title: lang.Order.DefectiveGoods, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "QUALITY_RATE", title: lang.Order.QualityRate, width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "UNIT", title: lang.Order.Unit, width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "PLAN_START", title: lang.Order.IsExpectedToStartDate, width: 120, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    cols.push({ field: "PLAN_END", title: lang.Order.IsExpectedToEndDate, width: 120, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    cols.push({ field: "REAL_START", title: lang.Order.TheActualStartDate, width: 120, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    cols.push({ field: "REAL_END", title: lang.Order.TheActualEndDate, width: 120, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    //cols.push({ field: "READY_TIME", title: "准备用时", width: 80, sortable: true, filterable: false, hidden: false });
    //cols.push({ field: "WAIT_TIME", title: "等待用时", width: 80, sortable: true, filterable: false, hidden: false });
    //cols.push({ field: "CAPACITY_RATE", title: "产能利用率", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "MEMO", title: lang.Order.Note, width: 80, sortable: true, filterable: false, hidden: true });
    //Grid
    grid = $("#grid").grid({
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        sort: [{ field: "PLAN_NBR", dir: "DESC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: true,
        //resizeGridWidth: true,//列宽度可调
        isPage: true,
        height: 400,
        server: false,
        customsearch: true,
        //detailTemplate: kendo.template($("#detail-template").html()),
        actionUrl: ["getPlanSurvey", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "PRO_PLAN",
            fields: fields,
            cols: cols
        },
        rowClick: function(data) {
            //
            if (ordersurvery != undefined) {
                ordersurvery.destroy();
            }
            $("#chart").empty();
            $.post(baseUrl + 'getDetailByPlan', { plan_nbr: data[0].PLAN_NBR }, function(data) {
                if (data.Status == 0) {
                    ordersurvery = $("#chart").orderSurvey({
                        width: $("#chart").width() <= 720 ? 720 : $("#chart").width(),
                        dataSource: data.Data,
                        startdate_plan: data.Data.PLAN_START,
                        enddate_plan: data.Data.PLAN_END,
                        select: function(data) {

                        }
                    }).data("BZ-orderSurvey");
                } else {

                }
            })
        }
    });
    var data = {
        "Status": 0,
        "Data": {
            "PLAN_NO": "XX2301",
            "PLAN_START": "/Date(1449705600000)/",
            "PLAN_END": "/Date(1450137600000)/",
            "Tasklist": [{
                "START_DATE": "/Date(1449734400000)/",
                "END_DATE": "/Date(1449820800000)/",
                "PROC_NO": "OP10",
                "WORK_ORDER": "GD001",
                "PROC_NAME": "铣面",
                "PROCESS_STATUS": "",
                "DURATION": "",
                "TaskRecordlist": [{
                    "MAC_NO": "B001",
                    "MAC_NAME": "B001",
                    "START_DATE": "/Date(1449734400000)/",
                    "END_DATE": "/Date(1449748800000)/",
                    "SourceStatuslist": [{
                        "START_DATE": "2015-12-10 16:00:00",
                        "END_DATE": "2015-12-10 17:00:00",
                        "STATUS_NAME": "运行",
                        "STATUS_NBR": "2",
                        "STATUS_COLOR": "#00FF00",
                    }, {
                        "START_DATE": "2015-12-10 17:00:00",
                        "END_DATE": "2015-12-10 20:00:00",
                        "STATUS_NAME": "报警",
                        "STATUS_NBR": "3",
                        "STATUS_COLOR": "#FF0000",
                    }],
                    "MEN_NO": "",
                    "MEN_NAME": "",
                    "INPUT_NUM": "",
                    "TARGET_NUM": "",
                    "YIELD": "",
                    "COMP_RATE": "",
                    "QUALIFIED_NUM": "",
                    "INFERIOR_NUM": "",
                    "QUALITY_RATE": "",
                    "DURATION": "",
                    "STATUS_RATE": [{
                        "STATUS_NAME": "",
                        "RATE": "",
                        "TIME": "",
                        "STATUS_COLOR": ""
                    }]
                }, {
                    "MAC_NO": "B002",
                    "MAC_NAME": "B002",
                    "START_DATE": "/Date(1449741600000)/",
                    "END_DATE": "/Date(1449792000000)/",
                    "SourceStatuslist": [{
                        "START_DATE": "2015-12-10 18:00:00",
                        "END_DATE": "2015-12-11 00:00:00",
                        "STATUS_NAME": "运行",
                        "STATUS_NBR": "2",
                        "STATUS_COLOR": "#00FF00",
                    }, {
                        "START_DATE": "2015-12-11 00:00:00",
                        "END_DATE": "2015-12-11 8:00:00",
                        "STATUS_NAME": "报警",
                        "STATUS_NBR": "3",
                        "STATUS_COLOR": "#FF0000",
                    }],
                    "MEN_NO": "",
                    "MEN_NAME": "",
                    "INPUT_NUM": "",
                    "TARGET_NUM": "",
                    "YIELD": "",
                    "COMP_RATE": "",
                    "QUALIFIED_NUM": "",
                    "INFERIOR_NUM": "",
                    "QUALITY_RATE": "",
                    "DURATION": "",
                    "STATUS_RATE": [{
                        "STATUS_NAME": "",
                        "RATE": "",
                        "TIME": "",
                        "STATUS_COLOR": ""
                    }]
                }]
            }, {
                "START_DATE": "/Date(1449885600000)/",
                "END_DATE": "/Date(1450058400000)/",
                "PROC_NO": "OP20",
                "WORK_ORDER": "GD002",
                "PROC_NAME": "",
                "PROCESS_STATUS": "",
                "DURATION": "",
                "MACS": [{
                    "MAC_NO": "B001",
                    "MAC_NAME": "B001",
                    "START_DATE": "/Date(1449885600000)/",
                    "END_DATE": "/Date(1450008000000)/",
                    "SourceStatuslist": [{
                        "START_DATE": "2015-12-12 10:00:00",
                        "END_DATE": "2015-12-13 00:00:00",
                        "STATUS_NAME": "运行",
                        "STATUS_NBR": "2",
                        "STATUS_COLOR": "#00FF00",
                    }, {
                        "START_DATE": "2015-12-13 00:00:00",
                        "END_DATE": "2015-12-13 20:00:00",
                        "STATUS_NAME": "报警",
                        "STATUS_NBR": "3",
                        "STATUS_COLOR": "#FF0000",
                    }],
                    "MEN_NO": "",
                    "MEN_NAME": "",
                    "INPUT_NUM": "",
                    "TARGET_NUM": "",
                    "YIELD": "",
                    "COMP_RATE": "",
                    "QUALIFIED_NUM": "",
                    "INFERIOR_NUM": "",
                    "QUALITY_RATE": "",
                    "DURATION": "",
                    "STATUS_RATE": [{
                        "STATUS_NAME": "",
                        "RATE": "",
                        "TIME": "",
                        "STATUS_COLOR": ""
                    }]
                }, {
                    "MAC_NO": "B003",
                    "MAC_NAME": "B003",
                    "START_DATE": "/Date(1449921600000)/",
                    "END_DATE": "/Date(1450051200000)/",
                    "SourceStatuslist": [{
                        "START_DATE": "2015-12-12 20:00:00",
                        "END_DATE": "2015-12-13 00:00:00",
                        "STATUS_NAME": "运行",
                        "STATUS_NBR": "2",
                        "STATUS_COLOR": "#00FF00",
                    }, {
                        "START_DATE": "2015-12-13 00:00:00",
                        "END_DATE": "2015-12-14 8:00:00",
                        "STATUS_NAME": "报警",
                        "STATUS_NBR": "3",
                        "STATUS_COLOR": "#FF0000",
                    }],
                    "MEN_NO": "",
                    "MEN_NAME": "",
                    "INPUT_NUM": "",
                    "TARGET_NUM": "",
                    "YIELD": "",
                    "COMP_RATE": "",
                    "QUALIFIED_NUM": "",
                    "INFERIOR_NUM": "",
                    "QUALITY_RATE": "",
                    "DURATION": "",
                    "STATUS_RATE": [{
                        "STATUS_NAME": "",
                        "RATE": "",
                        "TIME": "",
                        "STATUS_COLOR": ""
                    }]
                }]
            }]
        },
        "Message": "操作成功"
    }


    $("#filter").keydown(function(e) {
        if (e.keyCode == 13) {
            $("#output").trigger("click");
        }
    })

    //--------------------------------------------------------------------------查询
    $("#output").click(function(data) {
        dataItem = null;
        grid.grid("refresh", function() {
            return [
                { field: "ORDER_NO", operator: "contains", value: $("#filter").val() },
                { field: "PLAN_NO", operator: "contains", value: $("#filter").val() }
            ]
        }, {
            logic: "or"
        })
    })

});