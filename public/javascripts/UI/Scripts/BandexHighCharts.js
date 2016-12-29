(function ($, undefined) {
    $.widget("BZ.hisChart", {
        options: {
            type: "column",
            title: "",
            titlebool: true,
            subtitle: "",
            subtitlebool: true,
            height: 500,
            stacking: null,
            dataSource: [],
            yAxistile: "",
            margin: 75,
            exportEnable: true,
            ymax: null,
            legend: {
                y: 0
            }
        },
        _create: function () {
            var self = this;
            this.chartOptions = {
                chart: {
                    renderTo: this.element[0].id,
                    type: this.options.type,
                    margin: this.options.margin,
                    height: this.options.height,
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: 0,
                        depth: 60,
                        viewDistance: 25
                    }
                },
                title: this.options.titlebool ? {
                    text: this.options.title,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 30
                } : "",
                subtitle: this.options.subtitlebool ? {
                    text: this.options.subtitle,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 50
                } : "",
                credits: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: this.options.yAxistile,
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#000"
                        }
                    },
                    min: 0,
                    max: this.options.ymax
                },
                xAxis: {
                    //type: 'datetime',
                    //tickInterval: 1000 * 86400,
                    categories: this.options.categories,
                    title: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            color: "#000"
                        }
                    }
                },
                legend: {
                    y: this.options.legend.y
                },
                plotOptions: {
                    column: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) ? "" : this.y.toFixed(1) + '%';
                            }
                        }
                    },
                    line: {
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) ? "" : this.y.toFixed(1) + '%';
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y.toFixed(1) + '%';
                    }
                },
                exporting: {
                    enabled: this.options.exportEnable,
                    buttons: {
                        contextButton: {
                            menuItems: [{
                                text: "柱形图",//$.Translate("YieldAnalysis.HIGHCHARTS_COLUMN")
                                onclick: function () {
                                    self.chartOptions.chart.type = "column";
                                    self.chart = new Highcharts.Chart(self.chartOptions);
                                    //self._showValues();
                                }
                            }, {
                                text:"折线图" ,//$.Translate("YieldAnalysis.HIGHCHARTS_LINE")
                                onclick: function () {
                                    self.chartOptions.chart.type = "line";
                                    self.chart = new Highcharts.Chart(self.chartOptions);
                                    //self._hideValues();
                                }
                            }]
                        }
                    }
                },
                series: this.options.dataSource
            }
            this.chart = new Highcharts.Chart(this.chartOptions);
            $('#R0').on('change', { obj: this }, function (event) {
                var self = event.data.obj;
                self.chart.options.chart.options3d.alpha = this.value;
                self._showValues();
                self.chart.redraw(false);
            });
            $('#R1').on('change', { obj: this }, function (event) {
                var self = event.data.obj;
                self.chart.options.chart.options3d.beta = this.value;
                self._showValues();
                self.chart.redraw(false);
            });
            //this._hideValues();
        },
        _showValues: function () {
            $('#R0-value').html(this.chart.options.chart.options3d.alpha);
            $('#R1-value').html(this.chart.options.chart.options3d.beta)
            $("#sliders").show();;
        },
        _hideValues: function () {
            $("#sliders").hide();
        },
        destroy: function () {
            this.chart.destroy();
            $('#R0').off("change");
            $('#R1').off("change");
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);
(function ($, undefined) {
    $.widget("BZ.hisChartYield", {
        options: {
            type: "column",
            title: "",
            subtitle: "",
            height: 500,
            stacking: null,
            dataSource: [],
            yAxistile: "",
            eventclick: false
        },
        _create: function () {
            var self = this;
            this.chartOptions = {
                chart: {
                    renderTo: this.element[0].id,
                    type: this.options.type,
                    margin: 75,
                    height: this.options.height,
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: 0,
                        depth: 60,
                        viewDistance: 25
                    }
                },
                title: {
                    text: this.options.title,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 30
                },
                subtitle: {
                    text: this.options.subtitle,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 50
                },
                credits: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: this.options.yAxistile,
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#000"
                        }
                    },
                    min: 0
                },
                xAxis: {
                    //type: 'datetime',
                    //tickInterval: 1000 * 86400,
                    categories: this.options.categories,
                    title: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            color: "#000"
                        }
                    }
                },
                plotOptions: {
                    column: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            }
                        }
                    },
                    line: {
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            }
                        }
                    },
                    series: self.options.eventclick ? {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function () {
                                    //alert(this.category)
                                    self.options.click.call(self, this.series, this);
                                }
                            }
                        }
                    } : null
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            menuItems: [{
                                text:"柱形图" ,//$.Translate("YieldAnalysis.HIGHCHARTS_COLUMN")
                                onclick: function () {
                                    self.chartOptions.chart.type = "column";
                                    self.chart = new Highcharts.Chart(self.chartOptions);
                                    //self._showValues();
                                }
                            }, {
                                text:"折线图",// $.Translate("YieldAnalysis.HIGHCHARTS_LINE")
                                onclick: function () {
                                    self.chartOptions.chart.type = "line";
                                    self.chart = new Highcharts.Chart(self.chartOptions);
                                    //self._hideValues();
                                }
                            }]
                        }
                    }
                },
                series: this.options.dataSource
            }
            this.chart = new Highcharts.Chart(this.chartOptions);
            //$('#R0').on('change', { obj: this }, function (event) {
            //    var self = event.data.obj;
            //    self.chart.options.chart.options3d.alpha = this.value;
            //    self._showValues();
            //    self.chart.redraw(false);
            //});
            //$('#R1').on('change', { obj: this }, function (event) {
            //    var self = event.data.obj;
            //    self.chart.options.chart.options3d.beta = this.value;
            //    self._showValues();
            //    self.chart.redraw(false);
            //});
            //this._hideValues();
        },
        _showValues: function () {
            //$('#R0-value').html(this.chart.options.chart.options3d.alpha);
            //$('#R1-value').html(this.chart.options.chart.options3d.beta)
            //$("#sliders").show();;
        },
        _hideValues: function () {
            //$("#sliders").hide();
        },
        destroy: function () {
            this.chart.destroy();
            //$('#R0').off("change");
            //$('#R1').off("change");
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);
(function ($, undefined) {
    $.widget("BZ.hisChartStateShare", {//历史状态占有率
        options: {
            type: "column",
            title: "",
            titlebool: true,
            subtitle: "",
            subtitlebool: true,
            height: 500,
            stacking: null,
            dataSource: [],
            margin: 75,
            legend: {
                y: 0
            }

        },
        _create: function () {
            this.chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.element[0].id,
                    type: this.options.type,
                    margin: this.options.margin,
                    height: this.options.height,
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: 0,
                        depth: 60,
                        viewDistance: 25
                    }
                },
                title: this.options.titlebool ? {
                    enabled: false,
                    text: this.options.title,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 30
                } : "",
                subtitle: this.options.subtitlebool ? {
                    text: this.options.subtitle,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 50
                } : "",
                credits: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: "占有率(%)",
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#000"
                        }
                    },
                    min: 0
                },
                xAxis: {
                    //type: 'datetime',
                    //tickInterval: 1000 * 86400,
                    categories: this.options.categories,
                    title: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            color: "#000"
                        }
                    }
                },
                legend: {
                    y: this.options.legend.y
                },
                plotOptions: {
                    column: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) ? "" : this.y.toFixed(1) + '%';
                            }
                        }
                    },
                    line: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) ? "" : this.y.toFixed(1) + '%';
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y.toFixed(1) + '%<br/>' +
                            '用时' + ': ' + this.series.userOptions.time[this.point.x] + '小时';
                    }
                },
                series: this.options.dataSource
            });
            //$('#R0').on('change', { obj: this }, function (event) {
            //    var self = event.data.obj;
            //    self.chart.options.chart.options3d.alpha = this.value;
            //    self._showValues();
            //    self.chart.redraw(false);
            //});
            //$('#R1').on('change', { obj: this }, function (event) {
            //    var self = event.data.obj;
            //    self.chart.options.chart.options3d.beta = this.value;
            //    self._showValues();
            //    self.chart.redraw(false);
            //});
            //this._hideValues();
        },
        _showValues: function () {
            //$('#R0-value').html(this.chart.options.chart.options3d.alpha);
            //$('#R1-value').html(this.chart.options.chart.options3d.beta);
        },
        destroy: function () {
            this.chart.destroy();
            //$('#R0').off("change");
            //$('#R1').off("change");
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);
(function ($, undefined) {
    $.widget("BZ.hisChartMemberRatio", {//人员效率
        options: {
            type: "column",
            title: "",
            titlebool: true,
            subtitle: "",
            subtitlebool: true,
            height: 500,
            stacking: null,
            dataSource: [],
            ytitle: "",
            margin: 75,
            unit: "%",
            legend: {
                y: 0
            }
        },
        _create: function () {
            var self = this;
            this.chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.element[0].id,
                    type: this.options.type,
                    margin: this.options.margin,
                    height: this.options.height,
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: 0,
                        depth: 60,
                        viewDistance: 25
                    }
                },
                title: this.options.titlebool ? {
                    enabled: false,
                    text: this.options.title,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 30
                } : "",
                subtitle: this.options.subtitlebool ? {
                    text: this.options.subtitle,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 50
                } : "",
                credits: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: this.options.ytitle,
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#000"
                        }
                    },
                    min: 0
                },
                xAxis: {
                    //type: 'datetime',
                    //tickInterval: 1000 * 86400,
                    categories: this.options.categories,
                    title: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            color: "#000"
                        }
                    }
                },
                legend: {
                    y: this.options.legend.y
                },
                plotOptions: {
                    column: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) || (this.y < 10) ? "" : this.y.toFixed(1) + self.options.unit;
                            }
                        }
                    },
                    line: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) ? "" : this.y.toFixed(1) + self.options.unit;
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y.toFixed(1) + self.options.unit;
                    }
                },
                series: this.options.dataSource
            });
        },
        _showValues: function () {
            //$('#R0-value').html(this.chart.options.chart.options3d.alpha);
            //$('#R1-value').html(this.chart.options.chart.options3d.beta);
        },
        destroy: function () {
            this.chart.destroy();
            //$('#R0').off("change");
            //$('#R1').off("change");
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);



