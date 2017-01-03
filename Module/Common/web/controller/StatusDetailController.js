/**
 * Created by qb on 2016/11/18.
 */
var groupOrMachine;
var grid;
$(function() {
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#filterLogic").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { value: 1, text: lang.MachineStatus.LessThanOrEqualTo },
            { value: 2, text: lang.MachineStatus.GreaterThanOrEqualTo }
        ]
    });
    groupOrMachine = $("#groupOrMachine").multipleComboxTree({
        url: "/StatusDetail/GetAllMachineAndMachineGroup",
        url2: "/StatusDetail/GetKeywordMachinelist",
        type: 2,
        data: {
            GroupId: 0
        },
    }).data("BZ-multipleComboxTree");
    App.initUniform();
    //grid_show();
    //查询
    $("#search").click(function() {
        grid_show();
    });

    function grid_show() {
        var data = {
            StartTime: $("#startTime").val(),
            EndTime: $("#startTime").val(),
            ShowDetails: $('input[name="detailshow"]').prop("checked"),
            ObjectIDs: groupOrMachine.rData == undefined ? 10 : groupOrMachine.rData
        }
        var cols = [];
        cols.push({ field: "STATUSID", title: lang.MachineStatus.StateID, width: 80, sortable: true, filterable: false });
        cols.push({ field: "NAME", title: lang.MachineStatus.StateName, width: 80, sortable: true, filterable: false });
        cols.push({ field: "START", title: lang.Order.StartDate, type: 'date', format: '{0: yyyy-MM-dd HH:mm:ss}', width: 80, sortable: true, filterable: false, hidden: false });
        cols.push({ field: "END", title: lang.Order.EndDate, type: 'date', format: '{0: yyyy-MM-dd HH:mm:ss}', width: 80, sortable: true, filterable: false });
        cols.push({ field: "durations", title: lang.EmployeePerformance.DurationTime, width: 80, sortable: true, filterable: false });
        cols.push({ field: "Program_Number", title: lang.Common.ApplicationNo, width: 80, sortable: true, filterable: false });
        cols.push({ field: "Operator", title: lang.Order.Operator, width: 80, sortable: true, filterable: false });
        $.post("/StatusDetail/GetMachineStatusListByName", data, function(data) {
            console.log(data);
            var result = data.Data[0].StatusData[0].Data;
            for (var i = 0; i < result.length; i++) {
                var start_time = new Date(parseInt(result[i].START.slice(6, length - 2), 10));
                var start_time_total_second = start_time.getHours() * 3600 + start_time.getMinutes() * 60 + start_time.getSeconds();
                var end_time = new Date(parseInt(result[i].END.slice(6, length - 2), 10));
                var end_time_total_second = end_time.getHours() * 3600 + end_time.getMinutes() * 60 + end_time.getSeconds();
                var duration = end_time_total_second == 0 ? 86400 - start_time_total_second : end_time_total_second - start_time_total_second;
                result[i].duration = duration;
            }
            if (checked.checked) {
                if (filterLogic.value == 1) {
                    for (var i = 0; i < result.length; i++) {
                        result[i].duration > filterValue.value && (result[i] = "");
                    }
                }
                if (filterLogic.value == 2) {
                    for (var i = 0; i < result.length; i++) {
                        result[i].duration < filterValue.value && (result[i] = "");
                    }
                }
            }
            var re = []
            for (var i = 0; i < result.length; i++) {
                if (result[i] != "") {
                    re.push(result[i]);
                }
            }
            for (var i = 0; i < re.length; i++) {
                re[i].durations = formatSeconds(re[i].duration);
            }
            grid = $("#grid").kendoGrid({
                columns: cols,
                filterable: { mode: "menu" },
                dataSource: re,
                height: 500,
                selectable: "row",
                pageable: {
                    pageSize: 10000,
                    //pageSizes: [20, 50, 100, 200, 500]ss
                }
            });
            for (var i = 1; i < re.length + 1; i++) {
                $("tbody[role='rowgroup'] >tr:nth-child(" + i + ")>td:nth-child(2)").html("<span>" + "&nbsp;&nbsp;" + re[i - 1].NAME + "</span>");
                $("tbody[role='rowgroup'] >tr:nth-child(" + i + ")>td:nth-child(2)>span").css("background", '#' + re[i - 1].COLOR.Name);
            }
            $("tbody[role='rowgroup']>tr>td>span").css({ "width": "100%", "display": "inline-block", "line-height": "30px" });

        });
    }
});
//秒转为时间00：00：00
function formatSeconds(value) {
    var theTime = parseInt(value); // 秒
    var theTime1 = 0; // 分
    var theTime2 = 0; // 小时
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    if (theTime < 10) {
        theTime = "0" + theTime
    }
    if (theTime1 < 10) {
        theTime1 = "0" + theTime1
    }
    if (theTime2 < 10) {
        theTime2 = "0" + theTime2
    }
    var result = theTime2 + ":" + theTime1 + ":" + theTime;
    return result;
}