/**
 * Created by qb on 2016/11/25.
 */
var grid;
var baseUrl = "/Shift/";
var validator;
var viewModel;
$(function() {
    var fields = {
        SOLUTION_NBR: { type: "string" },
        SOLUTION_NAME: { type: "string" },
        SHIFT_NAME: { type: "string" },
        START_DATE: { type: "date" },
        END_DATE: { type: "date" },
        VALID_TIME: { type: "string" }
    };
    var cols = [];
    cols.push({ field: "SOLUTION_NBR", title: '方案ID', width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({
        field: "SOLUTION_NAME",
        title: lang.Common.PackageName,
        groupHeaderTemplate: lang.Common.PackageName + ': <span>#= value #</span>' +
            '<button class="btn purple" value="#=value#" onclick="return toolbar_editSolution(this)" style="margin-left: 4px;">' + lang.Order.Edit + '<i class="icon-edit"></i></button>' +
            '<button class="btn red" value="#=value#" onclick="return toolbar_deleteSolution(this)" style="margin-left: 4px;">' + lang.Order.Delete + '<i class="icon-remove-sign"></i></button>',
        width: 80,
        sortable: true,
        filterable: false,
        hidden: true
    });
    cols.push({ field: "SHIFT_NAME", title: lang.Order.ShiftName, width: 80, sortable: true, filterable: false });
    cols.push({ field: "START_DATE", title: lang.EmployeePerformance.StartTime, width: 80, format: "{0: HH:mm}", sortable: true, filterable: false });
    cols.push({ field: "END_DATE", title: lang.EmployeePerformance.EndTime, width: 80, format: "{0: HH:mm}", sortable: true, filterable: false });
    cols.push({ field: "VALID_TIME", title: lang.Common.ValidTime, width: 80, sortable: true, filterable: false, template: '#: parseFloat((VALID_TIME/3600).toFixed(1)) #' });
    //Grid
    grid = $("#grid").grid({
        //checkBoxColumn: true,
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        //sort: [{ field: "USER_NBR", dir: "ASC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: true,
        resizeGridWidth: false, //列宽度可调
        isPage: false,
        group: true,
        groupfield: [{ field: "SOLUTION_NAME" }],
        //detailTemplate: kendo.template($("#detail-template").html()),
        //server: true, //服务器端刷新，包括排序，筛选等
        actionUrl: ["GetAllShift", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "SOLUTION_NBR",
            fields: fields,
            cols: cols
        }
    });

    function koModel() {
        var self = this;
        self.grid_add = function(e) {
            $.x5window(lang.Order.Add, kendo.template($("#popup-add").html()));
            addOrEdit(); //新增
        };
        self.grid_schedul = function() { //排班
            location.href = baseUrl + "ArrangeIndex";
        };
    }
    var u = new koModel();
    ko.applyBindings(u);
});

function addOrEdit(dataItem) {
    //验证
    validator = $("#viewmodel").validate({
        rules: {
            SOLUTION_NAME: { required: true }
        },
        messages: {
            SOLUTION_NAME: { required: lang.Common.ContentCannotBeEmpty }
        }
    });
    var solution_nbr, solution_name, shifts;
    if (dataItem == undefined) { //新增
        solution_nbr = "";
        solution_name = "";
        shifts = [{
            NO: ko.observable(1),
            SHIFT_NAME: "",
            START_DATE: "00:00",
            END_DATE: "00:00",
            VALID_TIME: 24
        }]
    } else { //编辑
        solution_nbr = parseInt(dataItem[0].SOLUTION_NBR);
        solution_name = dataItem[0].SOLUTION_NAME;
        shifts = [];
        for (var i = 0; i < dataItem.length; i++) {
            var tjson = {
                NO: ko.observable(i + 1),
                SHIFT_NAME: dataItem[i].SHIFT_NAME,
                START_DATE: moment(dataItem[i].START_DATE).format("HH:mm"),
                END_DATE: moment(dataItem[i].END_DATE).format("HH:mm"),
                VALID_TIME: parseFloat(dataItem[i].VALID_TIME / 3600)
            }
            shifts.push(tjson);
        }
    }
    viewModel = ko.mapping.fromJS({
        SOLUTION_NBR: ko.observable(solution_nbr),
        SOLUTION_NAME: ko.observable(solution_name),
        SHIFTS: ko.observableArray(shifts),
        addShift: function(e) {
            e.SHIFTS.push({
                NO: ko.observable(e.SHIFTS().length + 1),
                SHIFT_NAME: ko.observable(""),
                START_DATE: ko.observable("00:00"),
                END_DATE: ko.observable("00:00"),
                VALID_TIME: ko.observable(0)
            });
            $("#SHIFTS_LIST tr:last td:eq(2) input").timepicker({
                showSeconds: false,
                showMeridian: false,
                defaultTime: false
            });
            $("#SHIFTS_LIST tr:last td:eq(3) input").timepicker({
                showSeconds: false,
                showMeridian: false,
                defaultTime: false
            });
            $("#SHIFTS_LIST tr:last td:eq(4) input").kendoNumericTextBox({ format: "n1", min: 0, value: 0 });
        },
        removeShift: function(shift) {
            if (viewModel.SHIFTS().length > 1) {
                viewModel.SHIFTS.remove(shift);
            }
            //更新序号
            for (var i = 0; i < viewModel.SHIFTS().length; i++) {
                viewModel.SHIFTS()[i].NO(i + 1);
            }
        },
        timechage: function(e) {
            var no = e.NO();
            var starttime = $("#SHIFTS_LIST tr:eq(" + (no - 1) + ") td:eq(2) input").val();
            var endtime = $("#SHIFTS_LIST tr:eq(" + (no - 1) + ") td:eq(3) input").val();
            getTime(starttime, endtime, no);
        },
        save: function(e) {
            //验证班次时间段不能重复
            $("#SHIFT_ERROR").html();
            var data = checkTime(e.SHIFTS());
            if (data != null) {
                return;
            }
            var TotalTime = 0;
            //1.验证班次名称不能为空
            for (var i = 0; i < e.SHIFTS().length; i++) {
                TotalTime += parseFloat(e.SHIFTS()[i].VALID_TIME());
                if (e.SHIFTS()[i].SHIFT_NAME() == "") {

                    var no = e.SHIFTS()[i].NO();
                    $("#SHIFTS_LIST tr:eq(" + (no - 1) + ") td:eq(1) input").addClass("error");
                    $("#SHIFT_ERROR").addClass("error").html(lang.Common.ContentCannotBeEmpty).show();
                    return;
                }
            }
            if (parseFloat(TotalTime) > 24.0) {
                $("#SHIFT_ERROR").addClass("error").html(lang.Common.ValidTimeNotGreater).show();
                return;
            }
            if (validator.form()) {
                var shifts = [];
                for (var i = 0; i < e.SHIFTS().length; i++) {
                    var tjson = {};
                    tjson.SHIFT_NAME = e.SHIFTS()[i].SHIFT_NAME();
                    tjson.START_DATE = e.SHIFTS()[i].START_DATE();
                    tjson.RANK_NUM = i;
                    tjson.END_DATE = e.SHIFTS()[i].END_DATE();
                    tjson.VALID_TIME = parseFloat($("#SHIFTS_LIST tr:eq(" + i + ") td:eq(4)").find("input").eq(1).data("kendoNumericTextBox").value()) * 3600; //转换成秒
                    shifts.push(tjson);
                }
                var data = {
                    SoluationID: e.SOLUTION_NBR(),
                    SolutionName: e.SOLUTION_NAME(),
                    li: shifts
                }
                if (dataItem == undefined) { //新增
                    $.post("/Shift/AddShift", { solution: data }, function(data) {
                        if (data.Status == 0) {
                            $("#x5window").data("kendoWindow").close();
                            refreshGrid();
                            BzSuccess(data.Message);
                        } else {
                            BzAlert(data.Message);
                        }
                    });
                } else {
                    $.post("/Shift/UpdateShift", data, function(data) {
                        if (data.Status == 0) {
                            $("#x5window").data("kendoWindow").close();
                            refreshGrid();
                            BzSuccess(data.Message);
                        } else {
                            BzAlert(data.Message);
                        }
                    });
                }
            }
        }
    });
    ko.applyBindings(viewModel, document.getElementById("viewmodel"));
    App.initUniform();
    for (var m = 0; m < $("#SHIFTS_LIST tr").length; m++) {
        $("#SHIFTS_LIST tr:eq(" + m + ") td:eq(2) input").timepicker({
            showSeconds: false,
            showMeridian: false,
            defaultTime: false
        });
        $("#SHIFTS_LIST tr:eq(" + m + ") td:eq(3) input").timepicker({
            showSeconds: false,
            showMeridian: false,
            defaultTime: false
        });
    }
    $(".VALID_TIME").kendoNumericTextBox({ format: "n1", min: 0 });
}

function refreshGrid() {
    grid.grid("refresh");
}

function toolbar_deleteSolution(e) {
    var SOLUTION_NAME = $(e).prev().prev().text();
    //根据名字查找ID号
    var data = grid.data("bz-grid").ds.data();
    var SOLUTION_NBR = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].SOLUTION_NAME == SOLUTION_NAME) {
            SOLUTION_NBR.push(parseInt(data[i].SOLUTION_NBR));
            break;
        }
    }
    BzConfirm(lang.Order.DeleteData, function(e) {
        if (e) {
            $.post("/Shift/DeleteShift", { SolutiondArrayId: SOLUTION_NBR }, function(data) {
                if (data.Status == 0) {
                    refreshGrid();
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            });
        }
    });
}

