var baseUrl = "/Document/";
var fileID;
var viewModel;
var u;
$.ajaxSetup({
    global: true,
    type: "POST",
    dataType: "json",
    contentType: 'application/json',
});

function refeshImage(fileType) {
    var nn;
    switch (fileType.toLowerCase()) {
        case "jpeg":
        case "jpg":
        case "png":
        case "img":
            nn = "img";
            break;
        case "doc":
        case "docx":
            nn = "doc";
            break;
        case "xls":
        case "xlsx":
            nn = "xls";
            break;
        case "ppt":
        case "pptx":
            nn = "ppt";
            break;
        case "pdf":
            nn = "pdf";
            break;
        default:
            nn = "txt";
            break;
    }
    return nn;
}

function getData(fileID) {
    //var treeobj = $("#orgnizetree").data("kendoTreeView");
    //var fileID = parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid"));
    $.post("/Document/GetAllFileWithTagList", JSON.stringify({ pid: fileID }), function(data) {
        if (data.Status == 0) {
            for (var m = 0; m < data.Data.length; m++) {
                data.Data[m]["CreateDate"] = moment(data.Data[m].CreateDate).format("YYYY-MM-DD HH:mm:ss");
                data.Data[m]["ModifyDate"] = moment(data.Data[m].ModifyDate).format("YYYY-MM-DD HH:mm:ss");
                data.Data[m]["FileType"] = data.Data[m].DirectoryName.split(".")[1];
                data.Data[m]["checkedDocument"] = false;
                data.Data[m]["FileSize"] = (data.Data[m].FileSize / 1024).toFixed(1);
                //data.Data[m]["checkedDocument2"] = false;
            }
            ko.mapping.fromJS(u.list(data.Data), viewModel);
        } else {
            BzAlert(data.Message);
        }
    });
}
$(function() {
    $("#fileupload").fileupload({ //文件上传
        dataType: 'json',
        autoUpload: true,
        url: "/Document/UpLoadFiles",
        //acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        //maxNumberOfFiles: 1,
        fileElementId: "files_name", //文件上传空间的id属性
        singleFileUploads: false,
        maxFileSize: 1000000,

        formData: { aa: fileID },
        add: function(e, data) {
            //data.context = $('<p/>').text('Uploading...').appendTo(document.body);
            //判断有没有选择文件夹
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var fileID = parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid"));
            if (isNaN(fileID)) {
                BzAlert("请选择需要上传文件的目录");
            } else {
                data.submit();
            }
        },
        done: function(e, data) {
            if (data.result.Status == 0) {
                var treeobj = $("#orgnizetree").data("kendoTreeView");
                var fileID = parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid"));
                getData(fileID);
                BzSuccess(data.result.Message);
            } else {
                BzAlert(data.result.Message);
            }
        },
        fail: function(e, data) {
            var cc = 1;
        }
    });
    GetDocumentList11($("#treeview-template").html(), function(data) {
        fileID = parseInt($(data).find('[attr="treenode"]').attr("nodeid"));
        $("#fileupload").data("blueimp-fileupload")._setOption("formData", { pid: fileID });
        getData(fileID);
    });
    $("#allCheck").click(function() {
        var flag = false;
        if ($(this).prop("checked")) {
            flag = true;
        } else {
            flag = false;
        }
        for (var i = 0; i < viewModel.list().length; i++) {
            viewModel.list()[i].checkedDocument(flag);
        }
    })

    function koModel() {
        var self = this;
        self.list = ko.observableArray([]);
        self.viewStyle = ko.observable(true);
        self.mouseover = function(e, event) {
            $(event.currentTarget).find("i").show();
        }
        self.mouseout = function(e, event) {
            $(event.currentTarget).find("i").hide();
        }
        self.removeTag = function() {
                var data = {
                    TagId: this.TagId(),
                    TagName: this.TagName(),
                    TagParamterId: this.TagParamterId()
                }
                $.post(baseUrl + "DeleteOnlyTag", JSON.stringify({ tag: data }), function(data) {
                    if (data.Status == 0) {
                        var treeobj = $("#orgnizetree").data("kendoTreeView");
                        var selectedNode = treeobj.select();
                        getData(parseInt($(selectedNode).find('.k-state-selected span').attr("nodeid")));
                    } else {
                        BzAlert(data.Message);
                    }
                });
            }
            //添加标签
        self.addTag = function(e, event) {

            var ss = this;

            var obj = $(event.target).data("BZ-editer");
            if (obj == undefined) {
                $(event.target).editer({
                    url: "/Document/AddTag",
                    title: "请输入名称",
                    Ok: function(name) {
                        this.close();
                        //参数:TagName  TagParamterId
                        var pdata = {
                            TagId: 1,
                            TagName: name,
                            TagParamterId: ss.DirectoryId(),
                            TagTittle: ss.DirectoryName(),
                            TagUrl: "/Doument/file"
                        }
                        $.post("/Document/AddTag", JSON.stringify({ tag: pdata }), function(data) {
                            if (data.Status == 0) {
                                getData(ss.ParentId());

                                BzSuccess(data.Message);
                            } else {
                                BzAlert(data.Message);
                            }
                        });
                    }
                });
            }
        }
        self.flag = true; //新增
        self.tree_addRootNode = function() { //添加根节点
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var obj = treeobj.append({
                text: '新节点',
                id: null,
                icon: "icon-folder-close-alt",
                PID: 0
            }, null);
            treeobj.select(obj);
            this.flag = true;
            $("#tree_edit").trigger('click');

        };
        self.tree_add = function() {
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var selectedNode = treeobj.select();
            if (selectedNode.length > 0) {
                var obj = treeobj.append({
                    text: '新节点',
                    id: null,
                    icon: "icon-folder-close-alt",
                    PID: parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid"))
                }, selectedNode);
                treeobj.select(obj);
                this.flag = false;
                $("#tree_edit").trigger('click');
            } else {
                BzAlert($.Translate("Common.SELECT_NODE"));
            }

        };
        self.tree_edit = function() {
            var ss = this;
            var treeobj = $("#orgnizetree").data("kendoTreeView");
            var selectedNode = treeobj.select();

            if (selectedNode.length > 0) {
                var obj = selectedNode.find('.k-state-selected span').data("BZ-editer");
                if (obj == undefined) {
                    selectedNode.find('.k-state-selected span').editer({
                        url: "/Document/modifyFie",
                        title: '请输入名称',
                        Ok: function(name) {
                            this.close();
                            var treeobj = $("#orgnizetree").data("kendoTreeView");
                            if ($(treeobj.select()).find('.k-state-selected span').attr("nodeid") == "null") { //新增
                                var GroupInfo = {
                                    ParentId: ss.flag ? 0 : $(treeobj.select()).find('.k-state-selected span').attr("pid"),
                                    DirectoryName: name,
                                    IsFolder: 1,
                                }
                                $.post("/Document/AddFile", JSON.stringify({ docf: GroupInfo }), function(data) {
                                    if (data.Status == 0) {
                                        $(treeobj.select()).find('.k-state-selected span').html(name);
                                        $(treeobj.select()).find('.k-state-selected span').attr("pid", GroupInfo.ParentId);
                                        $(treeobj.select()).find('.k-state-selected span').attr("nodeid", data.Data);
                                        //获取选择文件夹的ID
                                        $("#fileupload").data("blueimp-fileupload")._setOption("formData", { pid: data.Data });
                                        BzSuccess(data.Message);
                                    } else {
                                        BzAlert(data.Message);
                                    }
                                });
                            } else {
                                var GroupInfo = {
                                    DirectoryName: name,
                                    DirectoryId: parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid")),
                                }
                                $.post("/Document/modifyFie", JSON.stringify(GroupInfo), function(data) {
                                    if (data.Status == 0) {
                                        var treeobj = $("#orgnizetree").data("kendoTreeView");
                                        //$(treeobj.select()).find('.k-state-selected span').html(JSON.parse(this.data).GP_NAME);
                                        $(treeobj.select()).find('.k-state-selected span').html(name);
                                        BzSuccess(data.Message);
                                    } else {
                                        BzAlert(data.Message);
                                    }
                                });
                            }
                        },
                        Close: function(name) {
                            var treeobj = $("#orgnizetree").data("kendoTreeView");
                            if ($(treeobj.select()).find('.k-state-selected span').attr("nodeid") == "null") {
                                //删除节点
                                //treeobj.findByText("bar");
                                var aa = treeobj.select();
                                treeobj.remove(aa);
                            }
                        }
                    });
                } else {
                    obj.show();
                }
            }
        };
        self.tree_delete = function() {
            BzConfirm('请确认是否要删除数据', function(e) {
                if (e) {
                    var treeobj = $("#orgnizetree").data("kendoTreeView");
                    $.post("/Document/DelFile", JSON.stringify({ fileId: $(treeobj.select()).find('.k-state-selected span').attr("nodeid") }), function(data) {
                        if (data.Status == 0) {
                            var selectedNode = treeobj.select();
                            treeobj.remove(selectedNode);
                            ko.mapping.fromJS(u.list([]), viewModel);
                            BzSuccess(data.Message);
                        } else {
                            BzAlert(data.Message);
                        }
                    });
                }
            });
        };
        self.grid_rename = function() {
            //重命名
            var dd = this.list();
            var documents = [];
            for (var i = 0; i < dd.length; i++) {
                if (dd[i].checkedDocument()) {
                    documents.push(dd[i]);
                }
            }
            if (documents.length != 1) {
                BzAlert("请选择一个文件重命名");
                return;
            }
            $.x5window("重命名", kendo.template($("#popup-rename").html()));
            $("#DirectoryName").val(documents[0].DirectoryName());
            $("#DirectoryName_new").val(documents[0].DirectoryName()).focus();
            $("#Win_Submit").bind("click", function(e) {
                var data = {
                    ParentId: documents[0].ParentId(),
                    DirectoryId: documents[0].DirectoryId(),
                    DirectoryName: $("#DirectoryName_new").val()
                };
                $.post("/Document/DocumentmodifyFie", JSON.stringify(data), function(data) {
                    if (data.Status == 0) {
                        $("#x5window").data("kendoWindow").close();
                        var treeobj = $("#orgnizetree").data("kendoTreeView");
                        var fileID = parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid"));
                        getData(fileID);
                        BzSuccess(data.Message);
                    } else {
                        BzAlert(data.Message);
                    }
                });
            });
        };
        self.grid_delete = function() {
            var dd = this.list();
            var documents = [];
            for (var i = 0; i < dd.length; i++) {
                if (dd[i].checkedDocument()) {
                    console.log()
                    documents.push(dd[i].DirectoryId());
                }
            }
            if (documents.length == 0) {
                BzAlert("请选择一个文件");
                return;
            }
            BzConfirm('删除', function(e) {
                if (e) {
                    $.post(baseUrl + "DelSubFile", JSON.stringify({ liids: documents }), function(data) {
                        if (data.Status == 0) {
                            var treeobj = $("#orgnizetree").data("kendoTreeView");
                            var fileID = parseInt($(treeobj.select()).find('.k-state-selected span').attr("nodeid"));
                            getData(fileID);
                            BzSuccess(data.Message);
                        } else {
                            BzAlert(data.Message);
                        }
                    });
                }
            });
        };
        self.detail = function(e) {
            this.viewStyle(true);
        };
        self.imgview = function() {
            this.viewStyle(false);
        };
        self.download = function() {
            var url = "/Document/download?file=" + this.DirectoryId() + '.' + this.DirectoryName().split('.').splice(-1)[0] + "&name=" + this.DirectoryName();
            window.open(url);
        }


    }
    u = new koModel();
    viewModel = ko.mapping.fromJS(u);
    ko.applyBindings(viewModel);

    $("#tree_expand").toggle(function() {
        $("#orgnizetree").data("kendoTreeView").expand(".k-item");
    }, function() {
        $("#orgnizetree").data("kendoTreeView").collapse(".k-item");
    });

    $('#filter').bind('keypress', function(event) {
        if (event.keyCode == "13") {
            getDataByKeyWord();
        }
    });
    if ($.getparam("id") != null) {
        $.get(baseUrl + "GetDocumentInfByTagID", { id: $.getparam("id") }, function(data) {
            if (data.Status == 0) {
                var tjson = {};
                data.Data["CreateDate"] = moment(data.Data.CreateDate).format("YYYY-MM-DD HH:mm:ss");
                data.Data["ModifyDate"] = moment(data.Data.ModifyDate).format("YYYY-MM-DD HH:mm:ss");
                data.Data["FileType"] = data.Data.DirectoryName.split(".")[1];
                data.Data["checkedDocument"] = false;
                data.Data["FileSize"] = (data.Data.FileSize / 1024).toFixed(1);
                //data.Data[m]["checkedDocument2"] = false;
                ko.mapping.fromJS(u.list([data.Data]), viewModel);
            } else {
                BzAlert(data.Message);
            }
        });

    }
});

