/**
 * Created by qb on 2016/12/20.
 */
var baseUrl = '/OrderLogin/';
var groupOrMachine,
    groupOrMember;
var gridreport;
var dataItem, dataItems;
$(function () {
    groupOrMember = $("#groupOrMember").multipleComboxTree({
        url: "/MachineWorkingState/GetAllMemberAndMemberGroup",
        url2: "/MachineWorkingState/GetKeywordMemberlist",
        type: 4,
        data: {
            GroupId: 0
        },
        checkbox: true
    }).data("BZ-multipleComboxTree");//员工

    groupOrMachine = $("#groupOrMachine").multipleComboxTree({
        url: "/Alarm/GetAllMachineAndMachineGroup",
        url2: "/Alarm/GetKeywordMachinelist",
        type: 2,
        data: {
            GroupId: 0
        },
        checkbox: true
    }).data("BZ-multipleComboxTree");//设备
    var fields = {
        PROG_NAME: { type: "string" },
        PLAN_CNT: { type: "string" },
        PRO_ORDER: { type: "string" },
        PRO_PLAN: { type: "string" },
        PRODUCT_NO: { type: "string" },
        PLAN_NBR: { type: "string" },
        PROC_NBR: { type: "string" },
        TASK_NBR: { type: "string" }
    };
    var cols = [];
    cols.push({ field: "PLAN_STATE", title: lang.Order.WorkOrderStatus, width: 120, sortable: false, filterable: false, hidden: false, template: kendo.template($("#PLAN_STATE").html()) });
    cols.push({ field: "PRO_PLAN_STATUS", title: "工单", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "TASK_NBR", title: "工单nbr", width: 120, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "TASK_NO", title: lang.Order.RepairOrder, width: 120, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "ORDER_NO", title: lang.Order.Order, width: 120, sortable: true, filterable: true, hidden: false });
    cols.push({ field: "PLAN_NO", title: lang.Order.ProductionPlan, width: 120, sortable: true, filterable: true, hidden: false });
    cols.push({ field: "PLAN_NBR", title: "生产计划nbr", width: 120, sortable: true, filterable: true, hidden: true });
    cols.push({ field: "PROD_NO", title: lang.Order.ProductNumber, width: 120, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "PROD_NAME", title: lang.Order.ProductName, width: 120, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "CRAFT_NO", title: lang.Order.CraftId, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "CRAFT_NAME", title:lang.Order.CraftName, width: 160, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "PROC_NBR", title: "工序nbr", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "PROC_NO", title: lang.Order.ProcessId, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "PROC_NAME", title:lang.Order.ProcessName, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "INPUT_NUM", title:lang.Order.Inventory, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "TARGET_NUM", title: lang.Order.TargetQuantity, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "YIELD", title:lang.Order.Output, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "QUALIFIED_NUM", title: lang.Order.QualityGoods, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "INFERIOR_NUM", title: lang.Order.DefectiveGoods, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "STD_TIME", title: lang.Order.StandardTime, width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "CYCLE_RATE", title: lang.Order.CirculationRatio, width: 80, sortable: true, filterable: false, hidden: false });

    //Grid
    grid = $("#grid").grid({
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        sort: [{ field: "PLAN_NBR", dir: "DESC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: true,
        //resizeGridWidth: true,//列宽度可调
        //resizable: true,
        isPage: true,
        height: 500,
        server: true,
        customsearch: true,
        //filter: function () {
        //    return [];
        //},
        //detailTemplate: kendo.template($("#detail-template").html()),
        actionUrl: ["getWorkOrder", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "TASK_NO",
            fields: fields,
            cols: cols
        },
        rowClick: function (data) {
            groupOrMachine.clear();
            dataItem = data[0];
            var value = { code: data[0].TASK_NO, rect: true };
            var settings = {
                output: "css",

                bgColor: "#D2EAC2",
                color: "#000000",
                barWidth: 1,
                barHeight: 70
            };
            $(".order-barcode").html("").show().barcode(value, "code128", settings);
            //
            $("#item_PLAN_NO").html(data[0].PLAN_NO);
            $("#item_PROD_NAME").html(data[0].PROD_NAME);
            $("#item_CRAFT_NAME").html(data[0].CRAFT_NAME);
            $("#item_PROC_NAME").html(data[0].PROC_NAME);
            $("#item_INPUT_NUM").html(data[0].INPUT_NUM);
            $("#item_YIELD").html(data[0].YIELD);
            $("#item_TARGET_NUM").html(data[0].TARGET_NUM);
            var comp_rate = 0;
            if (data[0].TARGET_NUM > 0)
                comp_rate = parseFloat(data[0].YIELD) / data[0].TARGET_NUM;
            else
                comp_rate = 0
            if (comp_rate > 1)
                comp_rate = 1
            $("#item_COMP_RATE_bar").css({
                "width": (comp_rate * 100).toFixed(2) + '%'
            });
            $("#item_COMP_RATE").html((comp_rate * 100).toFixed(2) + "%");

            gridreport.grid("refresh", function () {
                var dataItem = data[0];
                return [
                    { field: "TASK_NBR", Operator: "eq", value: dataItem.TASK_NBR },
                ]
            });
        }
    });

    var fieldsreport = {
        LOGIN_NBR: { type: "string" },
        TASK_NBR: { type: "string" },
        MAC_NO: { type: "string" },
        MAC_NAME: { type: "string" },
        INPUT_NUM: { type: "string" },
        TARGET_NUM: { type: "string" },
        YIELD: { type: "string" },
        QUALIFIED_NUM: { type: "string" },
        INFERIOR_NUM: { type: "string" },
        START_DATE: { type: "date" },
        END_DATE: { type: "date" },
        MEN_NO: { type: "string" },
        MEM_NAME: { type: "string" }
    }

    var colsre = [];
    colsre.push({ field: "LOGIN_NBR", title: "工单编号", width: 80, sortable: true, filterable: false, hidden: true });
    colsre.push({ field: "TASK_NBR", title: "设备编号", width: 80, sortable: true, filterable: false, hidden: true });
    colsre.push({ field: "MAC_NO", title: lang.Order.EquipmentSerialNumber, width: 80, sortable: true, filterable: false, hidden: false });
    colsre.push({ field: "MAC_NAME", title: lang.Order.DeviceName, width: 80, sortable: true, filterable: false, hidden: false });
    colsre.push({ field: "INPUT_NUM", title:lang.Order.InputAmount, width: 80, sortable: true, filterable: false, hidden: false });
    colsre.push({ field: "TARGET_NUM", title:lang.Order.TargetQuantity, width: 80, sortable: true, filterable: false, hidden: false });
    colsre.push({ field: "YIELD", title: lang.Order.Output_1, width: 80, sortable: true, filterable: false, hidden: false });
    colsre.push({ field: "QUALIFIED_NUM", title: lang.Order.QualityGoods, width: 80, sortable: true, filterable: false, hidden: false });
    colsre.push({ field: "INFERIOR_NUM", title: lang.Order.DefectiveGoods, width: 80, sortable: true, filterable: false, hidden: false });
    colsre.push({ field: "START_DATE", title:lang.Order.StartDate, width: 80, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    colsre.push({ field: "END_DATE", title: lang.Order.EndDate, width: 80, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    //colsre.push({ field: "MEN_NO", title: "员工编号", width: 80, sortable: true, filterable: false, hidden: false });
    colsre.push({ field: "MEM_NAME", title: lang.Order.StaffName, width: 80, sortable: true, filterable: false, hidden: false });
    colsre.push({
        command: [
            { name: "aa", text:  lang.Order.Edit + '<i class="icon-edit"></i>', className: "btn green", click: f_edit },
            { name: "bb", text: lang.Order.EquipmentWork + '<i class="icon-ok"></i>', className: "btn purple", click: f_over }
        ], title:lang.Order.Operation, width: 200
    });

    function f_edit(e) {
        $.x5window( lang.Order.Edit, kendo.template($("#over").html()));


        var dataItems = this.dataItem($(e.currentTarget).closest("tr"));
        $("#machine").val(dataItems.MAC_NAME);
        $("#INPUT_NUM").val(dataItems.INPUT_NUM);
        $("#TARGET_NUM").val(dataItems.TARGET_NUM);

        $("#Save").click(function (data) {
            dataItems.INPUT_NUM = $("#INPUT_NUM").val();
            dataItems.TARGET_NUM = $("#TARGET_NUM").val();
            var taskinfo = dataItems;
            var data={
                    END_DATE:new Date(taskinfo.END_DATE),
                    INFERIOR_NUM:taskinfo.INFERIOR_NUM,
                    INPUT_NUM:taskinfo.INPUT_NUM,
                    LOGIN_NBR:taskinfo.LOGIN_NBR,
                    MAC_NAME:taskinfo.MAC_NAME,
                    MAC_NBR:taskinfo.MAC_NBR,
                    MAC_NO:taskinfo.MAC_NO,
                    MEM_NAME:taskinfo.MEM_NAME,
                    MEM_NO:taskinfo.MEM_NO,
                    QUALIFIED_NUM:taskinfo.QUALIFIED_NUM,
                    REPORT_DATE:taskinfo.REPORT_DATE,
                    REPORT_STATE:taskinfo.REPORT_STATE,
                    START_DATE:new Date(taskinfo.START_DATE),
                    TARGET_NUM:taskinfo.TARGET_NUM,
                    TASK_NBR:taskinfo.TASK_NBR,
                    TASK_NO:taskinfo.TASK_NO,
                    YIELD:taskinfo.YIELD

            }
            $.post(baseUrl + "UpdTaskRecord",data,function (data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    gridreport.grid("refresh", function () {
                        return [
                            { field: "TASK_NBR", Operator: "eq", value: dataItem.TASK_NBR },
                        ]
                    })
                }
            })
        })
    }

    function f_over(e) {
        $.x5window( lang.Order.Edit, kendo.template($("#complate").html()));

        setTimeout(function () {
            $("body").scrollTop($("body").height());
        }, 50);

        dataItems = this.dataItem($(e.currentTarget).closest("tr"));
        $("#pno").append(dataItem.PLAN_NO);
        $("#machine").append(dataItems.MAC_NAME);
        $("#QUALIFIED_NUM").val(dataItems.QUALIFIED_NUM)
        $("#INFERIOR_NUM").append(dataItems.INFERIOR_NUM);

        $.get(baseUrl+"getReason", function (data) {
            if (data.Status == 0) {
                for (var i = 0; i < data.Data.length; i = i + 2) {
                    var html = "<tr><td style='width: 400px; '><div class='controls' id='span' style='margin-left:40px'><input type='number' id='INFERIOR_NUM' min='0' value='0' name='INFERIOR_NUM' class='inferior_num span6 m-wrap' pid='" + data.Data[i].INFERIOR_NBR + "' style='width:40px;float:left;' /><label class='control-label' data-lang='Common.PROG_TYPE' style='float: left !important;text-align:left;margin-left:5px'>" + data.Data[i].INFERIOR_NAME + "</label></div></td>";
                    if (i + 1 < data.Data.length)
                        html = html + "<td  style='width: 400px; '><div class='controls' id='span' style='margin-left:40px'><input type='number' id='INFERIOR_NUM' min='0' value='0' name='INFERIOR_NUM' class='inferior_num span6 m-wrap' pid='" + data.Data[i + 1].INFERIOR_NBR + "' style='width:40px;float:left;' /><label class='control-label' data-lang='Common.PROG_TYPE' style='float: left !important;text-align:left;margin-left:5px'>" + data.Data[i + 1].INFERIOR_NAME + "</label></div></td>";
                    html = html + "</tr>"
                    $("#pos").append(html);
                }
                $(".inferior_num").change(function () {
                    var sum = 0;
                    //if (dataItems.INFERIOR_NUM == "0" || dataItems.INFERIOR_NUM == null)
                    //    sum = 0;
                    //else
                    //    sum = parseInt(dataItems.INFERIOR_NUM);
                    $(".inferior_num").each(function () {
                        if ($(this).val() != '') {
                            sum += parseInt($(this).val());
                        }
                    })
                    $("#INFERIOR_NUM").empty();
                    $("#INFERIOR_NUM").append(sum);

                })

            }
        })

        $("#Save").click(function () {
            dataItems.QUALIFIED_NUM = $("#QUALIFIED_NUM").val();
            dataItems.INFERIOR_NUM = $("#INFERIOR_NUM").eq(0).html();
            var taskinfo = dataItems;
            var macprocloglist = [];
            $(".inferior_num").each(function () {
                if ($(this).val() != '') {
                    macprocloglist.push({
                        QUALIFIED_TYPE: $(this).attr("pid"),
                        NUM: parseInt($(this).val())
                    })
                }
            })
            console.log(taskinfo);
            var task={
                END_DATE: taskinfo.END_DATE,
                INFERIOR_NUM: taskinfo.INFERIOR_NUM,
                INPUT_NUM: taskinfo.INPUT_NUM,
                LOGIN_NBR: taskinfo.LOGIN_NBR,
                MAC_NAME: taskinfo.MAC_NAME,
                MAC_NBR: taskinfo.MAC_NBR,
                MAC_NO: taskinfo.MAC_NO,
                MEM_NAME: taskinfo.MEM_NAME,
                MEM_NO: taskinfo.MEM_NO,
                QUALIFIED_NUM: taskinfo.QUALIFIED_NUM,
                REPORT_DATE: taskinfo.REPORT_DATE,
                REPORT_STATE: taskinfo.REPORT_STATE,
                START_DATE: taskinfo.START_DATE,
                TARGET_NUM: taskinfo.TARGET_NUM,
                TASK_NBR: taskinfo.TASK_NBR,
                TASK_NO:taskinfo.TASK_NO,
                YIELD: taskinfo.YIELD
            }
            var data={
                taskinfo: task,
                macprocloglist: macprocloglist
            }
            $.post(baseUrl + "machineReport",data, function (data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    gridreport.grid("refresh", function () {
                        return [
                            { field: "TASK_NBR", Operator: "eq", value: dataItem.TASK_NBR },
                        ]
                    })
                }
                else {
                    BzAlert(data.Message);
                }
            })

        })
    }

    $("#filter").keydown(function (e) {
        if (e.keyCode == 13) {
            $("#output").trigger("click");
        }
    })

    $("#search").click(function () {
        $.x5window(lang.Order.Edit+'----' + dataItem.TASK_NO, kendo.template($("#order").html()));

        $.post(baseUrl + "getSumQualifiedInferioriYByTaskNbr", { task_nbr: dataItem.TASK_NBR }, function (data) {
            if (data.Data.length > 0) {
                $("#QUALIFIED_NUM").val(data.Data[0].QUALIFIED_NUM);
                $("#INFERIOR_NUM").val(data.Data[0].INFERIOR_NUM);
            }
        })




        $("#Save").click(function () {
            var QUALIFIED_NUM = $("#QUALIFIED_NUM").val();
            var INFERIOR_NUM = $("#INFERIOR_NUM").val();
            $.post(baseUrl + "UpdWorkOrder", { task_nbr: dataItem.TASK_NBR, qualified_num: QUALIFIED_NUM, inferior_num: INFERIOR_NUM, proc_nbr: dataItem.PROC_NBR, plan_nbr: dataItem.PLAN_NBR }, function (data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    grid.grid("refresh", function () {
                        return [
                            { field: "ORDER_NO", operator: "contains", value: $("#filter").val() },
                            { field: "PLAN_NO", operator: "contains", value: $("#filter").val() }
                        ]
                    }, {
                        logic: "or"
                    })
                }
                else {
                    BzAlert(data.Message);
                }

            })

        })

    })

    gridreport = $("#gridreport").grid({
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
        //server: false,
        //detailTemplate: kendo.template($("#detail-template").html()),

        actionUrl: ["getWorkOrderLoginDetail", "", "", ""], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "TASK_NBR",
            fields: fieldsreport,
            cols: colsre
        }
    });

    //--------------------------------------------------------------------------查询
    $("#output").click(function (data) {
        dataItem = null;
        grid.grid("refresh", function () {
            return [
                { field: "ORDER_NO", operator: "contains", value: $("#filter").val() },
                { field: "PLAN_NO", operator: "contains", value: $("#filter").val() }
            ]
        }, {
            logic: "or"
        })
    })

    $("#login").click(function (data) {
        var mac_nbrs = groupOrMachine.dataAarry;
        if (dataItem == null) {
            BzAlert(lang.Order.PleaseSelectTheRepairOrder);
            return;
        }
        var task_nbr = dataItem.TASK_NBR;
        var listmac = [];
        for (var ite in mac_nbrs) {
            listmac.push(parseInt(ite));
        }
        if (listmac.length == 0) {
            BzAlert(lang.Order.PleaseSelectADevice);
            return;
        }
        $.post(baseUrl + "addTaskRecord", { task_nbr: task_nbr, mac_nbrs: listmac }, function (data) {
            if (data.Status == 0) {
                BzSuccess(lang.Order.OperationIsSuccessful);
                gridreport.grid("refresh", function () {
                    var dataItem = data[0];
                    return [
                        { field: "TASK_NBR", Operator: "eq", value: task_nbr },
                    ]
                });
            }
        })
    })

});