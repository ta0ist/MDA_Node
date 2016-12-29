angular.module('login', [])
    .controller('loginctrl', ['$scope', '$http', function($scope, $http) {
        $scope.User = {
            Name: '',
            Pwd: ''
        }
        $scope.error;

        document.onkeydown = function(e) {
            var ev = document.all ? window.event : e;
            if (ev.keyCode == 13) {
                $("input").blur();
                $("#BtLogin").trigger("click");
            }
        }

        $scope.login = function() {
            if ($scope.User.Name == '' || $scope.User.Pwd == '') {
                $scope.error = '用户名或密码不能为空！';
                return;
            } else {
                $http.post('/checkuser', JSON.stringify($scope.User)).success(function(data) {
                    if (data.Status == 0) {
                        location.href = '/';
                    } else {
                        $scope.error = data.Message;
                    }
                })
            }
        }
    }])