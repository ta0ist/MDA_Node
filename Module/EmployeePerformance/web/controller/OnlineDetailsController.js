/**
 * Created by qb on 2016/11/29.
 */
app.controller('OnlineDetailsCtrl', function ($scope) {
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({
        format: "yyyy/MM/dd", value: moment().add('days', 1).format("YYYY/MM/DD")
    });

    var baseUrl = "/OnlineDetails/";
    var fields = {
        MAC_NAME: { type: "string" },
        MEM_NAME: { type: "string" },
        START_DATE: { type: "date" },
        END_DATE: { type: "date" },
        LOGIN_STATE: { type: "number" }
    };
    var cols = [];
    //cols.push({ field: "START_DATE", title: "开始日期", width: 80, sortable: true, filterable: false, filterable: { extra: false } });
    //cols.push({ field: "END_DATE", title: "结束日期", width: 80, sortable: true, filterable: false, filterable: { extra: false } });
    cols.push({ field: "MAC_NAME", title: "设备名称", width: 80, sortable: true, filterable: false, filterable: { extra: false } });
    cols.push({ field: "START_DATE", title: "登录日期", width: 120, format: "{0: yyyy/MM/dd HH:mm:ss}", sortable: true, filterable: false  });
    cols.push({ field: "END_DATE", title: "登出日期", width: 120, format: "{0: yyyy/MM/dd HH:mm:ss}", sortable: true, filterable: false });
    cols.push({ field: "MEM_NAME", title: "登录人员", width: 80, sortable: true, filterable: false, filterable: { extra: false } });
    cols.push({ field: "LOGIN_STATE", title: "事件", width: 80, sortable: true, filterable: false, template: kendo.template($("#LOGIN_STATE").html()) });


    var grid = $("#grid").grid({
        checkBoxColumn: false,
        baseUrl: baseUrl, //调用的URL
        selectable: "row multiple",//"single", //行选择方式
        //sort: [{ field: "USER_NBR", dir: "ASC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: false,
        //height: 300,
        resizeGridWidth: true,//列宽度可调
        isPage: true,
        customsearch: true,
        server: true, //服务器端刷新，包括排序，筛选等
        actionUrl: ["GetEmployeeUpDownLineDetailed", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            //PrimaryKey: "TASK_NBR",
            fields: fields,
            cols: cols
        }
    });

    $scope.search = function () {
        if ($("#startTime").data("kendoDatePicker").value() == null && $("#endTime").data("kendoDatePicker").value() == null) {
            BzAlert("请输入正确的日期");
            return;
        } else {
            grid.grid("refresh", function () {
                var query = [];
                if ($('#startTime').val() != "") {
                    query.push({ field: "START_DATE", Operator: "gte", value: $('#startTime').val() });
                }
                if ($('#endTime').val() != "") {
                    query.push({ field: "START_DATE", Operator: "lte", value: $('#endTime').val() });
                }
                return query;
            }, {
                logic: "and"
            });
        }

    }
});