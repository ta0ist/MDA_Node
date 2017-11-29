var baseUrl = '/DefectiveReport/';

var url = window.location.search;
var str1 = url.substring(url.lastIndexOf('?') + 1, url.length);
var str2 = str1.split('&');

var qian = []; //保存属性
var hou = []; //保存属性值
for (var i = 0; i < str2.length; i++) {
    qian.push(str2[i].split('=')[0]);
    hou.push(str2[i].split('=')[1]);
}
console.log(hou);
//数据回显
var value = { code: unescape(hou[1]), rect: true };
console.log(unescape(hou[1]));
var settings = {
    output: "css",
    bgColor: "white",
    color: "#000000",
    barWidth: 1,
    barHeight: 40
};
$(".LJBHTM").html("").show().barcode(value, "code128", settings);

var value_memo = { code: unescape(hou[7]), rect: true };
var settings_memo = {
    output: "css",
    bgColor: "white",
    color: "#000000",
    barWidth: 1,
    barHeight: 40
};
$(".ZJBHTM").html("").show().barcode(value_memo, "code128", settings_memo);

$('#GD_BH').html("aaaaa");
$("#MAC_NO").html($("#MAC_NO").html() + unescape(hou[0]).bold().fontsize(2));
//$('#PROD_NO').html(unescape(hou[1]).bold().fontsize(2));
$('#PROD_NO').html(unescape(hou[1]).bold().fontsize(2));
unescape(hou[2]) == 'null' ? "" : $('#PROD_NAME').html(unescape(hou[2]).bold().fontsize(2));
$('#INFERIOR_NUM').html(unescape(hou[3]).toString().bold().fontsize(2));
$('#TASK_NO').html(unescape(hou[4]).bold().fontsize(2));
$('#REPORT_DATE').html(unescape(hou[5]).bold().fontsize(2));
//$('#SUPPLIER').html(unescape(hou[6]).bold().fontsize(2));
unescape(hou[6]) == 'null' ? $('#SUPPLIER').html('') : $('#SUPPLIER').html(unescape(hou[6]).bold().fontsize(2));
unescape(hou[7]) == 'null' ? "" : $('#CAST_CODE').html(unescape(hou[7]).bold().fontsize(2));
//$('#CAST_NAME').html(unescape(hou[8]).bold().fontsize(2));
unescape(hou[8]) == 'null' ? $('#CAST_NAME').html('') : $('#CAST_NAME').html(unescape(hou[8]).bold().fontsize(2));
//$('#DESCRIBE').html($('#DESCRIBE').html() + unescape(hou[9]).bold().fontsize(2));
$('#REPORT_PERSON').html($('#REPORT_PERSON').html() + unescape(hou[10]).bold().fontsize(2));
$('#INSPECTOR').html($('#INSPECTOR').html() + unescape(hou[11]).bold().fontsize(2));
$('#PE_ENGINEER').html($('#PE_ENGINEER').html() + unescape(hou[12]).bold().fontsize(2));
$('#DISPOSITION_CONCLUSION').html($('#DISPOSITION_CONCLUSION').html() + unescape(hou[13]).bold().fontsize(2));
//$('#SCRAP_NUM').html($('#SCRAP_NUM').html() + unescape(hou[14]).toString().bold().fontsize(2));
unescape(hou[14]) == 'null' ? $('#SCRAP_NUM').html($('#SCRAP_NUM').html()) : $('#SCRAP_NUM').html($('#SCRAP_NUM').html() + unescape(hou[14]).toString().bold().fontsize(2));
//$('#REWORK_NUM').html($('#REWORK_NUM').html() + unescape(hou[15]).toString().bold().fontsize(2));
unescape(hou[15]) == 'null' ? $('#REWORK_NUM').html($('#REWORK_NUM').html()) : $('#REWORK_NUM').html($('#REWORK_NUM').html() + unescape(hou[15]).toString().bold().fontsize(2));
$('#QE_NEGINEER').html($('#QE_NEGINEER').html() + unescape(hou[16]).bold().fontsize(2));
//$('#REWORK_PROPOSAL').html($('#REWORK_PROPOSAL').html() + unescape(hou[17]).bold().fontsize(2));
unescape(hou[17]) == 'null' ? $('#REWORK_PROPOSAL').html($('#REWORK_PROPOSAL').html()) : $('#REWORK_PROPOSAL').html($('#REWORK_PROPOSAL').html() + unescape(hou[17]).bold().fontsize(2));
$('#MBR_IN_IT').html($('#MBR_IN_IT').html() + unescape(hou[18]).bold().fontsize(2));
//$('#REWORK_MACHINE').html($('#REWORK_MACHINE').html() + unescape(hou[19]).bold().fontsize(2));
unescape(hou[19]) == 'null' ? $('#REWORK_MACHINE').html($('#REWORK_MACHINE').html()) : $('#REWORK_MACHINE').html($('#REWORK_MACHINE').html() + unescape(hou[19]).bold().fontsize(2));
$('#PE_ENGINNER2').html($('#PE_ENGINNER2').html() + unescape(hou[12]).bold().fontsize(2));
//$('#REWORK_INSPECTION').html($('#REWORK_INSPECTION').html() + unescape(hou[20]).bold().fontsize(2));
unescape(hou[20]) == 'null' ? $('#REWORK_INSPECTION').html($('#REWORK_INSPECTION').html()) : $('#REWORK_INSPECTION').html($('#REWORK_INSPECTION').html() + unescape(hou[20]).bold().fontsize(2));
$('#MBR_OUT_IT').html($('#MBR_OUT_IT').html() + unescape(hou[21]).bold().fontsize(2));
$('#INSPECTOR2').html($('#INSPECTOR2').html() + unescape(hou[11]).bold().fontsize(2));
unescape(hou[22]) == 'null' ? $('#SCRAP_APPROVE').html($('#SCRAP_APPROVE').html()) : $('#SCRAP_APPROVE').html($('#SCRAP_APPROVE').html() + unescape(hou[22]).bold().fontsize(2));
unescape(hou[24]) == 'null' ? $('#MEMO').html($('#MEMO').html()) : $('#MEMO').html($('#MEMO').html() + unescape(hou[24]).bold().fontsize(2));
unescape(hou[25]) == 'null' ? $('#DR_SUPPLIER').html("") : $('#DR_SUPPLIER').html(unescape(hou[25]).bold().fontsize(2));

