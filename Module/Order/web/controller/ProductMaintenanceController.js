/**
 * Created by qb on 2016/12/21.
 */
var grid;
var cmd = {
    addProduct: 0,
    editProduct: 1,
    addCraft: 2,
    editCraft: 3,
    addProcess: 4,
    editProcess: 5
};
var newCmd;
var baseUrl = "/ProductMaintenance/";
var validator;
var addviewModel;
//*工单模块-获取产品组
function GetProductionGroup(id, chtml) {
    $.post("/ProductMaintenance/getProductGroup", { gp_nbr: id }, function(data) {
        if (data.Status == 0) {
            $("#orgnizetree").kendoTreeView({
                dataSource: {
                    data: fomattree(gettree(data.Data, "icon-group"))
                },
                template: kendo.template(chtml),
                select: function(e) {
                    grid.grid("refresh", function() {
                        return [
                            { field: "keyword", Operator: "eq", value: parseInt($(e.node).find('[attr="treenode"]').attr("nodeid")) }
                        ];
                    });
                    $("#slide").text(lang.Order.Folding);
                    $("#slide").toggle(function() {
                        $("#slide").text(lang.Order.Unfold);
                        $("#grid").data("kendoGrid").collapseRow(".k-grouping-row");
                    }, function() {
                        $("#slide").text(lang.Order.Folding);
                        $("#grid").data("kendoGrid").expandRow(".k-grouping-row");
                    });


                }
            }).data("kendoTreeView").collapse(".k-item");
            if (data.Data.length > 0) {
                var treeview = $("#orgnizetree").data("kendoTreeView")
                treeview.select($(".k-item:first"));
                refreshGrid();
            }
            $("#tree_addRootNode").show();

        } else {
            BzAlert(data.Message);
        }
    });
}
$(function() {
    var fields = {
        // PROD_NBR: { type: "string" },
        PROD_NBR: { type: "number" },
        PROD_NAME: { type: "string" },
        CRAFT_NAME: { type: "string" },
        CRAFT_NO: { type: "string" },
        RANK_NUM: { type: "number" },
        PROC_NAME: { type: "string" },
        PROC_NO: { type: "string" },
        STD_TIME: { type: "number" },
        CYCLE_RATE: { type: "string" },
        // CYCLE_TIME: { type: "string" },
        MEMO: { type: "string" }

    };

    var cols = [];
    //cols.push({ field: "PROD_NBR", title: $.Translate("Order.ProductNumber"), width: 60, sortable: true, filterable: { extra: false } });
    cols.push({
        field: "PROD_NO",
        title: lang.Order.ProductNumber,
        groupHeaderTemplate: lang.Order.ProductNumber + ': #= value #' +
            '<div class="btn purple" value="#=data.value#"style="height: 20px; width: 60px; margin: 0px 2px 0px 10px; padding: 0px 6px;" onclick="return toolbar_editproduct(this)">' + lang.Order.EditProduct + '</div>' +
            '<div class="btn red" value="#=data.value#"style="height: 20px; width: 60px; margin: 0px 2px 0px 2px; padding: 0px 6px;" onclick="return toolbar_deleteproduct(this)" >' + lang.Order.RemoveProduct + '</div>' +
            '<div class="btn blue" value="#=data.value#"style="height: 20px; width: 60px; margin: 0px 2px 0px 2px; padding: 0px 6px;" onclick="return toolbar_addart(this)" >' + lang.Order.NewCraft + '</div>',
        width: 60,
        sortable: true,
        filterable: false,
        hidden: true
    });
    cols.push({ field: "PROD_NAME", title: lang.Order.ProductName, width: 60, sortable: true, filterable: false });
    cols.push({
        field: "CRAFT_NAME",
        title: lang.Order.CraftName,

        width: 60,
        sortable: true,
        filterable: false
    });
    cols.push({
        field: "CRAFT_NO",
        title: lang.Order.CraftId,
        groupHeaderTemplate: lang.Order.CraftId + ': #= value #' +
            '<div class="btn purple" value="#=data.value#"style="height: 20px; width: 60px; margin: 0px 2px 0px 10px; padding: 0px 6px;" onclick="return craft_editproduct(this)">' + lang.Order.EditCraft + '</div>' +
            '<div class="btn red" value="#=data.value#"style="height: 20px; width: 60px; margin: 0px 2px 0px 2px; padding: 0px 6px;" onclick="return delete_craft(this)" >' + lang.Order.DeleteCraft + '</div>' +
            '<div class="btn blue" value="#=data.value#"style=" height:20px; width: 60px; margin: 0px 2px 0px 2px; padding: 0px 6px;" onclick="return craft_proc(this)" >' + lang.Order.NewProcess + '</div>',
        width: 60,
        sortable: true,
        filterable: false,
        hidden: true
    });
    cols.push({ field: "RANK_NUM", title: lang.Order.OperationSequence, width: 40, sortable: true, filterable: false });
    cols.push({ field: "PROC_TYPE", title: lang.Order.LastProcess, width: 40, sortable: true, filterable: false, template: kendo.template($("#PROC_TYPE_TEMPLATE").html()) });
    cols.push({ field: "PROC_NAME", title: lang.Order.ProcessName, width: 60, sortable: true, filterable: false });
    cols.push({ field: "PROC_NO", title: lang.Order.ProcessId, width: 60, sortable: true, filterable: false });
    cols.push({ field: "STD_TIME", title: lang.Order.StandardTime, width: 60, sortable: true, filterable: false });
    cols.push({ field: "CYCLE_RATE", title: lang.Order.CirculationRatio, width: 40, sortable: true, filterable: false });
    cols.push({ field: "MEMO", title: lang.Order.Describe, width: 60, sortable: true, filterable: false });
    cols.push({
        command: [
            { name: "aa", text: lang.Order.Edit + '<i class="icon-edit"></i>', className: "btn purple", click: f_edit },
            { name: "bb", text: lang.Order.Delete + '<i class="icon-remove-sign"></i>', className: "btn red ", click: f_delete }
        ],
        title: lang.Order.Operation,
        width: 90
    });
    //Grid

    grid = $("#grid").grid({
        checkBoxColumn: false,
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        sort: [{ field: "RANK_NUM", dir: "ASC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: false,
        resizeGridWidth: true, //列宽度可调
        isPage: true,
        group: true,
        groupfield: [
            { field: "PROD_NO" },
            { field: "CRAFT_NO" }
        ],

        //server: true, //服务器端刷新，包括排序，筛选等
        actionUrl: ["getProductByGroup", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "PROD_NBR",
            fields: fields,
            cols: cols
        },


    });

    $("#slide").toggle(function() {
        $("#slide").text(lang.Order.Unfold);
        $("#grid").data("kendoGrid").collapseRow(".k-grouping-row");
    }, function() {
        $("#slide").text(lang.Order.Folding);
        $("#grid").data("kendoGrid").expandRow(".k-grouping-row");
    });



    //$(".k-group-cell.k-header").eq(0).append('<i id="grid_expand" class="icon-sitemap" style=" cursor: pointer;"></i>');
    //$("#grid_expand").toggle(function () {
    //    $("#grid").data("kendoGrid").expandRow(".k-master-row");
    //}, function () {
    //    $("#grid").data("kendoGrid").collapseRow(".k-master-row");
    //});


    $("#contextPage").resize(function() {
        grid.data("bz-grid").resizeGridWidth();
    });


    GetProductionGroup(0, $("#treeview-template").html());

    function koModel() {
        var self = this;

        self.tree_addRootNode = function() { //添加根节点
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var GroupInfo = {
                pid: 0,
                gp_name: lang.Order.NewNode,
                rank_num: 0
            }
            $.post("/ProductMaintenance/addProductGroup", GroupInfo, function(data) {
                if (data.Status == 0) {
                    var obj = treeobj.append({
                        text: GroupInfo.gp_name,
                        id: data.Data,
                        icon: "icon-cogs",
                        PID: 0
                    }, null);
                    BzSuccess(data.Message);
                    //进入编辑
                    treeobj.select(obj);
                    $("#tree_edit").trigger('click');
                } else {
                    BzAlert(data.Message);
                }
            });
        };
        self.tree_add = function() { //新增产品组
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var selectedNode = treeobj.select();
            if (selectedNode.length > 0) {
                var GroupInfo = {
                    pid: parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid")),
                    gp_name: lang.Order.NewNode,
                    rank_num: 0
                }
                $.post("/ProductMaintenance/addProductGroup", GroupInfo, function(data) {
                    if (data.Status == 0) {
                        var obj = treeobj.append({
                            text: GroupInfo.gp_name,
                            id: data.Data,
                            icon: "icon-cogs",
                            PID: GroupInfo.pid
                        }, selectedNode);
                        BzSuccess(data.Message);

                        //进入编辑
                        treeobj.select(obj);
                        $("#tree_edit").trigger('click');
                    } else {
                        BzAlert(data.Message);
                    }
                });
            } else {
                BzAlert(lang.Order.PleaseSelectANode);
            }
        };
        self.tree_edit = function() { //编辑产品组
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var selectedNode = treeobj.select();
            if (selectedNode.length > 0) {
                var obj = selectedNode.find('.k-state-selected span').data("BZ-editer");
                if (obj == undefined) {
                    selectedNode.find('.k-state-selected span').editer({
                        url: "/ProductMaintenance/modifyProductGroup",
                        title: lang.Order.PleaseEnterAName,
                        Ok: function(name) {
                            this.close();
                            var treeobj = $("#orgnizetree").data("kendoTreeView");
                            var GroupInfo = {
                                gp_nbr: parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid")),
                                gp_name: name,
                                rank_num: 0,
                                pid: parseInt($(treeobj.select()).find('.k-state-selected span').attr("pid"))
                            }
                            $.post("/ProductMaintenance/modifyProductGroup", GroupInfo, function(data) {
                                if (data.Status == 0) {
                                    var treeobj = $("#orgnizetree").data("kendoTreeView");
                                    $(treeobj.select()).find('.k-state-selected span').html(name);
                                    BzSuccess(data.Message);
                                } else {
                                    BzAlert(data.Message);
                                }
                            });
                        }
                    });
                } else {
                    obj.show();
                }
            }
        };
        self.tree_delete = function() { //删除产品组
            BzConfirm(lang.Order.DeleteData, function(e) {
                if (e) {
                    var treeobj = $("#orgnizetree").data("kendoTreeView");
                    var data = $(treeobj.select()).find('.k-state-selected span').attr("nodeid")
                    $.post("/ProductMaintenance/deleteProductGroup", { gp_nbr: data }, function(data) {
                        if (data.Status == 0) {
                            var selectedNode = treeobj.select();
                            treeobj.remove(selectedNode);
                            BzSuccess(data.Message);
                        } else {
                            BzAlert(data.Message);
                        }
                    });
                }
            });
        };


        self.grid_add = function(e) { //新增产品
            newCmd = cmd.addProduct;
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var selectedNode = treeobj.select();
            if (selectedNode.length > 0) { //判断是否有选中的节点
                $.x5window(lang.Order.NewProduct, kendo.template($("#popup-add").html()));
                addOrEdit(); //新增
            } else {
                BzAlert(lang.Order.PleaseSelectANode);
            }
        };
    }
    var u = new koModel();
    ko.applyBindings(u);




    $("#tree_expand").toggle(function() {
        $("#orgnizetree").data("kendoTreeView").collapse(".k-item");

    }, function() {
        $("#orgnizetree").data("kendoTreeView").expand(".k-item");
    });
});

function refreshGrid() { //刷新grid
    // if ($("#filter").val() == "") {
    grid.grid("refresh", function() {
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var selectedNode = treeobj.select();
        return [
            { field: "keyword", Operator: "eq", value: parseInt(selectedNode.find('.k-state-selected span').attr("nodeid")) }
        ];
    });
}

function f_edit(e) { //编辑工序
    newCmd = cmd.editProcess;
    $.x5window(lang.Order.EditProcess, kendo.template($("#popup-add").html()));
    var obj = this.dataItem($(e.currentTarget).closest("tr"));
    var ProductNO = obj.PROC_NO;
    var objs = grid.data('bz-grid').ds.data();
    var temp = _.where(objs, { "PROC_NO": ProductNO });
    var dataItems = {};
    dataItems.FLAG = 1;
    dataItems.PROD_NO = obj.PROD_NO;
    dataItems.MEMO = obj.MEMO;
    dataItems.PROD_NAME = obj.PROD_NAME;
    dataItems.PROD_NBR = obj.PROD_NBR;
    dataItems.CRAFT_LIST = [{
        FLAG: 1,
        CRAFT_NO: obj.CRAFT_NO,
        CRAFT_NAME: obj.CRAFT_NAME,
        CRAFT_NBR: obj.CRAFT_NBR,
        PROC_LIST: [{
            FLAG: 0,
            PROC_NO: obj.PROC_NO,
            PROC_NBR: obj.PROC_NBR,
            PROC_NAME: obj.PROC_NAME,
            RANK_NUM: obj.RANK_NUM,
            PROC_TYPE: obj.PROC_TYPE,
            STD_TIME: obj.STD_TIME,
            CYCLE_RATE: obj.CYCLE_RATE,
            MEMO: obj.MEMO
        }]
    }];



    addOrEdit(dataItems);
}

function f_delete(e) { //删除工序
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    BzConfirm(lang.Order.DeleteData, function(e) {
        if (e) {
            $.post("/Order/ProductMaintenance/deleteProcess", JSON.stringify({ craft_nbr: dataItem.CRAFT_NBR, proc_nbr: dataItem.PROC_NBR }), function(data) {
                if (data.Status == 0) {
                    refreshGrid();
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            });
        }
    })
}



function toolbar_deleteproduct(e) { //删除产品
    var ProductNO = $(e).attr("value");
    var dataItem = grid.data('bz-grid').ds.data();
    BzConfirm(lang.Order.DeleteData, function(e) {
        //遍历寻找对应的PRODUCT_AUTO_ID
        if (e) {
            var prod_nbr;
            for (var i = 0; i < dataItem.length; i++) {
                if (ProductNO == dataItem[i].PROD_NO) {
                    prod_nbr = dataItem[i].PROD_NBR;
                }
            }
            $.post("/Order/ProductMaintenance/deleteProduct", JSON.stringify({ prod_nbr: prod_nbr }), function(data) {
                if (data.Status == 0) {
                    refreshGrid();
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            });
        } else {
            BzAlert(data.Message);
        }

    })
}

function delete_craft(e) { //删除工艺
    var ProductNO = $(e).attr("value");
    var dataItem = grid.data('bz-grid').ds.data();
    BzConfirm(lang.Order.DeleteData, function(e) {
        if (e) {
            for (var i = 0; i < dataItem.length; i++) {
                var craft_nbr = dataItem[i].CRAFT_NBR;
                if (ProductNO == dataItem[i].CRAFT_NO) {
                    $.post("/Order/ProductMaintenance/deleteCraft", JSON.stringify({ craft_nbr: craft_nbr }), function(data) {
                        if (data.Status == 0) {
                            refreshGrid();
                            BzSuccess(data.Message);
                        } else {
                            BzAlert(data.Message);
                        }
                    });
                    break;
                }

            }
        } else {
            BzAlert(data.Message);
        }
    })

}
var dataItems;

function toolbar_editproduct(e) { //编辑产品
    newCmd = cmd.editProduct;
    $.x5window(lang.Order.EditProduct, kendo.template($("#popup-add").html()));
    var ProductNO = $(e).attr("value");
    var objs = grid.data('bz-grid').ds.data();
    var temp = _.where(objs, { "PROD_NO": ProductNO });
    var dataItems = {};
    for (var i = 0; i < temp.length; i++) {
        dataItems.FLAG = 1; //编辑标志
        dataItems.PROD_NO = temp[i].PROD_NO;
        dataItems.PROD_NAME = temp[i].PROD_NAME;
        dataItems.PROD_NBR = temp[i].PROD_NBR;
        dataItems.MEMO = temp[i].MEMO;
        dataItems.GP_NBR = temp[i].GP_NBR;
    }

    dataItems.CRAFT_LIST = [];
    var craftlist = _.groupBy(temp, "CRAFT_NBR");
    $.each(craftlist, function(a, b) {
        var tjson = {};
        tjson.PROC_LIST = [];
        for (var j = 0; j < b.length; j++) {
            tjson.FLAG = 1;
            tjson.CRAFT_NO = b[j].CRAFT_NO;
            tjson.CRAFT_NAME = b[j].CRAFT_NAME;
            tjson.CRAFT_NBR = b[j].CRAFT_NBR;
            tjson.PROC_LIST.push({
                FLAG: 1, //old
                PROC_NO: b[j].PROC_NO,
                PROC_NAME: b[j].PROC_NAME,
                RANK_NUM: b[j].RANK_NUM,
                PROC_TYPE: b[j].PROC_TYPE,
                STD_TIME: b[j].STD_TIME,
                CYCLE_RATE: b[j].CYCLE_RATE,
                MEMO: b[j].MEMO
            })
        }

        dataItems.CRAFT_LIST.push(tjson);

    })

    addOrEdit(dataItems);
}

function craft_editproduct(e) { //编辑工艺
    newCmd = cmd.editCraft;
    $.x5window(lang.Order.EditCraft, kendo.template($("#popup-add").html()));
    var ProductNO = $(e).attr("value");
    var objs = grid.data('bz-grid').ds.data();
    var temp = _.where(objs, { "CRAFT_NO": ProductNO });
    var dataItems = {};
    for (var i = 0; i < temp.length; i++) {
        dataItems.FLAG = 1;
        dataItems.PROD_NO = temp[i].PROD_NO;
        dataItems.PROD_NAME = temp[i].PROD_NAME;
        dataItems.PROD_NBR = temp[i].PROD_NBR;
        dataItems.MEMO = temp[i].MEMO;
        dataItems.GP_NBR = temp[i].GP_NBR;
    }

    dataItems.CRAFT_LIST = [];
    var craftlist = _.groupBy(temp, "CRAFT_NBR");
    $.each(craftlist, function(a, b) {
        FLAG = 1; //old
        var tjson = {};
        tjson.PROC_LIST = [];
        for (var j = 0; j < b.length; j++) {
            tjson.FLAG = 1;
            tjson.CRAFT_NO = b[j].CRAFT_NO;
            tjson.CRAFT_NAME = b[j].CRAFT_NAME;
            tjson.CRAFT_NBR = b[j].CRAFT_NBR;
            tjson.PROC_LIST.push({
                FLAG: 1, //old
                PROC_NO: b[j].PROC_NO,
                PROC_NAME: b[j].PROC_NAME,
                RANK_NUM: b[j].RANK_NUM,
                PROC_TYPE: b[j].PROC_TYPE,
                STD_TIME: b[j].STD_TIME,
                CYCLE_RATE: b[j].CYCLE_RATE,
                MEMO: b[j].MEMO
            })
        }

        dataItems.CRAFT_LIST.push(tjson);

    })

    addOrEdit(dataItems);
}


function craft_proc(e) { //新增工序
    newCmd = cmd.addProcess;
    $.x5window(lang.Order.NewProcess, kendo.template($("#popup-add").html()));
    var ProductNO = $(e).attr("value");
    var objs = grid.data('bz-grid').ds.data();
    var temp = _.where(objs, { "CRAFT_NO": ProductNO });
    var dataItems = {};
    for (var i = 0; i < temp.length; i++) {
        dataItems.FLAG = 1;
        dataItems.PROD_NO = temp[i].PROD_NO;
        dataItems.PROD_NAME = temp[i].PROD_NAME;
        dataItems.PROD_NBR = temp[i].PROD_NBR;
        dataItems.MEMO = temp[i].MEMO;
        dataItems.GP_NBR = temp[i].GP_NBR;
    }

    dataItems.CRAFT_LIST = [];
    var craftlist = _.groupBy(temp, "CRAFT_NBR");
    $.each(craftlist, function(a, b) {
        FLAG = 1; //old
        var tjson = {};
        tjson.PROC_LIST = [];
        for (var j = 0; j < b.length; j++) {
            tjson.FLAG = 1;
            tjson.CRAFT_NO = b[j].CRAFT_NO;
            tjson.CRAFT_NAME = b[j].CRAFT_NAME;
            tjson.CRAFT_NBR = b[j].CRAFT_NBR;
            tjson.PROC_LIST.push({
                FLAG: 1, //old
                PROC_NO: b[j].PROC_NO,
                PROC_NAME: b[j].PROC_NAME,
                RANK_NUM: b[j].RANK_NUM,
                PROC_TYPE: b[j].PROC_TYPE,
                STD_TIME: b[j].STD_TIME,
                CYCLE_RATE: b[j].CYCLE_RATE,
                MEMO: b[j].MEMO
            })
        }

        dataItems.CRAFT_LIST.push(tjson);

    })

    addOrEdit(dataItems);
}
var FLAG;

function toolbar_addart(e) { //新增工艺
    newCmd = cmd.addCraft;
    $.x5window(lang.Order.NewCraft, kendo.template($("#popup-add").html()));
    var ProductNO = $(e).attr("value");
    var objs = grid.data('bz-grid').ds.data();
    var temp = _.where(objs, { "PROD_NO": ProductNO });
    var dataItems = {};
    for (var i = 0; i < temp.length; i++) {
        dataItems.FLAG = 1;
        dataItems.PROD_NO = temp[i].PROD_NO;
        dataItems.PROD_NAME = temp[i].PROD_NAME;
        dataItems.PROD_NBR = temp[i].PROD_NBR;
        dataItems.MEMO = temp[i].MEMO;
        dataItems.GP_NBR = temp[i].GP_NBR;
    }

    dataItems.CRAFT_LIST = [];
    var craftlist = _.groupBy(temp, "CRAFT_NBR");
    $.each(craftlist, function(a, b) {
        FLAG = 1; //old
        var tjson = {};
        tjson.PROC_LIST = [];
        for (var j = 0; j < b.length; j++) {
            tjson.FLAG = 1;
            tjson.CRAFT_NO = b[j].CRAFT_NO;
            tjson.CRAFT_NAME = b[j].CRAFT_NAME;
            tjson.CRAFT_NBR = b[j].CRAFT_NBR;
            tjson.PROC_LIST.push({
                FLAG: 1, //old
                PROC_NO: b[j].PROC_NO,
                PROC_NAME: b[j].PROC_NAME,
                RANK_NUM: b[j].RANK_NUM,
                PROC_TYPE: b[j].PROC_TYPE,
                STD_TIME: b[j].STD_TIME,
                CYCLE_RATE: b[j].CYCLE_RATE,
                MEMO: b[j].MEMO
            })
        }

        dataItems.CRAFT_LIST.push(tjson);

    })

    addOrEdit(dataItems);

}

function addOrEdit(dataItems) {
    //验证
    validator = $("#memberviewmodel").validate({
        rules: {
            PROD_NO: { required: true },
            PROD_NAME: { required: true },
            //CRAFT_NO: { required: true },
            //CRAFT_NAME: { required: true }


        },
        messages: {
            PROD_NO: { required: lang.Order.ContentCannotBeEmpty },
            PROD_NAME: { required: lang.Order.ContentCannotBeEmpty },
            CRAFT_NO: { required: lang.Order.ContentCannotBeEmpty },
            CRAFT_NAME: { required: lang.Order.ContentCannotBeEmpty }
        }
    });

    addviewModel = ko.mapping.fromJS({
        CMD: ko.observable(newCmd),
        PROD_NO: ko.observable(dataItems == undefined ? "" : dataItems.PROD_NO),
        PROD_NAME: ko.observable(dataItems == undefined ? "" : dataItems.PROD_NAME),
        MEMO: ko.observable(dataItems == undefined ? "" : dataItems.MEMO),
        CRAFT_LIST: ko.observableArray(dataItems == undefined ? [] : dataItems.CRAFT_LIST),
        //CRAFT_LIST: ko.observableArray(ko.utils.arrayMap(dataItems.CRAFT_LIST, function (craft_list) {
        //    return { FLAG: 0, CRAFT_NO: craft_list.CRAFT_NO, CRAFT_NAME: craft_list.CRAFT_NAME, PROC_LIST: ko.observableArray(craft_list.PROC_LIST) };
        //})),
        addCraft: function(e) {
            addviewModel.CRAFT_LIST.push({
                FLAG: ko.observable(0), //new
                CRAFT_NO: ko.observable(""),
                CRAFT_NAME: ko.observable(""),
                MEMO: ko.observable(""),
                PROC_LIST: ko.observableArray()

            })
        },
        removeCraft: function(craft) {
            addviewModel.CRAFT_LIST.remove(craft);
        },
        addProcess: function(data, event) {
            data.PROC_LIST.push({
                FLAG: ko.observable(0), //new
                PROC_NO: ko.observable(""),
                PROC_NAME: ko.observable(""),
                RANK_NUM: ko.observable(1),
                PROC_TYPE: ko.observable(""),
                STD_TIME: ko.observable(1),
                CYCLE_RATE: ko.observable(1),
                MEMO: ko.observable("")
            })
        },
        removeProcess: function(process) {
            $.each(addviewModel.CRAFT_LIST(),
                function() {
                    this.PROC_LIST.remove(process)
                })
        },
        onchange: function(data, event) {
            $.each(addviewModel.CRAFT_LIST()[parseInt($(event.target).attr("index"))].PROC_LIST(), function(a, b) {
                b.PROC_TYPE(0);
            });
            data.PROC_TYPE(1);
        },
        save: function(e) {
            if (validator.form()) {
                var treeobj = $("#orgnizetree").data("kendoTreeView");
                var selectedNode = treeobj.select();
                var model = {};
                model.PROD_NO = addviewModel.PROD_NO();
                model.PROD_NAME = addviewModel.PROD_NAME();
                model.MEMO = addviewModel.MEMO();
                model.GP_NBR = parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid"));
                model.PROD_NBR = parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid"));
                model.BllCrafts = [];
                for (var i = 0; i < addviewModel.CRAFT_LIST().length; i++) {
                    var tjson = {};
                    tjson.FLAG = addviewModel.CRAFT_LIST()[i].FLAG();
                    tjson.CRAFT_NO = addviewModel.CRAFT_LIST()[i].CRAFT_NO();
                    tjson.CRAFT_NAME = addviewModel.CRAFT_LIST()[i].CRAFT_NAME();
                    tjson.Bllprocess = [];
                    for (var j = 0; j < addviewModel.CRAFT_LIST()[i].PROC_LIST().length; j++) {
                        var tt = {};
                        tt.FLAG = addviewModel.CRAFT_LIST()[i].PROC_LIST()[j].FLAG();
                        tt.PROC_NO = addviewModel.CRAFT_LIST()[i].PROC_LIST()[j].PROC_NO();
                        tt.CYCLE_RATE = addviewModel.CRAFT_LIST()[i].PROC_LIST()[j].CYCLE_RATE();
                        tt.MEMO = addviewModel.CRAFT_LIST()[i].PROC_LIST()[j].MEMO();
                        tt.PROC_NAME = addviewModel.CRAFT_LIST()[i].PROC_LIST()[j].PROC_NAME();
                        tt.PROC_TYPE = addviewModel.CRAFT_LIST()[i].PROC_LIST()[j].PROC_TYPE();
                        tt.RANK_NUM = addviewModel.CRAFT_LIST()[i].PROC_LIST()[j].RANK_NUM();
                        tt.STD_TIME = addviewModel.CRAFT_LIST()[i].PROC_LIST()[j].STD_TIME();
                        tjson.Bllprocess.push(tt);
                        if (tjson.Bllprocess[j].PROC_NO == '' || tjson.Bllprocess[j].PROC_NAME == '') {
                            BzAlert(lang.Order.PleaseEnterTheProcessNumberAndProcessName);
                            return;
                        }

                    }
                    model.BllCrafts.push(tjson);
                    if (model.BllCrafts[i].CRAFT_NO == '' || model.BllCrafts[i].CRAFT_NAME == '') {
                        BzAlert(lang.Order.PleaseEnterTheProcessNumberAndProcessName);
                        return;
                    }
                }
                var CRAFT_NBR, CRAFT_NO, len;
                //model.BllCrafts.push(tjson);=
                if (newCmd == cmd.addProduct) { //新增产品
                    $.post("/ProductMaintenance/addProduct", model, function(data) {
                        if (data.Status == 0) {
                            $("#x5window").data("kendoWindow").close();
                            refreshGrid();
                            BzSuccess(data.Message);
                        } else {
                            BzAlert(data.Message);
                        }
                    });
                } else if (newCmd == cmd.editProduct) { //编辑产品
                    prodmodel = {
                        GP_NBR: dataItems.GP_NBR,
                        MEMO: dataItems.MEMO,
                        PROD_NAME: $('#PROD_NAME').val(),
                        PROD_NO: $('#PROD_NO').val(),
                        PROD_NBR: dataItems.PROD_NBR,
                    }
                    $.post("/Order/ProductMaintenance/modifyProduct", JSON.stringify({ prodmodel: prodmodel }), function(data) {
                        if (data.Status == 0) {
                            $("#x5window").data("kendoWindow").close();
                            refreshGrid();
                            BzSuccess(data.Message);
                        } else {
                            BzAlert(data.Message);
                        }
                    });
                }

                var bllcrafts = [],
                    craftmodel = {};
                for (var i = 0; i < model.BllCrafts.length; i++) {
                    CRAFT_NAME = model.BllCrafts[i].CRAFT_NAME;
                    CRAFT_NO = model.BllCrafts[i].CRAFT_NO;
                }
                for (var kk = 0; kk < dataItems.CRAFT_LIST.length; kk++) {
                    PROD_NBR = dataItems.PROD_NBR;
                    CRAFT_NBR = dataItems.CRAFT_LIST[kk].CRAFT_NBR;
                    len = dataItems.CRAFT_LIST[kk].PROC_LIST.length;

                }
                var craftmodel = {
                    CRAFT_NAME: CRAFT_NAME,
                    CRAFT_NO: CRAFT_NO,
                    PROD_NBR: PROD_NBR,
                    CRAFT_NBR: CRAFT_NBR
                };
                if (model.BllCrafts.length != dataItems.CRAFT_LIST.length && newCmd == cmd.addCraft) { //新增工艺
                    for (var i = 0; i < model.BllCrafts.length; i++) {
                        var bllcrafts = [];
                        if (model.BllCrafts[i].FLAG == 0) {
                            bllcrafts.push(model.BllCrafts[i])
                            $.post("/Order/ProductMaintenance/addCradt", JSON.stringify({ prod_nbr: dataItems.PROD_NBR, bllcrafts: bllcrafts }), function(data) {
                                if (data.Status == 0) {
                                    refreshGrid();
                                    $("#x5window").data("kendoWindow").close();
                                    BzSuccess(data.Message);


                                } else {
                                    BzAlert(data.Message);
                                }
                            })
                        }
                    }


                } else if (model.BllCrafts.length == dataItems.CRAFT_LIST.length && newCmd == cmd.editCraft) { //编辑工艺
                    $.post("/Order/ProductMaintenance/ModiftCraft", JSON.stringify({ craftmodel: craftmodel }), function(data) {
                        if (data.Status == 0) {
                            $("#x5window").data("kendoWindow").close();
                            refreshGrid();
                            BzSuccess(data.Message);

                        } else {
                            BzAlert(data.Message);
                        }
                    })
                }
                var array = [],
                    arr = {};
                var c_name, c_no, PROC_NBR, TASK_NBR, FLAG, len2;
                for (var kk = 0; kk < dataItems.CRAFT_LIST.length; kk++) {
                    c_name = dataItems.CRAFT_LIST[kk].CRAFT_NAME;
                    c_no = dataItems.CRAFT_LIST[kk].CRAFT_NO;
                    for (var bb = 0; bb < dataItems.CRAFT_LIST[kk].PROC_LIST.length; bb++) {
                        PROC_NBR = dataItems.CRAFT_LIST[kk].PROC_LIST[bb].PROC_NBR;
                        TASK_NBR = dataItems.CRAFT_LIST[kk].PROC_LIST[bb].TASK_NBR;
                        CYCLE_RATE: dataItems.CRAFT_LIST[kk].PROC_LIST[bb].CYCLE_RATE;
                    }
                }
                for (var i = 0; i < model.BllCrafts.length; i++) {
                    for (var j = 0; j < model.BllCrafts[i].Bllprocess.length; j++) {
                        len2 = model.BllCrafts[i].Bllprocess.length;
                        FLAG = model.BllCrafts[i].Bllprocess[j].FLAG
                        if (FLAG == 0 && len != model.BllCrafts[i].Bllprocess.length) {
                            var tjson = {
                                PROD_NBR: PROD_NBR,
                                PROD_NAME: dataItems.PROD_NAME,
                                PROD_NO: dataItems.PROD_NO,
                                CRAFT_NBR: CRAFT_NBR,
                                GP_NBR: dataItems.GP_NBR,
                                MEMO: model.BllCrafts[i].Bllprocess[j].MEMO,
                                CRAFT_NAME: c_name,
                                CRAFT_NO: c_no,
                                CYCLE_RATE: model.BllCrafts[i].Bllprocess[j].CYCLE_RATE,
                                GP_NAME: $(treeobj.select()).find('.k-state-selected span').html(),
                                PID: parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid")),
                                GP_RANK_NUM: 0,
                                PC_MEMO: model.BllCrafts[i].Bllprocess[j].MEMO,
                                PROC_NAME: model.BllCrafts[i].Bllprocess[j].PROC_NAME,
                                PROC_NO: model.BllCrafts[i].Bllprocess[j].PROC_NO,
                                PROC_TYPE: model.BllCrafts[i].Bllprocess[j].PROC_TYPE,
                                RANK_NUM: model.BllCrafts[i].Bllprocess[j].RANK_NUM,
                                STD_TIME: model.BllCrafts[i].Bllprocess[j].STD_TIME,
                                TASK_NO: model.BllCrafts[i].Bllprocess[j].TASK_NO
                            };
                            array.push(tjson);
                        } else {
                            var arr = {
                                PROD_NBR: PROD_NBR,
                                PROD_NAME: dataItems.PROD_NAME,
                                PROD_NO: dataItems.PROD_NO,
                                CRAFT_NBR: CRAFT_NBR,
                                GP_NBR: dataItems.GP_NBR,
                                MEMO: model.BllCrafts[i].Bllprocess[j].MEMO,
                                CRAFT_NAME: c_name,
                                CRAFT_NO: c_no,
                                CYCLE_RATE: model.BllCrafts[i].Bllprocess[j].CYCLE_RATE,
                                GP_NAME: $(treeobj.select()).find('.k-state-selected span').html(),
                                PID: parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid")),
                                GP_RANK_NUM: 0,
                                PC_MEMO: model.BllCrafts[i].Bllprocess[j].MEMO,
                                PROC_NAME: model.BllCrafts[i].Bllprocess[j].PROC_NAME,
                                PROC_NO: model.BllCrafts[i].Bllprocess[j].PROC_NO,
                                PROC_TYPE: model.BllCrafts[i].Bllprocess[j].PROC_TYPE,
                                RANK_NUM: model.BllCrafts[i].Bllprocess[j].RANK_NUM,
                                STD_TIME: model.BllCrafts[i].Bllprocess[j].STD_TIME,
                                TASK_NO: model.BllCrafts[i].Bllprocess[j].TASK_NO,
                                PROC_NBR: PROC_NBR,
                                TASK_NBR: TASK_NBR,
                            };
                        }

                    }
                }

                if (newCmd == cmd.addProcess && len != len2) {
                    $.post("/Order/ProductMaintenance/addprocess", JSON.stringify({ craft_nbr: CRAFT_NBR, proc_list: array }), function(data) { //新增工序
                        if (data.Status == 0) {
                            $("#x5window").data("kendoWindow").close();
                            refreshGrid();
                            BzSuccess(data.Message);
                        } else {
                            BzAlert(data.Message);
                        }
                    });
                } else if (newCmd == cmd.editProcess && len == len2) {
                    $.post("/Order/ProductMaintenance/ModiftProcess", JSON.stringify({ procmodel: arr }), function(data) { //编辑工序
                        if (data.Status == 0) {
                            $("#x5window").data("kendoWindow").close();
                            refreshGrid();
                            BzSuccess(data.Message);
                        } else {
                            BzAlert(data.Message);
                        }
                    })
                }

            }
        },

    });
    ko.applyBindings(addviewModel, document.getElementById("memberviewmodel"));
}