app.directive('commonPlus', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        /*template : '<div ng-transclude></div>',*/
        templateUrl: '../../Common/web/view/main/PlusTools.html',
        controller: function() {
            var expanders = [];
            /*            this.gotOpened = function (selectedExpander) {
             angular.forEach(expanders, function (expander) {
             if (selectedExpander != expander) {
             expander.showMe = false;
             }
             });
             };*/
            /*this.addExpander = function (expander) {
             expanders.push(expander);
             };*/

        },
        link: function(scope, element, attrs) {
            scope.isActive = true;
            scope.togglePlus = function() {
                scope.isActive = !scope.isActive;
            }
        }
    }
});

app.directive('expander', ["$http", function($http) {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        require: '^?commonPlus',
        /*scope: {
         title: '=expanderTitle'
         },*/
        //template : '<div>'
        //+ '<div class="title" ng-click="toggle()">{{title}}</div>'
        //+ '<div class="body" ng-show="showMe" ng-transclude></div>'
        //+ '</div>',
        //template: '',
        templateUrl: '../../Common/web/view/main/PlusDetail.html',
        link: function(scope, element, attrs, accordionController) {
            /*scope.showMe = false;
             accordionController.addExpander(scope);
             scope.toggle = function toggle() {
             scope.showMe = !scope.showMe;
             accordionController.gotOpened(scope);
             }*/
            //scope.isSelect = false;
            scope.togglePlus = function() {
                console.log(this.expander.title);
                //scope.isSelect = !scope.isSelect;
                this.expander.isSelect = !this.expander.isSelect;
                //加载对应的控件
                if (this.expander.isSelect) { //新增
                    var data = [];
                    if (this.expander.style == "status") {
                        data.push({
                            NAME: "stop",
                            RANK_NUM: 0,
                            SOURCE_TYPE: "MachineParameters.MachineStatus1",
                            WIDTH: 3
                        }, {
                            NAME: "run",
                            RANK_NUM: 0,
                            SOURCE_TYPE: "MachineParameters.MachineStatus2",
                            WIDTH: 3
                        }, {
                            NAME: "free",
                            RANK_NUM: 0,
                            SOURCE_TYPE: "MachineParameters.MachineStatus3",
                            WIDTH: 3
                        }, {
                            NAME: "shurtdown",
                            RANK_NUM: 0,
                            SOURCE_TYPE: "MachineParameters.MachineStatus4",
                            WIDTH: 3
                        }, {
                            NAME: "debug",
                            RANK_NUM: 0,
                            SOURCE_TYPE: "MachineParameters.MachineStatus5",
                            WIDTH: 3
                        });
                    } else {
                        data.push({
                            NAME: this.expander.name,
                            RANK_NUM: this.expander.rank,
                            SOURCE_TYPE: this.expander.type,
                            WIDTH: this.expander.width
                        });
                    }

                    $http.post("/Main/AddWidget", JSON.stringify(data))
                        .success(function(data, status, headers, config) {
                            location.href = location.href;
                        });
                } else { //删除
                    var data = [];
                    if (this.expander.style == "status") {
                        data.push("MachineParameters.MachineStatus1");
                        data.push("MachineParameters.MachineStatus2");
                        data.push("MachineParameters.MachineStatus3");
                        data.push("MachineParameters.MachineStatus4");
                        data.push("MachineParameters.MachineStatus5");
                    } else {
                        data.push(this.expander.type);
                    }
                    $http.post("/Main/DeleteWidget", JSON.stringify(data))
                        .success(function(data, status, headers, config) {
                            location.href = location.href;
                        });
                }
            };
        }
    }
}]);

