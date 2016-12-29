/**
 * Created by qb on 2016/11/18.
 */
app.controller("myCtrl", function ($scope, $http) {
    $scope.global_data = [];
    $scope.Datas = [];
    var flag = 1;
    //点击面包层
    $scope.change_page = function () {
        $(".parent_img_menu").animate({
            width: 'toggle', opacity: 'toggle'
        }, "slow");
        //缩进去
        if (flag == 1) {
            $scope.getToolData();
            setTimeout(function () {
                $("#img_content").removeClass("parent_img_content_a").addClass("parent_img_content_b").addClass("a");
                $("#Hidden_bread").css("display", "block");
                $(".big_img_conter_loc").removeClass("hide");
                $(".img_content").css("min-height", "400px");
                $("#big_img").addClass("big_img_loc");
            }, 600);
            flag = 0;



        } else {//张开
            $("#img_content").removeClass("parent_img_content_b").removeClass("a").addClass("parent_img_content_a");
            $("#Hidden_bread").css("display", "none");
            $(".big_img_conter_loc").addClass("hide");
            $(".img_content").css("min-height", "680px");
            $("#big_img").removeClass("big_img_loc");
            flag = 1;

        }
    }
    //显示左侧小图
    $scope.load = function () {
        $http.post("/GetWorkPlaceNbrs", JSON.stringify({ workplace: "" })).success(function (data) {
            $scope.global_data = data.Data;
            $scope.Datas = data.Data;
            bigIMG.src = $scope.global_data[0].PIC_IMG;
            console.log($scope.global_data)
        });
    }
    $scope.load();
    //AJAX调用机床状态
    $scope.getToolData=function () {
        var currentTool = $(".img_border_active ").prev().html();//当前选中的机床
        $(".table span").html("");
        $http.post("/GetImmediateState", { Page: currentTool }).success(function (result) {

            if (result.Status === 0) {
                var result = result.Data;
                var st = [];
                var li = [];
                for (var i = 0; i < result.length; i++) {
                    st[i] = result[i].STATUS_NAME;
                }
                var sts = RepeatArray(st);
                for (var i = 0; i < sts.length; i++) {
                    var obj = {}
                    obj.status = sts[i];
                    obj.number = valInarr(sts[i], st);
                    obj.color = getColor(sts[i], result);
                    li.push(obj);
                }
                $scope.data_status = li;
                console.log(li)

            }
            else {
                BzAlert(result.Message);
            }
        });
    }
    //判断一个值在数组中有几个
    function valInarr(val,arr) {
        var count = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                count++;
            }
        }
        return count;

    }
    //数组去重复
    function RepeatArray(arr) {
        arr.sort();
        var result = [];
        for (var i = 0; i <arr.length; i++) {
            arr[i] != arr[i + 1] && result.push(arr[i]);
        }
        return result;
    }
    //状态颜色
    function getColor(val, arr) {
        var result;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].STATUS_NAME == val) {
                result = arr[i].STATUS_COLOR;
                break;
            }
        }
        return result;
    }
    //拖拽
    /**
     通过鼠标点击并拖拽元素到列表中的一个新的位置，
     其它条目会自动调整。默认情况下，
     sortable 各个条目共享 draggable 属性。
     */
    var $list = $("#module_list");
    $list.sortable({
        opacity: 0.6,
        revert: true,
        cursor: 'move',
        handle: '.font_style',
        update: function () {
            var newids = [];//新数组对象
            var arr = [];//保存ORDER_NUM
            var name = [];//保存名称
            var id = [];//保存id
            var group = []; //保存组
            var smallImg = [];
            var bigImg = [];
            for (var i = 0; i < $("#module_list>div").length; i++) {//遍历添加newids对象
                var obj = {}
                arr[i] = i;
                smallImg[i] = $("#module_list>div>img")[i].src.replace($("#module_list>div>img")[i].baseURI,"../../../");
                name[i] = $("#module_list>div>p")[i].innerHTML;
                id[i] = $("#module_list>div>.id")[i].value;
                group[i] = $("#module_list>div>b")[i].value;
                bigImg[i] = $("#module_list>div>.big_pic")[i].value;
                obj.PIC_IMG = bigImg[i];
                obj.ICON_IMG = smallImg[i];
                obj.MAP_NBR = id[i];
                obj.GP_NBR = group[i];
                obj.ORDER_NUM = arr[i] + 1;
                obj.WORKSHOP_CODE = name[i];
                newids[i] = obj
            }
            $.post("/UpdateOrderedDiv", JSON.stringify({ newids: newids, oldids: $scope.Datas }), function (data) {
                if (data.Status == 0) {
                    //$scope.load();
                }
            })
        },
        stop: function (e, ui) {
            var currentItem = ui.item[0].innerText.slice(0, length - 1);

            var specific_formalu_name = _.where($scope.global_data, { WORKSHOP_CODE: currentItem })[0].PIC_IMG;//[0].PIC_IMG;
            bigIMG.src = specific_formalu_name;
        }
    });
    //点击小图方法
    $scope.isSelect = 0;
    $scope.showBigImg = function (obj,index) {
        $scope.isSelect = index;
        bigIMG.src = obj;
    }
});