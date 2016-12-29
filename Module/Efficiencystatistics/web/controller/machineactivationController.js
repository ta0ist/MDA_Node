var groupOrMachine;
    var Chart;
    var groupType = 1;//默认设备方式
    var baseUrl = "/machineactivation/";
    var groupOrMac = 1;
    $(function () {
        $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
        $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
        $("#totalType").kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [
                { text: '班次', value: 1 },
                { text: '天', value: 2 },
                { text: '周', value: 3 },
                { text: '月', value: 4 },
                { text: '年', value: 5 }
            ],
            change: onChange,
            value: 2
        });

        function onChange() {
            var value = $("#totalType").val();
            $("#totalType_listbox").toggleClass('班次', value == 1)
                            .toggleClass('天', value == 2)
                           .toggleClass('周', value == 3)
                          .toggleClass('月', value == 4)
                           .toggleClass('年', value == 5);
        };
        groupOrMachine = $("#groupOrMachine").multipleComboxTree({
            url: "/machine/GetAllMachineAndMachineGroup_CustomerParameter",
            url2: "/machine/GetKeywordMachinelist",
            type: 2,
            data: {
                groupID: 0
            },
            checkbox: true
        }).data("BZ-multipleComboxTree");
        $('input[name="searchType"]').change(function () {
            var url, url2, checkChildren, type;
            if ($(this).val() == 1) {//设备组
                url = "/machine/GetAllMachineAndMachineGroup_CustomerParameter";
                url2 = "/machine/GetKeywordMachinelist";
                checkChildren = true;
                $("#groupOrMachine").data("BZ-multipleComboxTree").TreeData.options.checkboxes.checkChildren = true;
                type = 2;
                $("#groupOrMachine_text").text("设备");
                groupOrMac = 1;
            }
            else {//设备
                url = "/machine/GetGrouplist_Customer";
                url2 = "/machine/GetKeywordGrouplist";
                checkChildren = false;
                $("#groupOrMachine").data("BZ-multipleComboxTree").TreeData.options.checkboxes.checkChildren = false;
                type = 1;
                $("#groupOrMachine_text").text("设备组");
                groupOrMac = 2;
            }
            $("#groupOrMachine").data("BZ-multipleComboxTree")._setOptions({
                type: type,
                url: url,
                url2: url2,
                checkChildren: checkChildren
            });
            $("#groupOrMachine").data("BZ-multipleComboxTree").clear();
        });

        $(".grouptype li").on('click', function () {
            $('.grouptype li').removeClass('active');
            $(this).addClass('active');
            if ($(this).find('a').attr("data-title") == "1") {
                groupType = 1;
            }
            else {
                groupType = 2;
            }
            getData(resultData);
        });
        function getData(tdata) {
            $("#hisChart").empty();
            var data = [];
            var shifts = {};
            switch ($("#totalType").data("kendoDropDownList").value()) {
                case "1":
                    for (var i = 0; i < tdata.length; i++) {
                        for (var j = 0; j < tdata[i].Data.length; j++) {
                            data.push({
                                NAME: tdata[i].Name,
                                MAC_NO: tdata[i].MAC_NO,
                                DATE: tdata[i].Data[j].DATE,
                                SHIFTS: tdata[i].Data[j].SHIFTS
                            })
                            for (var p = 0; p < tdata[i].Data[j].SHIFTS.length; p++) {
                                shifts[tdata[i].Data[j].SHIFTS[p].SHIFT_ID] = tdata[i].Data[j].SHIFTS[p].NAME;
                            }
                        }
                    }
                    break;
                case "2":
                    for (var i = 0; i < tdata.length; i++) {
                        for (var j = 0; j < tdata[i].Data.length; j++) {
                            data.push({
                                NAME: tdata[i].Name,
                                MAC_NO: tdata[i].MAC_NO,
                                DATE: tdata[i].Data[j].DATE,
                                VALUE: tdata[i].Data[j].VALUE
                            })
                        }
                    }
                    break;
                case "3":
                    for (var i = 0; i < tdata.length; i++) {
                        for (var j = 0; j < tdata[i].Data.length; j++) {
                            data.push({
                                NAME: tdata[i].Name,
                                MAC_NO: tdata[i].MAC_NO,
                                DATE: tdata[i].Data[j].DATE,
                                VALUE: tdata[i].Data[j].VALUE,
                                WEEK: tdata[i].Data[j].WEEK
                            })
                        }
                    }
                    break;
                case "4":
                    for (var i = 0; i < tdata.length; i++) {
                        for (var j = 0; j < tdata[i].Data.length; j++) {
                            data.push({
                                NAME: tdata[i].Name,
                                MAC_NO: tdata[i].MAC_NO,
                                DATE: moment(tdata[i].Data[j].YEAR + "/" + tdata[i].Data[j].MONTH + "/1"),
                                YEAR: tdata[i].Data[j].YEAR,
                                VALUE: tdata[i].Data[j].VALUE,
                                MONTH: tdata[i].Data[j].MONTH
                            })
                        }
                    }
                    break;
                case "5":
                    for (var i = 0; i < tdata.length; i++) {
                        for (var j = 0; j < tdata[i].Data.length; j++) {
                            data.push({
                                NAME: tdata[i].Name,
                                MAC_NO: tdata[i].MAC_NO,
                                DATE: moment(tdata[i].Data[j].YEAR + "/1/1"),
                                YEAR: tdata[i].Data[j].YEAR,
                                VALUE: tdata[i].Data[j].VALUE
                            })
                        }
                    }
                    break;
            }
            //绘图
            var chartData;
            if (groupType == 1) {
                chartData = _.groupBy(data, 'NAME');
            }
            else {
                chartData = _.groupBy(data, 'DATE');
            }
            var kk = 1;
            $.each(chartData, function (p1, p2) {

                $("#hisChart").append('<div id="hisChart_' + kk + '" style="min-width:700px;height:500px"></div>');


                var categories = [],
                    ydata = [{
                        name: "稼动率",
                        data: []
                    }];
                var title;

                //班次特殊处理
                if ($("#totalType").data("kendoDropDownList").value() == "1") {
                    //统计所有的班次
                    ydata = [];
                    $.each(shifts, function (s1, s2) {
                        var tjson = {
                            id: s1,
                            name: s2,
                            data: []
                        }
                        ydata.push(tjson);
                    });
                }
                for (var i = 0; i < p2.length; i++) {
                    if (groupType == 1) {
                        switch ($("#totalType").data("kendoDropDownList").value()) {
                            case "1":
                                //班次
                                for (var t = 0; t < ydata.length; t++) {
                                    for (var k = 0; k < p2[i].SHIFTS.length; k++) {
                                        if (ydata[t].id == p2[i].SHIFTS[k].SHIFT_ID) {
                                            ydata[t].data.push(p2[i].SHIFTS[k].VALUE);
                                        }
                                    }
                                }

                                categories.push(moment(p2[i].DATE).format("YYYY/MM/DD")); //横坐标日期
                                title = p1 + (p2[i].MAC_NO == undefined ? "" : "(" +p2[i].MAC_NO+")") + "稼动率分布示意图";
                                break;
                            case "2":
                                ydata[0].data.push(p2[i].VALUE);
                                categories.push(moment(p2[i].DATE).format("YYYY/MM/DD")); //横坐标日期
                                title = p1 + (p2[i].MAC_NO == undefined ? "" : "(" +p2[i].MAC_NO+")") + "稼动率分布示意图";
                                break;
                            case "3":
                                ydata[0].data.push(p2[i].VALUE);
                                categories.push(moment(p2[i].DATE).format("YYYY") + "第" + p2[i].WEEK + "周"); //横坐标日期
                                title = p1 + (p2[i].MAC_NO == undefined ? "" : "(" +p2[i].MAC_NO+")") + "稼动率分布示意图";
                                break;
                            case "4":
                                ydata[0].data.push(p2[i].VALUE);
                                categories.push(moment(p2[i].DATE).format("YYYY/MM") + "月"); //横坐标日期
                                title = p1 + (p2[i].MAC_NO == undefined ? "" : "(" +p2[i].MAC_NO+")") +"稼动率分布示意图";
                                break;
                            case "5":
                                ydata[0].data.push(p2[i].VALUE);
                                categories.push(moment(p2[i].DATE).format("YYYY") + "年"); //横坐标日期
                                title = p1 + (p2[i].MAC_NO == undefined ? "" : "(" + p2[i].MAC_NO + ")") + "稼动率分布示意图";
                                break;
                        }
                    }
                    else {
                        switch ($("#totalType").data("kendoDropDownList").value()) {
                            case "1":
                                //班次
                                for (var t = 0; t < ydata.length; t++) {
                                    for (var k = 0; k < p2[i].SHIFTS.length; k++) {
                                        if (ydata[t].id == p2[i].SHIFTS[k].SHIFT_ID) {
                                            ydata[t].data.push(p2[i].SHIFTS[k].VALUE);
                                        }
                                    }
                                }

                                categories.push(p2[i].NAME + (p2[i].MAC_NO == undefined ? "" : "(" + p2[i].MAC_NO + ")")); //横坐标设备
                                title = moment(p1).format("YYYY/MM/DD") + "稼动率分布示意图";
                                break;
                            case "2":
                                ydata[0].data.push(p2[i].VALUE);
                                categories.push(p2[i].NAME + (p2[i].MAC_NO == undefined ? "" : "(" + p2[i].MAC_NO + ")")); //横坐标设备
                                title = moment(p1).format("YYYY/MM/DD") +"稼动率分布示意图";
                                break;
                            case "3":
                                ydata[0].data.push(p2[i].VALUE);
                                categories.push(p2[i].NAME + (p2[i].MAC_NO == undefined ? "" : "(" + p2[i].MAC_NO + ")")); //横坐标设备
                                title = moment(p1).format("YYYY") + "第" + p2[i].WEEK + "周" + "稼动率分布示意图";
                                break;
                            case "4":
                                ydata[0].data.push(p2[i].VALUE);
                                categories.push(p2[i].NAME + (p2[i].MAC_NO == undefined ? "" : "(" + p2[i].MAC_NO + ")")); //横坐标设备
                                title = moment(p1).format("YYYY/MM") + "月" + "稼动率分布示意图";
                                break;
                            case "5":
                                ydata[0].data.push(p2[i].VALUE);
                                categories.push(p2[i].NAME + (p2[i].MAC_NO == undefined ? "" : "(" + p2[i].MAC_NO + ")")); //横坐标设备
                                title = moment(p1).format("YYYY") + "年" + "稼动率分布示意图";
                                break;
                        }
                    }
                }
                var par = {
                    ele: "#hisChart_" + kk,
                    type: "column",
                    xdata: categories,
                    ydata: ydata,
                    title: title,
                    subtitle: ""
                }
                drawHisChart(par);
                kk++;
            });
        }
        $("#search").click(function () {
            var machines ='';
            for (var m in groupOrMachine.dataAarry) {
                machines+=parseInt(m)+',';
            }
            machines=machines.substring(0,machines.length-1);
            if (machines.length == 0) {
                return;
            }
            var data = {
                machineMode: parseInt($("#totalType").data("kendoDropDownList").value()),
                objectIds: machines,
                startTime: $("#startTime").val(),
                endTime: $("#endTime").val()
            };
            var url;
            if ($('input[name="searchType"]:checked').val() == 1) {//设备
                url = "/machineactivation/GetMachineActivation";
            }
            else {//设备组
                url = "/machineactivation/GetGroupActivation";
            }

            $.post(url, (data), function (data) {
                if (data.Status == 0) {
                    resultData = data.Data;
                    getData(resultData);
                }
                else {
                    BzAlert(data.Message);
                }
            });
        });
        $("#output").on('click', function () {
            var machines ='';
            for (var m in groupOrMachine.dataAarry) {
                machines+=parseInt(m)+',';
            }
            machines=machines.substring(0,machines.length-1);
            if (machines.length == 0) {
                return;
            }
            var data = {
                machineMode: parseInt($("#totalType").data("kendoDropDownList").value()),
                objectIds: machines,
                startTime: $("#startTime").val(),
                endTime: $("#endTime").val()
            };
            var url;
            if ($('input[name="searchType"]:checked').val() == 1) {//设备
                url = "/machineactivation/r/GetMachineActivation";
            }
            else {//设备组
                url = "/machineactivation/r/GetGroupActivation";
            }
            window.open("/MachineOutPutIndex?par=" + JSON.stringify(data) + "&url=" + url + "&groupOrMac=" + groupOrMac);
        });
        drawHisChart({});
    });
    function format(n) {
        if (n < 10)
            return "0" + n;
        else
            return n.toString();
    }
    function drawHisChart(data) {
        Chart = $(data.ele).hisChart({
            type: data.type == undefined ? "column" : data.type,
            title: data.title,
            subtitle: data.subtitle == undefined ? "" : data.subtitle,
            categories: data.xdata == undefined ? [] : data.xdata,
            dataSource: data.ydata == undefined ? [] : data.ydata,
            stacking: data.stacking == true ? "normal" : null,
            exportEnable: false,
            ymax: 100
        }).data("BZ-hisChart");
    }