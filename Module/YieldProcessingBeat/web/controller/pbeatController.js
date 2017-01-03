var program;
var baseUrl = "/pbeat/";
var groupOrMachine;
var chartData;
var grid;
var machines = [];
var totalheight = 0; //定义一个总的高度变量
$(function() {
    var falg = 0;
    $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
    $("#totalType").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { text: lang.YieldProcessingBeat.WorkingDays, value: 1 },
            { text: lang.YieldProcessingBeat.Holiday, value: 0 },
            { text: lang.YieldProcessingBeat.All, value: 2 }
        ],
        value: 2
    });
    groupOrMachine = $("#groupOrMachine").multipleComboxTree({
        url: "/pbeat/GetAllMachineAndMachineGroup",
        url2: "/pbeat/GetKeywordMachinelist",
        type: 2,
        data: {
            GroupId: 0
        },
        checkbox: true
    }).data("BZ-multipleComboxTree");
    /*************************************************************************************************************/
    var falg = false;
    var isloading = false;
    $(window).scroll(function() {
        var begin_date;
        var end_date;
        //滚动
        totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()); //浏览器的高度加上滚动条的高度
        if ($(document).height() <= totalheight) {
            //alert($(document).height());
            //alert($(window).height());
            // $(".hisChart").remove();
            var ct = 0;
            if (machines.length == 0) {
                return;
            }

            if (machines == null) {
                return;
            }

            if (falg == false) {
                machines.shift(); //删除下标为0的元素
                machines.shift(); //删除下标为0的元素
            }
            $("#nodata").show().html("<img src='../../UI/Images/loading.gif'/>");
            var data = {
                mac_nbrs: machines,
                startdate: $("#startTime").val(),
                enddate: $("#endTime").val(),
                //startdate: begin_date,
                //enddate: end_date,//moment($("#startTime").data("kendoDatePicker").value())
                querytype: 2, //parseInt($("#totalType").data("kendoComboBox").value()
                is_work_day: parseInt($("#totalType").data("kendoComboBox").value()),
                is_gp: false
            }
            $.post(baseUrl + "GetLineProcessingBeatChart", data, function(data) {

                if (data.Status == 0) {

                    for (var j = 0; j < machines.length; j++) {
                        if (j >= 5) {
                            for (var k = 0; k < j; k++) {
                                falg = true;
                                machines.shift();
                            }
                            return;
                        }

                        LoadChart(data, machines[j], machines[j]);
                        $("#nodata").hide();
                    }

                } else {
                    BzAlert(data.Message);
                }
            })
        }
    });
    /************************************************************************************************/
    //var chart=[];
    $("#search").click(function() {
        var macs_list = [];
        var counter = 0;
        $(".hisChart").remove();
        machines = [];
        for (var m in groupOrMachine.dataAarry) {
            if (counter > 1) {
                break;
            } else {
                macs_list.push(parseInt(m));
            }
            counter = counter + 1;
        }


        for (var m in groupOrMachine.dataAarry) {
            machines.push(parseInt(m));
        }
        if (machines.length == 0) {
            return;
        }
        var data = {
            mac_nbrs: macs_list,
            startdate: $("#startTime").val(),
            enddate: $("#endTime").val(),
            querytype: 2, //parseInt($("#totalType").data("kendoComboBox").value()
            is_work_day: parseInt($("#totalType").data("kendoComboBox").value()),
            is_gp: false
        }
        $.post(baseUrl + "GetLineProcessingBeatChart", data, function(data) {

            if (data.Status == 0) {
                for (var j = 0; j < machines.length; j++) {
                    counter = j;
                    if (counter > 1) {
                        flag = counter;
                        return;
                    }
                    //if (machines.length >= 5) {   //设置当前页数
                    var totalpage = machines.length; //总页数，防止超过总页数继续滚动
                    var winH = $(window).height(); //页面可视区域高度
                    LoadChart(data, machines[j], j);
                    //$("#Div0").scroll(function () {
                    //    if (j< totalpage) { // 当滚动的页数小于总页数的时候，继续加载
                    //        var pageH = $(document.body).height();
                    //        var scrollT = $(window).scrollTop(); //滚动条top
                    //        var aa = (pageH - winH - scrollT) / winH;
                    //        if (aa < 0.01) {
                    //            var msg_list = $('#Div1');
                    //            if (msg_list.height() + msg_list[0].scrollTop >= msg_list[0].scrollHeight - 60) {
                    //                $(".nodata").show().html("<img src='http://www.sucaihuo.com/Public/images/loading.gif'/>");
                    //                LoadChart(data);
                    //                $(".nodata").hide()
                    //            }
                    //        }
                    //    } else { //否则显示无数据
                    //        showEmpty();
                    //    }
                    //});
                    // getJson(machines[0]); //加载第一页
                    // }//滚动条加载。。。。。。
                }
            } else {
                BzAlert(data.Message);
            }
        })
    });

    $('#Div0').on('scroll', function() {
        // div 滚动了
        alert('滚动了');
        if ($('#div').scrollTop() >= (1000 - 200)) {
            // 滚动到底部了
            alert('滚动到底部了');
        }
    });
})


