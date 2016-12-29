/**
 * Created by qb on 2016/11/28.
 */
var groupOrMachine;
$(function () {

    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });


    $("#filterLogic").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { value: 1, text: "小于等于" },
            { value: 2, text: "大于等于" }
        ]
    });
    groupOrMachine = $("#groupOrMachine").multipleComboxTree({
        url: "/Alarm/GetAllMachineAndMachineGroup",
        url2: "/Alarm/GetKeywordMachinelist",
        type: 2,
        data: {
            GroupId: 0
        },
        checkbox: true
    }).data("BZ-multipleComboxTree");
    App.initUniform();

    //查询
    $("#search").click(function () {
        //处理数据
        if ($('input[name="searchType"]:checked').val() == 1) {//日期
            var a = moment($("#startTime").val());
            var b = moment($("#endTime").val());
            pages = (b.diff(a, "days") + 1);
            var dataSource = [];
            dataSource.push({ value: a.format('YYYY-MM-DD'), text: a.format('YYYY-MM-DD') });
            for (var i = 1; i < pages; i++) {
                var tday = a.add('day', 1).format('YYYY-MM-DD');
                dataSource.push({ value: tday, text: tday });
            }
            $("#filter").kendoComboBox({
                dataTextField: "text",
                dataValueField: "value",
                filter: "contains",
                suggest: true,
                value: dataSource[0].value,
                dataSource: dataSource,
                select: function (e) {
                    var dataItem = this.dataItem(e.item.index());
                    var machines = [];
                    for (var m in groupOrMachine.dataAarry) {
                        machines.push(parseInt(m));
                    }
                    var data = {
                        ObjectIDs: machines,
                        StartTime: moment(dataItem.value).format('YYYY/MM/DD'),
                        EndTime: moment(dataItem.value).format('YYYY/MM/DD'),
                        ShowDetails: $('input[name="detailshow"]').prop("checked")
                    };
                    $("#loading").show();
                    $("#table_status").empty();
                    GetMachineStatusListByDate(data);
                    //总的汇总
                    GetMachineStatusRatio(data.StartTime, data.EndTime, data.ObjectIDs, 'chartRato1', data.StartTime + "设备状态总比例图", data.ShowDetails);
                    GetMachineStatusRatio(data.StartTime, data.StartTime, data.ObjectIDs[0], 'chartRato2', data.StartTime + "(" + groupOrMachine.dataAarry[machines[0]] + ")设备状态比例图", data.ShowDetails);
                }
            });
            var machines = [];
            for (var m in groupOrMachine.dataAarry) {
                machines.push(parseInt(m));
            }
            if (machines.length == 0) {
                return;
            }

            $("#loading").show();
            $("#table_status").empty();
            searchtype = 1;

            var data = {
                ObjectIDs: machines,
                StartTime: moment($("#startTime").val()).format('YYYY/MM/DD'),
                EndTime: moment($("#startTime").val()).format('YYYY/MM/DD'),
                ShowDetails: $('input[name="detailshow"]').prop("checked")
            };
            GetMachineStatusListByDate(data);
            //总的汇总
            GetMachineStatusRatio(data.StartTime, data.EndTime, data.ObjectIDs, 'chartRato1', moment($("#startTime").val()).format('YYYY/MM/DD') + "设备状态总比例图", data.ShowDetails);
            GetMachineStatusRatio(data.StartTime, data.StartTime, data.ObjectIDs[0], 'chartRato2', moment($("#startTime").val()).format('YYYY/MM/DD') + "(" + groupOrMachine.dataAarry[machines[0]] + ")设备状态比例图", data.ShowDetails);
            //drawRatio1('chartRato1');
            //drawRatio1('chartRato2');
        }
        else {//设备
            var dataSource = [];
            for (var m in groupOrMachine.dataAarry) {
                dataSource.push({ value: parseInt(m), text: groupOrMachine.dataAarry[m] });
            }
            if (dataSource.length == 0) {
                return;
            }
            $("#filter").kendoComboBox({
                dataTextField: "text",
                dataValueField: "value",
                filter: "contains",
                suggest: true,
                value: dataSource[0].value,
                dataSource: dataSource,
                select: function (e) {
                    var dataItem = this.dataItem(e.item.index());
                    var data = {
                        ObjectIDs: dataItem.value,
                        StartTime: $("#startTime").val(),
                        EndTime: $("#endTime").val(),
                        ShowDetails: $('input[name="detailshow"]').prop("checked")
                    };
                    $("#loading").show();
                    $("#table_status").empty();
                    GetMachineStatusListByName(data);
                    //总的汇总
                    GetMachineStatusRatio(data.StartTime, data.EndTime, data.ObjectIDs, 'chartRato1', groupOrMachine.dataAarry[data.ObjectIDs] + "设备状态总比例图", data.ShowDetails);
                    GetMachineStatusRatio(data.StartTime, data.StartTime, data.ObjectIDs, 'chartRato2', groupOrMachine.dataAarry[data.ObjectIDs] + "(" + moment($("#startTime").val()).format('YYYY/MM/DD') + ")设备状态比例图", data.ShowDetails);
                }
            });

            $("#loading").show();
            $("#table_status").empty();
            searchtype = 0;

            var machines = [];
            for (var m in groupOrMachine.dataAarry) {
                machines.push(parseInt(m));
            }
            var data = {
                ObjectIDs: machines[0],
                StartTime: $("#startTime").val(),
                EndTime: $("#endTime").val(),
                ShowDetails: $('input[name="detailshow"]').prop("checked")
            };
            GetMachineStatusListByName(data);
            //总的汇总
            GetMachineStatusRatio(data.StartTime, data.EndTime, data.ObjectIDs, 'chartRato1', groupOrMachine.dataAarry[data.ObjectIDs] + "设备状态总比例图", data.ShowDetails);
            GetMachineStatusRatio(data.StartTime, data.StartTime, data.ObjectIDs, 'chartRato2', groupOrMachine.dataAarry[data.ObjectIDs] + "(" + moment($("#startTime").val()).format('YYYY/MM/DD') + ")设备状态比例图", data.ShowDetails);
        }
    });
});
function showStatusDetail(e) {
    var startDate = moment($(e).attr("date")).format('YYYY/MM/DD');
    var endDate = moment(startDate).add('day', 1).format('YYYY/MM/DD');
    var machines = [parseInt($(e).attr("macno"))];
    $.x5window('状态明细', kendo.template($("#popup-add").html()));

    var data = {
        EndTime: endDate,
        ObjectIDs: machines,
        ShowDetails: $('input[name="detailshow"]').prop("checked"),
        StartTime: startDate
    }
    var cols = [];

    cols.push({ field: "STATUSID", title: "状态ID", width: 80, sortable: true, filterable: false });
    cols.push({ field: "START", title: "开始时间", type: 'date', format: '{0: yyyy-MM-dd HH:mm:ss}', width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "END", title: "结束时间", type: 'date', format: '{0: yyyy-MM-dd HH:mm:ss}', width: 80, sortable: true, filterable: false });
    cols.push({
        field: "NAME", title: "状态名称", width: 80, sortable: true, filterable: {
            extra: false
        }
    });
    $.post('/statusrate/GetMachineStatusListByDate', data, function (data) {
        if (data.Status == 0) {
            grid = $("#form-grid").kendoGrid({
                columns: cols,
                filterable: { mode: "menu" },
                dataSource: data.Data[0].StatusData[0].Data,
                height: 500,
                selectable: "row",
                pageable: {
                    pageSize: 50,
                    pageSizes: [20, 50, 100, 200, 500]
                }
            });
            $("#x5window").data("kendoWindow").center();
        }
        else {
            BzAlert(data.Message);
        }
    })



    //GetMachineStatusListByDate(startDate, endDate, machines, 'chartRato1', "daaa");
}

