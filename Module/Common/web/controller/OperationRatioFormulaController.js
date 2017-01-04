/**
 * Created by qb on 2016/12/2.
 */
var notice_nbr; //id
var num = 1000;
var num_1 = 9999999;
var up_condition = [];
var down_condition = [];
var dataarray;
var formula_name;
$.ajax({
    type: "get",
    url: "/OperationRatioFormula/GetStatusData",
    async: false,
    success: function(data) {
        dataarray = data.Data
    }
})
$.ajax({
        type: "post",
        url: "/OperationRatioFormula/GetDropListList",
        async: false,
        success: function(data) {
            formula_name = data.Data
        }
    })
    //下拉公式选择
function dropDownList() {
    for (var i = 0; i < formula_name.length; i++) {
        $(".ComboBox").append(
            '<li>' +
            '<span>' + formula_name[i].DataText + '</span>' +
            '<input type="hidden"  value="' + formula_name[i].DataValue + '"/>' +
            '</li>'
        )
    }
    //点击小三角
    $("#caret").click(function() {
        $(".ComboBox").toggle();
    })
    $(".ComboBox").mouseleave(function() {
        $(this).hide();
    })
    $(".ComboBox>li").click(function() {
            var re = $(this).children().eq(0).html();
            var va = $(this).children().eq(1).val();
            $("#formula").html("");
            LoadData(va);
            $("input[type='email']").focus()
            $("input[type='email']").val(re);
            $("input[type='email']").addClass("mui--is-not-empty");
        })
        //点击下文本框，查询所有
    $("#NAME").click(function() {
        $("#formula").html("");
        LoadData('')
    })
    $("#NAME").change(function() {
        var re = $(this).val() == "" ? undefined : $(this).val();
        $("#formula").html("");
        var va = "";
        var t = "";
        for (var i = 0; i < formula_name.length; i++) {
            if (formula_name[i].DataText.indexOf(re) != -1) //如果返回值不等于-1 说明存在
            {
                t = formula_name[i].DataText;
                va = formula_name[i].DataValue;
                break;
            }
        }

        LoadData(va);
        $("input[type='email']").focus()
        $("input[type='email']").val(t);
    })

}
dropDownList()

