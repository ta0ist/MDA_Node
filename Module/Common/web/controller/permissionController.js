app.controller('perCtrl', function($scope, $http) {
    FindSubUserGroupByParentIdRecycle(0, $("#treeview-template").html(), function(data) {
        var accuntid = parseInt($(data).find('[attr="treenode"]').attr("nodeid")),
            type = parseInt($(data).find('[attr="treenode"]').attr("flag")),
            treeobj = $("#orgnizetree_menu").data("kendoTreeView"),
            selectedNode = treeobj.select();
        $scope.getAceess(accuntid, selectedNode, type, selectedNode.find('.k-state-selected span').attr("nodeid"));
    });
    $http.get('/P_GetSubMenu').success(function(data) {
        if (data.Status == 0) {
            $("#orgnizetree_menu").kendoTreeView({
                dataSource: {
                    data: menuFomattree(data.Data)
                },
                template: $("#treeviewmenu-template").html(),
                select: function(e) {
                    var treeobj = $("#orgnizetree").data("kendoTreeView"),
                        selectedNode = treeobj.select(),
                        type = parseInt(selectedNode.find('.k-state-selected span').attr("flag")),
                        accountid = parseInt(selectedNode.find('.k-state-selected span').attr("nodeid"));
                    //).find('[attr="treenode"]').attr("nodeid")
                    $scope.getAceess(accountid, e.node, type, $(e.node).find('[attr="treenode"]').attr("nodeid"));
                }
            });
        }
    });
    $scope.setFn = function(index) {
        if ($scope.type == 1) {
            var data = {
                userId: $scope.userId,
                userFunctions: $scope.buttons[index].FUNC_NBR,
                status: $scope.buttons[index].PERMISSION
            }
            $.post('/AddUserFun', data, function(data) {
                if (data.Status == 0) {
                    $scope.buttons[index].PERMISSION = data.Data;
                    $scope.$apply();
                } else {
                    BzAlert(data.Message);
                }
            })
        } else {
            var data = {
                group: $scope.groupId,
                userFunctions: $scope.buttons[index].FUNC_NBR,
                status: $scope.buttons[index].PERMISSION
            }
            $.post('/AddGroupFun', data, function(data) {
                if (data.Status == 0) {
                    $scope.buttons[index].PERMISSION = data.Data;
                    $scope.$apply();
                } else {
                    BzAlert(data.Message);
                }
            })
        }
    }
    $scope.getAceess = function(accountid, menu, type, menuid) {
        if (accountid != undefined && !isNaN(accountid) && menuid != undefined) {
            //遍历查找function id
            $scope.type = type;
            var menuid = trasformat(menu, menuid);
            //alert(accountid + ";" + menuid + ";" + type);
            if (type == 1) { //用户
                $scope.userId = accountid;
                $scope.function_nbr = menuid;
                var data = {
                    userId: accountid,
                    function_nbr: menuid
                }
                $.post('/GetUserAccredit', JSON.stringify(data), function(data) {
                    if (data.Status == 0) {
                        //语言处理
                        for (var i = 0; i < data.Data.length; i++) {
                            // var array = data.Data[i].FUNC_NBR.split(".");
                            data.Data[i]["Text"] = data.Data[i].FUNC_NAME;
                        }
                        $scope.buttons = data.Data;
                        $scope.$apply();
                    } else {
                        BzAlert(data.Message);
                    }
                });
            } else {
                $scope.groupId = accountid;
                $scope.function_nbr = menuid;
                var data = {
                    groupId: accountid,
                    function_nbr: menuid
                }
                $.post('/GetUserGroupAccredit', JSON.stringify(data), function(data) {
                    if (data.Status == 0) {
                        //语言处理
                        for (var i = 0; i < data.Data.length; i++) {
                            // var array = data.Data[i].FUNC_NBR.split(".");
                            data.Data[i]["Text"] = data.Data[i].FUNC_NAME;
                        }
                        $scope.buttons = data.Data;
                        $scope.$apply();
                    } else {
                        BzAlert(data.Message);
                    }
                });
            }
        }
    };
})

//递归处理function id
function trasformat(menu, menuid) {
    var treeobj = $("#orgnizetree_menu").data("kendoTreeView");
    // selectedNode = treeobj.select();
    var cc = treeobj.parent(menu);
    if (cc.length > 0) {
        var nodeid = $(cc).children().eq(0).find("[attr='treenode']").attr("nodeid");
        var keyRex = new RegExp(nodeid, "g");
        menuid = menuid.replace(keyRex, nodeid + ".");
        //if (treeobj.parent(cc).length > 0) {
        trasformat(cc, menuid);
    }
    return menuid;
}