//回显次品原因
var selectedList = [];
$.post(baseUrl + "GetReportlogList", { reportnbr: parseInt((unescape(hou[hou.length - 3]))) }, function(datas) {
    if (datas.Status == 0) {
        for (var i = 0; i < datas.Data.length; i++) {
            selectedList.push(datas.Data[i].INFERIOR_NBR);
        }

        //获取次品原因
        $.get("/DefectiveReason/getReason", function(data) {
            if (data.Status == 0) {
                var html = '';
                for (var i = 0; i < data.Data.length; i++) {
                    html += '<div><input class="reason" type="checkbox" onclick="return false" value="' + data.Data[i].INFERIOR_NBR + '"><label for="" style="display:inline-block">' + data.Data[i].INFERIOR_NAME + '</label></div>';
                }
                $("#bhgms").append(html);
            }

            $('.reason').each(function() {
                for (var i = 0; i < selectedList.length; i++) {
                    if ($(this).val() == selectedList[i]) {
                        $(this).attr('checked', true);
                    }
                }
            })
        })
    }
})

//获取描述并转换成数组回显 htc:20170815
var yyfxArr = unescape(hou[9]).split(",");
$('.reasonfx').each(function() {
    for (var i = 0; i < yyfxArr.length; i++) {
        if ($(this).val() == yyfxArr[i]) {
            $(this).attr('checked', true);
        }
    }
})