(function ($, undefined) {
    $.widget("BZ.hisChartYiledSaticRatio", {//产量分析
        options: {
            type: "column",
            title: "",
            titlebool: true,
            subtitle: "",
            subtitlebool: true,
            height: 500,
            stacking: null,
            dataSource: [],
            ytitle: "",
            margin: 75,
            unit: "%",
            legend: {
                y: 0
            },
            searchType: 0
        },
        _create: function () {
            var self = this;
            this.chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.element[0].id,
                    type: this.options.type,
                    margin: this.options.margin,
                    height: this.options.height,
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: 0,
                        depth: 60,
                        viewDistance: 25
                    }
                },
                title: this.options.titlebool ? {
                    enabled: false,
                    text: this.options.title,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 30
                } : "",
                subtitle: this.options.subtitlebool ? {
                    text: this.options.subtitle,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 50
                } : "",
                credits: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: this.options.ytitle,
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#000"
                        }
                    },
                    min: 0
                },
                xAxis: {
                    //type: 'datetime',
                    //tickInterval: 1000 * 86400,
                    categories: this.options.categories,
                    title: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            color: "#000"
                        }
                    }
                },
                legend: {
                    y: this.options.legend.y
                },
                plotOptions: {
                    column: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) || (this.y < 10) ? "" : this.y.toFixed(1) + self.options.unit;
                            }
                        }
                    },
                    line: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) ? "" : this.y.toFixed(1) + self.options.unit;
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        var plancount = 0;
                        var realcount = 0, times;
                        var obj = self.options.dataobj;
                        for (var item in obj) {
                            switch (self.options.searchType) {
                                case 1:
                                    times = moment(obj[item].DAYS).format('M/D' + obj[item].SHIFT_NAME);
                                    break;
                                case 2:
                                    times = moment(obj[item].DAYS).format('M/D');
                                    break;
                                case 3:
                                    times = moment(obj[item].DAYS).format('YYYY-') + obj[item].WEEK + "周";
                                    break;
                                case 4:
                                    times = moment(obj[item].DAYS).format('YYYY/M');
                                    break;
                                case 5:
                                    times = moment(obj[item].DAYS).format('YYYY');
                                    break;
                            }
                            //var times = moment(obj[item].DAYS).format("M/D");
                            var keys = obj[item].PROGRAM_NAME + "(" + times + ")";
                            if (this.key == keys) {
                                plancount = '额定产量：' + obj[item].PLAN_COUNT;
                                realcount = '实际产量：' + obj[item].YIELD_COUNT;
                            }

                        }
                        return '<b>' + this.x + '</b><br/>' + plancount + '<br/>' + realcount + '<br/>' + this.series.name + ': ' + this.y.toFixed(1) + self.options.unit;
                    }
                },
                searchType: this.options.searchType,
                series: this.options.dataSource
            });
        },
        _showValues: function () {
            //$('#R0-value').html(this.chart.options.chart.options3d.alpha);
            //$('#R1-value').html(this.chart.options.chart.options3d.beta);
        },
        destroy: function () {
            this.chart.destroy();
            //$('#R0').off("change");
            //$('#R1').off("change");
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);

(function ($, undefined) {
    $.widget("BZ.hisChartMachineRatio", {//工件达成率
        options: {
            type: "column",
            title: "",
            titlebool: true,
            subtitle: "",
            subtitlebool: true,
            height: 500,
            stacking: null,
            dataSource: [],
            ytitle: "",
            margin: 75,
            unit: "%",
            legend: {
                y: 0
            }
        },
        _create: function () {
            var self = this;
            this.chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.element[0].id,
                    type: this.options.type,
                    margin: this.options.margin,
                    height: this.options.height,
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: 0,
                        depth: 60,
                        viewDistance: 25
                    }
                },
                title: this.options.titlebool ? {
                    enabled: false,
                    text: this.options.title,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 30
                } : "",
                subtitle: this.options.subtitlebool ? {
                    text: this.options.subtitle,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 50
                } : "",
                credits: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: this.options.ytitle,
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#000"
                        }
                    },
                    min: 0
                },
                xAxis: {
                    //type: 'datetime',
                    //tickInterval: 1000 * 86400,
                    categories: this.options.categories,
                    title: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            color: "#000"
                        }
                    }
                },
                legend: {
                    y: this.options.legend.y
                },
                plotOptions: {
                    column: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) || (this.y < 10) ? "" : this.y.toFixed(1) + self.options.unit;
                            }
                        }
                    },
                    line: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) ? "" : this.y.toFixed(1) + self.options.unit;
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        var plantime = 0;
                        var realtime = 0;
                        var obj = self.options.dataobj;
                        for (var item in obj) {
                            //var times = moment(obj[item].DAY).format("M/D");
                            var keys = obj[item].PROG_NAME;
                            if (this.key == keys) {
                                plantime = '计划用时:' + obj[item].PROG_PLAN_TIME;
                                realtime = '实际用时:' + obj[item].TIME;
                            }
                        }
                        return '<b>' + this.x + '</b><br/>' + plantime + '<br/>' + realtime + '<br/>' + this.series.name + ': ' + this.y.toFixed(1) + self.options.unit;
                    }
                },
                series: this.options.dataSource
            });
        },
        _showValues: function () {
            //$('#R0-value').html(this.chart.options.chart.options3d.alpha);
            //$('#R1-value').html(this.chart.options.chart.options3d.beta);
        },
        destroy: function () {
            this.chart.destroy();
            //$('#R0').off("change");
            //$('#R1').off("change");
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);

