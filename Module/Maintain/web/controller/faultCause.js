var groupOrMachine;
var Chart;
$(function() {
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#totalType").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { text: "日", value: 1 },
            { text: "周", value: 2 },
            { text: "月", value: 3 },
            { text: "年", value: 4 }
        ],
        value: 1
    });
    groupOrMachine = $("#groupOrMachine").multipleComboxTree({
        url: "/faultCause/GetAllMachineAndMachineGroup",
        url2: "/faultCause/GetKeywordMachinelist",
        type: 2,
        data: {
            GroupId: 0
        },
        checkbox: true
    }).data("BZ-multipleComboxTree");
    $('input[name="searchType"]').change(function() {
        var url, url2, checkChildren, type;
        if ($(this).val() == 1) { //设备组
            url = "/faultCause/GetAllMachineAndMachineGroup";
            url2 = "/faultCause/GetKeywordMachinelist";
            //checkChildren = true;
            $("#groupOrMachine").data("BZ-multipleComboxTree").TreeData.options.checkboxes.checkChildren = true;
            type = 2;
            $("#groupOrMachine_text").text('设备');
        } else { //设备
            url = "/faultCause/GetGrouplist";
            url2 = "/faultCause/GetKeywordGrouplist";
            //checkChildren = false;
            $("#groupOrMachine").data("BZ-multipleComboxTree").TreeData.options.checkboxes.checkChildren = false;
            type = 1;
            $("#groupOrMachine_text").text('设备组');
        }
        $("#groupOrMachine").data("BZ-multipleComboxTree")._setOptions({
            type: type,
            url: url,
            url2: url2,
            checkChildren: checkChildren
        });
        $("#groupOrMachine").data("BZ-multipleComboxTree").clear();
    });

    $("#search").click(function() {
        var machines = [];
        for (var m in groupOrMachine.dataAarry) {
            machines.push(parseInt(m));
        }

        //查询时判断是否选择设备或设备组 htc:20170612
        var macVal = $("#groupOrMachine_text").text();
        if (macVal == "设备") {
            if (machines.length == 0) {
                BzAlert("请选择" + "设备");
                return;
            }
        } else if (macVal == "设备组") {
            if (machines.length == 0) {
                BzAlert("请选择" + "设备组");
                return;
            }
        }

        var data = {
            SearchType: parseInt($("#totalType").data("kendoComboBox").value()),
            machineIds: machines,
            GroupIds: machines,
            StartTime: $("#startTime").val(),
            EndTime: $("#endTime").val()
        };
        var url;
        if ($('input[name="searchType"]:checked').val() == 1) { //设备
            url = "/faultCause/GetMachineFaultCause";
        } else { //设备组
            url = "/faultCause/GetGroupFaultCause";
        }

        $.ajax({
            url: url,
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(data) {
                var startDate = moment($("#startTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
                var endDate = moment($("#endTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
                var dataSource = [];
                if (data.Status == 0) {
                    $(".pie").remove();
                    switch ($("#totalType").data("kendoComboBox").value()) {
                        case "1": //日
                            DrawHisChart(data, startDate, endDate, 1);
                            break;
                        case "2": //周
                            DrawHisChart(data, startDate, endDate, 2);
                            break;
                        case "3": //月
                            DrawHisChart(data, startDate, endDate, 3);
                            break;
                        case "4": //年
                            DrawHisChart(data, startDate, endDate, 4);
                            break;
                    }
                }
            }
        })

        // $.post(url, JSON.stringify(data), function(data) {
        //     var startDate = moment($("#startTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
        //     var endDate = moment($("#endTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
        //     var dataSource = [];
        //     if (data.Status == 0) {
        //         $(".pie").remove();
        //         switch ($("#totalType").data("kendoComboBox").value()) {
        //             case "1": //日
        //                 DrawHisChart(data, startDate, endDate, 1);
        //                 break;
        //             case "2": //周
        //                 DrawHisChart(data, startDate, endDate, 2);
        //                 break;
        //             case "3": //月
        //                 DrawHisChart(data, startDate, endDate, 3);
        //                 break;
        //             case "4": //年
        //                 DrawHisChart(data, startDate, endDate, 4);
        //                 break;
        //         }
        //     }
        // });
    });
});

///饼图处理数据
function DrawHisChart(data, strdate, enddate, type) {
    for (var i = 0; i < data.Data.length; i++) {
        if (type == 1)
            data.Data[i].DAY = moment(data.Data[i].DAY).format("YYYY-MM-DD");
        else if (type == 2)
            data.Data[i].DAY = moment(data.Data[i].DAY).format("YYYY") + "-" + moment(data.Data[i].DAY).week() + "周";
        else if (type == 3)
            data.Data[i].DAY = moment(data.Data[i].DAY).format("YYYY-MM");
        else if (type == 4)
            data.Data[i].DAY = moment(data.Data[i].DAY).format("YYYY");
    }

    var ydata = [],
        categories = [];
    if (type == 1) {
        var diff = moment(enddate).diff(strdate, "days"); //横坐标是天
        for (var k = 0; k <= diff; k++) {
            categories.push(moment(strdate).add("days", k).format("YYYY-MM-DD"));
        }
    } else if (type == 2) {
        var diff = moment(enddate).diff(strdate, "weeks"); //横坐标是周
        for (var k = 0; k <= diff; k++) {
            var ndate = moment(strdate).add("weeks", k);
            categories.push(ndate.format("YYYY") + "-" + ndate.week() + "周");
        }
    } else if (type == 3) {
        var diff = moment(enddate).diff(strdate, "months");
        for (var k = 0; k <= diff; k++) {
            categories.push(moment(strdate).add("months", k).format("YYYY-MM")); //(横坐标为月)
        }
    } else {
        var diff = moment(enddate).diff(strdate, "years");
        for (var k = 0; k <= diff; k++) {
            categories.push(moment(strdate).add("years", k).format("YYYY")); //(横坐标为年)
        }
    }

    for (var i = 0; i < categories.length; i++) { //日期
        var tjson = {};
        tjson.name = "故障原因用时百分比";
        var rdata = _.where(data.Data, { DAY: categories[i] });
        if (rdata.length > 0) {
            tjson.data = [];
            if (rdata[0].REPAIRDATELIST.length > 0) {
                for (var j = 0; j < rdata[0].REPAIRDATELIST.length; j++) {
                    var sdata = [];
                    var sdata = {
                        name: rdata[0].REPAIRDATELIST[j].FAULTCAUSE,
                        y: rdata[0].REPAIRDATELIST[j].PERCENTAGE * 100,
                        time: parseFloat((rdata[0].REPAIRDATELIST[j].REPAIR_TIMESPAN / 3600).toFixed(2))
                    };
                    tjson.data.push(sdata);
                }
                var html = '<div class="pie" id="pie' + "_" + i + "_" + j + '"></div>';
                $("#pie").append($(html));
                drawPieChart('#pie' + "_" + i + "_" + j, [tjson], categories[i], tjson.name);
            }
        }
    }
}

function drawPieChart(ele, data, title, subtitle) {
    $(ele).highcharts({
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
            formatter: function() {
                return '<b>' + this.key + ': ' + this.y + '%</b><br/>' +
                    '用时: ' + this.point.options.time + "小时";
            },
            shared: true
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        return '<b>' + this.point.name + '</b>: ' + this.point.options.y + '%<br/>' + this.point.options.time + "小时";
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: data
    });
}