var grid;
var baseUrl = '/toolConfig/r/';
var groupOrMachine;
$(function() {
        showGrid('getTool', "");






        // var fields = {
        //     ID: { type: "string" },
        //     Line: { type: "string" },
        //     Part_Name: { type: "string" },
        //     Process: { type: "string" },
        //     Product_Model: { type: "string" },
        //     Program: { type: "string" }
        // };
        // var cols = [];
        // cols.push({ field: "ID", title: 'ID', width: 80, sortable: true, filterable: false, hidden: true });
        // cols.push({ field: "Line", title: '产线', width: 80, sortable: true, filterable: false, hidden: false });
        // cols.push({ field: "Part_Name", title: '产品名称', width: 80, sortable: true, filterable: false });
        // cols.push({ field: "Process", title: 'Process', width: 80, sortable: true, filterable: false });
        // cols.push({ field: "Product_Model", title: 'Product_Model', width: 80, sortable: true, filterable: false });
        // cols.push({ field: "Program", title: "Program", width: 80, sortable: true, filterable: false });
        // cols.push({
        //     command: [
        //         { name: "aa", text: lang.Order.Edit + '<i class="icon-edit"></i>', className: "btn purple", click: edit },
        //         { name: "bb", text: lang.Order.Delete + '<i class="icon-remove-sign"></i>', className: "btn red ", click: Delete }
        //     ],
        //     title: lang.Order.Operation,
        //     width: 200
        // });

        // grid = $("#grid").grid({
        //     checkBoxColumn: true,
        //     baseUrl: baseUrl, //调用的URL
        //     selectable: "single", //行选择方式
        //     //sort: [{ field: "USER_NBR", dir: "ASC" }],
        //     scrollable: true,
        //     editable: false, //是否可编辑
        //     autoBind: true,
        //     //resizeGridWidth: true,//列宽度可调
        //     isPage: true,
        //     //toolbar: kendo.template($("#template").html()),
        //     server: false,
        //     //detailTemplate: kendo.template($("#detail-template").html()),

        //     actionUrl: ["getTool", "", "", "DelList"], //读、新增、更改、删除的URLaction
        //     custom: {
        //         PrimaryKey: "ID",
        //         fields: fields,
        //         cols: cols
        //     }
        // });
    })
    /*******GIRD*********/
function showGrid(url, str) {
    var cols = [];
    cols.push({ field: "ID", title: 'ID', width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "GP_NAME", title: 'Line', width: 80, sortable: true, filterable: false, hidden: false });
    cols.push({ field: "Part_Name", title: 'Part Name', width: 80, sortable: true, filterable: false });
    cols.push({ field: "Process", title: 'Process', width: 80, sortable: true, filterable: false });
    cols.push({ field: "Product_Model", title: 'Product Model', width: 80, sortable: true, filterable: false });
    cols.push({ field: "Program", title: "Program", width: 80, sortable: true, filterable: false });
    cols.push({
        command: [
            { name: "aa", text: lang.Order.Edit + '<i class="icon-edit"></i>', className: "btn purple", click: edit },
            { name: "bb", text: lang.Order.Delete + '<i class="icon-remove-sign"></i>', className: "btn red ", click: Delete },
            { name: "cc", text: '查看详情' + '<i class="icon-share-alt"></i>', className: "btn green ", click: skip }
        ],
        title: lang.Order.Operation,
        width: 200
    });
    var data = {
        filter: str
    }
    $.post(baseUrl + url, data, function(data) {
        if (data.Status == 0) {
            grid = $("#grid").kendoGrid({
                checkBoxColumn: true,
                columns: cols,
                filterable: { mode: "menu" },
                dataSource: data.Data,
                height: 520,
                selectable: "row",
                pageable: {
                    pageSize: 20,
                    pageSizes: [20, 50, 100, 200, 500]
                }
            });
        }
    })
}
/*******新增 *******/
function add() {
    $.x5window("新增零件", kendo.template($("#addTemplate").html()));

    groupOrMachine = $("#Line").multipleComboxTree({
        url: "/machine/GetGrouplist_Customer",
        url2: "/machine/GetKeywordGrouplist",
        type: 1,
        data: {
            groupID: 0
        },
        //checkbox: true
    }).data("BZ-multipleComboxTree");
    $("#input_Line").css({ height: '20px' });

    $("#Save").on('click', function() {
        console.log(groupOrMachine);
        var data = {
            Product_Model: $('#Product_Model').val(),
            Part_Name: $('#Part_Name').val(),
            Line: groupOrMachine.rData,
            Program: $('#Program').val(),
            Process: $('#Process').val(),
        }
        if (groupOrMachine.rData != undefined, data.Part_Name != "", data.Process != "", data.Product_Model != "", data.Program != "") {
            $.post(baseUrl + 'add', data, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    showGrid('getTool', "");
                    BzSuccess(data.Message);
                }
            })
        } else {
            BzAlert('内容不能为空')
        }
    })
}