(function ($, undefined) {
    $.widget("BZ.hisChartOutRatio", {//工件效率
        options: {
            type: "column",
            title: "",
            titlebool: true,
            subtitle: "",
            subtitlebool: true,
            height: 500,
            stacking: null,
            dataSource: [],
            ytitle: "",
            margin: 75,
            unit: "%",
            legend: {
                y: 0
            }
        },
        _create: function () {
            var self = this;
            this.chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.element[0].id,
                    type: this.options.type,
                    margin: this.options.margin,
                    height: this.options.height,
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: 0,
                        depth: 60,
                        viewDistance: 25
                    }
                },
                title: this.options.titlebool ? {
                    enabled: false,
                    text: this.options.title,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 30
                } : "",
                subtitle: this.options.subtitlebool ? {
                    text: this.options.subtitle,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 50
                } : "",
                credits: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: this.options.ytitle,
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#000"
                        }
                    },
                    min: 0
                },
                xAxis: {
                    //type: 'datetime',
                    //tickInterval: 1000 * 86400,
                    categories: this.options.categories,
                    title: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            color: "#000"
                        }
                    }
                },
                legend: {
                    y: this.options.legend.y
                },
                plotOptions: {
                    column: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) || (this.y < 10) ? "" : this.y.toFixed(1) + self.options.unit;
                            }
                        }
                    },
                    line: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) ? "" : this.y.toFixed(1) + self.options.unit;
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y.toFixed(1) + self.option;
                    }
                },
                series: this.options.dataSource
            });
        },
        _showValues: function () {
            //$('#R0-value').html(this.chart.options.chart.options3d.alpha);
            //$('#R1-value').html(this.chart.options.chart.options3d.beta);
        },
        destroy: function () {
            this.chart.destroy();
            //$('#R0').off("change");
            //$('#R1').off("change");
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);

