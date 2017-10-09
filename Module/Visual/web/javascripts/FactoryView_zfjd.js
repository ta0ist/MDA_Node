var drawFactoryView = function(paper, id) {
    paper.image("./Visual/web/image/兆丰机电.png", 0, 0, 1360, 680);
    return {
        "B006": {
            MAC: paper.path('M797.332,350.667v25.667h-16v-25.667H797.332z').attr({
                "fill": "#B8BBBD", //B8BBBD
                "stroke-width": 0,
                "fill-opacity": 1,
                "stroke": "#FFFFFF"
            }),
            MACHINE: paper.path('M841.5,427.5l-10,98.5l-70,49L714,527.5v-99l75.332-48L841.5,427.5  z').attr({
                "fill": "#000000",
                "stroke-width": 0,
                "stroke": "#ffffff",
                "fill-opacity": 0.1
            }).data('id', 15).click(function() {
                alert(this.data().id);
            }).hover(function() {
                var path = this;
                path.attr({
                    "fill": "#FFFFFF",
                    "fill-opacity": 1
                });
                $("#ms").remove();
                ZFJD_getAttr(15, path, -200, 100)
            }, function() {
                $("#ms").remove();
                this.attr({
                    "fill": "#B8BBBD",
                    "fill-opacity": 0
                });
            })
        },
        "B001": {
            MAC: paper.path('M480.295,47.189l0.652,21.323l-13.646,0.42l-0.654-21.323L480.295,47.189z').attr({
                "fill": "#B8BBBD", //B8BBBD
                "stroke-width": 0,
                "fill-opacity": 1,
                "stroke": "#FFFFFF"
            }),
            MACHINE: paper.path('M438.5,53l65.182-30L540,53l7.5,99.5l-54.5,24l-41-24L438.5,53z').attr({
                "fill": "#000000",
                "stroke-width": 0,
                "stroke": "#ffffff",
                "fill-opacity": 0.1
            }).data('id', 10).click(function() {
                var path = this;
            }).hover(function() {
                var path = this;
                path.attr({
                    "fill": "#FFFFFF",
                    "fill-opacity": 1
                });
                $("#ms").remove();
                ZFJD_getAttr(10, path, 0, -400);
                // $.get('/visuals/r/GetImmediatelyparameterByZF', {
                //     machineIds: path.data().id
                // }, function(data) {
                //     if (data.Status == 0)
                //showP(data.Data, path[0].getBBox().y, path[0].getBBox().x, path.data().id);
                // })
            }, function() {
                $("#ms").remove();
                this.attr({
                    "fill": "#B8BBBD",
                    "fill-opacity": 0
                });
            })
        },
        "B002": {
            MAC: paper.path('M652,102.333v21.676h-14v-21.676H652z').attr({
                "fill": "#B8BBBD", //B8BBBD
                "stroke-width": 0,
                "fill-opacity": 1,
                "stroke": "#FFFFFF"
            }),
            MACHINE: paper.path('M694.999,113.171V213.5L645,241l-59.334-47L582.5,90.5l49.5-25  L694.999,113.171z').attr({
                "fill": "#000000",
                "stroke-width": 0,
                "stroke": "#ffffff",
                "fill-opacity": 0.1
            }).data('id', 11).click(function() {
                alert(this.data().id);
            }).hover(function() {
                var path = this;
                path.attr({
                    "fill": "#FFFFFF",
                    "fill-opacity": 1
                });
                $("#ms").remove();
                ZFJD_getAttr(11, path, -300, -360)
            }, function() {
                $("#ms").remove();
                this.attr({
                    "fill": "#B8BBBD",
                    "fill-opacity": 0
                });
            })
        },
        "B003": {
            MAC: paper.path('M813.332,211v24.339h-14.666V211H813.332z').attr({
                "fill": "#B8BBBD", //B8BBBD
                "stroke-width": 0,
                "fill-opacity": 1,
                "stroke": "#FFFFFF"
            }),
            MACHINE: paper.path('M855.5,218.501V320l-58.168,27.5L741,303l4.5-100.5l51.832-30  L855.5,218.501z').attr({
                "fill": "#000000",
                "stroke-width": 0,
                "stroke": "#ffffff",
                "fill-opacity": 0.1
            }).data('id', 12).click(function() {
                alert(this.data().id);
            }).hover(function() {
                var path = this;
                path.attr({
                    "fill": "#FFFFFF",
                    "fill-opacity": 1
                });
                $("#ms").remove();
                ZFJD_getAttr(12, path, -300, -260);

            }, function() {
                $("#ms").remove();
                this.attr({
                    "fill": "#B8BBBD",
                    "fill-opacity": 0
                });
            })
        },
        "B004": {
            MAC: paper.path('M883.51,263.822l-1.064,24.494l-15.623-0.679l1.063-24.493L883.51,263.822z').attr({
                "fill": "#B8BBBD", //B8BBBD
                "stroke-width": 0,
                "fill-opacity": 1,
                "stroke": "#FFFFFF"
            }),
            MACHINE: paper.path('M928.073,270.26l-11.5,89.334l-55,34.666l-56-37.5l7.5-100.5  l52.5-31.521L928.073,270.26z').attr({
                "fill": "#000000",
                "stroke-width": 0,
                "stroke": "#ffffff",
                "fill-opacity": 0.1
            }).data('id', 13).click(function() {
                alert(this.data().id);
            }).hover(function() {
                var path = this;
                path.attr({
                    "fill": "#FFFFFF",
                    "fill-opacity": 1
                });
                $("#ms").remove();
                ZFJD_getAttr(13, path, -300, -160)

            }, function() {
                $("#ms").remove();
                this.attr({
                    "fill": "#B8BBBD",
                    "fill-opacity": 0
                });
            })
        },
        "B005": {
            MAC: paper.path('M904.487,288.877l-1.012,23.295l-15.936-0.692l1.013-23.294L904.487,288.877z').attr({
                "fill": "#B8BBBD", //B8BBBD
                "stroke-width": 0,
                "fill-opacity": 1,
                "stroke": "#FFFFFF"
            }),
            MACHINE: paper.path('M946.5,363.5l-17.5,98l-90.5,62L797.332,483V380.5L893,320  L946.5,363.5z').attr({
                "fill": "#000000",
                "stroke-width": 0,
                "stroke": "#ffffff",
                "fill-opacity": 0.1
            }).data('id', 14).click(function() {
                alert(this.data().id);
            }).hover(function() {
                var path = this;
                path.attr({
                    "fill": "#FFFFFF",
                    "fill-opacity": 1
                });
                $("#ms").remove();
                ZFJD_getAttr(14, path, -300, 0)

            }, function() {
                $("#ms").remove();
                this.attr({
                    "fill": "#B8BBBD",
                    "fill-opacity": 0
                });
            })
        },

        "B007": {
            MAC: paper.path('M600,207.333v22.337h-14.334v-22.337H600z').attr({
                "fill": "#B8BBBD", //B8BBBD
                "stroke-width": 0,
                "fill-opacity": 1,
                "stroke": "#FFFFFF"
            }),
            MACHINE: paper.path('M652,283v101.5l-55,32l-49.5-48l-11.002-103L597,235.339L652,283z').attr({
                "fill": "#000000",
                "stroke-width": 0,
                "stroke": "#ffffff",
                "fill-opacity": 0.1
            }).data('id', 16).click(function() {
                alert(this.data().id);
            }).hover(function() {
                var path = this;
                path.attr({
                    "fill": "#FFFFFF",
                    "fill-opacity": 1
                });
                $("#ms").remove();
                ZFJD_getAttr(16, path, -200, 100)

            }, function() {
                $("#ms").remove();
                this.attr({
                    "fill": "#B8BBBD",
                    "fill-opacity": 0
                });
            })
        },
        "B008": {
            MAC: paper.path('M543.387,158.124l0.549,22.33l-14.326,0.354l-0.549-22.33L543.387,158.124z').attr({
                "fill": "#B8BBBD", //B8BBBD
                "stroke-width": 0,
                "fill-opacity": 1,
                "stroke": "#FFFFFF"
            }),
            MACHINE: paper.path('M590.5,229.482v102.275L537.285,364l-47.894-48.365  l-10.645-103.786l58.538-30.391L590.5,229.482z').attr({
                "fill": "#000000",
                "stroke-width": 0,
                "stroke": "#ffffff",
                "fill-opacity": 0.1
            }).data('id', 17).click(function() {
                alert(this.data().id);
            }).hover(function() {
                var path = this;
                path.attr({
                    "fill": "#FFFFFF",
                    "fill-opacity": 1
                });
                $("#ms").remove();
                ZFJD_getAttr(17, path, 0, -200);

            }, function() {
                $("#ms").remove();
                this.attr({
                    "fill": "#B8BBBD",
                    "fill-opacity": 0
                });
            })
        },
        "B009": {
            MAC: paper.path('M516.664,97.624l0.654,21.323l-12.982,0.4l-0.654-21.323L516.664,97.624z').attr({
                "fill": "#B8BBBD", //B8BBBD
                "stroke-width": 0,
                "fill-opacity": 1,
                "stroke": "#FFFFFF"
            }),
            MACHINE: paper.path('M540,181.246v97.513L487.054,309.5l-47.651-46.113l-10.591-98.953  l58.242-28.976L540,181.246z').attr({
                "fill": "#000000",
                "stroke-width": 0,
                "stroke": "#ffffff",
                "fill-opacity": 0.1
            }).data('id', 18).click(function() {
                alert(this.data().id);
            }).hover(function() {
                var path = this;
                path.attr({
                    "fill": "#FFFFFF",
                    "fill-opacity": 1
                });
                $("#ms").remove();
                ZFJD_getAttr(18, path, 0, -200)

            }, function() {
                $("#ms").remove();
                this.attr({
                    "fill": "#B8BBBD",
                    "fill-opacity": 0
                });
            })
        }

    }

}

