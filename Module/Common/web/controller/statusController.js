 var selectStatus; var selectDelete;
 var paper;
 var validator;
app.controller('statusctrl', ['$scope', '$http', function ($scope, $http) {

    $(".statusattr").blur(function () {
        //update状态
        var data = {
            ID: $("#STATUS_NBR").val(),
            Name: $("#NAME").val(),
            Color: $("#COLOR16").val(),
            Level: $("#LEVEL").val(),
            Expected: $("#PLANED").data("kendoDropDownList").value() == 1 ? true : false
        };
        if ($("#STATUS_NBR").val() != "" && $("#NAME").val() != "") {
            $.post("/statusdata/UpdateStatusData", data, function (data) {
                if (data.Status == 0) {
                    getStatusData();
                }
                else {
                    BzAlert(data.Message);
                }
            });
        }
    });

    $("#COLOR16").colorpicker({
        format: 'hex'
    });
    $("#PLANED").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { text: "计划内", value: 0 },
            { text: "计划外", value: 1 },
            { text: "无", value: 2 }

        ],
        change: onChange,
        value: 1
    });
    function onChange() {
        var value = $("#PLANED").val();
        $("#downMemu").toggleClass("计划外", value == 0).toggleClass("计划内", value == 1).toggleClass("无", value == 2);
    };
    //初始化画板
    paper = Raphael("StatusMap", 1000, 800);
    //获取状态数据
    getStatusData();

}])

function addStatus(level) {
    var data = {
        ID: $("#add_ID").val(),
        Name: $("#add_Name").val(),
        Color: $(".colorpicker-default").val(),
        Level: level,
        Expected: $('input[name="Expected"]:checked').val()
    };
    $.post("/statusdata/NewStatus",data, function (data) {
        if (data.Status == 0) {
            //BzSuccess(data.Message);
            $("#x5window").data("kendoWindow").close();
            getStatusData();
        }
        else {
            BzAlert(data.Message);
        }
    });
}

