app.controller('appCtrl', ['$scope', function($scope) {
    var baseUrl = "/diagnosis/";
    var TIME;
    $scope.items = [];
    GetGrouplist(0, "machine/GetGrouplist", $("#treeview-template").html(), "icon-group", function(data) {
        var groupId = parseInt($(data).find('[attr="treenode"]').attr("nodeid"));
        $.post(baseUrl + "GetMachinesByGourpId", { groupId: groupId }, function(data) {
            if (data.Status == 0) {
                $scope.items = data.Data;
                if ($scope.items.length > 0) {
                    for (var i = 0; i < $scope.items.length; i++) {
                        $scope.items[i].color = "#CCCCCC";
                        $scope.items[i].photo = "/images/machine/NoDefault/" + $scope.items[i].PHOTO;
                        $scope.items[i].pars = [];
                    }
                }
                $scope.$apply();

                //获取即时参数
                if (TIME != undefined) {
                    //TIME.clear();
                    clearTimeout(TIME);
                }
                $scope.getRealData();
            }
        });
    });
    $scope.showDetail = function(index) {
        location.href = "/diagnosisdetail?no=" + $scope.items[index].MAC_NBR + "&type=" + $scope.items[index].CATEGORY;
    }
    $scope.getRealData = function() {
        var machineIds = "";
        for (var i = 0; i < $scope.items.length; i++) {
            machineIds += $scope.items[i].MAC_NBR + ',';
        }
        machineIds = machineIds.substring(0, machineIds.length - 1);
        $.post("/diagnosis/GetImmediatelyparameter", ({ machineIds: machineIds }), function(data) {
            for (var i = 0; i < $scope.items.length; i++) {
                $.each(data.Data.MAC_DATA, function(a, b) {
                    if ($scope.items[i].MAC_NBR == a) {
                        $scope.items[i].pars = [];
                        for (var k = 0; k < b.DATAITEMS.length; k++) {
                            if (b.DATAITEMS[k].Hot) {
                                var tjson;
                                if (b.DATAITEMS[k].Name == "STD::Status") {
                                    tjson = {
                                        NAME: b.DATAITEMS[k].Description,
                                        VALUE: b.DATAITEMS[k].Value == 0 ? "-- -- " : data.Data.STATUS_DATA[b.DATAITEMS[k].Value].NAME,
                                        UNIT: b.DATAITEMS[k].UnitName
                                    }
                                    $scope.items[i].color = b.DATAITEMS[k].Value == 0 ? "#CCCCCC" : data.Data.STATUS_DATA[b.DATAITEMS[k].Value].COLOR16;
                                } else if (b.DATAITEMS[k].Name == "STD::SubStatus") {
                                    tjson = {
                                        NAME: b.DATAITEMS[k].Description,
                                        VALUE: b.DATAITEMS[k].Value == 0 ? "-- -- " : data.Data.STATUS_DATA[b.DATAITEMS[k].Value].NAME,
                                        UNIT: b.DATAITEMS[k].UnitName
                                    }

                                } else if (b.DATAITEMS[k].Name == "STD::StatusStartTime" || b.DATAITEMS[k].Name == "DeviceDateTime") {
                                    tjson = {
                                        NAME: b.DATAITEMS[k].Description,

                                        VALUE: moment(b.DATAITEMS[k].Value).format('YYYY-MM-DD hh:ss:mm'),
                                        UNIT: b.DATAITEMS[k].UnitName
                                    }
                                } else {
                                    tjson = {
                                        NAME: b.DATAITEMS[k].Description,
                                        VALUE: b.DATAITEMS[k].Value,
                                        UNIT: b.DATAITEMS[k].UnitName
                                    }
                                }
                                $scope.items[i].pars.push(tjson);
                            }
                        }
                        $scope.$apply();
                    }
                })
            }
            TIME = setTimeout(function() {
                $scope.getRealData();
            }, 5000);
        });
    }
}]);