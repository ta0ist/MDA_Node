    var grid;
    var baseUrl = "/partNoInferior/";
    var validator;
    var addviewModel; //定义1个队象
    var switch_off = 0;
    /*********************************************初始化GRID****************************************************************/
    $(function() {
        var fields = {
            PART_INTERRIOR_NBR: { type: "string" },
            PART_NO: { type: "string" },
            INTERROR_REASON: { type: "string" },
            INTERRIOR_NUM: { type: "string" },
            REPORT_MAN_DATE: { type: "Date" }
        };
        var cols = [];
        cols.push({ field: "PART_INTERRIOR_NBR", title: "", width: 80, sortable: true, filterable: false, hidden: true });
        cols.push({ field: "PART_NO", title: '零件号', width: 80, sortable: true, filterable: false });
        cols.push({ field: "INTERROR_REASON", title: '次品原因名字', width: 80, sortable: true, filterable: false });
        cols.push({ field: "INTERRIOR_NUM", title: '不合格数', width: 80, sortable: true, filterable: false });
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
            actionUrl: ["GetPartNoInferiorInitList", "", "", "DelList"], //读、新增、更改、删除的URLaction
            custom: {
                PrimaryKey: "PART_INTERRIOR_NBR",
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
                BzConfirm('删除数据', function(e) {
                    if (e) {
                        var dd = grid.data("bz-grid").checkedDataRows();
                        var li = [];
                        for (var i = 0; i < dd.length; i++) {
                            li.push(dd[i].PART_INTERRIOR_NBR);
                        }
                        $.post("/partNoInferior/DeletePartNoInferior", { li: li }, function(data) {

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
        // getDataByKeyWord();//点击菜单加载
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
                        { field: "PART_NO", Operator: "contains", Keywords: $("#filter").val(), flag: "false" },
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
            INTERRIOR_NUM: ko.observable(dataItem == undefined ? "" : dataItem.INTERRIOR_NUM),
            INTERROR_REASON: ko.observable(dataItem == undefined ? "" : dataItem.INTERROR_REASON),
            PART_INTERRIOR_NBR: ko.observable(dataItem == undefined ? "" : dataItem.PART_INTERRIOR_NBR),
            REPORT_MAN_DATE: ko.observable(dataItem == undefined ? "" : dataItem.REPORT_MAN_DATE),
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
                        INTERRIOR_NUM: e.INTERRIOR_NUM(),
                        INTERROR_REASON: e.INTERROR_REASON(),
                        PART_INTERRIOR_NBR: e.PART_INTERRIOR_NBR(),
                        REPORT_MAN_DATE: $("#REPORT_MAN_DATE").val()
                    }
                    if (dataItem == undefined) { //新增
                        $.post(baseUrl + "AddPartNoInferior", data, function(data) {

                            $("#x5window").data("kendoWindow").close();

                            refreshGrid();
                            // getDataByKeyWord();

                            // refreshGrid();                                

                            BzSuccess('操作成功！');

                        });
                    } else {
                        $.post("/partNoInferior/UpdatePartNoInferior", data, function(data) {

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
            }
        });
        $("#INTERRIOR_NUM").kendoNumericTextBox({ format: "n0", min: 0, value: dataItem == undefined ? 0 : dataItem.INTERRIOR_NUM });
        var comboxData1 = [
            { text: '气孔', "value": '气孔' },
            { text: '黑皮', "value": '黑皮' },
            { text: '划碰伤', "value": '划碰伤' },
            { text: '调机', "value": '调机' },
            { text: '刀纹', "value": '刀纹' },
            { text: '崩缺', "value": '崩缺' },
            { text: '振刀', "value": '振刀' },
            { text: '气孔', "value": '气孔' },
            { text: '变形', "value": '变形' },
            { text: '其他', "value": '其他' }
        ]
        $("#INTERROR_REASON").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: comboxData1,
            value: comboxData1[0]
        }).data("kendoComboBox").value(dataItem == undefined ? '请选择原因' : dataItem.INTERROR_REASON);

        if (dataItem != undefined) {
            $("#REPORT_MAN_DATE").kendoDatePicker({ format: "yyyy-MM-dd", value: dataItem.REPORT_MAN_DATE });
        }
        // $("#REPORT_MAN_DATE").kendoDatePicker({ format: "yyyy/MM/dd" });           
    }

    function refreshGrid() {
        if ($("#filter").val() == "") {
            grid.grid("refresh", function() {
                return [
                    { field: "PART_NO", Operator: "contains", Keywords: "", flag: "false" }
                ]
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
                // userType: parseInt($('.nav-tabs li[class= "active"]').attr("value"))
        }
        $.post(baseUrl + "GetPartNoInferiorList", JSON.stringify(parm), function(data) { //{ page: parm.page, pageSize: parm.pageSize, Keywords: $("#filter").val(), take: 0, skip: 0, sort: [] }
            //{take: 10, skip: 0, page: 1, pageSize: 10, sort: []}
            if (data.Status == 0) {
                var dd = [];
                for (var i = 0; i < data.Data.length; i++) {
                    data.Data[i].REPORT_MAN_DATE = moment(data.Data[i].REPORT_MAN_DATE).format("YYYY-MM-DD");
                }
                grid.data("bz-grid").ds.data(data.Data);
            } else {
                x5alert(data.Message);
            }
        });
    }
    //编辑弹出窗口
    function f_edit(e) {
        $.x5window('编辑', kendo.template($("#popup-add").html()));
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $("#time").css("display", "block");
        addOrEdit(dataItem); //编辑
    }

    function f_delete(e) {
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        BzConfirm('请确认是否要删除数据', function(e) {
            if (e) {
                $.post("/partNoInferior/DeletePartNoInferior", { li: [dataItem.PART_INTERRIOR_NBR] }, function(data) {

                    refreshGrid();
                    BzSuccess(data.Message);

                });
            }
        });
    }