angular.module('login', [])
    .controller('loginctrl', ['$scope', '$http', function($scope, $http) {
        $scope.User = {
            Name: '',
            Pwd: '',
            storage: ''
        }
        $scope.error;

        if ($.cookie('name') && $.cookie('name') != "null") {
            $('#chkremember').attr('checked', true);
            $scope.User.Name = $.cookie('name');
            $scope.User.Pwd = $.cookie('password');
        }
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
                if ($('#chkremember').attr("checked")) {
                    $.cookie('name', $scope.User.Name, { expires: 7, path: '/' });
                    $.cookie('password', $scope.User.Pwd, { expires: 7, path: '/' });
                } else {
                    $.cookie('name', null);
                    $.cookie('password', null);
                }
                $scope.User.storage = localStorage.UserInfo ? localStorage.UserInfo : '{}';
                $http.post('/checkuser', JSON.stringify($scope.User)).success(function(data) {
                    if (data.Status == 0) {
                        window.localStorage.setItem('UserInfo', JSON.stringify(data.Data));
                        location.href = '/';
                    } else {
                        $scope.error = data.Message;
                    }
                })
            }
        }
    }])