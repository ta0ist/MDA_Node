var MAC_NBR;
var PARAMETERS;
var Chart;
$(function() {
    $("#startTime").kendoDateTimePicker({ format: "yyyy/MM/dd HH:mm", value: new Date(moment().format("YYYY/MM/DD")) });
    $("#endTime").kendoDateTimePicker({ format: "yyyy/MM/dd HH:mm", value: new Date() });
    MAC_NBRS = $("#MAC_NBR").comboxTree({
        url: "/Alarm/GetAllMachineAndMachineGroup",
        data: { groupID: 0 },
        treetemplate: $("#treeview-template").html(),
        width: 172,
        diffwidth: 24,
        type: 2,
        url2: "/Alarm/GetKeywordMachinelist"
    }).data("BZ-comboxTree");
    PARAMETERS = $("#PARAMETERS").multipleComboxTree({
        remote: false,
        width: 172,
        type: 7,
        data: MAC_NBRS,
        url2: "/ProcessParameters/GetMachineInfo",
        tree: false
    }).data("BZ-multipleComboxTree");
    $("#search").click(function() {

        //判断分页
        var a = moment($("#startTime").val());
        var b = moment($("#endTime").val());
        //var days = b.diff(a, "days") + 1; // 86400000
        if (b.diff(a) > 86400000) {
            BzAlert("查询范围不能超过一天！");
            return;
        }
        getParData();
    });
    drawChart([]);
    Chart.setSize($("#hisChart").width(), 500);
});

function getParData(index) {
    //验证开始日期与结束日期间隔

    var SignList = [];
    for (var m in PARAMETERS.dataAarry) {
        SignList.push(m);
    }
    var data = {
        macNo: MAC_NBRS.rData,
        SignList: SignList,
        BeginDate: $("#startTime").val(), //$("#startTime").data("kendoDateTimePicker").value(),
        EndDate: $("#endTime").val(), //$("#endTime").data("kendoDateTimePicker").value(),
        Index: 1,
        Size: 86400,
        MoveSize: 0 // 21600 // 1/4分屏
    };
    if (SignList.length == 0 || MAC_NBRS.rData == null) {
        return;
    }
    $.ajax({
        url: "/ProcessParameters/GetParamtersList",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(data) {
            if (data.Status == 0) {
                //画历史曲线
                try {
                    Chart.destroy();
                } catch (e) {}
                var seriesData = [];
                //生成table
                var shtml = '<table class="table table-striped table-bordered table-advance table-hover"><thead><tr><th>序号</th><th>日期</th>';
                for (var m in PARAMETERS.dataAarry) {
                    shtml = shtml + "<th>" + PARAMETERS.dataAarry[m] + "</th>";
                    var tjson = {
                        name: PARAMETERS.dataAarry[m],
                        type: 'jtline',
                        type: 'line',
                        data: []
                    };
                    seriesData.push(tjson);
                }
                shtml = shtml + "</tr></thead><tbody>";
                for (var i = 0; i < data.Data.Data.length; i++) {
                    shtml = shtml + "<tr><td>" + (i + 1) + "</td>";
                    for (var j = 0; j < data.Data.Data[i].length; j++) {
                        if (j == 0) {
                            shtml = shtml + "<td>" + moment(data.Data.Data[i][j]).format("YYYY-MM-DD HH:mm:ss") + "</td>";
                        } else {
                            shtml = shtml + "<td>" + data.Data.Data[i][j] + "</td>";

                            seriesData[j - 1].data.push([moment(data.Data.Data[i][0]).valueOf(), data.Data.Data[i][j]]);
                        }

                    }
                    shtml = shtml + "</tr>";
                }
                shtml = shtml + "</tbody></table>";
                $("#hisTable").empty().append(shtml);
                drawChart(seriesData);
                Chart.setSize($("#hisChart").width(), 500);
            } else {
                BzAlert(data.Message);
            }
        }
    });
}

function drawChart(seriesData) {
    Highcharts.setOptions({
        global: {
            useUTC: false
        },
        lang: {
            resetZoom: '恢复',
            rangeSelectorZoom: "缩放",
            noData: ""
        }
    });
    Chart = new Highcharts.StockChart({
        chart: {
            renderTo: 'hisChart',
            width: 800, //790
            height: 500, //445
            //borderWidth: 2,
            animation: false,
            alignTicks: true,
            marginTop: 40,
            zoomType: 'x'
        },
        exporting: {
            enabled: false
        },
        rangeSelector: {
            buttons: [{
                type: 'all',
                text: '全部'
            }],
            //enabled: false,
            inputEnabled: false,
            selected: 0
        },
        credits: {
            enabled: false,
        },
        yAxis: {
            //lineColor: colors[0],
            lineWidth: 2,
            tickWidth: 1,
            //tickColor: colors[0],
            offset: 0,
            showLastLabel: true,
            labels: {
                align: 'right',
                formatter: function() {
                    return this.value;
                },
                style: {
                    font: '12px Arial'
                        //      color: colors[0]
                },
                x: -7,
                y: 5
            },
            title: {
                text: null,
                rotation: 0,
                align: 'high',
                x: 45,
                y: -10,
                style: {
                    //  color: colors[0]
                }
            },
            //tickInterval: ParObj[0] ? (ParObj[0].max - ParObj[0].min) / 10 : null,
            min: 0,
            //max: ParObj[0] ? ParObj[0].max : null,
            opposite: false //Y轴靠左
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                millisecond: '%Y/%m/%d<br/>%H:%M:%S.%L',
                second: '%Y/%m/%d<br/>%H:%M:%S',
                minute: '%Y/%m/%d<br/>%H:%M',
                hour: '%Y/%m/%d<br/>%H:%M',
                day: '%m/%d',
                month: '%Y/%m',
                year: '%Y'
            },
            lineColor: '#000000',
            tickColor: '#000000',
            startOnTick: true,
            //endOnTick: true,
            //showFirstLabel: true,
            //showLastLabel: true,
            //tickInterval: 2 * 3600 * 1000,
            //tickPixelInterval: 100,
            labels: {
                y: 20,
                style: {
                    font: '12px Arial',
                    color: '#000000'
                }
            }
        },
        title: {
            text: '设备参数历史曲线',
            style: {
                color: '#000000',
                font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        series: seriesData
    });
};