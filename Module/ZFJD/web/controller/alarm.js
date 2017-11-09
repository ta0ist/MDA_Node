var mac;
var tableHeight = parseInt($('.table-box').css('height')) - 40;

$.ajax({
    type: 'GET',
    async: false,
    url: '/ZFJD/getMac',
    success: function(data) {
        console.log(data)
        mac = data.Data;
    }
})
$.fn.datetimepicker.dates['zh'] = {
    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
    daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
    meridiem: ["上午", "下午"],
    //suffix:      ["st", "nd", "rd", "th"],  
    today: "今天"
};
var macSelect = new ConboBox({
    id: '#mac',
    data: mac,
    fieldName: 'MAC_NAME',
    fieldId: 'MAC_NBR',
    width: $("#mac").css('width'),
    callBack: function() {
        //var nbr = macSelect.rowData() == undefined ? mac[0].MAC_NBR : macSelect.rowData().MAC_NBR;
        refresh();

    }
}).init()

$("#datetimepicker").datetimepicker({
    format: 'yyyy-mm-dd',
    minView: 'month',
    autoclose: true, //选中关闭
    todayBtn: true, //今日按钮
    language: 'zh'
        //locale: moment.locale('zh-cn')  
});

$("#datetimepicker").val(moment().format('YYYY-MM-DD'));

$('#table').bootstrapTable({
    method: 'POST',
    dataType: 'json',
    contentType: "application/x-www-form-urlencoded",
    cache: false,
    //striped: true, //是否显示行间隔色
    sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
    url: '/ZFJD/alarm/getAlarm',
    height: tableHeight,
    //showColumns: true,
    //pagination: true,
    queryParams: queryParams,
    minimumCountColumns: 2,
    pageNumber: 1, //初始化加载第一页，默认第一页
    pageSize: 20, //每页的记录行数（*）
    pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
    uniqueId: "id", //每一行的唯一标识，一般为主键列
    //showExport: true,
    exportDataType: 'all',
    responseHandler: responseHandler,
    columns: [{
        field: 'ALARM_DATE',
        title: '报警时间',
        align: 'center',
        valign: 'middle',
        formatter: function(val) {
            return moment(val).subtract(8, 'h').format('YYYY-MM-DD HH:mm:ss');
        }

    }, {
        field: 'ALARM_NO',
        title: '报警编号',
        align: 'center',
        valign: 'middle',

    }, {
        field: 'ALARM_MESSAGE',
        title: '报警内容',
        align: 'center',
        valign: 'middle'
    }]
});

function queryParams() {
    var data = {
        MAC_NBR: macSelect.rowData() == undefined ? mac[0].MAC_NBR : macSelect.rowData().MAC_NBR,
        START_TIME: moment($("#datetimepicker").val()).format('YYYY-MM-DD'),
        END_TIME: moment($("#datetimepicker").val()).add(1, 'days').format('YYYY-MM-DD')
    }

    return data
}

function responseHandler(data) {
    var arr = [];
    if (data.Status == 0) {
        arr = data.Data;
        $("#time>span").html(arr.length + '条');
    }
    return arr;
}

function refresh() {
    var p = {
        query: {
            MAC_NBR: macSelect.rowData() == undefined ? mac[0].MAC_NBR : macSelect.rowData().MAC_NBR
        }
    }
    $('#table').bootstrapTable('refresh', p)
}

$('#datetimepicker')
    .datetimepicker()
    .on('changeDate', function(ev) {
        refresh();
    });