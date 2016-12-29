/**
 * Created by qb on 2016/11/30.
 */
var groupOrMachine,
    groupOrMember,
    resultData,
    baseUrl = "/MachineYield/",
    groupType = 1;//默认设备方式
$(function () {
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    groupOrMember = $("#groupOrMember").multipleComboxTree({
        url: "/MachineWorkingState/GetAllMemberAndMemberGroup",
        url2: "/MachineWorkingState/GetKeywordMemberlist",
        type: 4,
        data: {
            GroupId: 0
        },
        checkbox: true
    }).data("BZ-multipleComboxTree");//员工

    groupOrMachine = $("#groupOrMachine").multipleComboxTree({
        url: "/Alarm/GetAllMachineAndMachineGroup",
        url2: "/Alarm/GetKeywordMachinelist",
        type: 2,
        data: {
            GroupId: 0
        },
        checkbox: true
    }).data("BZ-multipleComboxTree");//设备


    $("#totalType").kendoDropDownList({//统计方式
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { text: '班次', value: 1 },
            { text: '日', value: 2 },
            { text: '周', value: 3 },
            { text: '月', value: 4 },
            { text: '年', value: 5 }
        ],
        value: 2
    });

    $("#search").on("click", function () {//查询
        var menList = [];
        var machineList = [];
        for (var m in groupOrMember.dataAarry) {
            menList.push(parseInt(m));
        }
        for (var m in groupOrMachine.dataAarry) {
            machineList.push(parseInt(m));
        }
        var data = {
            menList: menList,
            machineList: machineList,
            BeginDate: $("#startTime").val(),
            EndDate: $("#endTime").val() + ' 23:59:59',
            searchtype: parseInt($("#totalType").data("kendoDropDownList").value()),
        }
        if ($("#startTime").data("kendoDatePicker").value() == null&&$("#endTime").data("kendoDatePicker").value() == null) {
            BzAlert("请输入正确的日期");
            return;
        }
        if (menList.length == 0 || machineList == 0) {
            return;
        }
        $.post(baseUrl + 'GetMachineYieldList', data, function (data) {
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
            }
            else {
                BzAlert(data.Message);
            }
        })



    });
    $(".grouptype li").on('click', function () {
        $('.grouptype li').removeClass('active');
        $(this).addClass('active');
        if ($(this).find('a').attr("data-title") == "1") {
            groupType = 1; //工单
        }
        else {
            groupType = 2; //员工
        }
        getData(resultData);
    });

    $("#output").on('click', function () {
        var machineList = [];
        for (var m in groupOrMachine.dataAarry) {
            machineList.push(parseInt(m));
        }
        var menList = [];
        for (var m in groupOrMember.dataAarry) {
            menList.push(parseInt(m));
        }
        var data = {
            menList: menList,
            machineList: machineList,
            BeginDate: $("#startTime").val(),
            EndDate: $("#endTime").val() + ' 23:59:59',
            searchtype: parseInt($("#totalType").data("kendoDropDownList").value()),
        }
        var url = baseUrl + 'GetMachineYieldList';
        window.open("/OutPutIndexYield?par=" + JSON.stringify(data) + "&url=" + url);
    });
});


function getData(data) {
    $(".charts").empty();
    //绘图
    var chartData;
    if (groupType == 1) {
        chartData = _.groupBy(data, 'MAC_NAME');
    }
    else {
        chartData = _.groupBy(data, 'MEM_NAME');
    }

    var kk = 0;
    $.each(chartData, function (p1, p2) {
        var group = p1.replace(/\s/g, "");  //分组
        var group = p1;
        $(".charts").append('<div id="hisChart_' + kk + '" style="min-width:700px;height:500px"></div>');

        //var status = [];
        //for (var i = 0; i < p2.length; i++) {
        //    status.push({ NAME: p2[i].MAC_NAME, FLAG: p2[i].MEM_NAME, TONGJI: p2[i].PROD_COUNT });
        //}
        var categories = [],
            ydata = [{
                type: 'column',
                name: "产量",
                data: []
            }, {
                type: 'line',
                name: "平均产量",
                data: []
            }];

        var total = 0;
        var average = 0;
        for (var i = 0; i < p2.length; i++) {
            total = total + p2[i].PROD_COUNT;
        }
        average = parseInt((total / p2.length).toFixed(0));
        $.each(p2, function (t1, t2) {
            var typeTitle = "";

            switch (parseInt($("#totalType").data("kendoDropDownList").value())) {
                case 1:
                    typeTitle = moment(t2.SHIFT_DAY).format("M/D") + t2.SHIFT_NAME;
                    break;
                case 2:
                    typeTitle = moment(t2.SHIFT_DAY).format("M/D");
                    break;
                case 3:
                    typeTitle = moment(t2.SHIFT_DAY).format("YYYY-") + moment(t2.DAYS).week() + "周";
                    break;
                case 4:
                    typeTitle = moment(t2.SHIFT_DAY).format("YYYY/M");
                    break;
                case 5:
                    typeTitle = moment(t2.SHIFT_DAY).format("YYYY");
                    break;
            }
            if (groupType == 1) {
                categories.push(t2.MEM_NAME + "(" + typeTitle + ")"); //横坐标人员

            }
            else {
                categories.push(t2.MAC_NAME + "(" + typeTitle + ")"); //横坐标设备

            }
            ydata[0].data.push(t2.PROD_COUNT);
            ydata[1].data.push(average);

        })

        var par = {
            ele: "#hisChart_" + kk,
            type: "column",
            xdata: categories,
            ydata: ydata,
            ytitle: group,
            subtitle: ""
        }
        drawHisChart(par);

        kk++;
    })
    function drawHisChart(data) {
        Chart = $(data.ele).hisChartOrderYield({
            type: data.type == undefined ? "column" : data.type,
            title: data.ytitle + "产量分布图",
            //ytitle: data.ytitle,
            subtitle: data.subtitle == undefined ? "" : data.subtitle,
            categories: data.xdata == undefined ? [] : data.xdata,
            dataSource: data.ydata == undefined ? [] : data.ydata,
            stacking: data.stacking == true ? "normal" : null
        }).data("BZ-hisChartYield");
    }

}