function GetMachineStatusListByDate(data) {
    $("#chartRato1").empty();
    $("#chartRato2").empty();
    $.post("/statusrate/GetMachineStatusListByDate", data, function (data) {
        $("#loading").hide();
        if (data.Status == 0) {
            $("#table_status").empty();
            for (var i = 0; i < data.Data.length; i++) {
                for (var j = 0; j < data.Data[i].StatusData.length; j++) {
                    $("#table_status").append('<tr id="' + i + "_" + j + '"><td width="100"></td><td width="100"></td><td width="20"><i style="font-size:20px;cursor:pointer;" value="0" macno="' + data.Data[i].StatusData[j].MacNo + '" date="' + data.Data[i].Date + '" id="shift_' + i + "_" + j + '" class="icon-caret-right"></i></td><td><div id="statusList_' + i + "_" + j + '"></div></td><td width="20"><i class="icon-search" style="cursor:pointer;" macno="' + data.Data[i].StatusData[j].MacNo + '" date="' + data.Data[i].Date + '" onclick="showStatusDetail(this)"></i></td><td class="statusRate_' + i + '" id="statusRate_' + i + "_" + j + '" width="2"></td></tr>');
                    //状态比例
                    var shtml = '<div style="display:none;position: absolute; right: 5px;border: 1px solid #000000; background-color: #FFFFFF;"><table class="statustable table-bordered">';
                    var tr1 = "<tr>"; var tr2 = "<tr>";
                    if (data.Data[i].StatusData[j].MyRateStatusList != null) {
                        for (var k = 0; k < data.Data[i].StatusData[j].MyRateStatusList.length; k++) {
                            tr1 = tr1 + '<th colspan="2" style="background-color:' + data.Data[i].StatusData[j].MyRateStatusList[k].COLOR + '">' + data.Data[i].StatusData[j].MyRateStatusList[k].STATUS_NAME + '</th>';
                            tr2 = tr2 + '<td align="center">' + data.Data[i].StatusData[j].MyRateStatusList[k].TIME + 'h</td><td align="center">' + (data.Data[i].StatusData[j].MyRateStatusList[k].RATE).toFixed(1) + '%</td>';
                        }
                        shtml = shtml + tr1 + tr2 + "</table></div>";
                        $("#statusRate_" + i + "_" + j).append(shtml);
                    }
                    if (j == 0) {//样式处理:设备名称显示在第一格
                        $("#" + i + "_" + j + " td").eq(0).append('<span id="allshowStatusRate_' + i + "_" + j + '" class="badge badge-inverse" style="cursor:pointer;">' + moment(data.Data[i].Date).format("YYYY-MM-DD") + '</span>');
                    }
                    $("#" + i + "_" + j + " td").eq(1).append('<span id="showStatusRate_' + i + "_" + j + '" mac=' + data.Data[i].StatusData[j].MacNo + ' date=' + data.Data[i].Date + ' class="badge badge-important" style="cursor:pointer;">' + data.Data[i].StatusData[j].NAME + '</span>');
                    //显示状态比例
                    $("#showStatusRate_" + i + "_" + j).on("click", { i: i, j: j }, function (event) {
                        //跟新位置
                        var top = $("#statusRate_" + event.data.i + "_" + event.data.j).parent().offset().top;
                        $("#statusRate_" + event.data.i + "_" + event.data.j).children().css("top", top + "px");
                        if ($("#statusRate_" + event.data.i + "_" + event.data.j).children().is(":hidden")) {
                            $("#statusRate_" + event.data.i + "_" + event.data.j).children().show('slide', { direction: 'right' }, 500);
                        }
                        else {
                            $("#statusRate_" + event.data.i + "_" + event.data.j).children().hide('slide', { direction: 'right' }, 500);
                        }

                        //更新饼图
                        var data = {
                            ObjectIDs: parseInt($(this).attr('mac')),
                            StartTime: moment($(this).attr('date')).format('YYYY/MM/DD'),
                            EndTime: moment($(this).attr('date')).format('YYYY/MM/DD'),
                            ShowDetails: $('input[name="detailshow"]').prop("checked")
                        };
                        GetMachineStatusRatio(data.StartTime, data.StartTime, data.ObjectIDs, 'chartRato2', moment($(this).attr('date')).format('YYYY/MM/DD') + "(" + groupOrMachine.dataAarry[data.ObjectIDs] + ")设备状态比例图", data.ShowDetails);
                    });
                    $("#allshowStatusRate_" + i + "_" + j).on("click", { i: i, j: j }, function (event) {
                        //跟新位置
                        var obj = $(".statusRate_" + event.data.i);
                        var flag = $($(".statusRate_" + event.data.i)[0]).children().is(":hidden");
                        for (var m = 0; m < obj.length; m++) {
                            var tt = $($(".statusRate_" + event.data.i)[m]);
                            var top = tt.parent().offset().top;
                            tt.children().css("top", top + "px");
                            if (flag) {
                                tt.children().show('slide', { direction: 'right' }, 500);
                            }
                            else {
                                tt.children().hide('slide', { direction: 'right' }, 500);
                            }
                        }
                    });
                    //状态条形图
                    $("#statusList_" + i + "_" + j).viewChart({
                        width: $("#statusList_" + i + "_" + j).width() <= 720 ? 720 : $("#statusList_" + i + "_" + j).width(),
                        url: "/statusrate/GetMachineStatusDetails",
                        startdate: data.Data[i].Date,
                        mac_no: data.Data[i].StatusData[j].MacNo, //设备编号
                        filter: $('input[name="filter"]').prop("checked"),
                        logic: $("#filterLogic").data('kendoComboBox').value(),
                        logicValue: $("#filterValue").val(),
                        select: function (data) {
                            var dd = {
                                ObjectIDs: [data.mac_nbr],
                                StartTime: data.startdate.format("YYYY-MM-DD HH:mm:ss"),
                                EndTime: data.enddate.format("YYYY-MM-DD HH:mm:ss"),
                                ShowDetails: $('input[name="detailshow"]').prop("checked")
                            }


                            $.x5window('状态放大', kendo.template($("#popup-showStatus").html()));
                            $.post("/MachineStatus/StatusDistributionMap/GetMachineStatusListByDate", JSON.stringify(dd), function (data) {

                            });
                        },
                        three: false//$('input[name="3dshow"]').prop("checked")
                    }).data("BZ-viewChart");
                    $("#statusList_" + i + "_" + j).data("BZ-viewChart").saveData(data.Data[i].StatusData[j].Data);
                    $("#statusList_" + i + "_" + j).data("BZ-viewChart").drawStatus(data.Data[i].StatusData[j].Data);

                    //班次显示
                    $('#shift_' + i + "_" + j).on("click", { i: i, j: j }, function (event) {
                        var self = this;
                        var ii = event.data.i;
                        var jj = event.data.j;
                        if ($(this).attr("value") == 0) {//显示班次
                            var data = {
                                ObjectID: parseInt($(this).attr("macno")),
                                Date: moment($(this).attr("date")).format("YYYY-MM-DD"),
                                ShowDetails: $('input[name="detailshow"]').prop("checked")
                            }
                            $.post("/statusrate/GetMachineStatusListByShift", data, function (data) {
                                if (data.Status == 0) {
                                    for (var mm = data.Data.length - 1; mm >= 0; mm--) {
                                        //插入tr
                                        $('<tr class="shift_' + ii + "_" + jj + '" id="shift_' + ii + "_" + jj + '"><td width="100"></td><td width="100"></td><td width="20"></td><td><div id="shiftstatusList_' + ii + "_" + jj + '"></div></td><td class="statusRate_' + ii + '" id="shiftstatusRate_' + ii + "_" + jj + "_" + mm + '" width="2"></td></tr>').insertAfter($(self).parent().parent());
                                        //状态比例
                                        var shtml = '<div style="display:none;position: absolute; right: 5px;border: 1px solid #000000; background-color: #FFFFFF;"><table class="statustable table-bordered">';
                                        var tr1 = "<tr>"; var tr2 = "<tr>";
                                        if (data.Data[mm].MyRateStatusList != null) {
                                            for (var k = 0; k < data.Data[mm].MyRateStatusList.length; k++) {
                                                tr1 = tr1 + '<th colspan="2" style="background-color:' + data.Data[mm].MyRateStatusList[k].COLOR + '">' + data.Data[mm].MyRateStatusList[k].STATUS_NAME + '</th>';
                                                tr2 = tr2 + '<td align="center">' + data.Data[mm].MyRateStatusList[k].TIME + 'h</td><td align="center">' + (data.Data[mm].MyRateStatusList[k].RATE).toFixed(1) + '%</td>';
                                            }
                                            shtml = shtml + tr1 + tr2 + "</table></div>";
                                            $("#shiftstatusRate_" + ii + "_" + jj + "_" + mm).append(shtml);
                                        }
                                        //状态条形图
                                        $("#shift_" + ii + "_" + jj + " td").eq(1).append('<span id="shiftshowStatusRate_' + ii + "_" + jj + "_" + mm + '" class="badge badge-warning" style="cursor:pointer;">' + data.Data[mm].SHIFT + '</span>');
                                        $("#shiftstatusList_" + ii + "_" + jj).viewChart({
                                            width: $("#shiftstatusList_" + ii + "_" + jj).width() <= 720 ? 720 : $("#shiftstatusList_" + ii + "_" + jj).width(),
                                            type: "shift",
                                            url: "/statusrate/GetMachineStatusDetails",
                                            shiftstartdate: data.Data[mm].START,
                                            filter: $('input[name="filter"]').prop("checked"),
                                            logic: $("#filterLogic").data('kendoComboBox').value(),
                                            logicValue: $("#filterValue").val(),
                                            three: false,//$('input[name="3dshow"]').prop("checked"),
                                            timedepth: moment(data.Data[mm].END).diff(moment(data.Data[mm].START), "seconds")
                                        }).data("BZ-viewChart").drawStatus(data.Data[mm].StatusData);
                                        //显示状态比例
                                        $("#shiftshowStatusRate_" + ii + "_" + jj + "_" + mm).on("click", { i: ii, j: jj, m: mm }, function (event) {
                                            //跟新位置
                                            var top = $("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).parent().offset().top;
                                            $("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).children().css("top", top + "px");
                                            if ($("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).children().is(":hidden")) {
                                                $("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).children().show('slide', { direction: 'right' }, 500);
                                            }
                                            else {
                                                $("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).children().hide('slide', { direction: 'right' }, 500);
                                            }
                                        });
                                    }
                                    //更新图标
                                    $(self).attr("value", 1).addClass("icon-caret-down").removeClass("icon-caret-right");
                                }
                                else {
                                    BzAlert(data.Message);
                                }
                            });
                        }
                        else {
                            $(".shift_" + ii + "_" + jj).remove();
                            //更新图标
                            $(self).attr("value", 0).addClass("icon-caret-right").removeClass("icon-caret-down");
                        }
                    });
                }
            }
        }
        else {
            BzAlert(data.Message);
        }
    });
}
function GetMachineStatusListByName(data) {
    $("#chartRato1").empty();
    $("#chartRato2").empty();
    $.post("/statusrate/GetMachineStatusListByName", data, function (data) {
        $("#loading").hide();
        if (data.Status == 0) {
            $("#table_status").empty();
            for (var i = 0; i < data.Data.length; i++) {
                for (var j = 0; j < data.Data[i].StatusData.length; j++) {
                    $("#table_status").append('<tr id="' + i + "_" + j + '"><td width="100"></td><td width="100"></td><td width="20"><i style="font-size:20px;cursor:pointer;" value="0" macno="' + data.Data[i].MacNo + '" date="' + moment(data.Data[i].StatusData[j].Date).format("YYYY-MM-DD") + '" id="shift_' + i + "_" + j + '" class="icon-caret-right"></i></td><td><div id="statusList_' + i + "_" + j + '"></div></td><td width="20"><i class="icon-search" style="cursor:pointer;" macno="' + data.Data[i].MacNo + '" date="' + moment(data.Data[i].StatusData[j].Date).format("YYYY-MM-DD") + '" onclick="showStatusDetail(this)"></i></td><td class="statusRate_' + i + '" id="statusRate_' + i + "_" + j + '" width="2"></td></tr>');
                    //状态比例
                    var shtml = '<div style="display:none;position: absolute; right: 5px;border: 1px solid #000000; background-color: #FFFFFF;"><table class="statustable table-bordered">';
                    var tr1 = "<tr>"; var tr2 = "<tr>";
                    if (data.Data[i].StatusData[j].MyRateStatusList != null) {
                        for (var k = 0; k < data.Data[i].StatusData[j].MyRateStatusList.length; k++) {
                            tr1 = tr1 + '<th colspan="2" style="background-color:' + data.Data[i].StatusData[j].MyRateStatusList[k].COLOR + '">' + data.Data[i].StatusData[j].MyRateStatusList[k].STATUS_NAME + '</th>';
                            tr2 = tr2 + '<td align="center">' + data.Data[i].StatusData[j].MyRateStatusList[k].TIME + 'h</td><td align="center">' + (data.Data[i].StatusData[j].MyRateStatusList[k].RATE).toFixed(1) + '%</td>';
                        }
                        shtml = shtml + tr1 + tr2 + "</table></div>";
                        $("#statusRate_" + i + "_" + j).append(shtml);
                    }
                    if (j == 0) {//样式处理:设备名称显示在第一格
                        $("#" + i + "_" + j + " td").eq(0).append('<span id="allshowStatusRate_' + i + "_" + j + '" class="badge badge-inverse" style="cursor:pointer;">' + data.Data[i].NAME + '</span>');
                    }
                    $("#" + i + "_" + j + " td").eq(1).append('<span id="showStatusRate_' + i + "_" + j + '" mac="' + data.Data[i].MacNo + '" date="' + moment(data.Data[i].StatusData[j].Date).format("YYYY-MM-DD") + '" class="badge badge-important" style="cursor:pointer;">' + moment(data.Data[i].StatusData[j].Date).format("YYYY-MM-DD") + '</span>');
                    //显示状态比例
                    $("#showStatusRate_" + i + "_" + j).on("click", { i: i, j: j }, function (event) {
                        //跟新位置
                        var top = $("#statusRate_" + event.data.i + "_" + event.data.j).parent().offset().top;
                        $("#statusRate_" + event.data.i + "_" + event.data.j).children().css("top", top + "px");
                        if ($("#statusRate_" + event.data.i + "_" + event.data.j).children().is(":hidden")) {
                            $("#statusRate_" + event.data.i + "_" + event.data.j).children().show('slide', { direction: 'right' }, 500);
                        }
                        else {
                            $("#statusRate_" + event.data.i + "_" + event.data.j).children().hide('slide', { direction: 'right' }, 500);
                        }
                        //更新饼图
                        var data = {
                            ObjectIDs: parseInt($(this).attr('mac')),
                            StartTime: moment($(this).attr('date')).format('YYYY/MM/DD'),
                            EndTime: moment($(this).attr('date')).format('YYYY/MM/DD'),
                            ShowDetails: $('input[name="detailshow"]').prop("checked")
                        };
                        GetMachineStatusRatio(data.StartTime, data.StartTime, data.ObjectIDs, 'chartRato2', moment($(this).attr('date')).format('YYYY/MM/DD') + "(" + groupOrMachine.dataAarry[data.ObjectIDs] + ")设备状态比例图", data.ShowDetails);

                    });
                    $("#allshowStatusRate_" + i + "_" + j).on("click", { i: i, j: j }, function (event) {
                        //跟新位置
                        var obj = $(".statusRate_" + event.data.i);
                        var flag = $($(".statusRate_" + event.data.i)[0]).children().is(":hidden");
                        for (var m = 0; m < obj.length; m++) {
                            var tt = $($(".statusRate_" + event.data.i)[m]);
                            var top = tt.parent().offset().top;
                            tt.children().css("top", top + "px");
                            if (flag) {
                                tt.children().show('slide', { direction: 'right' }, 500);
                            }
                            else {
                                tt.children().hide('slide', { direction: 'right' }, 500);
                            }
                        }
                    });
                    //状态条形图
                    $("#statusList_" + i + "_" + j).viewChart({
                        width: $("#statusList_" + i + "_" + j).width() <= 720 ? 720 : $("#statusList_" + i + "_" + j).width(),
                        url: "/statusrate/GetMachineStatusDetails",
                        startdate: data.Data[i].StatusData[j].Date,
                        filter: $('input[name="filter"]').prop("checked"),
                        logic: $("#filterLogic").data('kendoComboBox').value(),
                        logicValue: $("#filterValue").val(),
                        three: false//$('input[name="3dshow"]').prop("checked")
                    }).data("BZ-viewChart");
                    $("#statusList_" + i + "_" + j).data("BZ-viewChart").saveData(data.Data[i].StatusData[j].Data);
                    $("#statusList_" + i + "_" + j).data("BZ-viewChart").drawStatus(data.Data[i].StatusData[j].Data);
                    //班次显示
                    $('#shift_' + i + "_" + j).on("click", { i: i, j: j }, function (event) {
                        var self = this;
                        var ii = event.data.i;
                        var jj = event.data.j;
                        if ($(this).attr("value") == 0) {//显示班次
                            var data = {
                                ObjectID: parseInt($(this).attr("macno")),
                                Date: $(this).attr("date"),
                                ShowDetails: $('input[name="detailshow"]').prop("checked")
                            }
                            $.post("/statusrate/GetMachineStatusListByShift", data, function (data) {
                                console.log(data);
                                if (data.Status == 0) {
                                    for (var mm = data.Data.length - 1; mm >= 0; mm--) {
                                        //插入tr
                                        $('<tr class="shift_' + ii + "_" + jj + '" id="shift_' + ii + "_" + jj + '"><td width="100"></td><td width="100"></td><td width="20"></td><td><div id="shiftstatusList_' + ii + "_" + jj + '"></div></td><td class="statusRate_' + ii + '" id="shiftstatusRate_' + ii + "_" + jj + "_" + mm + '" width="2"></td></tr>').insertAfter($(self).parent().parent());
                                        //状态比例
                                        var shtml = '<div style="display:none;position: absolute; right: 5px;border: 1px solid #000000; background-color: #FFFFFF;"><table class="statustable table-bordered">';
                                        var tr1 = "<tr>"; var tr2 = "<tr>";
                                        if (data.Data[mm].MyRateStatusList != null) {
                                            for (var k = 0; k < data.Data[mm].MyRateStatusList.length; k++) {
                                                tr1 = tr1 + '<th colspan="2" style="background-color:' + data.Data[mm].MyRateStatusList[k].COLOR + '">' + data.Data[mm].MyRateStatusList[k].STATUS_NAME + '</th>';
                                                tr2 = tr2 + '<td align="center">' + data.Data[mm].MyRateStatusList[k].TIME + 'h</td><td align="center">' + (data.Data[mm].MyRateStatusList[k].RATE).toFixed(1) + '%</td>';
                                            }
                                            shtml = shtml + tr1 + tr2 + "</table></div>";
                                            $("#shiftstatusRate_" + ii + "_" + jj + "_" + mm).append(shtml);
                                        }
                                        //状态条形图
                                        $("#shift_" + ii + "_" + jj + " td").eq(1).append('<span id="shiftshowStatusRate_' + ii + "_" + jj + "_" + mm + '" class="badge badge-warning" style="cursor:pointer;">' + data.Data[mm].SHIFT + '</span>');
                                        $("#shiftstatusList_" + ii + "_" + jj).viewChart({
                                            width: $("#shiftstatusList_" + ii + "_" + jj).width() <= 720 ? 720 : $("#shiftstatusList_" + ii + "_" + jj).width(),
                                            type: "shift",
                                            url: "/statusrate/GetMachineStatusDetails",
                                            shiftstartdate: data.Data[mm].START,
                                            filter: $('input[name="filter"]').prop("checked"),
                                            logic: $("#filterLogic").data('kendoComboBox').value(),
                                            logicValue: $("#filterValue").val(),
                                            three: false,//$('input[name="3dshow"]').prop("checked")
                                            timedepth: moment(data.Data[mm].END).diff(moment(data.Data[mm].START), "seconds")
                                        }).data("BZ-viewChart").drawStatus(data.Data[mm].StatusData);
                                        //显示状态比例
                                        $("#shiftshowStatusRate_" + ii + "_" + jj + "_" + mm).on("click", { i: ii, j: jj, m: mm }, function (event) {
                                            //跟新位置
                                            var top = $("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).parent().offset().top;
                                            $("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).children().css("top", top + "px");
                                            if ($("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).children().is(":hidden")) {
                                                $("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).children().show('slide', { direction: 'right' }, 500);
                                            }
                                            else {
                                                $("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).children().hide('slide', { direction: 'right' }, 500);
                                            }
                                        });
                                    }
                                    //更新图标
                                    $(self).attr("value", 1).addClass("icon-caret-down").removeClass("icon-caret-right");
                                }
                                else {
                                    BzAlert(data.Message);
                                }
                            });
                        }
                        else {
                            $(".shift_" + ii + "_" + jj).remove();
                            //更新图标
                            $(self).attr("value", 0).addClass("icon-caret-right").removeClass("icon-caret-down");
                        }
                    });
                }
            }
        }
        else {
            BzAlert(data.Message);
        }
    });
}
function GetMachineStatusRatio(startDate, endDate, machines, ele, title, Isdetail) {
    var data = {
        MAC_NBR_LIST: machines,
        beginDate: startDate,
        endDate: endDate,
        Isdetail: Isdetail
    }
    $.post("/statusrate/GetSunStatusRate", data, function (data) {
        //console.log(data.Data.Data[0])
        if (data.Status == 0) {
            //处理数据
            var td = [];
            var total = 0;
            for (var i = 0; i < data.Data[0].SUB_DURATION_LSIT.length; i++) {
                total = total + parseFloat((data.Data[0].SUB_DURATION_LSIT[i].Single_STATUS_RATE * 100).toFixed(1));
                td.push({
                    name: data.Data[0].SUB_DURATION_LSIT[i].STATUS_NAME,
                    color: "#"+data.Data[0].SUB_DURATION_LSIT[i].Color.Name,
                    y: parseFloat((data.Data[0].SUB_DURATION_LSIT[i].Single_STATUS_RATE * 100).toFixed(1))
                });
            }
            if (total < 100) {
                td.push({
                    name: "null",
                    color: '#ffffff',
                    y: 100 - total
                });
            }
            drawRatio1(ele, title, td);
        }
        else {

        }
    });
}

function drawRatio1(ele, title, data) {
    $('#' + ele).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: title
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            type: 'pie',
            name: '状态比例',
            data: data
        }]
    });
}