var grid;
var baseUrl = '/toolConfig/r/';
var groupOrMachine;
$(function() {
        showGrid('getTool', "");

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
                    // showGrid('getTool', "");
                    $.post(baseUrl + 'getTool', { filter: "" }, function(result) {
                        if (result.Status == 0)
                            refresh(result);
                    });

                    BzSuccess(data.Message);
                }
            })
        } else {
            BzAlert('内容不能为空')
        }
    })
}
/****刷新gird****/
function refresh(result) {
    $("#grid").data("kendoGrid").dataSource.data(result.Data);
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

                    //showGrid('getTool', "");
                    $.post(baseUrl + 'getTool', { filter: "" }, function(result) {
                        if (result.Status == 0)
                            refresh(result);
                    });
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
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    $.post(baseUrl + 'del', { ID: dataItem.ID }, function(data) {
        if (data.Status == 0) {
            $.x5window("删除", kendo.template($("#del").html()));
            $("#Save").on('click', function() {
                var data = {
                    ID: dataItem.ID
                }
                $.post(baseUrl + 'delete', data, function(data) {
                    if (data.Status == 0) {

                        //grid.grid("refresh", []);
                        //showGrid('getTool', "");
                        $.post(baseUrl + 'getTool', { filter: "" }, function(result) {
                            if (result.Status == 0)
                                refresh(result);
                        });
                        BzSuccess(data.Message);
                        $("#x5window").data("kendoWindow").close();
                    }
                })
            })
        } else {
            BzAlert(data.Message);
        }
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