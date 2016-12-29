var grid;
var gridProcess;
var baseUrl = "/PlanSchedule/";
$(function (data) {


    var fields = {
        PLAN_NO_STATUS: { type: "string" },
        ORDER_NO: { type: "string" },
        PLAN_NO: { type: "string" },
        ORDER_TYPE: { type: "string" },
        PROD_NBR: { type: "string" },
        PROD_NAME: { type: "string" },
        CRAFT_NO: { type: "string" },
        CRAFT_NAME: { type: "string" },
        FINISH_PROCESS_NUM: { type: "string" },
        INPUT_NUM: { type: "string" },
        TARGET_NUM: { type: "string" },
        YIELD: { type: "string" },
        COMP_RATE: { type: "string" },
        QUALIFIED_NUM: { type: "string" },
        INFERIOR_NUM: { type: "string" },
        QUALITY_RATE: { type: "string" },
        UNIT: { type: "string" },
        PLAN_START: { type: "date" },
        PLAN_END: { type: "date" },
        MEMO: { type: "string" }
    }

    var cols = [];
    cols.push({ field: "PRO_PLAN_STATUS", title: "计划状态", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#PLAN_STATE").html()) });
    cols.push({ field: "ORDER_NO", title: "订单", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "PLAN_NO", title: "生产计划", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "ORDER_TYPE", title: "工单类型", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "PROD_NBR", title: "产品nbr", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "PROD_NAME", title: "产品名称", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "CRAFT_NO", title: "工艺编号", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "CRAFT_NAME", title: "工艺名称",width: 200,sortable: true, filterable: false, hidden: false });
    cols.push({ field: "FINISH_PROCESS_NUM", title: "完成工序数", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "INPUT_NUM", title: "投入量", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "TARGET_NUM", title: "目标量", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "YIELD", title: "产出量", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "COMP_RATE", title: "完成率", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#COMP_RATE").html()) });
    cols.push({ field: "QUALIFIED_NUM", title: "正品", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "INFERIOR_NUM", title: "次品", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "QUALITY_RATE", title: "质量率", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#QUALITY_RATE").html()) });
    cols.push({ field: "UNIT", title: "单位", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "PLAN_START", title: "实际开始时间", width: 80, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    cols.push({ field: "PLAN_END", title: "实际结束时间", width: 80, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    cols.push({ field: "MEMO", title: "备注", width: 80, sortable: true, filterable: false, hidden: false });

    grid = $("#grid").grid({
        //checkBoxColumn: true,
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        sort: [{ field: "PLAN_NBR", dir: "DESC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: true,
        //resizeGridWidth: true,//列宽度可调
        //resizable: true,
        isPage: true,
        height: 400,
        server: true,
        customsearch: true,
        //detailTemplate: kendo.template($("#detail-template").html()),

        actionUrl: ["getPlanSchedule", "", "", ""], //读、新增、更改、删除的URLaction
        detailInit: detailInit,
        dataBound: function () {
            this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        custom: {
            PrimaryKey: "PLAN_NO",
            fields: fields,
            cols: cols
        }

    });

    var fieldsOrder = {
        PROCESS_STATUS: { type: "string" },
        PLAN_NO: { type: "string" },
        PROC_NO: { type: "string" },
        PROC_NAME: { type: "string" },
        INPUT_NUM: { type: "string" },
        TARGET_NUM: { type: "string" },
        YIELD: { type: "string" },
        COMP_RATE: { type: "string" },
        QUALIFIED_NUM: { type: "string" },
        INFERIOR_NUM: { type: "string" },
        QUALITY_RATE: { type: "string" },
        UNIT: { type: "string" },
        START_DATE: { type: "date" },
        END_DATE: { type: "date" }
    }

    var colsOrder = [];

    colsOrder.push({ field: "PROCESS_STATUS", title: "工单状态", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#PROCESS_STATUS").html()) });
    colsOrder.push({ field: "PLAN_NO", title: "生产计划", width: 80, sortable: true, filterable: false, hidden: false });
    colsOrder.push({ field: "PROC_NO", title: "工序编号", width: 80, sortable: true, filterable: false, hidden: false });
    colsOrder.push({ field: "PROC_NAME", title: "工序名称", width: 200, sortable: true, filterable: false, hidden: false });
    colsOrder.push({ field: "INPUT_NUM", title: "投料量", width: 80, sortable: true, filterable: false, hidden: false });
    colsOrder.push({ field: "TARGET_NUM", title: "目标量", width: 80, sortable: true, filterable: false, hidden: false });
    colsOrder.push({ field: "YIELD", title: "产出量", width: 80, sortable: true, filterable: false, hidden: false });
    colsOrder.push({ field: "COMP_RATE", title: "完成率", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#COMP_RATE").html()) });
    colsOrder.push({ field: "QUALIFIED_NUM", title: "正品", width: 80, sortable: true, filterable: false, hidden: false });
    colsOrder.push({ field: "INFERIOR_NUM", title: "次品", width: 80, sortable: true, filterable: false, hidden: false });
    colsOrder.push({ field: "QUALITY_RATE", title: "质量率", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#QUALITY_RATE").html()) });
    colsOrder.push({ field: "START_DATE", title: "起始日期", width: 80, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    colsOrder.push({ field: "END_DATE", title: "结束日期", width: 80, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });

    function detailInit(e) {
        $("<div/>").appendTo(e.detailCell).grid({
            baseUrl: baseUrl,
            scrollable: false,
            sortable: true,
            isPage: false,
            height: 300,
            autoBind: true,
            actionUrl: ["getProcessScheduleByPlan", "", "", ""],
            custom: {
                PrimaryKey: "PLAN_NO",
                fields: fieldsOrder,
                cols: colsOrder
            },
            filter: function () {
                return [
                    { field: "PLAN_NO", operator: "eq", value: e.data.PLAN_NO }
                ]
            },
            rowClick: function (data) {
                gridProcess.grid("refresh", function () {
                    var dataItem = data[0];
                    return [
                        { field: "PLAN_NO", Operator: "eq", value: dataItem.PLAN_NO },
                        { field: "PROC_NO", Operator: "eq", value: dataItem.PROC_NO }
                    ]
                });

            }
        });
    }

    var fieldsProcess = {
        PLAN_NO: { type: "string" },
        PROC_NO: { type: "string" },
        PROC_NAME: { type: "string" },
        MAC_NO: { type: "string" },
        MAC_NAME: { type: "string" },
        INPUT_NUM: { type: "string" },
        TARGET_NUM: { type: "string" },
        YIELD: { type: "string" },
        COMP_RATE: { type: "string" },
        QUALIFIED_NUM: { type: "string" },
        INFERIOR_NUM: { type: "string" },
        QUALITY_RATE: { type: "string" },
        UNIT: { type: "string" },
        START_DATE: { type: "date" },
        END_DATE: { type: "date" }
    }


    var colsProcess = [];

    colsProcess.push({ field: "PLAN_NO", title: "生产计划", width: 80, sortable: true, filterable: false, hidden: false });
    colsProcess.push({ field: "PROC_NO", title: "工序编号", width: 80, sortable: true, filterable: false, hidden: false });
    colsProcess.push({ field: "PROC_NAME", title: "工序名称", width: 80, sortable: true, filterable: false, hidden: false });
    colsProcess.push({ field: "MAC_NO", title: "机床编号", width: 80, sortable: true, filterable: false, hidden: false });
    colsProcess.push({ field: "MAC_NAME", title: "机床名称", width: 80, sortable: true, filterable: false, hidden: false });
    colsProcess.push({ field: "INPUT_NUM", title: "投料量", width: 80, sortable: true, filterable: false, hidden: false });
    colsProcess.push({ field: "TARGET_NUM", title: "目标量", width: 80, sortable: true, filterable: false, hidden: false });
    colsProcess.push({ field: "YIELD", title: "产出量", width: 80, sortable: true, filterable: false, hidden: false });
    colsProcess.push({ field: "COMP_RATE", title: "完成率", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#COMP_RATE").html()) });
    colsProcess.push({ field: "QUALIFIED_NUM", title: "正品", width: 80, sortable: true, filterable: false, hidden: false });
    colsProcess.push({ field: "INFERIOR_NUM", title: "次品", width: 80, sortable: true, filterable: false, hidden: false });
    colsProcess.push({ field: "QUALITY_RATE", title: "质量率", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#QUALITY_RATE").html()) });
    colsProcess.push({ field: "START_DATE", title: "起始日期", width: 80, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    colsProcess.push({ field: "END_DATE", title: "结束日期", width: 80, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });

    gridProcess = $("#gridProcess").grid({
        //checkBoxColumn: true,
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        //sort: [{ field: "USER_NBR", dir: "ASC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: false,
        //resizeGridWidth: true,//列宽度可调
        isPage: false,
        height: 400,
        server: false,
        //detailTemplate: kendo.template($("#detail-template").html()),

        actionUrl: ["getDetailByProcess", "", "", ""], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "PLAN_NO",
            fields: fieldsProcess,
            cols: colsProcess
        }
    });

    $("#output").click(function () {
        grid.grid("refresh", function () {
            return [
                { field: "PLAN_NO", Operator: "contains", value: $("#filter").val() },
            ]
        })
    })

    $("#filter").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#output").trigger("click");
        }
    })

})