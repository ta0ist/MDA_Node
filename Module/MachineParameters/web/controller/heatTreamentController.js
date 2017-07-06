app.controller('HeatTreamentCtrl', function($scope, $http) {
    $scope.machinesItem = [];
    $scope.AreaList = [];
    $scope.focus = 0;
    $scope.work_order = {
        BATCH: "",
        MATERIAL: "",
        WORK_ORDER: "",
        YEILD: ""
    }
    $.post("/HeatTreatment/GetMachinesByGourpId", { GroupId: 23 }, function(data) {
        if (data.Status == 0) {
            if (data.Data.length > 0) {
                $scope.machinesItem = data.Data;
            }
            $http.post('/HeatTreatment/GetTempNow', { GroupId: data.Data[0].GP_NBR }).success(function(result) {
                if (result.Status == 0) {
                    $scope.AreaList = result.Data;
                    $scope.$apply();
                    $scope.drawLine(result.Data);
                    $scope.mac_temp_Timeout = setInterval($scope.getImmidateData(data.Data[0].GP_NBR), 3000);
                }
            })

            $http.post('/HeatTreatment/GetWorkOrder', { GroupId: data.Data[0].GP_NBR }).success(function(resd) {
                if (resd.Status == 0) {
                    if (resd.Data.length > 0) {
                        $scope.work_order = resd.Data[0];
                        $scope.work_order.WORK_ORDER = resd.Data[0].MEMO;
                    }

                }
            })
        }
    })

    //换组
    $scope.dianji = function(index) {
        $scope.focus = index;
        clearInterval($scope.mac_temp_Timeout);
        $scope.AreaList = [];
        $http.post('/HeatTreatment/GetTempNow', { GroupId: $scope.machinesItem[index].GP_NBR }).success(function(result) {
            if (result.Status == 0) {
                $scope.AreaList = result.Data;
                $scope.drawLine(result.Data);
                $scope.mac_temp_Timeout = setInterval($scope.getImmidateData($scope.machinesItem[index].GP_NBR), 10000);
            }
        })

        $http.post('/HeatTreatment/GetWorkOrder', { GroupId: $scope.machinesItem[index].GP_NBR }).success(function(resd) {
            if (resd.Status == 0) {
                if (resd.Data.length > 0) {
                    $scope.work_order = resd.Data[0];
                    $scope.work_order.WORK_ORDER = resd.Data[0].MEMO;
                } else {
                    $scope.work_order = {
                        BATCH: "",
                        MATERIAL: "",
                        WORK_ORDER: "",
                        YEILD: ""
                    }
                }

            }
        })

    }

    //获取即时数据(不含参数)
    $scope.getImmidateData = function(machineId) {
        return function() {
            $http.post('/HeatTreatment/GetTempNow', { GroupId: machineId }).success(function(result) {
                if (result.Status == 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        if ($scope.AreaList[i].machineitems.length > 0) {
                            $scope.AreaList[i].machineitems[1].Value = result.Data[i].machineitems[1].Value;
                            $scope.AreaList[i].machineitems[0].Value = result.Data[i].machineitems[0].Value;
                            //    $scope.AreaList[i].BATCH = result.Data[i].BATCH;
                            //    $scope.AreaList[i].YEILD = result.Data[i].YEILD;
                            //    $scope.AreaList[i].MATERIAL = result.Data[i].MATERIAL;
                        }
                    }
                    //$scope.AreaList = result.Data;
                }
            })
        }
    }

    //获取即时数据(含参数)
    $scope.getImmidateDataAll = function(machineId) {
        return function() {
            $http.post('/HeatTreatment/GetTempNow', { GroupId: machineId }).success(function(result) {
                if (result.Status == 0) {
                    for (var i = 0; i < result.Data.length; i++) {
                        if ($scope.AreaList[i].machineitems.length > 0) {
                            $scope.AreaList[i].machineitems[1].Value = result.Data[i].machineitems[1].Value;
                            $scope.AreaList[i].machineitems[0].Value = result.Data[i].machineitems[0].Value;
                            $scope.AreaList[i].BATCH = result.Data[i].BATCH;
                            $scope.AreaList[i].YEILD = result.Data[i].YEILD;
                            $scope.AreaList[i].MATERIAL = result.Data[i].MATERIAL;
                        }
                    }
                    //$scope.AreaList = result.Data;
                }
            })
        }
    }

    //绘制曲线图
    $scope.drawLine = function(data) {
        for (var i = 0; i < data.length; i++) {
            (function(i) {
                $http.post('/HeatTreatment/GetTempHis', { MachineId: data[i].Mac_nbr }).success(function(result) {
                    if (result.Status == 0) {
                        T_line('right_' + i, '', data[i].Mac_nbr, result.Data, 10000);
                    }
                })
            })(i)
        }
    }


    //保存
    $scope.saveInfo = function(index) {
        $http.post('/HeatTreatment/setValue', { data: $scope.work_order, gp_nbr: $scope.machinesItem[$scope.focus].GP_NBR }).success(function(result) {
            if (result.Status == 0) {
                BzSuccess('操作成功！');
            }
        })
    };

    $scope.print = function() {
        window.open("/HeatTreamentPrint?gp_nbr=" + $scope.machinesItem[$scope.focus].GP_NBR);
    };

    //设置pv值
    $scope.SetPV = function(index) {
        $http.post('/HeatTreatment/SetPV', { data: $scope.AreaList[index], type: 'PV' }).success(function(result) {
            if (result.Status == 0) {
                BzSuccess('操作成功！');
            }
        })
    }

    //设置SV值
    $scope.SetSV = function(index) {
        $http.post('/HeatTreatment/SetSV', { data: $scope.AreaList[index], type: 'SV' }).success(function(result) {
            if (result.Status == 0) {
                BzSuccess('操作成功！');
            }
        })
    }
});