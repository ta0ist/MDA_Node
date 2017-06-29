   Highcharts.setOptions({
       global: {
           useUTC: false
       }
   });

   function activeLastPointToolip(chart) {
       var points = chart.series[0].points;
       chart.tooltip.refresh(points[points.length - 1]);
   }

   function T_line(ele, title, Mac_nbr, data, time) {
       $('#' + ele).highcharts({
           chart: {
               type: 'spline',
               backgroundColor: '#fff',
               animation: Highcharts.svg, // don't animate in old IE
               marginRight: 10,
               events: {
                   load: function() {
                       // set up the updating of the chart each second
                       var series = this.series[0],
                           chart = this;
                       setInterval(function() {
                           $.post('/HeatTreatment/Line_Temp', { machineId: Mac_nbr }, function(result) {
                               var x = result.Data.Date, // current time
                                   y = result.Data.pv;
                               series.addPoint([x, y], true, true);
                           })
                           activeLastPointToolip(chart)
                       }, time);
                   }
               }
           },
           credits: {
               enabled: false
           },
           title: {
               text: ''
           },
           xAxis: {
               type: 'datetime',
               tickPixelInterval: 150,
               labels: {
                   style: {
                       color: '#000000'
                   }
               },
               lineColor: '#000'
           },
           yAxis: {
               gridLineWidth: 0,
               labels: {
                   style: {
                       color: '#000000'
                   }
               },
               title: {
                   text: 'Value'
               },
               plotLines: [{
                   value: 0,
                   width: 1,
                   color: '#808080'
               }]
           },
           tooltip: {
               formatter: function() {
                   return '<b>' + '温度值:' + '</b><br/>' +
                       (new Date(this.x)).toLocaleString() + '<br/>' +
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
               name: title,
               color: '#FFA500',
               data: (function() {
                   var result = [],
                       time = (new Date()).getTime(),
                       i;
                   //for (i ; i <= 0; i += 1) {
                   for (var i = data.length - 1; i >= 0; i -= 1) {
                       result.push({
                           //    x: parseInt(moment(data[i].STORAGE_DATE).format('X') * 1000) - 8 * 3600 * 1000,
                           //x: i,
                           x: time - i * 4000,
                           y: data[data.length - (i + 1)].PV
                       });
                   }
                   return result;
                   // generate an array of random data
                   //    $.post('/GetParaByHis', null, function() {

                   //    })
               }())
           }]
       }, function(c) {
           activeLastPointToolip(c)
       });
   }