//angular.module('bz.maintain.app', ['ui.bootstrap'])
app.controller('maintainCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.data = {
            pageMode: null,
            PageIndex: 1,
            PageSize: 5
        }
        //$scope.totalItems = 100;
        //$scope.currentPage = 4;

    //$scope.setPage = function (pageNo) {
    //    $scope.currentPage = pageNo;
    //};
    //$scope.firstText = "第一页";
    //$scope.lastText = "最后一页";
    //$scope.previousText = "上一页";
    //$scope.nextText = "下一页";
    $scope.itemsPerPage = $scope.data.PageSize; //每页显示条数
    $scope.pageChanged = function() {
        //console.log('Page changed to: ' + $scope.bigCurrentPage);
        $scope.data.PageIndex = $scope.bigCurrentPage;
        $scope.GetJiliMaintencePlanList();
    };

    $scope.maxSize = 5; //最大显示页数

    //$scope.bigTotalItems = 200; //所有数据条数
    //$scope.bigCurrentPage = 1;  //当前页码
    $scope.updateData = function() {
        $scope.GetJiliMaintencePlanList();
    }
    $scope.GetJiliMaintencePlanList = function() {
        $http.post('/MaintenancePlan/GetJiliMaintencePlanList', angular.toJson($scope.data)).success(function(data, status, headers, config) {
            if (data.Status == 0) {
                //页码
                $scope.bigTotalItems = data.Data.PageInfo.TotalCount;
                $scope.bigCurrentPage = data.Data.PageInfo.PageIndex;
                var items = [];
                for (var i = 0; i < data.Data.Items.length; i++) {
                    var tjson = {};
                    tjson.MAC_NBR = data.Data.Items[i].Mac_Nbr;
                    tjson.MAC_NO = data.Data.Items[i].Mac_No;
                    tjson.MAC_NAME = data.Data.Items[i].Mac_Name;
                    var dd = [];
                    for (var j = 0; j < data.Data.Items[i].GetSubPlanList.length; j++) {
                        var tt = {};
                        tt.TYPE = data.Data.Items[i].GetSubPlanList[j].Cycle;
                        tt.LAST_DATE = moment(data.Data.Items[i].GetSubPlanList[j].LastCheckDate).format("YYYY/MM");
                        tt.LAST_DATE1 = data.Data.Items[i].GetSubPlanList[j].LastCheckDate;
                        dd.push(tt);
                    }
                    tjson.DATA = dd;
                    items.push(tjson);

                }
                for (var i = 0; i < items.length; i++) {
                    for (var j = 0; j < items[i].DATA.length; j++) {
                        items[i].DATA[j]["MONTHS"] = [];
                        for (k = 1; k <= 12; k++) {
                            var tjson = {
                                //MONTH: 0,
                                SHOW: false,
                                SRC: ""
                            }
                            items[i].DATA[j]["MONTHS"].push(tjson);
                        }
                        var month = moment(items[i].DATA[j].LAST_DATE1).month() + 1;
                        switch (items[i].DATA[j].TYPE) {
                            case 1: //一月检
                                while (month <= 12) {
                                    //items[i].DATA[j]["MONTHS"][month - 1].MONTH = 1;
                                    items[i].DATA[j]["MONTHS"][month - 1].SHOW = true;
                                    items[i].DATA[j]["MONTHS"][month - 1].SRC = "./Maintain/web/images/rect.png";
                                    month = month + 1;
                                }
                                break;
                            case 2: //季检
                                while (month <= 12) {
                                    //items[i].DATA[j]["MONTHS"][month - 1].MONTH = 1;
                                    items[i].DATA[j]["MONTHS"][month - 1].SHOW = true;
                                    items[i].DATA[j]["MONTHS"][month - 1].SRC = "./Maintain/web/images/diamond.png";
                                    month = month + 3;
                                }
                                break;
                            case 3: //半年检
                                while (month <= 12) {
                                    //items[i].DATA[j]["MONTHS"][month - 1].MONTH = 1;
                                    items[i].DATA[j]["MONTHS"][month - 1].SHOW = true;
                                    items[i].DATA[j]["MONTHS"][month - 1].SRC = "./Maintain/web/images/Star.png";
                                    month = month + 6;
                                }
                                break;
                            case 4: //年检
                                while (month <= 12) {
                                    //items[i].DATA[j]["MONTHS"][month - 1].MONTH = 1;
                                    items[i].DATA[j]["MONTHS"][month - 1].SHOW = true;
                                    items[i].DATA[j]["MONTHS"][month - 1].SRC = "./Maintain/web/images/Triangle.png";
                                    month = month + 12;
                                }
                                break;
                        }
                    }
                    $scope.items = items;
                }
                //BzSuccess(data.Message);
            } else {
                BzAlert(data.Message);
            }
        });
    }

    $scope.GetJiliMaintencePlanList();

    $scope.monthSelectorOptions = {
        start: "year",
        depth: "year"
    };
    $scope.CycleType = {
        1: "一月检",
        2: "季检",
        3: "半年检",
        4: "年检"
    }
    $scope.selectChange = function(index) {
        console.log(index)
    }
    $scope.dateChange = function(index) {
        console.log(index)
    }
}])