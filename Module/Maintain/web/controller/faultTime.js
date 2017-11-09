 var groupOrMachine;
 var Chart;
 var baseUrl = "/FaultTime/",
     url;
 $(function() {
     $("#startTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
     $("#endTime").kendoDatePicker({ format: "yyyy/MM/dd", value: new Date() });
     MAC_NBRS = $("#MAC_NBR").multipleComboxTree({
         url: "/Alarm/GetAllMachineAndMachineGroup",
         url2: "/Alarm/GetKeywordMachinelist",
         type: 2,
         data: {
             GroupId: 0
         },
         checkbox: true
     }).data("BZ-multipleComboxTree");
     $("#search").click(function(e) {
         if ($('input[name="searchType"]:checked').val() == 1) { //故障时间
             url = "GetFaultData";
         } else { //维修时间
             url = "GetRepairData";
         }
         var machines = [];
         for (var m in MAC_NBRS.dataAarry) {
             machines.push(parseInt(m));
         }
         if (machines.length == 0) {
             BzAlert("请选择设备");
             return;
         }

         try {
             Chart.destroy();
         } catch (e) {}

         var data = {
             machineIds: machines,
             startTime: $("#startTime").val(),
             endTime: $("#endTime").val(),
             Search: 3
         };
         var categories = [
             "一月",
             "二月",
             "三月",
             "四月",
             "五月",
             "六月",
             "七月",
             "八月",
             "九月",
             "十月",
             "十一月",
             "十二月"
         ];
         $.ajax({
             url: baseUrl + url,
             type: 'post',
             data: JSON.stringify(data),
             contentType: 'application/json',
             success: function(data) {
                 var ydata = [];
                 var dataSource = [],
                     dataSource1 = [];
                 if (data.Status == 0) {
                     for (var i = 0; i < 12; i++) {
                         var ss = _.where(data.Data, { Months: i + 1 });
                         dataSource.push(ss.length == 0 ? 0 : parseFloat((ss[0].MalfunctionValue / 3600).toFixed(2)));
                         dataSource1.push($("#LINE").val() == "" ? 0 : parseInt($("#LINE").val()));
                     }
                     var tjson = {};
                     tjson.type = "column";
                     $('input[name="searchType"]:checked').val() == 1 ? tjson.name = "设备总故障时间(h)" : tjson.name = "设备总维修时间(h)"
                         //tjson.name = $.Translate("TpmChart.ALLMTBF")
                     tjson.data = dataSource;
                     var tjson1 = {};
                     tjson1.type = "spline";
                     tjson1.name = "基准线";
                     tjson1.data = dataSource1;
                     ydata.push(tjson);
                     ydata.push(tjson1);
                     var par = {
                         type: "column",
                         xdata: categories,
                         ydata: ydata,
                         stacking: true,
                         subtitle: ""
                     }
                     drawHisChart(par);
                 }
             }
         })

         //  $.post(baseUrl + url, JSON.stringify(data), function(data) {
         //      var ydata = [];
         //      var dataSource = [],
         //          dataSource1 = [];
         //      if (data.Status == 0) {
         //          for (var i = 0; i < 12; i++) {
         //              var ss = _.where(data.Data, { Months: i + 1 });
         //              dataSource.push(ss.length == 0 ? 0 : parseFloat((ss[0].MalfunctionValue / 3600).toFixed(2)));
         //              dataSource1.push($("#LINE").val() == "" ? 0 : parseInt($("#LINE").val()));
         //          }
         //          var tjson = {};
         //          tjson.type = "column";
         //          $('input[name="searchType"]:checked').val() == 1 ? tjson.name = "设备总故障时间(h)" : tjson.name = "设备总维修时间(h)"
         //              //tjson.name = $.Translate("TpmChart.ALLMTBF")
         //          tjson.data = dataSource;
         //          var tjson1 = {};
         //          tjson1.type = "spline";
         //          tjson1.name = "基准线";
         //          tjson1.data = dataSource1;
         //          ydata.push(tjson);
         //          ydata.push(tjson1);
         //          var par = {
         //              type: "column",
         //              xdata: categories,
         //              ydata: ydata,
         //              stacking: true,
         //              subtitle: ""
         //          }
         //          drawHisChart(par);
         //      }
         //  });
     });
 });

 function drawHisChart(data) {
     Chart = $("#hisChart").CombinationChart({
         title: $('input[name="searchType"]:checked').val() == 1 ? "设备总故障时间(h)" : "设备总维修时间(h)",
         subtitle: data.subtitle == undefined ? "" : data.subtitle,
         categories: data.xdata == undefined ? [] : data.xdata,
         dataSource: data.ydata == undefined ? [] : data.ydata,
         stacking: data.stacking == true ? "normal" : null
     }).data("BZ-CombinationChart");
 }