(function ($, undefined) {
    $.widget("BZ.hisChartOrderYield", {//工单产量分析
        options: {
            type: "column",
            title: "",
            titlebool: true,
            subtitle: "",
            subtitlebool: true,
            height: 500,
            stacking: null,
            dataSource: [],
            ytitle: "",
            margin: 75,
            legend: {
                y: 0
            }
        },
        _create: function () {
            this.chart = new Highcharts.Chart({
                chart: {
                    renderTo: this.element[0].id,
                    type: this.options.type,
                    margin: this.options.margin,
                    height: this.options.height,
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: 0,
                        depth: 60,
                        viewDistance: 25
                    }
                },
                title: this.options.titlebool ? {
                    enabled: false,
                    text: this.options.title,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 30
                } : "",
                subtitle: this.options.subtitlebool ? {
                    text: this.options.subtitle,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 50
                } : "",
                credits: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: this.options.ytitle,
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#000"
                        }
                    },
                    min: 0
                },
                xAxis: {
                    //type: 'datetime',
                    //tickInterval: 1000 * 86400,
                    categories: this.options.categories,
                    title: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            color: "#000"
                        }
                    }
                },
                legend: {
                    y: this.options.legend.y
                },
                plotOptions: {
                    column: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) || (this.y < 10) ? "" : this.y.toFixed(0);
                            }
                        }
                    },
                    line: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            },
                            formatter: function () {
                                return (this.y == null) ? "" : this.y.toFixed(0);
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y.toFixed(0);
                    }
                },
                series: this.options.dataSource
            });
        },
        _showValues: function () {
            //$('#R0-value').html(this.chart.options.chart.options3d.alpha);
            //$('#R1-value').html(this.chart.options.chart.options3d.beta);
        },
        destroy: function () {
            this.chart.destroy();
            //$('#R0').off("change");
            //$('#R1').off("change");
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);
//历史状态条形图
(function ($, undefined) {
    $.widget("BZ.viewChart", {
        options: {
            width: 720,
            height: 80,
            timedepth: 86400,
            padding: 15,
            three: true,
            url: null,
            startdate: new Date(),//放大视图时使用
            shiftstartdate: new Date(),
            filter: false,
            select: $.noop,
            type: "day"//day or shift
        },
        _create: function () {
            var id = this.element[0].id;

            this.viewStatus = 1;//初始化视图状态标志:1=原始状态；2=放大状态
            this.paper = Raphael(id, this.options.width, this.options.height);
            //计算分辨率:1px=多少秒
            this.resolution = parseFloat((this.options.timedepth / (this.options.width - this.options.padding * 2)).toFixed(2));
            //绘制坐标轴"|_______________________________________________________"
            this.paper.path("M" + this.options.padding + " 5l0 " + (this.options.height - 20) + "l" + (this.options.width - this.options.padding * 2) + " 0").attr({
                "stroke": "#000000",
                "stroke-width": 1
            });
            //背景
            this.paper.rect(this.options.padding, 5, this.options.width - this.options.padding * 2, this.options.height - 20, 0).attr({
                "stroke": "#1F262D",
                "stroke-width": 0,
                "fill": "#FFFFFF"
            }).mousedown(function (e) {

            }).mousemove(function (e) {

            });
            var self = this;
            $(document).mouseup(function (event) {
                $("#ms").remove();
                //清除self.selected
                try {
                    if (!event.target.raphael) {
                        if (event.target.nodeName == "svg") { }
                        else {
                            if (self.selected != undefined) {
                                self.selected.remove();
                                self.selected_left.remove();
                                self.selected_right.remove();
                            }
                        }
                    }
                }
                catch (e) { }
            });
            //绘制选择对象
            this.selec_x = 0;
            this.selected;
            this.selectStatus = false;//选择状态标志
            this.drawAxis();
            if (this.options.type == "shift") {
                var tdate = moment(this.options.shiftstartdate);
                this.stime = tdate.get("hour") * 3600 + tdate.get("minute") * 60 + tdate.get("second");
            }
        },
        drawStatusByShift: function (data) {
            for (var i = 0; i < data.length; i++) {//班次
                this.drawStatus(data[i].StatusData);
            }
        },
        saveData: function (data) {
            this.dataSource = data;
        },
        drawStatus: function (data) {
            var self = this;
            this.StatusData = {};
            var length = data.length;
            for (var i = 0; i < length; i++) {
                if (data[i].START == data[i].END) {
                    continue; // 过滤无效数据
                }
                var sdate = moment(data[i].START);
                var edate = moment(data[i].END).subtract(1, 'seconds');
                var starttimes = sdate.hour() * 3600 + sdate.minute() * 60 + sdate.second();
                var endtimes = edate.hour() * 3600 + edate.minute() * 60 + edate.second();

                if (this.options.type == "shift") {
                    //判断是否跨天
                    if (sdate.get('date') != moment(this.options.shiftstartdate).get('date')) {
                        starttimes = starttimes + 86400;
                    }
                    if (edate.get('date') != moment(this.options.shiftstartdate).get('date')) {
                        endtimes = endtimes + 86400;
                    }
                    starttimes = starttimes - this.stime;
                    endtimes = endtimes - this.stime;
                }
                var start_px = starttimes / this.resolution;
                var end_px = endtimes / this.resolution;
                var st = self.paper.set();
                var HH = 10;//三维第一部分高度
                //过滤
                var isDraw = true;
                if (this.options.filter) {
                    var logicValue = parseInt(this.options.logicValue);
                    var sptime = endtimes - starttimes;//时间差
                    if (this.options.logic == 1) { //<=
                        if (sptime > logicValue) {
                            isDraw = false;
                        }
                    }
                    else if (this.options.logic == 2) {  //>=
                        if (sptime < logicValue) {
                            isDraw = false;
                        }
                    }
                }
                if (isDraw) {
                    if (this.options.three) {
                        var spath1 = {
                            path1: "M" + (this.options.padding + start_px) + " " + 20,
                            path2: "l" + HH / Math.tan(Raphael.rad(45)) + " -" + HH,
                            path3: "l" + (end_px - start_px) + " 0",
                            path4: "l-" + HH / Math.tan(Raphael.rad(45)) + " " + HH
                        }
                        st.push(self.paper.path(spath1.path1 + spath1.path2 + spath1.path3 + spath1.path4 + "z")
                                         .attr({
                                             "stroke-width": 0,
                                             "fill": "90-" + ("#"+data[i].COLOR.Name) + "-#000:0-#000:0-" + ("#"+data[i].COLOR.Name)//67.5-#dd4242-#ff4242:48-#A00:52-#A00
                                         }).data("type", 1));
                    }
                    st.push(self.paper.rect(this.options.padding + start_px, 20, end_px - start_px, this.options.height - 36, 0)
                                     .attr({
                                         "stroke-width": 0,
                                         "fill": '#'+data[i].COLOR.Name
                                     }).data("type", 2));
                    if (this.options.three) {
                        var spath2 = {
                            path1: "M" + (this.options.padding + end_px - 1) + " " + 20,
                            path2: "l" + (HH + 1) / Math.tan(Raphael.rad(45)) + " -" + HH,
                            path3: "l0" + " " + (this.options.height - 36 + 0.5),
                            path4: "l-" + (HH + 1) / Math.tan(Raphael.rad(45)) + " " + HH
                        }
                        st.push(self.paper.path(spath2.path1 + spath2.path2 + spath2.path3 + spath2.path4 + "z")
                                         .attr({
                                             "stroke-width": 0,
                                             "fill": "0-" + ("#"+data[i].COLOR.Name) + "-#000:0-#000:0-" + ("#"+data[i].COLOR.Name)
                                         }).data("type", 3));
                    }
                    st.data("Url", this.options.url);
                    st.data("StatusID", data[i].STATUSID);
                    st.data("Element", this.element);
                    st.data("obj", this);
                    //绑定鼠标滑动事件
                    if (this.options.url != null) {
                        var ajaxGet;
                        st.mouseover(function () {
                            //rect.stop().animate({ transform: "s1" }, 200).toFront();
                            $("#ms").remove()
                            var rect = this;
                            ajaxGet = $.post(this.data("Url"), { StatusID: this.data("StatusID") }, function (data) {

                                var message = ' <form class="form-horizontal" style="min-width: 260px;padding-top:0px;">' +
                                             '<div class="control-group" style="margin-bottom: 0px;">' +
                                                '<label class="control-label callout-control-label">' + '状态名称' + '</label>' +
                                                '<div class="controls controls-control-label">' +
                                                     '<span>' + data.Data.NAME + '</span>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div class="control-group" style="margin-bottom: 0px;">' +
                                                            '<label class="control-label callout-control-label">' + '开始时间' + '</label>' +
                                                            '<div class="controls controls-control-label">' +
                                                                '<span>' + moment(data.Data.START).format("YYYY-MM-DD HH:mm:ss") + '</span>' +
                                                            '</div>' +
                                                        '</div>' +
                                            '<div class="control-group" style="margin-bottom: 0px;">' +
                                                            '<label class="control-label callout-control-label">' + '结束时间' + '</label>' +
                                                            '<div class="controls controls-control-label">' +
                                                                 '<span>' + moment(data.Data.END).format("YYYY-MM-DD HH:mm:ss") + '</span>' +
                                                            '</div>' +
                                                        '</div>' +
                                            '<div class="control-group" style="margin-bottom: 0px;">' +
                                                            '<label class="control-label callout-control-label">' + '操作人员' + '</label>' +
                                                            '<div class="controls controls-control-label">' +
                                                                 '<span>' + data.Data.MEM + '</span>' +
                                                            '</div>' +
                                                        '</div>' +
                                            '<div class="control-group" style="margin-bottom: 0px;">' +
                                                            '<label class="control-label callout-control-label">' + '状态描述'+ '</label>' +
                                                            '<div class="controls controls-control-label">' +
                                                                 '<span>' + data.Data.MEMO + '</span>' +
                                                            '</div>' +
                                                        '</div></form>';
                                var top, left;
                                //if (this.data("id_shift") == 0) { //日期状态数据
                                //  top = $("#status_Detail_" + this.data("id")).offset().top - 100;
                                //  left = $("#status_Detail_" + this.data("id")).offset().left;
                                //}
                                //else { //班次状态数据
                                top = $(rect.data("Element")).offset().top;
                                left = $(rect.data("Element")).offset().left;
                                //}
                                $("#display").jCallout({
                                    message: message,
                                    position: "top",
                                    id: "ms"
                                });
                                $("#ms").css({ "display": "block" });
                                var obj;
                                if (rect.data("type") == 1) {
                                    obj = rect.next;
                                }
                                else if (rect.data("type") == 2) {
                                    obj = rect;
                                }
                                else if (rect.data("type") == 3) {
                                    obj = rect.prev;
                                }
                                //判断是否已经超过屏幕宽度
                                var newLeft = obj.attrs.x + left + obj.attrs.width / 2 + ($("#ms").width() + 12) / 2;
                                if (newLeft > $(window).width()) {
                                    //超过
                                    $("#ms").css({
                                        //"top": (rect.attrs.y + rect.attrs.height + 20) + "px",
                                        "z-index": 50,
                                        "top": (top - $("#ms").height() - 25) + "px",
                                        "left": (obj.attrs.x + left + obj.attrs.width / 2 - $("#ms").width()) + "px"
                                    });
                                    $(".notch_top").css({ "left": "250px" });
                                }
                                else {
                                    $("#ms").css({
                                        //"top": (rect.attrs.y + rect.attrs.height + 20) + "px",
                                        "z-index": 50,
                                        "top": (top - $("#ms").height() - 25) + "px",
                                        "left": (obj.attrs.x + left + obj.attrs.width / 2 - ($("#ms").width() + 12) / 2) + "px"
                                    });
                                    $(".notch_top").css({ "left": "125px" });
                                }

                            });
                        }).mouseout(function () {
                            $("#ms").remove();
                            ajaxGet.abort();
                        }).mousedown(function (e) {
                            //更新位置
                            var rect = this;
                            var top, left;
                            top = $(rect.data("Element")).offset().top;
                            left = $(rect.data("Element")).offset().left;
                            var obj;
                            if (rect.data("type") == 1) {
                                obj = rect.next;
                            }
                            else if (rect.data("type") == 2) {
                                obj = rect;
                            }
                            else if (rect.data("type") == 3) {
                                obj = rect.prev;
                            }
                            $("#popover").css({
                                "position": "absolute",
                                "top": top + 20 + "px",
                                "left": obj.attrs.x + left + "px"
                            });
                            if ($("#popover").data("BZ-myeditable") != undefined) {
                                $("#popover").data("BZ-myeditable").destroy();
                            }
                            $("#popover").myeditable({
                                title: '编辑<i id="BzEditerCancel" style="position: absolute; right: 10px;" class="icon-remove"></i>',
                                content: $("#treeview-template").html(),
                                ok: "#BzEditerOk",
                                cancel: "#BzEditerCancel",
                                statusID: obj.data("StatusID"),
                                url: ""
                            });

                        }).mouseup(function (e) {

                        }).mousemove(function (e) {

                        });
                    }
                    this.StatusData[data[i].STATUSID] = st;
                }
            }
        },
        //筛选数据
        _blownUpView: function () {
            var data = [];
            self = this;
            for (var i = 0; i < this.dataSource.length; i++) {
                //viewStatusAttr = {
                //    startdate: moment(self.options.startdate).add(s1, 'seconds'),
                //    enddate: moment(self.options.startdate).add(s2, 'seconds'),
                //    timedepth: s2 - s1
                //};
                var S1 = self.viewStatusAttr.startdate;
                var S2 = self.viewStatusAttr.enddate;
                var S = moment(this.dataSource[i].START);
                var E = moment(this.dataSource[i].END);
                if (E.isAfter(S1) && (S.isBefore(S2) || S.isSame(S2))) {
                    data.push(this.dataSource[i]);
                }
            }
            return data;
        },
        drawAxis: function () {
            //最小720px 1px=2min;720px 最小间距为2小时（7200秒）
            //eg:24小时刻度线最小间距为2小时
            //按班次长度算出最小的间距  minlength:  
            //公式：
            //   86400       7200
            //  -------  =  ------
            // timedepth      X
            var minlength = 0;
            minlength = this.options.timedepth * 7200 / 86400;
            var Multiple = Math.floor((this.options.width - this.options.padding * 2) / 720);
            var Decimal = ((this.options.width - this.options.padding * 2) / 720 - Multiple) < 0.5 ? 0 : 0.5;
            var tickInterval = minlength / (Multiple + Decimal);//刻度线时间间隔（秒）
            var tickIntervalPx = tickInterval / this.resolution; //转换到像素间距
            var tickCount = this.options.timedepth / tickInterval;//刻度线条数
            var stime = 0;//时间起始值
            if (this.options.type == "shift") {
                var tdate = moment(this.options.shiftstartdate);
                stime = tdate.get("hour") * 3600 + tdate.get("minute") * 60 + tdate.get("second");
            }
            this.ticks = [];//刻度线集合
            for (var i = 0; i <= tickCount; i++) {
                var totaltime = (tickInterval * i + stime) > 86400 ? (tickInterval * i + stime) - 86400 : (tickInterval * i + stime)
                var hh = Math.floor(totaltime / 3600);
                var mm = Math.floor((totaltime - hh * 3600) / 60);
                var strtime = this._formate(hh) + ":" + this._formate(mm);//将秒转换成字符形式(02:00)
                this.ticks.push(this.paper.text(this.options.padding + tickIntervalPx * i, this.options.height - 6, strtime)
             .attr("font-size", 12)
             .attr("font-family", "Arial")
             .attr("stroke", "#000000")
             .attr("stroke-width", 0));
            }
            var self = this;
            this.paper.rect(this.options.padding, this.options.height - 15, tickIntervalPx * tickCount, this.options.height - 15, 0).attr({
                "stroke": "#1F262D",
                "stroke-width": 0,
                "fill": "#ff0000",
                "fill-opacity": 0
            }).data("element", this.element).data('mac_no', this.options.mac_no).mousedown(function (e) {
                var rr = this;
                self.selec_x = e.clientX - $(this.data("element")).offset().left;
                self.selectStatus = true;
                //清除self.selected
                if (self.selected != undefined) {
                    self.selected.remove();
                    self.selected_left.remove();
                    self.selected_right.remove();
                }
                self.selected = self.paper.path("M" + self.selec_x + " 0l0 0l0 " + (self.options.height - 15) + "l-0 0z").data('mac_no', this.data('mac_no'))
                         .attr({
                             "stroke-width": 0,
                             "fill": "#000000",
                             "fill-opacity": 0.5
                         })
                         .drag(function (dx, dy, event) {
                             var x = this.data("x") + dx;
                             var height = this.getBBox().height;
                             var width = this.getBBox().width;
                             if (self.options.padding <= x && (x + width) <= (self.options.width - self.options.padding)) {
                                 //selected对象
                                 var newpath = "M" + x + " 0l" + width + " 0l0 " + height + "l" + (0 - width) + " 0z";
                                 self.selected.animate({ path: newpath }, 0, ">");
                                 self.selected_left.animate({ path: "M" + x + " 0l0 " + height }, 0, ">");
                                 self.selected_right.animate({ path: "M" + (x + width) + " 0l0 " + height }, 0, ">");
                             }
                         }, function (x, y, event) {
                             this.data("x", this.getBBox().x);
                         }, function (x, y, event) {
                             this.data("x", this.getBBox().x);
                         })
                         .dblclick(function () {//放大
                             //获取要放大的时间段
                             if (self.viewStatus == 1) {//原始视图状态

                                 var s1 = Math.floor((self.selected_left.getBBox().x - self.options.padding) * self.resolution);
                                 var s2 = Math.floor((self.selected_right.getBBox().x - self.options.padding) * self.resolution);

                                 var data = {
                                     mac_nbr: self.selected.data('mac_no'),
                                     startdate: moment(self.options.startdate).add(s1, 'seconds'),
                                     enddate: moment(self.options.startdate).add(s2, 'seconds')
                                 }
                                 //self.options.select.call(this, data);
                                 //var s1 = (self.selected_left.getBBox().x - self.options.padding) * self.resolution;
                                 //var s2 = (self.selected_right.getBBox().x - self.options.padding) * self.resolution;
                                 //self.viewStatusAttr = {
                                 //    startdate: moment(self.options.startdate).add(s1, 'seconds'),
                                 //    enddate: moment(self.options.startdate).add(s2, 'seconds'),
                                 //    timedepth: s2 - s1
                                 //};
                                 //var data = self._blownUpView();
                                 ////重新画轴
                                 //self.ticks.remove();
                                 ////self.drawAxis();
                                 //self.viewStatus = 2;//放大状态
                             }
                             else {

                             }
                         });
                self.selected_left = self.paper.path("M" + self.selec_x + " 0l0 " + (self.options.height - 15))
                         .attr({
                             "stroke-width": 2,
                             "stroke": "#FF0000",
                             "stroke-opacity": 1,
                             "cursor": "e-resize"
                         }).drag(function (dx, dy, event) {//move
                             //判断左边不能超过右边
                             var x = this.data("x") + dx;
                             if (self.options.padding < x && x < self.selected_right.getBBox().x) {
                                 var y = this.getBBox().height;
                                 this.animate({ path: "M" + x + " 0l0 " + y }, 0, ">");
                                 //selected对象
                                 var selectedWidth = self.selected.data("width") - dx;
                                 var newpath = "M" + x + " 0l" + selectedWidth + " 0l0 " + (self.options.height - 15) + "l" + (0 - selectedWidth) + " 0z";
                                 self.selected.animate({ path: newpath }, 0, ">");
                             }
                         }, function (x, y, event) {//start
                             this.data("x", this.getBBox().x);
                             self.selected.data("width", self.selected.getBBox().width);
                         }, function (x, y, event) {//end
                             this.data("x", 0);
                             self.selected.data("width", 0);
                         });
                self.selected_right = self.paper.path("M" + self.selec_x + " 0l0 " + (self.options.height - 15))
                         .attr({
                             "stroke-width": 2,
                             "stroke": "#FF0000",
                             "stroke-opacity": 1,
                             "cursor": "w-resize"
                         }).drag(function (dx, dy, event) {//move
                             //判断右边不能小于左边
                             var x = this.data("x") + dx;
                             if ((self.options.width - self.options.padding) > x && x > self.selected_left.getBBox().x) {
                                 var y = this.getBBox().height;
                                 this.animate({ path: "M" + x + " 0l0 " + y }, 0, ">");
                                 //selected对象
                                 var selectedWidth = self.selected.data("width") + dx;
                                 var newpath = "M" + self.selected.getBBox().x + " 0l" + selectedWidth + " 0l0 " + (self.options.height - 15) + "l" + (0 - selectedWidth) + " 0z";
                                 self.selected.animate({ path: newpath }, 0, ">");
                             }
                         }, function (x, y, event) {//start
                             this.data("x", this.getBBox().x);
                             self.selected.data("width", self.selected.getBBox().width);
                         }, function (x, y, event) {//end
                             this.data("x", 0);
                             self.selected.data("width", 0);
                         });
            }).mousemove(function (e) {
                if (self.selectStatus) {
                    var newx = e.clientX - self.selec_x - $(this.data("element")).offset().left;
                    var newpath = "M" + self.selec_x + " 0l" + newx + " 0l0 " + (self.options.height - 15) + "l" + (0 - newx) + " 0z";
                    self.selected.animate({ path: newpath }, 200, ">");
                    self.selected_right.animate({ path: "M" + (self.selec_x + newx) + " 0l0 " + (self.options.height - 15) }, 200, ">");
                }
                e.stopPropagation();
            }).mouseup(function (e) {
                self.selectStatus = false;
                e.stopPropagation();
            }).mouseout(function (e) {
                //self.selectStatus = false;
            });
        },
        _formate: function (n) {
            if (n < 10) {
                return "0" + n;
            }
            else {
                return n;
            }
        }
    });
})(jQuery);
//myeditable
(function ($, undefined) {//状态条形图编辑状态备注信息
    $.widget("BZ.myeditable", {
        options: {
            container: "body",
            placement: "left",
            html: true,
            title: "",
            content: "<div>12321321123</div>",
            template: '<div class="popover" role="tooltip" style="max-width:none;"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
            ok: "",
            cancel: "",
            statusID: 0,
            submit: $.noop
        },
        _create: function () {
            var self = this;
            self.element.popover({
                container: self.options.container,
                placement: self.options.placement,
                html: self.options.html,
                title: self.options.title,
                content: self.options.content,
                template: self.options.template
            });
            self.element.popover("show");

            $(".editable-clear-x").click(function () {
                $("#BzEditerText").val();
            });
            $(self.options.ok).click(function () {
                //提交
                var data = {
                    autoid: self.options.statusID,
                    StatusDesc: $("#BzEditerText").val()
                }
                $.post("/statusrate/ModifyStatus", data, function (data) {
                    if (data.Status == 0) {

                    }
                    else {
                        BzAlert(data.Message);
                    }
                    self.destroy();
                    self.element.popover("destroy");
                });
            });
            $(self.options.cancel).click(function () {
                self.destroy();
                self.element.popover("destroy");
            });
        },
        setid: function (id) {
            this.id = id;
        }
    });
})(jQuery);

