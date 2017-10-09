angular.module('app', [])
    .controller('appCtrl', function($scope) {
        var baseUrl = $.getparam("url"),
            par = $.getparam("par"),
            groupOrMac = $.getparam("groupOrMac"); //1 设备   2 设备组
        $scope.shift = 0;


        var fields = {
            //MAC_NO: { type: "string" },
            MAC_NAME: { type: "string" },
            DATE: { type: "string" },
            TYPE: { type: "string" },
            SHIFT: { type: "string" },
            VALUE: { type: "string" }
        };
        var cols = [];
        if (groupOrMac == 1) {
            //cols.push({ field: "MAC_NO", title: "设备编号", width: 80, sortable: true, filterable: false, hidden: false });
            cols.push({
                field: "MAC_NAME",
                title: lang.EmployeePerformance.DeviceName,
                width: 80,
                sortable: true,
                filterable: {
                    cell: {
                        template: function(args) {
                            args.element.kendoDropDownList({
                                dataSource: args.dataSource,
                                dataTextField: "MAC_NAME",
                                dataValueField: "MAC_NAME",
                                valuePrimitive: true
                            });
                        },
                        showOperators: false
                    }
                },
                hidden: false
            });
        } else {
            cols.push({
                field: "MAC_NAME",
                title: lang.Efficiencystatistics.EquipmentGroup,
                width: 80,
                sortable: true,
                filterable: {
                    cell: {
                        template: function(args) {
                            args.element.kendoDropDownList({
                                dataSource: args.dataSource,
                                dataTextField: "MAC_NAME",
                                dataValueField: "MAC_NAME",
                                valuePrimitive: true
                            });
                        },
                        showOperators: false
                    }
                },
                hidden: false
            });
        }
        cols.push({
            field: "DATE",
            title: lang.EmployeePerformance.Date,
            width: 80,
            sortable: true,
            filterable: {
                cell: {
                    template: function(args) {
                        args.element.kendoDropDownList({
                            dataSource: args.dataSource,
                            dataTextField: "DATE",
                            dataValueField: "DATE",
                            valuePrimitive: true
                        });
                    },
                    showOperators: false
                }
            },
            hidden: false
        });
        cols.push({ field: "TYPE", title: lang.EmployeePerformance.StatisticalMethods, width: 80, sortable: true, filterable: false, hidden: false });
        cols.push({ field: "SHIFT", title: lang.EmployeePerformance.Shift, width: 80, sortable: true, filterable: false });
        cols.push({ field: "VALUE", title: lang.EmployeePerformance.RateOGrainOrMove, width: 120, sortable: true, filterable: false, template: kendo.template($("#VALUE-template").html()) });
        cols.push({
            field: "VALUE",
            title: lang.EmployeePerformance.RateOGrainOrMove,
            width: 50,
            sortable: true,
            filterable: false,
            attributes: {
                "class": "table-cell",
                style: "text-align: right;"
            },
            template: kendo.template($("#VALUE-template1").html())
        });


        $.post(baseUrl, par, function(rdata) {
            if (rdata.Status == 0) {
                var tdata = rdata.Data;
                var data = [];
                switch (jQuery.parseJSON(par).machineMode) {
                    case 1:
                        for (var i = 0; i < tdata.length; i++) {
                            for (var j = 0; j < tdata[i].Data.length; j++) {
                                for (var k = 0; k < tdata[i].Data[j].SHIFTS.length; k++) {
                                    //var shift = [],vaul=[];
                                    //shift.push(tdata[i].Data[j].SHIFTS[k].NAME);
                                    //vaul.push(tdata[i].Data[j].SHIFTS[k].VALUE);
                                    data.push({
                                        NAME: tdata[i].Name,
                                        //MAC_NO: tdata[i].MAC_NO,
                                        DATE: tdata[i].Data[j].DATE,
                                        VALUE: tdata[i].Data[j].SHIFTS[k].VALUE,
                                        SHIFT: tdata[i].Data[j].SHIFTS[k].NAME
                                    })
                                }

                            }
                        }
                        break;
                    case 2:
                        for (var i = 0; i < tdata.length; i++) {
                            for (var j = 0; j < tdata[i].Data.length; j++) {
                                // for (var k = 0; k < tdata[i].Data[j].SHIFTS.length; k++) {
                                data.push({
                                    NAME: tdata[i].Name,
                                    //MAC_NO: tdata[i].MAC_NO,
                                    DATE: tdata[i].Data[j].DATE,
                                    VALUE: tdata[i].Data[j].VALUE
                                })
                            }

                            //}
                        }
                        break;
                    case 3:
                        for (var i = 0; i < tdata.length; i++) {
                            for (var j = 0; j < tdata[i].Data.length; j++) {
                                data.push({
                                    NAME: tdata[i].Name,
                                    // MAC_NO: tdata[i].MAC_NO,                                  
                                    DATE: tdata[i].Data[j].DATE,
                                    VALUE: tdata[i].Data[j].VALUE,
                                    WEEK: tdata[i].Data[j].WEEK
                                })
                            }
                        }
                        break;
                    case 4:
                        for (var i = 0; i < tdata.length; i++) {
                            for (var j = 0; j < tdata[i].Data.length; j++) {
                                data.push({
                                    NAME: tdata[i].Name,
                                    //MAC_NO: tdata[i].MAC_NO,
                                    DATE: moment(tdata[i].Data[j].YEAR + "/" + tdata[i].Data[j].MONTH + "/1"),
                                    YEAR: tdata[i].Data[j].YEAR,
                                    VALUE: tdata[i].Data[j].VALUE,
                                    MONTH: tdata[i].Data[j].MONTH
                                })
                            }
                        }
                        break;
                    case 5:
                        for (var i = 0; i < tdata.length; i++) {
                            for (var j = 0; j < tdata[i].Data.length; j++) {
                                data.push({
                                    NAME: tdata[i].Name,
                                    // MAC_NO: tdata[i].MAC_NO,
                                    DATE: moment(tdata[i].Data[j].YEAR + "/1/1"),
                                    YEAR: tdata[i].Data[j].YEAR,
                                    VALUE: tdata[i].Data[j].VALUE
                                })
                            }
                        }
                        break;
                }

                data = _.sortBy(data, 'DATE');
                for (var i = 0; i < data.length; i++) {

                    switch (jQuery.parseJSON(par).machineMode) {
                        case 1:
                            // for (var pp = 0; pp < data[i].SHIFTS.length; pp++) {
                            data[i]["NO"] = i + 1;
                            data[i]["MAC_NAME"] = data[i].NAME;
                            data[i]["TYPE"] = lang.EmployeePerformance.Shift;
                            data[i]["DATE"] = moment(data[i].DATE).format("YYYY-MM-DD");
                            data[i]["SHIFT"] = data[i].SHIFT;
                            data[i]["VALUE"] = parseFloat(data[i].VALUE.toFixed(1));

                            // }

                            //break;
                        case 2:
                            data[i]["NO"] = i + 1;
                            data[i]["MAC_NAME"] = data[i].NAME;
                            data[i]["TYPE"] = lang.EmployeePerformance.Day;
                            data[i]["DATE"] = moment(data[i].DATE).format("YYYY-MM-DD");
                            data[i]["VALUE"] = parseFloat(data[i].VALUE.toFixed(1));
                            break;
                        case 3:
                            data[i]["NO"] = i + 1;
                            data[i]["MAC_NAME"] = data[i].NAME;
                            data[i]["TYPE"] = lang.EmployeePerformance.Weeks;
                            data[i]["DATE"] = moment(data[i].DATE).format("YYYY") + "第" + data[i].WEEK + "周";
                            data[i]["VALUE"] = parseFloat(data[i].VALUE.toFixed(1));
                            break;
                        case 4:
                            data[i]["NO"] = i + 1;
                            data[i]["MAC_NAME"] = data[i].NAME;
                            data[i]["TYPE"] = lang.EmployeePerformance.Month;
                            data[i]["DATE"] = moment(data[i].DATE).format("YYYY-MM") + "月";
                            data[i]["VALUE"] = parseFloat(data[i].VALUE.toFixed(1));
                            break;
                        case 5:
                            data[i]["NO"] = i + 1;
                            data[i]["MAC_NAME"] = data[i].NAME;
                            data[i]["TYPE"] = lang.EmployeePerformance.Years;
                            data[i]["DATE"] = moment(data[i].DATE).format("YYYY");
                            data[i]["VALUE"] = parseFloat(data[i].VALUE.toFixed(1));
                            break;
                    }

                }

                $scope.resultData = data;
                grid = $("#grid").kendoGrid({
                    //toolbar: ["pdf", 'excel'],
                    columns: cols,
                    filterable: { mode: "row" },
                    dataSource: data,
                    height: $('body').height() - 50,
                    selectable: "row",
                    sortable: true,
                    resizable: true,
                    pageable: {
                        pageSize: 100,
                        pageSizes: [20, 30, 50, 100, 200, 500]
                    },
                    pdf: {
                        allPages: true
                    },
                    excel: {
                        allPages: true
                    }
                });
                var grid = $("#grid").data("kendoGrid");
                //grid.saveAsExcel();
                // grid.data("kendoGrid").dataSource.data($scope.resultData);
            } else {
                BzAlert(data.Message);
            }
        })
    });