/**********编辑***********/
function edit(e) {
    $.x5window("编辑", kendo.template($("#editTemplate").html()));
    groupOrMachine = $("#Line").multipleComboxTree({
        url: "/machine/GetGrouplist_Customer",
        url2: "/machine/GetKeywordGrouplist",
        type: 1,
        data: {
            groupID: 0
        },
        //checkbox: true
    }).data("BZ-multipleComboxTree");
    $("#input_Line").css({ height: '20px' });
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    $('#Product_Model').val(dataItem.Product_Model);
    $('#Part_Name').val(dataItem.Part_Name);
    $('#Line').val(dataItem.Line);
    $('#Program').val(dataItem.Program);
    $('#Process').val(dataItem.Process);
    $("#Save").on('click', function() {
        var data = {
            Product_Model: $('#Product_Model').val(),
            Part_Name: $('#Part_Name').val(),
            Line: groupOrMachine.rData,
            Program: $('#Program').val(),
            Process: $('#Process').val(),
            ID: dataItem.ID
        }
        if (data.Line != undefined, data.Part_Name != "", data.Process != "", data.Product_Model != "", data.Program != "") {
            $.post(baseUrl + 'edit', data, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    //grid.grid("refresh", []);
                    showGrid('getTool', "");
                    BzSuccess(data.Message);
                }
            })
        } else {
            BzAlert('内容不能为空')
        }
    })
}
/**********删除**********/
function Delete(e) {
    $.x5window("编辑", kendo.template($("#del").html()));
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    $("#Save").on('click', function() {
        var data = {
            ID: dataItem.ID
        }
        $.post(baseUrl + 'delete', data, function(data) {
            if (data.Status == 0) {
                $("#x5window").data("kendoWindow").close();
                //grid.grid("refresh", []);
                showGrid('getTool', "");
                BzSuccess(data.Message);
            }
        })
    })
}

/*******多个删除 ******/
function deleteAll() {
    $.x5window("删除", kendo.template($("#del").html()));
    var dd = grid.data("bz-grid").checkedDataRows();
    console.log(dd);
    var ID = [];
    for (var i = 0; i < dd.length; i++) {
        ID.push(dd[i].ID);
    }
    var data = {
        Ids: ID
    }
    console.log(data)
    $("#Save").on('click', function() {
        $.post(baseUrl + 'deleteAll', data, function(data) {
            if (data.Status == 0) {
                $("#x5window").data("kendoWindow").close();
                grid.grid("refresh", []);
                BzSuccess(data.Message);
            }
        })
    })
}
/**********查询************/
function search() {
    var data = {
        filter: $("#filter").val()
    }
    showGrid('search', $('#filter').val());
}
$("#filter").keydown(function(e) {
    if (e.keyCode == 13) {
        showGrid('search', $('#filter').val());
    }

})

/*********跳转******/
function skip(e) {
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    console.log(dataItem)
    var id = dataItem.ID;
    window.open('/configDetails?id=' + id)
}