function addstyle(data) {
    var style = "";
    for (var item in data) {
        style = style + "." + item + "{" + data[item] + "}";
    }
    $("#styles").text(style);
}

function drawcolumn(point, title, subtitle, categories, yAxisName, data, type) {
    $(point).highcharts({
        chart: {
            type: type
        },
        title: {
            text: title
        },
        subtitle: {
            text: subtitle
        },
        xAxis: {
            categories:
              categories

        },
        yAxis: {
            min: 0,
            title: {
                text: yAxisName
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table width="200">',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },

        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: data
    });
}

function drawPieChart(point, title, subtitle, data) {
    $(point).highcharts({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
        },
        title: {
            text: title,
            style: {
                fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                fontWeight: "bold",
                color: "#000"
            },
            y: 30
        },
        subtitle: {
            text: subtitle,
            style: {
                fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                fontWeight: "bold",
                color: "#000"
            },
            y: 50
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
        credits: {
            enabled: false
        },
        series: data
    });
}

(function ($, undefined) {
    $.widget("BZ.CombinationChart", {
        options: {
            title: "",
            subtitle: "",
            height: 500,
            stacking: null,
            dataSource: [],
            yAxistile: ""
        },
        _create: function () {
            var self = this;
            this.chartOptions = {
                chart: {
                    renderTo: this.element[0].id,
                    margin: 75,
                    height: this.options.height,
                },
                title: {
                    text: this.options.title,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 30
                },
                subtitle: {
                    text: this.options.subtitle,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#000"
                    },
                    y: 50
                },
                credits: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: this.options.yAxistile,
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#000"
                        }
                    },
                    min: 0
                },
                xAxis: {
                    categories: this.options.categories,
                    title: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            color: "#000"
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        var s;
                        s = '' +
                            this.x + ': ' + this.y;
                        return s;
                    }
                },
                plotOptions: {
                    column: {
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            }
                        }
                    },
                },
                series: this.options.dataSource
            }
            this.chart = new Highcharts.Chart(this.chartOptions);
        },
        _showValues: function () {
        },
        _hideValues: function () {
        },
        destroy: function () {
            this.chart.destroy();
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);

