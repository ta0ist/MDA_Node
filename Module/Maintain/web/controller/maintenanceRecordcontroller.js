 var grid, grid_1;
 var baseUrl = "/MaintenanceRecord/";
 var PEO_NBRS;
 var addviewModel;
 $(function() {
     var fields = {
         RECORD_NBR: { type: "string" },
         MAINTAIN_NO: { type: "string" },
         PLAN_NBR: { type: "string" },
         PROJECT_NAME: { type: "string" },
         MEM_NBR: { type: "string" },
         MEM_NAME: { type: "string" },
         MAINTAIN_STATE: { type: "string" },
         MEMO: { type: "string" },
         BEGIN_DATE: { type: "date" },
         END_DATE: { type: "date" },
         MAC_NO: { type: "string" },
         MAC_NAME: { type: "string" },
         SPECIFICATION: { type: "string" },
         CYCLE_TIME: { type: "number" },
         UNIT: { type: "string" }
     };
     var cols = [];
     cols.push({ field: "RECORD_NBR", title: "保养记录ID", width: 80, sortable: true, filterable: false, hidden: true });
     cols.push({
         field: "MAINTAIN_STATE",
         title: "保养状态",
         width: 90,
         sortable: true,
         filterable: {
             ui: MAINTAIN_STATE_Filter,
             extra: false
         },
         template: kendo.template($("#MAINTAIN_STATE").html())
     });
     cols.push({ field: "MAINTAIN_NO", title: "单号", width: 80, sortable: true, filterable: { extra: false } });
     //cols.push({
     //    field: "TAG", title: "标签", width: 80, template: kendo.template($("#MAINTAIN_NO_TAG").html()), sortable: false, filterable: false
     //});
     cols.push({ field: "PLAN_NBR", title: "保养计划编号", width: 80, sortable: true, filterable: false, hidden: true });
     cols.push({ field: "PROJECT_NAME", title: '保养项目名称', width: 100, sortable: true, filterable: { extra: false } });
     cols.push({ field: "MEM_NBR", title: "人员编号", width: 80, sortable: true, filterable: false, hidden: true });
     cols.push({ field: "MEM_NAME", title: '负责人', width: 80, sortable: true, filterable: { extra: false } });
     cols.push({ field: "BEGIN_DATE", title: '开始时间', width: 90, format: "{0: yyyy/MM/dd HH:mm:ss}", sortable: true, filterable: false });
     cols.push({ field: "END_DATE", title: '结束时间', width: 90, format: "{0: yyyy/MM/dd HH:mm:ss}", sortable: true, filterable: false });
     cols.push({ field: "MAC_NO", title: "设备编号", width: 80, sortable: true, filterable: false, hidden: true });
     cols.push({ field: "MAC_NAME", title: "设备名称", width: 60, sortable: true, filterable: false, hidden: false });
     cols.push({ field: "SPECIFICATION", title: '型号规格', width: 80, sortable: true, filterable: false, hidden: true });
     cols.push({ field: "CYCLE_TIME", title: '循环次数', width: 80, sortable: true, filterable: false, hidden: true });
     //cols.push({ field: "UNIT", title: "维保单位", width: 80, sortable: true, filterable: false });
     cols.push({ field: "DOCUMENT_PATH", title: "文件名", width: 130, sortable: true, filterable: false, template: kendo.template($("#DownLoadFile").html()) });
     cols.push({ field: "MEMO", title: '检查描述', width: 150, sortable: true, filterable: false });
     cols.push({ field: "MAINTAIN_STATE", title: '操作', width: 100, sortable: true, filterable: false, template: kendo.template($("#OPERATOR_MAINTAIN_STATE").html()) });

     //Grid
     grid = $("#grid").grid({
         checkBoxColumn: false,
         baseUrl: baseUrl, //调用的URL
         selectable: "single", //行选择方式
         scrollable: true,
         editable: false, //是否可编辑
         autoBind: true,
         //height: 300,
         resizeGridWidth: true, //列宽度可调
         isPage: true,
         customsearch: true,
         //server: true, //服务器端刷新，包括排序，筛选等
         actionUrl: ["GetAllMaintainRecoredList", "", "", "DelList"], //读、新增、更改、删除的URLaction
         custom: {
             PrimaryKey: "RECORD_NBR",
             fields: fields,
             cols: cols
         }
     })

     function koModel() {
         var self = this;
         self.order_edit = function() {
             //单号维护
             $.get("/MaintenanceRecord/GetRules", function(data) {
                 $.x5window('单号规则', kendo.template($("#order-template").html()));
                 previewModel = ko.mapping.fromJS({
                     PREFIX1: ko.observable(data.Data[3].PREFIX),
                     INFIX1: ko.observable(data.Data[3].INFIX),
                     SUFFIX1: ko.observable(data.Data[3].SUFFIX),
                     save: function(e) {
                         var data = [
                             { PREFIX: e.PREFIX1(), INFIX: e.INFIX1(), SUFFIX: e.SUFFIX1(), RULE_NBR: 4 }
                         ];
                         $.ajax({
                             url: "/MaintenanceRecord/UpdRules",
                             type: 'post',
                             data: JSON.stringify(data),
                             contentType: 'application/json',
                             success: function(data) {
                                 if (data.Status == 0) {
                                     $("#x5window").data("kendoWindow").close();
                                     BzSuccess(data.Message);
                                 } else {
                                     BzAlert(data.Message);
                                 }
                             }
                         })
                     }
                 });
                 ko.applyBindings(previewModel, document.getElementById("fixviewmodel"));
             });
         };
     }
     var u = new koModel();
     ko.applyBindings(u);

     $('#filter').bind('keypress', function(event) {
         if (event.keyCode == "13") {
             getDataByKeyWord();
         }
     });
 });

 function MAINTAIN_STATE_Filter(element) {
     element.kendoDropDownList({
         optionLabel: $.Translate("ServiceMaintain.Choose"),
         dataTextField: "name",
         dataValueField: "id",
         dataSource: [
             { name: $.Translate("ServiceMaintain.NoStart"), id: 0 },
             { name: $.Translate("ServiceMaintain.Process"), id: 1 },
             { name: $.Translate("ServiceMaintain.Finish"), id: 2 }
         ]
     });
 }

 function refreshGrid() {
     grid.grid("refresh", function() {
         return [];
     });
 }

 function getDataByKeyWord() { //关键字查询
     if ($("#filter").val() == "") {
         grid.grid("refresh", function() {
             return [];
         });
     } else {
         grid.grid("refresh", function() {
             return [
                 { field: "MAINTAIN_NO", Operator: "contains", value: $("#filter").val() }
             ];
         });
     }
 }

 function f_ok(e) {
     var gridDataSource = grid.data("bz-grid").ds.data();
     var dataItem;
     for (var i = 0; i < gridDataSource.length; i++) {
         if (gridDataSource[i].MAINTAIN_NO == e) {
             dataItem = gridDataSource[i];
         }
     }
     $.x5window('保养记录' + "[" + e + "]", kendo.template($("#in-template").html()));
     $("#BEGIN_DATE").kendoDateTimePicker({ format: "yyyy/MM/dd HH:mm:ss", value: dataItem.BEGIN_DATE });
     $("#END_DATE").kendoDateTimePicker({ format: "yyyy/MM/dd HH:mm:ss", value: new Date() });

     Inoutviewmodel = ko.mapping.fromJS({
         UNIT: ko.observable(""), //维保单位
         MEMO: ko.observable(""), //描述
         save: function(e) {
             //保存
             //1.保存保养记录内容
             //2.如果不需要入库,更新保养出库单为保养出库;
             //3.出入入库记录
             var maintainRecord = {
                 PLAN_NBR: dataItem.PLAN_NBR,
                 RECORD_NBR: dataItem.RECORD_NBR,
                 BEGIN_DATE: $("#BEGIN_DATE").val(),
                 END_DATE: $("#END_DATE").val(),
                 //UNIT:this.UNIT(),
                 MEMO: this.MEMO()
             }

             $.ajax({
                 url: "/MaintenanceRecord/ModifyMaintainRecord",
                 type: 'post',
                 data: JSON.stringify(maintainRecord),
                 contentType: 'application/json',
                 success: function(data) {
                     if (data.Status == 0) {
                         grid.grid("refresh", function() {
                             return [];
                         });
                         $("#x5window").data("kendoWindow").close();
                         BzSuccess(data.Message);
                     } else {
                         BzAlert(data.Message);
                     }
                 }
             })

         }
     });
     ko.applyBindings(Inoutviewmodel, document.getElementById("updateViewModel"));
 }

 function formatPrice(price) {
     return price = price.toFixed(2);
 }

 //上传文件
 function upload_file(e) {
     var gridDataSource = grid.data("bz-grid").ds.data();
     var maintainInfo;
     for (var i = 0; i < gridDataSource.length; i++) {
         if (gridDataSource[i].RECORD_NBR == "" + e + "") {
             maintainInfo = gridDataSource[i];
         }
     }
     //  var maintainInfo = this.dataItem($(e.currentTarget).closest("tr"));
     $.x5window("上传文件", kendo.template($("#UPLOAD_FILE").html()));
     $("#MAC_NO").html(maintainInfo.MAC_NAME);
     $("#MEM_NAME").html(maintainInfo.MEM_NAME);
     $("#PROJECT_NAME").html(maintainInfo.PROJECT_NAME);
     // repairInfo.REPORT_DATE = moment(maintainInfo.REPORT_DATE).format("YYYY-MM-DD HH:mm:ss");
     // var repairmodel = JSON.stringify(repairInfo);
     $("#up_file").click(function() {
         var RECORD_NBR = maintainInfo.RECORD_NBR;
         console.log(files_name.value)
         $.ajaxFileUpload({
             url: baseUrl + "UploadFile", //用于文件上传的服务器端请求地址
             type: "post",
             data: { "REPORT_NBR": RECORD_NBR }, //post 参数 {id:"1"} 不能传对象
             secureuri: false, //一般设置为false
             fileElementId: "files_name", //文件上传空间的id属性
             dataType: "json", //返回值类型 一般设置为json
             success: function(data) { //服务器成功响应处理函数
                 if (data.Status == 0) {
                     $("#x5window").data("kendoWindow").close();
                     grid.grid("refresh", function() {
                         return [];
                     });
                     BzSuccess(data.Message);
                 } else {
                     BzAlert(data.Message);
                 }
             },
             error: function(data) {
                 BzSuccess(data.Message);

             }
         });
     })
 }

 function downloadfile(e) {
     window.open(baseUrl + "DownLoad?filename=" + e);
 }



 jQuery.extend({
     createUploadIframe: function(id, uri) {
         //create frame
         var frameId = 'jUploadFrame' + id;
         var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
         if (window.ActiveXObject) {
             if (typeof uri == 'boolean') {
                 iframeHtml += ' src="' + 'javascript:false' + '"';

             } else if (typeof uri == 'string') {
                 iframeHtml += ' src="' + uri + '"';

             }
         }
         iframeHtml += ' />';
         jQuery(iframeHtml).appendTo(document.body);

         return jQuery('#' + frameId).get(0);
     },
     createUploadForm: function(id, fileElementId, data) {
         //create form	
         var formId = 'jUploadForm' + id;
         var fileId = 'jUploadFile' + id;
         var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
         if (data) {
             for (var i in data) {
                 jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
             }
         }
         var oldElement = jQuery('#' + fileElementId);
         var newElement = jQuery(oldElement).clone();
         jQuery(oldElement).attr('id', fileId);
         jQuery(oldElement).before(newElement);
         jQuery(oldElement).appendTo(form);



         //set attributes
         jQuery(form).css('position', 'absolute');
         jQuery(form).css('top', '-1200px');
         jQuery(form).css('left', '-1200px');
         jQuery(form).appendTo('body');
         return form;
     },

     ajaxFileUpload: function(s) {
         // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout		
         s = jQuery.extend({}, jQuery.ajaxSettings, s);
         var id = new Date().getTime()
         var form = jQuery.createUploadForm(id, s.fileElementId, (typeof(s.data) == 'undefined' ? false : s.data));
         var io = jQuery.createUploadIframe(id, s.secureuri);
         var frameId = 'jUploadFrame' + id;
         var formId = 'jUploadForm' + id;
         // Watch for a new set of requests
         if (s.global && !jQuery.active++) {
             jQuery.event.trigger("ajaxStart");
         }
         var requestDone = false;
         // Create the request object
         var xml = {}
         if (s.global)
             jQuery.event.trigger("ajaxSend", [xml, s]);
         // Wait for a response to come back
         var uploadCallback = function(isTimeout) {
                 var io = document.getElementById(frameId);
                 try {
                     if (io.contentWindow) {
                         xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerText : null;
                         xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;

                     } else if (io.contentDocument) {
                         xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerText : null;
                         xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
                     }
                 } catch (e) {
                     jQuery.handleError(s, xml, null, e);
                 }
                 if (xml || isTimeout == "timeout") {
                     requestDone = true;
                     var status;
                     try {
                         status = isTimeout != "timeout" ? "success" : "error";
                         // Make sure that the request was successful or notmodified
                         if (status != "error") {
                             //    s.success(data, status);
                             // alert(xml)
                             // process the data (runs the xml through httpData regardless of callback)
                             var data = jQuery.uploadHttpData(xml, s.dataType);
                             // If a local callback was specified, fire it and pass it the data
                             if (s.success)
                                 s.success(data, status);

                             // Fire the global callback
                             if (s.global)
                                 jQuery.event.trigger("ajaxSuccess", [xml, s]);
                         } else
                             jQuery.handleError(s, xml, status);
                     } catch (e) {
                         status = "error";
                         jQuery.handleError(s, xml, status, e);
                     }

                     // The request was completed
                     if (s.global)
                         jQuery.event.trigger("ajaxComplete", [xml, s]);

                     // Handle the global AJAX counter
                     if (s.global && !--jQuery.active)
                         jQuery.event.trigger("ajaxStop");

                     // Process result
                     if (s.complete)
                         s.complete(xml, status);

                     jQuery(io).unbind()

                     setTimeout(function() {
                         try {
                             jQuery(io).remove();
                             jQuery(form).remove();

                         } catch (e) {
                             jQuery.handleError(s, xml, null, e);
                         }

                     }, 100)

                     xml = null

                 }
             }
             // Timeout checker
         if (s.timeout > 0) {
             setTimeout(function() {
                 // Check to see if the request is still happening
                 if (!requestDone) uploadCallback("timeout");
             }, s.timeout);
         }
         try {

             var form = jQuery('#' + formId);
             jQuery(form).attr('action', s.url);
             jQuery(form).attr('method', 'POST');
             jQuery(form).attr('target', frameId);
             if (form.encoding) {
                 jQuery(form).attr('encoding', 'multipart/form-data');
             } else {
                 jQuery(form).attr('enctype', 'multipart/form-data');
             }
             jQuery(form).submit();

         } catch (e) {
             jQuery.handleError(s, xml, null, e);
         }

         jQuery('#' + frameId).load(uploadCallback);
         return { abort: function() {} };

     },

     uploadHttpData: function(r, type) {
         var data = !type;
         data = type == "xml" || data ? r.responseXML : r.responseText;
         // If the type is "script", eval it in global context
         if (type == "script")
             jQuery.globalEval(data);
         // Get the JavaScript object, if JSON is used.
         if (type == "json")
             data = JSON.parse(data);
         //eval("data = \"" + data + "\"");
         // evaluate scripts within html
         if (type == "html")
             jQuery("<div>").html(data).evalScripts();

         return data;
     },
     handleError: function(s, xhr, status, e) {
         // If a local callback was specified, fire it
         if (s.error) {
             s.error.call(s.context || s, xhr, status, e);
         }

         // Fire the global callback
         if (s.global) {
             (s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxError", [xhr, s, e]);
         }
     },
 })