//加载刷新
function LoadData(objbane) {
    $.ajax({
        type: "post",
        url: "/OperationRatioFormula/GetList",
        async: false,
        data: { name: objbane },
        success: function(data) {
            function Num() {
                return num++;
            }

            function NumB() {
                return num_1++;
            }
            Num();
            NumB();
            for (var i = 0; i < data.Data.length; i++) {

                var specific_formalu_name = _.where(formula_name, { DataValue: data.Data[i].FORMULA_NAME })[0].DataText;
                //分子
                var str_menber = "";
                var member_name = data.Data[i].MEMBER; //1+2+3+4
                var ArrrayMember = member_name.split("+");
                //分母
                var str_denominator = "";
                var denominator_name = data.Data[i].DENOMINATOR; //1+2+3+4
                var Arrraydenominator = denominator_name.split("+");


                for (var j = 0; j < ArrrayMember.length; j++) {

                    var temp_int = parseInt(ArrrayMember[j]);
                    if (ArrrayMember.length == 1) {
                        str_menber = _.where(dataarray, { STATUS_NBR: temp_int })[0].NAME;
                    } else {
                        if (j + 1 == ArrrayMember.length) {
                            str_menber += _.where(dataarray, { STATUS_NBR: temp_int })[0].NAME;
                        } else {
                            str_menber += _.where(dataarray, { STATUS_NBR: temp_int })[0].NAME + "+"
                        }
                    }
                }
                /********分母*********************************************************************************************/
                for (var j = 0; j < Arrraydenominator.length; j++) {

                    var temp_int = parseInt(Arrraydenominator[j]);
                    if (Arrraydenominator.length == 1) {
                        str_denominator = _.where(dataarray, { STATUS_NBR: temp_int })[0].NAME;
                    } else {
                        if (j + 1 == Arrraydenominator.length) {
                            str_denominator += _.where(dataarray, { STATUS_NBR: temp_int })[0].NAME;
                        } else {
                            str_denominator += _.where(dataarray, { STATUS_NBR: temp_int })[0].NAME + "+";
                        }
                    }
                }
                //公式名称

                $("#formula").append(
                    '<div class="clearfix boxParent">' +
                    '<input type="hidden" value="' + data.Data[i].NOTICE_NBR + '">' +
                    '<input type="hidden" value="' + data.Data[i].FORMULA_NAME + '"/>' +
                    '<canvas width="100" height="100" id="canvas' + i + '" style="margin:5px 0 0 5px;display:none;">' +

                    '</canvas>' +
                    '<div class="clearfix pull-left box" style="min-width:500px;">' +
                    '<div class="pull-left" style="margin-top:11px;">' +
                    //'<h2> <input type="text" value="' + data.Data[i].FORMULA_NAME + '" style="height:40px;font-size:30px;font-weight:1200;text-align:center;"/>' + "=" + '</h2>' +
                    '<div class="clearfix" style="margin-top:15px;">' +
                    '<h3 style="min-width: 206px; border: 1px solid #eee; margin: 6px 0 0 0; text-align: center;line-height:42px;height:42px;" class="pull-left ">' +
                    '<span class="font_color">' + specific_formalu_name + '</span>' +
                    '<input type="hidden"  value="' + data.Data[i].FORMULA_NAME + '"/>' +
                    '</h3>' +
                    '<div class="mui-dropdown pull-left">' +
                    '<button class="mui-btn mui-btn--primary btn_xiala" data-mui-toggle="dropdown" style="height:42px;padding:0 10px;">' +
                    '<span class="mui-caret" style="border-top: 10px solid #fff !important; "></span>' +
                    '</button>' +
                    '<ul class="mui-dropdown__menu mui-dropdown__menu--right formula_options" style="width:243px;">' +

                    '</ul>' +
                    '</div>' +
                    '<div class="pull-left font_color" style="margin-top:6px;font-size:30px;">=</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="pull-left" style="margin-top:12px;text-align:center">' +
                    '<ul style="font-size:18px;min-width:150px;">' +
                    '<li style="line-height:40px;margin:0 20px;height:40px;" class="up"><span class="font_color">' + str_menber + '</span><input type="hidden" id="hident' + i + '" value="' + data.Data[i].MEMBER + '"/></li>' +
                    '<li style="border-bottom:2px solid #000;min-width=30px;"></li>' +
                    ' <li style="line-height:40px;margin:0 20px;height:40px;" class="down"><span class="font_color">' + str_denominator + '</span><input type="hidden" id="hident' + i + '" value="' + data.Data[i].DENOMINATOR + '"/></li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="pull-left" style="margin:22px 0 0 20px;">' +
                    '<div class="dropdown upAdd">' +
                    '<i class="icon-plus-sign dropdown-toggle" data-toggle="dropdown" id="dropdownMenu' + num + '"></i>' +
                    '<ul class="dropdown-menu font" role="menu" aria-labelledby="dropdownMenu' + num + '">' +
                    //多选框
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '<div class="pull-left" style="margin:61px 0 0 -11px;">' +
                    '<div class="dropdown downAdd">' +
                    '<i class="icon-plus-sign dropdown-toggle" data-toggle="dropdown" id="dropdownMenu' + num_1 + '"></i>' +
                    '<ul class="dropdown-menu font" role="menu" aria-labelledby="dropdownMenu' + num_1 + '">' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="pull-right change_shape" >' +
                    '<button class="btn green btn_001" id="save" style="margin-right:5px;">' +
                    lang.Common.Save +
                    '<i class="icon-ok"></i>' +
                    '</button>' +
                    '<button class="btn red btn_001" id="delete">' +
                    lang.Order.Delete +
                    '<i class="icon-remove-sign"></i>' +
                    '</button>' +
                    '</div>' +

                    '</div>'
                )
                $("input[type='email']").val("").removeClass("mui--is-not-empty");
                up_condition = [];
                down_condition = [];

            }
        },
        error: function() {

        }
    })



}




//页面加载显示下拉字
$(document).ready(function() {
    LoadData('');
});


//新增方法
////新增
$("#btn").click(function() {
    notice_nbr = undefined;
    show();
})