(function ($, undefined) {
    $.widget("BZ.TimeAnalysisPieChart", {
        _create: function () {
            var self = this;
            this.chartOptions = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: this.options.title,
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
                series: this.options.dataSource
            }
            this.chart = new Highcharts.Chart(this.chartOptions);
        },
        _showValues: function () {
        },
        _hideValues: function () {
        },
        destroy: function () {
            this.chart.destroy();
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);

(function ($, undefined) {
    $.widget("BZ.ReasonPerChart", {
        options: {
            title: "",
            subtitle: "",
            height: 500,
            stacking: null,
            dataSource: [],
            yAxistile: "",
            categories: []
        },
        _create: function () {
            var self = this;
            this.chartOptions = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: this.option.title
                },
                xAxis: {
                    categories: this.option.categories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: this.option.yAxistile
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -70,
                    verticalAlign: 'top',
                    y: 20,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        }
                    }
                },
                series: this.options.dataSource
            }
            this.chart = new Highcharts.Chart(this.chartOptions);
        },
        _showValues: function () {
        },
        _hideValues: function () {
        },
        destroy: function () {
            this.chart.destroy();
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);

//工单概况
(function ($, undefined) {
    $.widget("BZ.orderSurvey", {
        options: {
            width: 720,
            height: 150,
            timedepth: 86400,
            padding: 50,
            three: true,
            url: null,
            startdate: new Date(),//放大视图时使用
            shiftstartdate: new Date(),
            filter: false,
            select: $.noop,
            dataSource: [],
            type: "day"//day or shift
        },
        _create: function () {
            var id = this.element[0].id;
            //根据数据源计算画板高度
            var bar_num = 0;
            for (var i = 0; i < this.options.dataSource.Tasklist.length; i++) {
                for (var j = 0; j < this.options.dataSource.Tasklist[i].TaskRecordlist.length; j++) {
                    bar_num++;
                }
                bar_num++;
            }
            this.options.height = (bar_num + 1) * 30 + bar_num * 10 + 30;
            this.paper = Raphael(id, this.options.width, this.options.height + 30);
            //this.paper.rect(0, 0, this.options.width, this.options.height  + 20 - 2).attr({
            //    "stroke": "#ff0000",
            //    "stroke-width": 1,
            //    "transform": "t0.5,0.5"
            //});
            
            //计算enddate；如果工序没有结束，取当前时间；否则取工序最大时间和计划结束时间的最大值
            this.max_date = null;
            this.min_date = null;
            //for (var a = 0; a < this.options.dataSource.Tasklist.length; a++) {
            //    if (this.options.dataSource.Tasklist[a].END_DATE == null) {
            //        max_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            //        break;
            //    }
            //}
            if (this.max_date == null) {
                for (var a = 0; a < this.options.dataSource.Tasklist.length - 1; a++) {
                    if (moment(this.options.dataSource.Tasklist[a].END_DATE).isBefore(this.options.dataSource.Tasklist[a+1].END_DATE)) {
                        this.max_date = this.options.dataSource.Tasklist[a + 1].END_DATE;
                    }
                    else {
                        this.max_date = this.options.dataSource.Tasklist[a].END_DATE;
                    }

                }
            }

            if (this.min_date == null) {
                for (var a = 0; a < this.options.dataSource.Tasklist.length - 1; a++) {
                    if (moment(this.options.dataSource.Tasklist[a].START_DATE).isBefore(this.options.dataSource.Tasklist[a + 1].START_DATE)) {
                        this.min_date = this.options.dataSource.Tasklist[a].START_DATE;
                    }
                    else {
                        this.min_date = this.options.dataSource.Tasklist[a + 1].START_DATE;
                    }

                }
            }

            if (this.max_date != null) {
                if (moment(this.options.enddate_plan).isBefore(this.max_date)) {
                    this.max_date = this.max_date;
                }
                else {
                    this.max_date = this.options.enddate_plan;
                }
            }
            else {
                this.max_date = this.options.enddate_plan;
            }
            if (this.min_date != null) {
                if (moment(this.options.startdate_plan).isBefore(this.min_date)) {
                    this.min_date = this.options.startdate_plan;
                }
                else {
                    this.min_date = this.min_date;
                }
            }
            else {
                this.min_date = this.options.startdate_plan;
            }
            this.options.timedepth = moment(this.max_date).diff(moment(this.min_date), 'seconds');
            //计算分辨率:1px=多少秒
            this.resolution = parseFloat((this.options.timedepth / (this.options.width - this.options.padding * 2)).toFixed(2));
            //绘制坐标轴"|_______________________________________________________"
            this.paper.path("M" + this.options.padding + " 5l0 " + (this.options.height - 15) + "l" + (this.options.width - this.options.padding * 2) + " 0").attr({
                "stroke": "#000000",
                "stroke-width": 1,
                "transform": "t0.5,0.5"
            });

            //绘制起始日期与结束日期
            var x = this._timeToPx(this.options.startdate_plan, this.min_date);
            this.paper.path("M" + x + " " + (this.options.height - 10) + "l0 5").attr({
                "stroke": "#000000",
                "stroke-width": 1,
                "transform": "t0.5,0.5"
            });
            var str_startdate_plan = moment(this.options.startdate_plan).format('YYYY/MM/DD') + "\n" + moment(this.options.startdate_plan).format('HH:mm:ss');
            this.paper.text(x, this.options.height + 20 - 10, str_startdate_plan)
                .attr({
                    "font-size": 12,
                    "font-family": "Arial",
                    "stroke": "#000000",
                    "stroke-width": 0,
                    "text-anchor": "center"
                });

            var x = this._timeToPx(this.options.enddate_plan, this.min_date);
            this.paper.path("M" + x + " " + (this.options.height - 10) + "l0 5").attr({
                "stroke": "#000000",
                "stroke-width": 1,
                "transform": "t0.5,0.5"
            });
            var str_enddate_plan = moment(this.options.enddate_plan).format('YYYY/MM/DD') + "\n" + moment(this.options.enddate_plan).format('HH:mm:ss');

            this.paper.text(x, this.options.height + 20 - 10, str_enddate_plan)
                .attr({
                    "font-size": 12,
                    "font-family": "Arial",
                    "stroke": "#000000",
                    "stroke-width": 0,
                    "text-anchor": "center"
                });
            this._drawbar();
        },
        _template: function (data) {
            var message = ' <form class="form-horizontal" style="min-width: 192px;padding-top:0px;">';
            $.each(data, function (a, b) {
                message = message + '<div class="control-group" style="margin-bottom: 0px;">' +
                                                '<label class="control-label callout-control-label">' + a + '：</label>' +
                                                '<div class="controls controls-control-label">' +
                                                     '<span>' + b + '</span>' +
                                                '</div>' +
                                            '</div>';
            })
            message = message + '<form>';
            return message;
        },
        _drawbar: function () {
            var self = this;
            var barheight = 30;
            var barmargin = 10;
            var bar_num = 0;
            var st = self.paper.set();
            self.tempArray = [];//[self.options.padding];
            for (var i = 0; i < self.options.dataSource.Tasklist.length; i++) {
                //绘制工序
                var x = moment(self.options.dataSource.Tasklist[i].START_DATE).diff(moment(self.min_date), 'seconds') / self.resolution + self.options.padding;
                var y = 10 + bar_num * (barheight + barmargin);
                var w = moment(self.options.dataSource.Tasklist[i].END_DATE).diff(moment(self.options.dataSource.Tasklist[i].START_DATE), 'seconds') / self.resolution;
                var h = barheight;
                self.paper.rect(x, y, w, h).attr({
                    "stroke": "#000000",
                    "stroke-width": 1,
                    "transform": "t0.5,0.5",
                    "fill": "#50AFD8"
                })
                    .data("id", i)
                    .data("Element", self.element)
                    .mouseover(function () {
                        $("#ms").remove()
                        var message;
                        var status;
                        var str_startdate, str_enddate;
                        if (self.options.dataSource.Tasklist[parseInt(this.data("id"))].PROCESS_STATUS == 0) {
                            status = "准备";
                            str_startdate = "-- --";
                            str_enddate = "-- --";
                        }
                        else if (self.options.dataSource.Tasklist[parseInt(this.data("id"))].PROCESS_STATUS == 1) {
                            status = "进行中";
                            str_startdate = moment(self.options.dataSource.Tasklist[parseInt(this.data("id"))].START_DATE).format('YYYY-MM-DD HH:mm:ss');
                            str_enddate = "-- --";
                        }
                        else if (self.options.dataSource.Tasklist[parseInt(this.data("id"))].PROCESS_STATUS == 2) {
                            status = "完成";
                            str_startdate = moment(self.options.dataSource.Tasklist[parseInt(this.data("id"))].START_DATE).format('YYYY-MM-DD HH:mm:ss');
                            str_enddate = moment(self.options.dataSource.Tasklist[parseInt(this.data("id"))].END_DATE).format('YYYY-MM-DD HH:mm:ss');
                        }
                        var process_status = self.options.dataSource.Tasklist[parseInt(this.data("id"))].PROCESS_STATUS;
                        var tjson = {
                            "工单": self.options.dataSource.Tasklist[parseInt(this.data("id"))].TASK_NO,
                            "工序编号": self.options.dataSource.Tasklist[parseInt(this.data("id"))].PROC_NO,
                            "工序名称": self.options.dataSource.Tasklist[parseInt(this.data("id"))].PROC_NAME,
                            "工序状态": status,
                            "开始日期": str_startdate,
                            "结束日期": str_enddate,
                            "持续时间": self._Seconds2String(self.options.dataSource.Tasklist[parseInt(this.data("id"))].DURATION)
                        };

                        $("#display").jCallout({
                            message: self._template(tjson),
                            position: "top",
                            id: "ms"
                        });
                        var top, left;
                        top = $(this.data("Element")).offset().top + this.attrs.y;
                        left = $(this.data("Element")).offset().left + this.attrs.x + this.attrs.width / 2 - $("#ms").width() / 2;// + 10;

                        $("#ms").css({
                            //"top": (rect.attrs.y + rect.attrs.height + 20) + "px",
                            "z-index": 50,
                            "top": (top - 180) + "px",
                            "left": left + "px"
                        });
                        //$(".notch_top").css({ "top": "-10px" });

                        //$("#ms").css({
                        //    //"top": (rect.attrs.y + rect.attrs.height + 20) + "px",
                        //    "z-index": 50,
                        //    "top": top + "px",
                        //    "left": left + "px"
                        //});
                        //$(".notch_right").css({ "top": "5px" });


                    }).mouseout(function () {
                        $("#ms").remove()
                    });
                //绘制工序名称
                var path = 'M' + self.options.padding + " " + (y + barheight / 2) + "l" + (x - self.options.padding) + " 0";
                self.paper.path(path).attr({
                    "stroke": "#cecece",
                    "stroke-width": 1,
                    "stroke-dasharray": "--",
                    "transform": "t0.5,0.5"
                });
                self.paper.text(self.options.padding - 2, y + barheight / 2, self.options.dataSource.Tasklist[i].PROC_NO).attr({
                    "font-size": 12,
                    "font-family": "Arial",
                    "stroke": "#000000",
                    "stroke-width": 0,
                    "text-anchor": "end"
                });
                //绘制工序的开始、结束标准线
                var linex1 = self._timeToPx(self.options.dataSource.Tasklist[i].START_DATE, self.min_date);
                var linex2 = self._timeToPx(self.options.dataSource.Tasklist[i].END_DATE, self.min_date);

                if (linex2 > linex1) { //过滤无效数据
                    st.push(self.paper.path("M" + linex1 + " " + (y + h) + "L" + linex1 + " " + (self.options.height - 12)).attr({
                        "stroke": "#0000ff",
                        "stroke-width": 1,
                        "stroke-dasharray": "--",
                        "transform": "t0.5,0.5"
                    }));
                    st.push(self.paper.path("M" + linex2 + " " + (y + h) + "L" + linex2 + " " + (self.options.height - 12)).attr({
                        "stroke": "#0000ff",
                        "stroke-width": 1,
                        "stroke-dasharray": "--",
                        "transform": "t0.5,0.5"
                    }));
                }
                //tempArray
                if (i == 0) {
                    self.tempArray.push(linex2);
                }
                else if (i > 0 && i < self.options.dataSource.Tasklist.length - 2) {
                    self.tempArray.push(linex1);
                    self.tempArray.push(linex2);
                }
                
                if (i == self.options.dataSource.Tasklist.length - 1) {
                    self.tempArray.push(linex1);
                }
                for (var j = 0; j < self.options.dataSource.Tasklist[i].TaskRecordlist.length; j++) {
                    bar_num++;



                    //绘制状态
                    for (var k = 0; k < self.options.dataSource.Tasklist[i].TaskRecordlist[j].SourceStatuslist.length; k++) {
                        var x = self._timeToPx(self.options.dataSource.Tasklist[i].TaskRecordlist[j].SourceStatuslist[k].START_DATE, self.min_date);
                        var y = 10 + bar_num * (barheight + barmargin);
                        var w = self._timeToPx(self.options.dataSource.Tasklist[i].TaskRecordlist[j].SourceStatuslist[k].END_DATE, self.min_date) - x;
                        var h = barheight;
                        self.paper.rect(x, y, w, h).attr({
                            "stroke": "#000000",
                            "stroke-width": 0,
                            "transform": "t0.5,0.5",
                            "fill": self.options.dataSource.Tasklist[i].TaskRecordlist[j].SourceStatuslist[k].STATUS_COLOR
                        });
                    }
                    //绘制设备
                    var x = moment(self.options.dataSource.Tasklist[i].TaskRecordlist[j].START_DATE).diff(moment(self.min_date), 'seconds') / self.resolution + self.options.padding;
                    var y = 10 + bar_num * (barheight + barmargin);
                    var w = moment(self.options.dataSource.Tasklist[i].TaskRecordlist[j].END_DATE).diff(moment(self.options.dataSource.Tasklist[i].TaskRecordlist[j].START_DATE), 'seconds') / self.resolution;
                    var h = barheight;

                    //设备名称
                    self.paper.text(x - 2, y + barheight / 2, self.options.dataSource.Tasklist[i].TaskRecordlist[j].MAC_NO).attr({
                        "font-size": 12,
                        "font-family": "Arial",
                        "stroke": "#000000",
                        "stroke-width": 0,
                        "text-anchor": "end"
                    });
                    self.paper.rect(x, y, w, h).attr({
                        "stroke": "#000000",
                        "stroke-width": 1,
                        "fill-opacity": 0,
                        "transform": "t0.5,0.5",
                        "fill": "#FFFFFF"
                    })
                        .data("pid", i)
                        .data("id", j)
                        .data("Element", self.element)
                        .mouseover(function () {
                            var mac = self.options.dataSource.Tasklist[parseInt(this.data("pid"))].TaskRecordlist[this.data("id")];
                            var tjson = {
                                "设备编号": mac.MAC_NO,
                                "设备名称": mac.MAC_NAME,
                                "开始时间": moment(mac.START_DATE).format('YYYY-MM-DD HH:mm:ss'),
                                "结束时间": moment(mac.END_DATE).format('YYYY-MM-DD HH:mm:ss'),
                                "持续时间": self._Seconds2String(mac.DURATION),
                                "投料量": mac.INPUT_NUM,
                                "目标量": mac.TARGET_NUM,
                                "产出": mac.YIELD,
                                "完成率": ((mac.YIELD / mac.TARGET_NUM) * 100).toFixed(1) + "%",
                                "正品": mac.QUALIFIED_NUM,
                                "次品": mac.INFERIOR_NUM,
                                "质量率": (mac.QUALIFIED_NUM / (mac.QUALIFIED_NUM + mac.INFERIOR_NUM) * 100).toFixed(1) + "%",
                                "操作人员": mac.MEM_NAMES
                            };
                            $("#display").jCallout({
                                message: self._template(tjson),
                                position: "top",
                                id: "ms"
                            });
                            var top, left;
                            top = $(this.data("Element")).offset().top + this.attrs.y;
                            left = $(this.data("Element")).offset().left + this.attrs.x + this.attrs.width / 2 - $("#ms").width() / 2;
                            $("#ms").css({
                                //"top": (rect.attrs.y + rect.attrs.height + 20) + "px",
                                "z-index": 50,
                                "top": (top - 300) + "px",
                                "left": left + "px"
                            });
                            //$(".notch_right").css({ "top": "5px" });
                        }).mouseout(function () {
                            $("#ms").remove()
                        });
                }
                bar_num++;


            }
            //绘制准备用时

            if (self.options.startdate_plan == self.min_date) {
                var min_process_startdate;//最小的工序开始时间
                for (var k = 0; k < self.options.dataSource.Tasklist.length; k++) {
                    if (moment(min_process_startdate).isBefore(this.options.dataSource.Tasklist[k].START_DATE)) {
                        min_process_startdate = min_process_startdate;
                    }
                    else {
                        min_process_startdate = this.options.dataSource.Tasklist[k].START_DATE;
                    }
                }
                var x1 = self._timeToPx(self.min_date, self.min_date);
                var x2 = self._timeToPx(min_process_startdate, self.min_date);
                self.paper.rect(x1, 10 + bar_num * (barheight + barmargin), x2 - x1, barheight).attr({
                    "stroke": "#000000",
                    "stroke-width": 0,
                    "transform": "t0.5,0.5",
                    "fill": "#F4AC04"
                });
            }
            for (var i = 0; i < self.tempArray.length / 2; i++) {
                var x1 = self.tempArray[2 * i];
                var x2 = self.tempArray[2 * i + 1];
                if (x2 > x1) {
                    self.paper.rect(x1, 10 + bar_num * (barheight + barmargin), x2 - x1, barheight).attr({
                        "stroke": "#000000",
                        "stroke-width": 0,
                        "transform": "t0.5,0.5",
                        "fill": "#000000"
                        //"fill": (i == 0 ? "#F4AC04" : "#000000")
                    });
                }
            }
            st.toFront();
            //绘制准备用时与等待用时
            //var x = moment(self.options.dataSource.PROCESS_LIST[i].MACS[j].START_DATE).diff(moment(self.options.dataSource.PLAN_START), 'seconds') / self.resolution + self.options.padding;
            //var y = 10 + bar_num * (barheight + barmargin);
            ////var w = moment(self.options.dataSource.PROCESS_LIST[i].MACS[j].END_DATE).diff(moment(self.options.dataSource.PROCESS_LIST[i].MACS[j].START_DATE), 'seconds') / self.resolution;
            //var h = barheight;
            //self.paper.rect(100, y, 1200, h).attr({
            //    "stroke": "#000000",
            //    "stroke-width": 1,
            //    "transform": "t0.5,0.5",
            //    "fill": "#FFFFFF"
            //});
        },
        //date2==基准时间点
        _timeToPx: function (date1, date2) {
            var self = this;
            return moment(date1).diff(date2, 'seconds') / self.resolution + self.options.padding;
        },
        _formate: function (n) {
            if (n < 10) {
                return "0" + n;
            }
            else {
                return n;
            }
        },
        _Seconds2String: function (time) {
            var h = Math.floor(time / 3600);
            var m = Math.floor((time - h * 3600) / 60); 
            var s = (time - h * 3600) % 60;
            return this._formate(h) + ":" + this._formate(m) + ":" + this._formate(s);
        },
        destroy: function () {
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);