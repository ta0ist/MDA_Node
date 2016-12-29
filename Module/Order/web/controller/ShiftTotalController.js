/**
 * Created by qb on 2016/12/21.
 */
var resultData;
var baseUrl = "/ShiftTotal/";

//$(function () {
$("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
$("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });

var fields = {
    //SHIFT_DAY: { type: "string" },
    SHIFT_NAME: { type: "string" },
    // MEN_NO: { type: "string" },
    MEM_NAME: { type: "string" },
    TASK_NO: { type: "string" },
    PLAN_TYPE: { type: "string" },
    PROD_NAME: { type: "string" },
    PROC_NO: { type: "string" },
    PROC_NAME: { type: "string" },
    MAC_NAME: { type: "string" },
    RUN_TIME: { type: "string" },
    STOP_TIME: { type: "string" },
    PROD_COUNT: { type: "string" },
    Message: { type: "string" }
};
var cols = [];
// cols.push({ field: "SHIFT_DAY", title: "日期", width: 80, sortable: true, filterable: false, hidden: false });
cols.push({ field: "SHIFT_NAME", title: "班次名称", width: 80, sortable: true, filterable: { extra: false }, hidden: false });
//cols.push({
//    field: "MEN_NO", title: "人员编号", width: 80, sortable: true, filterable: { extra: false }, hidden: false
//});
cols.push({ field: "MEM_NAME", title: "人员名称", width: 80, sortable: true, filterable: false, hidden: false });
cols.push({ field: "TASK_NO", title: "生产计划", width: 80, sortable: true, filterable: false });
cols.push({ field: "PLAN_TYPE", title: "计划类型", width: 80, sortable: true, filterable: { extra: false } });
cols.push({ field: "PROD_NAME", title: "产品名称", width: 80, sortable: true, filterable: false });
cols.push({ field: "PROC_NO", title: "工序编号", width: 80, sortable: true, filterable: false });
cols.push({ field: "PROC_NAME", title: "工序名称", width: 80, sortable: true, filterable: false });
cols.push({ field: "MAC_NAME", title: "设备名称", width: 80, sortable: true, filterable: false });
cols.push({ field: "RUN_TIME", title: "运行用时", width: 80, sortable: true, filterable: false });
cols.push({ field: "STOP_TIME", title: "停机用时", width: 80, sortable: true, filterable: false });
cols.push({ field: "PROD_COUNT", title: "产出", width: 80, sortable: true, filterable: false });
//cols.push({ field: "Message", title: "备注", width: 80, sortable: true, filterable: false });

grid = $("#grid").grid({
    // checkBoxColumn: false,
    baseUrl: baseUrl, //调用的URL
    selectable: "single",//"single", //行选择方式
    //sort: [{ field: "USER_NBR", dir: "ASC" }],
    scrollable: true,
    editable: false, //是否可编辑
    autoBind: false,
    //height: 300,
    //resizeGridWidth: true,//列宽度可调
    isPage: true,
    customsearch: true,
    server: true, //服务器端刷新，包括排序，筛选等
    actionUrl: ["getShiftStaff", "", "", ""], //读、新增、更改、删除的URLaction
    custom: {
        //PrimaryKey: "TASK_NBR",
        fields: fields,
        cols: cols
    }
});


$("#contextPage").resize(function () {
    grid.data("bz-grid").resizeGridWidth();
});




    app.controller('appCtrl', function ($scope, $http) {
        $scope.search = function () {
            var data = {
                start_time: $("#startTime").val(),
                end_time: moment($("#endTime").val()).add('days', 1).format('YYYY-MM-DD'),
            }
            if ($("#startTime").data("kendoDatePicker").value() == null || $("#endTime").data("kendoDatePicker").value() == null) {
                BzAlert("请输入正确的日期");
                return;
            }
            grid.grid("refresh", function () {
                return [
                    { field: "SHIFT_DAY", Operator: "gte", value: $("#startTime").val() },
                    { field: "SHIFT_DAY", Operator: "lt", value: moment($("#endTime").val()).add('days',1).format('YYYY-MM-DD') }
                ]
            }, { logic: "and" });

            $.post('/ShiftTotal/getDefectiveRateByDate', data, function (data) {
                $('.block').css('display', 'block');
                //var data = {
                //    "Status": 0,
                //    "Data": {
                //        "MAC": [
                //            { "MAC_NO": "XX2301", "MAC_NAME": "王xx", "SHIFT_NBR": "E1005", "SHIFT_NAME": "白班", "YIELD": "44", "RUN_TIME": "54", "STOP_TIME": 10 },
                //            { "MAC_NO": "XX2322", "MAC_NAME": "李xx", "SHIFT_NBR": "E1006", "SHIFT_NAME": "晚班", "YIELD": "27", "RUN_TIME": "47", "STOP_TIME": 20 },
                //            { "MAC_NO": "XX2303", "MAC_NAME": "找xx", "SHIFT_NBR": "E1007", "SHIFT_NAME": "白班", "YIELD": "47", "RUN_TIME": "35", "STOP_TIME": 12 },
                //            { "MAC_NO": "XX2324", "MAC_NAME": "孙xx", "SHIFT_NBR": "E1008", "SHIFT_NAME": "晚班", "YIELD": "24", "RUN_TIME": "42", "STOP_TIME": 18 },
                //        ],
                //        "MEN": [
                //            { "MEN_NO": "XX2304", "MEN_NAME": "yy56", "SHIFT_NBR": "234ET", "SHIFT_NAME": "白班", "YIELD": "154", "RUN_TIME": "164", "STOP_TIME": 10 },
                //            { "MEN_NO": "XX2103", "MEN_NAME": "yy57", "SHIFT_NBR": "235ET", "SHIFT_NAME": "晚班", "YIELD": "156", "RUN_TIME": "112", "STOP_TIME": 44 },
                //            { "MEN_NO": "XX2302", "MEN_NAME": "yy58", "SHIFT_NBR": "236ET", "SHIFT_NAME": "白班", "YIELD": "151", "RUN_TIME": "160", "STOP_TIME": 9 },
                //            { "MEN_NO": "XX2101", "MEN_NAME": "yy59", "SHIFT_NBR": "237ET", "SHIFT_NAME": "晚班", "YIELD": "152", "RUN_TIME": "112", "STOP_TIME": 23 },
                //        ]
                //    },
                //    "Message": "操作成功"
                //};
                var mac = [], tjion = [];
                if (data.Status == 0) {
                    // BzSuccess(data.Message);
                    var maxYd = [], maxRm = [], maxSm = [];
                    for (var i = 0; i < data.Data.MacData.length; i++) {
                        maxYd.push(data.Data.MacData[i].YIELD);
                        maxRm.push(data.Data.MacData[i].RUN_TIME);
                        maxSm.push(data.Data.MacData[i].STOP_TIME);
                    }
                    var max1 = maxYd[0], max2 = maxRm[0], max3 = maxSm[0];
                    for (var i = 1; i < maxYd.length; i++) {
                        if (max1 < maxYd[i]) max1 = maxYd[i];
                    }
                    for (var i = 1; i < maxRm.length; i++) {
                        if (max2 < maxRm[i]) max2 = maxRm[i];
                    }
                    for (var i = 1; i < maxSm.length; i++) {
                        if (max3 < maxSm[i]) max3 = maxSm[i];
                    }
                    for (var i = 0; i < data.Data.MacData.length; i++) {
                        var cc = {};
                        cc.MAC_NAME = data.Data.MacData[i].MAC_NAME;
                        cc.MAC_NO = data.Data.MacData[i].MAC_NO;
                        cc.SHIFT_NAME = data.Data.MacData[i].SHIFT_NAME;
                        if (max1 == 0) {
                            cc.YIELDB = "0%";
                        }
                        else {
                            cc.YIELDB = (data.Data.MacData[i].YIELD / max1 * 100).toFixed(2) + '%';
                        }

                        if (max2 == 0) {
                            cc.RUN_TIMEB = "0%";
                        }
                        else {
                            cc.RUN_TIMEB = (data.Data.MacData[i].RUN_TIME / max2 * 100).toFixed(2) + '%';
                        }

                        if (max3 == 0) {
                            cc.STOP_TIMEB = "0%";
                        }
                        else {
                            cc.STOP_TIMEB = (data.Data.MacData[i].STOP_TIME / max3 * 100).toFixed(2) + '%';
                        }
                        cc.YIELD = data.Data.MacData[i].YIELD;
                        cc.RUN_TIME = formatTime(data.Data.MacData[i].RUN_TIME);
                        cc.STOP_TIME = formatTime(data.Data.MacData[i].STOP_TIME);
                        mac.push(cc);
                    }

                    var maxYmd = [], maxRmm = [], maxSmm = [];
                    for (var i = 0; i < data.Data.MemData.length; i++) {
                        maxYmd.push(data.Data.MemData[i].YIELD);
                        maxRmm.push(data.Data.MemData[i].RUN_TIME);
                        maxSmm.push(data.Data.MemData[i].STOP_TIME);
                    }
                    var maxa = maxYmd[0], maxb = maxRmm[0], maxc = maxSmm[0];
                    for (var i = 1; i < maxYmd.length; i++) {
                        if (maxa < maxYmd[i])
                            maxa = maxYmd[i];
                    }

                    for (var i = 1; i < maxRmm.length; i++) {
                        if (maxb < maxRmm[i])
                            maxb = maxRmm[i];
                    }
                    for (var i = 1; i < maxSmm.length; i++) {
                        if (maxc < maxSmm[i])
                            maxc = maxSmm[i];
                    }


                    for (var i = 0; i < data.Data.MemData.length; i++) {
                        var dd = {};
                        dd.MEN_NO = data.Data.MemData[i].MEN_NO;
                        dd.MEN_NAME = data.Data.MemData[i].MEN_NAME;
                        dd.SHIFT_NAME = data.Data.MemData[i].SHIFT_NAME;
                        if (maxa == 0) {
                            dd.YIELDB = "0%";
                        }
                        else {
                            dd.YIELDB = (data.Data.MemData[i].YIELD / maxa * 100).toFixed(2) + '%';
                        }

                        if (maxb == 0) {
                            dd.RUN_TIMEB = "0%";
                        }
                        else {
                            dd.RUN_TIMEB = (data.Data.MemData[i].RUN_TIME / maxb * 100).toFixed(2) + '%';
                        }


                        if (maxc == 0) {
                            dd.STOP_TIMEB = "0%";
                        }
                        else {
                            dd.STOP_TIMEB = (data.Data.MemData[i].STOP_TIME / maxc * 100).toFixed(2) + '%';
                        }

                        dd.YIELD = data.Data.MemData[i].YIELD;
                        dd.RUN_TIME = formatTime(data.Data.MemData[i].RUN_TIME);
                        dd.STOP_TIME = formatTime(data.Data.MemData[i].STOP_TIME);
                        tjion.push(dd);

                    }
                    $scope.items = mac;
                    $scope.conts = tjion;
                    $scope.$apply();

                }
            })
        }


    })

function formatTime(OP) {

    // 计算
    //var b=8462;
    var h = 0, i = 0, s = parseInt(OP);
    if (s > 60) {
        i = parseInt(s / 60);
        s = parseInt(s % 60);
        if (i > 60) {
            h = parseInt(i / 60);
            i = parseInt(i % 60);
        }
    }
    // 补零
    var zero = function (v) {
        return (v >> 0) < 10 ? "0" + v : v;
    };
    return [zero(h), zero(i), zero(s)].join(":");
};