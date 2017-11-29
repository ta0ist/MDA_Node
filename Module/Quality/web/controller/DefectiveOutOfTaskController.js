var baseUrl = '/DefectiveOutOfTask/';
var grid;
var dataItem;
$(function() {
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });

    var fields = {
        WORK_OUT_NBR: { type: "string" }, //ID
        WORK_OUT_TYPE: { type: "string" }, //类型
        WORK_OUT_NO: { type: "string" }, //型号
        WORK_OUT_NUM: { type: "decimal" }, //不合格数量
        STATION: { type: "string" }, //工位
        CREATE_DATE: { type: "Date" }, //创建日期
        WORK_OUT_AUTO_NO: { type: "string" }, //流水号
        WORK_OUT_SUPPLIER: { type: "string" }, //工单号
        MEMO: { type: "string" }, //描述
        DISPOSE_DATE: { type: "Date" }, //修改日期
        MATERIAL_NO: { type: "string" }, //物料号
        OPERATOR: { type: "string" }, //操作员


        WORK_OUT_NAME: { type: "string" }, //型号名
        WORK_OUT_SUPPLIERS: { type: "string" }, //型号供应商
        MATERIAL_NAME: { type: "string" }, //物料名
        MATERIAL_SUPPLIER: { type: "string" }, //物料供应商
        IS_RETURN: { type: "int" }, //是否返工
        IS_FINISH: { type: "int" }, //是否完工
        SUPPLIEF: { type: "string" }, //供应商

    };
    var cols = [];
    cols.push({ field: "WORK_OUT_NBR", title: "不合格单号", width: 120, sortable: true, filterable: true, hidden: false });
    cols.push({ field: "MATERIAL_NO", title: "物料号", width: 60, sortable: true, filterable: false });
    cols.push({ field: "MATERIAL_NAME", title: "物料名", width: 60, sortable: true, filterable: false });
    //cols.push({ field: "MATERIAL_SUPPLIER", title: "物料供应商", width: 70, sortable: true, filterable: false });
    cols.push({ field: "WORK_OUT_NO", title: "型号", width: 90, sortable: true, filterable: true });
    cols.push({ field: "WORK_OUT_NAME", title: "型号名", width: 60, sortable: true, filterable: false });
    //cols.push({ field: "WORK_OUT_SUPPLIERS", title: "型号供应商", width: 70, sortable: true, filterable: false });
    cols.push({ field: "WORK_OUT_TYPE", title: "类型", width: 50, sortable: true, filterable: false });
    cols.push({ field: "STATION", title: "工位", width: 50, sortable: true, filterable: false });
    cols.push({ field: "WORK_OUT_NUM", title: "不合格数", width: 70, sortable: true, filterable: false });
    cols.push({ field: "CREATE_DATE", title: "创建日期", width: 90, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    cols.push({ field: "WORK_OUT_SUPPLIER", title: "工单号", width: 80, sortable: true, filterable: false });
    cols.push({ field: "SUPPLIEF", title: "供应商", width: 60, sortable: true, filterable: false });
    cols.push({ field: "DISPOSE_DATE", title: "修改日期", width: 90, sortable: true, filterable: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    cols.push({ field: "OPERATOR", title: "操作员", width: 60, sortable: true, filterable: false });
    cols.push({ field: "IS_RETURN", title: "是否返工", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#IS_RETURN").html()) });
    cols.push({ field: "IS_FINISH", title: "是否完工", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#IS_FINISH").html()) });
    cols.push({
        command: [
            { name: "aa", text: lang.Quality.Edit + '<i class="icon-edit"></i>', className: "btn green", click: f_edit },
            { name: "bb", text: lang.Quality.Delete + '<i class="icon-remove-sign"></i>', className: "btn red ", click: f_delete },
            { name: "cc", text: lang.Quality.Preview + '<i class="icon-ok"></i>', className: "btn purple ", click: f_query },
            { name: "dd", text: lang.Quality.ConfirmRework + '<i class="icon-ok"></i>', className: "btn blue ", click: confirm_rework },
            { name: "ee", text: lang.Quality.ReworkDone + '<i class="icon-ok"></i>', className: "btn blue ", click: rework_done },
        ],
        title: lang.Quality.Operator,
        width: 230
    });

    grid = $("#grid").grid({
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: true,
        isPage: true,
        server: true,
        customsearch: true,

        actionUrl: ["GetWorkOutList", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "WORK_OUT_NBR",
            fields: fields,
            cols: cols
        }
    });

    //确认返工
    function confirm_rework(e) {
        dataItems = this.dataItem($(e.currentTarget).closest("tr"));

        var model = {
            WORK_OUT_NBR: dataItems.WORK_OUT_NBR,
            WORK_OUT_NO: dataItems.WORK_OUT_NO,
            MATERIAL_NO: dataItems.MATERIAL_NO,
            OPERATOR: dataItems.OPERATOR,
            CREATE_DATE: dataItems.CREATE_DATE,
            WORK_OUT_SUPPLIER: dataItems.WORK_OUT_SUPPLIER,
            WORK_OUT_NUM: dataItems.WORK_OUT_NUM,
            WORK_OUT_TYPE: dataItems.WORK_OUT_TYPE,
            STATION: dataItems.STATION,
            MEMO: dataItems.MEMO,
            IS_RETURN: 1,
            IS_FINISH: dataItems.IS_FINISH,
        }

        $.post(baseUrl + "UpdWorkOut", model, function(data) {
            if (data.Status == 0) {
                BzSuccess(data.Message);
                refreshgrid();
            } else {
                BzAlert(data.Message);
            }
        })
    }

    //返工完成
    function rework_done(e) {
        dataItems = this.dataItem($(e.currentTarget).closest("tr"));

        var model = {
            WORK_OUT_NBR: dataItems.WORK_OUT_NBR,
            WORK_OUT_NO: dataItems.WORK_OUT_NO,
            MATERIAL_NO: dataItems.MATERIAL_NO,
            OPERATOR: dataItems.OPERATOR,
            CREATE_DATE: dataItems.CREATE_DATE,
            WORK_OUT_SUPPLIER: dataItems.WORK_OUT_SUPPLIER,
            WORK_OUT_NUM: dataItems.WORK_OUT_NUM,
            WORK_OUT_TYPE: dataItems.WORK_OUT_TYPE,
            STATION: dataItems.STATION,
            MEMO: dataItems.MEMO,
            IS_RETURN: dataItems.IS_RETURN,
            IS_FINISH: 1,
        }

        $.post(baseUrl + "UpdWorkOut", model, function(data) {
            if (data.Status == 0) {
                BzSuccess(data.Message);
                refreshgrid();
            } else {
                BzAlert(data.Message);
            }
        })

    }

    //预览打印
    function f_query(e) {
        dataItems = this.dataItem($(e.currentTarget).closest("tr"));
        window.open("/DefectiveOutOfTaskPrint?CREATE_DATE=" + escape(dataItems.CREATE_DATE) + "&DISPOSE_DATE=" + escape(dataItems.DISPOSE_DATE) + "&MATERIAL_NAME=" + escape(dataItems.MATERIAL_NAME) +
            "&MATERIAL_NO=" + escape(dataItems.MATERIAL_NO) + "&MATERIAL_SUPPLIER=" + escape(dataItems.MATERIAL_SUPPLIER) + "&MEMO=" + escape(dataItems.MEMO) + "&OPERATOR=" + escape(dataItems.OPERATOR) +
            "&STATION=" + escape(dataItems.STATION) + "&WORK_OUT_AUTO_NO=" + escape(dataItems.WORK_OUT_AUTO_NO) + "&WORK_OUT_NAME=" + escape(dataItems.WORK_OUT_NAME) + "&WORK_OUT_NBR=" + escape(dataItems.WORK_OUT_NBR) +
            "&WORK_OUT_NO=" + escape(dataItems.WORK_OUT_NO) + "&WORK_OUT_NUM=" + escape(dataItems.WORK_OUT_NUM) + "&WORK_OUT_SUPPLIER=" + escape(dataItems.WORK_OUT_SUPPLIER) +
            "&WORK_OUT_SUPPLIERS=" + escape(dataItems.WORK_OUT_SUPPLIERS) + "&WORK_OUT_TYPE=" + escape(dataItems.WORK_OUT_TYPE) +
            "&WORK_OUT_CAST_NO=" + escape(dataItems.WORK_OUT_CAST_NO) + "&WORK_OUT_CAST_NAME=" + escape(dataItems.WORK_OUT_CAST_NAME) +
            "&CAST_NO=" + escape(dataItems.CAST_NO) + "&CAST_NAME=" + escape(dataItems.CAST_NAME)
        );
    }

    //新增
    $("#error_a").click(function(data) {
        $.x5window(lang.Quality.Add, kendo.template($("#add").html()));

        //不同类型选择型号或物料号 htc:20170815
        $('.TASK_TYPE').change(function() {
            var thisval = $(this).next().html();

            if (thisval == '零件') {
                $("#MATERIAL_NO").val("");
                $("#MATERIAL_NO").attr("disabled", true);
                $("#WORK_OUT_NO").attr("disabled", false);
            }
            if (thisval == '原材料') {
                $("#WORK_OUT_NO").val("");
                $("#WORK_OUT_NO").attr("disabled", true);
                $("#MATERIAL_NO").attr("disabled", false);
            }
        });

        //获取次品原因 htc:20170815
        $.get("/DefectiveReason/getReason", function(data) {
            if (data.Status == 0) {
                var html = '';
                for (var i = 0; i < data.Data.length; i++) {
                    html += '<div><input class="reason" type="checkbox" id="' + i + '" value="' + data.Data[i].INFERIOR_NBR + '"><label for="' + i + '" style="display:inline-block">' + data.Data[i].INFERIOR_NAME + '</label></div>';
                }
                $("#cpyy").append(html);
            }
        })

        $("#Save").click(function() {
            //获取类型
            var WORK_OUT_TYPE = '';
            $('.TASK_TYPE').each(function() {
                    if ($(this).attr('checked')) {
                        WORK_OUT_TYPE = $(this).next().html();
                    }
                })
                //获取工位
            var STATION = '';
            $('.TASK_GW').each(function() {
                if ($(this).attr('checked')) {
                    STATION = $(this).next().html();
                }
            })

            //获取选中的原因 htc:20170815
            var loglist = [];
            $('.reason').each(function() {
                if ($(this).attr('checked')) {
                    //loglist.push({ "INFERIOR_NBR": $(this).val() });
                    loglist.push($(this).val());
                }
            })

            var model = {
                WORK_OUT_NO: $('#WORK_OUT_NO').val(),
                MATERIAL_NO: $('#MATERIAL_NO').val(),
                OPERATOR: $('#OPERATOR').val(),
                WORK_OUT_SUPPLIER: $('#WORK_OUT_SUPPLIER').val(),
                WORK_OUT_NUM: $('#WORK_OUT_NUM').val(),
                WORK_OUT_TYPE: WORK_OUT_TYPE,
                STATION: STATION,
                //MEMO: $("#MEMO").val(),
                MEMO: loglist.join(","),
                SUPPLIEF: $("#SUPPLIEF").val(),
            }

            $.post(baseUrl + "AddWorkOut", model, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    refreshgrid()
                } else {
                    BzAlert(data.Message);
                }
            })
        })
    })

    //编辑
    function f_edit(e) {
        $.x5window(lang.Quality.Edit, kendo.template($("#add").html()));

        //不同类型选择型号或物料号 htc:20170815
        $('.TASK_TYPE').change(function() {
            var thisval = $(this).next().html();

            if (thisval == '零件') {
                $("#MATERIAL_NO").val("");
                $("#MATERIAL_NO").attr("disabled", true);
                $("#WORK_OUT_NO").attr("disabled", false);
            }
            if (thisval == '原材料') {
                $("#WORK_OUT_NO").val("");
                $("#WORK_OUT_NO").attr("disabled", true);
                $("#MATERIAL_NO").attr("disabled", false);
            }
        })

        dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $("#WORK_OUT_NO").val(dataItem.WORK_OUT_NO);
        $("#MATERIAL_NO").val(dataItem.MATERIAL_NO);
        $("#OPERATOR").val(dataItem.OPERATOR);
        $("#WORK_OUT_SUPPLIER").val(dataItem.WORK_OUT_SUPPLIER);
        $("#WORK_OUT_NUM").val(dataItem.WORK_OUT_NUM);
        $("#SUPPLIEF").val(dataItem.SUPPLIEF);
        //$("#MEMO").val(dataItem.MEMO);


        $.get("/DefectiveReason/getReason", function(data) {
            if (data.Status == 0) {
                var html = '';
                for (var i = 0; i < data.Data.length; i++) {
                    html += '<div><input class="reason" id="' + i + '" type="checkbox" value="' + data.Data[i].INFERIOR_NBR + '"><label for="' + i + '" style="display:inline-block">' + data.Data[i].INFERIOR_NAME + '</label></div>';
                }
                $("#cpyy").append(html);
            }
            //获取次品原因并回显 htc:20170815
            var cpyyArr = dataItem.MEMO.split(",");
            $('.reason').each(function() {
                for (var i = 0; i < cpyyArr.length; i++) {
                    if ($(this).val() == parseInt(cpyyArr[i])) {
                        $(this).attr('checked', true);
                    }
                }
            })
        })

        //回显
        $('.TASK_TYPE').each(function() {
            //htc:20170815
            if (dataItem.WORK_OUT_TYPE == '零件') {
                $("#MATERIAL_NO").val("");
                $("#MATERIAL_NO").attr("disabled", true);
            }
            if (dataItem.WORK_OUT_TYPE == '原材料') {
                $("#WORK_OUT_NO").val("");
                $("#WORK_OUT_NO").attr("disabled", true);
            }

            if ($(this).next().html() == dataItem.WORK_OUT_TYPE) {
                $(this).attr('checked', true);
            }
        })
        $('.TASK_GW').each(function() {
            if ($(this).next().html() == dataItem.STATION) {
                $(this).attr('checked', true);
            }
        })

        $("#Save").click(function() {
            //获取类型
            var WORK_OUT_TYPE = '';
            $('.TASK_TYPE').each(function() {
                    if ($(this).attr('checked')) {
                        WORK_OUT_TYPE = $(this).next().html();
                    }
                })
                //获取工位
            var STATION = '';
            $('.TASK_GW').each(function() {
                if ($(this).attr('checked')) {
                    STATION = $(this).next().html();
                }
            })

            //获取选中的原因 htc:20170815
            var loglist = [];
            $('.reason').each(function() {
                if ($(this).attr('checked')) {
                    //loglist.push({ "INFERIOR_NBR": $(this).val() });
                    loglist.push($(this).val());
                }
            })

            var model = {
                WORK_OUT_NBR: dataItem.WORK_OUT_NBR,
                WORK_OUT_NO: $('#WORK_OUT_NO').val(),
                MATERIAL_NO: $('#MATERIAL_NO').val(),
                OPERATOR: $('#OPERATOR').val(),
                CREATE_DATE: dataItem.CREATE_DATE,
                WORK_OUT_SUPPLIER: $('#WORK_OUT_SUPPLIER').val(),
                WORK_OUT_NUM: $('#WORK_OUT_NUM').val(),
                WORK_OUT_TYPE: WORK_OUT_TYPE,
                STATION: STATION,
                //MEMO: $("#MEMO").val(),
                MEMO: loglist.join(","),
                SUPPLIEF: $("#SUPPLIEF").val(),
                IS_RETURN: dataItem.IS_RETURN,
                IS_FINISH: dataItem.IS_FINISH
            }

            $.post(baseUrl + "UpdWorkOut", model, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    $('#MATERIAL_NOS').val('')
                    refreshgrid();
                } else {
                    BzAlert(data.Message);
                }
            })
        })
    }

    //删除
    function f_delete(e) {
        dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $.post(baseUrl + "DelWorkOut", { workournbr: dataItem.WORK_OUT_NBR }, function(data) {
            if (data.Status == 0) {
                BzSuccess(data.Message);
                refreshgrid();
            } else {
                BzAlert(data.Message);
            }
        })
    }

    //--------------------------------------------------------------------------查询
    $("#output").click(function(data) {
        dataItem = null;
        refreshgrid();
    })

    //刷新grid
    function refreshgrid() {
        var ltDate = $('#endTime').val();
        var isdate = new Date(ltDate.replace(/-/g, "/")); //把日期字符串转换成日期格式
        isdate = new Date((isdate / 1000 + (86400 * 1)) * 1000); //日期加1天
        var pdate = isdate.getFullYear() + "-" + (isdate.getMonth() + 1) + "-" + (isdate.getDate()); //把日期格式转换成字符串

        var mNos = $('#MATERIAL_NOS').val() == "" ? null : $('#MATERIAL_NOS').val();

        grid.grid("refresh", function() {
            return [
                { field: "MATERIAL_NO", Operator: "contains", value: mNos },
                { field: "CREATE_DATE", Operator: "gte", value: $('#startTime').val() },
                { field: "CREATE_DATE", Operator: "lt", value: pdate },
                { field: "IS_RETURN", Operator: "eq", value: $('#isReturn').val() },
                { field: "IS_FINISH", Operator: "eq", value: $('#isFinish').val() },
            ]
        });
    }
})