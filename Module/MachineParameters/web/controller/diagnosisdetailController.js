var chartObj = {
    chart1: {},
    chart2: {},
    chart3: {},
    chart4: {},
    chart5: {}
};
var baseUrl = "/diagnosis/";
$(function() {
    // 检查插件是否已经安装过
    var iRet = WebVideoCtrl.I_CheckPluginInstall();
    if (-2 == iRet) {
       // alert(lang.MachineParameters.Alert_1);
    } else if (-1 == iRet) {
       // alert(lang.MachineParameters.Alert_2);
    } else {
        var oPlugin = {
            iWidth: 600, // plugin width
            iHeight: 400 // plugin height
        };
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin(oPlugin.iWidth, oPlugin.iHeight, {
            bWndFull: true, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
            iWndowType: 1,
            cbSelWnd: function(xmlDoc) {

            }
        });


        WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

        // 检查插件是否最新
        if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
           // alert(lang.MachineParameters.Alert_3);
            return;
        }

        var oLiveView = {
            iProtocol: 1, // protocol 1：http, 2:https
            szIP: "192.168.0.7", // protocol ip
            szPort: "80", // protocol port
            szUsername: "admin", // device username
            szPassword: "Bandex123", // device password
            iStreamType: 1, // stream 1：main stream  2：sub-stream  3：third stream  4：transcode stream
            iChannelID: 1, // channel no
            bZeroChannel: false // zero channel
        };

        // 登录设备
        WebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
            success: function(xmlDoc) {
                // 开始预览
                WebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
                    iStreamType: oLiveView.iStreamType,
                    iChannelID: oLiveView.iChannelID,
                    bZeroChannel: oLiveView.bZeroChannel
                });
            }
        });

        // 关闭浏览器
        $(window).unload(function() {
            WebVideoCtrl.I_Stop();
        });
    }


    var seriesdata = [];
	var curveColors=['red','green','blue','yellow']
    var type = $.getparam("type");
    //$.each(parameter[type], function (item, k) {$.getparam("no")
    $.post(baseUrl + "GetImmediatelyparameter", { machineIds: $.getparam("no") }, function(data) {
        if (data.Status == 0) {
            //选择图标类型
            var type;
			var colorIndex=0;
            $.each(data.Data.MAC_DATA, function(a, b) {

                for (var m = 0; m < b.DATAITEMS.length; m++) {
                    type = b.DATAITEMS[m].ChartType;
                    var item = 'par' + m;
                    //.split(",");
                    switch (type) {
                        case "chart1": //转速
                            $(".chart1").append('<div id="' + item + '"><div class="chart1_flagLabel">' + b.DATAITEMS[m].Description + '</div><div id="' + item + '_chart"></div></div>');
                            chartObj.chart1[item] = drawSpeedChart(item + "_chart", 300, 260, b.DATAITEMS[m].UnitName);
                            break;
                        case "chart2": //进度
                            $(".chart2").append('<div id="' + item + '"><div class="chart2_flagLabel">' + b.DATAITEMS[m].Description + '<span id="' + item + '_chartValue"></span></div><div id="' + item + '_chart"></div></div>');
                            chartObj.chart2[item] = drawProgressBar(item + "_chart", 500, 40);
                            break;
                        case "chart3": //数码管
                            $(".chart3").append('<div id="' + item + '" style="margin-right: 10px;"><div class="chart2_flagLabel">' + b.DATAITEMS[m].Description + '</div><div id="' + item + '_chart" style="border-radius: 5px ! important; border: 4px solid rgb(204, 204, 204);"></div></div>');
                            chartObj.chart3[item] = drawSSegArray(item + "_chart", 350, 100);
                            $("#" + item + "_chart").append('<span style="color: rgb(239, 247, 22); font-size: 18px; margin-right: 5px;">' + b.DATAITEMS[m].UnitName + '</span>');
                            break;
                        case "chart4": //文本框
                            $(".chart4").append('<div style="margin-bottom: 10px;"><div class="chart4_flagLabel">' + b.DATAITEMS[m].Description + ':</div><div class="chart4_value" id="' + item + '_chart"></div></div>');
                            chartObj.chart4[item] = item + "_chart";
                            break;
                        case "chart5": //实时曲线							
                            var tjson = {
                                name: b.DATAITEMS[m].Description,
								color : "green",
                                type: 'line',
                                yAxis: 0,
                                //data: intivalue.FD_WindSpeed_3s,
                                data: (function() {
                                    var data = [];
                                    var time = (new Date()).getTime();
                                    var i = 0;
                                    for (i = -59; i <= 0; i++) {
                                        var xx = time + i * 5000;
                                        data.push({
                                            x: xx,
                                            y: null
                                        });
                                    }
                                    return data;
                                })(),
                                marker: {
                                    enabled: false
                                }
                            };
							if(colorIndex<curveColors.length)
							{
								tjson.color= curveColors[colorIndex++];
							}
                            seriesdata.push(tjson);
                            chartObj.chart5[item] = seriesdata.length - 1;
                            break;
                    }
                }
            });

            if (seriesdata.length > 0) {
                drawRealCurve(lang.MACHINE_PARS_REAL_CURVE, "curves", seriesdata);
                resizeChart();
            }
            $("#contextPage").resize(function() {
                resizeChart();
            });

            GetImmediatelyparameter();
        }
    });

});