function showP(data, top, left, id) {
    let para = {};
    data.forEach(function(v, i) {
        switch (v.Name) {
            case 'STD::Status':
                para.STATUS_NBR = v.Value;
                break;
            case 'STD::DURATION':
                para.DURATION = v.Value;
                break;
            case 'STD::Program':
                para.PROGRAME_NAME = v.Value;
                break;
            case 'STD::AlarmNo':
                para.WARNING_CODE = v.Value;
                break;
            case 'STD::SpindleSpeed':
                para.SPINDLESPEED = v.Value;
                break;
            case 'STD::SpindleOverride':
                para.SPINDLEOVERRIDE = v.Value;
                break;
            case 'STD::FeedSpeed':
                para.FEEDSPEED = v.Value;
                break;
            case 'STD::FeedOverride':
                para.FEEDOVRRIDE = v.Value;
                break;
            case 'STD::YieldCounter':
                para.YieldCounter = v.Value;
                break;
        }
    })
    var message = ' <form class="form-horizontal" style="min-width: 260px;padding:10px;">' +
        '<div class="control-group clearfix" style="margin-bottom: 10px;">' +
        '<label class="control-label callout-control-label pull-left">' + "状态名称:" + '</label>' +
        '<div class="controls  pull-left" style="margin-left:20px;">' +
        '<span>' + para.STATUS_NAME + '</span>' +
        '</div>' + '</div>' + '<div class="control-group clearfix" style="margin-bottom: 10px;">' +
        '<label class="control-label callout-control-label pull-left"">' + "持续时间:" + '</label>' +
        '<div class="controls pull-left" style="margin-left:20px;">' +
        '<span>' + para.DURATION + '</span>' +
        '</div>' + '</div>' + '<div class="control-group clearfix" style="margin-bottom: 10px;">' +
        '<label class="control-label callout-control-label pull-left"">' + "程序号:" + '</label>' +
        '<div class="controls pull-left" style="margin-left:20px;">' +
        '<span>' + para.PROGRAME_NAME + '</span>' +
        '</div>' + '</div>' +
        '<div class="control-group clearfix" style="margin-bottom: 10px;">' +
        '<label class="control-label callout-control-label pull-left"">' + "主轴倍率:" + '</label>' +
        '<div class="controls pull-left" style="margin-left:20px;">' +
        '<span>' + para.SPINDLEOVERRIDE + '</span>' +
        '</div>' + '</div>' +
        '<div class="control-group clearfix" style="margin-bottom: 10px;">' +
        '<label class="control-label callout-control-label pull-left"">' + "主轴倍率:" + '</label>' +
        '<div class="controls pull-left " style="margin-left:20px;">' +
        '<span>' + para.SPINDLEOVERRIDE + '</span>' +
        '</div>' + '</div>' +
        '<div class="control-group clearfix" style="margin-bottom: 10px;">' +
        '<label class="control-label callout-control-label pull-left"">' + "进给倍率:" + '</label>' +
        '<div class="controls pull-left" style="margin-left:20px;">' +
        '<span>' + para.FEEDOVRRIDE + '</span>' +
        '</div>' + '</div>' +
        '<div class="control-group clearfix" style="margin-bottom: 10px;">' +
        '<label class="control-label callout-control-label pull-left"">' + "进给速度:" + '</label>' +
        '<div class="controls pull-left" style="margin-left:20px;">' +
        '<span>' + para.FEEDSPEED + '</span>' +
        '</div>' + '</div>' + '</form>';
    $("#display").jCallout({
        message: message,
        position: "left",
        id: "ms"
    });
    $("#ms").css({ "display": "block" });
    $("#ms").css({
        "position": "relative",
        "z-index": 50,
        "top": -500 - top + "px",
        "left": left + 'px',
        width: '250px',
        borderRadius: '5px'
    });
    // $("#ms .control-group").css({
    //     float: 'left'
    // })
}


function ZFJD_getAttr(mac_nbr, path, x, y) {
    var url = "/visuals/r/ZFJD_getAttr?mac_nbr=" + mac_nbr;
    $.get(url, function(data) {
        if (!data.isEmpty) {
            showP(data.machineitems, path[0].getBBox().y - y, path[0].getBBox().x - x, path.data().id)
        }
    })
}