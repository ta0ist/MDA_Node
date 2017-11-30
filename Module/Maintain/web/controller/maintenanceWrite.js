var grid, grid_1;
var baseUrl = "/MaintenanceWrite/";
var PEO_NBRS;
var addviewModel;
$(function() {
    var fields = {
        REPAIR_NBR: { type: "string" },
        APPLAY_NBR: { type: "string" },
        APPLAY_DATE: { type: "date" },
        APPLAY_NO: { type: "string" },
        MEM_NBR: { type: "string" },
        MAC_NAME: { type: "string" },
        DEGREE: { type: "string" },
        REPAIR_UNIT: { type: "string" },
        REPORT_DATE: { type: "date" },
        FINISH_DATE: { type: "date" },
        TEST_OUT_DATE: { type: "date" },
        BORROW_DATE: { type: "date" },
        RECEIVE_DATE: { type: "date" },
        REPAIR_TIMESPAN: { type: "double" },
        MEMO: { type: "string" },
        PROCESS_METHOD: { type: "string" },
        PREVENTIVE_MEASURE: { type: "string" },
        EVALUATION: { type: "string" },
        APP_MEMO: { type: "string" }
    };
    var cols = [];
    cols.push({
        field: "REPAIR_STATE",
        title: '维修状态',
        width: 80,
        sortable: true,
        filterable: {
            ui: REPAIR_STATE_Filter,
            extra: false
        },
        template: kendo.template($("#REPAIR_STATE").html())
    });
    cols.push({ field: "APPLAY_NBR", title: "申请ID", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "REPAIR_NBR", title: "维修报告ID", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "APPLAY_NBR", title: "维修申请单ID", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "APPLAY_NO", title: '申请单号', width: 90, sortable: true, filterable: { extra: false } });
    cols.push({ field: "TAG_LIST", title: '标签', width: 80, template: kendo.template($("#TAG_LIST").html()), sortable: false, filterable: false });
    cols.push({ field: "MEM_NBR", title: "维修人员ID", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "MAC_NAME", title: '设备号', width: 80, sortable: true, filterable: false });
    cols.push({ field: "REPAIR_NAME", title: '维修人员', width: 80, sortable: true, filterable: false });
    //cols.push({ field: "DEGREE", title: $.Translate("ServiceMaintain.Repair_Level"), width: 80, sortable: true, filterable: false, template: kendo.template($("#DEGREE").html()) });
    cols.push({ field: "APPLAY_DATE", title: "申请日期", width: 90, sortable: true, format: "{0: yyyy/MM/dd HH:mm:ss}", filterable: false });
    cols.push({ field: "REPORT_DATE", title: "开始日期", width: 90, sortable: true, format: "{0: yyyy/MM/dd HH:mm:ss}", filterable: false });
    cols.push({ field: "FINISH_DATE", title: "结束日期", width: 90, sortable: true, format: "{0: yyyy/MM/dd HH:mm:ss}", filterable: false });
    cols.push({ field: "DOCUMENT_PATH", title: "文件名", width: 170, sortable: true, filterable: false, template: kendo.template($("#DownLoadFile").html()) });
    //cols.push({ field: "IS_COMPROMISE", title: "是否让步", width: 80, sortable: true, filterable: false });
    cols.push({ field: "REPAIR_TIMESPAN", title: '维修用时', template: '#: parseFloat((REPAIR_TIMESPAN/3600).toFixed(2)) #h', width: 80, sortable: true, filterable: false });
    cols.push({ field: "REPAIR_STATE", title: '操作', width: 100, sortable: true, filterable: false, template: kendo.template($("#OPERATOR_REPAIR_STATE").html()) });
    cols.push({
        command: [
            { name: "aa", text: "上传文件" + '', className: "btn green ", click: upload_file }
        ],
        title: '上传文件',
        width: 100
    });

    //Grid
    grid = $("#grid").grid({
        checkBoxColumn: false,
        baseUrl: baseUrl, //调用的URL
        selectable: "single", //行选择方式
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: ($.getparam("id") != null) ? false : true,
        resizeGridWidth: true, //列宽度可调
        isPage: true,
        customsearch: true,
        actionUrl: ["GetRepairs", "", "", "DelList"], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "REPAIR_NBR",
            fields: fields,
            cols: cols
        },
        dataBound: function() {
            $(".badge").hover(function() {
                $(this).find(".k-delete").show();
            }, function() {
                $(this).find(".k-delete").hide();
            });
        }
    });

    function koModel() {
        var self = this;
        self.MACS = ko.observableArray([]);
        self.order_edit = function() {
            //单号维护
            $.get("/MaintenanceRequest/GetRules", function(data) {
                $.x5window("单号规则", kendo.template($("#order-template").html()));
                previewModel = ko.mapping.fromJS({
                    PREFIX1: ko.observable(data.Data[2].PREFIX),
                    INFIX1: ko.observable(data.Data[2].INFIX),
                    SUFFIX1: ko.observable(data.Data[2].SUFFIX),
                    save: function(e) {
                        var data = [
                            { PREFIX: e.PREFIX1(), INFIX: e.INFIX1(), SUFFIX: e.SUFFIX1(), RULE_NBR: 3 }
                        ];

                        $.ajax({
                                url: '/MaintenanceRequest/UpdRules',
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
                            //  $.post("/MaintenanceRequest/UpdRules", JSON.stringify(data), function(data) {
                            //      if (data.Status == 0) {
                            //          $("#x5window").data("kendoWindow").close();
                            //          BzSuccess(data.Message);
                            //      } else {
                            //          BzAlert(data.Message);
                            //      }
                            //  });
                    }
                });
                ko.applyBindings(previewModel, document.getElementById("fixviewmodel"));
            });
        };
        self.tree_refresh = function() {
            getTreeData("refresh");
        };
        self.grid_add = function(e) {
            $.x5window("新增", kendo.template($("#popup-add").html()));
            addOrEdit(); //新增
        };
    }
    var u = new koModel();
    ko.applyBindings(u);

    $('#filter').bind('keypress', function(event) {
        if (event.keyCode == "13") {
            getDataByKeyWord();
        }
    });

    if ($.getparam("id") != null) {
        grid.grid("refresh", function() {
            return [
                { field: "REPAIR_NBR", Operator: "eq", value: $.getparam("id") }
            ];
        });
    }
});

function REPAIR_STATE_Filter(element) {
    element.kendoDropDownList({
        optionLabel: '--选择--',
        dataTextField: "name",
        dataValueField: "id",
        dataSource: [
            { name: '未开始', id: 0 },
            { name: '进行中', id: 1 },
            { name: '完成', id: 2 }
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
                { field: "APPLAY_NO", Operator: "contains", value: $("#filter").val() }
            ];
        });
    }
}

