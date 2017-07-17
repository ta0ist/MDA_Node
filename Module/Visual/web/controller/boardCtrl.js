var app = angular.module('board', []);
app.controller('boardCtrl', function($scope, $http) {
    $scope.Data = {}, $scope.MachineList = [];
    $scope.paper = Raphael("factory", 1360, 680);
    $scope.MAC = drawFactoryView($scope.paper);
    $scope.color = [{
        name: '报警',
        value: 1,
        color: '#ff5b57'
    }, {
        name: '运行',
        value: 2,
        color: '#00acac'
    }, {
        name: '空闲',
        value: 3,
        color: '#f59c1a'
    }, {
        name: '调试',
        value: 4,
        color: '#348fe2'
    }, {
        name: '关机',
        value: 5,
        color: '#4b7086'
    }, ]

    //初始加载车间状态
    $scope.init = () => {
        $http.post('/visuals/r/GetImmediatelyparameter', {
            workcode: 'cj01'
        }).success((result) => {
            if (result.Status == 0) {
                $scope.updateMachine();
                $scope.updateRobot();
                setTimeout(() => { $scope.init() }, 3000);
            }
        })
    }

    //更新机床状态
    $scope.updateMachine = () => {
            $http.post('/visuals/r/GetMachineStatus', {
                workcode: 'cj01'
            }).success((result) => {
                if (result.Status == 0) {
                    for (let i = 0; i < result.Data.length; i++) {
                        let mac_nbr = result.Data[i].MAC_NBR;
                        if ($scope.MAC[mac_nbr] != undefined) {
                            let color = _.where($scope.color, { 'value': result.Data[i].Status })[0].color;
                            $scope.MAC[mac_nbr].MAC.attr("fill", color);
                        }
                    }
                }
                setTimeout(() => { $scope.updateMachine() }, 3000);
            })


        }
        //更新机械手状态
    $scope.updateRobot = () => {
        $http.post('/visuals/r/GetRobot', {
            workcode: 'cj01'
        }).success((result) => {
            if (result.Status == 0) {
                $scope.MachineList = [];
                if (result.Data.length > 0) {
                    for (let i = 0; i < result.Data[0].LI.length; i++) {
                        if (result.Data[0].LI[i].Description == '1') {
                            $scope.MachineList.push({
                                mac_name: result.Data[0].LI[i].Name,
                                value: result.Data[0].LI[i].Value == 0 ? '空' : '满'
                            })
                        } else if (result.Data[0].LI[i].Description == '2') {
                            $scope.MachineList.push({
                                mac_name: result.Data[0].LI[i].Name,
                                value: result.Data[0].LI[i].Value == 0 ? '在线' : '离线'
                            })
                        } else if (result.Data[0].LI[i].Description == '4') {
                            let item_name = '';
                            switch (result.Data[0].LI[i].Value) {
                                case 14:
                                    item_name = '毛坯取料';
                                    break;
                                case 13:
                                    item_name = '缓存区-3';
                                    break;
                                case 12:
                                    item_name = '缓存区-2';
                                    break;
                                case 11:
                                    item_name = '缓存区-1';
                                    break;
                                case 10:
                                    item_name = '抽检台';
                                    break;
                                case 9:
                                    item_name = '转换台-4';
                                    break;
                                case 8:
                                    item_name = '转换台-3';
                                    break;
                                case 7:
                                    item_name = '转换台-2';
                                    break;
                                case 6:
                                    item_name = '转换台-1';
                                    break;
                                case 5:
                                    item_name = '20工序机床';
                                    break;
                                case 4:
                                    item_name = '15工序机床';
                                    break;
                                case 3:
                                    item_name = '05-2工序机床';
                                    break;
                                case 2:
                                    item_name = '10工序机床';
                                    break;
                                case 1:
                                    item_name = '05-1工序机床';
                                    break;
                            }
                            $scope.MachineList.push({
                                mac_name: result.Data[0].LI[i].Name,
                                value: item_name
                            })
                        }

                    }
                }
            }
            setTimeout(() => { $scope.updateRobot() }, 3000);
        })
    }
    $scope.init();
})