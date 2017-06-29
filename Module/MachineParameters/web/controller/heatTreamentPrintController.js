 $(function() {
     //初始加载拿传递过来的参数判断炉子和分区
     var url = window.location.search;
     var str1 = url.substring(url.lastIndexOf('?') + 1, url.length);
     var str2 = str1.split('&');

     var qian = []; //保存属性
     var hou = []; //保存属性值
     for (var i = 0; i < str2.length; i++) {
         qian.push(str2[i].split('=')[0]);
         hou.push(str2[i].split('=')[1]);
     }
     var lutype = unescape(hou[0]);
     //  if (lutype == 0) { $("#LU_TYPE").html("A炉"); }
     //  if (lutype == 1) { $("#LU_TYPE").html("B炉"); }
     //  if (lutype == 2) { $("#LU_TYPE").html("C炉"); }
     //  if (lutype == 3) { $("#LU_TYPE").html("D炉"); }
     //  if (lutype == 4) { $("#LU_TYPE").html("E炉"); }

     //时间操作部分
     var date = new Date();
     var nowDate = date.getFullYear() + '-' +
         ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' +
         ((date.getDate()) < 10 ? ("0" + (date.getDate())) : (date.getDate()))
         //+ ' ' + nowDate.getHours() + ':' + nowDate.getMinutes() + ':' + nowDate.getSeconds();
     $("#startTime").val(nowDate);
     $("#endTime").val(nowDate); //设置默认时间为当前时间
     $("#startTime").datetimepicker({ minView: "month", language: 'zh-CN', format: "yyyy-mm-dd", todayBtn: true, autoclose: true });
     $("#endTime").datetimepicker({ minView: "month", language: 'zh-CN', format: "yyyy-mm-dd", todayBtn: true, autoclose: true });

     $.post('/HeatTreatment/Print', { mac_nbr: lutype }).then((data) => {
         if (data.Status == 0) {
             if (data.Data.length > 0) {
                 $('#YEILD').text(data.Data[0].YEILD);
                 $('#BATCH').text(data.Data[0].BATCH);
                 $('#MATERIAL').text(data.Data[0].MATERIAL);
             }

         }
     })

     //点击判断时间间隔并加载图表
     $("#toCharts").click(function() {
         var eDate = $("#endTime").val();
         var sDate = $("#startTime").val();
         if (+Date.parse(sDate) > +Date.parse(eDate)) {
             alert('开始时间不得大于结束时间!');
             return;
         }
         $.post('/HeatTreatment/PrintTemp', { Mac_nbr: lutype, StartDate: sDate, EndDate: eDate }, function(data) {
             if (data.StatusCode == 0) {
                 let result = {},
                     datalist = [];
                 for (let i = 0; i < data.Data.length; i++) {
                     if (data.Data[i] == 'null') {
                         datalist.push(null);
                     } else {
                         datalist.push(+data.Data[i]);
                     }
                 }
                 result.dataLength = data.Data.length;
                 result.pointInterval = 10000;
                 result.pointStart = +Date.parse(sDate);
                 result.Data = datalist;
                 drawLine(result, sDate);
             }


         })
     })
 })

 function drawLine(data, StartDate) {
     var start = +new Date();
     $('#container').highcharts('StockChart', {
         chart: {
             events: {
                 load: function() {
                     if (!window.isComparing) {
                         this.setTitle(null, {
                             text: '图表建立耗时 ' + (new Date() - start) + 'ms'
                         });
                     }
                 }
             },
             zoomType: 'x'
         },
         yAxis: {
             title: {
                 text: 'Temperature (°C)'
             }
         },
         title: {
             text: '历史温度曲线图'
         },
         credits: {
             enabled: false
         },
         rangeSelector: {
             buttonTheme: {
                 display: 'none' // 不显示按钮
             },
             selected: 1,
             inputEnabled: false // 不显示日期输入框
         },
         series: [{
             name: 'Temperature',
             data: data.Data,
             pointStart: moment(StartDate).format('X') * 1000 + 8 * 3600 * 1000,
             pointInterval: 10 * 1000,
             tooltip: {
                 valueDecimals: 1,
                 valueSuffix: '°C'
             }
         }]
     })
 }