function toolbar_editSolution(e) {
    $.x5window(lang.Order.Edit, kendo.template($("#popup-add").html()));
    var SOLUTION_NAME = $(e).prev().text();
    //根据名字查找ID号
    var data = grid.data("bz-grid").ds.data();
    var SOLUTION_OBJ = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].SOLUTION_NAME == SOLUTION_NAME) {
            SOLUTION_OBJ.push(data[i]);
        }
    }
    addOrEdit(SOLUTION_OBJ); //编辑
}

//班次内时间校验
function checkTime(data) {
    $('.input-append.error').removeClass("error");
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data.length; j++) {
            if (i == j)
                continue;
            if (data[i].START_DATE() >= data[i].END_DATE()) {
                if (parseInt(data[i].END_DATE().split(":")[0]) == 0) {
                    if (data[j].START_DATE() >= data[i].START_DATE()) {
                        if (parseInt(data[j].END_DATE().split(":")[0]) < 24 || (parseInt(data[j].END_DATE().split(":")[0]) == 0 && parseInt(data[j].END_DATE().split(":")[1]) < parseInt(data[i].END_DATE().split(":")[1]))) {
                            $("#SHIFTS_LIST tr:eq(" + (data[j].NO() - 1) + ") td:eq(3) input").parent().addClass("error");
                            $("#SHIFT_ERROR").addClass("error").html(lang.Common.Divisions).show();
                            return data[j];
                        }
                    }

                } else {
                    if (data[j].START_DATE() >= data[i].START_DATE()) {
                        if (data[j].START_DATE() > data[i].END_DATE() || data[j].END_DATE() < data[i].START_DATE()) {
                            $("#SHIFTS_LIST tr:eq(" + (data[j].NO() - 1) + ") td:eq(3) input").parent().addClass("error");
                            $("#SHIFT_ERROR").addClass("error").html(lang.Common.Divisions).show();
                            return data[j];
                        }
                    }
                }
            } else {
                if (data[j].START_DATE() >= data[i].START_DATE()) {
                    if (data[j].START_DATE() < data[i].END_DATE()) {
                        $("#SHIFTS_LIST tr:eq(" + (data[j].NO() - 1) + ") td:eq(2) input").parent().addClass("error");
                        $("#SHIFT_ERROR").addClass("error").html(lang.Common.Divisions).show();
                        return data[j];
                    }
                }
            }
        }
    }
    return null;
}

function getTime(str, end, no) {
    var startime = str.split(":");
    var endtime = end.split(":");
    var hh = parseInt(startime[0]);
    var mm = parseInt(startime[1]);
    var hr = parseInt(endtime[0]);
    var mr = parseInt(endtime[1]);

    var totals = hh * 3600 + mm * 60;
    var totalp = hr * 3600 + mr * 60;
    var val = 0;
    if (totals < totalp) {
        val = totalp - totals;
    } else {
        val = totalp - totals + 86400;
    }
    var dou = parseFloat((val / 3600).toFixed(1));
    var obj = $("#SHIFTS_LIST tr:eq(" + (no - 1) + ") td:eq(4)").find("input").eq(1).data("kendoNumericTextBox");
    obj.value(dou);
    obj.max(dou);

}