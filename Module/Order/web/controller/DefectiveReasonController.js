/**
 * Created by qb on 2016/12/21.
 */
var baseUrl = '/DefectiveReason/';
$(function () {
    var fields = {
        INFERIOR_NO: { type: "string" },
        INFERIOR_NBR: { type: "string" },
        INFERIOR_NAME: { type: "string" },
        MEMO: { type: "string" }
    };
    var cols = [];
    cols.push({ field: "INFERIOR_NBR", title: "原因编号", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "INFERIOR_NO", title: "原因编号", width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "INFERIOR_NAME", title: "原因名称", width: 80, sortable: true, filterable: false });
    cols.push({ field: "MEMO", title: "备注", width: 80, sortable: true, filterable: { extra: false } });
    cols.push({
        command: [
            { name: "aa", text: '编辑' + '<i class="icon-edit"></i>', className: "btn purple", click: f_edit },
            { name: "bb", text: '删除' + '<i class="icon-remove-sign"></i>', className: "btn red ", click: f_delete }
        ],
        title: '操作', width: 200
    });

    grid = $("#grid").grid({
        //checkBoxColumn: true,
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        //sort: [{ field: "USER_NBR", dir: "ASC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: true,
        //resizeGridWidth: true,//列宽度可调
        isPage: false,
        toolbar: kendo.template($("#template").html()),
        server: false,
        //detailTemplate: kendo.template($("#detail-template").html()),

        actionUrl: ["getReason", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "INFERIOR_NBR",
            fields: fields,
            cols: cols
        }
    });

    $("#error_a").click(function (data) {
        $.x5window("新增", kendo.template($("#add").html()));
        $("#Save").click(function () {
            var INFERIOR_NO = $("#INFERIOR_NO").val();
            var INFERIOR_NAME = $("#INFERIOR_NAME").val();
            if (INFERIOR_NO == "" || INFERIOR_NAME == "")
            { BzAlert("基础数据没有填全！"); return }
            var inf={
                INFERIOR_NO:INFERIOR_NO,
                INFERIOR_NAME:INFERIOR_NAME,
                MEMO:$("#MEMO").val()
            }
            $.post(baseUrl + "addReason", inf, function (data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    grid.grid("refresh", []);
                }
                else {
                    BzAlert(data.Message);
                }
            })
        })
    })

    function f_edit(e) {
        $.x5window("编辑", kendo.template($("#add").html()));
        dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $("#INFERIOR_NO").val(dataItem.INFERIOR_NO);
        $("#INFERIOR_NAME").val(dataItem.INFERIOR_NAME);
        $("#MEMO").val(dataItem.MEMO);
        $("#Save").click(function () {
            var INFERIOR_NO = $("#INFERIOR_NO").val();
            var INFERIOR_NAME = $("#INFERIOR_NAME").val();
            if (INFERIOR_NO == "" || INFERIOR_NAME == "")
            { BzAlert("基础数据没有填全！"); return }
            var inf = {
                INFERIOR_NBR:dataItem.INFERIOR_NBR,
                INFERIOR_NO: INFERIOR_NO,
                INFERIOR_NAME: INFERIOR_NAME,
                MEMO: $("#MEMO").val()
            }
            $.post(baseUrl + "modifyReason", inf, function (data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    BzSuccess(data.Message);
                    grid.grid("refresh", []);
                }
                else {
                    BzAlert(data.Message);
                }
            })
        })
    }



    function f_delete(e) {
        dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        var data=dataItem.INFERIOR_NBR;
        $.post(baseUrl + "deleteReason", {inferior_nbr:data}, function (data) {
            if (data.Status == 0) {
                BzSuccess(data.Message);
                grid.grid("refresh", [])
            }
            else {
                BzAlert(data.Message);
            }
        })
    }
})