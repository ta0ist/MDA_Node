var grid;
var baseUrl = "/";
var validator;
var addviewModel;
var MyRow = undefined;
var image = "";
$(function () {

    var fields = {
        MEM_NBR: { type: "string" },
        GP_NBR: { type: "string" },
        MEMBER_NO: { type: "string" },
        SEX: { type: "string" },
        MEM_NAME: { type: "string" },
        TEL: { type: "string" },
        ADDRESS: { type: "string" },
        EMAIL: { type: "string" },
        IDENTITY_NO: { type: "string" },
        PHOTO: { type: "string" },
        BIRTHDAY: { type: "date" },
        RANK_NUM: { type: "string" }
    };
    var cols = [];
    cols.push({ field: "MEM_NBR", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "GP_NBR", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "MEMBER_NO", title: '人员编号', width: 80, sortable: true, filterable: false });
    cols.push({ field: "MEM_NAME", title: '名字', width: 80, sortable: true, filterable: false });
    cols.push({ field: "SEX", title: '性别', width: 80, sortable: true, filterable: false, template: null });
    cols.push({ field: "TEL", title: '联系方式', width: 80, sortable: true, filterable: false });
    cols.push({ field: "ADDRESS", title: '地址', width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "EMAIL", title: '邮箱', width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "IDENTITY_NO", title: '名字', width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({ field: "PHOTO", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({
        field: "BIRTHDAY",
        title: '生日',
        width: 80,
        format: "{0: yyyy/MM/dd}",
        sortable: true,
        filterable: false
    });
    cols.push({ field: "RANK_NUM", title: "", width: 80, sortable: true, filterable: false, hidden: true });
    cols.push({
        command: [
            { name: "aa", text: "编辑" + '<i class="icon-edit"></i>', className: "btn purple", click: f_edit },
            { name: "bb", text: "删除" + '<i class="icon-remove-sign"></i>', className: "btn red ", click: f_delete }
        ],
        title: '操作', width: 200
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
        resizeGridWidth: true,//列宽度可调
        isPage: true,
        detailTemplate: $("#detail-template").html(),
        //server: true, //服务器端刷新，包括排序，筛选等
        actionUrl: ["member/GetMemberlist", "", "", ""], //读、新增、更改、删除的URLaction
        custom: {
            PrimaryKey: "MEM_NBR",
            fields: fields,
            cols: cols
        }
    });


    GetGrouplist(0, "/member/GetGrouplist", $("#treeview-template").html(), "icon-group");
    //对树的增删改查
    //add
    $("#tree_add").click(function () {
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var selectedNode = treeobj.select();
        if (selectedNode.length > 0) {
            var GroupInfo = {
                PID: parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid")),
                LEVEL_NBR: parseInt($(treeobj.select()).find('.k-state-selected span').attr("level_nbr"), 10) + 1,
                GP_NAME: "New Node",
                RANK_NUM: 0
            }
            $.post("/member/AddGroup", GroupInfo, function (data) {//新增直接传
                if (data.Data != 3) {
                    var obj = treeobj.append({
                        text: GroupInfo.GP_NAME,
                        id: data.Data,
                        icon: "icon-group",
                        PID: GroupInfo.PID,
                        LEVEL_NBR: GroupInfo.LEVEL_NBR
                    }, selectedNode);
                    BzSuccess(data.Message);

                    //进入编辑
                    treeobj.select(obj);
                    $("#tree_edit").trigger('click');
                }
                else {
                    BzAlert("不能添加重复数据");
                }
            });
        }
        else {
            BzAlert("请选择节点！");
        }
    });
    //update
    $("#tree_edit").click(function () {
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var selectedNode = treeobj.select();
        if (selectedNode.length > 0) {
            var obj = selectedNode.find('.k-state-selected span').data("BZ-editer");
            if (obj == undefined) {
                selectedNode.find('.k-state-selected span').editer({
                    url: "/member/UpdGroup",
                    title: "请输入人员组名",
                    Ok: function (name) {
                        this.close();
                        var treeobj = $("#orgnizetree").data("kendoTreeView");
                        var GroupInfo = {
                            GP_NBR: parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid")),
                            GP_NAME: name,
                            RANK_NUM: 0
                        }
                        $.post("/member/UpdGroup", (GroupInfo), function (data) {
                            if (data.Status == 0) {
                                var treeobj = $("#orgnizetree").data("kendoTreeView");
                                // $(treeobj.select()).find('.k-state-selected span').html(JSON.parse(this.data).GP_NAME);
                                $(treeobj.select()).find('.k-state-selected span').html(name);
                                BzSuccess(data.Message);
                            }
                            else {
                                BzAlert(data.Message);
                            }
                        });
                    }
                });
            }
            else {
                obj.show();
            }
        }
    });
    //delete
    $("#tree_delete").click(function () {
        BzConfirm('请确认是否要删除数据', function (e) {
            if (e) {
                var treeobj = $("#orgnizetree").data("kendoTreeView");
                $.post("/member/DelGroup", { groupId: $(treeobj.select()).find('.k-state-selected span').attr("nodeid") }, function (data) {
                    if (data.Status == 0) {
                        var selectedNode = treeobj.select();
                        treeobj.remove(selectedNode);
                        BzSuccess(data.Message);
                    }
                    else {
                        BzAlert(data.Message);
                    }
                });
            }
        });
    });
    /******************************************grid 增删改查移动*************************************/
    //弹出新增或者更新窗口
    $("#grid_add").click(function () {
        var treeobj = $("#orgnizetree").data("kendoTreeView");
        var selectedNode = treeobj.select();
        if (selectedNode.length > 0) {//判断是否有选中的节点
            $.x5window("新增", $("#popup-add").html());
            addOrEdit();
        }
        else {
            BzAlert("请选择一个节点");
        }
    });

    //删除人员
    $("#grid_delete").click(function () {

        BzConfirm('请确认是否要删除数据', function (e) {
            if (e) {
                var dd = grid.data("bz-grid").checkedDataRows();
                var memberId = [];
                for (var i = 0; i < dd.length; i++) {
                    memberId.push(dd[i].MEM_NBR);
                }
                $.post("/member/DelMember", JSON.stringify({ memberId: memberId }), function (data) {
                    if (data.Status == 0) {
                        refreshGrid();
                        BzSuccess(data.Message);
                    }
                    else {
                        BzAlert(data.Message);
                    }
                });
            }
        });
    });
    //移动组
    $("#grid_move").click(function () {
        var obj = $("#grid_move").data("BZ-editer");
        if (obj == undefined) {
            $("#grid_move").editer({
                type: "comboxtree",
                comboxTree: {
                    url: "/member/GetGrouplist",
                    data: { groupID: 0 },
                    treetemplate: $("#treeview-template").html(),
                    url2: "/member/GetKeywordGrouplist"
                },
                grouptype: 3,
                Ok: function (data) {
                    var dd = grid.data("bz-grid").checkedDataRows();
                    var memberIds = [];
                    for (var i = 0; i < dd.length; i++) {
                        memberIds.push(dd[i].MEM_NBR);
                    }
                    var data = {
                        memberIds: memberIds,
                        groupId: data.rData
                    };

                    $.post("/member/MoveMemberGroup", data, function (data) {
                        if (data.Status == 0) {
                            refreshGrid();
                            BzSuccess(data.Message);

                        }
                        else {
                            BzAlert("对不起，您的输入有误");
                            return (data.Message);
                        }
                    });
                }
            });
        }
        else {
            obj.show();
        }
    });


    $("#tree_expand").toggle(function () {
        $("#orgnizetree").data("kendoTreeView").expand(".k-item");
    }, function () {
        $("#orgnizetree").data("kendoTreeView").collapse(".k-item");
    });

    $('#filter').bind('keypress', function (event) {
        if (event.keyCode == "13") {
            getDataByKeyWord();
        }
    });
    //图库
    $(document).on('click', '#galleryshow', function () {

        if ($("#Gallery").is(":hidden")) {
            $("#Gallery").show();
        } else {
            $("#Gallery").hide();
        }
    });


});
/****************************************************************************************************************/
function photoevnet() {
    $(".galleryli").unbind("click");
    $(".icon-trash").unbind("click");
    $(".galleryli").click(function (e) {
        $(".galleryli .icon-ok-sign").hide();
        $(this).find(".icon-ok-sign").show();
        $("#PHOTO_img").css("backgroundImage", "url(/images/people/" + $(this).attr("name") + ")");
        image = "images/people/" + $(this).attr('name');
    });
    $(".icon-trash").click(function (e) {
        var obj = $(this).parent().attr("name");
        var data = {
            fileName: obj.split("/")[1],
            type: "NoDefault"
        }
        $.post("/member/DeleteFile", JSON.stringify(data), function (data) {
            if (data.Status == 0) {
                $('.galleryli[name="' + obj + '"]').remove();
            }
            else {
                BzAlert(data.Message);
            }
        });
        e.stopPropagation();
    });
}
function refreshGrid() {
    if ($("#filter").val() == "") {
        grid.grid("refresh", function () {
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var selectedNode = treeobj.select();
            return [
                { field: "keyword", Operator: "eq", value: parseInt(selectedNode.find('.k-state-selected span').attr("nodeid")) }
            ];
        });
    }
    else {
        getDataByKeyWord();
    }
}

function getDataByKeyWord() {//关键字查询
    var ds = grid.data("bz-grid").ds;
    var data = {
        PageIndex: ds._page,
        PageSize: ds._pageSize,
        keyword: $("#filter").val()
    }
    $.post("/member/GetKeywordMemberlist", data, function (data) {
        if (data.Status == 0) {
            var dd = [];
            for (var i = 0; i < data.Data.List.length; i++) {
                data.Data.List[i].BIRTHDAY = moment(data.Data.List[i].BIRTHDAY).format("YYYY-MM-DD");
            }
            grid.data("bz-grid").ds.data(data.Data.List);
        }
        else {
            x5alert(data.Message);
        }
    });
}
//弹出编辑人员
function f_edit(e) {
    $.x5window('编辑', $("#popup-add").html());//kendo.template($("#popup-add").html())
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    // MyRow = dataItem;
    // $("#MEM_NBR").val(dataItem.MEM_NBR);
    // $("#MEMBER_NO").val(dataItem.MEMBER_NO);
    // $("#MEM_NAME").val(dataItem.MEM_NAME);
    // $("#BIRTHDAY").val();
    // $("#TEL").val(dataItem.TEL);
    // $("#EMAIL").val(dataItem.EMAIL);
    // $("#IDENTITY_NO").val(dataItem.IDENTITY_NO);
    // $("#ADDRESS").val(dataItem.ADDRESS);
    addOrEdit(dataItem);//编辑

}
//删除人员
function f_delete(e) {
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    BzConfirm('删除', function (e) {
        if (e) {
            $.post("/member/DelMember", JSON.stringify({ memberId: [dataItem.MEM_NBR] }), function (data) {
                if (data.Status == 0) {
                    refreshGrid();
                    BzSuccess(data.Message);
                }
                else {
                    BzAlert(data.Message);
                }
            });
        }
    });
}
/******************************************************************************************************/



function addOrEdit(dataItem) {
    App.initUniform();
    //验证
    validator = $("#memberviewmodel").validate({
        rules: {
            MEMBER_NO: { required: true },
            MEM_NAME: { required: true }


        },
        messages: {
            MEMBER_NO: { required: '不为空' },
            MEM_NAME: { required: '不为空' }
        }
    });

    var treeobj = $("#orgnizetree").data("kendoTreeView");
    var selectedNode = treeobj.select();

    var url = dataItem == undefined ? "/member/AddMember" : "/member/UpdMember";
    if (dataItem != undefined) {
        $("#MEM_NBR").val(dataItem.MEM_NBR);
        $("#MEMBER_NO").val(dataItem.MEMBER_NO);
        $("#MEM_NAME").val(dataItem.MEM_NAME);
        $("#BIRTHDAY").val();
        $("#TEL").val(dataItem.TEL);
        $("#EMAIL").val(dataItem.EMAIL);
        $("#IDENTITY_NO").val(dataItem.IDENTITY_NO);
        $("#ADDRESS").val(dataItem.ADDRESS);
    }
    //保存
    $(document).on('click', '#btn_save', function () {
        if (validator.form()) {
            var memberinfo = {
                GP_NBR: parseInt(selectedNode.find('.k-state-selected span').attr("nodeid")),
                PHOTO: image,
                MEM_NBR: dataItem == undefined ? "" : dataItem.MEM_NBR,
                MEMBER_NO: $("#MEMBER_NO").val(),
                MEM_NAME: $("#MEM_NAME").val(),
                BIRTHDAY: $("#BIRTHDAY").val(),
                TEL: $("#TEL").val(),
                SEX: parseInt($('input[name="SEX"]:checked').val()),
                EMAIL: $("#EMAIL").val(),
                IDENTITY_NO: $("#IDENTITY_NO").val(),
                ADDRESS: $("#ADDRESS").val(),
                //PRICE: $("#PRICE").data("kendoNumericTextBox").value(),
                RANK_NUM: $("#RANK_NUM").val()
            }
            $.post(url, memberinfo, function (data) {
                if (data.Status == 0) {
                    $("#x5window").data("kendoWindow").close();
                    refreshGrid();
                    BzSuccess(data.Message);
                }
                else {
                    BzAlert(data.Message);
                }
            });
        }
    });
    $("#RANK_NUM").kendoNumericTextBox({ format: "n0", min: 0, value: dataItem == undefined ? 0 : dataItem.RANK_NUM });
    $("#BIRTHDAY").kendoDatePicker({
        format: "yyyy/MM/dd",
        value: dataItem == undefined ? new Date() : dataItem.BIRTHDAY
    });

    //获取图库列表
    $.post("/member/ShowAllPic", function (data) {
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
            if (dataItem == undefined) {//新增
                $('.galleryli[name="Default/no.jpg"]').find(".icon-ok-sign").show();
            }
            else {
                var path = dataItem.PHOTO.split("//");
                $('.galleryli[name="' + path[2] + '/' + path[3] + '"]').find(".icon-ok-sign").show();
            }
        }
        else {
            BzAlert(data.Message);
        }
    });

    if (dataItem == undefined) {
        $("#PHOTO_img").css("backgroundImage", "url(/images/people/Default/no.jpg)");
        image = "images/people/Default/no.jpg";
    }
    else {
        $("#PHOTO_img").css("backgroundImage", "url(" + dataItem.PHOTO.replace(/\/\//g, "/") + ")");
        image = dataItem.PHOTO.replace(/\/\//g, "/");
    }

    $("#fileupload").fileupload({//文件上传
        dataType: 'json',
        autoUpload: true,
        url: "/member/upload/img",
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxNumberOfFiles: 1,
        maxFileSize: 1000000,
        done: function (e, data) {
            if (data.result.Status == 0) {
                $("#PHOTO_img").css("backgroundImage", "url(./images/people/NoDefault/" + data.result.Data + ")");
                //addviewModel.PHOTO(data.result.Data);
                $("#PHOTO").val(data.result.Data);
                //添加到图库
                if ($('.galleryli[name="NoDefault/' + data.result.Data + '"]').length == 0) {
                    $("#Gallery").append('<li class="galleryli" imgname="' + data.result.Data + '" name="/NoDefault/' + data.result.Data + '"><a><div class="gallery" style="background-image:url(./images/people/NoDefault/' + data.result.Data + ')"></div></a><i class="icon-trash"></i><i class="icon-ok-sign"></i><span>' + (data.result.Data.split(".")[0].length > 6 ? (data.result.Data.split(".")[0].substr(0, 6) + "...") : data.result.Data.split(".")[0]) + '</span></li>')
                }
                //注册图片事件
                photoevnet();
                BzSuccess(data.result.Message);
            }
            else {
                BzAlert(data.result.Message);
            }
        },
        fail: function (e, data) {
            var cc = 1;
        }
    });
}