function GetImmediatelyparameter() {
    var no = ($.getparam("no"));
    $.post(baseUrl + "GetImmediatelyparameter", { machineIds: no }, function(data) {
        if (data.Status == 0) {
            //var series = this.series[0];
            $.each(data.Data.MAC_DATA, function(a, b) {
                $("#MAC_NAME").html(b.MAC_NAME);
                $("#MAC_NO").html(" NO:" + b.MAC_NO);
                //
                for (var n = 0; n < b.DATAITEMS.length; n++) {
                    if (b.DATAITEMS[n].ChartType != "") {
                    //chart1--转速表
                    //chart2--进度条
                    //chart3--温度/压力
                    //chart4--文本框
                    //chart5--曲线图
					var val=b.DATAITEMS[n].Value;
					if(b.DATAITEMS[n].DataType==8)
						val=moment(b.DATAITEMS[n].Value).format('YYYY-MM-DD HH:mm:ss');
                        switch (b.DATAITEMS[n].ChartType) {
                            case "chart1":
                            case "chart2":
                            case "chart3":
                                chartObj[b.DATAITEMS[n].ChartType]['par' + n].SetValue(val);
                                if (b.DATAITEMS[n].ChartType == "chart2") {
                                    $("#par" + n + "_chartValue").html("----" + val + "%");
                                }
                                break;
                            case "chart4":
								 $("#par" + n + "_chart").html(val);
                                break;
                            case "chart5":
                                var x = (new Date()).getTime();
                                for (var k in chartObj[b.DATAITEMS[n].ChartType]) {
                                    var y = val;
                                    chart.series[chartObj[b.DATAITEMS[n].ChartType]['par' + n]].addPoint([x, y], true, true);
                                }
                                break;
                        }

                    }
                }
            })
            setTimeout("GetImmediatelyparameter()", 5000);
        } else {
            BzAlert(data.Message);
        }
    });
}

function resizeChart() {
    var width = $(".chart5").width() - 30;
    chart.setSize(width, 350);
}

function drawSpeedChart(Container, width, height, unit) {
    return new zyGH.CGauge(Container, width, height).StartAngleSet(90).EndAngleSet(270).LargeTickSet(10).SmallTickSet(5).MinValueSet(0).MaxValueSet(150).DialRadiusSet(113).ltlenSet(14).stlenSet(8).SetName(unit).Create(130, 130);
}

function drawProgressBar(Container, width, height) {
    return new zyGH.ProgressBar(Container, width, height).SetWidth(width - 2).SetHight(height - 2).max(200).min(0).Radio(10).SetStrokecolor("#EF3130").SetcolorTop("#F18284").SetcolorMid("#EF3130").SetcolorButtom("#EF7574").Setopacity(50).Create(1, 1);
}

