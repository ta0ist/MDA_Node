/**
 * Created by qb on 2016/12/21.
 */
var baseUrl = "/ProductionPlan/";
var gird, girdproc;
var dataItem, dataproc;
var plannbr;
app.controller('appCtrl', ['$scope', '$http', function ($scope, $http) {


    bindType("#PLAN_TYPE_S");

    //----------------------------------------------------------------------计划字段
    var fields = {
        PLAN_NBR: { type: "string" },
        PLAN_NO: { type: "string" },
        ORDER_NO: { type: "string" },
        PLAN_TYPE: { type: "string" },
        PROD_NO: { type: "string" },
        PROD_NBR: { type: "string" },
        CRAFT_NBR: { type: "string" },
        PROD_NAME: { type: "string" },
        CRAFT_NO: { type: "string" },
        CRAFT_NAME: { type: "string" },
        INPUT_NUM: { type: "string" },
        TARGET_NUM: { type: "string" },
        UNIT: { type: "string" },
        PLAN_START: { type: "date" },
        PLAN_END: { type: "date" },
        REAL_START: { type: "date" },
        REAL_END: { type: "date" },
        CUSTOMER: { type: "string" },
        MEMO: { type: "string" }
    };

    var col = [];
    col.push({ field: "PLAN_NBR", title: "生产nbr", width: 80, sortable: true, filterable: false, hidden: true });
    col.push({ field: "PLAN_NO", title: "生产计划", width: 80, sortable: true, filterable: false, hidden: false });
    col.push({ field: "ORDER_NO", title: "订单号", width: 80, sortable: true, filterable: false, hidden: false });
    col.push({ field: "PLAN_TYPE", title: "计划类型", width: 40, sortable: true, filterable: false, hidden: false });
    col.push({ field: "PROD_NO", title: "产品编号", width: 80, sortable: true, filterable: false, hidden: false });
    col.push({ field: "PROD_NBR", title: "产品nbr", width: 80, sortable: true, filterable: false, hidden: true });
    col.push({ field: "PROD_NAME", title: "产品名称", width: 80, sortable: true, filterable: false, hidden: false });
    col.push({ field: "CRAFT_NBR", title: "工艺nbr", width: 80, sortable: true, filterable: false, hidden: true });
    col.push({ field: "CRAFT_NO", title: "工艺编号", width: 80, sortable: true, filterable: false, hidden: true });
    col.push({ field: "CRAFT_NAME", title: "工艺名称", width: 80, sortable: true, filterable: false, hidden: false });
    col.push({ field: "INPUT_NUM", title: "投料量", width: 40, sortable: true, filterable: false, hidden: false });
    col.push({ field: "TARGET_NUM", title: "目标量", width: 40, sortable: true, filterable: false, hidden: false });
    col.push({ field: "UNIT", title: "单位", width: 30, sortable: true, filterable: false, hidden: false });
    col.push({ field: "PLAN_START", title: "预计开始时间", width: 100, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm}" });
    col.push({ field: "PLAN_END", title: "预计结束时间", width: 100, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm} " });
    col.push({ field: "REAL_START", title: "实际开始时间", width: 100, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    col.push({ field: "REAL_END", title: "实际结束时间", width: 100, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    col.push({ field: "CUSTOMER", title: "客户", width: 100, sortable: true, filterable: false, hidden: false });
    col.push({ field: "MEMO", title: "备注", width: 80, sortable: true, filterable: false, hidden: false });

    grid = $("#grid").grid({
        //checkBoxColumn: true,
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        sort: [{ field: "PLAN_NBR", dir: "DESC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: true,
        //resizeGridWidth: true,//列宽度可调
        isPage: true,
        height: 300,
        server: true,
        customsearch: true,
        //detailTemplate: kendo.template($("#detail-template").html()),

        actionUrl: ["GetProductionPlan", "", "", ""], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "PLAN_NO",
            fields: fields,
            cols: col
        },
        rowClick: function (data) {
            dataItem = data[0];
            dataproc = null;
            gridsproc.grid("refresh", function () {
                return [
                    //{
                    //    filters: [
                    //    { field: "STOCK_TYPE", Operator: "eq", value: 1 },
                    //    { field: "STOCK_TYPE", Operator: "eq", value: 2 }
                    //    ],
                    //    logic: "or"
                    //},
                    { field: "CRAFR_NBR", Operator: "eq", value: data[0].PLAN_NBR }
                ];
            }, {
                logic: "and"
            });
        }

    });

    $("#search").click(function () {
        grid.grid("refresh", function () {
            return [
                { field: "PLAN_NO", Operator: "contains", value: $("#PLAN_NO_S").val() },
                { field: "ORDER_NO", Operator: "contains", value: $("#ORDER_NO_S").val() },
                { field: "PROD_NO", Operator: "contains", value: $("#PROD_NO_S").val() },
                { field: "PROD_NAME", Operator: "contains", value: $("#PROD_NAME_S").val() },
                { field: "PLAN_TYPE", Operator: "contains", value: $("#PLAN_TYPE_S").val() }
            ];
        });
    })

    $("#PLAN_NO_S").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#search").trigger("click");
        }
    })
    $("#ORDER_NO_S").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#search").trigger("click");
        }
    })
    $("#PROD_NO_S").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#search").trigger("click");
        }
    })
    $("#PROD_NAME_S").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#search").trigger("click");
        }
    })
    $("#PLAN_TYPE_S").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#search").trigger("click");
        }
    })


    //------------------------------------------------------------------------------------------工序字段
    var fieldsproc = {
        TASK_NBR: { type: "string" },
        PLAN_NBR: { type: "string" },
        CRAFR_NBR: { type: "string" },
        RANK_NUM: { type: "string" },
        TASK_NO: { type: "string" },
        REPORT_STATE: { type: "string" },
        PROC_TYPE: { type: "string" },
        PLAN_TYPE: { type: "string" },
        PROC_NO: { type: "string" },
        PROC_NAME: { type: "string" },
        STD_TIME: { type: "string" },
        CYCLE_RATE: { type: "string" },
        MEMO: { type: "string" }
    };

    var colproc = [];
    colproc.push({ field: "TASK_NBR", title: "工序nbr", width: 80, sortable: true, filterable: false, hidden: true });
    colproc.push({ field: "PLAN_NBR", title: "计划nbr", width: 80, sortable: true, filterable: false, hidden: true });
    colproc.push({ field: "CRAFR_NBR", title: "计划nbr", width: 80, sortable: true, filterable: false, hidden: true });
    colproc.push({ field: "TASK_NO", title: "工单", width: 80, sortable: true, filterable: false, hidden: false, editable: true });
    colproc.push({ field: "INPUT_NUM", title: "投料量", width: 40, sortable: true, filterable: false, hidden: false });
    colproc.push({ field: "TARGET_NUM", title: "目标量", width: 40, sortable: true, filterable: false, hidden: false });
    colproc.push({ field: "RANK_NUM", title: "工序顺序", width: 80, sortable: true, filterable: false, hidden: false });
    colproc.push({ field: "PROC_TYPE", title: "最后工序", width: 40, sortable: true, filterable: false, hidden: false, template: kendo.template($("#PROC_TYPE").html()) });
    colproc.push({ field: "PROC_NO", title: "工序编号", width: 40, sortable: true, filterable: false, hidden: false });
    colproc.push({ field: "PROC_NAME", title: "工序名称", width: 80, sortable: true, filterable: false, hidden: false });
    colproc.push({ field: "STD_TIME", title: "标准用时", width: 80, sortable: true, filterable: false, hidden: true });
    colproc.push({ field: "CYCLE_RATE", title: "循环倍数", width: 80, sortable: true, filterable: false, hidden: true });
    colproc.push({ field: "MEMO", title: "备注", width: 80, sortable: true, filterable: false, hidden: false });

    gridsproc = $("#girdproc").grid({
        //checkBoxColumn: true,
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        //sort: [{ field: "USER_NBR", dir: "ASC" }],
        scrollable: true,
        height: 300,
        width: 800,
        editable: false, //是否可编辑
        autoBind: false,
        //resizeGridWidth: true,//列宽度可调
        isPage: false,
        toolbar: kendo.template($("#template").html()),
        server: false,
        //detailTemplate: kendo.template($("#detail-template").html()),

        actionUrl: ["getTaskByCraftNbr", "", "", ""], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "CRAFR_NBR",
            fields: fieldsproc,
            cols: colproc
        },
        rowClick: function (data) {
            dataproc = data[0];
        }
    });

    $("#task_e").click(function (data) {
        if (dataproc != null) {
            $.x5window("修改工单名称", kendo.template($("#task_no").html()));
            $("#TASK_NO").val(dataproc.TASK_NO);
            $("#INPUT_NUMS").val(dataproc.INPUT_NUM);
            $("#TARGET_NUMS").val(dataproc.TARGET_NUM);

            $("#Save").click(function (data) {
                var task_no = $("#TASK_NO").val();
                if (task_no == "") {
                    BzAlert("工单名称不能为空！");
                    return;
                }
                dataproc.TASK_NO = task_no;
                dataproc.INPUT_NUM = $("#INPUT_NUMS").val();
                dataproc.TARGET_NUM = $("#TARGET_NUMS").val();
                var data={
                    CRAFR_NBR: dataproc.CRAFR_NBR,
                    CRAFT_NAME: dataproc.CRAFT_NAME,
                    CRAFT_NBR: dataproc.CRAFT_NBR,
                    CRAFT_NO: dataproc.CRAFT_NO,
                    CYCLE_RATE: dataproc.CYCLE_RATE,
                    GP_NAME: dataproc.GP_NAME,
                    GP_NBR: dataproc.GP_NBR,
                    GP_RANK_NUM: dataproc.GP_RANK_NUM,
                    INPUT_NUM: dataproc.INPUT_NUM,
                    MEMO: dataproc.MEMO,
                    PC_MEMO: dataproc.PC_MEMO,
                    PID: dataproc.PID,
                    PLAN_NBR: dataproc.PLAN_NBR,
                    PLAN_TYPE: dataproc.PLAN_TYPE,
                    PROC_NAME: dataproc.PROC_NAME,
                    PROC_NBR: dataproc.PROC_NBR,
                    PROC_NO: dataproc.PROC_NO,
                    PROC_TYPE: dataproc.PROC_TYPE,
                    PROD_NAME: dataproc.PROD_NAME,
                    PROD_NBR: dataproc.PROD_NBR,
                    PROD_NO: dataproc.PROD_NO,
                    RANK_NUM: dataproc.RANK_NUM,
                    REAL_END: dataproc.REAL_END,
                    REAL_START: dataproc.REAL_START,
                    REPORT_STATE: dataproc.REPORT_STATE,
                    STD_TIME: dataproc.STD_TIME,
                    TARGET_NUM: dataproc.TARGET_NUM,
                    TASK_NBR: dataproc.TASK_NBR,
                    TASK_NO: dataproc.TASK_NO,
                    dirty: dataproc.dirty,
                    id: dataproc.id,
                    uid: dataproc.uid
                }
                $.post(baseUrl + "changeTask_No", data , function (data) {
                    if (data.Status == 0) {
                        $("#x5window").data("kendoWindow").close();
                        BzSuccess("操作成功！");
                        //gridsproc.grid("refresh", function () {
                        //    return [
                        //        { field: "CRAFT_NBR", Operator: "eq", value: dataItem.PLAN_NBR },
                        //    ]
                        //});


                        gridsproc.grid("refresh", function () {
                            return [
                                //{
                                //    filters: [
                                //    { field: "STOCK_TYPE", Operator: "eq", value: 1 },
                                //    { field: "STOCK_TYPE", Operator: "eq", value: 2 }
                                //    ],
                                //    logic: "or"
                                //},
                                { field: "CRAFR_NBR", Operator: "eq", value: dataItem.PLAN_NBR }
                            ];
                        }, {
                            logic: "and"
                        });

                    }
                })
            })
        }
    })

    $scope.addplan = function () {
        plannbr = 0;
        $.x5window("新增生产计划", kendo.template($("#proplan").html()));

        $("#PLAN_START").kendoDateTimePicker({ format: "yyyy/MM/dd HH:mm:ss", value: new Date() });
        $("#PLAN_END").kendoDateTimePicker({ format: "yyyy/MM/dd HH:mm:ss", value: new Date() });
        PROD_NO = $("#PROD_NO").multipleComboxTree({
            url: "/Defective/GetProductList",
            url2: "/Defective/GetProductListByKey",
            type: 5,
            multiple: false,
            data: {
                ProNo: 0
            },
            inputheight: 20,
            checkbox: false,
            select: function (data) {
                $("#PROD_NAME").val(data.prod_name);
                bindArt("#CRAFT_NO", data.prod_no, data.prod_name);

            }
        }).data("BZ-multipleComboxTree");
        bindType("#PLAN_TYPE");
        //----------------------------------------------------------------点击模板按钮
        $("#Save").click(function (data) {
            var url;
            if ($("#PLAN_NO").val() == "" || $("#ORDER_NO").val() == "" || $("#PROD_NOk").val() == "" || $("#UNIT").val() == "") {
                BzAlert("相关选项不能为空！");
                return;
            }
            url = "AddProductionPlan";
            var model = {
                PLAN_NO: $("#PLAN_NO").val(),
                ORDER_NO: $("#ORDER_NO").val(),
                PLAN_TYPE: $("#PLAN_TYPE").val(),
                PROD_NBR: PROD_NO.rData,
                PROD_NAME: $("#PROD_NAME").val(),
                CRAFT_NBR: parseInt($("#CRAFT_NO").val()),
                CRAFT_NAME: $("#CRAFT_NAME").val(),
                INPUT_NUM: $("#INPUT_NUM").val(),
                TARGET_NUM: $("#TARGET_NUM").val(),
                UNIT: $("#UNIT").val() == null ? "" : $("#UNIT").val(),
                PLAN_START: $("#PLAN_START").val(),
                PLAN_END: $("#PLAN_END").val(),
                CUSTOMER: $("#CUSTOMER").val(),
                MEMO: $("#MEMO").val()
            }
            $.post(baseUrl + url, model, function (data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    grid.grid("refresh", []);
                }
                else {
                    BzAlert(data.Message);
                }

            })
        })
    }

    $scope.modifyplan = function (data) {
        if (dataItem == null)
        { return; }
        $.x5window("修改生产计划", kendo.template($("#proplan").html()));
        $("#PLAN_START").kendoDateTimePicker({ format: "yyyy/MM/dd HH:mm:ss", value: new Date(dataItem.PLAN_START) });
        $("#PLAN_END").kendoDateTimePicker({ format: "yyyy/MM/dd HH:mm:ss", value: new Date(dataItem.PLAN_END) });
        $("#PLAN_NO").val(dataItem.PLAN_NO);
        $("#ORDER_NO").val(dataItem.ORDER_NO);
        $("#PLAN_TYPE").val(dataItem.PLAN_TYPE);
        $("#PROD_NO").val(dataItem.PROD_NO);
        $("#PROD_NAME").val(dataItem.PROD_NAME);
        $("#CRAFT_NO").val(dataItem.CRAFT_NO);
        $("#CRAFT_NAME").val(dataItem.CRAFT_NAME);
        $("#INPUT_NUM").val(dataItem.INPUT_NUM);
        $("#TARGET_NUM").val(dataItem.TARGET_NUM);
        $("#CUSTOMER").val(dataItem.CUSTOMER);
        $("#MEMO").val(dataItem.MEMO);
        $("#UNIT").val(dataItem.UNIT);

        $("#ORDER_NO").attr("disabled", "disabled");
        $("#PROD_NO").attr("disabled", "disabled");
        $("#CRAFT_NO").attr("disabled", "disabled");

        bindType("#PLAN_TYPE");

        $("#Save").click(function (data) {
            var url;
            if ($("#PLAN_NO").val() == "" || $("#ORDER_NO").val() == "" || $("#PROD_NOk").val() == "" || $("#UNIT").val() == "") {
                BzAlert("相关选项不能为空！");
                return;
            }
            var model = {
                PLAN_NBR: parseInt(dataItem.PLAN_NBR),
                PROD_NBR: dataItem.PROD_NBR,
                CRAFT_NBR: dataItem.CRAFT_NBR,
                PLAN_NO: $("#PLAN_NO").val(),
                ORDER_NO: dataItem.ORDER_NO,
                PLAN_TYPE: $("#PLAN_TYPE").val(),
                INPUT_NUM: $("#INPUT_NUM").val(),
                TARGET_NUM: $("#TARGET_NUM").val(),
                UNIT: $("#UNIT").val() == null ? "" : $("#UNIT").val(),
                PLAN_START: $("#PLAN_START").val(),
                PLAN_END: $("#PLAN_END").val(),
                CUSTOMER: $("#CUSTOMER").val(),
                REAL_START: dataItem.REAL_START,
                REAL_END: dataItem.REAL_END,
                MEMO: $("#MEMO").val()
            }
            $.post(baseUrl + "ModifyProductionPlan", model, function (data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess("操作成功！");
                    grid.grid("refresh", []);
                }
                else {
                    BzAlert(data.Message);
                }
            })
        })

    }

    $scope.deleteplan = function (data) {
        $.post(baseUrl + "DeleteProductionPlan", { plan_nbr: dataItem.PLAN_NBR }, function (data) {
            if (data.Status == 0) {
                dataItem = null;
                BzSuccess("删除成功！");
                grid.grid("refresh", []);
            }
            else {
                BzAlert(data.Message);
            }
        })
    }
}
])

