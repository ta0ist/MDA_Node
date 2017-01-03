/**
 * Created by qb on 2016/11/29.
 */
app.controller('OnlineOrOfflineCtrl', function($scope, $http, $filter) {
        $scope.items = [];
        $scope.ID = "";
        GetGrouplist(0, "machine/GetGrouplist", $("#treeview-template").html(), "icon-group", function(e) {
            //alert("aaa");
            $scope.ID = parseInt($(e).find('[attr="treenode"]').attr("nodeid"));
            $scope.GetEmployeeUpDownLine();
        });
        //GetGrouplist(0, "machine/GetGrouplist", $("#treeview-template").html(), "icon-group", function (data) {
        //    alert("响应成功");
        //    var groupId = parseInt($(data).find('[attr="treenode"]').attr("nodeid"));
        //    $.post("/diagnosis/GetMachinesByGourpId", { groupId: groupId }, function (data) {
        //        if (data.Status == 0) {
        //            $scope.items = data.Data;
        //            if ($scope.items.length > 0) {
        //                for (var i = 0; i < $scope.items.length; i++) {
        //                    $scope.items[i].color = "#CCCCCC";
        //                    $scope.items[i].photo = "/" + $scope.items[i].PHOTO;
        //                    $scope.items[i].pars = [];
        //                }
        //            }
        //            $scope.$apply();
        //
        //            //获取即时参数
        //            if (TIME != undefined) {
        //                //TIME.clear();
        //                clearTimeout(TIME);
        //            }
        //            $scope.getRealData();
        //        }
        //    });
        //});
        $(".inbox-nav li a.btn").on("click", function() {
            $(".inbox-nav li.active").removeClass("active");
            $(this).parent().addClass("active");
            $scope.GetEmployeeUpDownLine();
        });
        $('#filter').bind('keypress', function(event) {
            if (event.keyCode == "13") {
                $scope.GetEmployeeUpDownLine();
            }
        });
        $scope.GetEmployeeUpDownLine = function() {
            var tData,
                //获取查询条件 所有、我的、离线、在线
                type = $(".inbox-nav").find(".active").children().attr("data-title");
            switch (type) {
                case "3":
                    tData = {
                        state: 3, //所有
                        keywords: $('#filter').val(),
                        user_nbr: false,
                        gp_nbr: $scope.ID
                    }
                    break;
                case "0":
                    tData = {
                        state: 0, //我的
                        keywords: $('#filter').val(),
                        user_nbr: true,
                        gp_nbr: $scope.ID
                    }
                    break;
                case "1":
                    tData = {
                        state: 1, //离线
                        keywords: $('#filter').val(),
                        user_nbr: false,
                        gp_nbr: $scope.ID
                    }
                    break;
                case "2":
                    tData = {
                        state: 2, //在线
                        keywords: $('#filter').val(),
                        user_nbr: false,
                        gp_nbr: $scope.ID
                    }
                    break;
            }
            $http.post('/OnlineOrOffline/GetEmployeeUpDownLine', tData)
                .success(function(data) {
                    $scope.items = data.Data;
                    //for (var i = 0; i < data.Data.length; i++) {
                    //if (data.Data[i].START_DATE == null) {
                    //    var date = moment().format('YYYY-MM-DD HH:mm:ss');
                    //    data.Data[i].START_DATE = date;
                    //    $scope.items = data.Data;
                    //} else { $scope.items = data.Data; }
                    // }

                });
        };
        $scope.format = function(date) {
            date.START_DATE = monent(date.START_DATE).format("YYYY-MM-DD HH:mm");
        }
        $scope.downLine = function(index) {
            BzConfirm("确定将【" + $scope.items[index].MEM_NAME + "】从该机床下线？", function(e) {
                if (e) {
                    var tData = {
                        mac_nbr: $scope.items[index].MAC_NBR,
                    }
                    $http.post('/OnlineOrOffline/DownLineWeb', tData)
                        .success(function(data) {
                            if (data.Status == 0) {
                                $scope.GetEmployeeUpDownLine();
                            } else {
                                BzAlert(data.Message);
                            }
                        });
                }
            });
        }

        $scope.upLine = function(index) {
            $.x5window(lang.EmployeePerformance.Add, kendo.template($("#popup-add").html()));
            var peoNbrs = $("#MEM_NBR").comboxTree({
                url: "/MachineWorkingState/GetAllMemberAndMemberGroup",
                data: { groupID: 0 },
                treetemplate: $("#treeview-template_out").html(),
                width: 175,
                diffwidth: 36,
                type: 4,
                url2: "/MachineWorkingState/GetKeywordMemberlist"
            }).data("BZ-comboxTree");

            $("#Win_Submit").on("click", function() {
                var tData = {
                    mac_nbr: $scope.items[index].MAC_NBR,
                    user_nbr: peoNbrs.rData
                }
                $http.post('/OnlineOrOffline/UpLineWeb', tData)
                    .success(function(data) {

                        if (data.Status == 0) {
                            $("#x5window").data("kendoWindow").close();
                            $scope.GetEmployeeUpDownLine();
                        } else {
                            BzAlert(data.Message);
                        }
                    });
            });
        }
    })
    .filter('format', function() {
        var filterfun = function(date) {
            return moment(date).format("YYYY-MM-DD HH:mm");
        };
        return filterfun;
    })