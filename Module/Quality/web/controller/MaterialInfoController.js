var baseUrl = '/MaterialInfo/';
var grid;
var dataItem;
$(function() {
    var fields = {
        MATERIEL_NBR: { type: "int" }, //ID
        MATERIEL_NO: { type: "string" }, //型号
        MATERIEL_NAME: { type: "string" }, //描述
        CAST_NO: { type: "string" }, //对应铸件型号
        CAST_NAME: { type: "string" }, //对应铸件描述
        SUPPLIER: { type: "string" }, //供应商
    };
    var cols = [];
    cols.push({ field: "MATERIEL_NBR", title: "MATERIEL_NBR", width: 150, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "MATERIEL_NO", title: "型号", width: 150, sortable: true, filterable: false });
    cols.push({ field: "MATERIEL_NAME", title: "描述", width: 150, sortable: true, filterable: false });
    cols.push({ field: "CAST_NO", title: "对应铸件型号", width: 150, sortable: true, filterable: false });
    cols.push({ field: "CAST_NAME", title: "对应铸件描述", width: 150, sortable: true, filterable: false });
    cols.push({ field: "SUPPLIER", title: "供应商", width: 150, sortable: true, filterable: false });
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
        actionUrl: ["Lookup", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "MATERIEL_NBR",
            fields: fields,
            cols: cols
        }
    });

    //新增
    $("#error_a").click(function(data) {
        $.x5window(lang.Quality.Add, kendo.template($("#add").html()));
        $("#Save").click(function() {
            var model = {
                MATERIEL_NO: $('#MATERIEL_NO').val(),
                MATERIEL_NAME: $('#MATERIEL_NAME').val(),
                SUPPLIER: $('#SUPPLIER').val(),
                CAST_NO: $('#CAST_NO').val(),
                CAST_NAME: $('#CAST_NAME').val(),
            }

            $.post(baseUrl + "AddMateriel", model, function(data) {
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
        $("#MATERIEL_NO").val(dataItem.MATERIEL_NO);
        $("#MATERIEL_NAME").val(dataItem.MATERIEL_NAME);
        $("#SUPPLIER").val(dataItem.SUPPLIER);
        $("#CAST_NO").val(dataItem.CAST_NO);
        $("#CAST_NAME").val(dataItem.CAST_NAME);

        $("#Save").click(function() {
            var model = {
                MATERIEL_NBR: dataItem.MATERIEL_NBR,
                MATERIEL_NO: $('#MATERIEL_NO').val(),
                MATERIEL_NAME: $('#MATERIEL_NAME').val(),
                SUPPLIER: $('#SUPPLIER').val(),
                CAST_NO: $('#CAST_NO').val(),
                CAST_NAME: $('#CAST_NAME').val(),
            }

            $.post(baseUrl + "UpdMateriel", model, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    $('#MATERIAL_NOS').val('')
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
        $.post(baseUrl + "DelMateriel", { id: dataItem.MATERIEL_NBR }, function(data) {
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
        dataItem = null;
        refreshgrid();
    })

    //刷新grid
    function refreshgrid() {
        grid.grid("refresh", function() {
            return [
                { field: "MATERIEL_NO", Operator: "contains", value: $('#MATERIAL_NOS').val() },
                { field: "MATERIEL_NAME", Operator: "contains", value: $('#MATERIAL_NOS').val() },
            ]
        }, {
            logic: "or"
        });
    }
})