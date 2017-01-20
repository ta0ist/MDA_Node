var app = angular.module('X_cut', [])
app.controller('X_cut_ctrl', function($scope, $http) {
    //产品列表
    $scope.Prolist;
    $scope.Pro;

    //标准项
    $scope.bun = [];

    //横坐标
    $scope.categories = [];
    for (var i = 0; i < 60; i++) {
        $scope.categories.push(i + 1);
        // $scope.measured_data.data.push(Math.ceil(Math.random() * 10));
        // $scope.cut_data.data.push(Math.random());
    }

    //测量值
    $scope.measured_data = {};
    $scope.measured_data.data = [];
    $scope.measured_data.color = '#E8FFF5';
    $scope.measured_data.name = '测量值';
    $scope.measured_data.symbol = 'none';

    //刀补值
    $scope.cut_data = {};
    $scope.cut_data.data = [];
    $scope.cut_data.color = '#FDFD8A';
    $scope.cut_data.name = '刀补值';

    $http.get('/product').success(function(data) {
        if (data.Status == 0) {
            $scope.Prolist = data.Data;
            for (var i = 0; i < data.Data.length; i++) {
                $scope.bun.push({
                    name: data.Data[i].Cutting_Content,
                    value: data.Data[i].Dime_Nsion
                });
            }
            if ($scope.Prolist.length > 0) {
                //获取机床号
                $http.post('/machine/GetMachineList', { PageIndex: 1, PageSize: 20, keyword: data.Data[0].Line }).success(function(data) {
                    $scope.Allmachine = data.Data.List
                    $scope.macList = _.first($scope.Allmachine, 5);
                    $scope.focus_mac = 0;
                    $scope.focus = 0;
                    $scope.Pro = $scope.Prolist[0];
                    $scope.get_measured_data(0);
                    // $http.post('/get_TOOLS_MEASURED', {
                    //     MAC_NBR: $scope.macList[0].MAC_NBR,
                    //     PART_NO: $scope.Pro.Product_Model,
                    //     ADDR: $scope.Pro.QPLC
                    // }).success(function(result) {
                    //     if (result.Status == 0) {
                    //         for (var i = 0; i < result.Data.length; i++) {
                    //             $scope.measured_data.data.push(result.Data[i].SURVEY_VAL);
                    //             $scope.cut_data.data.push(result.Data[i].OFFSET_VAL);
                    //         }
                    //         var max_red = $scope.Pro.Dime_Nsion + $scope.Pro.Up_Offset;
                    //         var min_red = $scope.Pro.Dime_Nsion - $scope.Pro.Down_Offset;
                    //         F_Xchart_M($scope.categories, $scope.measured_data, get_plotLines(max_red, min_red, $scope.Pro.CPK), max_red, min_red);
                    //         F_Xchart_O($scope.categories, $scope.cut_data);
                    //         //测量表格
                    //         $scope.measured_table = result.Data;
                    //     }
                    // })
                })
            }
        }

    })



    //机床步长
    $scope._macIndex = 0;
    //总机床数
    $scope.Allmachine = [];

    $scope.macList = [];

    //更换机床步长
    $scope.getmac = function() {
        rotateDIV($scope.macList);
        setTimeout($scope.changemac, 2000);

    };

    $scope.changemac = function() {
        $scope.macList = [];
        $scope._macIndex++;
        for (var i = $scope._macIndex * 5; i < ($scope._macIndex + 1) * 5; i++) {
            if (i == $scope.Allmachine.length) {
                $scope._macIndex = -1;
                $scope.focus_mac = 0;
                $scope.$apply();
                return;
            } else {
                $scope.macList.push($scope.Allmachine[i])
            }
        }
        $scope.focus_mac = 0;
        $scope.get_measured_data($scope.focus_mac);
        $scope.$apply();
    }

    //改变尺寸
    $scope.change_dime = function(index) {
        $scope.focus = index;
        $scope.Pro = $scope.Prolist[index];
        $scope.get_measured_data($scope.focus_mac);
        // $http.post('/get_TOOLS_MEASURED', {
        //     MAC_NBR: $scope.macList[0].MAC_NBR,
        //     PART_NO: $scope.Pro.Product_Model,
        //     ADDR: $scope.Pro.QPLC
        // }).success(function(result) {
        //     if (result.Status == 0) {
        //         $scope.measured_data.data = [];
        //         $scope.cut_data.data = [];
        //         for (var i = 0; i < result.Data.length; i++) {
        //             $scope.measured_data.data.push(result.Data[i].SURVEY_VAL);
        //             $scope.cut_data.data.push(result.Data[i].OFFSET_VAL);
        //         }
        //         var max_red = $scope.Pro.Dime_Nsion + $scope.Pro.Up_Offset;
        //         var min_red = $scope.Pro.Dime_Nsion - $scope.Pro.Down_Offset;
        //         F_Xchart_M($scope.categories, $scope.measured_data, get_plotLines(max_red, min_red, $scope.Pro.CPK), max_red, min_red);
        //         F_Xchart_O($scope.categories, $scope.cut_data);
        //         //测量表格
        //         $scope.measured_table = result.Data;
        //     }
        // });
    }

    $scope.get_measured_data = function(index) {
        $http.post('/get_TOOLS_MEASURED', {
            MAC_NBR: $scope.macList[index].MAC_NBR,
            PART_NO: $scope.Pro.Product_Model,
            ADDR: $scope.Pro.QPLC
        }).success(function(result) {
            if (result.Status == 0) {
                $scope.measured_data.data = [];
                $scope.cut_data.data = [];
                for (var i = 0; i < result.Data.length; i++) {
                    $scope.measured_data.data.push(result.Data[i].SURVEY_VAL);
                    $scope.cut_data.data.push(result.Data[i].OFFSET_VAL);
                }
                var max_red = $scope.Pro.Dime_Nsion + $scope.Pro.Up_Offset;
                var min_red = $scope.Pro.Dime_Nsion - $scope.Pro.Down_Offset;
                F_Xchart_M($scope.categories, $scope.measured_data, get_plotLines(max_red, min_red, $scope.Pro.CPK), max_red, min_red);
                F_Xchart_O($scope.categories, $scope.cut_data);
                //测量表格
                $scope.measured_table = result.Data;
            }
        });
    }

    //改变机床
    $scope.change_mac = function(index) {
        $scope.focus_mac = index;
        $scope.get_measured_data($scope.focus_mac);
    }

})
var List_div = [],
    ny = 0;
