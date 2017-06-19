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
var lutype = unescape(hou[1]);
$("#LU_TYPE").html(lutype);

//时间操作部分
var date = new Date();
var nowDate = date.getFullYear() + '-' +
    ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' +
    ((date.getDate()) < 10 ? ("0" + (date.getDate())) : (date.getDate()))
    //+ ' ' + nowDate.getHours() + ':' + nowDate.getMinutes() + ':' + nowDate.getSeconds();
$("#startTime").val(nowDate);
$("#endTime").val(nowDate); //设置默认时间为当前时间

$("#startTime").datetimepicker({ minView: "month", language: 'zh-CN', format: "yyyy-mm-dd", todayBtn: true, autoclose: true });
$("#endTime").datetimepicker({ minView: "month", language: 'zh-CN', format: "yyyy-mm-dd", todayBtn: true, autoclose: true });

//点击显示图表区
$("#toCharts").click(function() {
    $("#showChart").addClass("SChart").removeClass("HChart");
})

//时间格式转换，本地电脑时间
Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

//作图区
$('#charts').highcharts({
    chart: {
        backgroundColor: '#C7C5B8',
        type: 'spline',
        animation: Highcharts.svg,
        marginRight: 10,
        events: {
            load: function() {
                var series = this.series[0];

                var num = 0;
                var yData = []; //y轴值，从后台动态获取温度值，做参数

                var JSQ = setInterval(function() {
                    var x = (new Date()).getTime(),
                        y = 200 + Math.floor(Math.random() * 600);
                    series.addPoint([x, y], true, true);

                    //var x = (new Date()).getTime(),
                    //    y = yData[num];               //获取温度值的下一个值
                    //series.addPoint([x, y], true, true);
                    //num++;
                    //if (num > yData.length) {
                    //    clearInterval(JSQ);           //超过温度数组长度后停止图表加点
                    //}
                }, 1000);
            }
        }
    },
    title: {
        text: '冶炼炉状态图'
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
        title: {
            text: 'PV值'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        formatter: function() {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2);
        }
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: 'PV值',
        data: (function() {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;
            for (i = -19; i <= 0; i += 1) {
                data.push({
                    x: time + i * 1000,
                    y: 200 + Math.floor(Math.random() * 600)
                });
            }
            return data;
        }())
    }], //绑定图表数据
    credits: {
        enabled: false // 禁用版权信息
    }
});