//保存
$("#save").live("click", function() {
    // var fn = "";// $(this).parent().prev().children().eq(0).children().children().eq(0).children().eq(1).val();
    var fn = $(this).parent().prev().children().eq(0).children().children().children().eq(1).val();
    //分子
    var str_menber = "";
    var member = $(this).parent().prev().children().eq(1).children().children().eq(0).children().eq(0).html();
    if (member == undefined) {
        BzAlert(lang.Common.YouMustEnterTheMolecular);
        //activateOverlay("必须输入分子", 1,2000);
        return;
    }
    var ArrrayMember = member.split("+");
    if (member != "") {
        for (var j = 0; j < ArrrayMember.length; j++) {

            var temp_str = ArrrayMember[j];
            if (ArrrayMember.length == 1) {
                str_menber = _.where(dataarray, { NAME: temp_str })[0].STATUS_NBR;
            } else {
                if (j + 1 == ArrrayMember.length) {
                    str_menber += _.where(dataarray, { NAME: temp_str })[0].STATUS_NBR;
                } else {
                    str_menber += _.where(dataarray, { NAME: temp_str })[0].STATUS_NBR + "+"

                }
            }
        }
    } else {
        BzAlert(lang.Common.YouMustEnterTheMolecular);
        //activateOverlay("必须输入分子", 1, 2000);
        return;
    }

    //分母
    var str_denominator = "";
    var denominator = $(this).parent().prev().children().eq(1).children().children().eq(2).children().eq(0).html();
    var Arrraydenominator = denominator.split("+");
    if (denominator != "") { //"<input type="hidden">"
        for (var j = 0; j < Arrraydenominator.length; j++) {

            var temp_str = Arrraydenominator[j];
            if (Arrraydenominator.length == 1) {
                str_denominator = _.where(dataarray, { NAME: temp_str })[0].STATUS_NBR;
            } else {
                if (j + 1 == Arrraydenominator.length) {
                    str_denominator += _.where(dataarray, { NAME: temp_str })[0].STATUS_NBR;
                } else {
                    str_denominator += _.where(dataarray, { NAME: temp_str })[0].STATUS_NBR + "+"

                }
            }
        }
    } else {
        BzAlert(lang.Common.YouMustEnterTheDenominator);
        //activateOverlay("必须输入分母", 1,2000);
        return;
    }
    notice_nbr = $(this).parent().parent().children().eq(0).val() == "" ? undefined : $(this).parent().parent().children().eq(0).val();
    console.log(str_denominator)
    var data;
    if (notice_nbr == undefined) {

        data = {
            FORMULA_NAME: fn,
            TYPE: 'A',
            USER_NBR: 0,
            MEMBER: str_menber,
            DENOMINATOR: str_denominator,
            DATETIME: null
        };
        if (fn != "" && fn != undefined) {
            $.post("/OperationRatioFormula/AddDynamicBroadFormula", data, function(data) {
                if (data.Status == 0) {
                    $("#formula").html("");
                    notice_nbr = data.Data;
                    //activateOverlay("操作成功", 2, 3000);
                    BzSuccess(data.Message);
                    LoadData('');

                } else {
                    //$("#formula").html("");
                    BzAlert(data.Message);
                    //activateOverlay("此公式已存在，请选择其他公式！", 2,3000);
                    // LoadData();
                }
            })
        }

    } else {
        data = {
            FORMULA_NAME: fn,
            TYPE: 'A',
            NOTICE_NBR: notice_nbr,
            USER_NBR: 0,
            MEMBER: str_menber,
            DENOMINATOR: str_denominator,
            DATETIME: null
        }
        $.post("/OperationRatioFormula/UpdateDynamicBroadFormula2", data, function(data) {
            if (data.Status == 0) {
                $("#formula").html("");
                //activateOverlay("操作成功", 2, 3000);
                BzSuccess(data.Message);
                LoadData('');
            } else {
                BzAlert(data.Message);
                //activateOverlay("此公式已存在，请选择其他公式！", 2,3000);
                // LoadData();
            }
        })
    }

})