//绑定计划类型  PLAN_END: {
function bindType(ele) {
    var listType = [];
    $.get(baseUrl + "getProductionPlanType", function (data) {
        if (data.Data.length > 0) {
            for (var i = 0; i < data.Data.length; i++) {
                var ss = {
                    text: data.Data[i],
                    value: data.Data[i]
                }
                listType.push(ss)
            }
            $(ele).kendoComboBox({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: listType,
                readonly: true
            });
        }
    })
}



function bindArt(ele, planno, planname) {
    var listType = [];
    $.post("Defective/GetProductListByKey", { ProNo: planno }, function (data) {
        if (data.Data.length > 0) {
            for (var i = 0; i < data.Data.length; i++) {
                var ss = {
                    text: data.Data[i].CRAFT_NO,
                    value: data.Data[i].CRAFT_NBR,
                    name: data.Data[i].CRAFT_NAME
                }
                listType.push(ss)
            }
            $(ele).kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: listType,
                width: 213,
                readonly: true,
                value: listType[0].text,
                change: function (data) {
                    var ss = $(ele).val();
                    var da = $(ele).data("kendoDropDownList").dataSource.data();
                    var dt = _.where(da, { value: parseInt(ss) });
                    if (dt.length > 0)
                        $("#CRAFT_NAME").val(dt[0].name);
                }
            });
            $("#CRAFT_NAME").val(listType[0].name);
        }

    })
}