function f_ok(e) {
    var gridDataSource = grid.data("bz-grid").ds.data();
    var dataItem;
    for (var i = 0; i < gridDataSource.length; i++) {
        if (gridDataSource[i].APPLAY_NO == e) {
            dataItem = gridDataSource[i];
        }
    }
    $.x5window('维修记录' + "[" + e + "]", kendo.template($("#in-template").html()));
    $("#REPAIR_TIMESPAN").kendoNumericTextBox({ format: "#.# \\h", min: 0, value: 0 });
    Inoutviewmodel = ko.mapping.fromJS({
        REPAIR_UNIT: ko.observable(""),
        MEMO: ko.observable(""),
        PROCESS_METHOD: ko.observable(""),
        PREVENTIVE_MEASURE: ko.observable(""),
        save: function(e) {
            var maintainRecord = {
                APPLAY_NBR: dataItem.APPLAY_NBR,
                REPAIR_NBR: dataItem.REPAIR_NBR,
                REPAIR_UNIT: this.REPAIR_UNIT(),
                MEMO: this.MEMO(),
                PROCESS_METHOD: this.PROCESS_METHOD(),
                PREVENTIVE_MEASURE: this.PREVENTIVE_MEASURE(),
                REPAIR_TIMESPAN: $("#REPAIR_TIMESPAN").data("kendoNumericTextBox").value() * 3600
            }
            console.log(maintainRecord)
            $.ajax({
                url: baseUrl + "UpdRepair",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(maintainRecord),
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

            // $.post(baseUrl + "UpdRepair", maintainRecord, function(data) {
            //     if (data.Status == 0) {
            //         grid.grid("refresh", function() {
            //             return [];
            //         });
            //         $("#x5window").data("kendoWindow").close();
            //         BzSuccess(data.Message);
            //     } else {
            //         BzAlert(data.Message);
            //     }
            // });
        }
    });
    ko.applyBindings(Inoutviewmodel, document.getElementById("updateViewModel"));
}

//预览(跳转打印) htc:170503
function f_yulan() {
    var gridDataSource = grid.data("bz-grid").ds.data();
    var dataItem;
    for (var i = 0; i < gridDataSource.length; i++) {
        if (gridDataSource[i].APPLAY_NO == applyno) {
            dataItem = gridDataSource[i];
        }
    }
    var stockstr = "";
    for (var i = 0; i < dataItem.inoutStocks.length; i++) {
        stockstr += dataItem.inoutStocks[i].PART_NAME + ":" + dataItem.inoutStocks[i].PART_COUNT + "&";
    }
    if (stockstr.length > 1) {
        stockstr = stockstr.substring(0, stockstr.length - 1);
    }

    window.open("/MaintenanceWrite/yulan?MAC_NO=" + escape(dataItem.MAC_NO) + "&MAC_NAME=" + escape(dataItem.MAC_NAME) + "&REPORT_DATE=" + escape(dataItem.REPORT_DATE) +
        "&FINISH_DATE=" + escape(dataItem.FINISH_DATE) + "&APPLAY_DATE=" + escape(dataItem.APPLAY_DATE) +
        "&REPAIR_NAME=" + escape(dataItem.REPAIR_NAME) + "&MEMO=" + escape(dataItem.MEMO) + "&APP_MEMO=" + escape(dataItem.APP_MEMO) +
        "&PROCESS_METHOD=" + escape(dataItem.PROCESS_METHOD) + "&inoutStocks=" + escape(stockstr) + "&APPLAY_NO=" + escape(dataItem.APPLAY_NO));
}

//报告单
var applyno = '';

function f_complete(e) {
    var gridDataSource = grid.data("bz-grid").ds.data();
    var dataItem;
    for (var i = 0; i < gridDataSource.length; i++) {
        if (gridDataSource[i].APPLAY_NO == e) {
            dataItem = gridDataSource[i];
        }
    }
    applyno = e;

    $.x5window("维修报告单", kendo.template($("#REPAIR_EDIT-template_spsk").html()));
    $("#MEMO").kendoNumericTextBox({ format: "#.# \\￥", min: 0, value: dataItem.MEMO });

    PEO_NBRS = $("#MEM_NBR").comboxTree({
        url: "/Common/MemberManage/GetAllMemberAndMemberGroup",
        data: { groupID: 0 },
        treetemplate: $("#treeview-template_out").html(),
        width: 175,
        diffwidth: 36,
        type: 4,
        url2: "/Common/MemberManage/GetKeywordMemberlist"
    }).data("BZ-comboxTree");
    viewreport(dataItem);
    InOutviewmodel = ko.mapping.fromJS({
        PROCESS_METHOD: ko.observable(dataItem.PROCESS_METHOD),
        saves: function(e) {
            dataItem.PROCESS_METHOD = $("#PROCESS_METHOD").val(),
                dataItem.MEMO = $("#MEMO").val();
            $.ajax({
                    url: baseUrl + "UpdRepair",
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(dataItem),
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
                // $.post(baseUrl + "UpdRepair", JSON.stringify(dataItem), function(data) {
                //     if (data.Status == 0) {
                //         grid.grid("refresh", function() {
                //             return [];
                //         });
                //         $("#x5window").data("kendoWindow").close();
                //         BzSuccess(data.Message);
                //     } else {
                //         BzAlert(data.Message);
                //     }
                // });
        }
    });
    ko.applyBindings(InOutviewmodel, document.getElementById("maintainviewmodels"));
}

//预览模式
//function f_view(e) {
//    var gridDataSource = grid.data("bz-grid").ds.data();
//    var dataItem;
//    for (var i = 0; i < gridDataSource.length; i++) {
//        if (gridDataSource[i].APPLAY_NO == e) {
//            dataItem = gridDataSource[i];
//        }
//    }
//    $.x5window("浙江吉利动力总成有限公司", kendo.template($("#REPAIR_RECODE_template").html()));
//    viewreport(dataItem);
//}

//上传文件
function upload_file(e) {
    var repairInfo = this.dataItem($(e.currentTarget).closest("tr"));
    $.x5window("上传文件", kendo.template($("#UPLOAD_FILE").html()));
    $("#MAC_NO").html(repairInfo.MAC_NO);
    $("#REPAIR_NAME").html(repairInfo.REPAIR_NAME);
    repairInfo.REPORT_DATE = moment(repairInfo.REPORT_DATE).format("YYYY-MM-DD HH:mm:ss");
    var repairmodel = JSON.stringify(repairInfo);
    $("#up_file").click(function(repairmodel) {
        $.ajaxFileUpload({
            url: baseUrl + "UploadFile", //用于文件上传的服务器端请求地址
            type: "get",
            data: { RepairNbr: repairInfo.REPAIR_NBR }, //post 参数 {id:"1"} 不能传对象
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

function formatPrice(price) {
    return price = price.toFixed(2);
}

function addTag(e, b) {
    var gridDataSource = grid.data("bz-grid").ds.data();
    var dataItem;
    for (var i = 0; i < gridDataSource.length; i++) {
        if (gridDataSource[i].REPAIR_NBR == e) {
            dataItem = gridDataSource[i];
        }
    }
    var obj = $(b).data("BZ-editer");
    if (obj == undefined) {
        $(b).editer({
            url: baseUrl + "AddTag",
            title: $.Translate("Common.INPUT_NAME"),
            Ok: function(name) {
                this.close();
                //参数:TagName  TagParamterId
                var pdata = {
                    TagId: 2,
                    TagName: name,
                    TagParamterId: dataItem.REPAIR_NBR,
                    TagTittle: dataItem.APPLAY_NO,
                    TagUrl: baseUrl + "IndexRecord"
                }
                $.post("/Document/DocumentManage/AddTag", JSON.stringify(pdata), function(data) {
                    if (data.Status == 0) {
                        grid.grid("refresh", function() {
                            return [];
                        });
                        BzSuccess(data.Message);
                    } else {
                        BzAlert(data.Message);
                    }
                });
            }
        });
    }
}

function removeTag(e, b) {
    var gridDataSource = grid.data("bz-grid").ds.data();
    var dataItem;
    for (var i = 0; i < gridDataSource.length; i++) {
        if (gridDataSource[i].REPAIR_NBR == e) {
            dataItem = gridDataSource[i];
        }
    }
    var data = {
        TagId: 2,
        TagName: $(b).prev().text(),
        TagParamterId: dataItem.REPAIR_NBR
    }
    $.post("/Document/DocumentManage/DeleteOnlyTag", JSON.stringify(data), function(data) {
        if (data.Status == 0) {
            grid.grid("refresh", function() {
                return [];
            });
            BzSuccess(data.Message);
        } else {
            BzAlert(data.Message);
        }
    });
}

//预览数据
function viewreport(item) {
    $("#APPLAY_NO").html(item.APPLAY_NO);
    $("#MAC_NAME").html(item.MAC_NAME);
    $("#MAC_NO").html(item.MAC_NO);
    $("#APP_MEMO").html(item.APP_MEMO);
    $("#REPAIR_NAME").html(item.REPAIR_NAME);
    $("#REPORT_DATE").html(moment(item.REPORT_DATE).format("YYYY-MM-DD HH:mm"));
    $("#APPLAY_DATE").html(moment(item.APPLAY_DATE).format("YYYY-MM-DD HH:mm"));
    $("#PROCESS_METHOD").html(item.PROCESS_METHOD);
    if (item.REPAIR_TIMESPAN != null)
        $("#MAC_NO").html(item.MAC_NAME);
    if (item.MEMO != null)
        $("#RE_MEMO").html(item.MEMO);
    if (item.PREVENTIVE_MEASURE != null)
        $("#PREVENTIVE_MEASURE").html(item.PREVENTIVE_MEASURE);
    if (item.FINISH_DATE != null)
        $("#FINISH_DATE").html(moment(item.FINISH_DATE).format("YYYY-MM-DD HH:mm"));
    if (item.REPAIR_TIMESPAN != null)
        $("#REPAIR_TIMESPAN").html(item.REPAIR_TIMESPAN / 3600);
    if (item.EVALUATION != null)
        $("#EVALUATION").html(item.EVALUATION);
    if (item.CUT_TEST_DATE != null)
        $("#CUT_TEST_DATE").html(moment(item.CUT_TEST_DATE).format("YYYY-MM-DD HH:mm"));
    if (item.TEST_OUT_DATE != null)
        $("#TEST_OUT_DATE").html(moment(item.TEST_OUT_DATE).format("YYYY-MM-DD HH:mm"));
    if (item.BORROW_DATE != null)
        $("#BORROW_DATE").html(moment(item.BORROW_DATE).format("YYYY-MM-DD HH:mm"));
    if (item.RECEIVE_DATE != null)
        $("#RECEIVE_DATE").html(moment(item.RECEIVE_DATE).format("YYYY-MM-DD HH:mm"));
    if (item.APP_MEM_NAME != null)
        $("#APP_MEM_NAME").html(item.APP_MEM_NAME);
    if (item.SQUAD_MEM_NAME != null)
        $("#SQUAD_MEM_NAME").html(item.SQUAD_MEM_NAME);
    var html = "</br>";
    if (item.inoutStocks.length > 0) {
        for (var i = 0; i < item.inoutStocks.length; i++) {
            html = html + "名称：" + item.inoutStocks[i].PART_NAME + "--数量：" + item.inoutStocks[i].PART_COUNT + "</br>";
        }
        $("#inoutStocks").html(html);
    }
    if (item.DEGREE != null) {
        $("input[name='errortype'][value=" + item.DEGREE + "]").attr("checked", true);
    }
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