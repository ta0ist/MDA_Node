var statusNbr = getUrlParam('status') || 1;
var mac = [];
var Status = {
    "1": "停机",
    "2": "运行",
    "3": "空闲",
    "4": "停机",
    "5": "调试",
}
var color = {
    "1": 'rgb(245, 40, 12)',
    "2": 'rgb(78, 207, 31)',
    "3": 'rgb(230, 210, 21)',
    "4": 'rgb(96, 103, 101)',
    "5": 'rgb(35, 43, 232)',
}

$.ajax({
    type: 'GET',
    async: false,
    url: '/diagnosis/r/mac',
    success: function(data) {
        mac = data.Data;
    }
})
app.controller('diagnosisctrl', function($scope, $http) {
    var type = $.getparam("type");
    var baseUrl = "/diagnosis/";
    var TIME;
    $scope.items = [];
    $scope.status = [];
    $scope.items_group = [];
    setInterval(() => ($http.post('/diagnosis/r/getallpara')), 5000);


    GetGrouplist(0, "machine/GetGrouplist", $("#treeview-template").html(), "icon-group", function(data) {
        var groupId = parseInt($(data).find('[attr="treenode"]').attr("nodeid"));
        $.post(baseUrl + "GetMachinesByGourpId", { groupId: groupId }, function(data) {
            if (data.Status == 0) {
                $scope.items = data.Data;
                if ($scope.items.length > 0) {
                    for (var i = 0; i < $scope.items.length; i++) {
                        $scope.items[i].color = "#CCCCCC";
                        $scope.items[i].photo = "/images/machine/NoDefault/" + $scope.items[i].PHOTO;
                        $scope.items[i].pars = [];
                    }
                }
                $scope.$apply();

                //获取即时参数
                if (TIME != undefined) {
                    //TIME.clear();
                    clearTimeout(TIME);
                }
                $scope.getRealData();
            }
        });
    });


    $scope.showDetail = function(index) {
        location.href = "/diagnosisdetail?no=" + $scope.items[index].MAC_NBR + "&type=" + $scope.items[index].CATEGORY;
    }
    $scope.getRealData = function() {
        var machineIds = [];
        for (var i = 0; i < $scope.items.length; i++) {
            machineIds.push($scope.items[i].MAC_NBR);
        }
        $.post("/diagnosis/r/GetGroupPara", ({ MacList: machineIds }), function(data) {
            for (var i = 0; i < $scope.items.length; i++) {
                $.each(data, function(a, b) {
                    if ($scope.items[i].MAC_NBR == +b[0].Mac_nbr) {
                        $scope.items[i].pars = [];
                        for (var k = 0; k < b[0].machineitems.length; k++) {
                            if (b[0].machineitems[k].Hot) {
                                var tjson;
                                if (b[0].machineitems[k].Name == "STD::Status") {
                                    tjson = {
                                        NAME: b[0].machineitems[k].Description,
                                        VALUE: b[0].machineitems[k].Value == 0 ? "-- -- " : b[0].machineitems[k].Value,
                                        UNIT: b[0].machineitems[k].UnitName
                                    }
                                    $scope.items[i].color = b[0].machineitems.Value == 0 ? "#CCCCCC" : color[b[0].machineitems[k].Value];
                                } else if (b[0].machineitems[k].Name == "STD::SubStatus") {
                                    tjson = {
                                        NAME: b[0].machineitems[k].Description,
                                        VALUE: b[0].machineitems[k].Value == 0 ? "-- -- " : data.Data.STATUS_DATA[b[0].machineitems[k].Value].NAME,
                                        UNIT: b[0].machineitems[k].UnitName
                                    }

                                } else if (b[0].machineitems[k].Name == "STD::StatusStartTime" || b[0].machineitems[k].Name == "DeviceDateTime") {
                                    tjson = {
                                        NAME: b[0].machineitems[k].Description,

                                        VALUE: moment(b[0].machineitems[k].Value).format('YYYY-MM-DD hh:ss:mm'),
                                        UNIT: b[0].machineitems[k].UnitName
                                    }
                                } else {
                                    tjson = {
                                        NAME: b[0].machineitems[k].Description,
                                        VALUE: b[0].machineitems[k].Value,
                                        UNIT: b[0].machineitems[k].UnitName
                                    }
                                }
                                $scope.items[i].pars.push(tjson);
                            }
                        }
                        $scope.$apply();
                    }
                })
            }
            TIME = setTimeout(function() {
                $scope.getRealData();
            }, 5000);
        });
    }

    $scope.GetStatusColorAndCount = function() {
        $http.get('Main/GetStatusColorAndCount')
            .success(function(data) {
                if (data.Status == 0) {
                    $scope.status = data.Data;
                } else {
                    BzAlert(data.Message);
                }
            })
    };


    $scope.GetStatusColorAndCount();


    $scope.flag = getUrlParam('status') || 1;
    $scope.refreshMac = function(n) {
        statusNbr = n
        $scope.flag = n;
        $http.post('/diagnosis/r/getAllMac').success(function(data) {
            if (data.Status == 0) {
                var arr = (function() {

                    var list = [];
                    data.Data.forEach(function(v, i) {
                        v.machineitems.forEach(function(j, k) {
                            if (j.Name == "STD::Status" && j.Value == n) {
                                list.push(v);
                            }
                        })
                    })

                    list.forEach(function(v, i) {
                        v.items = [];
                        mac.forEach(function(j, k) {
                            if (v.Mac_nbr == j.MAC_NBR) {
                                v.MAC_NAME = j.MAC_NAME;
                                v.MAC_NO = j.MAC_NO;
                                v.PHOTO = "/images/machine/NoDefault/" + j.PHOTO;
                                v.color = color[n];
                            }
                        })

                        v.machineitems.forEach(function(o, p) {

                            var obj = {}
                            if (o.Name == "STD::Status") {
                                obj.name = '状态';
                                obj.value = Status[o.Value];
                            } else if (o.DataType == 8) {
                                obj.name = o.Description;
                                obj.value = moment(o.Value).format('YYYY-MM-DD HH:mm:ss');
                            } else {
                                obj.name = o.Description;
                                obj.value = o.Value;
                            }
                            v.items.push(obj);
                        })


                    })
                    return list;
                })();

                $scope.macList = arr;

            }
        })
    }
    $scope.refreshMac(statusNbr)
    setInterval(function() {
        $scope.refreshMac(statusNbr);
    }, 5000)
})



//获取url中的参数 
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象  
    var r = window.location.search.substr(1).match(reg); //匹配目标参数  
    if (r != null) return unescape(r[2]);
    return null; //返回参数值 

}