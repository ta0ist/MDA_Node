/**
 * Created by qb on 2016/11/24.
 */
var filterstr, m = 0;
var globalData;
var machineID;
var baseUrl = "/Shift/";
$(function () {
    //获取所有设备组+设备
    function GetAllMachineAndMachineGroup1(id, chtml, callback) {
        function _callback(data) {
            callback(data);
        }
        $.get("/shift/GetAllMachineAndMachineGroup", { groupID: id }, function (data) {
            console.log(data)
            if (data.Status == 0) {
                $("#orgnizetree").kendoTreeView({
                    dataSource: {
                        data: machineToGroup(fomattree(gettree(data.Data.GetAllMachineGroupList, "icon-cogs")), data.Data.GetAllMachineList, "icon-cog")
                    },
                    template: kendo.template(chtml),
                    select: function (e) {
                        if (typeof (callback) != "undefined") {
                            _callback(e);
                        }
                    }
                }).data("kendoTreeView").collapse(".k-item");
            }
            else {
                BzAlert(data.Message);
            }
        });
    }
    GetAllMachineAndMachineGroup1(0, $("#treeview-template").html(), function (e) {
        getPlanByMachine(e.node);
    });
    //GetGrouplist(0, $("#treeview-template").html(), function (data) {
    //    var groupId = parseInt($(data).find('[attr="treenode"]').attr("nodeid"));
    //    getPlanByMachine(data);
    //});
    $("#tree_expand").toggle(function () {
        $("#orgnizetree").data("kendoTreeView").expand(".k-item");
    }, function () {
        $("#orgnizetree").data("kendoTreeView").collapse(".k-item");
    });
    $("#function_add").click(function () {
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var flag = $(treeobj.select()).find('.k-state-selected span').attr("flag");
        machineID = $(treeobj.select()).find('.k-state-selected span').attr("nodeid");
        //if (flag != undefined) {
        //    if (flag == "1") {//设备
        addOrEdit();
        //    }
        //    else if (flag == "0") {//设备组
        //        BzAlert($.Translate("Common.CHOOSEMA"));
        //    }
        //}
        //else {
        //    BzAlert($.Translate("Common.CHOOSEMA"));
        //}
    });
    $("#grid_schedul").click(function () {
        location.href = "/ArrangeIndex";
    });
    $('#filter').bind('keypress', function (event) {
        if (event.keyCode == "13") {
            var treeview = $("#orgnizetree").data("kendoTreeView");
            var aa = [];
            if (filterstr != $("#filter").val()) {
                filterstr = $("#filter").val();
                m = 0;
            }
            else {
                m++;
            }
            $('[attr="treenode"]').filter(function () {
                if ($(this).text() == $("#filter").val()) { //过滤
                    aa.push(this);
                }
            });
            if (aa.length > 0) {
                $("#orgnizetree").data("kendoTreeView").expand(".k-item");
                m >= aa.length ? (m = 0) : m;
                treeview.select($($(aa)[m]).parent().parent().parent());
                treeview._trigger("select", $($(aa)[m]).parent().parent().parent());
            }
        }
    });
});
function getPlanByMachine(e) {
    if (e != undefined) {
        var id = parseInt($(e).find('[attr="treenode"]').attr("nodeid"));
        var name = $(e).find('[attr="treenode"]').text();
        var flag = parseInt($(e).find('[attr="treenode"]').attr("flag"));
    }
    else {
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var selectedNode = treeobj.select();
        var id = parseInt(selectedNode.find('.k-state-selected span').attr("nodeid"));
        var name = parseInt(selectedNode.find('.k-state-selected span').attr("text"));
        var flag = parseInt(selectedNode.find('.k-state-selected span').attr("flag"));
    }
    if (id == undefined) {
        return;
    }
    if (flag == 0) {//设备组
        $("#machinePlan").html('排班计划');
        $(".timeline").empty();
    }
    else {//设备
        $("#machinePlan").html('排班计划' + "[" + name + "]");
        $.post("/Shift/Getsolutionlist", { machineId: id }, function (data) {
            globalData = {};//缓存数据
            if (data.Status == 0) {
                $(".timeline").empty();
                var shtml = "";
                for (var i = 0; i < data.Data.length; i++) {
                    globalData[i] = data.Data[i];
                    var classname = "";
                    if (data.Data[i].ShiftType == "0") {//历史
                        classname = "timeline-grey";
                    }
                    else if (data.Data[i].ShiftType == "1") {//当前
                        classname = "timeline-blue";
                    }
                    else if (data.Data[i].ShiftType == "2") { //将来
                        classname = "timeline-yellow";
                    }
                    shtml = shtml + '<li class="' + classname + '">' +
                        '<div class="timeline-time">' +
                        '<span class="time">' + moment(data.Data[i].ENABLE_DATE).format("YYYY/MM/DD") + '</span>' +
                        '<span class="time">~ ' + moment(data.Data[i].DISABLE_DATE).format("YYYY/MM/DD") + '</span>' +
                        '</div>' +
                        '<div class="timeline-icon"><i class="icon-calendar"></i></div>' +
                        '<div class="timeline-body">' +
                        '<h2>' + '类型' + ":"
                    if (data.Data[i].solutionlist[0].CYCLE_TYPE == 0) {
                        shtml = shtml + '不循环' + '</h2><div class="timeline-content"><table class="table-bordered">';
                        for (var j = 0; j < data.Data[i].solutionlist.length; j++) {
                            shtml = shtml + '<tr><td>' + data.Data[i].solutionlist[j].SolutionName + '</td><td><table class="shifts">';//方案名称
                            for (var m = 0; m < data.Data[i].solutionlist[j].li.length; m++) {
                                shtml = shtml + '<tr><td>' + data.Data[i].solutionlist[j].li[m].SHIFT_NAME + ':</td>';
                                shtml = shtml + '<td>' + moment(data.Data[i].solutionlist[j].li[m].START_DATE).format("HH:mm") + '--';
                                shtml = shtml + moment(data.Data[i].solutionlist[j].li[m].END_DATE).format("HH:mm") + '</td>';
                                shtml = shtml + '<td>' + parseFloat((data.Data[i].solutionlist[j].li[m].VALID_TIME / 3600).toFixed(1)) + '小时' + '</td></tr>';
                            }
                            shtml = shtml + '</table></td></tr>';
                        }
                        shtml = shtml + '</table>';
                    }
                    else if (data.Data[i].solutionlist[0].CYCLE_TYPE == 1) {
                        shtml = shtml + '周循环' + '</h2><div class="timeline-content"><table class="table-bordered">';
                        for (var j = 0; j < data.Data[i].solutionlist.length; j++) {
                            shtml = shtml + '<tr><td rowspan="2">' + data.Data[i].solutionlist[j].SolutionName + '</td>';//方案名称
                            var weekday = toBin(data.Data[i].solutionlist[j].DAY_WEEK).split("").reverse();
                            var week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
                            for (var n = 0; n < 7; n++) {
                                if (weekday[n] == 1) {
                                    shtml = shtml + '<td><span class="badge badge-success">' + week[n] + '</td>';
                                }
                                else {
                                    shtml = shtml + '<td><span class="badge">' + week[n] + '</td>';
                                }
                            }
                            shtml = shtml + '</tr><tr><td colspan="7"><table class="shifts">';
                            for (var m = 0; m < data.Data[i].solutionlist[j].li.length; m++) {
                                shtml = shtml + '<tr><td>' + data.Data[i].solutionlist[j].li[m].SHIFT_NAME + ':</td>';
                                shtml = shtml + '<td>' + moment(data.Data[i].solutionlist[j].li[m].START_DATE).format("HH:mm") + '--';
                                shtml = shtml + moment(data.Data[i].solutionlist[j].li[m].END_DATE).format("HH:mm") + '</td>';
                                shtml = shtml + '<td>' + parseFloat((data.Data[i].solutionlist[j].li[m].VALID_TIME / 3600).toFixed(1)) + '小时' + '</td></tr>';
                            }
                            shtml = shtml + '</table></td></tr>';
                        }
                        shtml = shtml + '</table>';
                    }
                    else {
                        shtml = shtml + '月循环' + '</h2><div class="timeline-content"><table class="table-bordered">';
                        for (var j = 0; j < data.Data[i].solutionlist.length; j++) {
                            shtml = shtml + '<tr><td rowspan="4">' + data.Data[i].solutionlist[j].SolutionName + '</td>';//方案名称
                            var weekday = toBin(data.Data[i].solutionlist[j].DAY_WEEK).split("").reverse();
                            for (var n = 0; n < 10; n++) {
                                if (weekday[n] == 1) {
                                    shtml = shtml + '<td><span style="min-width:14px;" class="badge badge-success">' + (n + 1) + '</td>';
                                }
                                else {
                                    shtml = shtml + '<td><span style="min-width:14px;" class="badge">' + (n + 1) + '</td>';
                                }
                            }
                            shtml = shtml + '<td></td></tr><tr>';
                            for (var n = 10; n < 20; n++) {
                                if (weekday[n] == 1) {
                                    shtml = shtml + '<td><span style="min-width:14px;" class="badge badge-success">' + (n + 1) + '</td>';
                                }
                                else {
                                    shtml = shtml + '<td><span style="min-width:14px;" class="badge">' + (n + 1) + '</td>';
                                }
                            }
                            shtml = shtml + '<td></td></tr><tr>';
                            for (var n = 20; n < 31; n++) {
                                if (weekday[n] == 1) {
                                    shtml = shtml + '<td><span style="min-width:14px;" class="badge badge-success">' + (n + 1) + '</td>';
                                }
                                else {
                                    shtml = shtml + '<td><span style="min-width:14px;" class="badge">' + (n + 1) + '</td>';
                                }
                            }
                            shtml = shtml + '</tr><tr><td colspan="31"><table class="shifts">';
                            for (var m = 0; m < data.Data[i].solutionlist[j].li.length; m++) {
                                shtml = shtml + '<tr><td>' + data.Data[i].solutionlist[j].li[m].SHIFT_NAME + ':</td>';
                                shtml = shtml + '<td>' + moment(data.Data[i].solutionlist[j].li[m].START_DATE).format("HH:mm") + '--';
                                shtml = shtml + moment(data.Data[i].solutionlist[j].li[m].END_DATE).format("HH:mm") + '</td>';
                                shtml = shtml + '<td>' + parseFloat((data.Data[i].solutionlist[j].li[m].VALID_TIME / 3600).toFixed(1)) + '小时' + '</td></tr>';
                            }
                            shtml = shtml + '</table></td></tr>';
                        }
                        shtml = shtml + '</table>';
                    }
                    if (data.Data[i].ShiftType == "0") {
                        shtml = shtml + '</div>' +
                            '<div class="timeline-footer">' +
                            '</div>' +
                            '</div>' +
                            '</li>';
                    }
                    else {//update and delete
                        shtml = shtml + '</div>' +
                            '<div class="timeline-footer">' +
                            '<a href="#" class="nav-link pull-right" onclick="deleteplan(this)" shifttype="' + data.Data[i].ShiftType + '" attr_id="' +i + '" attr_guid="' + data.Data[i].INPUT_GUID + '">' +
                            '删除' + ' <i class="icon-remove-sign m-icon-white"></i>' +
                            '</a>' +
                            '<a href="#" class="nav-link pull-right" onclick="editplan(this)" shifttype="' + data.Data[i].ShiftType + '" attr_id="' + i + '" attr_guid="' + data.Data[i].INPUT_GUID + '">' +
                            '编辑' + ' <i class="icon-edit m-icon-white"></i>' +
                            '</a>' +
                            '</div>' +
                            '</div>' +
                            '</li>';
                    }
                }
                $(".timeline").append(shtml);
            }
            else {
                BzAlert(data.Message);
            }
        });
    }
}
function onChange() {
    //获取seleced值
    var SOLUTIONS = $("#SOLUTIONS").data("kendoMultiSelect").dataItems();
    var CYCLE_TYPE = parseInt($('input[name="CYCLE_TYPE"]:checked').val());
    $("#plangird").empty();
    if (CYCLE_TYPE == 1) {//周循环
        var shtml = '<table class="table table-condensed table-bordered table-hover" style="margin-bottom: 0px;">';
        var head = ["", '方案\\星期', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
        for (var i = 0; i <= SOLUTIONS.length; i++) {
            shtml = shtml + '<tr>';
            for (var j = 0; j < 9; j++) {
                if (i == 0) {
                    shtml = shtml + '<td>' + head[j] + '</td>';
                }
                else {
                    if (j == 0) {
                        shtml = shtml + '<td><label class="checkbox"><input class="solutionCheckbox" type="checkbox" id="solutions' + SOLUTIONS[i - 1].SOLUTION_NBR + '" value="" style="margin-bottom: 0px;"/></label></td>';
                    }
                    else if (j == 1) {
                        shtml = shtml + '<td>' + SOLUTIONS[i - 1].SOLUTION_NAME + '</td>';
                    }
                    else {
                        shtml = shtml + '<td><label class="radio"><input checked class="solutions solutions' + SOLUTIONS[i - 1].SOLUTION_NBR + '" style="margin-bottom: 0px;" type="radio" name="Week_' + (j - 1) + '" value="' + (j - 1) + '" sid="' + SOLUTIONS[i - 1].SOLUTION_NBR + '"/></label></td>';
                    }
                }
            }
            shtml = shtml + '</tr>';
        }
        shtml = shtml + "<table>";
        $("#plangird").append(shtml);
        $(".solutionCheckbox").bind("click", function () {
            $("." + $(this).attr("id")).attr("checked", true);
            App.initUniform(".solutions");
        });
    }
    else if (CYCLE_TYPE == 2) {//月循环
        var shtml = '<table class="table table-condensed table-bordered table-hover" style="margin-bottom: 0px;">';
        var head = ["", '方案\\日期'];
        for (var i = 0; i <= SOLUTIONS.length; i++) {
            shtml = shtml + '<tr>';
            for (var j = 0; j < 33; j++) {
                if (i == 0) {
                    if (j < 2) {
                        shtml = shtml + '<td>' + head[j] + '</td>';
                    }
                    else {
                        shtml = shtml + '<td>' + (j - 1) + '</td>';
                    }
                }
                else {
                    if (j == 0) {
                        shtml = shtml + '<td><label class="checkbox"><input class="solutionCheckbox" type="checkbox" id="solutions' + SOLUTIONS[i - 1].SOLUTION_NBR + '" value="" style="margin-bottom: 0px;"/></label></td>';
                    }
                    else if (j == 1) {
                        shtml = shtml + '<td>' + SOLUTIONS[i - 1].SOLUTION_NAME + '</td>';
                    }
                    else {
                        shtml = shtml + '<td><label class="radio"><input checked class="solutions solutions' + SOLUTIONS[i - 1].SOLUTION_NBR + '" style="margin-bottom: 0px;" type="radio" name="Week_' + (j - 1) + '" value="' + (j - 1) + '" sid="' + SOLUTIONS[i - 1].SOLUTION_NBR + '"/></label></td>';
                    }
                }
            }
            shtml = shtml + '</tr>';
        }
        shtml = shtml + "<table>";
        $("#plangird").append(shtml);
        $(".solutionCheckbox").bind("click", function () {
            $("." + $(this).attr("id")).attr("checked", true);
            App.initUniform(".solutions");
        });
    }
    App.initUniform("#plangird input");
    //
    $("#x5window").data("kendoWindow").center();
    //计算高度
    $("#machineOrg").height($("#viewmodel").height() - $(".form-actions").height() - 11);
    $("#machineTree").height($("#machineOrg").height() - $("#machineOrgHead").height() - 20);
}
function toBin(intNum) {
    var answer = "";
    if (/\d+/.test(intNum)) {
        while (intNum != 0) {
            answer = Math.abs(intNum % 2) + answer;
            intNum = parseInt(intNum / 2);
        }
        if (answer.length == 0)
            answer = "0";
        return answer;
    } else {
        return 0;
    }
}
function editplan(e) {
    console.log(e)
    addOrEdit(parseInt($(e).attr("attr_id")), $(e).attr("shifttype"), $(e).attr("attr_guid"));
}
function deleteplan(e) {
    BzConfirm('请确认是否要删除数据', function (d) {
        if (d) {
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var a=moment(globalData[parseInt($(e).attr("attr_id"))].ENABLE_DATE)._i;
            var b=moment(globalData[parseInt($(e).attr("attr_id"))].DISABLE_DATE)._i;
            var startDate=new Date(parseInt(a.slice(6)));
            var endDate=new Date(parseInt(b.slice(6)));
            var startDate_result = startDate.getFullYear()+'/'+(startDate.getMonth()+1)+'/'+startDate.getDate();
            var endDate_result=endDate.getFullYear()+'/'+(endDate.getMonth()+1)+'/'+endDate.getDate();
            var data = {
                machineId: $(treeobj.select()).find('.k-state-selected span').attr("nodeid"),
                startDate:startDate_result ,
                endDate:endDate_result ,
                inputGuid: $(e).attr("attr_guid")
            };
            $.post("/Shift/DelMachineShift", data, function (data) {
                console.log(data)
                if (data.Status == 0) {
                    BzSuccess(data.Message);
                    getPlanByMachine();
                }
                else {
                    BzAlert(data.Message);
                }
            });
        }
    });
}
function addOrEdit(id, shifttype, attr_guid) {
    if (id == undefined) {
        $.x5window('新增', kendo.template($("#popup-add").html()));
    }
    else {
        $.x5window('编辑', kendo.template($("#popup-add").html()));
    }
    App.initUniform();
    $("#SOLUTIONS").kendoMultiSelect({
        dataTextField: "SOLUTION_NAME",
        dataValueField: "SOLUTION_NBR",
        headerTemplate: '<div class="dropdown-header">' +
        '<span class="k-widget k-header">' + '方案名称' + '</span>' +
        '<span class="k-widget k-header">' + '班次名称' + '</span>' +
        '<span class="k-widget k-header">' + '开始时间' + '</span>' +
        '<span class="k-widget k-header">' + '结束时间' + '</span>' +
        '<span class="k-widget k-header">' + '有效时间' + '</span>' +
        '</div>',
        itemTemplate: kendo.template($("#itemTemplate").html()),
        tagTemplate: '#: data.SOLUTION_NAME #',
        change: onChange,
        enable: shifttype=="1"?false:true,
        dataSource: {
            transport: {
                read: {
                    dataType: "json",
                    url: "/Shift/GetAllShift"
                }
            },
            schema: {
                data: function (response) {
                    var tjson = {};
                    for (var i = 0; i < response.Data.length; i++) {
                        if (tjson[response.Data[i].SOLUTION_NBR] == undefined) {
                            tjson[response.Data[i].SOLUTION_NBR] = {};
                            tjson[response.Data[i].SOLUTION_NBR].SOLUTION_NBR = response.Data[i].SOLUTION_NBR;
                            tjson[response.Data[i].SOLUTION_NBR].SOLUTION_NAME = response.Data[i].SOLUTION_NAME;
                            tjson[response.Data[i].SOLUTION_NBR].SHIFTS = [];
                            var p = {
                                SHIFT_NAME: response.Data[i].SHIFT_NAME,
                                START_DATE: response.Data[i].START_DATE,
                                END_DATE: response.Data[i].END_DATE,
                                VALID_TIME: response.Data[i].VALID_TIME
                            };
                            tjson[response.Data[i].SOLUTION_NBR].SHIFTS.push(p);
                        }
                        else {
                            var p = {
                                SHIFT_NAME: response.Data[i].SHIFT_NAME,
                                START_DATE: response.Data[i].START_DATE,
                                END_DATE: response.Data[i].END_DATE,
                                VALID_TIME: response.Data[i].VALID_TIME
                            };
                            tjson[response.Data[i].SOLUTION_NBR].SHIFTS.push(p);
                        }
                    }
                    var data = [];
                    for (var m in tjson) {
                        data.push(tjson[m]);
                    }
                    return data;
                }
            }
        },
        height: 300
    });
    $('input[name="CYCLE_TYPE"]').bind("change", function () {
        onChange();
    });
    $("#START_DATE").kendoDatePicker({ format: "yyyy/MM/dd", value: id == undefined ? new Date() : globalData[id].ENABLE_DATE });
    if (id != undefined) {
        $("#START_DATE").data("kendoDatePicker").readonly();
    }
    $("#END_DATE").kendoDatePicker({ format: "yyyy/MM/dd", value: id == undefined ? new Date() : globalData[id].DISABLE_DATE });
    if (id != undefined) {//编辑
        var sloutionID = [];
        for (var i = 0; i < globalData[id].solutionlist.length; i++) {
            sloutionID.push(globalData[id].solutionlist[i].SoluationID);
        }
        $("#SOLUTIONS").data("kendoMultiSelect").value(sloutionID);
        $('input[name="CYCLE_TYPE"][value="' + globalData[id].solutionlist[0].CYCLE_TYPE + '"]').attr("checked", true);
        App.initUniform();
        //初始化生成计划表
        //获取seleced值
        var SOLUTIONS = globalData[id].solutionlist;
        var CYCLE_TYPE = parseInt($('input[name="CYCLE_TYPE"]:checked').val());
        $("#plangird").empty();
        if (CYCLE_TYPE == 1) {//周循环
            var shtml = '<table class="table table-condensed table-bordered table-hover" style="margin-bottom: 0px;">';
            var head = ["", '方案\\星期', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
            for (var i = 0; i <= SOLUTIONS.length; i++) {
                var weekday;
                shtml = shtml + '<tr>';
                for (var j = 0; j < 9; j++) {
                    if (i == 0) {
                        shtml = shtml + '<td>' + head[j] + '</td>';
                    }
                    else {
                        if (j == 0) {
                            weekday = toBin(SOLUTIONS[i - 1].DAY_WEEK).split("").reverse();
                            shtml = shtml + '<td><label class="checkbox"><input class="solutionCheckbox" type="checkbox" id="solutions' + SOLUTIONS[i - 1].SoluationID + '" value="" style="margin-bottom: 0px;"/></label></td>';
                        }
                        else if (j == 1) {
                            shtml = shtml + '<td>' + SOLUTIONS[i - 1].SolutionName + '</td>';
                        }
                        else {
                            if (parseInt(weekday[j - 2]) == 1) {
                                shtml = shtml + '<td><label class="radio"><input checked class="solutions solutions' + SOLUTIONS[i - 1].SoluationID + '" style="margin-bottom: 0px;" type="radio" name="Week_' + (j - 1) + '" value="' + (j - 1) + '" sid="' + SOLUTIONS[i - 1].SoluationID + '"/></label></td>';
                            }
                            else {
                                shtml = shtml + '<td><label class="radio"><input class="solutions solutions' + SOLUTIONS[i - 1].SoluationID + '" style="margin-bottom: 0px;" type="radio" name="Week_' + (j - 1) + '" value="' + (j - 1) + '" sid="' + SOLUTIONS[i - 1].SoluationID + '"/></label></td>';
                            }
                        }
                    }
                }
                shtml = shtml + '</tr>';
            }
            shtml = shtml + "<table>";
            $("#plangird").append(shtml);
            $(".solutionCheckbox").bind("click", function () {
                $("." + $(this).attr("id")).attr("checked", true);
                App.initUniform(".solutions");
            });
        }
        else if (CYCLE_TYPE == 2) {//月循环
            var shtml = '<table class="table table-condensed table-bordered table-hover" style="margin-bottom: 0px;">';
            var head = ["", '方案\\日期'];
            for (var i = 0; i <= SOLUTIONS.length; i++) {
                var weekday;
                shtml = shtml + '<tr>';
                for (var j = 0; j < 33; j++) {
                    if (i == 0) {
                        if (j < 2) {
                            shtml = shtml + '<td>' + head[j] + '</td>';
                        }
                        else {
                            shtml = shtml + '<td>' + (j - 1) + '</td>';
                        }
                    }
                    else {
                        if (j == 0) {
                            weekday = toBin(SOLUTIONS[i - 1].DAY_WEEK).split("").reverse();
                            shtml = shtml + '<td><label class="checkbox"><input class="solutionCheckbox" type="checkbox" id="solutions' + SOLUTIONS[i - 1].SoluationID + '" value="" style="margin-bottom: 0px;"/></label></td>';
                        }
                        else if (j == 1) {
                            shtml = shtml + '<td>' + SOLUTIONS[i - 1].SolutionName + '</td>';
                        }
                        else {
                            if (parseInt(weekday[j - 2]) == 1) {
                                shtml = shtml + '<td><label class="radio"><input checked class="solutions solutions' + SOLUTIONS[i - 1].SoluationID + '" style="margin-bottom: 0px;" type="radio" name="Week_' + (j - 1) + '" value="' + (j - 1) + '" sid="' + SOLUTIONS[i - 1].SoluationID + '"/></label></td>';
                            }
                            else {
                                shtml = shtml + '<td><label class="radio"><input class="solutions solutions' + SOLUTIONS[i - 1].SoluationID + '" style="margin-bottom: 0px;" type="radio" name="Week_' + (j - 1) + '" value="' + (j - 1) + '" sid="' + SOLUTIONS[i - 1].SoluationID + '"/></label></td>';
                            }
                        }
                    }
                }
                shtml = shtml + '</tr>';
            }
            shtml = shtml + "<table>";
            $("#plangird").append(shtml);
            $(".solutionCheckbox").bind("click", function () {
                $("." + $(this).attr("id")).attr("checked", true);
                App.initUniform(".solutions");
            });
        }

        if (shifttype == "1") {
            $('input[name="CYCLE_TYPE"]').attr("disabled", "disabled");
            $("#relateMachine").attr("disabled", "disabled");
            $(".solutionCheckbox").attr("disabled", "disabled");
            $(".solutions").attr("disabled", "disabled");
        }
        App.initUniform("#plangird input");
    }
    $("#Add").bind("click", { ID: id, attr_guid: attr_guid }, function (event) {
        //验证
        //1.开始时间必填 2.结束时间如果有必须大于开始时间 3.方案不能为空
        //if ($("#START_DATE").data("kendoDatePicker").value() == null && $("#END_DATE").data("kendoDatePicker").value() == null) {
        //    BzAlert("请输入正确的日期");
        //    return;
        //} else {

        //}
        $(".error").removeClass("error");
        if ($("#START_DATE").data("kendoDatePicker").value() == null) {
            $("#START_DATE").parent().addClass("error");
            $("#SHIFT_ERROR").html('开始时间不能为空');
            return;
        }
        if ($("#END_DATE").data("kendoDatePicker").value() != null) {
            if (moment($("#END_DATE").data("kendoDatePicker").value()).isBefore($("#START_DATE").data("kendoDatePicker").value())) { // true)
                $("#END_DATE").parent().addClass("error");
                $("#SHIFT_ERROR").html('结束时间不能小于开始时间');
                return;
            }
        } else {
            BzAlert("请输入正确的日期");
            return;
        }

        var SOLUTIONS = $("#SOLUTIONS").data("kendoMultiSelect").dataItems();
        if (SOLUTIONS.length == 0) {
            $("#SOLUTIONS").parent().addClass("error");
            $("#SHIFT_ERROR").html('请选择班次方案');
            return;
        }
        var machineshiftlist = [];
        for (var i = 0; i < SOLUTIONS.length; i++) {
            var tjson = {};
            tjson.ENABLE_DATE = $("#START_DATE").val();//.data("kendoDatePicker").value();
            tjson.DISABLE_DATE = $("#END_DATE").val();//.data("kendoDatePicker").value();
            tjson.CYCLE_TYPE = parseInt($('input[name="CYCLE_TYPE"]:checked').val());
            tjson.SOLUTION_NBR = SOLUTIONS[i].SOLUTION_NBR;
            tjson.INPUT_GUID = event.data.attr_guid;
            //计算方案对应的值
            if (tjson.CYCLE_TYPE == 0) {//不重复
                tjson.DAY_WEEK = 0;
            }
            if (tjson.CYCLE_TYPE == 1) {//周
                var day_week = 0;
                for (var j = 0; j < 7; j++) {
                    if (parseInt($('input[name="Week_' + (j + 1) + '"]:checked').attr("sid")) == tjson.SOLUTION_NBR) {
                        day_week = day_week + Math.pow(2, j);
                    }
                }
                tjson.DAY_WEEK = day_week;
            }
            else if (tjson.CYCLE_TYPE == 2) {//月
                var day_week = 0;
                for (var j = 0; j < 31; j++) {
                    if (parseInt($('input[name="Week_' + (j + 1) + '"]:checked').attr("sid")) == tjson.SOLUTION_NBR) {
                        day_week = day_week + Math.pow(2, j);
                    }
                }
                tjson.DAY_WEEK = day_week;
            }
            machineshiftlist.push(tjson);
        }
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        machineID = $(treeobj.select()).find('.k-state-selected span').attr("nodeid");
        data = {
            machineId: machineID == undefined ? [] : [parseInt(machineID)],
            machineshiftlist: machineshiftlist
        }
        if ($("#relateMachine").prop("checked")) {
            var gvalue = $("#machineTree").data("BZ-Tree").value();
            for (var m in gvalue) {
                data.machineId.push(parseInt(m));
            }
        }
        if (data.machineId.length == 0) {
            $("#SHIFT_ERROR").html('请选择需要关联的设备');
            return;
        }
        if (event.data.ID == undefined) {//新增
            $.post("/Shift/AddMachineShift", data, function (data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    getPlanByMachine();
                }
                else {
                    BzAlert(data.Message);
                }
            });
        }
        else {
            $.post("/Shift/UpdMachineShift", data, function (data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    getPlanByMachine();
                }
                else {
                    BzAlert(data.Message);
                }
            });
        }
    });
    $("#x5window").data("kendoWindow").center();
    $("#relateMachine").click(function (e) {
        if (this.checked) {
            //计算高度
            $("#machineOrg").height($("#viewmodel").height() - $(".form-actions").height() - 11).show('slide', { direction: 'right' }, 500);
            $("#machineTree").height($("#machineOrg").height() - $("#machineOrgHead").height() - 20);
        }
        else {
            $("#machineOrg").hide('slide', { direction: 'right' }, 500);
        }
        e.stopPropagation();
    });
    $("#hideMachineOrg").click(function () {
        $("#machineOrg").hide('slide', { direction: 'right' }, 500);
    });
    $("#machineTree").Tree({
        url: "/shift/GetAllMachineAndMachineGroup",
        checkbox: true,
        type: 2,
        treetemplate: $("#treeview-template").html(),
        data: { GroupId: 0 }
    });
}