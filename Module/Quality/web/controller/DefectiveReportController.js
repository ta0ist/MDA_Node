var baseUrl = '/DefectiveReport/';
var groupOrMachine
var grid;
var dataItem, dataItems;

//初始化
$(function() {
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });

    groupOrMachine = $("#groupOrMachine").multipleComboxTree({
        url: "/Alarm/GetAllMachineAndMachineGroup",
        url2: "/Alarm/GetKeywordMachinelist",
        type: 2,
        data: {
            GroupId: 0
        },
        //checkbox: true
    }).data("BZ-multipleComboxTree"); //设备

    var fields = {
        DEFECTIVE_NBR: { type: "string" }, //次品id
        LOGIN_NBR: { type: "int" }, //登录id
        PLAN_NO: { type: "string" }, //计划单编号
        ORDER_NO: { type: "string" }, //订单编号
        TASK_NO: { type: "string" }, //工单号
        CAST_CODE: { type: "string" }, //铸件编号
        MATERIEL_NO: { type: "string" }, //物料号
        CAST_NAME: { type: "string" }, //铸件名称
        MATERIEL_NAME: { type: "string" }, //物料名称
        INFERIOR_NUM: { type: "decimal" }, //不合格数量
        REPORT_DATE: { type: "DateTime" }, //报告时间
        SUPPLIER: { type: "string" }, //供应商
        PROD_NAME: { type: "string" }, //产品名称
        PROD_NO: { type: "string" }, //产品编号
        DESCRIBE: { type: "string" }, //描述
        REPORT_PERSON_NBR: { type: "int" }, //报告人id
        REPORT_PERSON: { type: "string" }, //报告人
        INSPECTOR: { type: "string" }, //检验员
        PROD_NENGINEER: { type: "string" },
        DISPOSITION_CONCLUSION: { type: "string" }, //处置结论
        QUALITY_ENGINEER: { type: "string" },
        SCRAP_NUM: { type: "decimal" }, //报废数量
        REWORK_NUM: { type: "decimal" }, //返工数量
        REWORK_PROPOSAL: { type: "string" }, //返工方案
        QE_NEGINEER: { type: "string" }, //质量工程师
        MBR_IN_IT: { type: "string" }, //移入IT单号
        PE_ENGINEER: { type: "string" }, //生产工程师
        REWORK_MACHINE: { type: "string" }, //返工机床
        REWORK_INSPECTION: { type: "string" }, //返工后重新检修
        MBR_OUT_IT: { type: "string" }, //移除IT单号
        SCRAP_APPROVE: { type: "string" }, //报废批准
        MANUFACTURE_DATE: { type: "DateTime" },
        CONFIRMATION_DATE: { type: "DateTime" },
        MBR: { type: "string" },
        MAC_NBR: { type: "string" }, //设备id
        MAC_NO: { type: "string" }, //设备编号
        MAC_NAME: { type: "string" }, //设备名称
        MEMO: { type: "string" }, //次品报告单号

        REPORT_STATE: { type: "string" }, //是否确认
        INSPECTION_DATE: { type: "date" }, //修改时间
        MEM_NAME: { type: "string" }, //修改人

        PLAN_MEMO: { type: "string" }, //料号
        IS_RETURN: { type: "int" }, //是否返工
        IS_FINISH: { type: "int" }, //是否完工
        DR_SUPPLIER: { type: "string" } //

    };

    var cols = [];
    cols.push({ field: "MEMO", title: "次品报告单号", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "LOGIN_NBR", title: "登录NBR", width: 120, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "TASK_NO", title: "任务编号", width: 120, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "ORDER_NO", title: "订单编号", width: 120, sortable: true, filterable: false, hidden: true });

    cols.push({ field: "DEFECTIVE_NBR", title: "不合格单号", width: 120, sortable: true, filterable: true, hidden: false });
    cols.push({ field: "PLAN_NO", title: "工单号", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "INFERIOR_NUM", title: "不合格数", width: 70, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "REPORT_DATE", title: "报告时间", width: 80, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    cols.push({ field: "INSPECTION_DATE", title: "确认时间", width: 90, sortable: true, filterable: false, hidden: false, format: "{0: yyyy/MM/dd HH:mm:ss}" });
    cols.push({ field: "PROD_NAME", title: "产品名称", width: 100, sortable: true, filterable: true, hidden: false });
    cols.push({ field: "PROD_NO", title: "产品编号", width: 100, sortable: true, filterable: true, hidden: false });
    cols.push({ field: "REPORT_PERSON_NBR", title: "报告人id", width: 100, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "REPORT_PERSON", title: "报告人", width: 60, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "MEM_NAME", title: "确认人", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "MAC_NBR", title: "设备id", width: 120, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "MAC_NAME", title: "设备名称", width: 120, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "MAC_NO", title: "设备编号", width: 70, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "DR_SUPPLIER", title: "供应商", width: 60, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "REPORT_STATE", title: "是否确认", width: 100, sortable: true, filterable: true, hidden: false, template: kendo.template($("#IsOK").html()) });
    cols.push({ field: "IS_RETURN", title: "是否返工", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#IS_RETURN").html()) });
    cols.push({ field: "IS_FINISH", title: "是否完工", width: 80, sortable: true, filterable: false, hidden: false, template: kendo.template($("#IS_FINISH").html()) });
    cols.push({
        command: [
            { name: "aa", text: lang.Quality.Edit + '<i class="icon-edit"></i>', className: "btn blue", click: f_update },
            { name: "bb", text: lang.Quality.Confirm + '<i class="icon-edit"></i>', className: "btn green", click: f_edit },
            { name: "cc", text: lang.Quality.Preview + '<i class="icon-ok"></i>', className: "btn purple", click: f_preview },
            { name: "dd", text: lang.Quality.Delete + '<i class="icon-remove-sign"></i>', className: "btn red", click: f_delete },
            { name: "ee", text: lang.Quality.ConfirmRework + '<i class="icon-ok"></i>', className: "btn blue", click: confirm_rework },
            { name: "ff", text: lang.Quality.ReworkDone + '<i class="icon-ok"></i>', className: "btn blue", click: rework_done },
        ],
        title: lang.Quality.Operator,
        width: 250
    });

    //Grid
    grid = $("#grid").grid({
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: true,
        isPage: true,
        height: 500,
        server: true,
        customsearch: true,
        actionUrl: ["GetDefectiveList", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "DEFECTIVE_NBR",
            fields: fields,
            cols: cols
        }
    });

    //删除
    function f_delete(e) {
        dataItems = this.dataItem($(e.currentTarget).closest("tr"));
        $.post(baseUrl + "DelDefectiveReport", { reportnbr: dataItems.DEFECTIVE_NBR }, function(data) {
            if (data.Status == 0) {
                BzSuccess(data.Message);
                grid.grid("refresh", [])
            } else {
                BzAlert(data.Message);
            }
        });
    }

    //编辑
    function f_update(e) {
        $.x5window(lang.Quality.Edit, kendo.template($("#redact").html()));
        dataItems = this.dataItem($(e.currentTarget).closest("tr"));
        //回显
        var value = { code: dataItems.PROD_NO, rect: true };
        var settings = {
            output: "css",
            bgColor: "white",
            color: "#000000",
            barWidth: 1,
            barHeight: 40
        };
        $(".LJBHTM").html("").show().barcode(value, "code128", settings);

        var value_memo = { code: dataItems.CAST_NO, rect: true };
        var settings_memo = {
            output: "css",
            bgColor: "white",
            color: "#000000",
            barWidth: 1,
            barHeight: 40
        };
        $(".ZJBHTM").html("").show().barcode(value_memo, "code128", settings_memo);

        //$('#GD_BH').html(dataItems.TASK_NO.bold().fontsize(2));
        $('#GD_BH').html(dataItems.PLAN_NO.bold().fontsize(2));
        dataItems.MEMO == null ? $('#MEMO').html() : $('#MEMO').html(("M" + dataItems.DEFECTIVE_NBR).bold().fontsize(2));
        $('#MAC_NO').html($('#MAC_NO').html() + dataItems.MAC_NO.bold().fontsize(2));
        //$('#PROD_NO').html(dataItems.PROD_NO.bold().fontsize(2));
        $('#PROD_NO').html(dataItems.PROD_NO.bold().fontsize(2));
        dataItems.MATERIEL_NAME == null ? "" : $('#PROD_NAME').html(dataItems.MATERIEL_NAME.bold().fontsize(2));
        $('#INFERIOR_NUM').html(dataItems.INFERIOR_NUM.toString().bold().fontsize(2));
        //$('#TASK_NO').html(dataItems.TASK_NO.bold().fontsize(2));
        $('#TASK_NO').html(dataItems.PLAN_NO.bold().fontsize(2));
        $('#REPORT_DATE').html(dataItems.REPORT_DATE.bold().fontsize(2));
        $('#REPORT_PERSON').html($('#REPORT_PERSON').html() + dataItems.REPORT_PERSON.bold().fontsize(2));

        //$('#SUPPLIER').html(dataItems.SUPPLIER.bold().fontsize(2));
        dataItems.SUPPLIER == null ? $('#SUPPLIER').html("") : $('#SUPPLIER').html(dataItems.SUPPLIER.bold().fontsize(2));
        dataItems.DR_SUPPLIER == null ? $('#DR_SUPPLIER').val("") : $('#DR_SUPPLIER').val(dataItems.DR_SUPPLIER);
        dataItems.CAST_NO == null ? "" : $('#MATERIEL_NO').html(dataItems.CAST_NO.bold().fontsize(2));
        //$('#MATERIEL_NAME').html(dataItems.MATERIEL_NAME.bold().fontsize(2));
        dataItems.ML_CAST_NAME == null ? $('#MATERIEL_NAME').html("") : $('#MATERIEL_NAME').html(dataItems.ML_CAST_NAME.bold().fontsize(2));
        //$('#DESCRIBE').val(dataItems.DESCRIBE);

        $('#INSPECTOR').val($('#INSPECTOR').val() + (dataItems.INSPECTOR == null ? '' : dataItems.INSPECTOR));
        $('#PE_ENGINEER').val($('#PE_ENGINEER').val() + (dataItems.PE_ENGINEER == null ? '' : dataItems.PE_ENGINEER));
        $('#DISPOSITION_CONCLUSION').val($('#DISPOSITION_CONCLUSION').val() + (dataItems.DISPOSITION_CONCLUSION == null ? '' : dataItems.DISPOSITION_CONCLUSION));
        $('#SCRAP_NUM').val($('#SCRAP_NUM').val() + (dataItems.SCRAP_NUM == null ? '' : dataItems.SCRAP_NUM));
        $('#REWORK_NUM').val($('#REWORK_NUM').val() + (dataItems.REWORK_NUM == null ? '' : dataItems.REWORK_NUM));
        $('#QE_NEGINEER').val($('#QE_NEGINEER').val() + (dataItems.QE_NEGINEER == null ? '' : dataItems.QE_NEGINEER));
        $('#REWORK_PROPOSAL').val($('#REWORK_PROPOSAL').val() + (dataItems.REWORK_PROPOSAL == null ? '' : dataItems.REWORK_PROPOSAL));
        $('#MBR_IN_IT').val($('#MBR_IN_IT').val() + (dataItems.MBR_IN_IT == null ? '' : dataItems.MBR_IN_IT));
        $('#REWORK_MACHINE').val($('#REWORK_MACHINE').val() + (dataItems.REWORK_MACHINE == null ? '' : dataItems.REWORK_MACHINE));
        $('#PE_ENGINNER2').val($('#PE_ENGINNER2').val() + (dataItems.PE_ENGINEER == null ? '' : dataItems.PE_ENGINEER));
        $('#REWORK_INSPECTION').val($('#REWORK_INSPECTION').val() + (dataItems.REWORK_INSPECTION == null ? '' : dataItems.REWORK_INSPECTION));
        $('#MBR_OUT_IT').val($('#MBR_OUT_IT').val() + (dataItems.MBR_OUT_IT == null ? '' : dataItems.MBR_OUT_IT));
        $('#INSPECTOR2').val($('#INSPECTOR2').val() + (dataItems.INSPECTOR == null ? '' : dataItems.INSPECTOR));
        $('#SCRAP_APPROVE').val($('#SCRAP_APPROVE').val() + (dataItems.SCRAP_APPROVE == null ? '' : dataItems.SCRAP_APPROVE));

        //回显次品原因
        var selectedList = [];
        $.post(baseUrl + "GetReportlogList", { reportnbr: dataItems.DEFECTIVE_NBR }, function(datas) {
            if (datas.Status == 0) {
                for (var i = 0; i < datas.Data.length; i++) {
                    selectedList.push(datas.Data[i].INFERIOR_NBR);
                }

                //获取次品原因
                $.get("/DefectiveReason/getReason", function(data) {
                    if (data.Status == 0) {
                        var html = '';
                        for (var i = 0; i < data.Data.length; i++) {
                            html += '<div><input class="reason" type="checkbox" id="' + i + '" value="' + data.Data[i].INFERIOR_NBR + '"><label for="' + i + '" style="display:inline-block">' + data.Data[i].INFERIOR_NAME + '</label></div>';
                        }
                        //$("#cpyy").append(html);
                        $("#bhgms").append(html);
                    }

                    $('.reason').each(function() {
                        for (var i = 0; i < selectedList.length; i++) {
                            if ($(this).val() == selectedList[i]) {
                                $(this).attr('checked', true);
                            }
                        }
                    })
                })
            }
        })

        //获取原因分析数据并转换成数组回显 htc:20170815
        var yyfxArr = dataItems.DESCRIBE.split(",");
        $('.reasonfx').each(function() {
            for (var i = 0; i < yyfxArr.length; i++) {
                if ($(this).val() == yyfxArr[i]) {
                    $(this).attr('checked', true);
                }
            }
        })

        //确定保存
        $("#Save").click(function() {
            //获取选中的原因
            var loglist = [];
            $('.reason').each(function() {
                if ($(this).attr('checked')) {
                    loglist.push({ "INFERIOR_NBR": $(this).val() });
                }
            })

            //获取选中的不合格描述并转换成字符串格式 htc:20170815
            var bhgArr = [];
            $('.reasonfx').each(function() {
                if ($(this).attr('checked')) {
                    bhgArr.push($(this).val());
                }
            })
            var bhgStr = bhgArr.join(",");

            //编辑信息
            var SUPPLIER = $('#DR_SUPPLIER').val();
            var MATERIEL_NO = $('#MATERIEL_NO').val();
            var MATERIEL_NAME = $('#MATERIEL_NAME').val();

            //var DESCRIBE = $('#DESCRIBE').val();
            var DESCRIBE = bhgStr;

            var INSPECTOR = $('#INSPECTOR').val().substring($('#INSPECTOR').val().indexOf(':') + 1, $('#INSPECTOR').val().length);
            var PE_ENGINEER = $('#PE_ENGINEER').val().substring($('#PE_ENGINEER').val().indexOf(':') + 1, $('#PE_ENGINEER').val().length);
            var DISPOSITION_CONCLUSION = $('#DISPOSITION_CONCLUSION').val().substring($('#DISPOSITION_CONCLUSION').val().indexOf(':') + 1, $('#DISPOSITION_CONCLUSION').val().length);
            var SCRAP_NUM = $('#SCRAP_NUM').val().substring($('#SCRAP_NUM').val().indexOf(':') + 1, $('#SCRAP_NUM').val().length);
            var REWORK_NUM = $('#REWORK_NUM').val().substring($('#REWORK_NUM').val().indexOf(':') + 1, $('#REWORK_NUM').val().length);
            var QE_NEGINEER = $('#QE_NEGINEER').val().substring($('#QE_NEGINEER').val().indexOf(':') + 1, $('#QE_NEGINEER').val().length);
            var REWORK_PROPOSAL = $('#REWORK_PROPOSAL').val().substring($('#REWORK_PROPOSAL').val().indexOf(':') + 1, $('#REWORK_PROPOSAL').val().length);
            var MBR_IN_IT = $('#MBR_IN_IT').val().substring($('#MBR_IN_IT').val().indexOf(':') + 1, $('#MBR_IN_IT').val().length);
            var REWORK_MACHINE = $('#REWORK_MACHINE').val().substring($('#REWORK_MACHINE').val().indexOf(':') + 1, $('#REWORK_MACHINE').val().length);
            var REWORK_INSPECTION = $('#REWORK_INSPECTION').val().substring($('#REWORK_INSPECTION').val().indexOf(':') + 1, $('#REWORK_INSPECTION').val().length);
            var MBR_OUT_IT = $('#MBR_OUT_IT').val().substring($('#MBR_OUT_IT').val().indexOf(':') + 1, $('#MBR_OUT_IT').val().length);
            var SCRAP_APPROVE = $('#SCRAP_APPROVE').val().substring($('#SCRAP_APPROVE').val().indexOf(':') + 1, $('#SCRAP_APPROVE').val().length);

            var reportmodel = {
                DEFECTIVE_NBR: dataItems.DEFECTIVE_NBR,
                MEMO: dataItems.MEMO,
                SUPPLIER: SUPPLIER, //供应商
                MATERIEL_NO: MATERIEL_NO, //铸件编号
                MATERIEL_NAME: MATERIEL_NAME, //铸件名称
                DESCRIBE: DESCRIBE, //不合格品描述
                INSPECTOR: INSPECTOR, //Inspector/检验员
                PE_ENGINEER: PE_ENGINEER, //PE/生产工程师
                DISPOSITION_CONCLUSION: DISPOSITION_CONCLUSION, //Disposition Conclusio/处置结论
                SCRAP_NUM: SCRAP_NUM, //Scrap 报废
                REWORK_NUM: REWORK_NUM, //Rework 返工
                QE_NEGINEER: QE_NEGINEER, //QE/质量工程师
                REWORK_PROPOSAL: REWORK_PROPOSAL, //Rework Proposal/返工方案（如需返工）
                MBR_IN_IT: MBR_IN_IT, //MBR移入IT单号
                REWORK_MACHINE: REWORK_MACHINE, //Rework machine/返工机床
                REWORK_INSPECTION: REWORK_INSPECTION, //Rework Inspection/返工后重新检验
                MBR_OUT_IT: MBR_OUT_IT, //MBR移出IT单号
                SCRAP_APPROVE: SCRAP_APPROVE, //Scrap Approve/报废批准
                IS_RETURN: dataItems.IS_RETURN,
                IS_FINISH: dataItems.IS_FINISH,
                MEM_NBR: dataItems.MEM_NBR,
                INSPECTION_DATE: dataItems.INSPECTION_DATE,
            }

            $.post(baseUrl + "UpdDefectiveReport_Upd", { reportmodel: JSON.stringify(reportmodel), loglist: JSON.stringify(loglist) }, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    grid.grid("refresh", [])
                } else {
                    BzAlert(data.Message);
                }
            })
        })
    }

    //确认返工
    function confirm_rework(e) {
        dataItems = this.dataItem($(e.currentTarget).closest("tr"));

        var reportmodel = {
            DEFECTIVE_NBR: dataItems.DEFECTIVE_NBR,
            MEMO: dataItems.MEMO,
            SUPPLIER: dataItems.DR_SUPPLIER, //供应商
            MATERIEL_NO: dataItems.MATERIEL_NO, //铸件编号
            MATERIEL_NAME: dataItems.MATERIEL_NAME, //铸件名称
            DESCRIBE: dataItems.DESCRIBE, //不合格品描述
            INSPECTOR: dataItems.INSPECTOR, //Inspector/检验员
            PE_ENGINEER: dataItems.PE_ENGINEER, //PE/生产工程师
            DISPOSITION_CONCLUSION: dataItems.DISPOSITION_CONCLUSION, //Disposition Conclusio/处置结论
            SCRAP_NUM: dataItems.SCRAP_NUM, //Scrap 报废
            REWORK_NUM: dataItems.REWORK_NUM, //Rework 返工
            QE_NEGINEER: dataItems.QE_NEGINEER, //QE/质量工程师
            REWORK_PROPOSAL: dataItems.REWORK_PROPOSAL, //Rework Proposal/返工方案（如需返工）
            MBR_IN_IT: dataItems.MBR_IN_IT, //MBR移入IT单号
            REWORK_MACHINE: dataItems.REWORK_MACHINE, //Rework machine/返工机床
            REWORK_INSPECTION: dataItems.REWORK_INSPECTION, //Rework Inspection/返工后重新检验
            MBR_OUT_IT: dataItems.MBR_OUT_IT, //MBR移出IT单号
            SCRAP_APPROVE: dataItems.SCRAP_APPROVE, //Scrap Approve/报废批准
            IS_RETURN: 1,
            IS_FINISH: dataItems.IS_FINISH,
        }

        //回显次品原因再保存
        var cpyylist = [];
        $.post(baseUrl + "GetReportlogList", { reportnbr: dataItems.DEFECTIVE_NBR }, function(datas) {
            if (datas.Status == 0) {
                for (var i = 0; i < datas.Data.length; i++) {
                    cpyylist.push({ "INFERIOR_NBR": datas.Data[i].INFERIOR_NBR });
                }

                $.post(baseUrl + "UpdDefectiveReport", { reportmodel: JSON.stringify(reportmodel), loglist: JSON.stringify(cpyylist) }, function(data) {
                    if (data.Status == 0) {
                        BzSuccess(data.Message);
                        grid.grid("refresh", [])
                    } else {
                        BzAlert(data.Message);
                    }
                })
            }
        })
    }

    //返工完成
    function rework_done(e) {
        dataItems = this.dataItem($(e.currentTarget).closest("tr"));

        var reportmodel = {
            DEFECTIVE_NBR: dataItems.DEFECTIVE_NBR,
            MEMO: dataItems.MEMO,
            SUPPLIER: dataItems.DR_SUPPLIER, //供应商
            MATERIEL_NO: dataItems.MATERIEL_NO, //铸件编号
            MATERIEL_NAME: dataItems.MATERIEL_NAME, //铸件名称
            DESCRIBE: dataItems.DESCRIBE, //不合格品描述
            INSPECTOR: dataItems.INSPECTOR, //Inspector/检验员
            PE_ENGINEER: dataItems.PE_ENGINEER, //PE/生产工程师
            DISPOSITION_CONCLUSION: dataItems.DISPOSITION_CONCLUSION, //Disposition Conclusio/处置结论
            SCRAP_NUM: dataItems.SCRAP_NUM, //Scrap 报废
            REWORK_NUM: dataItems.REWORK_NUM, //Rework 返工
            QE_NEGINEER: dataItems.QE_NEGINEER, //QE/质量工程师
            REWORK_PROPOSAL: dataItems.REWORK_PROPOSAL, //Rework Proposal/返工方案（如需返工）
            MBR_IN_IT: dataItems.MBR_IN_IT, //MBR移入IT单号
            REWORK_MACHINE: dataItems.REWORK_MACHINE, //Rework machine/返工机床
            REWORK_INSPECTION: dataItems.REWORK_INSPECTION, //Rework Inspection/返工后重新检验
            MBR_OUT_IT: dataItems.MBR_OUT_IT, //MBR移出IT单号
            SCRAP_APPROVE: dataItems.SCRAP_APPROVE, //Scrap Approve/报废批准
            IS_RETURN: dataItems.IS_RETURN,
            IS_FINISH: 1,
        }

        //回显次品原因再保存
        var cpyylist = [];
        $.post(baseUrl + "GetReportlogList", { reportnbr: dataItems.DEFECTIVE_NBR }, function(datas) {
            if (datas.Status == 0) {
                for (var i = 0; i < datas.Data.length; i++) {
                    cpyylist.push({ "INFERIOR_NBR": datas.Data[i].INFERIOR_NBR });
                }

                $.post(baseUrl + "UpdDefectiveReport", { reportmodel: JSON.stringify(reportmodel), loglist: JSON.stringify(cpyylist) }, function(data) {
                    if (data.Status == 0) {
                        BzSuccess(data.Message);
                        grid.grid("refresh", [])
                    } else {
                        BzAlert(data.Message);
                    }
                })
            }
        })
    }

    //确认
    function f_edit(e) {
        $.x5window(lang.Quality.Edit, kendo.template($("#redact").html()));
        dataItems = this.dataItem($(e.currentTarget).closest("tr"));
        //回显
        var value = { code: dataItems.PROD_NO, rect: true };
        var settings = {
            output: "css",
            bgColor: "white",
            color: "#000000",
            barWidth: 1,
            barHeight: 40
        };
        $(".LJBHTM").html("").show().barcode(value, "code128", settings);

        var value_memo = { code: dataItems.CAST_NO, rect: true };
        var settings_memo = {
            output: "css",
            bgColor: "white",
            color: "#000000",
            barWidth: 1,
            barHeight: 40
        };
        $(".ZJBHTM").html("").show().barcode(value_memo, "code128", settings_memo);

        //$('#GD_BH').html(dataItems.TASK_NO.bold().fontsize(2));
        $('#GD_BH').html(dataItems.PLAN_NO.bold().fontsize(2));
        dataItems.MEMO == null ? $('#MEMO').html() : $('#MEMO').html(("M" + dataItems.DEFECTIVE_NBR).bold().fontsize(2));
        $('#MAC_NO').html($('#MAC_NO').html() + dataItems.MAC_NO.bold().fontsize(2));
        //$('#PROD_NO').html(dataItems.PROD_NO.bold().fontsize(2));
        $('#PROD_NO').html(dataItems.PROD_NO.bold().fontsize(2));
        dataItems.MATERIEL_NAME == null ? "" : $('#PROD_NAME').html(dataItems.MATERIEL_NAME.bold().fontsize(2));
        $('#INFERIOR_NUM').html(dataItems.INFERIOR_NUM.toString().bold().fontsize(2));
        //$('#TASK_NO').html(dataItems.TASK_NO.bold().fontsize(2));
        $('#TASK_NO').html(dataItems.PLAN_NO.bold().fontsize(2));
        $('#REPORT_DATE').html(dataItems.REPORT_DATE.bold().fontsize(2));
        $('#REPORT_PERSON').html($('#REPORT_PERSON').html() + dataItems.REPORT_PERSON.bold().fontsize(2));

        //$('#SUPPLIER').html(dataItems.SUPPLIER.bold().fontsize(2));
        dataItems.SUPPLIER == null ? $('#SUPPLIER').html("") : $('#SUPPLIER').html(dataItems.SUPPLIER.bold().fontsize(2));
        dataItems.DR_SUPPLIER == null ? $('#DR_SUPPLIER').val("") : $('#DR_SUPPLIER').val(dataItems.DR_SUPPLIER);
        dataItems.CAST_NO == null ? "" : $('#MATERIEL_NO').html(dataItems.CAST_NO.bold().fontsize(2));
        //$('#MATERIEL_NAME').html(dataItems.MATERIEL_NAME.bold().fontsize(2));
        dataItems.ML_CAST_NAME == null ? $('#MATERIEL_NAME').html("") : $('#MATERIEL_NAME').html(dataItems.ML_CAST_NAME.bold().fontsize(2));
        //$('#DESCRIBE').val(dataItems.DESCRIBE);

        $('#INSPECTOR').val($('#INSPECTOR').val() + (dataItems.INSPECTOR == null ? '' : dataItems.INSPECTOR));
        $('#PE_ENGINEER').val($('#PE_ENGINEER').val() + (dataItems.PE_ENGINEER == null ? '' : dataItems.PE_ENGINEER));
        $('#DISPOSITION_CONCLUSION').val($('#DISPOSITION_CONCLUSION').val() + (dataItems.DISPOSITION_CONCLUSION == null ? '' : dataItems.DISPOSITION_CONCLUSION));
        $('#SCRAP_NUM').val($('#SCRAP_NUM').val() + (dataItems.SCRAP_NUM == null ? '' : dataItems.SCRAP_NUM));
        $('#REWORK_NUM').val($('#REWORK_NUM').val() + (dataItems.REWORK_NUM == null ? '' : dataItems.REWORK_NUM));
        $('#QE_NEGINEER').val($('#QE_NEGINEER').val() + (dataItems.QE_NEGINEER == null ? '' : dataItems.QE_NEGINEER));
        $('#REWORK_PROPOSAL').val($('#REWORK_PROPOSAL').val() + (dataItems.REWORK_PROPOSAL == null ? '' : dataItems.REWORK_PROPOSAL));
        $('#MBR_IN_IT').val($('#MBR_IN_IT').val() + (dataItems.MBR_IN_IT == null ? '' : dataItems.MBR_IN_IT));
        $('#REWORK_MACHINE').val($('#REWORK_MACHINE').val() + (dataItems.REWORK_MACHINE == null ? '' : dataItems.REWORK_MACHINE));
        $('#PE_ENGINNER2').val($('#PE_ENGINNER2').val() + (dataItems.PE_ENGINEER == null ? '' : dataItems.PE_ENGINEER));
        $('#REWORK_INSPECTION').val($('#REWORK_INSPECTION').val() + (dataItems.REWORK_INSPECTION == null ? '' : dataItems.REWORK_INSPECTION));
        $('#MBR_OUT_IT').val($('#MBR_OUT_IT').val() + (dataItems.MBR_OUT_IT == null ? '' : dataItems.MBR_OUT_IT));
        $('#INSPECTOR2').val($('#INSPECTOR2').val() + (dataItems.INSPECTOR == null ? '' : dataItems.INSPECTOR));
        $('#SCRAP_APPROVE').val($('#SCRAP_APPROVE').val() + (dataItems.SCRAP_APPROVE == null ? '' : dataItems.SCRAP_APPROVE));

        //回显次品原因
        var selectedList = [];
        $.post(baseUrl + "GetReportlogList", { reportnbr: dataItems.DEFECTIVE_NBR }, function(datas) {
            if (datas.Status == 0) {
                for (var i = 0; i < datas.Data.length; i++) {
                    selectedList.push(datas.Data[i].INFERIOR_NBR);
                }

                //获取次品原因
                $.get("/DefectiveReason/getReason", function(data) {
                    if (data.Status == 0) {
                        var html = '';
                        for (var i = 0; i < data.Data.length; i++) {
                            html += '<div><input class="reason" type="checkbox" id="' + i + '" value="' + data.Data[i].INFERIOR_NBR + '"><label for="' + i + '" style="display:inline-block">' + data.Data[i].INFERIOR_NAME + '</label></div>';
                        }
                        //$("#cpyy").append(html);
                        $("#bhgms").append(html);
                    }

                    $('.reason').each(function() {
                        for (var i = 0; i < selectedList.length; i++) {
                            if ($(this).val() == selectedList[i]) {
                                $(this).attr('checked', true);
                            }
                        }
                    })
                })
            }
        })

        //获取原因分析数据并转换成数组回显 htc:20170815
        var yyfxArr = dataItems.DESCRIBE.split(",");
        $('.reasonfx').each(function() {
            for (var i = 0; i < yyfxArr.length; i++) {
                if ($(this).val() == yyfxArr[i]) {
                    $(this).attr('checked', true);
                }
            }
        })

        //确定保存
        $("#Save").click(function() {
            //获取选中的原因
            var loglist = [];
            $('.reason').each(function() {
                if ($(this).attr('checked')) {
                    loglist.push({ "INFERIOR_NBR": $(this).val() });
                }
            })

            //获取选中的不合格描述并转换成字符串格式 htc:20170815
            var bhgArr = [];
            $('.reasonfx').each(function() {
                if ($(this).attr('checked')) {
                    bhgArr.push($(this).val());
                }
            })
            var bhgStr = bhgArr.join(",");

            //编辑信息
            var SUPPLIER = $('#DR_SUPPLIER').val();
            var MATERIEL_NO = $('#MATERIEL_NO').val();
            var MATERIEL_NAME = $('#MATERIEL_NAME').val();

            //var DESCRIBE = $('#DESCRIBE').val();
            var DESCRIBE = bhgStr;

            var INSPECTOR = $('#INSPECTOR').val().substring($('#INSPECTOR').val().indexOf(':') + 1, $('#INSPECTOR').val().length);
            var PE_ENGINEER = $('#PE_ENGINEER').val().substring($('#PE_ENGINEER').val().indexOf(':') + 1, $('#PE_ENGINEER').val().length);
            var DISPOSITION_CONCLUSION = $('#DISPOSITION_CONCLUSION').val().substring($('#DISPOSITION_CONCLUSION').val().indexOf(':') + 1, $('#DISPOSITION_CONCLUSION').val().length);
            var SCRAP_NUM = $('#SCRAP_NUM').val().substring($('#SCRAP_NUM').val().indexOf(':') + 1, $('#SCRAP_NUM').val().length);
            var REWORK_NUM = $('#REWORK_NUM').val().substring($('#REWORK_NUM').val().indexOf(':') + 1, $('#REWORK_NUM').val().length);
            var QE_NEGINEER = $('#QE_NEGINEER').val().substring($('#QE_NEGINEER').val().indexOf(':') + 1, $('#QE_NEGINEER').val().length);
            var REWORK_PROPOSAL = $('#REWORK_PROPOSAL').val().substring($('#REWORK_PROPOSAL').val().indexOf(':') + 1, $('#REWORK_PROPOSAL').val().length);
            var MBR_IN_IT = $('#MBR_IN_IT').val().substring($('#MBR_IN_IT').val().indexOf(':') + 1, $('#MBR_IN_IT').val().length);
            var REWORK_MACHINE = $('#REWORK_MACHINE').val().substring($('#REWORK_MACHINE').val().indexOf(':') + 1, $('#REWORK_MACHINE').val().length);
            var REWORK_INSPECTION = $('#REWORK_INSPECTION').val().substring($('#REWORK_INSPECTION').val().indexOf(':') + 1, $('#REWORK_INSPECTION').val().length);
            var MBR_OUT_IT = $('#MBR_OUT_IT').val().substring($('#MBR_OUT_IT').val().indexOf(':') + 1, $('#MBR_OUT_IT').val().length);
            var SCRAP_APPROVE = $('#SCRAP_APPROVE').val().substring($('#SCRAP_APPROVE').val().indexOf(':') + 1, $('#SCRAP_APPROVE').val().length);

            var reportmodel = {
                DEFECTIVE_NBR: dataItems.DEFECTIVE_NBR,
                MEMO: dataItems.MEMO,
                SUPPLIER: SUPPLIER, //供应商
                MATERIEL_NO: MATERIEL_NO, //铸件编号
                MATERIEL_NAME: MATERIEL_NAME, //铸件名称
                DESCRIBE: DESCRIBE, //不合格品描述
                INSPECTOR: INSPECTOR, //Inspector/检验员
                PE_ENGINEER: PE_ENGINEER, //PE/生产工程师
                DISPOSITION_CONCLUSION: DISPOSITION_CONCLUSION, //Disposition Conclusio/处置结论
                SCRAP_NUM: SCRAP_NUM, //Scrap 报废
                REWORK_NUM: REWORK_NUM, //Rework 返工
                QE_NEGINEER: QE_NEGINEER, //QE/质量工程师
                REWORK_PROPOSAL: REWORK_PROPOSAL, //Rework Proposal/返工方案（如需返工）
                MBR_IN_IT: MBR_IN_IT, //MBR移入IT单号
                REWORK_MACHINE: REWORK_MACHINE, //Rework machine/返工机床
                REWORK_INSPECTION: REWORK_INSPECTION, //Rework Inspection/返工后重新检验
                MBR_OUT_IT: MBR_OUT_IT, //MBR移出IT单号
                SCRAP_APPROVE: SCRAP_APPROVE, //Scrap Approve/报废批准
                IS_RETURN: dataItems.IS_RETURN,
                IS_FINISH: dataItems.IS_FINISH,
            }

            $.post(baseUrl + "UpdDefectiveReport", { reportmodel: JSON.stringify(reportmodel), loglist: JSON.stringify(loglist) }, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    grid.grid("refresh", [])
                } else {
                    BzAlert(data.Message);
                }
            })
        })
    }

    //预览（回显）
    function f_preview(e) {
        dataItems = this.dataItem($(e.currentTarget).closest("tr"));

        window.open("/DefectiveReportPreview?MAC_NO=" + escape(dataItems.MAC_NO) + "&PROD_NO=" + escape(dataItems.PROD_NO) + "&PROD_NAME=" + escape(dataItems.MATERIEL_NAME) + "&INFERIOR_NUM=" + escape(dataItems.INFERIOR_NUM) +
            "&TASK_NO=" + escape(dataItems.PLAN_NO) + "&REPORT_DATE=" + escape(dataItems.REPORT_DATE) + "&SUPPLIER=" + escape(dataItems.SUPPLIER) + "&MATERIEL_NO=" + escape(dataItems.CAST_NO) +
            "&MATERIEL_NAME=" + escape(dataItems.ML_CAST_NAME) + "&DESCRIBE=" + escape(dataItems.DESCRIBE) + "&REPORT_PERSON=" + escape(dataItems.REPORT_PERSON) + "&INSPECTOR=" + escape(dataItems.INSPECTOR) +
            "&PE_ENGINEER=" + escape(dataItems.PE_ENGINEER) + "&DISPOSITION_CONCLUSION=" + escape(dataItems.DISPOSITION_CONCLUSION) + "&SCRAP_NUM=" + escape(dataItems.SCRAP_NUM) + "&REWORK_NUM=" + escape(dataItems.REWORK_NUM) +
            "&QE_NEGINEER=" + escape(dataItems.QE_NEGINEER) + "&REWORK_PROPOSAL=" + escape(dataItems.REWORK_PROPOSAL) + "&MBR_IN_IT=" + escape(dataItems.MBR_IN_IT) + "&REWORK_MACHINE=" + escape(dataItems.REWORK_MACHINE) +
            "&REWORK_INSPECTION=" + escape(dataItems.REWORK_INSPECTION) + "&MBR_OUT_IT=" + escape(dataItems.MBR_OUT_IT) + "&SCRAP_APPROVE=" + escape(dataItems.SCRAP_APPROVE) +
            "&DEFECTIVE_NBR=" + escape(dataItems.DEFECTIVE_NBR) + "&MEMO=" + escape(("M" + dataItems.DEFECTIVE_NBR)) + "&DR_SUPPLIER=" + escape(dataItems.DR_SUPPLIER));
    }

    //查询
    $("#search").click(function(data) {
        var mac_nbrs = groupOrMachine.rData;
        //if (mac_nbrs == null) {
        //    BzAlert("请选择设备！");
        //    return;
        //}
        var ltDate = $('#endTime').val();
        var isdate = new Date(ltDate.replace(/-/g, "/")); //把日期字符串转换成日期格式
        isdate = new Date((isdate / 1000 + (86400 * 1)) * 1000); //日期加1天
        var pdate = isdate.getFullYear() + "-" + (isdate.getMonth() + 1) + "-" + (isdate.getDate()); //把日期格式转换成字符串

        mac_nbrs == null || undefined ? null : mac_nbrs;

        grid.grid("refresh", function() {
            return [
                { field: "mac.MAC_NBR", Operator: "eq", value: mac_nbrs },
                { field: "REPORT_DATE", Operator: "gte", value: $('#startTime').val() },
                { field: "REPORT_DATE", Operator: "lt", value: pdate },

                { field: "IS_RETURN", Operator: "eq", value: $('#isReturn').val() },
                { field: "IS_FINISH", Operator: "eq", value: $('#isFinish').val() },
            ]
        });
    })

});