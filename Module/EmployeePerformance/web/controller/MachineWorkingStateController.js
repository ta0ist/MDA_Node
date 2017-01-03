/**
 * Created by qb on 2016/11/30.
 */
var groupOrMachine,
    groupOrMember,
    resultData,
    baseUrl = "/MachineWorkingState/",
    groupType = 1; //默认设备方式
$(function() {
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });

    $("#totalType").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { text: lang.EmployeePerformance.Shift, value: 1 },
            { text: lang.EmployeePerformance.Day, value: 2 },
            { text: lang.EmployeePerformance.Weeks, value: 3 },
            { text: lang.EmployeePerformance.Month, value: 4 },
            { text: lang.EmployeePerformance.Years, value: 5 }
        ],
        value: 2
    });
    groupOrMember = $("#groupOrMember").multipleComboxTree({
        url: "/MachineWorkingState/GetAllMemberAndMemberGroup",
        url2: "/MachineWorkingState/GetKeywordMemberlist",
        type: 4,
        data: {
            GroupId: 0
        },
        checkbox: true
    }).data("BZ-multipleComboxTree");

    groupOrMachine = $("#groupOrMachine").multipleComboxTree({
        url: "/Alarm/GetAllMachineAndMachineGroup",
        url2: "/Alarm/GetKeywordMachinelist",
        type: 2,
        data: {
            GroupId: 0
        },
        checkbox: true
    }).data("BZ-multipleComboxTree");


    $("#search").on("click", function() {
        var machines = [];
        for (var m in groupOrMachine.dataAarry) {
            machines.push(parseInt(m));
        }
        var members = [];
        for (var m in groupOrMember.dataAarry) {
            members.push(parseInt(m));
        }
        var data = {
            mem_nbrs: members,
            mac_nbrs: machines,
            starttime: $("#startTime").val(),
            endtime: $("#endTime").val() + ' 23:59:59',
            posttype: parseInt($("#totalType").data("kendoComboBox").value()),
        }
        if ($("#startTime").data("kendoDatePicker").value() == null && $("#endTime").data("kendoDatePicker").value() == null) {
            BzAlert(lang.EmployeePerformance.PleaseInputTheCorrectDate);
            return;
        }
        $.post(baseUrl + 'GetEmployeeStatuRate', data, function(data) {
            if (data.Status == 0) {
                //     var data = [
                //{ MEM_NAME: "小A", MAC_NAME: "B001", RATIO: [{ NAME: "状态1", VALUE: 0.8, FLAG: 0 }, { NAME: "状态2", VALUE: 0.1, FLAG: 0 }, { NAME: "状态3", VALUE: 0.1, FLAG: 1 }, { NAME: "状态4", VALUE: 0.2, FLAG: 1 }] },
                //{ MEM_NAME: "小A", MAC_NAME: "B002", RATIO: [{ NAME: "状态1", VALUE: 0.1, FLAG: 0 }, { NAME: "状态2", VALUE: 0.2, FLAG: 0 }, { NAME: "状态3", VALUE: 0.7, FLAG: 1 }, { NAME: "状态4", VALUE: 0.2, FLAG: 1 }] },
                //{ MEM_NAME: "小A", MAC_NAME: "B003", RATIO: [{ NAME: "状态1", VALUE: 0.3, FLAG: 0 }, { NAME: "状态2", VALUE: 0.2, FLAG: 0 }, { NAME: "状态3", VALUE: 0.5, FLAG: 1 }, { NAME: "状态4", VALUE: 0.2, FLAG: 1 }] },
                //{ MEM_NAME: "小B", MAC_NAME: "B001", RATIO: [{ NAME: "状态1", VALUE: 0.2, FLAG: 0 }, { NAME: "状态2", VALUE: 0.1, FLAG: 0 }, { NAME: "状态3", VALUE: 0.7, FLAG: 1 }, { NAME: "状态4", VALUE: 0.2, FLAG: 1 }] },
                //{ MEM_NAME: "小B", MAC_NAME: "B002", RATIO: [{ NAME: "状态1", VALUE: 0.8, FLAG: 0 }, { NAME: "状态2", VALUE: 0.1, FLAG: 0 }, { NAME: "状态3", VALUE: 0.1, FLAG: 1 }, { NAME: "状态4", VALUE: 0.2, FLAG: 1 }] },
                //{ MEM_NAME: "小B", MAC_NAME: "B003", RATIO: [{ NAME: "状态1", VALUE: 0.3, FLAG: 0 }, { NAME: "状态2", VALUE: 0.3, FLAG: 0 }, { NAME: "状态3", VALUE: 0.4, FLAG: 1 }, { NAME: "状态4", VALUE: 0.2, FLAG: 1 }] }
                //     ]
                resultData = data.Data;
                if (resultData.length > 0) {
                    getData(resultData);
                }
            } else {
                BzAlert(data.Message);
            }
        })



    });
    $(".grouptype li").on('click', function() {
        $('.grouptype li').removeClass('active');
        $(this).addClass('active');
        if ($(this).find('a').attr("data-title") == "1") {
            groupType = 1;
        } else {
            groupType = 2;
        }
        getData(resultData);
    });
    $("#output").on('click', function() {
        var machines = [];
        for (var m in groupOrMachine.dataAarry) {
            machines.push(parseInt(m));
        }
        var members = [];
        for (var m in groupOrMember.dataAarry) {
            members.push(parseInt(m));
        }
        var data = {
            mem_nbrs: members,
            mac_nbrs: machines,
            starttime: $("#startTime").val(),
            endtime: $("#endTime").val() + ' 23:59:59',
            posttype: parseInt($("#totalType").data("kendoComboBox").value()),
        }
        var re = JSON.stringify(data);
        var url = "/MachineWorkingState/GetEmployeeStatuRate";
        window.open("/OutPutIndex?par=" + re + "&url=" + url);
        //window.open("/OutPutIndex")


    });
});