function getStatusData() {
    paper.clear();
    paper.rect(0, 0, 1000, 800, 0)
        .attr({
            "fill": "#FFFFFF",
            "stroke-width": 0
        }).click(function () {
            if (selectStatus != undefined) {
                selectStatus.remove();
            }
            if (selectDelete != undefined) {
                selectDelete.remove();
            }
        });
    //获取状态数据
    $.post("/statusdata/GetStatusData", null, function (data) {
        var data = data.Data;
        var array = {};
        for (var i = 0; i < data.length; i++) {
            if (array[data[i].LEVEL] == undefined) {
                array[data[i].LEVEL] = [];
                array[data[i].LEVEL].push(data[i]);
            }
            else {
                array[data[i].LEVEL].push(data[i]);
            }
        }
        //计算max
        var max = 0;
        var levels = 1;
        for (var m in array) {
            max = Math.max(max, (m == 1) ? array[m].length : array[m].length + 1);//不是第一级的要加上1
            levels++;
        }
        //绘制machine位置
        //默认状态宽*高=80*40
        //计算image位置
        var imagex, imagey;
        var x = 100, y = 100;//偏移量
        var space_Horizontal = 110, space_Vertical = 20;
        var status_w = 80, status_h = 40;
        var mapWidth = (levels - 1) * (status_w + space_Horizontal) + machine_width;//100为图片宽度
        var mapHeight = max * status_h + (max - 1) * space_Vertical;
        var machine_width = 100, machine_height = 68;
        imagex = x;
        imagey = mapHeight / 2 - machine_height / 2 + y; //34为图片高度一半
        paper.image("./Common/web/images/Machine.png", imagex, imagey, machine_width, machine_height);
        //绘制状态
        var k = 0;
        for (var m in array) {

            //计算偏移量
            var xx = x + machine_width + space_Horizontal + k * (status_w + space_Horizontal), yy = y;
            //绘制连线
            var tempstrpath = "M" + (xx - 95) + " " + (imagey + machine_height / 2) + "l80 0";
            paper.path(tempstrpath).attr({
                "stroke": "#1F262D",
                "stroke-width": 1,
                "arrow-end": "open-wide-long" //类型：classic、block、open、oval、diamond、none，宽：wide、narrow、midium，长：long 、short、midium
            });
            var length = array[m].length;
            if (m == "1") {
                if (length < max) {
                    yy = y + (mapHeight - length * status_h - (length - 1) * space_Vertical) / 2;
                }
                //虚线框
                paper.rect(xx - 10, yy - 10, status_w + 20, (length * status_h + (length - 1) * space_Vertical) + 20, 0)
                    .attr({
                        "stroke-width": 1,
                        "stroke": "#000000",
                        "stroke-dasharray": "--"
                    });
            }
            else {
                if ((length + 1) < max) {
                    yy = y + (mapHeight - (length + 1) * status_h - length * space_Vertical) / 2;
                }
                //虚线框
                paper.rect(xx - 10, yy - 10, status_w + 20, ((length + 1) * status_h + length * space_Vertical) + 20, 0)
                    .attr({
                        "stroke-width": 1,
                        "stroke": "#000000",
                        "stroke-dasharray": "--"
                    });
            }
            paper.text(xx + status_w / 2, yy - 30, m+"级状态")
                .attr({
                    "font-size": 13,
                    "font-family": "Arial",
                    "stroke": "#7D848B",
                    "font-weight": "bold",
                    "fill": "#7D848B",
                    "stroke-width": 0
                });
            for (var n = 0; n < length; n++) {
                paper.rect(xx, yy + n * (status_h + space_Vertical), status_w, status_h, 0)
                    .attr({
                        "fill-opacity": 1,
                        "fill": array[m][n].COLOR16,
                        "stroke-width": 1,
                        "stroke": "#000000"
                    });
                paper.text(xx + status_w / 2, yy + n * (status_h + space_Vertical) + status_h / 2, array[m][n].NAME)
                    .attr({
                        "font-size": 13,
                        "font-family": "Arial",
                        "stroke": "#FFFFFF",//7D848B
                        "font-weight": "bold",
                        "fill": "#FFFFFF",
                        "stroke-width": 0
                    });
                //状态图
                paper.rect(xx, yy + n * (status_h + space_Vertical), status_w, status_h, 0)
                    .attr({
                        "fill-opacity": 0,
                        "fill": "#FFFFFF",
                        "stroke-width": 0,
                        "stroke": "#000000",
                        "cursor": "pointer"
                    })
                    .data("LEVEL", array[m][n].LEVEL)
                    .data("ID", array[m][n].STATUS_NBR)
                    .data("COLOR", array[m][n].COLOR16)
                    .data("NAME", array[m][n].NAME)
                    .data("PLANED", array[m][n].PLANED)
                    .click(function (e) {
                        //绘制选择框
                        var x = this.attrs.x;
                        var y = this.attrs.y;
                        var width = this.attrs.width;
                        var height = this.attrs.height;
                        if (selectStatus != undefined) {
                            selectStatus.remove();
                        }
                        if (selectDelete != undefined) {
                            selectDelete.remove();
                        }
                        var objdata = {
                            NAME: this.data("NAME"), COLOR: this.data("COLOR"), ID: this.data("ID"), LEVEL: this.data("LEVEL"), PLANED: this.data("PLANED")
                        };
                        selectStatus = paper.rect(x - 5, y - 5, width + 10, height + 10, 0)
                            .attr({
                                "stroke-width": 1,
                                "stroke": "#FF0000",
                                "stroke-dasharray": "--"
                            }).data("data", objdata);
                        //update 属性
                        if (objdata.LEVEL == 1) {
                            $("#STATUS_NBR").attr("disabled", "disabled");
                            $("#NAME").attr("disabled", "disabled");
                            $("#LEVEL").attr("disabled", "disabled");
                        }
                        else {
                            //$("#STATUS_NBR").removeAttr("disabled");
                            $("#NAME").removeAttr("disabled");
                            //$("#LEVEL").removeAttr("disabled");

                            selectDelete = paper.image("./Common/web/images/Delete.png", x + status_w + 7, y + status_h - 6, 12, 12)
                                .click(function () {
                                    //删除状态
                                    BzConfirm("删除状态", function (e) {
                                        if (e) {
                                            $.post("/statusdata/DeleteStatus", JSON.stringify({ ID: selectStatus.data("data").ID }), function (data) {
                                                if (data.Status == 0) {
                                                    getStatusData();
                                                }
                                                else {
                                                    BzAlert(data.Message);
                                                }
                                            });
                                        }
                                    });
                                });
                        }
                        $("#STATUS_NBR").val(objdata.ID);
                        $("#NAME").val(objdata.NAME);
                        $("#COLOR16").val(objdata.COLOR);
                        $("#COLOR16").data("colorpicker").update();
                        $("#LEVEL").val(objdata.LEVEL);
                        $("#PLANED").data("kendoDropDownList").value(objdata.PLANED);
                    });
                if (m != "1") {
                    if (n == length - 1) {
                        paper.rect(xx, yy + (n + 1) * (status_h + space_Vertical), status_w, status_h, 0)
                            .attr({
                                "fill-opacity": 0,
                                "stroke-width": 1,
                                "stroke": "#000000"
                            });
                        paper.circle(xx + status_w / 2, yy + (n + 1) * (status_h + space_Vertical) + status_h / 2, 8)
                            .attr({
                                "fill-opacity": 1,
                                "fill": "#000000",
                                "stroke-width": 1,
                                "stroke": "#000000"
                            });
                        paper.rect(xx + status_w / 2 - 1, yy + (n + 1) * (status_h + space_Vertical) + status_h / 2 - 6, 2, 12, 0)
                            .attr({
                                "fill-opacity": 1,
                                "fill": "#FFFFFF",
                                "stroke-width": 1,
                                "stroke": "#FFFFFF"
                            });
                        paper.rect(xx + status_w / 2 - 6, yy + (n + 1) * (status_h + space_Vertical) + status_h / 2 - 1, 12, 2, 0)
                            .attr({
                                "fill-opacity": 1,
                                "fill": "#FFFFFF",
                                "stroke-width": 1,
                                "stroke": "#FFFFFF"
                            });
                        paper.rect(xx, yy + (n + 1) * (status_h + space_Vertical), status_w, status_h, 0)
                            .attr({
                                "fill-opacity": 0,
                                "fill": "#FFFFFF",
                                "stroke-width": 0,
                                "stroke": "#000000",
                                "cursor": "pointer"
                            })
                            .data("LEVEL", array[m][n].LEVEL)
                            .data("ID", array[m][n].STATUS_NBR)
                            .data("COLOR", array[m][n].COLOR16)
                            .data("NAME", array[m][n].NAME)
                            .data("PLANED", array[m][n].PLANED)
                            .click(function () {
                                $.x5window("新增", kendo.template($("#popup-add").html()));
                                App.initUniform();
                                $('.colorpicker-default').colorpicker({
                                    format: 'hex'
                                });
                                $("#Win_Ok").bind("click", { level: this.data("LEVEL") }, function (event) {
                                    if (validator.form()) {
                                        addStatus(event.data.level);
                                    }
                                });
                                validator = $("#viewmodel").validate({
                                    rules: {
                                        add_ID: { required: true, digits: true, maxlength: 9 },
                                        add_Name: { required: true }

                                    },
                                    messages: {
                                        add_ID: {
                                            required: "不可为空！",
                                            maxlength: "请输入9位数以内的整数",
                                            digits: "请输入整数"
                                        },
                                        add_Name: { required: "不可为空！" }
                                    }
                                });
                            });
                    }
                }
            }
            k++;
        }

        //绘制最后一个节点
        if (k == 1) {
            //计算偏移量
            var last_xx = x + machine_width + space_Horizontal + k * (status_w + space_Horizontal);
            var last_yy = y + (mapHeight - status_h) / 2;
            //绘制连线
            var tempstrpath = "M" + (last_xx - 95) + " " + (imagey + machine_height / 2) + "l80 0";
            paper.path(tempstrpath).attr({
                "stroke": "#1F262D",
                "stroke-width": 1,
                "arrow-end": "open-wide-long" //类型：classic、block、open、oval、diamond、none，宽：wide、narrow、midium，长：long 、short、midium
            })
            paper.rect(last_xx, last_yy, status_w, status_h, 0)
                .attr({
                    "fill-opacity": 0,
                    "stroke-width": 1,
                    "stroke": "#000000"
                });
            paper.circle(last_xx + status_w / 2, last_yy + status_h / 2, 8)
                .attr({
                    "fill-opacity": 1,
                    "fill": "#000000",
                    "stroke-width": 1,
                    "stroke": "#000000"
                });
            paper.rect(last_xx + status_w / 2 - 1, last_yy + status_h / 2 - 6, 2, 12, 0)
                .attr({
                    "fill-opacity": 1,
                    "fill": "#FFFFFF",
                    "stroke-width": 1,
                    "stroke": "#FFFFFF"
                });
            paper.rect(last_xx + status_w / 2 - 6, last_yy + status_h / 2 - 1, 12, 2, 0)
                .attr({
                    "fill-opacity": 1,
                    "fill": "#FFFFFF",
                    "stroke-width": 1,
                    "stroke": "#FFFFFF"
                });
            paper.rect(last_xx, last_yy, status_w, status_h, 0)
                .attr({
                    "fill-opacity": 0,
                    "fill": "#FFFFFF",
                    "stroke-width": 0,
                    "stroke": "#000000",
                    "cursor": "pointer"
                })
                .data("LEVEL", k + 1)
                .click(function () {
                    $.x5window("新增", kendo.template($("#popup-add").html()));
                    App.initUniform();
                    $('.colorpicker-default').colorpicker({
                        format: 'hex'
                    });
                    $("#Win_Ok").bind("click", { level: this.data("LEVEL") }, function (event) {
                        if (validator.form()) {
                            addStatus(event.data.level);
                        }
                    });

                    validator = $("#viewmodel").validate({
                        rules: {
                            add_ID: { required: true, digits: true, maxlength: 9 },
                            add_Name: { required: true }
                        },
                        messages: {
                            add_ID: {
                                required: "不可为空！",
                                maxlength: "请输入9位数以内的整数",
                                digits: "请输入整数"
                            },
                            add_Name: { required: "不可为空！" }
                        }
                    });
                });
        }
    })
}