app.directive('plusArea', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        require: '^?commonPlus',
        template: '<div>12312312</div>',
        link: function(scope, element, attrs, commonPlusController) {

        }
    }
});
app.controller("commonPlusController", function($scope, $http) {
    $scope.expanders = [{
            title: lang.EmployeePerformance.State,
            style: "status",
            icon: "icon-pause",
            type: "MachineParameters.MachineStatus1",
            name: "stop",
            width: 3,
            rank: 0,
            isSelect: false
        },
        {
            title: lang.Efficiencystatistics.RateOGrainOrMove,
            type: "Activation",
            icon: "icon-bar-chart",
            type: "MachineStatus.MachineActivationPlus",
            name: "Activation",
            width: 6,
            rank: 2,
            isSelect: false
        }, {
            title: lang.Common.Share,
            type: "Rate",
            icon: "icon-bar-chart",
            type: "MachineStatus.MachineStatusRatePlus",
            name: "Rate",
            width: 6,
            rank: 3,
            isSelect: false
        }, {
            title: lang.Common.ShortcutMenu,
            type: 'Menu',
            icon: "icon-align-justify",
            type: "Common.ShortcutMenu",
            name: "Menu",
            width: 12,
            rank: 1,
            isSelect: false
        }
    ];

    $scope.showActive = false;
    $scope.showRate = false;

    $scope.ShortcutMenu = false;
    $http.get("/Main/GetAllWidgetList").success(function(data, status, headers, config) {
        $scope.status = [];
        for (var i = 0; i < data.Data.length; i++) {
            for (var j = 0; j < $scope.expanders.length; j++) {
                if (data.Data[i].SOURCE_TYPE == $scope.expanders[j].type) {
                    if (data.Data[i].SOURCE_TYPE == "Common.ShortcutMenu") {
                        $scope.ShortcutMenu = true;
                        $scope.GetPersonalSettingList();
                    }
                    if (data.Data[i].SOURCE_TYPE == "MachineStatus.MachineActivationPlus") {
                        $scope.GetAllMachineGroupActivation();
                        $("#active_memo").myeditable({
                            title: '',
                            content: lang.Common.Content_1,
                            placement: "top"
                        });
                        $(".popover").hide();
                        $scope.showActive = true;
                    }
                    if (data.Data[i].SOURCE_TYPE == "MachineStatus.MachineStatusRatePlus") {
                        $scope.GetTodayAllMachineStatusPie();
                        $("#rate_memo").myeditable({
                            title: '',
                            content: lang.Common.Content_2,
                            placement: "left"
                        });
                        $(".popover").hide();
                        $scope.showRate = true;
                    }

                    $scope.expanders[j].isSelect = true;
                }
            }
            if (data.Data[i].NAME == 'stop') {
                data.Data[i]['StatusID'] = 1;
                data.Data[i]['Icon'] = 'icon-pause';
                data.Data[i]['name'] = lang.Common.Downtime;
                data.Data[i]['color'] = "#000";
                data.Data[i]['MacCount'] = 0;
                $scope.status.push(data.Data[i]);
            } else if (data.Data[i].NAME == 'run') {
                data.Data[i]['StatusID'] = 2;
                data.Data[i]['Icon'] = 'icon-play';
                data.Data[i]['name'] = lang.Common.Run;
                data.Data[i]['color'] = "#000";
                data.Data[i]['MacCount'] = 0;
                $scope.status.push(data.Data[i]);
            } else if (data.Data[i].NAME == 'free') {
                data.Data[i]['StatusID'] = 3;
                data.Data[i]['Icon'] = 'icon-circle-blank';
                data.Data[i]['name'] = lang.Common.Free;
                data.Data[i]['color'] = "#000";
                data.Data[i]['MacCount'] = 0;
                $scope.status.push(data.Data[i]);
            } else if (data.Data[i].NAME == 'shurtdown') {
                data.Data[i]['StatusID'] = 4;
                data.Data[i]['Icon'] = 'icon-stop';
                data.Data[i]['name'] = lang.Common.Shutdown;
                data.Data[i]['color'] = "#000";
                data.Data[i]['MacCount'] = 0;
                $scope.status.push(data.Data[i]);
            } else if (data.Data[i].NAME == 'debug') {
                data.Data[i]['StatusID'] = 5;
                data.Data[i]['Icon'] = 'icon-wrench';
                data.Data[i]['name'] = lang.Common.Debug;
                data.Data[i]['color'] = "#000";
                data.Data[i]['MacCount'] = 0;
                $scope.status.push(data.Data[i]);
            }

        }

        if ($scope.status.length > 0) {
            $scope.GetStatusColorAndCount();
        }


    });

    $scope.go = function(index) {
        if (!$scope.editEnabled) {
            $.cookie("MENU_ID", "", $scope.menus[index].ID);
            location.href = $scope.menus[index].URL.replace(/Controller/g, "");
        }
    }

    $scope.getActive = function() {
        $scope.GetAllMachineGroupActivation();
    }

    $scope.getRate = function() {
        $scope.GetTodayAllMachineStatusPie();
    }

    $scope.GetTodayAllMachineStatusPie = function() {
        $http.get('Main/GetTodayAllMachineStatusPie')
            .success(function(data) {
                var status = {}; //统计所有的状态
                var categories = [];
                for (var i = 0; i < data.Data.length; i++) {
                    //var typeTitle = moment().format("YYYY/MM/DD");
                    categories.push(data.Data[i].NAME + "(" + data.Data[i].SHIFTNAME + ")"); //(横坐标为设备)
                    for (var j = 0; j < data.Data[i].STATUSRATE.length; j++) {
                        status[data.Data[i].STATUSRATE[j].STATUS_NAME] = data.Data[i].STATUSRATE[j].STATUS_NAME;
                    }
                }
                var ydata = [];
                for (var item in status) {
                    var tjson = {};
                    tjson.name = item;
                    tjson.data = [];
                    tjson.time = [];
                    for (var n = 0; n < data.Data.length; n++) {
                        for (var k = 0; k < data.Data[n].STATUSRATE.length; k++) {
                            if (data.Data[n].STATUSRATE[k].STATUS_NAME == item) {

                                tjson.data.push(data.Data[n].STATUSRATE[k].RATE);
                                tjson.color = "#" + data.Data[n].STATUSRATE[k].COLOR.Name;
                                tjson.time.push(data.Data[n].STATUSRATE[k].TIME);
                                break;
                            }
                            if (k == data.Data[n].STATUSRATE.length - 1) { //没有状态
                                tjson.data.push(null);
                            }
                        }
                    }
                    tjson.stack = 1;
                    ydata.push(tjson);
                }
                var par = {
                    type: "column",
                    xdata: categories,
                    ydata: ydata,
                    stacking: true,
                    subtitle: ""
                }
                try {
                    $("#chart_statusRate").data("BZ-hisChart").destroy();
                } catch (e) {}
                $scope.drawChart("#chart_statusRate", par);
            })
    }
    $scope.GetAllMachineGroupActivation = function() {
        $http.get('Main/GetAllMachineGroupActivation')
            .success(function(data) {
                var categories = [];
                var dataSource = [],
                    shift = [];
                for (var m in data.Data) {
                    //var typeTitle = moment().format("YYYY/MM/DD");
                    categories.push(data.Data[m].Name); //(横坐标为设备)
                    for (var y = 0; y < data.Data[m].Data.length; y++) {
                        for (var k = 0; k < data.Data[m].Data[y].SHIFTS.length; k++) {
                            shift.push(data.Data[m].Data[y].SHIFTS[k].NAME);

                        }
                    }

                }

                for (var i = 0, o = {}, tmp = [], count = 0, l = shift.length; i < l; i++) {
                    if (o[shift[i]]) {
                        count++;
                    } else {
                        o[shift[i]] = 1;
                        tmp.push(shift[i])
                    }
                }
                var ydata = [];
                for (var i = 0; i < tmp.length; i++) {
                    var tjson = {};
                    tjson.name = tmp[i];
                    tjson.data = [];
                    for (var j = 0; j < data.Data.length; j++) {
                        for (var k = 0; k < data.Data[j].Data[0].SHIFTS.length; k++) {
                            if (tmp[i] == data.Data[j].Data[0].SHIFTS[k].NAME) {
                                tjson.data.push(data.Data[j].Data[0].SHIFTS[k].VALUE);
                                break;
                            }
                            if (k == data.Data[j].Data[0].SHIFTS.length - 1) {
                                tjson.data.push(null);
                            }
                        }

                    }
                    ydata.push(tjson)
                }

                var par = {
                    type: "column",
                    xdata: categories,
                    ydata: ydata
                }

                //drawHisChart(par);
                try {
                    $("#chart_active").data("BZ-hisChart").destroy();
                } catch (e) {}
                $scope.drawChart("#chart_active", par);
            })
    }
    $scope.drawChart = function(ele, data) {
        $(ele).hisChart({
            type: "column",
            title: "22",
            titlebool: false,
            height: 300,
            subtitle: "",
            subtitlebool: false,
            margin: [10, 10, 40, 40],
            legend: {
                y: 10
            },
            categories: data.xdata == undefined ? [] : data.xdata,
            dataSource: data.ydata == undefined ? [] : data.ydata,
            stacking: data.stacking == true ? "normal" : null
        }).data("BZ-hisChart");
    }

    $scope.GetStatusColorAndCount = function() {
        $http.get('Main/GetStatusColorAndCount')
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

    //获取快捷菜单
    $scope.GetPersonalSettingList = function() {
        $http.get('Main/GetPersonalSettingList')
            .success(function(data) {
                if (data.Status == 0) {
                    $scope.menus = [];
                    var style = {
                        "0": "",
                        "1": "double",
                        "2": "double-down"
                    }
                    $scope.menus = [];
                    for (var i = 0; i < data.Data.length; i++) {
                        var ds = JSON.parse(data.Data[i].DATA);

                        var tjson = {
                            ID: data.Data[i].ID,
                            MENU: ds.MENU,
                            URL: ds.URL,
                            ICON: ds.ICON,
                            BG_COLOR: ds.COLOR,
                            bgblue: ds.COLOR == "bg-blue" ? 1 : 0,
                            bggreen: ds.COLOR == "bg-green" ? 1 : 0,
                            bgred: ds.COLOR == "bg-red" ? 1 : 0,
                            bgpurple: ds.COLOR == "bg-purple" ? 1 : 0,
                            bgyellow: ds.COLOR == "bg-yellow" ? 1 : 0,
                            bggrey: ds.COLOR == "bg-grey" ? 1 : 0,
                            double: ds.STYLE == "1" ? 1 : 0,
                            doubledown: ds.STYLE == "2" ? 1 : 0
                        }
                        $scope.menus.push(tjson);
                    }
                } else {
                    BzAlert(data.Message);
                }
            })
    }

    $scope.editEnabled = false;
    $scope.editMenu = function(e) {
        $scope.editEnabled = true;
    };
    $scope.returnMenu = function(e) {
        $scope.editEnabled = false;
    };
    $scope.addMenu = function() {
        $.x5window('新增', kendo.template($("#popup-add").html()));
        //获取所有的菜单
        $("#MENU").comboxTree({
            url: "/Main/GetMenuInfo",
            treetemplate: $("#treeview-template").html(),
            type: 5,
            width: 176,
            diffwidth: 36,
            keyup: false
        });
        $("#MENU_TYPE").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [
                { text: lang.Common.Style_1, value: 0 },
                { text: lang.Common.Style_2, value: 1 }, //double
                { text: lang.Common.Style_3, value: 2 } //double-down
            ],
            value: "DEFAULT"
        }).data("kendoComboBox").value(0);
        $(".menustyle li").bind("click", function() {
            $(".menustyle .selected").removeClass("selected");
            $(this).addClass("selected");
        })
        $("#Win_Submit").bind("click", function() {
            var obj = $("#MENU").data("BZ-comboxTree");
            var data = {
                MENU: obj.name,
                STYLE: $("#MENU_TYPE").data("kendoComboBox").value(),
                COLOR: $(".menustyle .selected").attr("bgcolor"),
                URL: obj.url,
                ID: obj.rData,
                ICON: obj.icon
            }
            $.post("/Main/AddPersonalSetting", data, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    $scope.GetPersonalSettingList();
                    BzSuccess(data.Message);
                } else if (data.Status == 1) { //已经添加过的快捷菜单
                    $("#x5window").data("kendoWindow").close();
                } else {
                    BzAlert(data.Message);
                }
            });
        });
    };
    $scope.del = function(index) {
        // event.stopPropagation();
        var data = {
            personalid: $scope.menus[index].ID
        }
        $.post("/Main/DeletePersonalSetting", data, function(data) {
            if (data.Status == 0) {
                $scope.menus.splice(index, 1);
                $scope.$apply();
            } else {
                BzAlert(data.Message);
            }
        });
    };

});