function DrawLine(chart_index, X_axis_data, Y_axis_data, y_standard_axis_ARRAY, tittle, sub_tittle) {
    //画图
    //var  chart = new Highcharts.Chart({
    //      sub_chart: {
    //          renderTo: chart_index, //图表放置的容器，DIV
    //          defaultSeriesType: 'line', //图表类型line(折线图),
    //          zoomType: 'x'   //x轴方向可以缩放
    //      },

    $(chart_index).highcharts({
        chart: {
            defaultSeriesType: 'line', //图表类型line(折线图),
            zoomType: 'x', //x轴方向可以缩放
            options3d: {
                enabled: false,
                alpha: 45
            }
        },

        credits: {
            enabled: false //右下角不显示LOGO
        },
        title: {
            text: tittle //图表标题
        },
        subtitle: {
            text: sub_tittle //副标题
        },
        xAxis: { //x轴
            categories: X_axis_data, //x轴标签名称
            lineWidth: 0, //基线宽度
            labels: { y: 26, step: 1 } //x轴标签位置：距X轴下方26像素
            //plotLines: [{
            //    color: 'red',            //线的颜色，定义为红色
            //    solidStyle: 'solid',//标示线的样式，默认是solid（实线），这里定义为长虚线
            //    value: 1,                //定义在哪个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
            //    width: 2                 //标示线的宽度，2px
            //}]
        },
        yAxis: { //y轴
            title: { text: lang.YieldProcessingBeat.TitleBeatValue }, //标题
            lineWidth: 2, //基线宽度
            labels: { step: 1 }, //x轴标签位置：距X轴下方26像素
            //基准线
            plotLines: y_standard_axis_ARRAY
                //    [{   //一条延伸到整个绘图区的线，标志着轴中一个特定值。
                //    color: 'red',           //线的颜色，定义为红色
                //    solidStyle: 'solid',     //默认值，这里定义为实线
                //    value:360,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                //    width: 2,                //标示线的宽度，2px
                //    label: {
                //        text: '我是标示线的标签',     //标签的内容
                //        align: 'left',                //标签的水平位置，水平居左,默认是水平居中center
                //        x: 10                         //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
                //    }

            //}]
        },

        tooltip: { //当鼠标悬置数据点时的提示框
            shared: true, //是否共享提示，也就是X一样的所有点都显示出来
            useHTML: true, //是否使用HTML编辑提示信息

            headerFormat: '<small>{point.key}</small><table>',
            pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
                '<td style="text-align: right"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',

            //formatter: function () { //格式化提示信息
            //    return '在' +
            //    this.x + '的产量加工节拍值：' +
            //    Highcharts.numberFormat(this.y, 2);
            //},
            backgroundColor: '#FCFFC5', // 背景颜色
            borderColor: 'black', // 边框颜色
            borderRadius: 10, // 边框圆角
            borderWidth: 3,
            animation: true, // 是否启用动画效果
            style: { // 文字内容相关样式
                color: "#ff0000",
                fontSize: "12px",
                fontWeight: "blod",
                fontFamily: "Courir new"
            }
        },
        plotOptions: { //设置数据点
            line: {
                cursor: 'pointer', //鼠标移到图表上时手势的样式
                dataLabels: {
                    enabled: true //在数据点上显示对应的数据值
                },
                enableMouseTracking: true //取消鼠标滑向触发提示框
            }
        },
        legend: { //图例
            layout: 'horizontal', //图例显示的样式：水平（horizontal）/垂直（vertical）
            backgroundColor: '#ffc', //图例背景色
            align: 'left', //图例水平对齐方式
            verticalAlign: 'top', //图例垂直对齐方式
            x: 100, //相对X位移
            y: 70, //相对Y位移
            floating: true, //设置可浮动
            shadow: true //设置阴影
        },
        exporting: {
            enabled: false //设置导出按钮不可用
        },
        series: Y_axis_data
    });

}

function showEmpty() {
    $(".nodata").show().html("别滚动了，已经到底了。。。");
}


