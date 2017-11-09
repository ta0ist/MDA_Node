var groupOrMachine;
var Chart;
$(function() {
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    //$("#totalType").kendoComboBox({
    //    dataTextField: "text",
    //    dataValueField: "value",
    //    dataSource: [
    //        { text: $.Translate("MachineStatus.DAY"), value: 1 },
    //        { text: $.Translate("MachineStatus.WEEK"), value: 2 },
    //        { text: $.Translate("MachineStatus.MONTH"), value: 3 },
    //        { text: $.Translate("MachineStatus.YEAR"), value: 4 }
    //    ],
    //    value: 1
    //});
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
        if (macVal == '设备') {
            if (machines.length == 0) {
                BzAlert("请选择" + '设备');
                return;
            }
        } else if (macVal == 'DEVICE_GROUP') {
            if (machines.length == 0) {
                BzAlert("请选择" + 'DEVICE_GROUP');
                return;
            }
        }

        var data = {
            machineIds: machines,
            groupIds: machines,
            StartTime: $("#startTime").val(),
            EndTime: $("#endTime").val()
        };
        var url, group;
        if ($('input[name="searchType"]:checked').val() == 1) { //设备
            url = "/FaultIs/GetMachineRepairTime";
            group = false;
        } else { //设备组
            url = "/FaultIs/GetGroupRepairTime";
            group = true;
        }

        $.ajax({
            url: url,
            contentType: 'application/json',
            type: 'post',
            data: JSON.stringify(data),
            success: function(data) {
                var startDate = moment($("#startTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
                var endDate = moment($("#endTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
                try {
                    Chart.destroy();
                } catch (e) {}
                var categories = [];
                if (data.Status == 0) {
                    if (data.Data.length > 0) {
                        var machines = {};
                        var categories = [];
                        for (var i = 0; i < data.Data.length; i++) {
                            if (!group) {
                                categories.push(data.Data[i].MAC_NAME);
                            } else {
                                categories.push(data.Data[i].GP_NAME);
                            }
                        }

                        var tjson = [];
                        for (var i = 0; i < categories.length; i++) {
                            var rdata;
                            if (!group)
                                rdata = _.where(data.Data, { MAC_NAME: categories[i] });
                            else
                                rdata = _.where(data.Data, { GP_NAME: categories[i] });
                            if (rdata.length > 0)
                                tjson.push(parseFloat((rdata[0].REPAIR_TIMESPAN / 3600).toFixed(2)));
                            else
                                tjson.push(null);
                        }

                        var num = 0;
                        for (var i = 0; i < tjson.length; i++) {
                            num += tjson[i];
                        }
                        console.log(num);

                        var par = {
                            type: "column",
                            xdata: categories,
                            ydata: [{ data: tjson, name: '故障用时(h)' }],
                            subtitle: ""
                        }
                        drawHisChart(par);
                    }
                }
            }
        })

        // $.post(url, JSON.stringify(data), function(data) {
        //     var startDate = moment($("#startTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
        //     var endDate = moment($("#endTime").data("kendoDatePicker").value()).format("YYYY-MM-DD");
        //     try {
        //         Chart.destroy();
        //     } catch (e) {}
        //     var categories = [];
        //     if (data.Status == 0) {
        //         if (data.Data.length > 0) {
        //             var machines = {};
        //             var categories = [];
        //             for (var i = 0; i < data.Data.length; i++) {
        //                 if (!group) {
        //                     categories.push(data.Data[i].MAC_NAME);
        //                 } else {
        //                     categories.push(data.Data[i].GP_NAME);
        //                 }
        //             }

        //             var tjson = [];
        //             for (var i = 0; i < categories.length; i++) {
        //                 var rdata;
        //                 if (!group)
        //                     rdata = _.where(data.Data, { MAC_NAME: categories[i] });
        //                 else
        //                     rdata = _.where(data.Data, { GP_NAME: categories[i] });
        //                 if (rdata.length > 0)
        //                     tjson.push(parseFloat((rdata[0].REPAIR_TIMESPAN / 3600).toFixed(2)));
        //                 else
        //                     tjson.push(null);
        //             }

        //             var num = 0;
        //             for (var i = 0; i < tjson.length; i++) {
        //                 num += tjson[i];
        //             }
        //             console.log(num);

        //             var par = {
        //                 type: "column",
        //                 xdata: categories,
        //                 ydata: [{ data: tjson, name: '故障用时(h)' }],
        //                 subtitle: ""
        //             }
        //             drawHisChart(par);
        //         }
        //     }
        // });
    });
});

function drawHisChart(data) {
    console.log($("#hisChart"))
    Chart = $("#hisChart").hisChartYield({
        type: data.type == undefined ? "column" : data.type,
        title: "故障用时(h)",
        subtitle: data.subtitle == undefined ? "" : data.subtitle,
        categories: data.xdata == undefined ? [] : data.xdata,
        dataSource: data.ydata == undefined ? [] : data.ydata,
        yAxistitle: "用时"
    }).data("BZ-hisChartYield");
}