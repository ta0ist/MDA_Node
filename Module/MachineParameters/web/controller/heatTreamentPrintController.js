$(function() {
    //初始加载拿传递过来的参数判断炉子和分区
    var url = window.location.search;
    var str1 = url.substring(url.lastIndexOf('?') + 1, url.length);
    var str2 = str1.split('&');

    var qian = []; //保存属性
    var hou = []; //保存属性值
    for (var i = 0; i < str2.length; i++) {
        qian.push(str2[i].split('=')[0]);
        hou.push(str2[i].split('=')[1]);
    }
    var lutype = unescape(hou[0]);
    //  if (lutype == 0) { $("#LU_TYPE").html("A炉"); }
    //  if (lutype == 1) { $("#LU_TYPE").html("B炉"); }
    //  if (lutype == 2) { $("#LU_TYPE").html("C炉"); }
    //  if (lutype == 3) { $("#LU_TYPE").html("D炉"); }
    //  if (lutype == 4) { $("#LU_TYPE").html("E炉"); }

    //时间操作部分
    //  var date = new Date();
    //  var nowDate = date.getFullYear() + '-' +
    //      ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' +
    //      ((date.getDate()) < 10 ? ("0" + (date.getDate())) : (date.getDate()))
    //      //+ ' ' + nowDate.getHours() + ':' + nowDate.getMinutes() + ':' + nowDate.getSeconds();
    // //  $("#startTime").val(nowDate);
    // //  $("#endTime").val(nowDate); //设置默认时间为当前时间
    $("#startTime").datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
        autoclose: true,
        minView: 0,
        minuteStep: 1
    });
    $("#endTime").datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
        autoclose: true,
        minView: 0,
        minuteStep: 1
    });

    $.post('/HeatTreatment/Print', { mac_nbr: lutype }).then((data) => {
        if (data.Status == 0) {
            if (data.Data.length > 0) {
                $('#YEILD').text(data.Data[0].YEILD);
                $('#BATCH').text(data.Data[0].BATCH);
                $('#MATERIAL').text(data.Data[0].MATERIAL);
            }

        }
    })

    //点击判断时间间隔并加载图表
    $("#toCharts").click(function() {
        var eDate = $("#endTime").val();
        var sDate = $("#startTime").val();
        if (+Date.parse(sDate) > +Date.parse(eDate)) {
            alert('开始时间不得大于结束时间!');
            return;
        }
        $.post('/HeatTreatment/PrintTemp_Group', { gp_nbr: lutype, StartDate: sDate, EndDate: eDate }, function(data) {
            if (data.StatusCode == 0) {
                let resylt = [],
                    group_list = {};
                for (let i = 0; i < data.Data.length; i++) {
                    group_list[data.Data[i].MAC_NAME] = {
                        mac_nbr: data.Data[i].MAC_NBR
                    }
                }
                for (let temp in group_list) {
                    let temp_list = _.where(data.Data, { 'MAC_NBR': group_list[temp].mac_nbr });
                    if (temp_list.length > 0) {
                        let child_list = {};
                        child_list.name = temp_list[0].MAC_NAME;
                        child_list.data = [];

                        for (let i = 0; i < temp_list.length; i++) {
                            let ch = [],
                                ch_time = moment(temp_list[i].STORAGE_DATE).format('X') * 1000 + 8 * 3600 * 1000,
                                ch_v = temp_list[i].PV;
                            ch.push(ch_time);
                            ch.push(ch_v);
                            child_list.data.push(ch);
                        }
                        resylt.push(child_list);
                    }
                }
                drawLine_group(resylt);
            }


        })
    })
})

function drawLine(data, StartDate) {
    var start = +new Date();
    $('#container').highcharts('StockChart', {
        chart: {
            events: {
                load: function() {
                    if (!window.isComparing) {
                        this.setTitle(null, {
                            text: '图表建立耗时 ' + (new Date() - start) + 'ms'
                        });
                    }
                }
            },
            zoomType: 'x'
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        title: {
            text: '历史温度曲线图'
        },
        credits: {
            enabled: false
        },
        rangeSelector: {
            buttonTheme: {
                display: 'none' // 不显示按钮
            },
            selected: 1,
            inputEnabled: false // 不显示日期输入框
        },
        series: [{
            name: 'Temperature',
            data: data.Data,
            pointStart: moment(StartDate).format('X') * 1000 + 8 * 3600 * 1000,
            pointInterval: 10 * 1000,
            tooltip: {
                valueDecimals: 1,
                valueSuffix: '°C'
            }
        }]
    })
}

function drawLine_group(data) {
    $('#container').highcharts({
        chart: {
            type: 'spline'
        },
        title: {
            text: '热处理记录'
        },
        subtitle: {
            text: 'HeatTreatment Record'
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: null
            }
        },
        yAxis: {
            title: {
                text: '温度(℃)'
            },
            min: 0,
            max: 1200
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