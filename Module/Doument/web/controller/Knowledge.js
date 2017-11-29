app.controller('myCtrl', function($scope, $http) {
    $scope.flag = true;
    $scope.filter = "";
    //获取热度标签
    $http.post("/Document/GetTopTag", { topcout: 12 }).success(function(data) {
        $scope.pagesData = data.Data;
    });

    $scope.search = function() {
        //$scope.flag = !$scope.flag;
        $scope.filter = $scope.searchFilter;
        $scope.getTagData($scope.searchFilter);
    };
    //通过标签查询
    $scope.searchByTag = function(obj) {
        $scope.flag = !$scope.flag;
        $scope.filter = obj.NAME;
        $scope.getTagData(obj.NAME);

    };

    $scope.getTagData = function(filter) {
        if (filter == "" || filter == undefined) {
            $scope.flag = !$scope.flag;
            return false;
        }
        var filter = {
            filter: {
                filters: [
                    { field: "NAME", Operator: "contains", value: filter }
                ],
                logic: "and"
            },
            page: 1,
            pagesize: 9999

        };
        $http.post("/Document/GetWebLookupTag", JSON.stringify({ pagermodel: filter })).success(function(data) {
            $scope.pagesData2 = data.Data.List;
        });
    };
})

app.filter('aa', function() {
    return function(text) {
        var url = "/Document/download?file=" + text.ID + '.' + text.TILTE.split('.').splice(-1)[0] + "&name=" + text.TILTE;
        return url;
    }
})

// function getLabel() {
//     $.post('/Document/GetTopTag', { topcout: 12 }, function(data) {
//         console.log(data)
//     })
// }

// getLabel()
// var knowledge = angular.module("myApp", ['ngRoute', 'myApp.SearchController'])
//     .config(['$routeProvider', function($routeProvider) {
//         $routeProvider.when('/search', {
//             templateUrl: './Doument/web/tpls/Search.html',
//             controller: 'searchCtrl'
//         });
//         $routeProvider.when('/detail', {
//             templateUrl: './Doument/web/tpls/Detail.html',
//             controller: 'detailCtrl'
//         });
//         $routeProvider.otherwise({ redirectTo: '/search' });
//     }]);

// var myApp = angular.module('myApp.SearchController', []);
// myApp.factory('Data', ['$http', function($http) {
//     return {
//         filter: ""
//     }
// }]);
// myApp.controller('searchCtrl', ['$scope', '$http', '$location', 'Data', function($scope, $http, $location, Data) {
//     $scope.filter = Data.filter;
//     //获取热度标签
//     $http.get("/Document/DocumentManage/GetTopTag", { params: { topcout: 12 } }).success(function(data, status, headers, config) {
//         $scope.pagesData = data.Data;
//     });
//     $scope.searchEnter = function(e) {
//         if (e.keyCode == 13) {
//             $scope.search();
//         }
//     };
//     $scope.search = function() {
//         Data.filter = $scope.filter;
//         $location.path('/detail');
//     };
//     //通过标签查询
//     $scope.searchByTag = function(obj) {
//         Data.filter = obj.NAME;
//         $location.path('/detail');

//     };
// }]);



// myApp.controller('detailCtrl', ['$scope', '$http', '$location', 'Data', function($scope, $http, $location, Data) {
//     $scope.filter = Data.filter;
//     $scope.search = function() {
//         if ($scope.filter == "") {
//             Data.filter = "";
//             $location.path('/search');
//         } else {
//             $scope.getTagData($scope.filter);
//         }
//     };
//     $scope.searchEnter = function(e) {
//         if (e.keyCode == 13) {
//             $scope.search();
//         }
//     };
//     $scope.getTagData = function(filter) {
//         if (filter == "") {
//             return;
//         }
//         var filter = {
//             filter: {
//                 filters: [
//                     { field: "NAME", Operator: "contains", value: filter }
//                 ],
//                 logic: "and"
//             },
//             page: null,
//             pagesize: null

//         };
//         $http.post("/Document/DocumentManage/GetWebLookupTag", JSON.stringify(filter)).success(function(data, status, headers, config) {
//             $scope.pagesData = data.Data.List;
//         });
//     };
//     $scope.getTagData($scope.filter);
// }]);