var openServerParam = {
    port: 4,
    BaudRate: 57600,
    Parity: 2,
    DataBits: 8,
    StopBits: 0,
    FlowControl: 0,
    casa: "+8613010314500"
}
window.onload = function() {
    // var selectType = $("input[name='searchType']:checked").val();

    // if (selectType == 1) {
    //     sliderHide();
    // } else {
    //     sliderShow();
    // }
    renderPage();

    $('#table').bootstrapTable({
        //url: '/Home/GetDepartment', //请求后台的URL（*）
        // method: 'get', //请求方式（*）
        //toolbar: '#toolbar', //工具按钮用哪个容器
        striped: true, //是否显示行间隔色
        //cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        //pagination: true, //是否显示分页（*）
        //sortable: false, //是否启用排序
        //sortOrder: "asc", //排序方式
        //queryParams: oTableInit.queryParams, //传递参数（*）
        sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1, //初始化加载第一页，默认第一页
        pageSize: 999999999, //每页的记录行数（*）
        // pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
        //search: true, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        //strictSearch: true,
        //showColumns: true, //是否显示所有的列
        //showRefresh: true, //是否显示刷新按钮
        //minimumCountColumns: 2, //最少允许的列数
        clickToSelect: true, //是否启用点击选中行
        height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "ID", //每一行的唯一标识，一般为主键列
        //showToggle: true, //是否显示详细视图和列表视图的切换按钮
        //cardView: false, //是否显示详细视图
        //detailView: false, //是否显示父子表
        data: [{
            no: 1,
            content: "维修申请之后，给机修发短信发",
            // time: "发送时间",
            // people: "发送人员",
            //enable: "启用"
        }],
        columns: [{
                field: 'no',
                title: '序号'
            }, {
                field: 'content',
                title: '内容'
            },
            // {
            //     field: 'time',
            //     title: '发送时间'
            // }, {
            //     field: 'people',
            //     title: '发送人员'
            // }, {
            //     field: 'enable',
            //     title: '启用'
            // }, 
        ]
    });
}

$("input[name='searchType']").change(function() {
    //console.log(12)
    if (this.value == 2) {
        setConfig(2, "");
    } else {
        setConfig(1, "");
    }
})

$("#slider-box img").click(function() {
    $(this).hide();
    // $(this).siblings().show();
    var flag = $(this).attr('data-a');
    if (flag == 0) { //0是关闭状态，调用开启方法
        openServerParam.type = "";
        openServerParam.flag = 1;
        $.post("/MessageNotification/StartService", openServerParam, function(data) {
            if (data.Status == 0) {
                renderPage()
            }
        })


    } else if (flag == 1) { //1是开启状态，调用关闭方法
        var data = {
            type: "",
            flag: 1
        }

        $.post("/MessageNotification/StopService", data, function(data) {
            if (data.Status == 0) {
                renderPage()
            }
        })


    }


})

function sliderShow() {
    $("#slider-box").show();
    //setConfig(2, "");
}

function sliderHide() {
    $("#slider-box").hide();
    //setConfig(1, "");
}

function setConfig(type, flag, callback) {
    var data = {
        type: type,
        flag: flag
    }
    $.post("/MessageNotification/setConfig", data, function(data) {
        if (data.Status == 0) {
            callback && callback();
            if (!callback)
                renderPage();
        }
    })
}

function renderPage() {
    $.get('/MessageNotification/getConfig', function(data) {
        console.log(data)
        if (data.type == 1) { //1是网络2是硬件
            $($("input[name='searchType']")[0]).prop('checked', 'checked');
            $($("label[class='radio']>.radio>span")[0]).addClass('checked');
            sliderHide();

        } else if (data.type == 2) {
            $($("input[name='searchType']")[1]).prop('checked', 'checked');
            $($("label[class='radio']>.radio>span")[1]).addClass('checked');
            // console.log($("label[class='radio']>.radio>span"))
            sliderShow();
            // var flag = document.getElementById('switch'); //0是关1是开
            if (data.flag == 0) {
                $("#buttonOFF").show();
                // flag.src = "./Message/web/images/buttonOFF.png"
            } else if (data.flag == 1) {
                $("#buttonON").show();
                // flag.src = "./Message/web/images/buttonON.png"
            }
        }
    })
}