function show() {

    function Num() {
        return num++;
    }

    function NumB() {
        return num_1++;
    }
    Num();
    NumB();
    $("#formula").append(
        '<div class="clearfix boxParent">' +
        '<input type="hidden" value="">' +
        '<input type="hidden" value=""/>' +
        '<canvas width="100" height="100"  style="margin:5px 0 0 5px;display:none;">' +

        '</canvas>' +
        '<div class="clearfix pull-left box" style="min-width:500px;">' +
        '<div class="pull-left" style="margin-top:11px;">' +
        '<div class="clearfix" style="margin-top:15px;">' +
        '<h3 style="min-width: 206px; border: 1px solid #eee; margin: 6px 0 0 0; text-align: center;line-height:42px;height:42px;" class="pull-left ">' +
        '<span class="font_color"></span>' +
        '<input type="hidden"  value=""/>' +
        '</h3>' +
        '<div class="mui-dropdown pull-left">' +
        '<button class="mui-btn mui-btn--primary btn_xiala" data-mui-toggle="dropdown" style="height:42px;padding:0 10px;">' +
        '<span class="mui-caret" style="border-top: 10px solid #fff !important; "></span>' +
        '</button>' +
        '<ul class="mui-dropdown__menu mui-dropdown__menu--right formula_options" style="width:243px;">' +

        '</ul>' +
        '</div>' +
        '<div class="pull-left font_color" style="margin-top:6px;font-size:30px;">=</div>' +
        '</div>' +
        '</div>' +
        '<div class="pull-left" style="margin-top:12px;text-align:center">' +
        '<ul style="font-size:18px;min-width:150px;">' +
        '<li style="line-height:40px;margin:0 20px;height:40px;" class="up"><span class="font_color"></span><input type="hidden"  value=""/></li>' +
        '<li style="border-bottom:2px solid #000;min-width=30px;"></li>' +
        ' <li style="line-height:40px;margin:0 20px;height:40px;" class="down"><span class="font_color"></span><input type="hidden"  value=""/></li>' +
        '</ul>' +
        '</div>' +
        '<div class="pull-left" style="margin:22px 0 0 20px;">' +
        '<div class="dropdown upAdd">' +
        '<i class="icon-plus-sign dropdown-toggle" data-toggle="dropdown" id="dropdownMenu' + num + '"></i>' +
        '<ul class="dropdown-menu font" role="menu" aria-labelledby="dropdownMenu' + num + '">' +
        //多选框
        '</ul>' +
        '</div>' +
        '</div>' +
        '<div class="pull-left" style="margin:61px 0 0 -11px;">' +
        '<div class="dropdown downAdd">' +
        '<i class="icon-plus-sign dropdown-toggle" data-toggle="dropdown" id="dropdownMenu' + num_1 + '"></i>' +
        '<ul class="dropdown-menu font" role="menu" aria-labelledby="dropdownMenu' + num_1 + '">' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="pull-right change_shape" >' +
        '<button class="btn green btn_001" id="save" style="margin-right:5px;">' +
        lang.Common.Save +
        '<i class="icon-ok"></i>' +
        '</button>' +
        '<button class="btn red btn_001" id="delete">' +
        lang.Order.Delete +
        '<i class="icon-remove-sign"></i>' +
        '</button>' +
        '</div>' +

        '</div>'
    )

    $("input[type='email']").val("").removeClass("mui--is-not-empty")
    up_condition = [];
    down_condition = [];


}
//公式下拉选择
$(".btn_xiala").live("click", function() {
    $(this).next().html("");
    for (var i = 0; i < formula_name.length; i++) {
        $(this).next().append(
            '<li>' +
            '<a href="#">' +
            '<span>' + formula_name[i].DataText + '</span>' +
            '<input type="hidden" value="' + formula_name[i].DataValue + '"/>' +
            '</a>' +
            '</li>'
        )
    }
})

$(".formula_options>li").live("click", function(e) {
        e.preventDefault();
        var rel = $(this).children().eq(0).html();
        console.log(rel)
        $(this).parent().parent().prev().html(rel);
        $(this).parent().parent().prev().children().eq(0).addClass("font_color") //改变颜色
        var r = $(this).children().children().eq(1).val();
    })
    //提示
function activateOverlay(message, falg, interval) {
    //flag=1提示框不会自动退出，flag=2 提示框自动退出
    // show overlay
    var modalEl = document.createElement('div');
    modalEl.style.width = '300px';
    //modalEl.style.color = '#E53935';
    modalEl.style.margin = '200px auto';
    modalEl.style.backgroundColor = '#FCF8E3';
    modalEl.style.border = '1px solid #eeeeee';
    modalEl.style.textAlign = 'center';
    modalEl.style.borderRadius = "5px"
    $(modalEl).append(
            '<h3 style="margin:0;line-height:100px;border-radius:5px;">' + message + '</h3>'
        )
        // show modal
    if (falg == 1) {
        mui.overlay('on', modalEl);
    } else {
        mui.overlay('on', modalEl);
        $(modalEl).fadeOut(interval, function() {
            $("#mui-overlay").css("background-color", "transparent");
        });
    }
}

