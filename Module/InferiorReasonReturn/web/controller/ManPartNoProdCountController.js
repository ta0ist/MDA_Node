  var grid;
  var baseUrl = "/manPartNoProdCount/";
  var validator;
  var addviewModel; //定义1个队象
  /*********************************************初始化GRID****************************************************************/
  $(function() {
      var fields = {
          MAN_PART_PRO_COUNT_NBR: { type: "string" },
          PART_NO: { type: "string" },
          PROD_COUNT: { type: "string" },
          REPORT_MAN_DATE: { type: "Date" }
      };
      var cols = [];
      cols.push({ field: "MAN_PART_PRO_COUNT_NBR", title: "", width: 80, sortable: true, filterable: false, hidden: true });
      cols.push({ field: "PART_NO", title: '零件号', width: 80, sortable: true, filterable: false });
      cols.push({ field: "PROD_COUNT", title: '产量', width: 80, sortable: true, filterable: false });
      cols.push({ field: "REPORT_MAN_DATE", title: '反馈日期', width: 80, format: "{0: yyyy-MM-dd}", sortable: true, filterable: false });
      cols.push({
          command: [
              { name: "aa", text: '编辑' + '<i class="icon-edit"></i>', className: "btn purple", click: f_edit },
              { name: "bb", text: '删除' + '<i class="icon-remove-sign"></i>', className: "btn red ", click: f_delete }
          ],
          title: '操作',
          width: 200
      });
      //Grid
      grid = $("#grid").grid({
          checkBoxColumn: true,
          baseUrl: baseUrl, //调用的URL
          selectable: "single", //行选择方式
          //sort: [{ field: "USER_NBR", dir: "ASC" }],
          scrollable: true,
          editable: false, //是否可编辑
          autoBind: false,
          resizeGridWidth: true, //列宽度可调
          isPage: true,
          customsearch: true,
          //detailTemplate: kendo.template($("#detail-template").html()),
          //server: true, //服务器端刷新，包括排序，筛选等
          actionUrl: ["getManPartProdCountInitList", "", "", "DelList"], //读、新增、更改、删除的URLaction
          custom: {
              PrimaryKey: "MAN_PART_PRO_COUNT_NBR",
              fields: fields,
              cols: cols
          }
      });
      $("#contextPage").resize(function() {
          grid.data("bz-grid").resizeGridWidth();
      });
      /***************************************************************************************************************/

      /**********************************grid意外的新增，删除，更新按钮**********************************************************/
      function koModel() {
          var self = this;
          /****************************grid insert delete modify select ****************************************/
          self.grid_add = function(e) {
              $.x5window('新增', kendo.template($("#popup-add").html()));
              addOrEdit(); //新增
          };
          self.grid_delete = function() {
              BzConfirm('删除', function(e) {
                  if (e) {
                      var dd = grid.data("bz-grid").checkedDataRows();
                      var li = [];
                      for (var i = 0; i < dd.length; i++) {
                          li.push(dd[i].MAN_PART_PRO_COUNT_NBR);
                      }
                      $.post(baseUrl + "DeleteManPartProdCount", { li: li }, function(data) {

                          refreshGrid();
                          BzSuccess('操作成功！');


                      });
                  }
              });
          };
      }
      /*********************************************************************************************************************************/
      var u = new koModel();
      ko.applyBindings(u);
      //getDataByKeyWord();//点击菜单加载
      grid.grid("refresh", function() {

          return [
              { field: "keyword", Operator: "eq", Keywords: $("#filter").val() }
          ];
      });
      $('#filter').bind('keypress', function(event) {
          if (event.keyCode == "13") {
              //getDataByKeyWord();
              grid.grid("refresh", function() {
                  return [
                      { field: "keyword", Operator: "eq", Keywords: $("#filter").val() }
                  ];
              });
          }
      });
      $("#search").click(function() {
          grid.grid("refresh", function() {
              return [
                  { field: "PART_NO", Operator: "contains", Keywords: $("#filter").val(), flag: "false" },
              ];
          });
      })
  });

  function addOrEdit(dataItem) {
      //A0025958
      //验证
      validator = $("#machineviewmodel").validate({
          rules: {
              MAC_NO: { required: true },
              MAC_NAME: { required: true }
          },
          messages: {
              MAC_NO: { required: '内容不能为空' },
              MAC_NAME: { required: '内容不能为空' }
          }
      });
      addviewModel = ko.mapping.fromJS({
          PART_NO: ko.observable(dataItem == undefined ? "" : dataItem.PART_NO),
          PROD_COUNT: ko.observable(dataItem == undefined ? "" : dataItem.PROD_COUNT),
          MAN_PART_PRO_COUNT_NBR: ko.observable(dataItem == undefined ? "" : dataItem.MAN_PART_PRO_COUNT_NBR),
          galleryshow: function(e) {
              if ($("#Gallery").is(":hidden")) {
                  $("#Gallery").show();
              } else {
                  $("#Gallery").hide();
              }
          },
          save: function(e) {
              if (validator.form()) {
                  //var treeobj = $("#orgnizetree").data("kendoTreeView");
                  //var selectedNode = treeobj.select();
                  var data = {
                      PART_NO: e.PART_NO(), //$("#PART_NO").val(),                         
                      PROD_COUNT: e.PROD_COUNT(),
                      MAN_PART_PRO_COUNT_NBR: e.MAN_PART_PRO_COUNT_NBR()
                  }
                  if (dataItem == undefined) { //新增
                      $.post(baseUrl + "AddManPartProdCount", data, function(data) {

                          $("#x5window").data("kendoWindow").close();
                          refreshGrid();
                          BzSuccess('操作成功！');

                      });
                  } else {
                      $.post(baseUrl + "UpdateManPartProdCount", data, function(data) {

                          $("#x5window").data("kendoWindow").close();
                          refreshGrid();
                          BzSuccess('操作成功！');

                      });
                  }
              }
          }
      });
      ko.applyBindings(addviewModel, document.getElementById("machineviewmodel"));
      $.get("/manPartNoProdCount/GetAllPartNoList", function(data) {

          var defat_value = "";
          // if (dataItem)
          var comboxData = [];
          for (var i = 0; i < data.Data.length; i++) {
              var obj = {};
              obj.text = data.Data[i];
              obj.value = data.Data[i];
              comboxData.push(obj);
          }
          //if (dataItem == undefined) {
          //    defat_value = data.Data[0];
          //}
          //else {
          //    defat_value = dataItem.PART_NO;

          //}
          $("#PART_NO").kendoComboBox({
              dataTextField: "text",
              dataValueField: "value",
              dataSource: comboxData,
              value: data.Data[0]
          }).data("kendoComboBox").value(dataItem == undefined ? '请选择零件号' : dataItem.PART_NO);

      });


      $("#PROD_COUNT").kendoNumericTextBox({ format: "n0", min: 0, value: dataItem == undefined ? 0 : dataItem.PROD_COUNT });

  }

  function refreshGrid() {
      if ($("#filter").val() == "") {
          grid.grid("refresh", function() {
              return [
                  { field: "keyword", Operator: "eq", Keywords: "" }
              ];
          });
      } else {
          getDataByKeyWord();
      }
  }

  function getDataByKeyWord() { //关键字查询
      var ds = grid.data("bz-grid").ds;
      var parm = {
          page: ds._page,
          pageSize: ds._pageSize,
          keyword: $("#filter").val()
              // userType: parseInt($('.nav-tabs li[class="active"]').attr("value"))
      }
      $.post(baseUrl + "getManPartProdCountList", { page: parm.page, pageSize: parm.pageSize, Keywords: $("#filter").val(), take: 0, skip: 0, sort: [] }, function(data) {
          //{take: 10, skip: 0, page: 1, pageSize: 10, sort: []}

          var dd = [];
          for (var i = 0; i < data.Data.length; i++) {
              data.Data[i].REPORT_MAN_DATE = moment(data.Data[i].REPORT_MAN_DATE).format("YYYY-MM-DD");
          }
          grid.data("bz-grid").ds.data(data.Data);

          //grid.refreshGrid();

      });
  }
  //编辑弹出窗口
  function f_edit(e) {
      $.x5window('编辑', kendo.template($("#popup-add").html()));
      var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
      addOrEdit(dataItem); //编辑
  }

  function f_delete(e) {
      var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
      BzConfirm('删除数据', function(e) {
          if (e) {
              var data = {
                  li: [dataItem.MAN_PART_PRO_COUNT_NBR]
              }
              $.post(baseUrl + "DeleteManPartProdCount", data, function(data) {

                  refreshGrid();
                  BzSuccess('操作成功！');

              });
          }
      });
  }