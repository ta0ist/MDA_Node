function GetOption(title) {
    return option = {
        backgroundColor: "#081132",
        color: ['#ffd285', '#ff733f', '#ec4863'],

        title: {
            backgroundColor: '#000',
            show: true,
            text: title,
            left: '35%',
            top: '2%',
            textStyle: {
                color: '#ffd285'
            }
        },
        grid: {
            left: '5%',
            right: '10%',
            top: '16%',
            bottom: '5%',
            containLabel: true
        },
        tooltip: {},
        // toolbox: {
        //     "show": true,
        //     feature: {
        //         saveAsImage: {}
        //     }
        // },
        xAxis: {
            //show:false,
            type: 'category',
            axisLine: {
                //show:false,
                onZero: false,
                lineStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                "show": false,
                // length: 15,
            },
            axisLabel: {
                //show:false,
                //rotate:45,
                textStyle: {
                    color: '#ffd285'
                }
            },
            splitArea: {
                show: false
            },
            boundaryGap: true, //false时X轴从0开始
            data: ['B001', 'B002']
        },
        yAxis: {
            //show:false,
            "axisLine": {
                //show:false,

            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: '#000'
                }
            },
            "axisTick": {
                show: false
            },
            axisLabel: {
                //show:false,
                textStyle: {
                    color: '#ffd285'
                }
            },
            type: 'value',
            max: 100
        },
        series: [{
            name: '利用率',
            smooth: true,
            type: 'bar',
            symbolSize: 8,
            data: [{
                value: 70,
                itemStyle: {
                    normal: {
                        color: '#00b050'
                    }
                }
            }, {
                value: 50,
                itemStyle: {
                    normal: {
                        color: '#558ed5'
                    }
                }
            }],
            itemStyle: {
                normal: {
                    color: '#beff33',
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    formatter: "{c}%",
                    fontSize: 20,
                    color: '#fff'
                }
            }
        }]
    }
}