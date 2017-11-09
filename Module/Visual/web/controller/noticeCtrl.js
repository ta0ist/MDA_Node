var baseUrl = '/visuals/';
var grid;
var validator;
var MAC_NBRS;
var addviewModel;

app.controller('noticeCtrl', function($scope, $http) {
    var fields = {
        NEWS_NBR: { type: "string" },
        GP_NBR: { type: "string" },
        CONTENT: { type: "string" },
        RELEASE_DATE: { type: "date" },
        MEM_NBR: { type: "string" },
        ACTIVE: { type: "string" }
    };
    var cols = [];
    cols.push({ field: "NEWS_NBR", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "GP_NBR", title: "", width: 80, sortable: true, filterable: false, hidden: true });

    cols.push({ field: "CONTENT", title: lang.Visual.Content, width: 200, sortable: true, filterable: true });
    cols.push({ field: "RELEASE_DATE", title: lang.Visual.ReleaseDate, format: "{0: yyyy/MM/dd HH:mm:ss}", width: 80, sortable: true, filterable: false });
    cols.push({ field: "MEM_NBR", title: lang.Visual.ReleaseMem, width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "GP_NBR", title: '', width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "GP_NAME", title: '', width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "MEM_NAME", title: lang.Visual.ReleaseMem, width: 80, sortable: true, filterable: false });
    cols.push({ field: "ACTIVE", title: lang.Visual.IsUse, width: 80, sortable: true, filterable: false, template: kendo.template($("#template_ACTIVE").html()) });

    cols.push({
        command: [
            //{ name: "aa", text: $.Translate("Common.EDIT") + '<i class="icon-edit"></i>', className: "btn purple", click: f_edit },
            { name: "bb", text: lang.Common.Delete + '<i class="icon-remove-sign"></i>', className: "btn red ", click: f_delete }
        ],
        title: lang.Visual.Operation,
        width: 200
    });
    //Grid
    grid = $("#grid").grid({
        checkBoxColumn: true,
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        //sort: [{ field: "USER_NBR", dir: "ASC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: true,
        resizeGridWidth: true, //列宽度可调
        isPage: true,
        //server: true, //服务器端刷新，包括排序，筛选等
        actionUrl: ["GetAllAutoNewsList", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "NEWS_NBR",
            fields: fields,
            cols: cols
        }
    });

    $scope.grid_add = (e) => {
        $.x5window(lang.EmployeePerformance.Add, kendo.template($("#popup-add").html()));
        $("#Win_Submit").click(function() {
            // var dispatchordermodel = [{
            //     GP_NBR: 1, //default设备组
            //     CONTENT: $("#CONTENT").val()
            // }];
            // //for (var m in MAC_NBRS.dataAarry) {
            // //    var tempjson = {};
            // //    tempjson.GP_NBR = m;
            // //    tempjson.CONTENT = $("#CONTENT").val();
            // //    dispatchordermodel.push(tempjson);
            // //}

            $.post("/visuals/r/AddNews", { Content: $("#CONTENT").val() }, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    grid.grid("refresh");
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            });
        });
    }

    $scope.grid_delete = (e) => {
        BzConfirm(lang.EmployeePerformance.OK, function(e) {
            if (e) {
                var dd = grid.data("bz-grid").checkedDataRows();
                var news_nbrlist = '';
                for (var i = 0; i < dd.length; i++) {
                    if (i == 0)
                        news_nbrlist = dd[i].NEWS_NBR;
                    else
                        news_nbrlist = news_nbrlist + ',' + dd[i].NEWS_NBR;
                }
                $.post("/visuals/r/DeleteNews", { news_nbrlist: news_nbrlist }, function(data) {
                    if (data.Status == 0) {
                        grid.grid("refresh");
                        BzSuccess(data.Message);
                    } else {
                        BzAlert(data.Message);
                    }
                });
            }
        });
    }



})


function f_delete(e) {
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    BzConfirm(lang.Common.Delete, function(e) {
        if (e) {
            $.post("/visuals/r/DeleteNews", { news_nbrlist: dataItem.NEWS_NBR }, function(data) {
                if (data.Status == 0) {
                    grid.grid("refresh");
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            });
        }
    });
}

function f_Enable(e) {
    var dd = grid.data("bz-grid").selectedDataRows();
    var message;
    var actvie;
    if (dd[0].ACTIVE == 0) {
        message = "是否确认发布该公告信息?";
        actvie = 1;
    } else {
        message = "是否确认取消该公告信息?";
        actvie = 0;
    }
    BzConfirm(message, function(e) {
        if (e) {
            $.post("/visuals/r/ModifyNews", { ACTIVE: actvie, NEWS_NBR: dd[0].NEWS_NBR }, function(data) {
                if (data.Status == 0) {
                    grid.grid("refresh");
                    let Content = "";
                    if (actvie == 1) {
                        Content = dd[0].CONTENT;
                    }
                    var wsServer = new WebSocket('ws://localhost:8883');
                    wsServer.onopen = (even) => {
                        wsServer.send(JSON.stringify({
                            Type: 1,
                            Data: Content
                        }));
                        wsServer.close();
                    }
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            });
        }

    });

}