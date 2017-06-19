   //打印
   $(".print").click(function() {
       var quType = $(this).parent().parent().children("span").html(); //获取当前打印对应的分区
       var luType = ""; //获取当前打印对应的炉子
       $("#sidebar ul li").each(function() {
               if ($(this).hasClass("dianji")) {
                   luType = $(this).text();
               }
           })
           //alert(luType + ":" + quType);
       $.get("/HeatTreatmentPrint", function(data) {
               console.log(data);
           })
           //    window.open("./MachineParameters/HeatTreatmentPrint/Index?QU_TYPE=" + escape(quType) + "&LU_TYPE=" + escape(luType));
   })

   $("#sidebar ul li").click(function() {
       var index = $(this).index();
       $("#sidebar ul li").eq(index).addClass("dianji").siblings().removeClass("dianji");
       //alert($(this).attr("id"))
       var lzid = $(this).attr("id");

       $("#content>div>span").each(function() {
           var val = $(this).html();
           var name = "";
           var type = 0;

           if (lzid == 1) {
               if (val == '一区') {
                   name = "A炉一区";
                   type = 1;
                   showCharts(type, name);
               }
               if (val == '二区') {
                   name = "A炉二区";
                   type = 2;
                   showCharts(type, name);
               }
               if (val == '三区') {
                   name = "A炉三区";
                   type = 3;
                   showCharts(type, name);
               }
               if (val == '四区') {
                   name = "A炉四区";
                   type = 4;
                   showCharts(type, name);
               }
           } else if (lzid == 2) {
               if (val == '一区') {
                   name = "B炉一区";
                   type = 1;
                   showCharts(type, name);
               }
               if (val == '二区') {
                   name = "B炉二区";
                   type = 2;
                   showCharts(type, name);
               }
               if (val == '三区') {
                   name = "B炉三区";
                   type = 3;
                   showCharts(type, name);
               }
               if (val == '四区') {
                   name = "B炉四区";
                   type = 4;
                   showCharts(type, name);
               }
           } else if (lzid == 3) {
               if (val == '一区') {
                   name = "C炉一区";
                   type = 1;
                   showCharts(type, name);
               }
               if (val == '二区') {
                   name = "C炉二区";
                   type = 2;
                   showCharts(type, name);
               }
               if (val == '三区') {
                   name = "C炉三区";
                   type = 3;
                   showCharts(type, name);
               }
               if (val == '四区') {
                   name = "C炉四区";
                   type = 4;
                   showCharts(type, name);
               }
           } else if (lzid == 4) {
               if (val == '一区') {
                   name = "D炉一区";
                   type = 1;
                   showCharts(type, name);
               }
               if (val == '二区') {
                   name = "D炉二区";
                   type = 2;
                   showCharts(type, name);
               }
               if (val == '三区') {
                   name = "D炉三区";
                   type = 3;
                   showCharts(type, name);
               }
               if (val == '四区') {
                   name = "D炉四区";
                   type = 4;
                   showCharts(type, name);
               }
           } else if (lzid == 5) {
               if (val == '一区') {
                   name = "E炉一区";
                   type = 1;
                   showCharts(type, name);
               }
               if (val == '二区') {
                   name = "E炉二区";
                   type = 2;
                   showCharts(type, name);
               }
               if (val == '三区') {
                   name = "E炉三区";
                   type = 3;
                   showCharts(type, name);
               }
               if (val == '四区') {
                   name = "E炉四区";
                   type = 4;
                   showCharts(type, name);
               }
           }
       })
   })

   //保存（判断当前保存属于哪个炉子下的哪个区的）
   $(".save").click(function() {
       var span = $(this).parent().parent().children("span").html();
       var ZM = "";
       $("#sidebar ul li").each(function() {
           if ($(this).hasClass("dianji")) {
               ZM = $(this).text();
           }
       })
       alert("我是 " + ZM + " 下的 " + span + " 下的保存");

       var bc = $(this).parent().parent().children(".grid_content").children(".left");
       var pv = bc.find(".PV_VALUE").val();
       var sv = bc.find(".SV_VALUE").val();
       var rclph = bc.find(".RCLPH").val();
       var count = bc.find(".COUNT").val();
       var cailiao = bc.find(".CAILIAO").val();

       var saveData = {
           PV_VALUE: pv,
           SV_VALUE: sv,
           RCL_NO: rclph,
           COUNT: count,
           MATERAIL: cailiao
       }
       console.log(saveData);
   })

   //初始加载各个区下的图表数据（炉子id可根据上面的方法获取）
   $("#content>div>span").each(function() {
       var val = $(this).html();
       var name = "";
       var type = 0;
       //var xAxisData = [];
       //var seriesData = [];

       if (val == "一区") {
           name = "A炉一区";
           type = 1;
           showCharts(type, name);
       } else if (val == "二区") {
           name = "A炉二区";
           type = 2;
           showCharts(type, name);
       } else if (val == "三区") {
           name = "A炉三区";
           type = 3;
           showCharts(type, name);
       } else if (val == "四区") {
           name = "A炉四区";
           type = 4;
           showCharts(type, name);
       }
   })

   //时间格式转换，本地电脑时间
   Highcharts.setOptions({
       global: {
           useUTC: false
       }
   });

   //获取数据，加载图表
   function showCharts(type, name) {
       $('#right' + type).highcharts({
           chart: {
               type: 'spline',
               animation: Highcharts.svg,
               marginRight: 10,
               events: {
                   load: function() {
                       var series = this.series[0];

                       var num = 0;
                       var yData = []; //y轴值，从后台动态获取温度值，做参数

                       var JSQ = setInterval(function() {
                           var x = (new Date()).getTime(),
                               y = 200 + Math.floor(Math.random() * 600);
                           series.addPoint([x, y], true, true);

                           //var x = (new Date()).getTime(),
                           //    y = yData[num];               //获取温度值的下一个值
                           //series.addPoint([x, y], true, true);
                           //num++;
                           //if (num > yData.length) {
                           //    clearInterval(JSQ);           //超过温度数组长度后停止图表加点
                           //}
                       }, 1000);
                   }
               }
           },
           title: {
               text: name + '状态图'
           },
           xAxis: {
               type: 'datetime',
               //tickPixelInterval: 150 //x轴分段，px值
               tickInterval: 1000 //x轴分段，间隔值，整数
           },
           yAxis: {
               title: {
                   text: 'PV值'
               },
               plotLines: [{
                   value: 0,
                   width: 1,
                   color: '#808080'
               }]
           },
           tooltip: {
               formatter: function() {
                   return '<b>' + this.series.name + '</b><br/>' +
                       Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                       Highcharts.numberFormat(this.y, 2);
               }
           },
           legend: {
               enabled: false
           },
           exporting: {
               enabled: false
           },
           series: [{
               name: 'PV值',
               data: (function() {
                   // generate an array of random data
                   var data = [],
                       time = (new Date()).getTime(),
                       i;
                   for (i = -10; i <= 0; i += 1) {
                       data.push({
                           x: time + i * 1000,
                           y: 200 + Math.floor(Math.random() * 600)
                       });
                   }
                   return data;
               }())
           }], //绑定图表数据
           credits: {
               enabled: false // 禁用版权信息
           }
       });
   }

   angular.module('app', []).controller('appCtrl', ['$scope', function($scope) {
       $scope.machinesItem = [];
       $.get("/MachineParameters/HeatTreatment/", "", function(data) {
           if (data.Status == 0) {

           }
       })
   }]);