var app = angular.module('layout', []);
app.controller('layoutctrl', ['$scope', '$http', function ($scope, $http) {
        App.init();
        $scope.toggleSideMenu=function(e) {
            if ($("body").hasClass("page-sidebar-closed")) {
                $.cookie("SIDEBAR", "", 1);//显示
            }
            else {
                $.cookie("SIDEBAR", "", 0);//隐藏
            }
        }
    }])
