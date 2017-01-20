//测量图
//ele:标签页，categories：横坐标，data:数据,plotLines标识线
function Xchart_M(ele, categories, data, plotLines, maxred, minred) {
    $(ele).highcharts({
        chart: {
            backgroundColor: '#293c55',
            type: 'line'
        },
        title: {
            text: null
        },
        xAxis: {
            categories: categories,
            tickmarkPlacement: 'on',
            tickInterval: 5,
            lineColor: '#FF0000',
            lineWidth: 2,
            labels: {
                style: {
                    color: '#FFFF6F', //颜色
                    fontSize: '14px' //字体
                }
            }
        },
        yAxis: {
            gridLineColor: '#293c55', //y轴标识线颜色
            lineColor: '#FF0000', //y轴颜色
            lineWidth: 2,
            minorGridLineWidth: 0,
            minorTickInterval: 'auto',
            minorTickColor: '#000000', //提示线颜色
            minorTickWidth: 1,
            max: maxred,
            min: minred,
            labels: {
                style: {
                    color: '#FFFF6F', //颜色
                    fontSize: '14px' //字体
                }
            },
            plotLines: plotLines
        },
        tooltip: {
            formatter: function() {
                return '<b>' + this.series.name + ':' + this.y;
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [data]
    });
}

//刀补图
//ele:标签页
function Xchart_O(ele, categories, data, plotLines) {
    $(ele).highcharts({
        chart: {
            backgroundColor: '#293c55',
            type: 'line'
        },
        title: {
            text: null
        },
        xAxis: {
            categories: categories,
            tickmarkPlacement: 'on',
            tickInterval: 5,
            lineColor: '#FF0000',
            lineWidth: 2,
            labels: {
                style: {
                    color: '#FFFF6F', //颜色
                    fontSize: '14px' //字体
                }
            }
        },
        yAxis: {
            gridLineColor: '#293c55', //y轴标识线颜色
            lineColor: '#FF0000', //y轴颜色
            lineWidth: 2,
            minorGridLineWidth: 0,
            minorTickInterval: 'auto',
            minorTickColor: '#000000', //提示线颜色
            minorTickWidth: 1,
            max: 1,
            min: 0,
            labels: {
                style: {
                    color: '#FFFF6F', //颜色
                    fontSize: '14px' //字体
                }
            },
        },
        tooltip: {
            formatter: function() {
                return '<b>' + this.series.name + ':' + this.y;
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [data]
    });
}