function getData(data) {
    $(".charts").empty();
    //绘图
    var chartData;
    if (groupType == 1) {
        chartData = _.groupBy(data, 'MAC_NAME');
    } else {
        chartData = _.groupBy(data, 'MEM_NAME');
    }
    var kk = 0;
    $.each(chartData, function(p1, p2) {
        var group = p1.replace(/\s/g, ""); //分组
        $(".charts").append('<div id="hisChart_' + kk + '" style="min-width:700px;height:500px"></div>');

        //查询状态数量
        var status = [];
        for (var i = 0; i < p2[0].StatuRates.length; i++) {
            status.push({ NAME: p2[0].StatuRates[i].STATU_NAME, FLAG: p2[0].StatuRates[i].FLAG, COLOR: p2[0].StatuRates[i].COLOR });
        }
        var categories = [],
            ydata = [];

        $.each(p2, function(t1, t2) {
            //        SHIFT = 1,
            //DAY = 2,
            //WEEK = 3,
            //MONTH = 4,
            //YEAR = 5,
            //SEASON = 6,
            //REAL_DAY = 7,
            var typeTitle = "";

            switch (parseInt($("#totalType").data("kendoComboBox").value())) {
                case 1:
                    typeTitle = moment(t2.DAYS).format("M/D") + t2.SHIFT_NAME;
                    break;
                case 2:
                    typeTitle = moment(t2.DAYS).format("M/D");
                    break;
                case 3:
                    typeTitle = moment(t2.DAYS).format("YYYY-") + moment(t2.DAYS).week() + lang.EmployeePerformance.TempWeek;
                    break;
                case 4:
                    typeTitle = moment(t2.DAYS).format("YYYY/M");
                    break;
                case 5:
                    typeTitle = moment(t2.DAYS).format("YYYY");
                    break;
            }
            if (groupType == 1) {
                categories.push(t2.MEM_NAME + "(" + typeTitle + ")"); //横坐标人员
            } else {
                categories.push(t2.MAC_NAME + "(" + typeTitle + ")"); //横坐标设备
            }
        })
        for (var j = 0; j < status.length; j++) {
            var tjson = {
                name: status[j].NAME,
                color: status[j].COLOR,
                data: [],
                stack: status[j].FLAG
            }
            $.each(p2, function(t1, t2) {
                tjson.data.push(t2.StatuRates[j].Rate * 100);
            });
            ydata.push(tjson);
        }
        var par = {
            ele: "#hisChart_" + kk,
            type: "column",
            xdata: categories,
            ydata: ydata,
            ytitle: group,
            stacking: true,
            subtitle: ""
        }
        drawHisChart(par);
        kk++;
    });
}

function drawHisChart(data) {
    Chart = $(data.ele).hisChartMemberRatio({
        type: data.type == undefined ? "column" : data.type,
        title: data.ytitle + lang.EmployeePerformance.DistributionOfItsOperationEfficiency,
        //ytitle: data.ytitle,
        subtitle: data.subtitle == undefined ? "" : data.subtitle,
        categories: data.xdata == undefined ? [] : data.xdata,
        dataSource: data.ydata == undefined ? [] : data.ydata,
        stacking: data.stacking == true ? "normal" : null
    }).data("BZ-hisChartMemberRatio");
}