//加载图
function LoadChart(data, obj, j) {
    for (var i = 0; i < data.Data.length; i++) {
        //A类
        var X_axis_A_ARRAY = [];
        var Y_axis_A_ARRAY = [];
        var Y_axis_A_list = [];
        var Y_standard_axis_A_ARRAY = [];
        var obj_A = {};
        var tittle_A = "";
        var sub_tittle_A = "";
        //B类
        var X_axis_B_ARRAY = [];
        var Y_axis_B_ARRAY = [];
        var Y_axis_B_list = [];
        var Y_standard_axis_B_ARRAY = [];
        var obj_B = {};
        var tittle_B = "";
        var sub_tittle_B = "";
        /******************************************逻辑**************************************************************************/
        var stand_value_For_AS_List = _.where(data.Data, { id: obj });
        if (stand_value_For_AS_List.length > 0) {
            var AS_STANDADR = _.where(stand_value_For_AS_List[0].Processing_Beat_list, { Line_Type: "AS" })[0].PROCESSING_BEAT_VALUE; //A标准值
            var BS__STANDADR = _.where(stand_value_For_AS_List[0].Processing_Beat_list, { Line_Type: "BS" })[0].PROCESSING_BEAT_VALUE; //B标准值
            tittle_A = "(" + stand_value_For_AS_List[0].name + "设备)-------每日产量用时加工节拍-------（参考值[红色实线]：" + AS_STANDADR + ")";
            sub_tittle_A = lang.YieldProcessingBeat.sub_tittle;

            tittle_B = "(" + stand_value_For_AS_List[0].name + "设备)-------每日产量运行加工节拍-------（参考值[绿色实线]：" + BS__STANDADR + ")"
            sub_tittle_B = lang.YieldProcessingBeat.sub_tittle;
            //标准值对象包装
            var y_A_standard_axis_obj = {};
            y_A_standard_axis_obj.color = 'red';
            y_A_standard_axis_obj.solidStyle = 'solid';
            y_A_standard_axis_obj.value = AS_STANDADR;
            y_A_standard_axis_obj.width = 2;
            y_A_standard_axis_obj.label = {
                text: '',
                align: 'left',
                style: '{  font : normal 13px Verdana, sans-serif  color : red  }'
            };
            Y_standard_axis_A_ARRAY.push(y_A_standard_axis_obj); //---------------------------------------------------A的基准值
            /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
            var y_B_standard_axis_obj = {};
            y_B_standard_axis_obj.color = 'green';
            y_B_standard_axis_obj.solidStyle = 'solid';
            y_B_standard_axis_obj.value = BS__STANDADR;
            y_B_standard_axis_obj.width = 2;
            y_B_standard_axis_obj.label = {
                text: '',
                align: 'left',
                style: '{  font : normal 13px Verdana, sans-serif  color : red  }'
            };
            Y_standard_axis_B_ARRAY.push(y_B_standard_axis_obj); // ---------------------------------------------------B的基准值
            /***********************************************************/

            //X轴的值
            var A_X_axis_Main_data = _.filter(stand_value_For_AS_List[0].Work_day_list, function(num) { return num.X_DAY_DESC != null; });
            //Y轴的值---------------------------------------------------------------->
            var A_Y_axis_Main_data = _.where(stand_value_For_AS_List[0].Processing_Beat_list, { Line_Type: "A" });
            var B_Y_axis_Main_data = _.where(stand_value_For_AS_List[0].Processing_Beat_list, { Line_Type: "B" });
            for (var M = 0; M < A_Y_axis_Main_data.length; M++) {
                Y_axis_A_list.push(A_Y_axis_Main_data[M].PROCESSING_BEAT_VALUE);
            }
            obj_A.data = Y_axis_A_list;
            obj_A.name = stand_value_For_AS_List[0].name + lang.YieldProcessingBeat.WhenBeat;
            Y_axis_A_ARRAY.push(obj_A);

            for (var N = 0; N < B_Y_axis_Main_data.length; N++) { //---------------------------------------------B
                Y_axis_B_list.push(B_Y_axis_Main_data[N].PROCESSING_BEAT_VALUE);
            }
            obj_B.data = Y_axis_B_list;
            obj_B.name = stand_value_For_AS_List[0].name + lang.YieldProcessingBeat.RunBeat;
            Y_axis_B_ARRAY.push(obj_B);
            //X轴的值---------------------------------------------------------------->
            for (var k = 0; k < A_X_axis_Main_data.length / 2; k++) {
                X_axis_A_ARRAY.push(A_X_axis_Main_data[k].X_DAY_DESC);
            }

            for (var P = 0; P < A_X_axis_Main_data.length / 2; P++) {
                X_axis_B_ARRAY.push(A_X_axis_Main_data[P].X_DAY_DESC);
            }
            /*************************************逻辑Over！！！！！！*******************************/
            var html_A = '<div class="hisChart" id="hisChartA' + "_" + j + '" style="background-color:lightblue;"></div>';
            $("#Div1").append($(html_A));
            DrawLine('#hisChartA' + "_" + j, X_axis_A_ARRAY, Y_axis_A_ARRAY, Y_standard_axis_A_ARRAY, tittle_A, sub_tittle_A);

            var html_B = '<div class="hisChart" id="hisChartB' + "_" + j + '"  style="background-color:lightblue;" ></div>';
            $("#Div1").append($(html_B));
            DrawLine('#hisChartB' + "_" + j, X_axis_B_ARRAY, Y_axis_B_ARRAY, Y_standard_axis_B_ARRAY, tittle_B, sub_tittle_B);
        }
    }
}



Array.prototype.remove = function(dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i]
        }
    }
    this.length -= 1
}