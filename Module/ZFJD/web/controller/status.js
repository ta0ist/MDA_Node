var mac;
var Status = {
    "1": "停机",
    "2": "运行",
    "3": "空闲",
    "4": "停机",
    "5": "调试",
}

var color = {
    "1": 'rgb(245, 40, 12)',
    "2": 'rgb(78, 207, 31)',
    "3": 'rgb(230, 210, 21)',
    "4": '#fff',
    "5": 'rgb(35, 43, 232)',
}
$.ajax({
    type: 'GET',
    async: false,
    url: '/ZFJD/getMac',
    success: function(data) {
        console.log(data)
        mac = data.Data;
    }
})

var macSelect = new ConboBox({
    id: '#mac',
    data: mac,
    fieldName: 'MAC_NAME',
    fieldId: 'MAC_NBR',
    width: $("#mac").css('width'),
    callBack: function() {
        var nbr = macSelect.rowData() == undefined ? mac[0].MAC_NBR : macSelect.rowData().MAC_NBR;
        aa11 = [];
        aa22 = [];
        refresh(nbr);
    }
}).init()

var zp1 = echarts.init(document.getElementById('zp1'));
var zp2 = echarts.init(document.getElementById('zp2'));

var zp3 = echarts.init(document.getElementById('zp3'));
//var zp4 = echarts.init(document.getElementById('zp4'));
refresh(mac[0].MAC_NBR);

function refresh(nbr) {
    $.ajax({
        type: 'post',
        url: '/ZFJD/status/GetTempNow',
        data: { MAC_NBR: nbr },
        success: function(data) {
            if (data.Status == 0) {
                var arr = [];
                var value = {
                    SpindleSpeed: 0,
                    FeedSpeed: 0
                }
                data.Data[0].machineitems.forEach(function(v, i) {
                    var obj = {}
                    if (v.Name == 'STD::Status') {
                        $("#status").html(Status[v.Value]);
                        $("#status").css('color', color[v.Value]);
                    } else if (v.Name == 'STD::SpindleSpeed') {
                        var a = [
                            { name: new Date(), value: v.Value }
                        ]
                        obj.name = v.Description;
                        obj.value = v.Value
                        arr.push(obj)
                            //zp3.setOption(zxOption(a, '主轴转速', 10000));
                            // obj.SpindleSpeed.name = v.Description;
                            // obj.SpindleSpeed.value = v.Value;
                        value.SpindleSpeed = v.Value;
                    } else if (v.Name == 'STD::SpindleOverride') {
                        obj.name = v.Description;
                        obj.value = v.Value
                        arr.push(obj)
                        zp1.setOption(zpOpt(v.Value, '主轴倍率'));
                        // obj.SpindleOverride.name = v.Description;
                        // obj.SpindleOverride.value = v.Value;
                    } else if (v.Name == 'STD::FeedSpeed') {
                        obj.name = v.Description;
                        obj.value = v.Value
                        arr.push(obj)
                            // zp4.setOption(zpOpt(v.Value, '进给值', 10000));
                            // obj.FeedSpeed.name = v.Description;
                            // obj.FeedSpeed.value = v.Value;
                        value.FeedSpeed = v.Value;
                    } else if (v.Name == 'STD::FeedOverride') {
                        obj.name = v.Description;
                        obj.value = v.Value;
                        arr.push(obj)
                        zp2.setOption(zpOpt(v.Value, '进给倍率'));
                        // obj.FeedOverride.name = v.Description;
                        // obj.FeedOverride.value = v.Value;
                    }

                })
                arr.forEach(function(v, i) {
                    $($('.c2>p:nth-child(1)')[i]).html(v.name);
                    $($('.c2>p:nth-child(2)')[i]).html(v.value);
                })
                zp3.setOption(zxOption(value.SpindleSpeed, value.FeedSpeed));


            }
        }
    })
}

setInterval(function() {
    var nbr = macSelect.rowData() == undefined ? mac[0].MAC_NBR : macSelect.rowData().MAC_NBR;
    refresh(nbr);
}, 2000)

function zpOpt(val, name, max) {

    var option = {
        backgroundColor: '#1b1b1b',
        series: [{
            type: 'gauge',
            data: [{ value: val, name }],
            max: max || 120,
            min: 0,
            splitNumber: 1,
            axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                    color: [
                        [0.15, '#1e90ff'],
                        [0.85, 'lime'],
                        [1, '#ff4500']
                    ],
                    width: 2,
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            title: {
                offsetCenter: [0, '-30%'], // x, y，单位px
                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: '#fff',
                    shadowColor: '#fff', //默认透明                    
                }
            },
            detail: {
                backgroundColor: 'rgba(30,144,255,0.8)',
                borderWidth: 1,
                borderColor: '#fff',
                shadowColor: '#fff', //默认透明
                shadowBlur: 5,
                offsetCenter: [0, '50%'], // x, y，单位px
                textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: '#fff'
                }
            },
        }],
        textStyle: {
            fontSize: 10
        }
    };
    return option;

}

var aa11 = [];
var aa22 = [];

function zxOption(v1, v2) {
    option = {
        backgroundColor: '#fff',
        title: {
            text: '动态数据',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#283b56'
                }
            }
        },
        legend: {
            data: ['主轴转速', '主轴进给值']
        },

        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        xAxis: [{
                type: 'category',
                boundaryGap: true,
                data: (function() {
                    var now = new Date();
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                        now = new Date(now - 2000);
                    }
                    return res;
                })()
            },

        ],
        yAxis: [{
                type: 'value',
                scale: true,
                name: '转速',
                max: 10000,
                min: 0,
                boundaryGap: [0.2, 0.2]
            },
            {
                type: 'value',
                scale: true,
                name: '进给值',
                max: 10000,
                min: 0,
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [{
                name: '主轴转速',
                type: 'line',
                data: (function() {
                    if (aa11.length < 11) {
                        aa11.push(v1);
                    } else {
                        aa11.shift();
                        aa11.push(v1);
                    }

                    return aa11;
                })()
            },
            {
                name: '主轴进给值',
                type: 'line',
                data: (function() {
                    if (aa22.length < 11) {
                        aa22.push(v2);
                    } else {
                        aa22.shift();
                        aa22.push(v2);
                    }

                    return aa22;
                })()
            }
        ]
    };
    return option;
}