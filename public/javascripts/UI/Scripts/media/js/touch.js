/**
 * Created by nxc on 2016/7/26.
 */
document.onselectstart = function() {
    return false;
};
var app = angular.module('myApp', ['ng', 'ngRoute']);
app.config(function($routeProvider){
        $routeProvider.when('/stop',{templateUrl:'tpl/stop.html'})
            .when('/updown',{templateUrl:'tpl/updown.html',controller:"updownCtrl"})
            .otherwise({redirectTo:'/stop'})
})
app.controller("parentCtrl",function($scope,$location){
    $scope.jump=function(url){
        $location.path(url);
    }
})
app.controller("updownCtrl",function($scope){
    $("#ul1 li a").click(function(e){
        e.preventDefault();
        $(this).parent().addClass('active').siblings().removeClass('active');
        var id_1=$(this).attr('href');
            $(id_1).css('display','block').siblings().css('display','none');
    })
})
$("nav li").click(function(){
    $(this).addClass('active_0001');
    $(this).siblings().removeClass('active_0001')
})
