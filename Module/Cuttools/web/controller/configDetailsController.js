var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $location, $http) {
    $http.post('/configDetails/r/getdata', { id: $location.search().id }).success(function(data) {
        $scope.head = data.Data
    })
    getToolsData();

    /*******获取到的详情数据******/
    function getToolsData() {
        $.post('/configDetails/r/getToolsData', { id: $location.search().id }).success(function(data) {
            if (data.Status == 0) {
                console.log(data)
                $scope.list = data.Data
                $scope.$apply();
            }

        })
    }

    /********点击行变色*********/
    $scope.row = function(index) {
            $scope.rowColor = index;
        }
        /********点击新增方法*********/
    $scope.addModalDisplay = false;
    $scope.add = function() {
        $scope.Tool = "";
        $scope.Tool_No = "";
        $scope.Cutting_Content = "";
        $scope.Turret = "";
        $scope.Dime_Nsion = "";
        $scope.Up_Offset = "";
        $scope.Down_Offset = "";
        $scope.CPK = "";
        $scope.Macro_Address = "";
        $scope.Remark = "";
        $scope.QPLC = "";
        $scope.OFFSET_AXIS = "";
        $scope.OFFSET_TYPE = "";
        $scope.addModalDisplay = true;
    }
    $scope.addColse = function() {
        $scope.addModalDisplay = false;
    }
    $scope.addData = function() {
            var data = {
                X_nbr: $location.search().id,
                Tool: $scope.Tool,
                Tool_No: $scope.Tool_No,
                Cutting_Content: $scope.Cutting_Content,
                Turret: $scope.Turret,
                Dime_Nsion: $scope.Dime_Nsion,
                Up_Offset: $scope.Up_Offset,
                Down_Offset: $scope.Down_Offset,
                CPK: $scope.CPK,
                Macro_Address: $scope.Macro_Address,
                Remark: $scope.Remark,
                QPLC: $scope.QPLC,
                OFFSET_AXIS: $scope.OFFSET_AXIS,
                OFFSET_TYPE: $scope.OFFSET_TYPE
            }

            $http.post('/configDetails/r/addData', data).success(function(data) {
                if (data.Status == 0) {
                    getToolsData();
                    $scope.addModalDisplay = false;

                }
            })

        }
        /********编辑*******/
    $scope.EditModalDisplay = false;
    $scope.edit = function(o) {
        console.log(o)
        $scope.Edit_Tool = o.Tool;
        $scope.Edit_Tool_No = o.Tool_No;
        $scope.Edit_Cutting_Content = o.Cutting_Content;
        $scope.Edit_Turret = o.Turret == false ? "L" : "R";
        $scope.Edit_Dime_Nsion = o.Dime_Nsion;
        $scope.Edit_Up_Offset = o.Up_Offset;
        $scope.Edit_Down_Offset = o.Down_Offset;
        $scope.Edit_CPK = o.CPK;
        $scope.Edit_Macro_Address = o.Macro_Address;
        $scope.Edit_Remark = o.Remark;
        $scope.Edit_QPLC = o.QPLC;
        $scope.Edit_OFFSET_AXIS = o.OFFSET_AXIS;
        $scope.Edit_OFFSET_TYPE = o.OFFSET_TYPE
        $scope.EditModalDisplay = true;

    }
    $scope.EditColse = function() {
        $scope.EditModalDisplay = false;
    }
    $scope.EditData = function() {
        var data = {
            X_nbr: $location.search().id,
            Tool: $scope.Edit_Tool,
            Tool_No: $scope.Edit_Tool_No,
            Cutting_Content: $scope.Edit_Cutting_Content,
            Turret: $scope.Edit_Turret,
            Dime_Nsion: $scope.Edit_Dime_Nsion,
            Up_Offset: $scope.Edit_Up_Offset,
            Down_Offset: $scope.Edit_Down_Offset,
            CPK: $scope.Edit_CPK,
            Macro_Address: $scope.Edit_Macro_Address,
            Remark: $scope.Edit_Remark,
            QPLC: $scope.Edit_QPLC,
            OFFSET_AXIS: $scope.Edit_OFFSET_AXIS,
            OFFSET_TYPE: $scope.Edit_OFFSET_TYPE
        }
        $http.post('/configDetails/r/edit', data).success(function(data) {
            if (data.Status == 0) {
                getToolsData();
                $scope.EditModalDisplay = false;

            }
        })
    }

    /************删除***************/
    $scope.deleteStatus = false;
    $scope.deleteTool = function(o) {
        $scope.deleteQPLC = o.QPLC
        $scope.deleteStatus = true;
    }
    $scope.deleteColse = function() {
        $scope.deleteStatus = false;
    }
    $scope.delete = function() {
        console.log($scope.deleteQPLC)
        var data = {
            QPLC: $scope.deleteQPLC
        }
        $http.post('/configDetails/r/delete', data).success(function(data) {
            if (data.Status == 0) {
                getToolsData();
                $scope.deleteStatus = false;
            }
        })
    }



})