var rotYINT;

function startYRotate() {
    ny = ny + 1;
    for (var i = 0; i < List_div.length; i++) {
        List_div[i].style.transform = "rotateY(" + ny + "deg)";
        List_div[i].style.webkitTransform = "rotateY(" + ny + "deg)";
        List_div[i].style.OTransform = "rotateY(" + ny + "deg)";
        List_div[i].style.MozTransform = "rotateY(" + ny + "deg)";

    }

    if (ny >= 360) {
        clearInterval(rotYINT);

        if (ny >= 360) { ny = 0 };
    }
}

function rotateDIV(mac_list) {
    for (var i = 0; i < mac_list.length; i++) {
        List_div.push(document.getElementById(mac_list[i].MAC_NAME));
    }
    clearInterval(rotYINT);
    rotYINT = setInterval("startYRotate()", 5);
}

app.filter('Tr', function() {
    return function(input) {
        if (input == 0) {
            return 'L';
        } else {
            return 'R';
        }
    }
})

//绘制测量图
function F_Xchart_M(categories, measured_data, plotLines) {
    Xchart_M('#measured_chart', categories, measured_data, plotLines);

}

//绘制刀补图
function F_Xchart_O(categories, cut_data) {
    Xchart_O('#cut_chart', categories, cut_data);
}


function get_plotLines(max_red, min_red, cpk) {

    var maxRed = {
        color: 'red',
        dashStyle: 'dash',
        value: max_red,
        width: 2,
        label: {
            text: '1',
            align: 'left',
            x: -20,
            style: {
                color: 'red'
            }
        }
    };
    var maxYellow = {
        color: 'yellow',
        dashStyle: 'dash',
        value: ((max_red - min_red) / (cpk * 6)) * 3 + (max_red + min_red) / 2,
        width: 2,
        label: {
            text: '1',
            align: 'left',
            x: -20,
            style: {
                color: 'red'
            }
        }
    };
    var minYellow = {
        color: 'yellow',
        dashStyle: 'dash',
        value: (max_red + min_red) / 2 - (((max_red - min_red) / cpk * 6) * 3),
        width: 2,
        label: {
            text: '1',
            align: 'left',
            x: -20,
            style: {
                color: 'red'
            }
        }
    };
    var plotLines = [maxYellow, minYellow];
    return plotLines;
}