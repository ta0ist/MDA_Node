var grid;
var groupOrMachine;
var Chart;
var baseUrl = "/MaintenanceFrequency/";
$(function() {
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#totalType").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { text: '日', value: 1 },
            { text: '周', value: 2 },
            { text: '月', value: 3 },
            { text: '年', value: 4 }
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

    membertree = $("#membertree").multipleComboxTree({
        url: "/SparePartsManagement/GetAllMemberAndMemberGroup",
        url2: "/SparePartsManagement/GetKeywordMemberlist",
        type: 4,
        width: 174,
        diffwidth: 37,
        inputheight: 34,
        diffinputwidth: 13,
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
            $("#groupOrMachine_text").text("设备");
        } else { //设备
            url = "/faultCause/GetGrouplist";
            url2 = "/faultCause/GetKeywordGrouplist";
            //checkChildren = false;
            $("#groupOrMachine").data("BZ-multipleComboxTree").TreeData.options.checkboxes.checkChildren = false;
            type = 1;
            $("#groupOrMachine_text").text("设备组");
        }
        $("#groupOrMachine").data("BZ-multipleComboxTree")._setOptions({
            type: type,
            url: url,
            url2: url2,
            checkChildren: checkChildren
        });
        $("#groupOrMachine").data("BZ-multipleComboxTree").clear();
    });

    $('input[name="member"]').change(function() {
        if (this.checked) {
            $("#membershow").show();
        } else {
            $("#membershow").hide();
        }
    });
    $("#search").click(function() {
        var machines = [],
            members = [];
        for (var m in groupOrMachine.dataAarry) {
            machines.push(parseInt(m));
        }
        for (var m in membertree.dataAarry) {
            members.push(parseInt(m));
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
            groupIds: machines,
            StartTime: $("#startTime").val(),
            EndTime: $("#endTime").val()
        };
        var url, group;
        data = {
            SearchType: parseInt($("#totalType").data("kendoComboBox").value()),
            machineIds: machines,
            groupIds: machines,
            StartTime: $("#startTime").val(),
            EndTime: $("#endTime").val(),
            MemberIds: members
        };
        if ($('input[name="member"]').prop("checked")) {

            baseUrl = "/TpmChart/TimeAnalysis/";
            if ($('input[name="searchType"]:checked').val() == 1) { //设备
                url = "GetTimeAnalysisMachine";
                group = false;
            } else { //设备组
                url = "GetTimeAnalysisGroup";
                group = true;
            }
        } else {
            baseUrl = "/TpmChart/RepairTime/";
            if ($('input[name="searchType"]:checked').val() == 1) { //设备
                url = "GetRepaircostByMachine";
                group = false;
            } else { //设备组
                url = "GetRepaircostByGroup";
                group = true;
            }
        }

        $.ajax({
            url: '/MaintenanceFrequency/' + url,
            contentType: 'application/json',
            data: JSON.stringify(data),
            type: 'post',
            success: function(data) {
                var startDate = moment($("#startTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
                var endDate = moment($("#endTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
                var dataSource = [];
                var categories = [];
                if (data.Status == 0) {
                    if (data.Data.length > 0) {
                        try {
                            Chart.destroy();
                        } catch (e) {}
                        switch ($("#totalType").data("kendoComboBox").value()) {
                            case "1": //日
                                DrawHisChart(data, startDate, endDate, categories, 1, group);
                                break;
                            case "2": //周
                                DrawHisChart(data, startDate, endDate, categories, 2, group);
                                break;
                            case "3": //月
                                DrawHisChart(data, startDate, endDate, categories, 3, group);
                                break;
                            case "4": //年
                                DrawHisChart(data, startDate, endDate, categories, 4, group);
                                break;
                        };
                    }
                }
            }
        })

        // $.post(baseUrl + url, JSON.stringify(data), function(data) {
        //     var startDate = moment($("#startTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
        //     var endDate = moment($("#endTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
        //     var dataSource = [];
        //     var categories = [];
        //     if (data.Status == 0) {
        //         if (data.Data.length > 0) {
        //             try {
        //                 Chart.destroy();
        //             } catch (e) {}

        //             switch ($("#totalType").data("kendoComboBox").value()) {
        //                 case "1": //日
        //                     DrawHisChart(data, startDate, endDate, categories, 1, group);
        //                     break;
        //                 case "2": //周
        //                     DrawHisChart(data, startDate, endDate, categories, 2, group);
        //                     break;
        //                 case "3": //月
        //                     DrawHisChart(data, startDate, endDate, categories, 3, group);
        //                     break;
        //                 case "4": //年
        //                     DrawHisChart(data, startDate, endDate, categories, 4, group);
        //                     break;
        //             };
        //         }
        //     }
        // });
    });
});

//根据数据绘图
function DrawHisChart(data, strdate, enddate, categories, type, group) {
    var machines = {};
    for (var i = 0; i < data.Data.length; i++) {
        for (var j = 0; j < data.Data[i].REPAIRDATELIST.length; j++) {
            if (!group) {
                machines[data.Data[i].REPAIRDATELIST[j].MAC_NAME] = {
                    NAME: data.Data[i].REPAIRDATELIST[j].MAC_NAME
                }
            } else {
                machines[data.Data[i].REPAIRDATELIST[j].GP_NAME] = {
                    NAME: data.Data[i].REPAIRDATELIST[j].GP_NAME
                }
            }
        }

        if (type == 1)
            data.Data[i].DAY = moment(data.Data[i].DAY).format("YYYY-MM-DD");
        else if (type == 2)
            data.Data[i].DAY = moment(data.Data[i].DAY).format("YYYY") + "-" + moment(data.Data[i].DAY).week() + '周';
        else if (type == 3)
            data.Data[i].DAY = moment(data.Data[i].DAY).format("YYYY-MM");
        else if (type == 4)
            data.Data[i].DAY = moment(data.Data[i].DAY).format("YYYY");
    }

    var ydata = [];
    if (type == 1) {
        var diff = moment(enddate).diff(strdate, "days"); //横坐标是天
        for (var k = 0; k <= diff; k++) {
            categories.push(moment(strdate).add("days", k).format("YYYY-MM-DD"));
        }
    } else if (type == 2) {
        var diff = moment(enddate).diff(strdate, "weeks"); //横坐标是周
        for (var k = 0; k <= diff; k++) {
            var ndate = moment(strdate).add("weeks", k);
            categories.push(ndate.format("YYYY") + "-" + ndate.week() + '周');
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
    var tableData = [];
    if ($('input[name="member"]').prop("checked")) {
        PushDataPeople(categories, data, group, machines, ydata, tableData);
        var par = {
            type: "column",
            xdata: categories,
            ydata: ydata
        }
        drawHisChart(par, "维修时间分布图");
    } else {
        PushDataMachine(categories, data, group, machines, ydata, tableData);
        var par = {
            type: "column",
            xdata: categories,
            ydata: ydata
        }
        drawHisChart(par, "维修时间分布图");
    }
    DrawTable(tableData, group);
}

function DrawHisChartN(data, strdate, enddate, categories, type, group, name) {
    var machines = {};
    for (var i = 0; i < data.Data.length; i++) {
        for (var j = 0; j < data.Data[i].REPAIRDATELIST.length; j++) {
            if (!group) {
                machines[data.Data[i].REPAIRDATELIST[j].MAC_NAME] = {
                    NAME: data.Data[i].REPAIRDATELIST[j].MAC_NAME
                }
            } else {
                machines[data.Data[i].REPAIRDATELIST[j].GP_NAME] = {
                    NAME: data.Data[i].REPAIRDATELIST[j].GP_NAME
                }
            }
        }

        if (type == 1)
            data.Data[i].DAY = moment(data.Data[i].DAY).format("YYYY-MM-DD");
        else if (type == 2)
            data.Data[i].DAY = moment(data.Data[i].DAY).format("YYYY") + "-" + moment(data.Data[i].DAY).week() + "周";
        else if (type == 3)
            data.Data[i].DAY = moment(data.Data[i].DAY).format("YYYY-MM");
        else if (type == 4)
            data.Data[i].DAY = moment(data.Data[i].DAY).format("YYYY");
    }

    var ydata = [];
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
    var tableData = [];
    if ($('input[name="member"]').prop("checked")) {
        PushDataPeopleN(categories, data, group, machines, ydata, tableData, name);
        var par = {
            type: "column",
            xdata: categories,
            ydata: ydata
        }
        drawHisChart(par, "维修时间分布图");
    } else {
        PushDataMachine(categories, data, group, machines, ydata, tableData);
        var par = {
            type: "column",
            xdata: categories,
            ydata: ydata
        }
        drawHisChart(par, "维修时间分布图");
    }
    DrawTable(tableData, group);
}

function drawHisChart(data, p) {
    Chart = $("#hisChart").hisChartYield({
        type: data.type == undefined ? "column" : data.type,
        title: p,
        subtitle: data.subtitle == undefined ? "" : data.subtitle,
        categories: data.xdata == undefined ? [] : data.xdata,
        dataSource: data.ydata == undefined ? [] : data.ydata,
        stacking: data.stacking == true ? "normal" : null,
        yAxistitle: "用时"
    }).data("BZ-hisChartYield");
}

//根据数据绘表
function DrawTable(tableData, type) {
    if ($("#hisTable").data("BZ-tableGrid") != undefined) {
        $("#hisTable").data("BZ-tableGrid").destroy();
    }

    $("#hisTable").tableGrid({
        columns: [
            { name: 'GP_NAME', title: "设备组" },
            { name: 'MAC_NAME', title: "设备", hidGrid: !type ? false : true },
            { name: 'DAY', title: "维修时间" },
            {
                name: 'MEMBER_NAME',
                title: "人员",
                hidGrid: $('input[name="member"]').prop("checked") ? false : true,
                idMerge: true,
                click: function(pp) {
                    PushDataPeoples(pp);
                }
            },
            { name: 'REPAIR_TIMESPAN', title: '维修时间' },
            { name: 'REPAIR_COUNT', title: "维修次数" }
        ],
        dataSource: tableData
    });
}

function PushDataMachine(categories, data, group, machines, ydata, tableData) {
    for (var m in machines) {
        var tjson = {};
        tjson.name = machines[m].NAME;
        tjson.data = [];
        for (var i = 0; i < categories.length; i++) { //日期
            var tjson1 = {};
            var rdata = _.where(data.Data, { DAY: categories[i] });
            if (rdata.length > 0) {
                var rdata1;
                if (!group)
                    rdata1 = _.where(rdata[0].REPAIRDATELIST, { MAC_NAME: machines[m].NAME });
                else
                    rdata1 = _.where(rdata[0].REPAIRDATELIST, { GP_NAME: machines[m].NAME });
                if (rdata1.length > 0) {
                    tjson.data.push(parseFloat((rdata1[0].REPAIR_TIMESPAN / 3600).toFixed(2)));
                    tjson1.GP_NAME = rdata1[0].GP_NAME;
                    tjson1.MAC_NAME = rdata1[0].MAC_NAME;
                    tjson1.DAY = categories[i];
                    tjson1.REPAIR_TIMESPAN = parseFloat((rdata1[0].REPAIR_TIMESPAN / 3600).toFixed(2)) + "h";
                    tjson1.REPAIR_COUNT = rdata1[0].REPAIR_COUNT;
                    tableData.push(tjson1);
                } else {
                    tjson.data.push(null);
                }
            }
        }
        ydata.push(tjson);
    }
}

function PushDataPeople(categories, data, group, machines, ydata, tableData) {
    var people = {};
    for (var i = 0; i < data.Data.length; i++) {
        for (var j = 0; j < data.Data[i].REPAIRDATELIST.length; j++) {
            people[data.Data[i].REPAIRDATELIST[j].MEMBER_NAME] = {
                NAME: data.Data[i].REPAIRDATELIST[j].MEMBER_NAME
            }
        }
    }

    for (var n in people) {
        for (var i = 0; i < data.Data.length; i++) {
            for (var j = 0; j < data.Data[i].REPAIRDATELIST.length; j++) {
                if (data.Data[i].REPAIRDATELIST[j].MEMBER_NAME == people[n].NAME) {
                    var tjson1 = {};
                    tjson1.GP_NAME = data.Data[i].REPAIRDATELIST[j].GP_NAME;
                    tjson1.MAC_NAME = data.Data[i].REPAIRDATELIST[j].MAC_NAME;
                    tjson1.DAY = data.Data[i].DAY;
                    tjson1.REPAIR_TIMESPAN = parseFloat((data.Data[i].REPAIRDATELIST[j].REPAIR_TIMESPAN / 3600).toFixed(2)) + "h";
                    tjson1.REPAIR_COUNT = data.Data[i].REPAIRDATELIST[j].REPAIR_COUNT;
                    tjson1.MEMBER_NAME = data.Data[i].REPAIRDATELIST[j].MEMBER_NAME;
                    tableData.push(tjson1);
                }
            }
        }
    }

    for (var n in people) {
        for (var m in machines) {
            var tjson = {};
            tjson.name = machines[m].NAME;
            tjson.data = [];
            for (var i = 0; i < categories.length; i++) {
                var rdata = _.where(data.Data, { DAY: categories[i] });
                if (rdata.length > 0) {
                    var rdata1;
                    if (!group)
                        rdata1 = _.where(rdata[0].REPAIRDATELIST, { MAC_NAME: machines[m].NAME, MEMBER_NAME: people[n].NAME });
                    else
                        rdata1 = _.where(rdata[0].REPAIRDATELIST, { GP_NAME: machines[m].NAME, MEMBER_NAME: people[n].NAME });
                    if (rdata1.length > 0) {
                        tjson.data.push(parseFloat((rdata1[0].REPAIR_TIMESPAN / 3600).toFixed(2)));
                    } else {
                        tjson.data.push(null);
                    }
                }
            }
            ydata.push(tjson);
        }
        break;
    }

    //for (var n in people) {
    //    for (var m in machines) {
    //        var tjson = {};
    //        tjson.name = people[n].NAME;
    //        tjson.stack = machines[m].NAME;
    //        tjson.data = [];
    //        for (var i = 0; i < categories.length; i++) {
    //            var tjson1 = {};
    //            var rdata = _.where(data.Data, { DAY: categories[i] });
    //            if (rdata.length > 0) {
    //                var rdata1;
    //                if (!group)
    //                    rdata1 = _.where(rdata[0].REPAIRDATELIST, { MAC_NAME: machines[m].NAME });
    //                else
    //                    rdata1 = _.where(rdata[0].REPAIRDATELIST, { GP_NAME: machines[m].NAME });
    //                if (rdata1.length > 0) {
    //                    tjson.data.push(parseFloat((rdata1[0].REPAIR_TIMESPAN / 3600).toFixed(1)));
    //                    tjson1.GP_NAME = rdata1[0].GP_NAME;
    //                    tjson1.MAC_NAME = rdata1[0].MAC_NAME;
    //                    tjson1.DAY = categories[i];
    //                    tjson1.REPAIR_TIMESPAN = parseFloat((rdata1[0].REPAIR_TIMESPAN / 3600).toFixed(1)) + "h";
    //                    tjson1.REPAIR_COUNT = rdata1[0].REPAIR_COUNT;
    //                    tjson1.MEMBER_NAME = rdata1[0].MEMBER_NAME;
    //                    tableData.push(tjson1);
    //                }
    //                else {
    //                    tjson.data.push(null);
    //                }
    //            }
    //        }
    //    }
    //    ydata.push(tjson);
    //}
}

function PushDataPeopleN(categories, data, group, machines, ydata, tableData, name) {
    var people = {};
    for (var i = 0; i < data.Data.length; i++) {
        for (var j = 0; j < data.Data[i].REPAIRDATELIST.length; j++) {
            people[data.Data[i].REPAIRDATELIST[j].MEMBER_NAME] = {
                NAME: data.Data[i].REPAIRDATELIST[j].MEMBER_NAME
            }
        }
    }
    for (var n in people) {
        for (var i = 0; i < data.Data.length; i++) {
            for (var j = 0; j < data.Data[i].REPAIRDATELIST.length; j++) {
                if (data.Data[i].REPAIRDATELIST[j].MEMBER_NAME == people[n].NAME) {
                    var tjson1 = {};
                    tjson1.GP_NAME = data.Data[i].REPAIRDATELIST[j].GP_NAME;
                    tjson1.MAC_NAME = data.Data[i].REPAIRDATELIST[j].MAC_NAME;
                    tjson1.DAY = data.Data[i].DAY;
                    tjson1.REPAIR_TIMESPAN = parseFloat((data.Data[i].REPAIRDATELIST[j].REPAIR_TIMESPAN / 3600).toFixed(1)) + "h";
                    tjson1.REPAIR_COUNT = data.Data[i].REPAIRDATELIST[j].REPAIR_COUNT;
                    tjson1.MEMBER_NAME = data.Data[i].REPAIRDATELIST[j].MEMBER_NAME;
                    tableData.push(tjson1);
                }
            }
        }
    }
    for (var m in machines) {
        var tjson = {};
        tjson.name = machines[m].NAME;
        tjson.data = [];
        for (var i = 0; i < categories.length; i++) {
            var rdata = _.where(data.Data, { DAY: categories[i] });
            if (rdata.length > 0) {
                var rdata1;
                if (!group)
                    rdata1 = _.where(rdata[0].REPAIRDATELIST, { MAC_NAME: machines[m].NAME, MEMBER_NAME: name });
                else
                    rdata1 = _.where(rdata[0].REPAIRDATELIST, { GP_NAME: machines[m].NAME, MEMBER_NAME: name });
                if (rdata1.length > 0) {
                    tjson.data.push(parseFloat((rdata1[0].REPAIR_TIMESPAN / 3600).toFixed(1)));
                } else {
                    tjson.data.push(null);
                }
            }
        }
        ydata.push(tjson);
    }
}

//根据点击人员画图
function PushDataPeoples(Name) {
    var machines = [],
        members = [];
    for (var m in groupOrMachine.dataAarry) {
        machines.push(parseInt(m));
    }
    for (var m in membertree.dataAarry) {
        members.push(parseInt(m));
    }

    if (machines.length == 0) {
        return;
    }

    var data = {
        SearchType: parseInt($("#totalType").data("kendoComboBox").value()),
        machineIds: machines,
        groupIds: machines,
        StartTime: $("#startTime").data("kendoDatePicker").value(),
        EndTime: $("#endTime").data("kendoDatePicker").value()
    };

    var url, group;
    data = {
        SearchType: parseInt($("#totalType").data("kendoComboBox").value()),
        machineIds: machines,
        groupIds: machines,
        StartTime: $("#startTime").data("kendoDatePicker").value(),
        EndTime: $("#endTime").data("kendoDatePicker").value(),
        MemberIds: members
    };
    if ($('input[name="member"]').prop("checked")) {

        baseUrl = "/TpmChart/TimeAnalysis/";
        if ($('input[name="searchType"]:checked').val() == 1) { //设备
            url = "GetTimeAnalysisMachine";
            group = false;
        } else { //设备组
            url = "GetTimeAnalysisGroup";
            group = true;
        }
    } else {
        baseUrl = "/TpmChart/RepairTime/";
        if ($('input[name="searchType"]:checked').val() == 1) { //设备
            url = "GetRepaircostByMachine";
            group = false;
        } else { //设备组
            url = "GetRepaircostByGroup";
            group = true;
        }
    }


    $.ajax({
        url: '/MaintenanceFrequency/' + url,
        contentType: 'application/json',
        data: JSON.stringify(data),
        type: 'post',
        success: function(data) {
            var startDate = moment($("#startTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
            var endDate = moment($("#endTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
            var dataSource = [];
            var categories = [];
            if (data.Status == 0) {
                if (data.Data.length > 0) {
                    try {
                        Chart.destroy();
                    } catch (e) {}
                    switch ($("#totalType").data("kendoComboBox").value()) {
                        case "1": //日
                            DrawHisChartN(data, startDate, endDate, categories, 1, group, Name);
                            break;
                        case "2": //周
                            DrawHisChartN(data, startDate, endDate, categories, 2, group, Name);
                            break;
                        case "3": //月
                            DrawHisChartN(data, startDate, endDate, categories, 3, group, Name);
                            break;
                        case "4": //年
                            DrawHisChartN(data, startDate, endDate, categories, 4, group, Name);
                            break;
                    };
                }
            }
        }
    })


    // $.post(baseUrl + url, JSON.stringify(data), function(data) {
    //     var startDate = moment($("#startTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
    //     var endDate = moment($("#endTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
    //     var dataSource = [];
    //     var categories = [];
    //     if (data.Status == 0) {
    //         if (data.Data.length > 0) {
    //             try {
    //                 Chart.destroy();
    //             } catch (e) {}
    //             switch ($("#totalType").data("kendoComboBox").value()) {
    //                 case "1": //日
    //                     DrawHisChartN(data, startDate, endDate, categories, 1, group, Name);
    //                     break;
    //                 case "2": //周
    //                     DrawHisChartN(data, startDate, endDate, categories, 2, group, Name);
    //                     break;
    //                 case "3": //月
    //                     DrawHisChartN(data, startDate, endDate, categories, 3, group, Name);
    //                     break;
    //                 case "4": //年
    //                     DrawHisChartN(data, startDate, endDate, categories, 4, group, Name);
    //                     break;
    //             };
    //         }
    //     }
    // });
}