/****动态创建新增框 ****/
app.directive('addModal', function() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: './Cuttools/web/view/toolConfig/addModel.html',
            link: function(scope, element, arrts) {
                var head = angular.element(document.getElementsByClassName('modal-header'));
                var box = angular.element(document.getElementsByClassName('modal-content'));
                head.css({ cursor: 'move' })
                head.on('mousedown', function(e) {
                    var x = e.clientX - box[0].offsetLeft;
                    var y = e.clientY - box[0].offsetTop;
                    head.on('mousemove', function(e) {
                        box.css({
                            left: e.clientX - x,
                            top: e.clientY - y
                        })
                    })
                    head.on('mouseup', function() {
                        head.unbind('mousemove');
                    })
                })

            }
        }
    })
    /*******动态创建编辑框*******/
app.directive('editModal', function() {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: './Cuttools/web/view/toolConfig/EditModel.html',
            link: function(scope, element, arrts) {
                var head = angular.element(document.getElementsByClassName('modal-header'));
                var box = angular.element(document.getElementsByClassName('modal-content'));
                head.css({ cursor: 'move' })
                head.on('mousedown', function(e) {
                    var x = e.clientX - box[0].offsetLeft;
                    var y = e.clientY - box[0].offsetTop;
                    head.on('mousemove', function(e) {
                        box.css({
                            left: e.clientX - x,
                            top: e.clientY - y
                        })
                    })
                    head.on('mouseup', function() {
                        head.unbind('mousemove');
                    })
                })

            }
        }
    })
    /*****动态创建删除框*****/
app.directive('deleteModal', function() {
        return {
            restrict: 'EA',
            replace: true,
            template: '<div class="deleteModal" ng-show="deleteStatus">' +
                '<h3>你确定要删除吗？</h3>' +
                '<div>' +
                '<div class="delete_btn pull-right">' +
                '<button class="btn btn-primary" ng-click="delete()">确定</button>' +
                '<button class="btn btn-default" ng-click="deleteColse()">取消</button>' +
                '</div>' +
                '</div>' +
                '</div>',

            link: function(scope, element, arrts) {

            }
        }
    })
    /** 计算小黄公式***/
app.filter('MinSpec', function() {
        return function(data) {
            var max_temp = data.Dime_Nsion + data.Up_Offset;
            var min_temp = data.Dime_Nsion - data.Down_Offset;
            var before_temp = (max_temp + min_temp) / 2;
            var after_temp = ((max_temp - min_temp) / (data.CPK * 6)) * 3;
            var result = (before_temp - after_temp).toFixed(3);
            return result;
        }
    })
    /******计算小绿公式******/
app.filter('MinControl', function() {
        return function(data) {
            var max_temp = data.Dime_Nsion + data.Up_Offset;
            var min_temp = data.Dime_Nsion - data.Down_Offset;
            var before_temp = (max_temp + min_temp) / 2;
            var after_temp = ((max_temp - min_temp) / (data.CPK * 6)) * 1.5;
            var result = (before_temp - after_temp).toFixed(3);
            return result;
        }
    })
    /******计算小绿公式******/
app.filter('MaxControl', function() {
        return function(data) {
            var max_temp = data.Dime_Nsion + data.Up_Offset;
            var min_temp = data.Dime_Nsion - data.Down_Offset;
            var before_temp = ((max_temp - min_temp) / (data.CPK * 6)) * 1.5;
            var after_temp = (max_temp + min_temp) / 2;
            var result = (before_temp + after_temp).toFixed(3);
            return result;
        }
    })
    /******计算小绿公式******/
app.filter('MaxSpec', function() {
        return function(data) {
            var max_temp = data.Dime_Nsion + data.Up_Offset;
            var min_temp = data.Dime_Nsion - data.Down_Offset;
            var before_temp = ((max_temp - min_temp) / (data.CPK * 6)) * 3;
            var after_temp = (max_temp + min_temp) / 2;
            var result = (before_temp + after_temp).toFixed(3);
            return result;
        }
    })
    /*******定义L R******/
app.filter('Turret', function() {
    return function(data) {
        if (data == false) {
            return "L";
        } else {
            return "R";
        }
    }
})
app.config(function($locationProvider) {
    // $locationProvider.html5Mode(true);  
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});