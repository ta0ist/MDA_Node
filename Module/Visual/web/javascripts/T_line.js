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
               backgroundColor: '#081132',
               animation: Highcharts.svg, // don't animate in old IE
               marginRight: 10,
               events: {
                   load: function() {
                       // set up the updating of the chart each second
                       var series = this.series[0],
                           chart = this;
                       setInterval(function() {
                           var x = (new Date()).getTime(), // current time
                               y = Math.random();
                           series.addPoint([x, y], true, true);
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
                       color: '#fff'
                   }
               },
               lineColor: '#fff'
           },
           yAxis: {
               gridLineWidth: 0,
               labels: {
                   style: {
                       color: '#fff'
                   }
               },
               title: {
                   text: 'mm'
               },
               plotLines: [{
                   value: 0,
                   width: 1,
                   color: '#808080'
               }]
           },
           tooltip: {
               formatter: function() {
                   return '<b>' + '位置:' + '</b><br/>' +
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
                   var data = [],
                       time = (new Date()).getTime(),
                       i;
                   for (i = -19; i <= 0; i += 1) {
                       data.push({
                           x: time + i * 1000,
                           y: Math.random()
                       });
                   }
                   return data;
               }())
           }]
       }, function(c) {
           activeLastPointToolip(c)
       });
   }