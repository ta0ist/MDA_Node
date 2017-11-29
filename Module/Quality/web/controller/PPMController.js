var baseUrl = '/PPM/';
var grid;
var dataItem;
$(function() {
    var fields = {
        PPM_NBR: { type: "int" }, //ID
        PPM_TARGET: { type: "decimal" }, //目标数
        PPM_ACTUAL: { type: "decimal" }, //实际数
        PPM_DATE: { type: "date" }, //日期（自选,无时间）
        PPM_TYPE: { type: "string" }, //类型（PPM/报废金额）
    };
    var cols = [];
    cols.push({ field: "PPM_NBR", title: "PPM_NBR", width: 150, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "PPM_TARGET", title: "目标数", width: 150, sortable: true, filterable: false });
    cols.push({ field: "PPM_ACTUAL", title: "实际数", width: 150, sortable: true, filterable: false });
    cols.push({ field: "PPM_TYPE", title: "类型", width: 150, sortable: true, filterable: false });
    cols.push({ field: "PPM_DATE", title: "日期", width: 150, sortable: true, filterable: false, format: "{0: yyyy/MM/dd}" });
    cols.push({
        command: [
            { name: "aa", text: lang.Quality.Edit + '<i class="icon-edit"></i>', className: "btn green", click: f_edit },
            { name: "bb", text: lang.Quality.Delete + '<i class="icon-remove-sign"></i>', className: "btn red ", click: f_delete },
        ],
        title: lang.Quality.Operator,
        width: 250
    });

    grid = $("#grid").grid({
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: true,
        isPage: true,
        server: true,
        customsearch: true,
        actionUrl: ["WebLookup", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "PPM_NBR",
            fields: fields,
            cols: cols
        }
    });

    //新增
    $("#error_a").click(function(data) {
        $.x5window(lang.Quality.Add, kendo.template($("#add").html()));
        $("#PPM_DATE").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });

        $("#Save").click(function() {
            var model = {
                PPM_TARGET: $('#PPM_TARGET').val(),
                PPM_ACTUAL: $('#PPM_ACTUAL').val(),
                PPM_DATE: $('#PPM_DATE').val(),
                PPM_TYPE: $('#PPM_TYPE').val(),
            }

            $.post(baseUrl + "Add", model, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    refreshgrid()
                } else {
                    BzAlert(data.Message);
                }
            })
        })
    })

    //编辑
    function f_edit(e) {
        $.x5window(lang.Quality.Edit, kendo.template($("#add").html()));
        dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $("#PPM_DATE").kendoDatePicker({ format: "yyyy/MM/dd", value: moment(dataItem.PPM_DATE).format("YYYY/MM/DD") });
        $("#PPM_TARGET").val(dataItem.PPM_TARGET);
        $("#PPM_ACTUAL").val(dataItem.PPM_ACTUAL);
        $("#PPM_TYPE").val(dataItem.PPM_TYPE);
        $("#PPM_DATE").val(moment(dataItem.PPM_DATE).format("YYYY/MM/DD"));

        $("#Save").click(function() {
            var model = {
                PPM_NBR: dataItem.PPM_NBR,
                PPM_TARGET: $('#PPM_TARGET').val(),
                PPM_ACTUAL: $('#PPM_ACTUAL').val(),
                PPM_TYPE: $('#PPM_TYPE').val(),
                PPM_DATE: $('#PPM_DATE').val(),
            }

            $.post(baseUrl + "Update", model, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    refreshgrid();
                } else {
                    BzAlert(data.Message);
                }
            })
        })
    }

    //删除
    function f_delete(e) {
        dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $.post(baseUrl + "Delete", { PPM_NBR: dataItem.PPM_NBR }, function(data) {
            if (data.Status == 0) {
                BzSuccess(data.Message);
                refreshgrid();
            } else {
                BzAlert(data.Message);
            }
        })
    }

    //--------------------------------------------------------------------------查询
    $("#output").click(function(data) {
        refreshgrid();
    })


    //刷新grid
    function refreshgrid() {
        grid.grid("refresh", function() {
            return [
                { field: "PPM_TYPE", Operator: "contains", value: $('#filter').val() },
            ]
        });
    }

})