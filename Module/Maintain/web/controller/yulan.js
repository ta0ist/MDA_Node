 var url = window.location.search;
 var str1 = url.substring(url.lastIndexOf('?') + 1, url.length);
 var str2 = str1.split('&');

 var qian = []; //保存属性
 var hou = []; //保存属性值
 for (var i = 0; i < str2.length; i++) {
     qian.push(str2[i].split('=')[0]);
     hou.push(str2[i].split('=')[1]);
 }

 $("#APPLAY_NO").html(unescape(hou[hou.length - 1]));

 $("#MAC_NO").html(unescape(hou[0]));
 $("#MAC_NAME").html(unescape(hou[1]));
 if (unescape(hou[2]) == 'null') {
     $("#REPORT_DATE").html('');
 } else {
     $("#REPORT_DATE").html(moment(unescape(hou[2])).format("YYYY-MM-DD HH:mm"));
 }
 if (unescape(hou[3]) == 'null') {
     $("#FINISH_DATE").html('');
 } else {
     $("#FINISH_DATE").html(moment(unescape(hou[3])).format("YYYY-MM-DD HH:mm"));
 }
 if (unescape(hou[4]) == 'null') {
     $("#APPLAY_DATE").html('');
 } else {
     $("#APPLAY_DATE").html(moment(unescape(hou[4])).format("YYYY-MM-DD HH:mm"));
 }
 $("#REPAIR_NAME").html(unescape(hou[5]));
 //$("#MEMO").kendoNumericTextBox({ format: "#.# \\￥", min: 0, value: unescape(hou[6]) });
 $("#MEMO").html(unescape(hou[6]) + "￥");
 $("#APP_MEMO").html(unescape(hou[7]));
 unescape(hou[8]) == "null" ? $("#PROCESS_METHOD").html() : $("#PROCESS_METHOD").html(unescape(hou[8]));
 var html = "</br>";

 var stockstr = unescape(hou[9]);
 var stockarr = stockstr.split('&');
 if (stockstr != "") {
     for (var i = 0; i < stockarr.length; i++) {
         var stockpart = stockarr[i].split(':');
         html = html + "名称：" + stockpart[0] + "--数量：" + stockpart[1] + "</br>";

     }
     $("#inoutStocks").html(html);
 }