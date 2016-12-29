/**
 * Created by qb on 2016/11/30.
 */
angular.module('app', [])
    .controller('appCtrl', function ($scope) {

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
            STATU_NAME: { type: "string" },
            DURATION: { type: "string" },
            RATE: { type: "string" }
        };
        var cols = [];
        cols.push({
            field: "MEM_NAME", title: "人员", width: 100, sortable: true, filterable: {
                cell: {
                    template: function (args) {
                        args.element.kendoDropDownList({
                            dataSource: args.dataSource,
                            dataTextField: "MEM_NAME",
                            dataValueField: "MEM_NAME",
                            valuePrimitive: true
                        });
                    },
                    showOperators: false
                }
            }, hidden: false
        });
        cols.push({
            field: "DAYS", title: "日期", width: 100, sortable: true, filterable: {
                cell: {
                    template: function (args) {
                        args.element.kendoDropDownList({
                            dataSource: args.dataSource,
                            dataTextField: "DAYS",
                            dataValueField: "DAYS",
                            valuePrimitive: true
                        });
                    },
                    showOperators: false
                }
            }, hidden: false
        });
        cols.push({ field: "TYPE", title: "统计方式", width: 80, sortable: true, filterable: false });
        cols.push({ field: "SHIFT_NAME", title: "班次", width: 80, sortable: true, filterable: false });
        cols.push({
            field: "MAC_NAME", title: "设备名称", width: 100, sortable: true, filterable: {
                cell: {
                    template: function (args) {
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
        cols.push({ field: "STATU_NAME", title: "状态", width: 80, sortable: true, filterable: false });
        cols.push({ field: "DURATION", title: "持续时间", width: 80, sortable: true, filterable: false });
        cols.push({ field: "RATE", title: "比例", width: 120, sortable: true, filterable: false, template: kendo.template($("#RATE-template").html()) });
        cols.push({
            field: "RATE", title: "比例", width: 50, sortable: true, filterable: false, attributes: {
                "class": "table-cell",
                style: "text-align: right;"
            }, template: kendo.template($("#RATE-template1").html())
        });


        $.post(baseUrl,JSON.parse(par), function (rdata) {
            if (rdata.Status == 0) {
                var tdata = rdata.Data;
                var data = [];

                for (var i = 0; i < tdata.length; i++) {

                    switch (jQuery.parseJSON(par).posttype) {
                        case 1:
                            for (var pp = 0; pp < tdata[i].StatuRates.length; pp++) {
                                var tjson = {};
                                tjson["MEM_NAME"] = tdata[i].MEM_NAME;
                                tjson["DAYS"] = moment(tdata[i].DAYS).format('YYYY-MM-DD');
                                tjson["TYPE"] = "班次";
                                tjson["SHIFT_NAME"] = tdata[i].SHIFT_NAME;
                                tjson["MAC_NAME"] = tdata[i].MAC_NAME;
                                tjson["STATU_NAME"] = tdata[i].StatuRates[pp].STATU_NAME;
                                tjson["DURATION"] = formatSeconds(tdata[i].StatuRates[pp].DURATION);
                                tjson["RATE"] = parseFloat((tdata[i].StatuRates[pp].Rate * 100).toFixed(1));
                                data.push(tjson);
                            }
                            break;
                        case 2:
                            for (var pp = 0; pp < tdata[i].StatuRates.length; pp++) {
                                var tjson = {};
                                tjson["MEM_NAME"] = tdata[i].MEM_NAME;
                                tjson["DAYS"] = moment(tdata[i].DAYS).format('YYYY-MM-DD');
                                tjson["TYPE"] = "日";
                                tjson["SHIFT_NAME"] = "";
                                tjson["MAC_NAME"] = tdata[i].MAC_NAME;
                                tjson["STATU_NAME"] = tdata[i].StatuRates[pp].STATU_NAME;
                                tjson["DURATION"] = formatSeconds(tdata[i].StatuRates[pp].DURATION);
                                tjson["RATE"] = parseFloat((tdata[i].StatuRates[pp].Rate * 100).toFixed(1));
                                data.push(tjson);
                            }
                            break;
                        case 3:
                            for (var pp = 0; pp < tdata[i].StatuRates.length; pp++) {
                                var tjson = {};
                                tjson["MEM_NAME"] = tdata[i].MEM_NAME;
                                tjson["DAYS"] = moment(tdata[i].DAYS).format('YYYY-') + "第" + tdata[i].WEEK + "周";
                                tjson["TYPE"] = "周";
                                tjson["SHIFT_NAME"] = "";
                                tjson["MAC_NAME"] = tdata[i].MAC_NAME;
                                tjson["STATU_NAME"] = tdata[i].StatuRates[pp].STATU_NAME;
                                tjson["DURATION"] = formatSeconds(tdata[i].StatuRates[pp].DURATION);
                                tjson["RATE"] = parseFloat((tdata[i].StatuRates[pp].Rate * 100).toFixed(1));
                                data.push(tjson);
                            }
                            break;
                        case 4:
                            for (var pp = 0; pp < tdata[i].StatuRates.length; pp++) {
                                var tjson = {};
                                tjson["MEM_NAME"] = tdata[i].MEM_NAME;
                                tjson["DAYS"] = moment(tdata[i].DAYS).format('YYYY-MM') + "月";
                                tjson["TYPE"] = "月";
                                tjson["SHIFT_NAME"] = "";
                                tjson["MAC_NAME"] = tdata[i].MAC_NAME;
                                tjson["STATU_NAME"] = tdata[i].StatuRates[pp].STATU_NAME;
                                tjson["DURATION"] = formatSeconds(tdata[i].StatuRates[pp].DURATION);
                                tjson["RATE"] = parseFloat((tdata[i].StatuRates[pp].Rate * 100).toFixed(1));
                                data.push(tjson);
                            }
                            break;
                        case 5:
                            for (var pp = 0; pp < tdata[i].StatuRates.length; pp++) {
                                var tjson = {};
                                tjson["MEM_NAME"] = tdata[i].MEM_NAME;
                                tjson["DAYS"] = moment(tdata[i].DAYS).format('YYYY') + "年";
                                tjson["TYPE"] = "年";
                                tjson["SHIFT_NAME"] = "";
                                tjson["MAC_NAME"] = tdata[i].MAC_NAME;
                                tjson["STATU_NAME"] = tdata[i].StatuRates[pp].STATU_NAME;
                                tjson["DURATION"] = formatSeconds(tdata[i].StatuRates[pp].DURATION);
                                tjson["RATE"] = parseFloat((tdata[i].StatuRates[pp].Rate * 100).toFixed(1));
                                data.push(tjson);
                            }
                            break;
                    }

                }

                $scope.resultData = data;
                grid = $("#grid").kendoGrid({
                    //toolbar: ["pdf", 'excel'],
                    columns: cols,
                    filterable: { mode: "row" },
                    dataSource: data,
                    height: window.innerHeight-80,
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
            }
            else {
                BzAlert(data.Message);
            }
        })
    });

function formatSeconds(value) {
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var result = "" + parseInt(theTime) + "秒";
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
    }
    return result;
}