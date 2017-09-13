var drawFactoryView = function(paper, id) {
    paper.image("./Visual/web/image/兆丰机电.png", 0, 0, 1360, 680);
    return {
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
                $.get('/diagnosis/r/GetImmediatelyparameterByZF', {
                    machineIds: path.data().id
                }, function(data) {
                    if (data.Status == 0)
                        showP(data.Data, path[0].getBBox().y, path[0].getBBox().x, path.data().id);
                })
            }).hover(function() {
                var path = this;
                path.attr({
                    "fill": "#FFFFFF",
                    "fill-opacity": 1
                });
                $("#ms").remove();
            }, function() {
                $("#ms").remove();
                this.attr({
                    "fill": "#B8BBBD",
                    "fill-opacity": 0
                });
            })
        },
        "B002": {
            MAC: paper.path('M707.334,179.667h23.999v35h-23.999V179.667z').attr({
                "fill": "#B8BBBD", //B8BBBD
                "stroke-width": 0,
                "fill-opacity": 1,
                "stroke": "#FFFFFF"
            }),
            MACHINE: paper.path('M726.532,233.962l2.712,2.39l0.677,9.216l4.746-0.682v24.917l-6.44,3.072v13.313v5.803l-3.051,3.754  l-57.624,29.696l-35.931-8.533l-3.39-4.437l-0.338-5.461l-13.559-3.754v-58.367l35.252-15.019l18.304,4.096v-2.388l12.203-5.803  l6.102,1.366l2.712-1.366L726.532,233.962z').attr({
                "fill": "#000000",
                "stroke-width": 0,
                "stroke": "#ffffff",
                "fill-opacity": 0.1
            }).data('id', 11).click(function() {
                alert(this.data().id);
            })
        },
        "B003": {
            MAC: paper.path('M884.667,211.333h25.667v38h-25.667V211.333z').attr({
                "fill": "#B8BBBD", //B8BBBD
                "stroke-width": 0,
                "fill-opacity": 1,
                "stroke": "#FFFFFF"
            }),
            MACHINE: paper.path('M904.239,271.161l2.81,2.502l0.701,9.649l4.917-0.714v26.087l-6.673,3.217v13.938v6.076l-3.16,3.93  l-52.155,34.922l-44.424-10.995l-3.857-6.414l-0.351-5.719L785.5,344.5l2.5-61.902l33-17.098l22.486,5.661v-2.5l11.014-6.076  l7.949,1.43l2.809-1.43L904.239,271.161z').attr({
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
                $.post('/GetImmediateState', { Page: "cj01" }, function(data) {
                    if (data.Status == 0)
                        showP(data.Data, path[0].getBBox().y, path[0].getBBox().x, path.data().id);
                })

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
    for (let i = 0; i < data.MAC_DATA[id].DATAITEMS.length; i++) {
        let temp = data.MAC_DATA[id].DATAITEMS[i];
        if (temp == undefined) {
            continue;
        }
        switch (temp.Name) {
            case 'STD::Status':
                para.STATUS_NBR = temp.Value;
                break;
            case 'STD::DURATION':
                para.DURATION = temp.Value;
                break;
            case 'STD::Program':
                para.PROGRAME_NAME = temp.Value;
                break;
            case 'STD::AlarmNo':
                para.WARNING_CODE = temp.Value;
                break;
            case 'STD::SpindleSpeed':
                para.SPINDLESPEED = temp.Value;
                break;
            case 'STD::SpindleOverride':
                para.SPINDLEOVERRIDE = temp.Value;
                break;
            case 'STD::FeedSpeed':
                para.FEEDSPEED = temp.Value;
                break;
            case 'STD::FeedOverride':
                para.FEEDOVRRIDE = temp.Value;
                break;
            case 'STD::YieldCounter':
                para.YieldCounter = temp.Value;
                break;
        }
    }
    var message = ' <form class="form-horizontal" style="min-width: 260px;padding-top:0px;">' +
        '<div class="control-group" style="margin-bottom: 0px;">' +
        '<label class="control-label callout-control-label">' + "状态名称:" + '</label>' +
        '<div class="controls controls-control-label">' +
        '<span>' + para.STATUS_NAME + '</span>' +
        '</div>' + '</div>' + '<div class="control-group" style="margin-bottom: 0px;">' +
        '<label class="control-label callout-control-label">' + "持续时间:" + '</label>' +
        '<div class="controls controls-control-label">' +
        '<span>' + para.DURATION + '</span>' +
        '</div>' + '</div>' + '<div class="control-group" style="margin-bottom: 0px;">' +
        '<label class="control-label callout-control-label">' + "程序号:" + '</label>' +
        '<div class="controls controls-control-label">' +
        '<span>' + para.PROGRAME_NAME + '</span>' +
        '</div>' + '</div>' +
        '<div class="control-group" style="margin-bottom: 0px;">' +
        '<label class="control-label callout-control-label">' + "主轴倍率:" + '</label>' +
        '<div class="controls controls-control-label">' +
        '<span>' + para.SPINDLEOVERRIDE + '</span>' +
        '</div>' + '</div>' +
        '<div class="control-group" style="margin-bottom: 0px;">' +
        '<label class="control-label callout-control-label">' + "主轴倍率:" + '</label>' +
        '<div class="controls controls-control-label">' +
        '<span>' + para.SPINDLEOVERRIDE + '</span>' +
        '</div>' + '</div>' +
        '<div class="control-group" style="margin-bottom: 0px;">' +
        '<label class="control-label callout-control-label">' + "进给倍率:" + '</label>' +
        '<div class="controls controls-control-label">' +
        '<span>' + para.FEEDOVRRIDE + '</span>' +
        '</div>' + '</div>' +
        '<div class="control-group" style="margin-bottom: 0px;">' +
        '<label class="control-label callout-control-label">' + "进给速度:" + '</label>' +
        '<div class="controls controls-control-label">' +
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
        "top": "-500px",
        "left": "355px"
    });
}