//点击上+号添加
$(".upAdd>i").live("click", function() {
    $(".upAdd>i").next().html("");
    var a = $(this).parent().parent().parent().parent().children().eq(3).children().eq(1).children().children().children().eq(0).html() //.split("+");
    var Interface_data = a == "" ? [] : a.split("+");

    //获取状态数据
    //$.get("/MachineStatus/StatusDataMaintenance/GetStatusData", function (data) {
    //    var dataarray = data.Data;
    var one_level_list = _.where(dataarray, { LEVEL: 1 }); //1 LEVEL
    var two_level_list = _.where(dataarray, { LEVEL: 2 }); //1 LEVEL
    if ($(".upAdd>i").next().html() == "") {
        $(".upAdd>i").next().append(
            '<li style="line-height:40px;font-size:17px;" class="font"> ' + lang.Common.LevelOneStatus + '</li>'
        )
        for (var i = 0; i < one_level_list.length; i++) {
            var plan = dataarray[i].PLANED == 1 ? "（" + lang.Common.Unplanned + "）" : "（" + lang.Common.InThePlan + "）";
            if (dataarray[i].LEVEL == 1) {
                $(".upAdd>i").next().append(
                    '<li role="presentation" style="background:' + one_level_list[i].COLOR16 + ';font-size:16px;">' +
                    '<a role="menuitem" tabindex="-1" href="javascript:;" data-stopPropagation="true" style="color:black">' + //多选框
                    '<label>' +
                    '<input type="checkbox" name="cbHobby" value="' + one_level_list[i].NAME + '" >' +
                    '<span>' + one_level_list[i].NAME + plan + '</span>' +
                    '</label>' +
                    '</a>' +
                    '</li>'
                )
            }
        }
        $(".upAdd>i").next().append(
            '<li style="line-height:40px;font-size:17px;" class="font"> ' + lang.Common.LevelTwoStatus + '</li>'
        )
        for (var i = 0; i < two_level_list.length; i++) {
            var plan = dataarray[i].PLANED == 1 ? "（" + lang.Common.Unplanned + "）" : "（" + lang.Common.InThePlan + "）";
            if (dataarray[i].LEVEL == 1) {
                $(".upAdd>i").next().append(
                    '<li role="presentation" style="background:' + two_level_list[i].COLOR16 + ';font-size:16px;">' +
                    '<a role="menuitem" tabindex="-1" href="javascript:;" data-stopPropagation="true" style="color:black">' + //多选框
                    '<label >' +
                    '<input type="checkbox" name="cbHobby" value="' + two_level_list[i].NAME + '">' +
                    '<span>' + two_level_list[i].NAME + plan + '</span>' +
                    '</label>' +
                    '</a>' +
                    '</li>'
                )
            }
        }
    }
    //})
    var check = $(this).next().children().children().children().children("input");

    for (var i = 0; i < check.length; i++) {
        for (var j = 0; j < Interface_data.length; j++) {
            if (check[i].value == Interface_data[j]) {
                $(check[i]).attr("checked", true)
            }
        }
    }
    var temporary_arr = [];
    for (var i = 0; i < check.length; i++) {
        if (check[i].checked) {
            temporary_arr.push(check[i].value);
        }
    }
    up_condition = temporary_arr;
});

