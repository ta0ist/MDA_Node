$(() => {
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    groupOrMachine = $("#machine").multipleComboxTree({
        url: "/StatusDetail/GetAllMachineAndMachineGroup",
        url2: "/StatusDetail/GetKeywordMachinelist",
        type: 2,
        data: {
            GroupId: 0
        },
    }).data("BZ-multipleComboxTree");
    $("#search").click(() => {
        var data = {
            ObjectIDs: [groupOrMachine.rData == undefined ? 10 : groupOrMachine.rData],
            StartTime: $("#startTime").val(),
            EndTime: $("#startTime").val(),
            ShowDetails: false
        };
        GetMachineStatusListByDate(data);
        GetMachinePara(data);
    })
})

function GetMachineStatusListByDate(data) {
    $.post("/statusrate/GetMachineStatusListByDate", data, function(data) {
        $("#loading").hide();
        if (data.Status == 0) {
            $("#table_status").empty();
            for (var i = 0; i < data.Data.length; i++) {
                for (var j = 0; j < data.Data[i].StatusData.length; j++) {
                    $("#table_status").append('<tr id="' + i + "_" + j + '"><td width="100"></td><td width="100"></td><td width="20"></td><td><div id="statusList_' + i + "_" + j + '"></div></td><td width="20"></td><td class="statusRate_' + i + '" id="statusRate_' + i + "_" + j + '" width="2"></td></tr>');
                    //状态比例
                    var shtml = '<div style="display:none;position: absolute; right: 5px;border: 1px solid #000000; background-color: #FFFFFF;"><table class="statustable table-bordered">';
                    var tr1 = "<tr>";
                    var tr2 = "<tr>";
                    if (data.Data[i].StatusData[j].MyRateStatusList != null) {
                        for (var k = 0; k < data.Data[i].StatusData[j].MyRateStatusList.length; k++) {
                            tr1 = tr1 + '<th colspan="2" style="background-color:' + data.Data[i].StatusData[j].MyRateStatusList[k].COLOR + '">' + data.Data[i].StatusData[j].MyRateStatusList[k].STATUS_NAME + '</th>';
                            tr2 = tr2 + '<td align="center">' + data.Data[i].StatusData[j].MyRateStatusList[k].TIME + 'h</td><td align="center">' + (data.Data[i].StatusData[j].MyRateStatusList[k].RATE).toFixed(1) + '%</td>';
                        }
                        shtml = shtml + tr1 + tr2 + "</table></div>";
                        $("#statusRate_" + i + "_" + j).append(shtml);
                    }
                    if (j == 0) { //样式处理:设备名称显示在第一格
                        $("#" + i + "_" + j + " td").eq(0).append('<span id="allshowStatusRate_' + i + "_" + j + '" class="badge badge-inverse" style="cursor:pointer;">' + moment(data.Data[i].Date).format("YYYY-MM-DD") + '</span>');
                    }
                    $("#" + i + "_" + j + " td").eq(1).append('<span id="showStatusRate_' + i + "_" + j + '" mac=' + data.Data[i].StatusData[j].MacNo + ' date=' + data.Data[i].Date + ' class="badge badge-important" style="cursor:pointer;">' + data.Data[i].StatusData[j].NAME + '</span>');
                    //显示状态比例
                    $("#showStatusRate_" + i + "_" + j).on("click", { i: i, j: j }, function(event) {
                        //跟新位置
                        var top = $("#statusRate_" + event.data.i + "_" + event.data.j).parent().offset().top;
                        $("#statusRate_" + event.data.i + "_" + event.data.j).children().css("top", top + "px");
                        if ($("#statusRate_" + event.data.i + "_" + event.data.j).children().is(":hidden")) {
                            $("#statusRate_" + event.data.i + "_" + event.data.j).children().show('slide', { direction: 'right' }, 500);
                        } else {
                            $("#statusRate_" + event.data.i + "_" + event.data.j).children().hide('slide', { direction: 'right' }, 500);
                        }
                    });
                    $("#allshowStatusRate_" + i + "_" + j).on("click", { i: i, j: j }, function(event) {
                        //跟新位置
                        var obj = $(".statusRate_" + event.data.i);
                        var flag = $($(".statusRate_" + event.data.i)[0]).children().is(":hidden");
                        for (var m = 0; m < obj.length; m++) {
                            var tt = $($(".statusRate_" + event.data.i)[m]);
                            var top = tt.parent().offset().top;
                            tt.children().css("top", top + "px");
                            if (flag) {
                                tt.children().show('slide', { direction: 'right' }, 500);
                            } else {
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
                        logic: '',
                        logicValue: '',
                        select: function(data) {
                            var dd = {
                                ObjectIDs: [data.mac_nbr],
                                StartTime: data.startdate.format("YYYY-MM-DD HH:mm:ss"),
                                EndTime: data.enddate.format("YYYY-MM-DD HH:mm:ss"),
                                ShowDetails: $('input[name="detailshow"]').prop("checked")
                            }


                            $.x5window(lang.MachineStatus.Amplifying, kendo.template($("#popup-showStatus").html()));
                            $.post("/MachineStatus/StatusDistributionMap/GetMachineStatusListByDate", JSON.stringify(dd), function(data) {

                            });
                        },
                        three: false //$('input[name="3dshow"]').prop("checked")
                    }).data("BZ-viewChart");
                    $("#statusList_" + i + "_" + j).data("BZ-viewChart").saveData(data.Data[i].StatusData[j].Data);
                    $("#statusList_" + i + "_" + j).data("BZ-viewChart").drawStatus(data.Data[i].StatusData[j].Data);

                    //班次显示
                    $('#shift_' + i + "_" + j).on("click", { i: i, j: j }, function(event) {
                        var self = this;
                        var ii = event.data.i;
                        var jj = event.data.j;
                        if ($(this).attr("value") == 0) { //显示班次
                            var data = {
                                ObjectID: parseInt($(this).attr("macno")),
                                Date: moment($(this).attr("date")).format("YYYY-MM-DD"),
                                ShowDetails: $('input[name="detailshow"]').prop("checked")
                            }
                            $.post("/statusrate/GetMachineStatusListByShift", data, function(data) {
                                if (data.Status == 0) {
                                    for (var mm = data.Data.length - 1; mm >= 0; mm--) {
                                        //插入tr
                                        $('<tr class="shift_' + ii + "_" + jj + '" id="shift_' + ii + "_" + jj + '"><td width="100"></td><td width="100"></td><td width="20"></td><td><div id="shiftstatusList_' + ii + "_" + jj + '"></div></td><td class="statusRate_' + ii + '" id="shiftstatusRate_' + ii + "_" + jj + "_" + mm + '" width="2"></td></tr>').insertAfter($(self).parent().parent());
                                        //状态比例
                                        var shtml = '<div style="display:none;position: absolute; right: 5px;border: 1px solid #000000; background-color: #FFFFFF;"><table class="statustable table-bordered">';
                                        var tr1 = "<tr>";
                                        var tr2 = "<tr>";
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
                                            logic: '',
                                            logicValue: '',
                                            three: false, //$('input[name="3dshow"]').prop("checked"),
                                            timedepth: moment(data.Data[mm].END).diff(moment(data.Data[mm].START), "seconds")
                                        }).data("BZ-viewChart").drawStatus(data.Data[mm].StatusData);
                                        //显示状态比例
                                        $("#shiftshowStatusRate_" + ii + "_" + jj + "_" + mm).on("click", { i: ii, j: jj, m: mm }, function(event) {
                                            //跟新位置
                                            var top = $("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).parent().offset().top;
                                            $("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).children().css("top", top + "px");
                                            if ($("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).children().is(":hidden")) {
                                                $("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).children().show('slide', { direction: 'right' }, 500);
                                            } else {
                                                $("#shiftstatusRate_" + event.data.i + "_" + event.data.j + "_" + event.data.m).children().hide('slide', { direction: 'right' }, 500);
                                            }
                                        });
                                    }
                                    //更新图标
                                    $(self).attr("value", 1).addClass("icon-caret-down").removeClass("icon-caret-right");
                                } else {
                                    BzAlert(data.Message);
                                }
                            });
                        } else {
                            $(".shift_" + ii + "_" + jj).remove();
                            //更新图标
                            $(self).attr("value", 0).addClass("icon-caret-right").removeClass("icon-caret-down");
                        }
                    });
                }
            }
        } else {
            BzAlert(data.Message);
        }
    });
}

function GetMachinePara(data) {
    data.ObjectIDs = data.ObjectIDs[0];
    data.EndTime = moment($("#startTime").val()).add(1, 'd').format('YYYY-MM-DD');
    let series1 = [],
        series2 = [],
        series3 = [],
        series4 = [];
    $.post('/diagnosis/r/GetMachinePara', data, (result) => {
        if (result.Status == 0) {
            let P_INT1 = {},
                P_INT2 = {},
                P_INT3 = {},
                P_INT4 = {};
            P_INT1.name = "主轴转速";
            P_INT1.data = [];
            P_INT2.name = "主轴倍率";
            P_INT2.data = [];
            P_INT3.name = "进给转速";
            P_INT3.data = [];
            P_INT4.name = "进给倍率";
            P_INT4.data = [];

            for (let i = 0; i < result.Data.length; i++) {
                P_INT1.data.push([moment(result.Data[i].RUNNING_DATE).format('X') * 1000 - 8 * 3600 * 1000, result.Data[i].P_INT1]);
                P_INT2.data.push([moment(result.Data[i].RUNNING_DATE).format('X') * 1000 - 8 * 3600 * 1000, result.Data[i].P_INT2]);
                P_INT3.data.push([moment(result.Data[i].RUNNING_DATE).format('X') * 1000 - 8 * 3600 * 1000, result.Data[i].P_INT3]);
                P_INT4.data.push([moment(result.Data[i].RUNNING_DATE).format('X') * 1000 - 8 * 3600 * 1000, result.Data[i].P_INT4]);
            }
            series1.push(P_INT1);
            series2.push(P_INT2);
            series3.push(P_INT3);
            series4.push(P_INT4);
            drawline('#P_INT1', '主轴转速', series1);
            drawline('#P_INT2', '主轴倍率', series2);
            drawline('#P_INT3', '进给转速', series3);
            drawline('#P_INT4', '进给倍率', series4);
        }
    })
}

//绘制曲线
function drawline(ele, title, data) {
    $(ele).highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: title
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: null
            },
            labels: {
                formatter: function() {
                    return moment(this.value).format("HH:mm");
                }
            }
        },
        yAxis: {
            title: {
                text: '值'
            },
            min: 0,
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
        },
        plotOptions: {
            spline: {
                marker: {
                    enabled: false
                }
            }
        },
        credits: {
            enabled: false
        },
        series: data
    });
}