function getDataByKeyWord() { //关键字查询
    var filename = $("#filter").val();
    $.get(baseUrl + "GetFileInfoByFileName", { filename: filename }, function(data) {
        if (data.Status == 0) {
            for (var m = 0; m < data.Data.length; m++) {
                data.Data[m]["CreateDate"] = moment(data.Data[m].CreateDate).format("YYYY-MM-DD HH:mm:ss");
                data.Data[m]["ModifyDate"] = moment(data.Data[m].ModifyDate).format("YYYY-MM-DD HH:mm:ss");
                data.Data[m]["FileType"] = data.Data[m].DirectoryName.split(".")[1];
                data.Data[m]["checkedDocument"] = false;
                data.Data[m]["FileSize"] = (data.Data[m].FileSize / 1024).toFixed(1);
                //data.Data[m]["checkedDocument2"] = false;
            }
            ko.mapping.fromJS(u.list(data.Data), viewModel);
        } else {
            BzAlert(data.Message);
        }
    });
}


//*获取文档列表
function GetDocumentList11(chtml, callback) {
    function _callback(data) {
        callback(data);
    }
    $.post("/Document/GetAllFiles", JSON.stringify({ pid: 0 }), function(data) {
        if (data.Status == 0) {
            $("#orgnizetree").kendoTreeView({
                dataSource: {
                    data: fomattree(gettree_document(data.Data, "icon-folder-close-alt"))
                },
                template: kendo.template(chtml),
                select: function(e) {
                    if (typeof(callback) != "undefined") {
                        _callback(e.node); //
                    }
                }
            }).data("kendoTreeView");
            $("#tree_addRootNode").show();
        } else {
            BzAlert(data.Message);
        }
    });
}