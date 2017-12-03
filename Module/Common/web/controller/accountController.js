var grid;
app.controller('accountctrl', ['$scope', '$http', function($scope, $http) {
    $scope.user = {
        USER_NBR: 0,
        USER_NAME: "",
        PASSWORD: "",
        RESOURCE_TYPE: "",
        REF_RESOURCE: "",
        GP_NBR: 0,
        EXPIRED: ""

    };
    var fields = {
        USER_NBR: { type: "string" },
        USER_NAME: { type: "string" },
        PASSWORD: { type: "string" },
        SECURITY_LEVEL: { type: "string" },
        STATE: { type: "string" },
        REF_RESOURCE: { type: "string" },
        REF_NAME: { type: "string" },
        EXPIRED: { type: "date" },
        RESOURCE_TYPE: { type: "string" }
    };
    var cols = [];
    cols.push({ field: "USER_NBR", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "USER_NAME", title: lang.Common.UserName, width: 80, sortable: true, filterable: false });
    cols.push({ field: "RESOURCE_TYPE", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "SECURITY_LEVEL", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "STATE", title: lang.Common.Enabled, width: 80, sortable: true, filterable: false, template: kendo.template($("#template_STATE").html()) });
    cols.push({ field: "REF_RESOURCE", title: "关联名称", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "REF_NAME", title: lang.Common.AssociatedWithTheName, width: 80, sortable: true, filterable: false });
    cols.push({ field: "EXPIRED", title: lang.Common.ExpirationDate, width: 80, format: "{0: yyyy/MM/dd}", sortable: true, filterable: false });
    cols.push({
        command: [
            { name: "aa", text: lang.Order.Edit + '<i class="icon-edit"></i>', className: "btn purple", click: f_edit },
            { name: "bb", text: lang.Common.Reset + '<i class="icon-key"></i>', className: "btn red ", click: f_reset }
        ],
        title: lang.Order.Operation,
        width: 200
    });
    grid = $("#grid").grid({
        checkBoxColumn: true,
        baseUrl: "/", //调用的URL
        selectable: "single", //行选择方式
        //sort: [{ field: "USER_NBR", dir: "ASC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: false,
        resizeGridWidth: true, //列宽度可调
        isPage: true,
        filter: null,
        //server: true, //服务器端刷新，包括排序，筛选等
        actionUrl: ["getuser", "", "", ""], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "USER_NBR",
            fields: fields,
            cols: cols
        }
    });
    $(".nav-tabs li").mouseup(function() {
        refreshGrid(parseInt($(this).attr("value")));
    });
    //添加用户
    $scope.adduser = function() {
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        //验证

        var selectedNode = treeobj.select();
        if (selectedNode.length > 0) { //判断是否有选中的节点
            $.x5window(lang.Common.Added, kendo.template($("#popup-add").html()), function() {
                $("#Combox_orgnizetree_context_COMBOX").data("kendoTreeView").destroy();
                $("#Combox_orgnizetree_COMBOX").remove();
            });
            var url, tdata, url2;
            if (parseInt($('.nav-tabs li[class="active"]').attr("value")) == 1) { //员工
                url = "/account/GetAllMemberAndMemberGroup";
                tdata = { groupID: 0 };
                url2 = "/account/GetKeywordMemberlist";
                type = 4;
            } else {
                url = "/account/GetAllMachineAndMachineGroup";
                tdata = { groupID: 0 };
                url2 = "/account/GetKeywordMachinelist";
                type = 2;
            }

            $("#COMBOX").comboxTree({
                url: url,
                data: tdata,
                treetemplate: $("#treeview-template").html(),
                type: type,
                width: 176,
                diffwidth: 36,
                validate: true,
                validateMessage: lang.Common.NotEmpty,
                url2: url2
            });
            $("#EXPIRED").kendoDatePicker({ format: "yyyy/MM/dd" });


            $("#Win_Submit").bind("click", function(e) {
                validator = $("#signupForm").validate({
                    rules: {
                        USER_NAME: { required: true }
                    },
                    messages: {
                        USER_NAME: { required: lang.Common.NotEmpty }
                    }
                });
                var USER_NAME = $("#USER_NAME").val(),
                    PASSWORD = $("#PASSWORD").val();
                if (validator.form()) {
                    var data = {
                        USER_NAME: USER_NAME,
                        PASSWORD: UT.MD5(PASSWORD),
                        RESOURCE_TYPE: parseInt($('.nav-tabs li[class="active"]').attr("value")),
                        REF_RESOURCE: $("#COMBOX").data("BZ-comboxTree").rData,
                        GP_NBR: parseInt($(selectedNode).find('.k-state-selected span').attr("nodeid")),
                        EXPIRED: $("#EXPIRED").val()
                    }
                    $.post("/account/AddUser", data, function(data) {
                        if (data.Status == 0) {
                            $("#x5window").data("kendoWindow").close();
                            refreshGrid();
                            BzSuccess(data.Message);
                        } else {
                            BzAlert(data.Message);
                        }
                    });
                } else {
                    BzAlert(lang.Common.UserNamePasswordCannotBeEmpty);
                }
            })
        }

    }

    //启/禁用户
    $scope.lockuser = function() {
        var dd = grid.data("bz-grid").checkedDataRows();
        var UserIDs = [];
        for (var i = 0; i < dd.length; i++) {
            UserIDs.push(dd[i].USER_NBR);
        }
        if (UserIDs.length > 0) {
            $.post("/account/Switch", JSON.stringify({ UserIDs: UserIDs }), function(data) {
                if (data.Status == 0) {
                    refreshGrid();
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            });
        } else {
            BzAlert(lang.Common.OperationFailure);
        }
    }

    //删除用户
    $scope.deleteuser = function() {
        BzConfirm(lang.Common.DeleteUser, function(e) {
            if (e) {
                var dd = grid.data("bz-grid").checkedDataRows();
                var UserIDs = [];
                for (var i = 0; i < dd.length; i++) {
                    UserIDs.push(dd[i].USER_NBR);
                }
                $.post("/account/DeleteUser", JSON.stringify({ UserIDs: UserIDs }), function(data) {
                    if (data.Status == 0) {
                        refreshGrid();
                        BzSuccess(data.Message);
                    } else {
                        BzAlert(data.Message);
                    }
                });
            }
        });
    };


    //绑定树
    GetGrouplist(0, "account/FindSubGroupByParentIdRecycle", $("#treeview-template").html(), "icon-group");

    //变化树的图标
    $("#tree_expand").toggle(function() {
        $("#orgnizetree").data("kendoTreeView").expand(".k-item");
    }, function() {
        $("#orgnizetree").data("kendoTreeView").collapse(".k-item");
    });

    //添加树
    $scope.tree_add = function() {
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var selectedNode = treeobj.select();
        if (selectedNode.length > 0) {
            var GroupInfo = {
                PID: parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid")),
                LEVEL_NBR: parseInt($(treeobj.select()).find('.k-state-selected span').attr("level_nbr"), 10) + 1,
                GP_NAME: "新节点",
                RANK_NUM: 0
            }
            $.post("account/AddGroup", GroupInfo, function(data) {
                if (data.Status == 0) {
                    var obj = treeobj.append({
                        text: GroupInfo.GP_NAME,
                        id: data.Data,
                        icon: "icon-group",
                        PID: GroupInfo.PID,
                        LEVEL_NBR: GroupInfo.LEVEL_NBR
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
            BzAlert(lang.Common.PleaseSelectANode);
        }
    }

    //编辑树
    $scope.tree_edit = function() {
        var GP_NAME;
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var selectedNode = treeobj.select();
        if (selectedNode.length > 0) {
            var obj = selectedNode.find('.k-state-selected span').data("BZ-editer");
            if (obj == undefined) {
                selectedNode.find('.k-state-selected span').editer({
                    url: "account/ModifyGroup",
                    title: "文本框",
                    Ok: function(name) {
                        GP_NAME = name;
                        this.close();
                        var treeobj = $("#orgnizetree").data("kendoTreeView");
                        var GroupInfo = {
                            GP_NBR: parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid")),
                            GP_NAME: name,
                            RANK_NUM: 0
                        }
                        $.post("account/ModifyGroup", (GroupInfo), function(data) {
                            if (data.Status == 0) {
                                var treeobj = $("#orgnizetree").data("kendoTreeView");
                                $(treeobj.select()).find('.k-state-selected span').html(GP_NAME);
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

    }

    //删除树
    $scope.tree_delete = function() {
        BzConfirm(lang.Order.Delete, function(e) {
            if (e) {
                var treeobj = $("#orgnizetree").data("kendoTreeView");
                $.post("account/DelGroupWithAccountUsers", { groupid: $(treeobj.select()).find('.k-state-selected span').attr("nodeid") }, function(data) {
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
    }

    //新增树节点
    $scope.tree_addRootNode = function() {
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var GroupInfo = {
            PID: 0,
            LEVEL_NBR: 1,
            GP_NAME: '新节点',
            RANK_NUM: 0
        }
        $.post("/account/AddGroup", GroupInfo, function(data) {
            if (data.Status == 0) {
                var obj = treeobj.append({
                    text: GroupInfo.GP_NAME,
                    id: data.Data,
                    icon: "icon-group",
                    PID: 0,
                    LEVEL_NBR: 1
                }, null);
                BzSuccess(data.Message);
                //进入编辑
                treeobj.select(obj);
                $("#tree_edit").trigger('click');
            } else {
                BzAlert(data.Message);
            }
        });
    }


}])

//编辑用户
function f_edit(e) {
    $.x5window(lang.Common.EditData, kendo.template($('#popup-edit').html()), function() {
        $("#Combox_orgnizetree_context_COMBOX").data("kendoTreeView").destroy();
        $("#Combox_orgnizetree_COMBOX").remove();
    });
    validator = $("#signupForm").validate({
        rules: {
            USER_NAME: { required: true }
        },
        messages: {
            USER_NAME: { required: lang.Common.NotEmpty }
        }
    });
    var url, tdata, url2;
    if (parseInt($('.nav-tabs li[class="active"]').attr("value")) == 1) { //员工
        url = "/account/GetAllMemberAndMemberGroup";
        tdata = { groupID: 0 };
        url2 = "/account/GetKeywordMemberlist";
        type = 4;
    } else {
        url = "/account/GetAllMachineAndMachineGroup";
        tdata = { groupID: 0 };
        url2 = "/account/GetKeywordMachinelist";
        type = 2;
    }

    $("#COMBOX").comboxTree({
        url: url,
        data: tdata,
        treetemplate: $("#treeview-template").html(),
        type: type,
        width: 176,
        diffwidth: 36,
        validateMessage: lang.Common.NotEmpty,
        url2: url2
    });

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    $("#USER_NAME").val(dataItem.USER_NAME)
    $("#EXPIRED").kendoDatePicker({ format: "yyyy/MM/dd", value: dataItem.EXPIRED });
    $("#Win_Submit").bind("click", function(e) {
        if (validator.form() && $("#COMBOX").data("BZ-comboxTree").validate()) {
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var selectedNode = treeobj.select();
            var data = {
                USER_NBR: dataItem.USER_NBR,
                USER_NAME: $("#USER_NAME").val(),
                RESOURCE_TYPE: parseInt($('.nav-tabs li[class="active"]').attr("value")),
                REF_RESOURCE: $("#COMBOX").data("BZ-comboxTree").rData,
                GP_NBR: parseInt($(selectedNode).find('.k-state-selected span').attr("nodeid")),
                EXPIRED: $("#EXPIRED").val()
            }
            $.post("/account/ModifyUser", data, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    refreshGrid();
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            });
        } else {

        }
    })
}

function f_reset(e) {
    $.x5window(lang.Common.ResetPassword, kendo.template($("#popup-passwordreset").html()));
    //验证
    validator = $("#signupForm").validate({
        rules: {
            PASSWORD: { required: true },
            CONFIRM_PASSWORD: { required: true, equalTo: "#PASSWORD" }
        },
        messages: {
            PASSWORD: { required: lang.Common.PleaseEnterThePassword },
            CONFIRM_PASSWORD: {
                required: lang.Common.PleaseEnterThePasswordAgain,
                equalTo: lang.Common.PasswordDoesNotMatch
            }
        }
    });
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    $("#Win_Submit").bind("click", function(e) {
        if (validator.form()) {
            var data = {
                userId: dataItem.USER_NBR,
                password: UT.MD5($("#PASSWORD").val()),
            }
            $.post("/account/ResetPassword", data, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    refreshGrid();
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            });
        }
    })

}

//点击禁用按钮
function f_Enable(e) {
    var dd = grid.data("bz-grid").selectedDataRows();
    $.post("/account/Switch", JSON.stringify({ UserIDs: [dd[0].USER_NBR] }), function(data) {
        if (data.Status == 0) {
            if ($("#filter").val() == "") { //关键字查询
                grid.grid("refresh", function() {
                    var treeobj = $("#orgnizetree").data("kendoTreeView");
                    var selectedNode = treeobj.select();
                    return [
                        { field: "keyword", Operator: "eq", value: parseInt(selectedNode.find('.k-state-selected span').attr("nodeid")) },
                        { field: "userType", Operator: "eq", value: parseInt($('.nav-tabs li[class="active"]').attr("value")) }
                    ];
                });
            } else {
                getDataByKeyWord();
            }
            BzSuccess(data.Message);
        } else {
            BzAlert(data.Message);
        }
    });
}


function refreshGrid(type) {
    if ($("#filter").val() == "") {
        grid.grid("refresh", function() {
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var selectedNode = treeobj.select();
            return [
                { field: "keyword", Operator: "eq", value: parseInt(selectedNode.find('.k-state-selected span').attr("nodeid")) },
                { field: "userType", Operator: "eq", value: (type == undefined) ? parseInt($('.nav-tabs li[class="active"]').attr("value")) : type }
            ];
        });
    }
    //else {
    //    getDataByKeyWord();
    //}
}