//点击下+号添加
$(".downAdd>i").live("click", function() {
    $(".downAdd>i").next().html("");
    var a = $(this).parent().parent().parent().parent().children().eq(3).children().eq(1).children().children().children().eq(2).html() //.split("+")
    var Interface_data = a == "" ? [] : a.split("+");
    console.log(Interface_data);
    //获取状态数据
    //$.get("/MachineStatus/StatusDataMaintenance/GetStatusData", function (data) {
    //    var dataarray = data.Data;
    var one_level_list = _.where(dataarray, { LEVEL: 1 }); //1 LEVEL
    var two_level_list = _.where(dataarray, { LEVEL: 2 }); //1 LEVEL
    if ($(".downAdd>i").next().html() == "") {
        $(".downAdd>i").next().append(
            '<li style="line-height:40px;font-size:17px;" class="font"> ' + lang.Common.LevelOneStatus + '</li>'
        )
        for (var i = 0; i < one_level_list.length; i++) {
            var plan = dataarray[i].PLANED == 1 ? "（" + lang.Common.Unplanned + "）" : "（" + lang.Common.InThePlan + "）";
            if (dataarray[i].LEVEL == 1) {
                $(".downAdd>i").next().append(
                    '<li role="presentation" style="background:' + one_level_list[i].COLOR16 + ';font-size:16px;">' +
                    '<a role="menuitem" tabindex="-1" href="javascript:;" data-stopPropagation="true" style="color:black">' + //多选框
                    '<label >' +
                    '<input type="checkbox" name="cbHobby1" value="' + one_level_list[i].NAME + '">' +
                    '<span>' + one_level_list[i].NAME + plan + '</span>' +
                    '</label>' +
                    '</a>' +
                    '</li>'
                )
            }
        }
        $(".downAdd>i").next().append(
            '<li style="line-height:40px;font-size:17px;" class="font"> ' + lang.Common.LevelTwoStatus + '</li>'
        )
        for (var i = 0; i < two_level_list.length; i++) {
            var plan = dataarray[i].PLANED == 1 ? "（" + lang.Common.Unplanned + "）" : "（" + lang.Common.InThePlan + "）";
            if (dataarray[i].LEVEL == 1) {
                $(".downAdd>i").next().append(
                    '<li role="presentation" style="background:' + two_level_list[i].COLOR16 + ';font-size:16px;">' +
                    '<a role="menuitem" tabindex="-1" href="javascript:;" data-stopPropagation="true" style="color:black">' + //多选框
                    '<label >' +
                    '<input type="checkbox" name="cbHobby1" value="' + two_level_list[i].NAME + '">' +
                    '<span>' + two_level_list[i].NAME + plan + '</span>' +
                    '</label>' +
                    '</a>' +
                    '</li>'
                )
            }

        }
    }
    //})
    var check = $(this).next().children().children().children().children("input");
    for (var i = 0; i < check.length; i++) {
        for (var j = 0; j < Interface_data.length; j++) {
            if (check[i].value == Interface_data[j]) {
                $(check[i]).attr("checked", true)
            }
        }
    }
    var temporary_arr = [];
    for (var i = 0; i < check.length; i++) {
        if (check[i].checked) {
            temporary_arr.push(check[i].value);
        }
    }
    down_condition = temporary_arr;
})

//点击上多选框
$(".upAdd input[name='cbHobby']").live("click", function() {
        if (this.checked == true) {
            if ($.inArray(this.value, up_condition) == -1) {
                up_condition.push($(this).val());
            }
        } else {
            up_condition.remove($(this).val(), "")
        }
        var a = up_condition.join("+")
        $(this).parent().parent().parent().parent().parent().parent().prev().children().children().eq(0).eq(0).children().eq(0).html(a);


    })
    //点击下多选框
$(".downAdd input[name='cbHobby1']").live("click", function() {
        console.log(1)
        if (this.checked == true) {
            if ($.inArray(this.value, down_condition) == -1) {
                down_condition.push($(this).val());
            }
        } else {
            down_condition.remove($(this).val(), "");
        }

        var a = down_condition.join("+");
        $(this).parent().parent().parent().parent().parent().parent().prev().prev().children().children().eq(2).children().eq(0).html(a);

    })
    //删除
$("#delete").live("click", function() {
    $(this).parent().parent().remove();
    var r = $(this).parent().siblings("input").val();
    console.log(r)
    $.post('/OperationRatioFormula/DeleteDynamicBroadFormula', { NOTICE_NBR: r });
    $.post("/OperationRatioFormula/GetList", { name: "" });
    BzSuccess("操作成功");
})

//数组去指定内容
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
//下拉框点击不消失
$(function() {
    $("ul.dropdown-menu").live("click", "[data-stopPropagation]", function(e) {
        e.stopPropagation();
    });
});
//数组去重复
Array.prototype.unique1 = function() {
        var n = []; //一个新的临时数组
        for (var i = 0; i < this.length; i++) //遍历当前数组
        {
            //如果当前数组的第i已经保存进了临时数组，那么跳过，
            //否则把当前项push到临时数组里面
            if (n.indexOf(this[i]) == -1) n.push(this[i]);
        }
        return n;
    }
    //随机数
function randomNum() {
    return parseInt(Math.random() * 10 + 10);
}
//随机色
function randomColor() {
    var r = parseInt(Math.random() * 256, 10) + 1;
    var g = parseInt(Math.random() * 256, 10) + 1;
    var b = parseInt(Math.random() * 256, 10) + 1;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
//数组是否有相同的值
function ArrayNot(arr1, arr2) {
    var relsute = [];
    for (var k in arr1) {
        for (var j in arr2) {
            if (arr1[k] == arr2[j]) {
                arr3.push(arr1[k]);
            }
        }
    }
    return relsute;
}