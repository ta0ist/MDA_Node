/**
 * Created by qb on 2016/11/23.
 */
var groupOrMachine;
var Chart;
var group;
var baseUrl = "/Alarm";
var globalData;
$(function () {
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#totalType").kendoComboBox({
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
    groupOrMachine = $("#groupOrMachine").multipleComboxTree({
        url: "/Alarm/GetAllMachineAndMachineGroup",
        url2: "/Alarm/GetKeywordMachinelist",
        type: 2,
        data: {
            GroupId: 0
        },
        checkbox: true
    }).data("BZ-multipleComboxTree");
    $("#search").click(function () {
        var machines = [];
        for (var m in groupOrMachine.dataAarry) {
            machines.push(parseInt(m));
        }
        if (machines.length == 0) {
            return;
        }
        var data = {
            QueryType: parseInt($("#totalType").data("kendoComboBox").value()),
            MachineIds: machines,
            GroupIds: machines,
            StartTime: $("#startTime").val(),
            EndTime: $("#endTime").val()
        };
        var url;
        if ($('input[name="searchType"]:checked').val() == 1) {//设备
            url = "/Alarm/GetMachineByAlarmInfo";
        }
        else {//设备组
            url = "/Alarm/GetMachineByAlarmInfo";
        }

        $.post(url, data, function (data) {
            globalData = data;
            console.log(data.Data)
            categories = [];
            var startDate = moment($("#startTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
            var endDate = moment($("#endTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
            var dataSource = [];
            if (data.Data.length > 0) {
                try {
                    Chart.destroy();
                }
                catch (e) { }
                switch ($("#totalType").data("kendoComboBox").value()) {
                    case "1"://班次
                        DrawHisChart(data, startDate, endDate, categories, 1);
                        break;
                    case "2"://日
                        DrawHisChart(data, startDate, endDate, categories, 2);
                        break;
                    case "3"://周
                        DrawHisChart(data, startDate, endDate, categories, 3);
                        console.log(data)
                        break;
                    case "4"://月
                        DrawHisChart(data, startDate, endDate, categories, 4);
                        break;
                    case "5"://年
                        DrawHisChart(data, startDate, endDate, categories, 5);
                        break;
                }
            }
        });
    });
    BindCol();
});

function BindCol() {
    var fields = {
        ALARM_NBR: { type: "string" },
        ALARM_DATE: { type: "date" },
        MAC_NBR: { type: "string" },
        MAC_NAME: { type: "string" },
        ALARM_NO: { type: "string" },
        ALARM_MESSAGE: { type: "string" },
        ALARM_NAME: { type: "string" },
        ALARM_REASON: { type: "String" },
        BEGIN_DAY: { type: "date" },
        END_DAY: { type: "date" }

    };
    var cols = [];
    cols.push({ field: "ALARM_NBR", title: 'id', width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "ALARM_DATE", title: '报警日期', width: 80, sortable: true, format: "{0: yyyy/MM/dd HH:mm:ss}", filterable: false });

    cols.push({ field: "STATUS_NAME", title: '状态名称', width: 80, sortable: true, filterable: false });
    cols.push({ field: "BEGIN_DAY", title: '报警开始时间', width: 80, sortable: true, format: "{0: yyyy/MM/dd HH:mm:ss}", filterable: false });
    cols.push({ field: "END_DAY", title: '报警结束时间', width: 80, sortable: true, format: "{0: yyyy/MM/dd HH:mm:ss}", filterable: false });
    cols.push({ field: "DURITION", title: '报警持续时间(分钟)', width: 80, sortable: true, filterable: false });

    cols.push({ field: "MAC_NBR", title: '设备编号', width: 80, sortable: true, filterable: false });
    cols.push({ field: "MAC_NAME", title: '设备名称', width: 80, sortable: true, filterable: false });
    cols.push({ field: "ALARM_NO", title: '报警号', width: 80, sortable: true, filterable: false });
    cols.push({ field: "ALARM_MESSAGE", title: '报警内容', width: 80, sortable: true, filterable: false });
    //cols.push({ field: "ALARM_NAME", title: "备注", width: 80, sortable: true, filterable: false });
    cols.push({ field: "ALARM_REASON", title: '报警原因',className:"table-fonts", width: 80, sortable: true, filterable: false });
    cols.push({
        command: [{ name: "aa", text: '编辑' + '<i class="icon-edit"></i>', className: "btn purple", click: f_edit }],
        title: '操作', width: 80
    });
    grid = $("#hisTable").grid({
        checkBoxColumn: false,
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        //sort: [{ field: "USER_NBR", dir: "ASC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: false,
        height: 300,
        resizeGridWidth: true,//列宽度可调
        isPage: true,
        customsearch: true,
        server: true, //服务器端刷新，包括排序，筛选等
        actionUrl: ["/GetLookupAlarmInfo", "", "", ""], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "ALARM_NBR",
            fields: fields,
            cols: cols
        }
    });

}

function f_edit(e) {
    $.x5window('编辑', kendo.template($("#popup-add").html()));
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    var fonts = dataItem.ALARM_REASON;
    $("#MEMO").val(fonts);
    $("#Win_Submit").bind("click", function (e) {
        var json = {
            ALARM_NBR: dataItem.ALARM_NBR,
            ALARM_DATE: dataItem.ALARM_DATE,
            MAC_NBR: dataItem.MAC_NBR,
            MAC_NAME: dataItem.MAC_NAME,
            ALARM_NO: dataItem.ALARM_NO,
            ALARM_MESSAGE: dataItem.ALARM_MESSAGE,
            ALARM_REASON: $("#MEMO").val()
        };
        $.post(baseUrl + "/UpdAlarm", json, function (data) {
            if (data.Status == 0) {
                $("#x5window").data("kendoWindow").close();
                $("#hisTable").grid("refresh");
                BzSuccess(data.Message);
            }
            else {
                BzAlert(data.Message);
            }
        });
    });
}
//根据数据绘表
function DrawTable(machines, strdate, enddate) {
    $("#hisTable").grid("refresh", function () {
        return [
            {
                filters: [
                    { field: "ALARM_DATE", Operator: "gte", value: strdate },
                    { field: "ALARM_DATE", Operator: "lte", value: enddate }
                ],
                logic: "and"
            }
        ];
    });
}

function DrawHisChart(data, strdate, enddate, categories, type) {
    var machines = {};
    for (var i = 0; i < data.Data.length; i++) {
        for (var j = 0; j < data.Data[i].Alarmcount.length; j++) {
            machines[data.Data[i].Alarmcount[j].MachineName] = {
                NAME: data.Data[i].Alarmcount[j].MachineName
            }
        }
        if (type == 1) {
            data.Data[i].Day = moment(data.Data[i].Day).format("YYYY-MM-DD") + data.Data[i].ShifName;
        }
        else if (type == 2)
            data.Data[i].Day = moment(data.Data[i].Day).format("YYYY-MM-DD");
        else if (type == 3)
            data.Data[i].Day = moment(data.Data[i].Day).format("YYYY") + "-" + moment(data.Data[i].Day).week() + "周";
        else if (type == 4)
            data.Data[i].Day = moment(data.Data[i].Day).format("YYYY-MM");
        else if (type == 5)
            data.Data[i].Day = moment(data.Data[i].Day).format("YYYY");
    }
    var ydata = [];
    if (type == 1) {
        for (var i = 0; i < data.Data.length; i++) {
            if (data.Data[i].ShifName != null)
                categories.push(data.Data[i].Day);
        }
    }
    else if (type == 2) {
        var diff = moment(enddate).diff(strdate, "days");//横坐标是天
        for (var k = 0; k <= diff; k++) {
            categories.push(moment(strdate).add("days", k).format("YYYY-MM-DD"));
        }
    }
    else if (type == 3) {
        var diff = moment(enddate).diff(strdate, "weeks");//横坐标是周
        for (var k = 0; k <= diff; k++) {
            var ndate = moment(strdate).add("weeks", k);
            categories.push(ndate.format("YYYY") + "-" + ndate.week() + "周");
        }
    }
    else if (type == 4) {
        var diff = moment(enddate).diff(strdate, "months");
        for (var k = 0; k <= diff; k++) {
            categories.push(moment(strdate).add("months", k).format("YYYY-MM")); //(横坐标为月)
        }
    }
    else {
        var diff = moment(enddate).diff(strdate, "years");
        for (var k = 0; k <= diff; k++) {
            categories.push(moment(strdate).add("years", k).format("YYYY")); //(横坐标为年)
        }
    }
    for (var m in machines) {
        var tjson = {};
        tjson.name = machines[m].NAME;
        tjson.data = [];
        for (var i = 0; i < categories.length; i++) {//日期
            var rdata = _.where(data.Data, { Day: categories[i] });
            if (rdata.length > 0) {
                var rdata1;
                rdata1 = _.where(rdata[0].Alarmcount, { MachineName: machines[m].NAME });
                if (rdata1.length > 0) {
                    tjson.data.push(rdata1[0].Count);
                }
                else {
                    tjson.data.push(null);
                }
            }
        }
        ydata.push(tjson);
    }
    var par = {
        type: "column",
        xdata: categories,
        ydata: ydata
    }
    drawHisChart(par, '报警分析');
    // DrawTable(strdate, enddate);
}

function drawHisChart(data, p) {
    Chart = $("#hisChart").hisChartYield({
        type: data.type == undefined ? "column" : data.type,
        title: p,
        subtitle: data.subtitle == undefined ? "" : data.subtitle,
        categories: data.xdata == undefined ? [] : data.xdata,
        dataSource: data.ydata == undefined ? [] : data.ydata,
        stacking: data.stacking == true ? "normal" : null,
        yAxistitle: "用时",
        eventclick: true,
        click: function (e, d) {
            var startDate, endDate;
            for (var i = 0; i < globalData.Data.length; i++) {
                if (globalData.Data[i].Day == d.category) {
                    for (var j = 0; j < globalData.Data[i].Alarmcount.length; j++) {
                        if (globalData.Data[i].Alarmcount[j].MachineName == e.name) {
                            startDate = moment(globalData.Data[i].Alarmcount[j].BEGIN_DAY).format("YYYY-MM-DD HH:mm:ss");
                            endDate = moment(globalData.Data[i].Alarmcount[j].END_DAY).format("YYYY-MM-DD HH:mm:ss");
                        }
                    }
                }
            }
            $("#hisTable").grid("refresh", function () {
                return [
                    {
                        filters: [
                            { field: "ALARM_DATE", Operator: "gte", value: startDate },
                            { field: "ALARM_DATE", Operator: "lt", value: endDate }
                        ],
                        logic: "and"
                    },
                    { field: "MAC_NAME", Operator: "eq", value: e.name }
                ]
            }, {
                logic: "and"
            });
        }
    }).data("BZ-hisChartYield");
}