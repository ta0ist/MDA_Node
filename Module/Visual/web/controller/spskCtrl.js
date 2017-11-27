var app = angular.module('spsk', []);
app.controller('spskCtrl', function($scope, $http) {

    var myChart = echarts.init(document.getElementById('mac_acv'));
    var people_acv = echarts.init(document.getElementById('people_acv'));
    var mac_pro = echarts.init(document.getElementById('mac_pro'));
    myChart.setOption(GetOption('Yesterday Machining Efficiency'));
    people_acv.setOption(GetOption('Yesterday Operator Efficiency'));
    mac_pro.setOption(GetOption('MTD Machining PPM'));
    $scope.status = [];
    $scope.status.push({
        color: "#000",
        MacCount: 0,
        Icon: 'icon iconfont icon-suspend',
        name: '停机',
        StatusID: 1
    }, {
        color: "#000",
        MacCount: 0,
        Icon: 'icon iconfont icon-play',
        name: '运行',
        StatusID: 2
    }, {
        color: "#000",
        MacCount: 0,
        Icon: 'icon iconfont icon-time',
        name: '空闲',
        StatusID: 3
    }, {
        color: "#000",
        MacCount: 0,
        Icon: 'icon iconfont icon-prompt',
        name: '关机',
        StatusID: 4
    }, {
        color: "#000",
        MacCount: 0,
        Icon: 'icon iconfont icon-decoration_fill',
        name: '调试',
        StatusID: 5
    })
    $scope.GetStatusColorAndCount = function() {
        $http.get('/r/GetStatusColorAndCount')
            .success(function(data) {
                if (data.Status == 0) {
                    for (var i = 0; i < data.Data.length; i++) {
                        for (var j = 0; j < $scope.status.length; j++) {
                            if (data.Data[i].STATUS_NBR == $scope.status[j].StatusID) {
                                $scope.status[j].color = data.Data[i].COLOR16;
                                $scope.status[j].MacCount = data.Data[i].MacCount;
                            }
                        }
                    }
                    setTimeout(function() {
                        $scope.GetStatusColorAndCount();
                    }, 5000);
                } else {
                    BzAlert(data.Message);
                }
            })
    }

    $scope.GetStatusColorAndCount();

})