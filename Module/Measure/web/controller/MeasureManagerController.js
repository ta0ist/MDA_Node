var baseUrl = '/MeasureManager/';
var groupOrMachine;
var grid;
$(function() {
    //导出html
    $("#importHtml").on('click', function() {
        var measureinfo = {
            measure_type: escape($("input[name='MEASURE_TYPE_input']").val()),
            measure_name: escape($("#filter").val()),
            measure_state: $("input[name='MEASURE_STATES']").val(),
            is_scarp: 0
        }

        var url = baseUrl + 'GetMeasureList';
        window.open("/measureOutinPut?par=" + JSON.stringify(measureinfo) + "&url=" + url);
    });

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

    var measure_stateData = [
        { text: '--选择状态--', value: 0 },
        { text: '封存', value: 1 },
        { text: '完好', value: 2 },
        //{ text: '预校准', value: 3 },
        { text: '到期', value: 4 }
    ];
    $("#MEASURE_STATES").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: measure_stateData,
        value: 0
    }).data("kendoComboBox");

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
    cols.push({ field: "MEASURE_TYPE", title: "类型", width: 90, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "MEASURE_NO", title: "编号", width: 80, sortable: true, filterable: true });
    cols.push({ field: "MEASURE_NAME", title: "量具名称", width: 100, sortable: true, filterable: true });
    cols.push({ field: "MANUFACTURER", title: "制造商", width: 80, sortable: true, filterable: false });
    cols.push({ field: "BUY_DATE", title: "购买日期", width: 90, sortable: true, filterable: false, format: "{0: yyyy/MM/dd}" });
    cols.push({ field: "MEASURE_RANG", title: "规格、精度及测量范围", width: 160, sortable: true, filterable: true });
    cols.push({ field: "RELEASE_POSITION", title: "发放位置", width: 80, sortable: true, filterable: false });
    cols.push({ field: "CALIBRATION_CYCLE", title: "校准周期(月)", width: 90, sortable: true, filterable: false });
    cols.push({ field: "LAST_CALIBRATION_DATE", title: "上次校验时间", width: 95, sortable: true, filterable: false, format: "{0: yyyy/MM/dd}" });
    cols.push({ field: "NEXT_CALIBRATION_DATE", title: "计划下次校验时间", width: 120, sortable: true, filterable: false, format: "{0: yyyy/MM/dd}" });
    cols.push({ field: "MEASURE_STATE", title: "状态", width: 80, sortable: true, filterable: false, template: kendo.template($("#MEASURE_STATE").html()) });
    cols.push({ field: "CALIBRATION_TYPE", title: "校准方式", width: 70, sortable: true, filterable: false, template: kendo.template($("#CALIBRATION_TYPE").html()) });
    cols.push({ field: "MEMO", title: "备注", width: 120, sortable: true, filterable: false });
    cols.push({
        command: [
            { name: "aa", text: lang.Measure.Edit + '<i class="icon-edit"></i>', className: "btn purple", click: f_edit },
            //{ name: "bb", text: $.Translate("Common.DELETE") + '<i class="icon-remove-sign"></i>', className: "btn red ", click: f_delete },去掉删除功能 htc:201708
            { name: "cc", text: lang.Measure.Scrap + '<i class="icon-trash"></i>', className: "btn green", click: f_scarp }
        ],
        title: lang.Measure.Operator,
        width: 160
    });

    grid = $("#grid").grid({
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        sort: [{ field: "MEASURE_NBR", dir: "DESC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: true, //是否绑定数据
        isPage: true, //是否分页
        server: true,
        customsearch: true,

        actionUrl: ["Lookup", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "MEASURE_NBR",
            fields: fields,
            cols: cols
        }
    });

    //中国标准时间转yyyy-MM-dd hh:mm:ss格式 htc:20170810
    function formatDate(time, format) {
        var t = new Date(time);
        var tf = function(i) { return (i < 10 ? '0' : '') + i };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                    //case 'HH':
                    //    return tf(t.getHours());
                    //    break;
                    //case 'mm':
                    //    return tf(t.getMinutes());
                    //    break;
                    //case 'ss':
                    //    return tf(t.getSeconds());
                    //    break;
            }
        })
    }

    //新增
    $("#error_a").click(function(data) {
        $.x5window("新增", kendo.template($("#add").html()));
        $("#BUY_DATE").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
        $("#LAST_CALIBRATION_DATE").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
        $("#NEXT_CALIBRATION_DATE").kendoDatePicker({ format: "yyyy/MM/dd", value: '' });

        //选择上次校验日期将校准周期相加生成下次校验日期 htc:20170810
        $("#LAST_CALIBRATION_DATE").blur(function() {
                var last = $(this).val();
                if ($("#CALIBRATION_CYCLE").val() != "") {
                    var newlast = new Date(last);
                    var yue = parseInt($("#CALIBRATION_CYCLE").val());
                    var next = new Date(newlast.setMonth(newlast.getMonth() + yue));
                    $("#NEXT_CALIBRATION_DATE").val(formatDate(next, "yyyy/MM/dd"));
                }
                if ($(this).val() == "") {
                    $("#NEXT_CALIBRATION_DATE").val("");
                    $("#CALIBRATION_CYCLE").val("")
                }
            })
            //输入校准周期在上次校验周期上累加生成下次校验周期 htc:20170810
        $("#CALIBRATION_CYCLE").blur(function() {
            var last = $("#LAST_CALIBRATION_DATE").val();
            if (last != "") {
                var newlast = new Date(last);
                var yue = parseInt($(this).val());
                var next = new Date(newlast.setMonth(newlast.getMonth() + yue));
                $("#NEXT_CALIBRATION_DATE").val(formatDate(next, "yyyy/MM/dd"));
            }
            if ($(this).val() == "") {
                $("#NEXT_CALIBRATION_DATE").val(last);
            }
        })

        $("#MEASURE_TYPE2").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: measure_typeData,
            checkbox: true,
            value: "--选择类型--"
        }).data("kendoComboBox"); //类型

        $("#MEASURE_STATEs").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: measure_stateData,
            value: 0
        }).data("kendoComboBox"); //状态

        $("#Save").click(function() {
            if ($("input[name='MEASURE_TYPE2_input']").val() == '--选择类型--') {
                BzAlert("请选择类型！");
                return;
            }
            if ($("#CALIBRATION_TYPEs").val() != 1 && $("#CALIBRATION_TYPEs").val() != 0 || $("#CALIBRATION_TYPEs").val() == "") {
                BzAlert("校准方式请输入0或1！");
                return;
            }

            var model = {
                MEASURE_TYPE: $("input[name='MEASURE_TYPE2_input']").val(),
                MEASURE_NO: $("#MEASURE_NO").val(),
                //MEASURE_NAME: $("#input_groupOrMachine").val(),
                MEASURE_NAME: $("#MEASURE_NAME").val(),
                MANUFACTURER: $("#MANUFACTURER").val(),
                BUY_DATE: $("#BUY_DATE").val(),
                MEASURE_RANG: $("#MEASURE_RANG").val(),
                RELEASE_POSITION: $("#RELEASE_POSITION").val(),
                CALIBRATION_CYCLE: $("#CALIBRATION_CYCLE").val(),
                LAST_CALIBRATION_DATE: $("#LAST_CALIBRATION_DATE").val(),
                NEXT_CALIBRATION_DATE: $("#NEXT_CALIBRATION_DATE").val(),
                MEASURE_STATE: $("input[name='MEASURE_STATEs']").val(),
                CALIBRATION_TYPE: $("#CALIBRATION_TYPEs").val(),
                IS_SCRAP: 0, //新增时为0，未报废
                MEMO: $("#MEMO").val()
            }
            $.post(baseUrl + "AddMeasure", model, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    queryMeasure();
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            })
        })
    })

    //编辑
    function f_edit(e) {
        $.x5window("编辑", kendo.template($("#add").html()));
        $("#BUY_DATE").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
        $("#LAST_CALIBRATION_DATE").kendoDatePicker({ format: "yyyy/MM/dd", value: "" });
        $("#NEXT_CALIBRATION_DATE").kendoDatePicker({ format: "yyyy/MM/dd", value: "" });

        //选择上次校验日期将校准周期相加生成下次校验日期 htc:20170810
        $("#LAST_CALIBRATION_DATE").blur(function() {
                var last = $(this).val();
                if ($("#CALIBRATION_CYCLE").val() != "") {
                    var newlast = new Date(last);
                    var yue = parseInt($("#CALIBRATION_CYCLE").val());
                    var next = new Date(newlast.setMonth(newlast.getMonth() + yue));
                    $("#NEXT_CALIBRATION_DATE").val(formatDate(next, "yyyy/MM/dd"));
                }
                if ($(this).val() == "") {
                    $("#NEXT_CALIBRATION_DATE").val("");
                    $("#CALIBRATION_CYCLE").val("")
                }
            })
            //输入校准周期在上次校验周期上累加生成下次校验周期 htc:20170810
        $("#CALIBRATION_CYCLE").blur(function() {
            var last = $("#LAST_CALIBRATION_DATE").val();
            if (last != "") {
                var newlast = new Date(last);
                var yue = parseInt($(this).val());
                var next = new Date(newlast.setMonth(newlast.getMonth() + yue));
                $("#NEXT_CALIBRATION_DATE").val(formatDate(next, "yyyy/MM/dd"));
            }
            if ($(this).val() == "") {
                $("#NEXT_CALIBRATION_DATE").val(last);
            }
        })

        $("#MEASURE_TYPE2").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: measure_typeData,
            checkbox: true,
            value: "压力表制造台账"
        }).data("kendoComboBox"); //类型

        $("#MEASURE_STATEs").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: measure_stateData,
            value: 1
        }).data("kendoComboBox"); //状态

        dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $("input[name='MEASURE_TYPE2_input']").val(dataItem.MEASURE_TYPE);
        //$("#MEASURE_TYPE2").val(dataItem.MEASURE_TYPE);
        $("#MEASURE_NO").val(dataItem.MEASURE_NO);
        //$("#input_groupOrMachine").val(dataItem.MEASURE_NAME);
        $("#MEASURE_NAME").val(dataItem.MEASURE_NAME);
        $("#MANUFACTURER").val(dataItem.MANUFACTURER);
        $("#BUY_DATE").val(moment(dataItem.BUY_DATE).format("YYYY/MM/DD"));
        $("#MEASURE_RANG").val(dataItem.MEASURE_RANG);
        $("#RELEASE_POSITION").val(dataItem.RELEASE_POSITION);
        $("#CALIBRATION_CYCLE").val(dataItem.CALIBRATION_CYCLE);

        //$("#LAST_CALIBRATION_DATE").val(moment(dataItem.LAST_CALIBRATION_DATE).format("YYYY/MM/DD"));
        dataItem.LAST_CALIBRATION_DATE == null ? $("#LAST_CALIBRATION_DATE").val() : $("#LAST_CALIBRATION_DATE").val(moment(dataItem.LAST_CALIBRATION_DATE).format("YYYY/MM/DD"));
        //$("#NEXT_CALIBRATION_DATE").val(moment(dataItem.NEXT_CALIBRATION_DATE).format("YYYY/MM/DD"));
        dataItem.NEXT_CALIBRATION_DATE == null ? $("#NEXT_CALIBRATION_DATE").val() : $("#NEXT_CALIBRATION_DATE").val(moment(dataItem.NEXT_CALIBRATION_DATE).format("YYYY/MM/DD"));

        //回显当前选择行的状态值
        //dataItem.MEASURE_STATE == 1 ? $("input[name='MEASURE_STATEs_input']").val("封存") : (dataItem.MEASURE_STATE == 2 ? $("input[name='MEASURE_STATEs_input']").val("完好") : dataItem.MEASURE_STATE == 3 ? $("input[name='MEASURE_STATEs_input']").val("预校准") : dataItem.MEASURE_STATE == 4 ? $("input[name='MEASURE_STATEs_input']").val("到期") : "请选择");
        dataItem.MEASURE_STATE == 1 ? $("input[name='MEASURE_STATEs_input']").val("封存") : (dataItem.MEASURE_STATE == 2 ? $("input[name='MEASURE_STATEs_input']").val("完好") : dataItem.MEASURE_STATE == 4 ? $("input[name='MEASURE_STATEs_input']").val("到期") : "请选择");
        //回显当前选择行的状态id
        //dataItem.MEASURE_STATE == 1 ? $("input[name='MEASURE_STATEs']").val(1) : (dataItem.MEASURE_STATE == 2 ? $("input[name='MEASURE_STATEs']").val(2) : dataItem.MEASURE_STATE == 3 ? $("input[name='MEASURE_STATEs']").val(3) : dataItem.MEASURE_STATE == 4 ? $("input[name='MEASURE_STATEs']").val(4) : 0);
        dataItem.MEASURE_STATE == 1 ? $("input[name='MEASURE_STATEs']").val(1) : (dataItem.MEASURE_STATE == 2 ? $("input[name='MEASURE_STATEs']").val(2) : dataItem.MEASURE_STATE == 4 ? $("input[name='MEASURE_STATEs']").val(4) : 0);
        //$("#MEASURE_STATEs").val(dataItem.MEASURE_STATE);
        $("#CALIBRATION_TYPEs").val(dataItem.CALIBRATION_TYPE);
        $("#MEMO").val(dataItem.MEMO);

        $("#Save").click(function() {
            if ($("input[name='MEASURE_TYPE2_input']").val() == '--选择类型--') {
                BzAlert("请选择类型！");
                return;
            }
            if ($("#CALIBRATION_TYPEs").val() != 1 && $("#CALIBRATION_TYPEs").val() != 0 || $("#CALIBRATION_TYPEs").val() == "") {
                BzAlert("校准方式请输入0或1！");
                return;
            }

            var model = {
                MEASURE_NBR: dataItem.MEASURE_NBR,
                MEASURE_TYPE: $("input[name='MEASURE_TYPE2_input']").val(),
                MEASURE_NO: $("#MEASURE_NO").val(),
                //MEASURE_NAME: $("#input_groupOrMachine").val(),
                MEASURE_NAME: $("#MEASURE_NAME").val(),
                MANUFACTURER: $("#MANUFACTURER").val(),
                BUY_DATE: $("#BUY_DATE").val(),
                MEASURE_RANG: $("#MEASURE_RANG").val(),
                RELEASE_POSITION: $("#RELEASE_POSITION").val(),
                CALIBRATION_CYCLE: $("#CALIBRATION_CYCLE").val(),
                LAST_CALIBRATION_DATE: $("#LAST_CALIBRATION_DATE").val(),
                NEXT_CALIBRATION_DATE: $("#NEXT_CALIBRATION_DATE").val(),
                MEASURE_STATE: $("input[name='MEASURE_STATEs']").val(),
                CALIBRATION_TYPE: $("#CALIBRATION_TYPEs").val(),
                IS_SCRAP: dataItem.IS_SCRAP,
                SCRAP_MEMO: dataItem.SCRAP_MEMO,
                MEMO: $("#MEMO").val()
            }
            $.post(baseUrl + "UpdMeasure", model, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    queryMeasure();
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            })
        })
    }

    //删除
    function f_delete(e) {
        dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $.post(baseUrl + "DeldMeasure", { nbr: dataItem.MEASURE_NBR }, function(data) {
            if (data.Status == 0) {
                queryMeasure();
                BzSuccess(data.Message);
            } else {
                BzAlert(data.Message);
            }
        })
    }

    //报废
    function f_scarp(e) {
        $.x5window("报废", kendo.template($("#scarp").html()));
        dataItem = this.dataItem($(e.currentTarget).closest("tr"));

        $("#SCRAP_MEMO").val(dataItem.SCRAP_MEMO);
        $("#Save").click(function() {
            var model = {
                MEASURE_NBR: dataItem.MEASURE_NBR,
                MEASURE_TYPE: dataItem.MEASURE_TYPE,
                MEASURE_NO: dataItem.MEASURE_NO,
                MEASURE_NAME: dataItem.MEASURE_NAME,
                MANUFACTURER: dataItem.MANUFACTURER,
                BUY_DATE: dataItem.BUY_DATE,
                MEASURE_RANG: dataItem.MEASURE_RANG,
                RELEASE_POSITION: dataItem.RELEASE_POSITION,
                CALIBRATION_CYCLE: dataItem.CALIBRATION_CYCLE,
                LAST_CALIBRATION_DATE: dataItem.LAST_CALIBRATION_DATE,
                NEXT_CALIBRATION_DATE: dataItem.NEXT_CALIBRATION_DATE,
                MEASURE_STATE: dataItem.MEASURE_STATE,
                CALIBRATION_TYPE: dataItem.CALIBRATION_TYPE,
                IS_SCRAP: 1, //报废时为1，已报废
                SCRAP_MEMO: $("#SCRAP_MEMO").val(),
                MEMO: dataItem.MEMO,
            }
            $.post(baseUrl + "UpdMeasure", model, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    queryMeasure();
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            })
        })
    }

    //点击查询
    $("#output").click(function() {
        queryMeasure();
    })

    //查询
    function queryMeasure() {
        var measure_type = $("input[name='MEASURE_TYPE_input']").val();
        measure_type == '--选择类型--' ? measure_type = null : measure_type = measure_type;
        var measure_state = $("input[name='MEASURE_STATES']").val();
        measure_state == '0' ? measure_state = null : measure_state = measure_state;
        var name = $("#filter").val() == '' ? null : $("#filter").val();

        grid.grid("refresh", function() {
            return [

                { field: "MEASURE_NAME", Operator: "contains", value: name },
                { field: "MEASURE_TYPE", Operator: "eq", value: measure_type },
                { field: "MEASURE_STATE", Operator: "eq", value: measure_state },
                { field: "IS_SCRAP", Operator: "eq", value: 0 }
            ]
        }, {
            logic: 'and'
        });

        //var measureinfo = {
        //    measure_type: $("input[name='MEASURE_TYPE_input']").val(),
        //    measure_name: $("#filter").val(),
        //    measure_state: $("input[name='MEASURE_STATES']").val(),
        //    is_scarp: 0
        //}

        //$.post(baseUrl + "GetMeasureList", JSON.stringify(measureinfo), function (data) {
        //    if (data.Status == 0) {
        //        grid.data("kendoGrid").dataSource.data(forData(data.Data.List));
        //    }
        //    else {
        //        BzAlert(data.Message);
        //    }
        //})
    }


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