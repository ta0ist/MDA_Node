/**
 * Created by qb on 2016/11/30.
 */
angular.module('app', [])
    .controller('appCtrl', function($scope) {
        var baseUrl = $.getparam("url"),
            par = $.getparam("par"),
            groupOrMac = $.getparam("groupOrMac"); //1 设备   2 设备组
        $scope.shift = 0;


        var fields = {
            MEM_NAME: { type: "string" },
            DAYS: { type: "string" },
            TYPE: { type: "string" },
            SHIFT_NAME: { type: "string" },
            MAC_NAME: { type: "string" },
            PROD_COUNT: { type: "number" },
            OP_TIME: { type: "string" },
            Average: { type: "number" },
            HOURS: { type: "number" }
        };

        //MAC_NAME: "数控铣床3"  设备名称
        //MAC_NBR: 12 设备编号
        //MEM_NAME: "王五"  人员
        //MEM_NBR: 12
        //OP_TIME: 33264  工作总量
        //PROD_COUNT: 87  产量
        //SHIFT_DAY: "/Date(1439568000000)/"  时间
        //SHIFT_NAME: null
        //SHIFT_NBR: null
        //WEEK: null
        var cols = [];
        cols.push({
            field: "MEM_NAME",
            title: lang.EmployeePerformance.Personnel,
            width: 100,
            sortable: true,
            filterable: {
                cell: {
                    template: function(args) {
                        args.element.kendoDropDownList({
                            dataSource: args.dataSource,
                            dataTextField: "MEM_NAME",
                            dataValueField: "MEM_NAME",
                            valuePrimitive: true
                        });
                    },
                    showOperators: false
                }
            },
            hidden: false
        });
        cols.push({
            field: "DAYS",
            title: lang.EmployeePerformance.Date,
            width: 100,
            sortable: true,
            filterable: {
                cell: {
                    template: function(args) {
                        args.element.kendoDropDownList({
                            dataSource: args.dataSource,
                            dataTextField: "DAYS",
                            dataValueField: "DAYS",
                            valuePrimitive: true
                        });
                    },
                    showOperators: false
                }
            },
            hidden: false
        });
        cols.push({ field: "TYPE", title: lang.EmployeePerformance.StatisticalMethods, width: 80, sortable: true, filterable: false });
        cols.push({ field: "SHIFT_NAME", title: lang.EmployeePerformance.Shift, width: 80, sortable: true, filterable: false });
        cols.push({
            field: "MAC_NAME",
            title: lang.EmployeePerformance.DeviceName,
            width: 100,
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
            }
        });
        cols.push({ field: "Average", title: lang.EmployeePerformance.AverageYield, width: 80, sortable: true, filterable: false });
        cols.push({ field: "PROD_COUNT", title: lang.EmployeePerformance.Production, width: 80, sortable: true, filterable: false });
        cols.push({ field: "HOURS", title: lang.EmployeePerformance.AverageTime, width: 80, sortable: true, filterable: false });
        cols.push({ field: "OP_TIME", title: lang.EmployeePerformance.DurationTime, width: 80, sortable: true, filterable: false });
        //cols.push({
        //    field: "RATE", title: "比例", width: 50, sortable: true, filterable: false, attributes: {
        //        "class": "table-cell",
        //        style: "text-align: right;"
        //    }
        //});


        $.post(baseUrl, JSON.parse(par), function(rdata) {
            if (rdata.Status == 0) {
                var tdata = rdata.Data;
                var sdata = _.groupBy(tdata, 'MEM_NAME')
                var data = [];
                var TIME = 0,
                    hours = 0;
                var jieguo = 0;
                //for (var i = 0; i < tdata.length; i++) {
                //    jieguo = jieguo + tdata[i].OP_TIME;
                //    TIME = parseInt(jieguo / (i + 1));
                //    formatTime(TIME);
                //}

                $.each(sdata, function(p1, p2) {
                    var average = 0,
                        total = 0;
                    var times = 0,
                        avertimes = 0;
                    for (var i = 0; i < p2.length; i++) {
                        total = total + p2[i].PROD_COUNT;
                        avertimes = avertimes + p2[i].OP_TIME;

                    }
                    average = (total / p2.length).toFixed(1);
                    times = (avertimes / p2.length).toFixed(0);
                    formatTime(times);
                    //total = total + tdata[i].PROD_COUNT;
                    //average = (total / tdata.length).toFixed(1);


                    switch (jQuery.parseJSON(par).searchtype) {
                        case 1:
                            for (var i = 0; i < p2.length; i++) {


                                var PROD_COUNT = PROD_COUNT + p2[i].PROD_COUNT;
                                var tjson = {};
                                tjson["MEM_NAME"] = p2[i].MEM_NAME;
                                tjson["DAYS"] = moment(p2[i].SHIFT_DAY).format('YYYY-MM-DD');;
                                tjson["TYPE"] = lang.EmployeePerformance.Shift;
                                tjson["SHIFT_NAME"] = p2[i].SHIFT_NAME;
                                tjson["MAC_NAME"] = p2[i].MAC_NAME;
                                tjson["PROD_COUNT"] = p2[i].PROD_COUNT;
                                tjson["OP_TIME"] = formatTime(p2[i].OP_TIME);
                                tjson["Average"] = average;
                                tjson["HOURS"] = formatTime(times);

                                data.push(tjson);
                            }

                            break;
                        case 2:
                            for (var i = 0; i < p2.length; i++) {
                                var OP = p2[i].OP_TIME;
                                var tjson = {};
                                tjson["MEM_NAME"] = p2[i].MEM_NAME;
                                tjson["DAYS"] = moment(p2[i].SHIFT_DAY).format('YYYY-MM-DD');
                                tjson["TYPE"] = lang.EmployeePerformance.Day;
                                tjson["SHIFT_NAME"] = "";
                                tjson["MAC_NAME"] = p2[i].MAC_NAME;
                                tjson["PROD_COUNT"] = p2[i].PROD_COUNT;
                                tjson["OP_TIME"] = formatTime(p2[i].OP_TIME);
                                tjson["Average"] = average;
                                tjson["HOURS"] = formatTime(times);
                                data.push(tjson);
                            }
                            break;
                        case 3:
                            for (var i = 0; i < p2.length; i++) {
                                var tjson = {};
                                tjson["MEM_NAME"] = p2[i].MEM_NAME;
                                tjson["DAYS"] = moment(p2[i].SHIFT_DAY).format('YYYY-') + lang.EmployeePerformance.The + p2[i].WEEK + lang.EmployeePerformance.TempWeek;
                                tjson["TYPE"] = lang.EmployeePerformance.Weeks;
                                tjson["SHIFT_NAME"] = "";
                                tjson["MAC_NAME"] = p2[i].MAC_NAME;
                                tjson["PROD_COUNT"] = p2[i].PROD_COUNT;
                                tjson["OP_TIME"] = formatTime(p2[i].OP_TIME);
                                tjson["Average"] = average;
                                tjson["HOURS"] = formatTime(times);
                                data.push(tjson);
                            }
                            break;
                        case 4:
                            for (var i = 0; i < p2.length; i++) {
                                var tjson = {};
                                tjson["MEM_NAME"] = p2[i].MEM_NAME;
                                tjson["DAYS"] = moment(p2[i].SHIFT_DAY).format('YYYY-MM') + lang.EmployeePerformance.Month;
                                tjson["TYPE"] = lang.EmployeePerformance.Month;
                                tjson["SHIFT_NAME"] = "";
                                tjson["MAC_NAME"] = p2[i].MAC_NAME;
                                tjson["PROD_COUNT"] = p2[i].PROD_COUNT;
                                tjson["OP_TIME"] = formatTime(p2[i].OP_TIME);
                                tjson["Average"] = average;
                                tjson["HOURS"] = formatTime(times);
                                data.push(tjson);
                            }
                            break;
                        case 5:
                            for (var i = 0; i < p2.length; i++) {
                                var tjson = {};
                                tjson["MEM_NAME"] = p2[i].MEM_NAME;
                                tjson["DAYS"] = moment(p2[i].SHIFT_DAY).format('YYYY') + lang.EmployeePerformance.Years;
                                tjson["TYPE"] = lang.EmployeePerformance.Years;
                                tjson["SHIFT_NAME"] = "";
                                tjson["MAC_NAME"] = p2[i].MAC_NAME;
                                tjson["PROD_COUNT"] = p2[i].PROD_COUNT;
                                tjson["OP_TIME"] = formatTime(p2[i].OP_TIME);
                                tjson["Average"] = average;
                                tjson["HOURS"] = formatTime(times);
                                data.push(tjson);
                            }
                            break;

                    }
                })

                $scope.resultData = data;
                grid = $("#grid").kendoGrid({
                    //toolbar: ["pdf", 'excel'],
                    columns: cols,
                    filterable: { mode: "row" },
                    dataSource: data,
                    height: window.innerHeight - 80,
                    selectable: "row",
                    pageable: {
                        pageSize: 20,
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
                //grid.data("kendoGrid").dataSource.data($scope.resultData);
            } else {
                BzAlert(data.Message);
            }

        })
    });

function formatTime(OP) {

    // 计算
    //var b=8462;
    var h = 0,
        i = 0,
        s = parseInt(OP);
    if (s > 60) {
        i = parseInt(s / 60);
        s = parseInt(s % 60);
        if (i > 60) {
            h = parseInt(i / 60);
            i = parseInt(i % 60);
        }
    }
    // 补零
    var zero = function(v) {
        return (v >> 0) < 10 ? "0" + v : v;
    };
    return [zero(h), zero(i), zero(s)].join(":");
};