function drawSSegArray(Container, width, height) {
    return new zyGH.SSegArray(Container, width, height).Spacing(10).scale(1).Count(4).initialValue(1).SetcolorBlack("#212020").SetcolorTop("#07F7EB").Create(0, 12);
}
var chart;

function drawRealCurve(title, contains, seriesdata) {
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    chart = new Highcharts.Chart({
        chart: {
            renderTo: contains,
            alignTicks: true,
            animation: false,
            //width: 700, //790
            height: 350, //445
            //margin: [8, 90, 20, 85]
            backgroundColor: "#000000",
            events: {
                //load: function () {

                //    // set up the updating of the chart each second
                //    var series = this.series[0];
                //    setInterval(function () {
                //        var x = (new Date()).getTime(), // current time
                //            y = Math.random()*10000;
                //        series.addPoint([x, y], true, true);
                //        for (var m in chartObj) {
                //            chartObj[m].SetValue(parseFloat((Math.random() * 100).toFixed(1)));
                //        }
                //    }, 5000);
                //}
            }
        },
        title: {
            floating: false,
            text: title,
            style: {
                color: '#FFFFFF',
                font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
            },
            align: 'center',
            margin: 15
        },
        credits: {
            enabled: false //是否显示LOGO
        },
        xAxis: {
            type: 'datetime',
            lineColor: '#FFFFFF',
            lineWidth: 1,
            tickWidth: 1,
            tickColor: '#FFFFFF',
            gridLineColor: '#C0C0C0',
            gridLineWidth: 1,
            tickInterval: 1000 * 60, //30s
            //minTickInterval: 5, //5s

            minorGridLineWidth: 1,
            minorGridLineColor: '#FF0000',
            //minorTickLength: 50,
            //minorTickWidth: 1,

            labels: {
                //  x:
                y: 15,
                style: {
                    font: '12px Arial',
                    color: '#FFFFFF'
                }
            }
        },
        yAxis: [{ //曲线1
                //minorTickInterval: 1,
                lineColor: '#FFFFFF',
                lineWidth: 1,
                tickWidth: 1,
                tickColor: '#FFFFFF',
                gridlinewidth: 0,
                tickInterval: 500,
                //minorTickInterval: 'auto',
                maxPadding: 0,
                minPadding: 0,
                offset: 0,
                labels: {
                    formatter: function() {
                        return this.value;
                    },
                    style: {
                        font: '12px Arial',
                        color: '#FFFFFF'
                    }
                },
                title: {
                    text: ''
                },
                opposite: false, //Y轴靠左
                min: -5000,
                max: 5000 //
            }
            //, {
            //    //minorTickInterval: 4,
            //    lineColor: '#FFFFFF',
            //    lineWidth: 1,
            //    tickWidth: 1,
            //    tickColor: '#FFFFFF',
            //    gridLineWidth: 0,
            //    tickInterval: 40,
            //    offset: 0,
            //    labels: {
            //        formatter: function () {
            //            return this.value;
            //        },
            //        style: {
            //            font: '12px Arial',
            //            color: '#FFFFFF'
            //        }
            //    },
            //    title: {
            //        text: ''
            //    },
            //    opposite: true, //Y轴靠左
            //    min: 0,
            //    max: 200
            //}
        ],
        tooltip: {
            crosshairs: {
                color: '#FF0000'
            },
            borderColor: '#000000',
            enabled: true,
            shared: true,
            useHTML: true,
            headerFormat: '<small>{point.key}</small><table>',
            pointFormat: '<tr><td align="right" style="color: {series.color}">{series.name}: </td>' +
                '<td align="left"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            //crosshairs: true,
            xDateFormat: '%Y-%m-%d %H:%M:%S',
            valueDecimals: 0
        },
        legend: { //图列
            enabled: true,
            itemStyle: {
                color: '#FFFFFF'
            }
        },
        exporting: {
            enabled: false
        },
        series: seriesdata
    });

}