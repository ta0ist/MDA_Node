var grid;
var image;
var validator;
$(function() {


    var fields = {
        MAC_NBR: { type: "string" },
        GP_NBR: { type: "string" },
        MAC_NO: { type: "string" },
        ELECTRICAL_SYSTEM: { type: "string" },
        MAC_NAME: { type: "string" },
        CATEGORY: { type: "string" },
        PRICE: { type: "string" },
        MANUFACTURE: { type: "string" },
        BORN_DATE: { type: "date" },
        BUY_PERSON: { type: "string" },
        PHOTO: { type: "string" },
        MEMO: { type: "string" },
        RANK_NUM: { type: "string" },
        SERIAL_NO: { type: "string" }
    };
    var cols = [];
    cols.push({ field: "MAC_NBR", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "GP_NBR", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "MAC_NO", title: lang.Order.EquipmentSerialNumber, width: 80, sortable: true, filterable: false });
    cols.push({ field: "MAC_NAME", title: lang.Order.DeviceName, width: 80, sortable: true, filterable: false });
    cols.push({ field: "ELECTRICAL_SYSTEM", title: lang.Common.ElectricalSystem, width: 80, sortable: true, filterable: false });
    cols.push({ field: "CATEGORY", title: lang.Common.ElectricalSystem, width: 80, sortable: true, filterable: false });
    cols.push({ field: "PRICE", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "MANUFACTURE", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "BORN_DATE", title: "", width: 80, format: "{0: yyyy/MM/dd HH:mm:ss}", sortable: true, filterable: false, hidden: true });
    cols.push({ field: "BUY_PERSON", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "PHOTO", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "MEMO", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "RANK_NUM", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "SERIAL_NO", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({
        command: [
            { name: "aa", text: lang.Order.Edit + '<i class="icon-edit"></i>', className: "btn purple", click: upd_mac },
            { name: "bb", text: lang.Order.Delete + '<i class="icon-remove-sign"></i>', className: "btn red ", click: del_mac }
        ],
        title: lang.Order.Operation,
        width: 200
    });

    grid = $("#grid").grid({
        checkBoxColumn: true,
        baseUrl: "/", //调用的URL
        selectable: "single", //行选择方式
        //sort: [{ field: "USER_NBR", dir: "ASC" }],
        scrollable: true,
        editable: false, //是否可编辑
        autoBind: false,
        resizeGridWidth: true, //列宽度可调
        isPage: true,
        filter: null,
        //server: true, //服务器端刷新，包括排序，筛选等
        actionUrl: ["machine/GetMachineList", "", "", ""], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "MAC_NBR",
            fields: fields,
            cols: cols
        }
    });


    $("#tree_add").click(function() {
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var selectedNode = treeobj.select();
        if (selectedNode.length > 0) {
            var GroupInfo = {
                PID: parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid")),
                LEVEL_NBR: parseInt($(treeobj.select()).find('.k-state-selected span').attr("level_nbr"), 10) + 1,
                GP_NAME: "新节点",
                RANK_NUM: 0
            }

            $.post("machine/AddMachineGroup", GroupInfo, function(data) {
                if (data.Status == 0) {
                    var obj = treeobj.append({
                        text: GroupInfo.GP_NAME,
                        id: data.Data,
                        icon: "icon-cogs",
                        PID: GroupInfo.PID,
                        LEVEL_NBR: GroupInfo.LEVEL_NBR
                    }, selectedNode);
                    BzSuccess(data.Message);

                    //进入编辑
                    treeobj.select(obj);
                    $("#tree_edit").trigger('click');
                } else {
                    BzAlert(data.Message);
                }
            });
        } else {
            BzAlert(lang.Common.PleaseSelectANode);
        }

    });
    $("#tree_edit").click(function() {
        var GP_NAME;
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var selectedNode = treeobj.select();
        if (selectedNode.length > 0) {
            var obj = selectedNode.find('.k-state-selected span').data("BZ-editer");
            if (obj == undefined) {
                selectedNode.find('.k-state-selected span').editer({
                    url: "machine/UpdMachineGroup",
                    title: "文本框",
                    Ok: function(name) {
                        GP_NAME = name;
                        this.close();
                        var treeobj = $("#orgnizetree").data("kendoTreeView");
                        var GroupInfo = {
                            GP_NBR: parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid")),
                            GP_NAME: name,
                            RANK_NUM: 0
                        }
                        $.post("machine/UpdMachineGroup", (GroupInfo), function(data) {
                            if (data.Status == 0) {
                                var treeobj = $("#orgnizetree").data("kendoTreeView");
                                $(treeobj.select()).find('.k-state-selected span').html(GP_NAME);
                                BzSuccess(data.Message);
                            } else {
                                BzAlert(data.Message);
                            }
                        });
                    }
                });
            } else {
                obj.show();
            }
        }


    });


    $("#tree_delete").click(function() {
        BzConfirm(lang.Order.Delete, function(e) {
            if (e) {
                var treeobj = $("#orgnizetree").data("kendoTreeView");
                $.post("machine/DelMachineGroup", { gourpID: $(treeobj.select()).find('.k-state-selected span').attr("nodeid") }, function(data) {
                    if (data.Status == 0) {
                        var selectedNode = treeobj.select();
                        treeobj.remove(selectedNode);
                        BzSuccess(data.Message);
                    } else {
                        BzAlert(data.Message);
                    }
                });
            }
        });
    });

    $("#add_mac").click(function() {
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var selectedNode = treeobj.select();
        if (selectedNode.length > 0) { //判断是否有选中的节点
            $.x5window(lang.Order.Add, kendo.template($("#popup-add").html()));
            addOrEdit();
            // var validator = $("#machineviewmodel").validate({
            //     rules: {
            //         MAC_NO: { required: true },
            //         MAC_NAME: { required: true }
            //     },
            //     messages: {
            //         MAC_NO: { required: "不能为空" },
            //         MAC_NAME: { required: "不能为空" }
            //     }
            // });
            // $("#RANK_NUM").kendoNumericTextBox({
            //     format: "0", value: 0
            // });

            // $("#PRICE").kendoNumericTextBox({ format: "c", min: 0, value: 0.0 });
            // $("#BORN_DATE").kendoDatePicker({ format: "yyyy/MM/dd" });
            // $("#Win_Submit").bind('click', function () {
            //     if (validator.form()) {
            //         var treeobj = $("#orgnizetree").data("kendoTreeView");
            //         var selectedNode = treeobj.select();
            //         var data = {
            //             GP_NBR: parseInt(selectedNode.find('.k-state-selected span').attr("nodeid")),
            //             PHOTO: $("#PHOTO").val(),
            //             MAC_NBR: $("#MAC_NBR").val(),
            //             MAC_NO: $("#MAC_NO").val(),
            //             MAC_NAME: $("#MAC_NAME").val(),
            //             BORN_DATE: $("#BORN_DATE").data("kendoDatePicker").value(),
            //             BUY_PERSON: $("#BUY_PERSON").val(),
            //             CATEGORY: $("#CATEGORY").val(),
            //             ELECTRICAL_SYSTEM: $("#ELECTRICAL_SYSTEM").val(),
            //             MANUFACTURE: $("#MANUFACTURE").val(),
            //             MEMO: $("#MEMO").val(),
            //             PRICE: $("#PRICE").data("kendoNumericTextBox").value(),
            //             RANK_NUM: $("#RANK_NUM").data("kendoNumericTextBox").value(),
            //             SERIAL_NO: $("#SERIAL_NO").val()
            //         };
            //         $.post("machine/AddMachine", (data), function (data) {
            //             if (data.Status == 0) {
            //                 $("#x5window").data("kendoWindow").close();
            //                 refreshGrid();
            //                 BzSuccess(data.Message);
            //             }
            //             else {
            //                 BzAlert(data.Message);
            //             }
            //         });
            //     }
            // });


        } else {
            BzAlert(lang.Common.PleaseSelectSetOf);
        }
    });

    $("#del_mac").click(function() {
        BzConfirm(lang.Common.BatchRemoveDevices, function(e) {
            if (e) {
                var dd = grid.data("bz-grid").checkedDataRows();
                var machineId = "";
                for (var i = 0; i < dd.length; i++) {
                    machineId += dd[i].MAC_NBR + ',';
                }
                machineId = machineId.substring(0, machineId.length - 1);
                $.post("machine/DelMachine", { macs: machineId }, function(data) {
                    if (data.Status == 0) {
                        refreshGrid();
                        BzSuccess(data.Message);
                    } else {
                        BzAlert(data.Message);
                    }
                });
            }
        });
    });


    $('#filter').bind('keypress', function(event) {
        if (event.keyCode == "13") {
            getDataByKeyWord();
        }
    });
    $("#move_mac").click(function() {
        var obj = $("#move_mac").data("BZ-editer");
        if (obj == undefined) {
            $("#move_mac").editer({
                type: "comboxtree",
                comboxTree: {
                    url: "/machine/GetGrouplist",
                    data: { groupID: 0 },
                    treetemplate: $("#treeview-template").html(),
                    url2: "/machine/GetKeywordGrouplist"
                },
                grouptype: 1,
                Ok: function(data) {
                    var dd = grid.data("bz-grid").checkedDataRows();
                    var machineiIds = "";
                    for (var i = 0; i < dd.length; i++) {
                        machineiIds += (dd[i].MAC_NBR) + ",";
                    }
                    machineiIds = machineiIds.substring(0, machineiIds.length - 1);
                    var data = {
                        groupId: data.rData,
                        machineiIds: machineiIds
                    };

                    $.post("/machine/MoveMachine", (data), function(data) {
                        if (data.Status == 0) {
                            refreshGrid();
                            BzSuccess(data.Message);
                        } else {

                            BzAlert(lang.Common.Sorry);
                            return (data.Message);
                        }
                    });
                }
            });
        } else {
            obj.show();
        }

    });

    $("#tree_addRootNode").click(function() {
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var GroupInfo = {
            PID: 0,
            LEVEL_NBR: 1,
            GP_NAME: "新节点",
            RANK_NUM: 0
        }
        $.post("machine/AddMachineGroup", (GroupInfo), function(data) {
            if (data.Status == 0) {
                var obj = treeobj.append({
                    text: GroupInfo.GP_NAME,
                    id: data.Data,
                    icon: "icon-cogs",
                    PID: 0,
                    LEVEL_NBR: 1
                }, null);
                BzSuccess(data.Message);
                //进入编辑
                treeobj.select(obj);
                $("#tree_edit").trigger('click');
            } else {
                BzAlert(data.Message);
            }
        });


    });


    GetGrouplist(0, "machine/GetGrouplist", $("#treeview-template").html(), "icon-group");
    $("#tree_expand").toggle(function() {
        $("#orgnizetree").data("kendoTreeView").expand(".k-item");
    }, function() {
        $("#orgnizetree").data("kendoTreeView").collapse(".k-item");
    });

    //图库
    $(document).on('click', '#galleryshow', function() {

        if ($("#Gallery").is(":hidden")) {
            $("#Gallery").show();
        } else {
            $("#Gallery").hide();
        }
    });


});

function photoevnet() {
    $(".galleryli").unbind("click");
    $(".icon-trash").unbind("click");
    $(".galleryli").click(function(e) {
        $(".galleryli .icon-ok-sign").hide();
        $(this).find(".icon-ok-sign").show();
        $("#PHOTO_img").css("backgroundImage", "url(/images/machine/" + $(this).attr("name") + ")");
        image = "images/machine/" + $(this).attr('name');
    });
    $(".icon-trash").click(function(e) {
        var obj = $(this).parent().attr("name");
        var data = {
            fileName: obj.split("/")[1],
            type: "NoDefault"
        }
        $.post("/member/DeleteFile", JSON.stringify(data), function(data) {
            if (data.Status == 0) {
                $('.galleryli[name="' + obj + '"]').remove();
            } else {
                BzAlert(data.Message);
            }
        });
        e.stopPropagation();
    });
}

function getDataByKeyWord() { //关键字查询
    var ds = grid.data("bz-grid").ds;
    var data = {
        PageIndex: ds._page,
        PageSize: ds._pageSize,
        keyword: $("#filter").val(),

    }
    $.post("machine/GetKeywordMachinelist", (data), function(data) {
        if (data.Status == 0) {
            var dd = [];
            for (var i = 0; i < data.Data.List.length; i++) {
                data.Data.List[i].BORN_DATE = moment(data.Data.List[i].BORN_DATE).format("YYYY-MM-DD");
            }
            grid.data("bz-grid").ds.data(data.Data.List);
        } else {
            BzAlert(data.Message);
        }
    });
}

function del_mac(e) {

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    BzConfirm(lang.Common.RemoveEquipment, function(e) {
        if (e) {


            $.post("machine/DelMachine", { macs: dataItem.MAC_NBR }, function(data) {
                if (data.Status == 0) {
                    refreshGrid();
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            });
        }
    });
}

function upd_mac(e) {
    $.x5window(lang.Order.Edit, kendo.template($("#popup-add").html()));
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    addOrEdit(dataItem);
    //     $("#RANK_NUM").kendoNumericTextBox({ format: "c", min: 0 });
    //     $("#PRICE").kendoNumericTextBox({ format: "c", min: 0 });
    //     $("#BORN_DATE").kendoDatePicker({ format: "yyyy/MM/dd" });
    //     $("#PHOTO").val();
    //     $("#MAC_NBR").val(dataItem.MAC_NBR),
    //     $("#MAC_NO").val(dataItem.MAC_NO),
    //     $("#MAC_NAME").val(dataItem.MAC_NAME),
    //     $("#BORN_DATE").data("kendoDatePicker").value(dataItem.BORN_DATE),
    //     $("#BUY_PERSON").val(dataItem.BUY_PERSON),
    //     $("#CATEGORY").val(dataItem.CATEGORY),
    //     $("#ELECTRICAL_SYSTEM").val(dataItem.ELECTRICAL_SYSTEM),
    //     $("#MANUFACTURE").val(dataItem.MANUFACTURE),
    //     $("#MEMO").val(dataItem.MEMO),
    //     $("#PRICE").data("kendoNumericTextBox").value(dataItem.PRICE),
    //     $("#RANK_NUM").data("kendoNumericTextBox").value(dataItem.RANK_NUM),
    //     $("#SERIAL_NO").val(dataItem.SERIAL_NO)

    // var validator = $("#machineviewmodel").validate({
    //     rules: {
    //         MAC_NO: { required: true },
    //         MAC_NAME: { required: true }
    //     },
    //     messages: {
    //         MAC_NO: { required: "不能为空" },
    //         MAC_NAME: { required: "不能为空" }
    //     }
    // });




    // $("#Win_Submit").bind('click', function () {
    //     if (validator.form()) {

    //         var treeobj = $("#orgnizetree").data("kendoTreeView");
    //         var selectedNode = treeobj.select();
    //         var data = {
    //             GP_NBR: parseInt(selectedNode.find('.k-state-selected span').attr("nodeid")),
    //             PHOTO: $("#PHOTO").val(),
    //             MAC_NBR: $("#MAC_NBR").val(),
    //             MAC_NO: $("#MAC_NO").val(),
    //             MAC_NAME: $("#MAC_NAME").val(),
    //             BORN_DATE: $("#BORN_DATE").data("kendoDatePicker").value(),
    //             BUY_PERSON: $("#BUY_PERSON").val(),
    //             CATEGORY: $("#CATEGORY").val(),
    //             ELECTRICAL_SYSTEM: $("#ELECTRICAL_SYSTEM").val(),
    //             MANUFACTURE: $("#MANUFACTURE").val(),
    //             MEMO: $("#MEMO").val(),
    //             PRICE: $("#PRICE").data("kendoNumericTextBox").value(),
    //             RANK_NUM: $("#RANK_NUM").data("kendoNumericTextBox").value(),
    //             SERIAL_NO: $("#SERIAL_NO").val()
    //         };
    //         $.post("machine/UpdMachine", (data), function (data) {
    //             if (data.Status == 0) {
    //                 $("#x5window").data("kendoWindow").close();
    //                 refreshGrid();
    //                 BzSuccess(data.Message);
    //             }
    //             else {
    //                 BzAlert(data.Message);
    //             }
    //         });
    //     }
    // });



}

function refreshGrid() {
    if ($("#filter").val() == "") {
        grid.grid("refresh", function() {
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var selectedNode = treeobj.select();
            return [
                { field: "keyword", Operator: "eq", value: parseInt(selectedNode.find('.k-state-selected span').attr("nodeid")) }
            ];
        });
    } else {
        getDataByKeyWord();
    }

}

function addOrEdit(dataItem) {
    App.initUniform();
    //验证
    validator = $("#machineviewmodel").validate({
        rules: {
            MAC_NO: { required: true },
            MAC_NAME: { required: true }


        },
        messages: {
            MAC_NO: { required: lang.Common.IsNotEmpty },
            MAC_NAME: { required: lang.Common.IsNotEmpty }
        }
    });

    var treeobj = $("#orgnizetree").data("kendoTreeView");
    var selectedNode = treeobj.select();

    var url = dataItem == undefined ? "/machine/AddMachine" : "/machine/UpdMachine";
    if (dataItem != undefined) {
        // $("#RANK_NUM").kendoNumericTextBox({ format: "n0", min: 0 });
        // $("#PRICE").kendoNumericTextBox({ format: "c", min: 0 });
        // $("#BORN_DATE").kendoDatePicker({ format: "yyyy/MM/dd" });
        $("#PHOTO").val();
        $("#MAC_NBR").val(dataItem.MAC_NBR),
            $("#MAC_NO").val(dataItem.MAC_NO),
            $("#MAC_NAME").val(dataItem.MAC_NAME),
            //$("#BORN_DATE").data("kendoDatePicker").value(dataItem.BORN_DATE),
            $("#BUY_PERSON").val(dataItem.BUY_PERSON),
            $("#CATEGORY").val(dataItem.CATEGORY),
            $("#ELECTRICAL_SYSTEM").val(dataItem.ELECTRICAL_SYSTEM),
            $("#MANUFACTURE").val(dataItem.MANUFACTURE),
            $("#MEMO").val(dataItem.MEMO),
            // $("#PRICE").data("kendoNumericTextBox").value(dataItem.PRICE),
            // $("#RANK_NUM").data("kendoNumericTextBox").value(dataItem.RANK_NUM),
            $("#SERIAL_NO").val(dataItem.SERIAL_NO)

    }
    $("#RANK_NUM").kendoNumericTextBox({ format: "n0", min: 0, value: dataItem == undefined ? 0 : dataItem.RANK_NUM });
    $("#PRICE").kendoNumericTextBox({ format: "c", min: 0, value: dataItem == undefined ? 0 : dataItem.PRICE });
    $("#BORN_DATE").kendoDatePicker({
        format: "yyyy/MM/dd",
        value: dataItem == undefined ? new Date() : dataItem.BORN_DATE
    });
    //保存
    $("#Win_Submit").click(function() {
        if (validator.form()) {
            var para = {
                GP_NBR: parseInt(selectedNode.find('.k-state-selected span').attr("nodeid")),
                PHOTO: image,
                MAC_NBR: $("#MAC_NBR").val(),
                MAC_NO: $("#MAC_NO").val(),
                MAC_NAME: $("#MAC_NAME").val(),
                BORN_DATE: $("#BORN_DATE").val(),
                BUY_PERSON: $("#BUY_PERSON").val(),
                CATEGORY: $("#CATEGORY").val(),
                ELECTRICAL_SYSTEM: $("#ELECTRICAL_SYSTEM").val(),
                MANUFACTURE: $("#MANUFACTURE").val(),
                MEMO: $("#MEMO").val(),
                PRICE: $("#PRICE").data("kendoNumericTextBox").value(),
                RANK_NUM: $("#RANK_NUM").data("kendoNumericTextBox").value(),
                SERIAL_NO: $("#SERIAL_NO").val()
            };
            $.post(url, para, function(data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    refreshGrid();
                    BzSuccess(data.Message);
                } else {
                    BzAlert(data.Message);
                }
            });
        }
    });


    //获取图库列表
    $.post("/member/ShowAllPic", function(data) {
        if (data.Status == 0) {
            var html = '<ul class="galleryul" style="margin-left: 0px; margin-bottom: 0px;">';
            for (var i = 0; i < data.Data.length; i++) {
                html = html + '<li class="galleryli" imgname="' + data.Data[i].FileName + '"  name="' + data.Data[i].FileDesc + '/' + data.Data[i].FileName + '"><a><div class="gallery" style="background-image:url(' + data.Data[i].FilePath + ')"></div></a>' + (data.Data[i].FileDesc == "Default" ? "" : '<i class="icon-trash"></i>') + '<i class="icon-ok-sign"></i><span>' + (data.Data[i].FileName.split(".")[0].length > 6 ? (data.Data[i].FileName.split(".")[0].substr(0, 6) + "...") : data.Data[i].FileName.split(".")[0]) + '</span></li>'
            }
            html = html + '</ul>';
            $("#Gallery").append(html);
            //注册图片事件
            photoevnet();
            //新增默认选择no.jpg
            if (dataItem == undefined) { //新增
                $('.galleryli[name="Default/no.jpg"]').find(".icon-ok-sign").show();
            } else {
                var path = dataItem.PHOTO.split("//");
                $('.galleryli[name="' + path[2] + '/' + path[3] + '"]').find(".icon-ok-sign").show();
            }
        } else {
            BzAlert(data.Message);
        }
    });

    if (dataItem == undefined) {
        $("#PHOTO_img").css("backgroundImage", "url(/images/machine/Default/no.jpg)");
        image = "images/machine/Default/no.jpg";
    } else {
        $("#PHOTO_img").css("backgroundImage", "url(" + dataItem.PHOTO.replace(/\/\//g, "/") + ")");
        image = dataItem.PHOTO.replace(/\/\//g, "/");
    }

    $("#fileupload").fileupload({ //文件上传
        dataType: 'json',
        autoUpload: true,
        url: "/machine/upload/img",
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxNumberOfFiles: 1,
        maxFileSize: 1000000,
        done: function(e, data) {
            if (data.result.Status == 0) {
                $("#PHOTO_img").css("backgroundImage", "url(./images/people/NoDefault/" + data.result.Data + ")");
                //addviewModel.PHOTO(data.result.Data);
                $("#PHOTO").val(data.result.Data);
                //添加到图库
                if ($('.galleryli[name="NoDefault/' + data.result.Data + '"]').length == 0) {
                    $("#Gallery").append('<li class="galleryli" imgname="' + data.result.Data + '" name="/NoDefault/' + data.result.Data + '"><a><div class="gallery" style="background-image:url(./images/machine/NoDefault/' + data.result.Data + ')"></div></a><i class="icon-trash"></i><i class="icon-ok-sign"></i><span>' + (data.result.Data.split(".")[0].length > 6 ? (data.result.Data.split(".")[0].substr(0, 6) + "...") : data.result.Data.split(".")[0]) + '</span></li>')
                }
                //注册图片事件
                photoevnet();
                BzSuccess(data.result.Message);
            } else {
                BzAlert(data.result.Message);
            }
        },
        fail: function(e, data) {
            var cc = 1;
        }
    });
}