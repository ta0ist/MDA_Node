(function($, undefined) {
    $.widget("BZ.VisualConfig", {
        options: {
            headShow: true, //head区域是否显示
            footShow: true, //foot区域是否显示
            notice: true,
            pagePar: [ //页面显示内容参数配置，此处数组的个数决定了页面的数目
                {
                    url: "/Visual/View/GetImmediateState",
                    demo: true,
                    name: "factoryView",
                    type: "view",
                    showtimes: 5,
                    time: 3000,
                    id: 1
                },
                {
                    url: "/Visual/View/GetImmediateState",
                    demo: true,
                    name: "statusTable",
                    type: "table",
                    time: 3000,
                    columns: [
                        //{ field: "NULL", title: "", width: "5%" },
                        //{ field: "NO", title: $.Translate("Visual.NO"), width: "5%" },
                        { field: "MAC_NAME", title: "机床名称", width: "10%" },
                        { field: "STATUS_NAME", title: "状态名称", width: "10%" },
                        { field: "RUNNING_DATE", type: "datetime", title: "起始时间", width: "15%" },
                        { field: "DURATION", title: "持续时间", width: "15%" },
                        //{ field: "PERSON", title: $.Translate("Visual.PERSON"), width: "10%" },
                        //  { field: "TASK", title: $.Translate("Visual.TASK"), width: "10%" },
                        //{ field: "STOP_REASON", title: $.Translate("Visual.STOP_REASON"), width: "15%" },
                        //{ field: "ALARM_REASON", title: $.Translate("Visual.ALARM_REASON"), width: "15%" },
                        // { field: "YEILD", title: $.Translate("Visual.YEILD"), width: "10%" }
                    ]
                },
                {
                    url: "/visuals/r/GetYieldByProgramRate",
                    demo: true,
                    name: "shiftRatio",
                    type: "table",
                    time: 10000,
                    columns: [

                        { field: "MAC_NAME", title: "设备", width: "10%" },
                        { field: "PROG_NAME", title: "程序号", width: "15%" },
                        //{ field: "PROG_PLAN_CNT", title: "计划工件完成量", width: "20%" },
                        { field: "COUNT", title: "实际产量", width: "20%" },
                        //{ field: "YIELD_RATIO", title: "工件完成率", width: "15%" },
                        { field: "TIME_STR", title: "总用时", width: "20%" },
                        { field: "AVG_TIME_STR", title: "平均用时", width: "20%" }
                    ]
                },
                {
                    url: "/Visual/View/GetShiftActivation",
                    demo: true,
                    name: "activation",
                    type: "chart",
                    time: 10000
                }
            ]
        },
        _init: function() {
            window.onresize = function() {
                $.VisualConfig.Onresize();
            }
            this.Onresize();
        },
        _create: function() {

            var self = this;
            $.VisualConfig = this;
            //全局ajax
            $.ajaxSetup({
                global: true,
                type: "POST",
                dataType: "json",
                cache: false,
                async: false,
                contentType: 'application/json',
                beforeSend: function(xhr, data) {
                    if (data && data.type == "POST" && $("#ajaxLoading").length == 0) {
                        $("body").append("<div id='ajaxLoading' style='top:0;right:0;padding:5px;background-color:red;position:absolute;z-index:999999;width:120px;text-align:center;'><span style='color:#fff;' class='font16'><i class='fa fa-refresh fa-spin'></i> _ 处理中...</span></div>");
                    }
                },
                complete: function() {
                    $("#ajaxLoading").remove();
                },
                error: function(o) {
                    //if (o.responseText != null) {
                    //    alert("错误:" + o.responseText);
                    //}
                    $("#ajaxLoading").remove();
                    return false;
                }
            });
            //***********************************
            //读取配置文件
            $.get('/visuals/r/ReadyFile?path=' + $('#path').html(), function(data) {
                if (data.Status == 0) {
                    var rdata = JSON.parse($.trim(data.Data));
                    self.options.setting = rdata;
                    //设置背景 
                    $('body').css({
                            'background-color': self.options.setting.page_head.backgroundColor
                        })
                        //
                    self.options.pagePar = [];
                    var pagename = {
                        1: { name: "factoryView", type: "view" },
                        2: { name: "shiftRatio", type: "table" },
                        3: { name: "yieldTrend", type: "chart" },
                        4: { name: "shiftRatio", type: "table" },
                        5: { name: "activation", type: "chart" },
                        6: { name: "statusRatio", type: "chart" },
                        7: { name: "camera", type: "chart" }
                    }
                    for (var i = 0; i < rdata.page_body.pages.length; i++) {
                        var tjson = {
                            url: rdata.page_body.pages[i].url,
                            demo: rdata.page_body.pages[i].demo,
                            name: pagename[rdata.page_body.pages[i].pageid].name,
                            type: pagename[rdata.page_body.pages[i].pageid].type,
                            time: rdata.page_body.pages[i].time,
                            bind_data: rdata.page_body.pages[i].bindData
                        }
                        if (rdata.page_body.pages[i].pageid == 1) { //pageid == 1 为车间布局图界面
                            tjson["showtimes"] = Math.floor(rdata.page_body.pages[i].time / 5000); //5秒采集频率
                            tjson["maps"] = rdata.page_body.pages[i].maps;
                        } else if (rdata.page_body.pages[i].pageid == 2 || rdata.page_body.pages[i].pageid == 4) {
                            tjson["columns"] = rdata.page_body.pages[i].fileds;
                        } else if (rdata.page_body.pages[i].pageid == 3) {
                            tjson["plot_value"] = rdata.page_body.pages[i].plot_value;
                            tjson["backcolor"] = rdata.page_head.backgroundColor;
                        }
                        self.options.pagePar.push(tjson);
                    }
                } else {
                    BzAlert(data.Message);
                }
            })



            //***********************************



            var logimg;
            //计算放大比例
            if (this._getPgis() == "pc") {
                this.times = Math.sqrt((window.screen.width * window.screen.height) / (1366 * 768));
                less.modifyVars({
                    '@times': this.times
                });
                logimg = self.options.setting.page_head.logo_img;
                if (window.Event)
                    document.captureEvents(Event.MOUSEUP);

                function nocontextmenu(event) {
                    event.cancelBubble = true
                    event.returnValue = false;
                    return false;
                }

                function norightclick(e, event) {
                    if (window.Event) {
                        if (e.which == 3) { //右键
                            //计算菜单位置
                            $("#menu").removeAttr("style");
                            var posit = {};
                            if (($("#menu").width() + e.clientX) > $(window).width()) {
                                posit.left = ($(window).width() - $("#menu").width() - 20) + "px";
                            } else {
                                posit.left = e.clientX + "px";
                            }
                            if (($("#menu").height() + e.clientY) > $(window).height()) {
                                posit.top = ($(window).height() - $("#menu").height() - 20) + "px";
                            } else {
                                posit.top = e.clientY + "px";
                            }

                            posit.position = "absolute";
                            $("#menu").css(posit).show();
                        }
                    } else
                    if (event.button == 2 || event.button == 3) {
                        event.cancelBubble = true
                        event.returnValue = false;
                        return false;
                    }
                }
                document.oncontextmenu = nocontextmenu; // for IE5+ 
                document.onmousedown = norightclick; // for all others
            } else {
                this.times = 1;
                this.timeOutEvent = 0; //定时器 
                less.modifyVars({
                    '@times': 1
                });
                logimg = self.options.setting.page_head.logo_img;
                $("body").on({
                    "touchstart": function(e) {
                        //开始按 
                        $.VisualConfig.timeOutEvent = setTimeout(function() {
                            $.VisualConfig.timeOutEvent = 0;
                            //执行长按要执行的内容，如弹出菜单 
                            $("#menu li a").css({
                                "color": "#333",
                                "background-color": "transparent"
                            });
                            ////取消焦点
                            $("#menu li a").blur();
                            $("#menu").css({
                                "position": "absolute",
                                "top": "10px",
                                "left": ($(window).width() - $("#menu").width() - 10) + "px"
                            }).show();
                        }, 2000); //这里设置定时器，定义长按500毫秒触发长按事件
                    },
                    "touchmove": function() {
                        clearTimeout($.VisualConfig.timeOutEvent); //清除定时器 
                        $.VisualConfig.timeOutEvent = 0;
                    },
                    "touchend": function() {
                        clearTimeout($.VisualConfig.timeOutEvent); //清除定时器 
                        if ($.VisualConfig.timeOutEvent != 0) {
                            //这里写要执行的内容（尤如onclick事件） 
                            //alert("你这是点击，不是长按");
                        }
                    }
                });
            }
            this.OldWith = 0;
            this.OldHeight = 0;

            //*****************************
            this.element.empty();

            this.element.append('<table border="0" width="100%" cellpadding="0" cellspacing="0">' +
                '<tr>' +
                '<td id="head"><div style="padding-left: 5px;display: inline-flex;">' +
                '<img id="logo" src="./Visual/web/image/' + logimg + '" style="position: relative;top: 5px;height:45px;"/>' +
                '<span id="title" style="  position: relative;top: 5px;left: 5px;font-size:' + self.options.setting.page_head.fontSize + ';font-family:' + self.options.setting.page_head.fontFamily + ';color:' + self.options.setting.page_head.color + '">' + self.options.setting.page_head.title + '</span><div id="imgtest"><ul><li style="list-style-type:none;"><img id="barcode" src="./Visual/web/image/bandexsoft.jpg" style="width: 60px; height: 60px;margin-left: 10;" /><--放大</li></ul></div></div></td>' +
                '</tr>' +
                '<tr>' +
                '<td valign="top" align="center" valign="top" style="border:0px solid yellow;">' +
                '<div id="context" style="border:0px solid red;"></div>' +
                '</td>' +
                '</tr>' +
                '<tr>' +
                '<td id="foot">' +
                '<div>' +
                '<marquee behavior="scroll" direction="left" scrollamount="5" width="100%" style="position: absolute;bottom: 0px;">' +
                '<p id="marquee_text" style="margin-bottom: 0px; border:0px solid red;"><span id="accountmesg"></span><span id="servicemesg"></span></p>' +
                '</marquee>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '</table>');
            var offsetX = 20 - $("#barcode").offset().left;
            var offsetY = 20 - $("#barcode").offset().top;
            var size = 4 * $('#imgtest ul li img').width();
            $("#barcode").mouseover(function(event) {
                var $target = $(event.target);
                if ($target.is('img')) {
                    $("<img id='tip' src='" + $target.attr("src") + "'>").css({
                        "height": size,
                        "width": size,
                        "top": event.pageX + offsetX,
                        "left": event.pageY + offsetY,
                    }).appendTo($("#imgtest"));
                }
            }).mouseout(function() {
                $("#tip").remove();
            }).mousemove(function() {
                $("#tip").css({
                    "left": event.pageX + offsetX,
                    "top": event.pageY + offsetY
                });
            });
            this.element.append('<ul id="menu" style="display:none;" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">' +
                //'<li role="presentation" data-attr="wid"><a role="menuitem" tabindex="-1" href="#">' + $.Translate("Visual.MAC_GROUP") + '</a></li>' +
                //'<li role="presentation" data-attr="page"><a role="menuitem" tabindex="-1" href="#">' + $.Translate("Visual.SELEC_PAGE") + '</a></li>' +
                //'<li role="presentation" data-attr="toggle"><a role="menuitem" tabindex="-1" href="#">' + $.Translate("Visual.CLCLE") + '</a></li>' +
                //'<li role="presentation" data-attr="head"><a role="menuitem" tabindex="-1" href="#">' + $.Translate("Visual.TITLE") + '</a></li>' +
                //'<li role="presentation" data-attr="foot"><a role="menuitem" tabindex="-1" href="#">' + $.Translate("Visual.ACCOUNT") + '</a></li>' +
                //'<li role="presentation" class="divider"></li>' +
                //'<li role="presentation" data-attr="demo"><a role="menuitem" tabindex="-1" href="#">' + $.Translate("Visual.DEMO") + '</a></li>' +
                //'<li role="presentation" data-attr="normal"><a role="menuitem" tabindex="-1" href="#">' + $.Translate("Visual.NORMAL") + '</a></li>' +
                //'<li role="presentation" class="divider"></li>' +
                '<li role="presentation" data-attr="chinese"><a role="menuitem" tabindex="-1" href="#">' + "中文" + '</a></li>' +
                '<li role="presentation" data-attr="english"><a role="menuitem" tabindex="-1" href="#">' + "英文" + '</a></li>' +
                '<li role="presentation" class="divider"></li>' +
                //'<li role="presentation" data-attr="setup"><a role="menuitem" tabindex="-1" href="#">' + $.Translate("Visual.SETUP") + '</a></li>' +
                '<li role="presentation" data-attr="exit"><a role="menuitem" tabindex="-1" href="#">' + "退出" + '</a></li>' +
                '</ul>');
            if (this._getPgis() == "pc") {
                $("#menu li").bind("click", function(e) {
                    MenuEvent($(this).attr("data-attr"));
                    $("#menu").hide();
                    return false;
                });
            } else {
                $("#menu li").bind("touchstart", function(e) {
                    MenuEvent($(this).attr("data-attr"));
                    $(this).children().css({
                        "color": "#FFF",
                        "background-color": "#428BCA"
                    });
                    setTimeout(function() {
                        $("#menu").hide();
                    }, 200);
                    return false;
                });
                window.onorientationchange = function() {
                    //重刷URL
                    window.location.reload();
                }
            }

            function MenuEvent(attr) {
                switch (attr) {
                    case "wid":

                        break;
                    case "page":

                        break;
                    case "toggle":

                        break;
                    case "head":

                        break;
                    case "foot":

                        break;
                    case "demo":

                        break;
                    case "normal":

                        break;
                    case "chinese":
                        $.SetCurrentLanguage("zh-cn");
                        location.href = location.href;
                        break;
                    case "english":
                        $.SetCurrentLanguage("en-us");
                        location.href = location.href;
                        break;
                    case "setup":

                        break;
                    case "exit":

                        break;
                }
            }
            // if (self.options.notice) { //建立后台推送机制
            //     var MessagesHub = $.connection.messagesHub;
            //     MessagesHub.client.showMessage = function (perc) {
            //         var reList = JSON.parse(perc);
            //         var mes;
            //         if (reList.length > 0) {
            //             mes = "公告信息--";
            //         }
            //         else {
            //             mes = "";
            //         }
            //         for (var i = 0; i < reList.length; i++) {
            //             mes = mes + reList[i].CONTENT + ";   ";
            //         }
            //         $("#accountmesg").html(mes);
            //         //处理接收数据

            //     };
            //     MessagesHub.client.GetNoBeginApplay = function (perc) {
            //         var reList = JSON.parse(perc);
            //         var dd = [];
            //         for (var i = 0; i < reList.length; i++) {
            //             if (reList[i].WORKSHOP_CODE == self.url.wid) {
            //                 dd.push(reList[i]);
            //             }
            //         }
            //         var mes;
            //         if (dd.length > 0) {
            //             mes = "维修信息--";
            //         }
            //         else {
            //             mes = "";
            //         }
            //         for (var j = 0; j < dd.length; j++) {
            //             mes = mes + dd[j].MAC_NAME + "申请维修;   ";
            //         }
            //         $("#servicemesg").html(mes);
            //     };
            //     MessagesHub.client.lactionurl = function () { //刷新客户端url
            //         window.location.href = window.location;
            //     }
            //     $.connection.hub.start();
            // }
            //开始显示页面
            //1、根据设定值显示页面；2、根据url设定的page参数来显示页面；
            //获取所有的url参数
            self.url = {};
            self.url = {
                wid: self._getparam("wid"),
                page: self._getparam("page"),
                head: self._getparam("head"),
                foot: self._getparam("foot"),
                toggle: self._getparam("toggle"), //是否切换页面；当=false时不能切换页面
                model: self._getparam("model") //模式选择；1=演示模式；2=正常模式
                    //lang: self._getparam("lang")//语言选择
            };

            if (self.url.wid == null) {
                //BzAlert($.Translate("PleaseEnterAQueryLine"));
                //return;
                self.url.wid = "cj01";
            }
            if (self.url.wid == null || self.url.wid == "cj01")
                $("#title").eq(0).text("上海斑彰信息技术有限公司");
            else
                $("#title").eq(0).text("2");
            //初始加载维修单号信息
            // $.get("/Visual/View/GetNoBeginApplay", function (data) {
            //     if (data.Status == 0) {
            //         var dd = [];
            //         for (var i = 0; i < data.Data.length; i++) {
            //             if (data.Data[i].WORKSHOP_CODE == self.url.wid) {
            //                 dd.push(data.Data[i]);
            //             }
            //         }
            //         var mes;
            //         if (dd.length > 0) {
            //             mes = "维修信息--";
            //         }
            //         else {
            //             mes = "";
            //         }
            //         for (var j = 0; j < dd.length; j++) {
            //             mes = mes + dd[j].MAC_NAME + "申请维修;   ";
            //         }
            //         $("#servicemesg").html(mes);
            //         //BzSuccess(data.Message);
            //     }
            //     else {
            //         BzAlert(data.Message);
            //     }
            // })
            self.Index = 0; //全局索引
            if (self.url.page != null) {
                self.pg = self.url.page.split(",");
                self._showpage(parseInt(self.pg[0], 10));
            } else {
                self.pg = [];
                for (var i = 0; i < self.options.pagePar.length; i++) {
                    self.pg.push(i);
                }
                self._showpage(self.pg[0]);
            }

        },
        //获取设备类型
        _getPgis: function() {
            var agent = navigator.userAgent.toLowerCase();
            var res = agent.match(/android/);
            if (res == "android")
                return "android";
            res = agent.match(/iphone/);
            if (res == "iphone")
                return "iphone";
            res = agent.match(/ipad/);
            if (res == "ipad")
                return "ipad";
            res = agent.match(/windows/);
            if (res == "windows")
                return "pc";
            return "pc";
        },
        //自适应调整
        Onresize: function() {
            var newWidth = $(window).width();
            var newHeight = $(window).height();
            if (Math.abs($.VisualConfig.OldWith - newWidth) > 1 || Math.abs($.VisualConfig.OldHeight - newHeight) > 1) {
                $.VisualConfig.OldWith = newWidth;
                $.VisualConfig.OldHeight = newHeight;
                $.VisualConfig.Onresize();
            } else {
                setTimeout(function() {
                    $.VisualConfig._dd();
                    //alert($(window).width())
                }, 200);
            };
        },
        _dd: function() {
            this._ddSetHW($(window).width(), $(window).height())
        },
        _ddSetHW: function(ww, hh) {
            //alert(ww + "," + hh);
            var windowHeight = hh;
            var windowWidth = ww;
            $("#context").css("padding-top", "0px");
            //$("#context").height(windowHeight - $("#head").height() - $("#foot").height() - 5);
            //$("#context").width(windowWidth - 10);
            $("#context").height(windowHeight - $("#head").height() - $("#foot").height() - 5);
            $("#context").width(windowWidth - 10);
            if (typeof($.VisualConfig.paper) != "undefined") {
                var newViewWidth;
                var newViewHeight;
                //var windowHeight = $(window).height();
                //var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                var windowWidth = $(window).width();
                //alert(windowHeight + "," + windowWidth);
                newViewWidth = 1360 * 1360 / $("#context").width();
                newViewHeight = 680 * 680 / $("#context").height();
                if (newViewHeight < 680)
                    newViewHeight = 680;
                if (windowWidth <= 1366) {
                    $.VisualConfig.paper.setViewBox(0, 0, newViewWidth, newViewHeight, true);
                }
            }
        },
        _getparam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        _showpage: function(n) {
            var self = this;
            $("#context").hide("slide", { direction: "left" }, 1000, function() {
                $("#context").empty();
                $("#statusDetail").remove();
                //根据具体的页面显示内容
                switch ($.VisualConfig.options.pagePar[n].type) {
                    case "table":
                        $.VisualConfig[$.VisualConfig.options.pagePar[n].name].init($.VisualConfig.options.pagePar[n].columns);
                        break;
                    case "chart":
                    case "view":
                        $.VisualConfig[$.VisualConfig.options.pagePar[n].name].init();
                        break;
                }

                //this.options.hidepage.call(this, n);
                $("#context").show("slide", { direction: "right" }, 1000, function() {
                    //获取数据(是否是demo)
                    //this.options.showpage.call(this, n);
                    var self = $.VisualConfig;
                    //self.Index++;
                    if (self.options.pagePar[n].demo) {
                        self[self.options.pagePar[n].name].updatedatademo(self, self.options.pagePar[n].columns);
                    } else {
                        self[self.options.pagePar[n].name].updatedata(self, self.options.pagePar[n]);
                    }
                });
            });
        },
        _resizeRaphael: function(paper) {
            if (typeof(paper) != "undefined") {
                var newViewWidth;
                var newViewHeight;
                var windowHeight = $(window).height();
                var windowWidth = $(window).width();
                //alert(windowHeight + "," + windowWidth);
                newViewWidth = 1360 * 1360 / windowWidth;
                newViewHeight = 680 * 680 / windowHeight;
                if (newViewHeight < 680)
                    newViewHeight = 680;
                if (windowWidth <= 1366) {
                    paper.setViewBox(0, 0, newViewWidth, newViewHeight, true);
                }
            }
        },
        //****************各种插件*****************
        //车间布局图
        factoryView: {
            lang: {},
            init: function(npage) {
                this.showtimes = 0;
                this.CONFIG = {
                        //13T缸盖线
                        //说明：key--客户设备编号(唯一)【可以改动】;value--VISUAL内部设备编号(唯一)【不能改动】
                        "农机壳体01": "A001",
                        "农机阀座01": "A002"
                    }
                    //svg布局图
                $.VisualConfig.paper = Raphael("context", 1360, 680);
                this.MAC = drawFactoryView($.VisualConfig.paper, $.VisualConfig.url.wid);
                //渲染页面
                //this.MAC={};
                var page_no = $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]];
                $.VisualConfig._dd();
                //获取状态名称
                $.get("/visuals/r/GetStatus", function(data) {
                    var html = '<ul id="statusDetail" style="list-style:none;color:#FFFFFF;">'
                    for (var i = 0; i < data.Data.length; i++) {
                        html = html + '<li><label style="background-color:' + data.Data[i].COLOR16 + ';width: 30px;height: 15px;"></label><span style="margin-left: 10px;' +
                            'font-size: 12px;position:relative;top:-8px;">' + data.Data[i].NAME + '</span></li>';
                    }
                    html = html + '</ul>';
                    $('body').append(html);
                });
                //alert($(window).height() + "," + $(window).width());
                //$.VisualConfig._resizeRaphael(this.paper);
                $("tspan").attr("dy", 0);
            },
            updatedata: function(self, pobj) {
                this.showtimes++;
                this.demo = false;
                $.get("/visuals/r/GetImmediateState", { Page: $.VisualConfig.url.wid }, function(result) {
                    if (result.Status == 0) {
                        self.factoryView.UpdateTableView(result.Data);
                    } else {
                        BzAlert(result.Message);
                    }
                });
            },
            updatedatademo: function(self) {
                this.showtimes++;
                this.demo = true;
                $.get("/Visual/Demo/GetDemo", function(result) {
                    var page_no = $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]];
                    var result = {
                        Status: 0,
                        Data: page_no.bind_data,
                        Message: "mmm"
                    };
                    if (result.Status == 0) {
                        self.factoryView.UpdateTableView(result.Data);
                    } else {
                        BzAlert(result.Message);
                    }
                });
            },
            _update: function() {
                return function() {
                    var index = $.VisualConfig.Index;
                    if ($.VisualConfig.factoryView.showtimes < $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].showtimes) {
                        if ($.VisualConfig.factoryView.demo) {
                            $.VisualConfig.factoryView.updatedatademo($.VisualConfig);
                        } else {
                            $.VisualConfig.factoryView.updatedata($.VisualConfig);
                        }
                    } else {
                        $.VisualConfig.factoryView.showtimes = 0; //清零
                        $.VisualConfig.chageshowPage();
                    }
                }
            },
            UpdateTableView: function(data) {
                for (var i = 0; i < data.length; i++) {
                    var mac_no = data[i].MAC_NO;
                    if (this.MAC[mac_no] != undefined) {
                        this.MAC[mac_no].MAC.attr("fill", data[i].STATUS_COLOR);
                        //this.MAC[this.CONFIG[mac_no]].TEXT.attr("text", data[i].MAC_NAME);
                        if (data[i].MAC_NO == "#1") {
                            this.Move(data[i]);
                        }
                    }
                    // if(this.MAC[mac_no]=="#1")
                    // {
                    //      this.Move(data[i].STD::POS);
                    // }
                }

                $("tspan").attr("dy", 0);
                //console.log(new Date())
                //this.Move();
                setTimeout(this._update(), 5000, 0);
            }
        },
        //状态表
        statusTable: {
            lang: {},
            init: function(npage) {
                var strhtml = '<table border="0" width="99%" height="100%" cellspacing="0" cellpadding="0">' +
                    '<tr><td width="100%" class="visaltablehead">' +
                    '<table width="100%" border="0" cellpadding="0" cellspacing="5" bgcolor="#13364B"><tr class="titletd">';
                for (var i = 0; i < npage.length; i++) {
                    strhtml = strhtml + '<td class="td1" width="' + npage[i].width + '" align="Center" valign="middle">' + npage[i].title + '</td>'
                }
                strhtml = strhtml + '</tr></table></td></tr><tr><td width="100%" id="tabledata" valign="top"><table id="tabledataTable" width="100%" border="0" cellpadding="0" cellspacing="5" bgcolor="#13364B" style="margin-top:-1px;"><tbody class="datatd" id="TabData"></tbody></table></td></tr></table>';
                $("#context").append(strhtml);
                $.VisualConfig._dd();
                //$.VisualConfig._ddSetHW();
            },
            updatedata: function(self, pobj) {
                $.ajax({
                    url: pobj.url,
                    data: '{"Page":"' + self.url.wid + '"}',
                    success: function(result) {
                        if (result.Status == 0) {
                            self.statusTable.UpdateTableView(result.Data, pobj.columns);
                        } else {
                            BzAlert(result.Message);
                        }
                    }
                });
            },
            updatedatademo: function(self, columns) {
                $.get("/Visual/Demo/GetDemo", function(result) {
                    var result = {
                        Status: 0,
                        Data: [
                            { MAC_NO: "A_OP100", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#00FF00", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06", PERSON: "小A", TASK: "任务1", STOP_REASON: "停机1", ALARM_REASON: "报警1", YEILD: 100 },
                            { MAC_NO: "A_OP100", MAC_NAME: "加工中心", STATUS_NBR: 3, STATUS_NAME: "运行", STATUS_COLOR: "#00FF00", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06", PERSON: "小A", TASK: "任务1", STOP_REASON: "停机1", ALARM_REASON: "报警1", YEILD: 100 },
                            { MAC_NO: "A_OP100", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#00FF00", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06", PERSON: "小A", TASK: "任务1", STOP_REASON: "停机1", ALARM_REASON: "报警1", YEILD: 100 },
                            { MAC_NO: "A_OP100", MAC_NAME: "加工中心", STATUS_NBR: 4, STATUS_NAME: "运行", STATUS_COLOR: "#00FF00", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06", PERSON: "小A", TASK: "任务1", STOP_REASON: "停机1", ALARM_REASON: "报警1", YEILD: 100 },
                            { MAC_NO: "A_OP100", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#00FF00", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06", PERSON: "小A", TASK: "任务1", STOP_REASON: "停机1", ALARM_REASON: "报警1", YEILD: 100 },
                            { MAC_NO: "A_OP100", MAC_NAME: "加工中心", STATUS_NBR: 1, STATUS_NAME: "运行", STATUS_COLOR: "#00FF00", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06", PERSON: "小A", TASK: "任务1", STOP_REASON: "停机1", ALARM_REASON: "报警1", YEILD: 100 },
                            { MAC_NO: "A_OP100", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#00FF00", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06", PERSON: "小A", TASK: "任务1", STOP_REASON: "停机1", ALARM_REASON: "报警1", YEILD: 100 },
                            { MAC_NO: "A_OP100", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#00FF00", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06", PERSON: "小A", TASK: "任务1", STOP_REASON: "停机1", ALARM_REASON: "报警1", YEILD: 100 },
                            { MAC_NO: "A_OP100", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#00FF00", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06", PERSON: "小A", TASK: "任务1", STOP_REASON: "停机1", ALARM_REASON: "报警1", YEILD: 100 }

                        ],
                        Message: "mmm"
                    };
                    if (result.Status == 0) {
                        self.statusTable.UpdateTableView(result.Data, columns);
                    } else {
                        BzAlert(result.Message);
                    }
                    //var data = [];
                    //for (var mm in result.RELIST) {
                    //    data.push(result.RELIST[mm]);
                    //}
                    //self.statusTable.UpdateTableView(data, columns);
                });
            },
            UpdateTableView: function(reList, columns) {
                var NO = 1;
                var imgUrl;
                if (reList != null) {
                    //计算页数
                    var pages = 0;
                    var pageSize = parseInt(($("#tabledata").height() - 15) / (39 * $.VisualConfig.times), 10);
                    var pages = Math.ceil(reList.length / pageSize);
                    var m = 1;
                    this.showdataStatus(reList, m, pageSize, pages, columns);
                } else {
                    $("#TabData").empty();
                }
            },
            _showdataStatus: function(ddobjec, m, pageSize, pages, columns) {
                return function() {
                    $.VisualConfig.statusTable.showdataStatus(ddobjec, m, pageSize, pages, columns)
                }
            },
            showdataStatus: function(data, m, pageSize, pages, columns) {
                if (m <= pages) {
                    var NO = 1;
                    var imgUrl;
                    var statusClassName;
                    NO = 1; //初始化序号
                    $("#TabData").empty();
                    var length;
                    if ((m * pageSize) <= data.length) {
                        length = m * pageSize;
                    } else {
                        length = data.length;
                    }
                    for (var i = (m - 1) * pageSize; i < length; i++) {
                        var tempdata = data[i];
                        switch (tempdata.STATUS_NBR) {
                            case 1:
                                statusClassName = "ClassNameStop";
                                imgUrl = "/Modules/Visual/Images/stop.PNG" + " width='24' height='24'";
                                break;
                            case 2:
                                statusClassName = "ClassNamePalyer";
                                imgUrl = "/Modules/Visual/Images/palyer.PNG" + " width='18' height='18'";
                                break;
                            case 3:
                                statusClassName = "ClassNameWarnning";
                                imgUrl = "/Modules/Visual/Images/warnning.PNG" + " width='18' height='18'";
                                break;
                            case 4:
                                statusClassName = "ClassNameSetup";
                                imgUrl = "/Modules/Visual/Images/setup.PNG" + " width='18' height='18'";
                                break;
                            case 5:
                                statusClassName = "ClassNamePause";
                                imgUrl = "/Modules/Visual/Images/pause.PNG" + " width='18' height='18'";
                                break;
                            default:
                                statusClassName = "ClassNameStop";
                                imgUrl = "/Modules/Visual/Images/stop.PNG" + " width='24' height='24'";
                                break;
                        }
                        var strhtml = '<tr><td style="border-radius:5px 5px 5px 5px;padding:2px;" id="' + name + '" class="' + statusClassName + '">' +
                            '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>';
                        for (var j = 0; j < columns.length; j++) {
                            if (columns[j].field == "NULL") {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + statusClassName + '" style="background:' + tempdata.STATUS_COLOR + ';border-radius:3px 0px 0px 3px;"><img id="img' + name + '" src=' + imgUrl + ' alt="status"/></td>';
                            } else if (columns[j].field == "NO") {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + statusClassName + '" style="background:' + tempdata.STATUS_COLOR + ';">' + (i + 1) + '</td>';
                            } else {
                                if (columns[j].type == "datetime") {
                                    strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + statusClassName + '" style="background:' + tempdata.STATUS_COLOR + ';">' + moment(tempdata[columns[j].field]).format("YYYY-MM-DD HH:mm:ss") + '</td>';
                                } else {
                                    strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + statusClassName + '" style="background:' + tempdata.STATUS_COLOR + ';">' + tempdata[columns[j].field] + '</td>';
                                }
                            }
                        }
                        strhtml = strhtml + '</tr></table></td></tr>';
                        $("#TabData").append(strhtml);
                    }
                    //页码
                    //Page second / 5 pages
                    var pagenum = '<tr><td align="right" id="pagenum" style="">' + String.format("第{0}页/共{1}页", m, pages) + '</td></tr>';
                    $("#TabData").append(pagenum);
                    m++
                    setTimeout(this._showdataStatus(data, m, pageSize, pages, columns), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
                } else {
                    //切换页面
                    $.VisualConfig.chageshowPage()
                }
            }
        },
        //班次达成率
        shiftRatio: {
            lang: {},
            init: function(npage) {
                var strhtml = '<table border="0" width="99%" height="100%" cellspacing="0" cellpadding="0">' +
                    '<tr><td width="100%" class="visaltablehead">' +
                    '<table width="100%" border="0" cellpadding="0" cellspacing="5" bgcolor="#4b7086"><tr class="titletd">';
                for (var i = 0; i < npage.length; i++) {
                    if (!npage[i].hide) {
                        strhtml = strhtml + '<td class="td1" width="' + npage[i].width + '%" align="Center" valign="middle">' + npage[i].text + '</td>';
                    }
                }
                strhtml = strhtml + '</tr></table></td></tr><tr><td width="100%" id="tabledata" valign="top"><table id="tabledataTable" width="100%" border="0" cellpadding="0" cellspacing="5" bgcolor="#13364B" style="margin-top:-1px;"><tbody class="datatd" id="TabData"></tbody></table></td></tr></table>';
                $("#context").append(strhtml);
                $.VisualConfig._dd();
                //$.VisualConfig._ddSetHW();
            },
            updatedata: function(self, pobj) {
                $.get(pobj.url, { Page: $.VisualConfig.url.wid }, function(result) {
                    if (result.Status == 0) {
                        self.shiftRatio.UpdateTableView(result.Data, pobj.columns);
                    }
                })
            },
            updatedatademo: function(self, columns) {
                $.get("/Visual/Demo/GetDemo", function(result) {
                    var page_no = $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]];
                    var result = {
                        Status: 0,
                        Message: "OK",
                        Data: page_no.bind_data
                    }
                    if (result.Status == 0) {
                        self.shiftRatio.UpdateTableView(result.Data, columns);
                    }

                });
            },
            UpdateTableView: function(reList, columns) {
                var NO = 1;
                var imgUrl;
                if (reList != null) {
                    //计算页数
                    var pages = 0;
                    var pageSize = parseInt(($("#tabledata").height() - 15) / (39 * $.VisualConfig.times), 10);
                    var pages = Math.ceil(reList.length / pageSize);
                    var m = 1;
                    this.showdataStatus(reList, m, pageSize, pages, columns);
                } else {
                    $("#TabData").empty();
                }
            },
            _showdataStatus: function(ddobjec, m, pageSize, pages, columns) {
                return function() {
                    $.VisualConfig.shiftRatio.showdataStatus(ddobjec, m, pageSize, pages, columns)
                }
            },
            showdataStatus: function(data, m, pageSize, pages, columns) {
                if (m <= pages) {
                    var NO = 1;
                    NO = 1; //初始化序号
                    $("#TabData").empty();
                    var length;
                    if ((m * pageSize) <= data.length) {
                        length = m * pageSize;
                    } else {
                        length = data.length;
                    }
                    for (var i = (m - 1) * pageSize; i < length; i++) {
                        var tempdata = data[i];
                        var strhtml = '<tr><td style="border-radius:5px 5px 5px 5px;padding:2px;" id="' + name + '">' +
                            '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>';
                        var TableStatus;
                        if (i % 2 == 1) {
                            TableStatus = "TableStatus1";
                        } else {
                            TableStatus = "TableStatus2";
                        }

                        for (var j = 0; j < columns.length; j++) {
                            if (columns[j].ctr_type == "percent") {
                                var strcolor;
                                var Custom_Ration = 20;
                                if (parseFloat(tempdata[columns[j].value] * 100, 10) <= Custom_Ration) {
                                    strcolor = "#FF0000";
                                } else {
                                    strcolor = "#30971D";
                                }
                                var ratio;
                                if (parseFloat(tempdata[columns[j].value] * 100, 10) > 100) {
                                    ratio = 100;
                                } else {
                                    ratio = tempdata[columns[j].value] * 100;
                                }
                                //strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + (tempdata[columns[j].field] * 100).toFixed(1) + '%</td>';
                                strhtml = strhtml + '<td width="' + columns[j].width + '%" align="Center" valign="middle" class="' + TableStatus + '">' +
                                    '<div class="rate" style="border: 0px solid red; width: 250px;  text-align: left;">' +
                                    '<div style="height: 30px;line-height:30px; float: left; border-radius: 3px 3px 3px 3px; width: 248px; border: 1px solid ' + strcolor + ';">' +
                                    (tempdata[columns[j].value] * 100).toFixed(1) + '%</div>' +
                                    '<div style="height: 30px; background-color: ' + strcolor + '; border-radius: 3px 3px 3px 3px; width: ' + ratio + '%;"></div>' +
                                    '</div></td>';
                            } else {
                                if (columns[j].format != "null") {
                                    var eval_value = tempdata[columns[j].value];
                                    eval(columns[j].format);
                                    strhtml = strhtml + '<td width="' + columns[j].width + '%" align="Center" valign="middle" class="' + TableStatus + '">' + eval_value + '</td>';
                                } else {
                                    strhtml = strhtml + '<td width="' + columns[j].width + '%" align="Center" valign="middle" class="' + TableStatus + '">' + tempdata[columns[j].value] + '</td>';
                                }
                            }
                        }
                        strhtml = strhtml + '</tr></table></td></tr>';
                        $("#TabData").append(strhtml);
                    }
                    //页码
                    var pagenum = '<tr><td align="right" id="pagenum" style="">' + String.format("第{0}页/共{1}页", m, pages) + '</td></tr>';
                    $("#TabData").append(pagenum);
                    m++;
                    setTimeout(this._showdataStatus(data, m, pageSize, pages, columns), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
                } else {
                    //切换页面
                    $.VisualConfig.chageshowPage()
                }
            }
        },
        //班次状态利用率
        statusRatio: {
            lang: {},
            init: function(npage) {
                $("#context").append('<table style="width:100%;height: 100%;">' +
                    '<tr><td colspan="2" height="50" align="center" style="font-size: 25px;color: #fff;font-family: Microsoft YaHei">设备班次效率汇总</td></tr>' +
                    '<tr><td align="center" width="50%"><div id="chart1"></div></td><td align="center" width="50%"><div id="chart2"></div></td></tr>' +
                    '<tr><td height="150" align="center" id="square1"></td><td align="center" id="square2"></td></tr>' +
                    '</table>');
                $.VisualConfig.Chart1 = {};
                $.VisualConfig.Chart2 = {};
                $.VisualConfig._dd();
            },
            updatedata: function(self, pobj) {
                $.get(pobj.url, { Page: $.VisualConfig.url.wid }, function(result) {
                    if (result.Status == 0) {
                        self.statusRatio.UpdateTableView(result.Data);
                    }
                })
            },
            updatedatademo: function(self, pobj) {
                $.get("/Visual/Demo/GetDemo", { Page: $.VisualConfig.url.wid }, function(result) {
                    var page_no = $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]];
                    var result = {
                        Status: 0,
                        Message: "OK",
                        Data: page_no.bind_data
                    };
                    if (result.Status == 0) {
                        self.statusRatio.UpdateTableView(result.Data);
                    }
                });
            },
            UpdateTableView: function(reList) {
                if (reList != null) {
                    //计算页数
                    //var pages = reList.length;
                    var pages = 1;
                    var m = 1;
                    this.showdataActivation(reList, m, pages);
                } else {
                    $("#TabData").empty();
                }
            },
            _showdataStatus: function(ddobjec, m, pages) {
                return function() {
                    $.VisualConfig.activation.showdataActivation(ddobjec, m, pages);
                }
            },
            showdataActivation: function(data, m, pages) {
                if (m <= pages) {
                    if (data !== null) {
                        try {
                            self.chart[ele + '_chart1'].destroy();
                            $("#" + ele).find("#chart1").empty();

                            self.chart[ele + '_chart2'].destroy();
                            $("#" + ele).find("#chart2").empty();
                        } catch (e) {}

                        var data1 = {};
                        data1.title = "前一班次(" + moment(data[0].SHIFT_DAY).format('YYYY-MM-DD') + " " + data[0].SHIFT_NAME + ")";
                        data1.data = [];
                        for (var k = 0; k < data[0].StatuRates.length; k++) {
                            var tjson = {};
                            tjson.name = data[0].StatuRates[k].STATU_NAME;
                            tjson.color = data[0].StatuRates[k].COLOR;
                            tjson.y = parseInt((data[0].StatuRates[k].STATU_RATE * 100).toFixed(1));
                            data1.data.push(tjson);
                        }

                        var data2 = {};
                        data2.title = "当前班次(" + moment(data[1].SHIFT_DAY).format('YYYY-MM-DD') + " " + data[1].SHIFT_NAME + ")";
                        data2.data = [];
                        for (var k = 0; k < data[1].StatuRates.length; k++) {
                            var tjson = {};
                            tjson.name = data[1].StatuRates[k].STATU_NAME;
                            tjson.color = data[1].StatuRates[k].COLOR;
                            tjson.y = parseInt((data[1].StatuRates[k].STATU_RATE * 100).toFixed(1));
                            data2.data.push(tjson);
                        }

                        this.drawChart("#chart1", data1, "Chart1");
                        this.drawChart("#chart2", data2, "Chart2");

                        var shtml1 = "<table style='color:#fff;font-size:18px;'>";
                        for (var i = 0; i < 3; i++) {
                            shtml1 = shtml1 + "<tr>";
                            for (var j = 0; j < data[0].StatuRates.length; j++) {
                                if (i == 0) {
                                    shtml1 = shtml1 + '<td width="80" height="30" align="center" style="border: 1px solid #fff;">' + data[0].StatuRates[j].STATU_NAME + '</td>';
                                } else if (i == 1) {
                                    shtml1 = shtml1 + '<td width="80" height="30" align="center" style="border: 1px solid #fff;"><div style="width: 80%;height: 20px; background-color: ' + data[0].StatuRates[j].COLOR + '"></div></td>';
                                } else if (i == 2) {
                                    shtml1 = shtml1 + '<td width="80" height="30" align="center" style="border: 1px solid #fff;">' + (data[0].StatuRates[j].STATU_RATE * 100).toFixed(0) + '%</td>';
                                }
                            }
                            shtml1 = shtml1 + "</tr>";
                        }
                        shtml1 = shtml1 + "</table>";

                        var shtml2 = "<table style='color:#fff;font-size:18px;'>";
                        for (var i = 0; i < 3; i++) {
                            shtml2 = shtml2 + "<tr>";
                            for (var j = 0; j < data[1].StatuRates.length; j++) {
                                if (i == 0) {
                                    shtml2 = shtml2 + '<td width="80" height="30" align="center" style="border: 1px solid #fff;">' + data[1].StatuRates[j].STATU_NAME + '</td>';
                                } else if (i == 1) {
                                    shtml2 = shtml2 + '<td width="80" height="30" align="center" style="border: 1px solid #fff;"><div style="width: 80%;height: 20px; background-color: ' + data[1].StatuRates[j].COLOR + '"></div></td>';
                                } else if (i == 2) {
                                    shtml2 = shtml2 + '<td width="80" height="30" align="center" style="border: 1px solid #fff;">' + (data[1].StatuRates[j].STATU_RATE * 100).toFixed(0) + '%</td>';
                                }
                            }
                            shtml2 = shtml2 + "</tr>";
                        }
                        shtml2 = shtml2 + "</table>";
                        $('#square1').append(shtml1);
                        $('#square2').append(shtml2);


                        m++
                        setTimeout(this._showdataStatus(data, m, pages), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
                    } else {
                        return this
                    }

                } else {
                    //切换页面
                    $.VisualConfig.chageshowPage()
                }
            },
            drawChart: function(id, data, chart) {
                $.VisualConfig[chart] = $(id).statusRatio({
                    type: "pie",
                    title: data.title,
                    height: $(id).parent().height() - 0,
                    subtitle: "",
                    exportEnable: false,
                    //categories: data.xdata,
                    dataSource: data.data,
                    size: $(id).parent().height() - 100,
                    stacking: null
                }).data("BZ-statusRatio");
            }
        },
        //产量表
        YieldTable: {

        },
        //设备每小时产量趋势图
        yieldTrend: {
            lang: {},
            init: function(npage) {
                $("#context").append('<div id="chart" style="width:99%;height:100%"></div>');
                $.VisualConfig.Chart1 = {};
                $.VisualConfig.Chart2 = {};
                $.VisualConfig._dd();
                //$.VisualConfig._ddSetHW();
            },
            updatedata: function(self, pobj) {
                $.get(pobj.url, { Page: $.VisualConfig.url.wid }, function(result) {
                    if (result.Status == 0) {
                        self.yieldTrend.UpdateTableView(result.Data);
                    }
                })
            },
            updatedatademo: function(self, pobj) {
                $.get("/Visual/Demo/GetDemo", function(result) {
                    var page_no = $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]];
                    var result = {
                        Status: 0,
                        Message: "OK",
                        Data: page_no.bind_data
                    };
                    if (result.Status == 0) {
                        self.yieldTrend.UpdateTableView(result.Data);
                    }

                });
            },
            UpdateTableView: function(reList) {
                if (reList != null) {
                    this.showdataYieldTrend(reList);
                } else {
                    $("#TabData").empty();
                }
            },
            _showdataStatus: function() {
                return function() {
                    $.VisualConfig.chageshowPage();
                }
            },
            showdataYieldTrend: function(data) {
                var par = {};
                par.xdata = [];
                par.ydata = [];
                par.plotvalue = parseFloat($.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].plot_value);
                par.backcolor = $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].backcolor;

                var tjson = {};
                tjson.name = "产量"; //班次名称
                tjson.data = [];
                tjson.color = "#55C00A";

                //初始化
                for (var i = 0; i < 24; i++) {
                    par.xdata.push(i + 1);
                    tjson.data.push(null);
                }
                for (var k = 0; k < data.length; k++) {
                    tjson.data[k] = parseInt(data[k].YIELD_COUNT); //数据
                }
                par.ydata.push(tjson);
                try {
                    $.VisualConfig.Chart1.destroy();
                    $("#chart").empty();
                } catch (e) {}
                this.drawChart("#chart", par, "Chart1");

                setTimeout(this._showdataStatus(), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);

            },
            drawChart: function(id, data, chart) {
                $.VisualConfig[chart] = $(id).yieldTrend({
                    type: "column",
                    title: "设备组每小时效率趋势图",
                    height: $("#chart").height() - 0,
                    subtitle: "",
                    exportEnable: false,
                    categories: data.xdata,
                    dataSource: data.ydata,
                    plotvalue: data.plotvalue,
                    backcolor: data.backcolor,
                    stacking: null
                }).data("BZ-yieldTrend");

            }
        },
        //稼动率
        activation: {
            lang: {},
            init: function(npage) {
                $("#context").append('<div id="chart" style="width:99%;height:100%"></div>');
                $.VisualConfig.Chart1 = {};
                $.VisualConfig.Chart2 = {};
                $.VisualConfig._dd();
                //$.VisualConfig._ddSetHW();
            },
            updatedata: function(self, pobj) {
                $.get(pobj.url, { Page: $.VisualConfig.url.wid }, function(result) {
                    if (result.Status == 0) {
                        self.activation.UpdateTableView(result.Data);
                    }
                })
            },
            updatedatademo: function(self, pobj) {
                $.get("/Visual/Demo/GetDemo", function(result) {
                    var page_no = $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]];
                    var result = {
                        Status: 0,
                        Message: "OK",
                        Data: page_no.bind_data
                    };
                    if (result.Status == 0) {
                        self.activation.UpdateTableView(result.Data);
                    }

                });
            },
            UpdateTableView: function(reList) {
                if (reList != null) {
                    //计算页数
                    var pages = reList.length;
                    //var pages = 1;
                    var m = 1;
                    this.showdataActivation(reList, m, pages);
                } else {
                    $("#TabData").empty();
                }
            },
            _showdataStatus: function(ddobjec, m, pages) {
                return function() {
                    $.VisualConfig.activation.showdataActivation(ddobjec, m, pages);
                }
            },
            showdataActivation: function(data, m, pages) {
                if (m <= pages) {
                    var nData = data[m - 1];
                    if (nData.DATA == null) {
                        m++;
                        setTimeout(this._showdataStatus(data, m, pages), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
                        return;
                    }
                    var par = {};
                    par.xdata = [];
                    par.ydata = [];
                    par.title = nData.GROUP_NAME;
                    var tjson = {};
                    tjson.name = "利用率"; //班次名称
                    tjson.data = [];
                    tjson.color = "#55C00A";
                    for (var i = 0; i < nData.DATA.length; i++) {
                        par.xdata.push(nData.DATA[i].MAC_NAME);
                        tjson.data.push(nData.DATA[i].VALUE * 100); //数据
                    }
                    par.ydata.push(tjson);
                    try {
                        $.VisualConfig.Chart1.destroy();
                        $("#chart").empty();
                    } catch (e) {}
                    this.drawChart("#chart", par, "Chart1");

                    $("#chart").append('<div align="right" id="pagenum" style="position:relative;top:-30px;">' + String.format(("第{0}页/共{1}页"), m, pages) + '</td></tr>');
                    m++;
                    setTimeout(this._showdataStatus(data, m, pages), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
                } else {
                    //切换页面
                    $.VisualConfig.chageshowPage()
                }
            },
            drawChart: function(id, data, chart) {
                $.VisualConfig[chart] = $(id).hisChart({
                    type: "column",
                    title: "设备班次利用率",
                    height: $("#chart").height() - 0,
                    subtitle: data.title,
                    exportEnable: false,
                    categories: data.xdata,
                    dataSource: data.ydata,
                    stacking: null,
                    ymax: 125
                }).data("BZ-hisChart");

            }
        },
        //刀具寿命
        toollife: {
            lang: {},
            init: function(npage) {
                var strhtml = '<table border="0" width="99%" height="100%" cellspacing="0" cellpadding="0">' +
                    '<tr><td width="100%" class="visaltablehead">' +
                    '<table width="100%" border="0" cellpadding="0" cellspacing="5" bgcolor="#13364B"><tr class="titletd">';
                for (var i = 0; i < npage.length; i++) {
                    strhtml = strhtml + '<td class="td1" width="' + npage[i].width + '" align="Center" valign="middle">' + npage[i].title + '</td>'
                }
                strhtml = strhtml + '</tr></table></td></tr><tr><td width="100%" id="tabledata" valign="top"><table id="tabledataTable" width="100%" border="0" cellpadding="0" cellspacing="5" bgcolor="#13364B" style="margin-top:-1px;"><tbody class="datatd" id="TabData"></tbody></table></td></tr></table>';
                $("#context").append(strhtml);
                $.VisualConfig._dd();
                //$.VisualConfig._ddSetHW();
            },
            updatedata: function(self, pobj) {
                $.get(pobj.url, { Page: $.VisualConfig.url.wid }, function(result) {
                    if (result.Status == 0) {
                        self.toollife.UpdateTableView(result.Data, pobj.columns);
                    }
                })
            },
            updatedatademo: function(self, columns) {
                $.get("/Visual/Demo/GetDemo", function(result) {
                    var result = {
                        Status: 0,
                        Message: "OK",
                        Data: 0
                    }
                    if (result.Status == 0) {
                        self.toollife.UpdateTableView(result.Data, columns);
                    }

                });
            },
            UpdateTableView: function(reList, columns) {
                var NO = 1;
                var imgUrl;
                if (reList != null) {
                    //计算页数
                    var pages = 0;
                    var pageSize = parseInt(($("#tabledata").height() - 15) / (39 * $.VisualConfig.times), 10);
                    var pages = Math.ceil(reList.length / pageSize);
                    var m = 1;
                    this.showdataStatus(reList, m, pageSize, pages, columns);
                } else {
                    $("#TabData").empty();
                }
            },
            _showdataStatus: function(ddobjec, m, pageSize, pages, columns) {
                return function() {
                    $.VisualConfig.toollife.showdataStatus(ddobjec, m, pageSize, pages, columns)
                }
            },
            showdataStatus: function(data, m, pageSize, pages, columns) {
                if (m <= pages) {
                    var NO = 1;
                    NO = 1; //初始化序号
                    $("#TabData").empty();
                    var length;
                    if ((m * pageSize) <= data.length) {
                        length = m * pageSize;
                    } else {
                        length = data.length;
                    }
                    for (var i = (m - 1) * pageSize; i < length; i++) {
                        var tempdata = data[i];
                        var strhtml = '<tr><td style="border-radius:5px 5px 5px 5px;padding:2px;" id="' + name + '">' +
                            '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>';
                        var TableStatus;
                        //if (i % 2 == 1) {
                        //    TableStatus = "TableStatus1";
                        //}
                        //else {
                        //    TableStatus = "TableStatus2";
                        //}
                        switch (tempdata.LIFE_FLAG) {
                            case 0:
                                TableStatus = "OK";
                                break;
                            case 1:
                                TableStatus = "ALARM";
                                break;
                            case 2:
                                TableStatus = "FAULT";
                                break;
                        }
                        for (var j = 0; j < columns.length; j++) {
                            if (columns[j].field == "NO") {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '" style="border-radius:3px 0px 0px 3px;">' + (i + 1) + '</td>';
                            } else if (columns[j].field == "TL_PERCENTAGE") {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + (tempdata[columns[j].field] * 100).toFixed(1) + '%</td>';
                            } else {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + tempdata[columns[j].field] + '</td>';
                            }
                        }
                        strhtml = strhtml + '</tr></table></td></tr>';
                        $("#TabData").append(strhtml);
                    }
                    //页码
                    var pagenum = '<tr><td align="right" id="pagenum" style="">' + String.format("第{0}页/共{1}页", m, pages) + '</td></tr>';
                    $("#TabData").append(pagenum);
                    m++;
                    setTimeout(this._showdataStatus(data, m, pageSize, pages, columns), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
                } else {
                    //切换页面
                    $.VisualConfig.chageshowPage()
                }
            }
        },
        //TPM维修保养
        maintain: {
            lang: {},
            init: function(npage) {
                var strhtml = '<table border="0" width="99%" height="100%" cellspacing="0" cellpadding="0">' +
                    '<tr><td width="100%" class="visaltablehead">' +
                    '<table width="100%" border="0" cellpadding="0" cellspacing="5" bgcolor="#13364B"><tr class="titletd">';
                for (var i = 0; i < npage.length; i++) {
                    strhtml = strhtml + '<td class="td1" width="' + npage[i].width + '" align="Center" valign="middle">' + npage[i].title + '</td>'
                }
                strhtml = strhtml + '</tr></table></td></tr><tr><td width="100%" id="tabledata" valign="top"><table id="tabledataTable" width="100%" border="0" cellpadding="0" cellspacing="5" bgcolor="#13364B" style="margin-top:-1px;"><tbody class="datatd" id="TabData"></tbody></table></td></tr></table>';
                $("#context").append(strhtml);
                $.VisualConfig._dd();
                //$.VisualConfig._ddSetHW();
            },
            updatedata: function(self, pobj) {
                $.get(pobj.url, { Page: $.VisualConfig.url.wid }, function(result) {
                    if (result.Status == 0) {
                        self.maintain.UpdateTableView(result.Data, pobj.columns);
                    }
                })
            },
            updatedatademo: function(self, columns) {
                $.get("/Visual/Demo/GetDemo", function(result) {
                    var result = {
                        Status: 0,
                        Message: "OK",
                        Data: [
                            { MAC_NAME: "B001", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B002", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B003", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B004", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B005", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B006", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B007", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B008", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B009", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B010", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B011", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B012", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B013", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B014", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B015", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B016", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B017", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" },
                            { MAC_NAME: "B018", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/01/21 08:00", MEN_NAME: "小A", PROJECT_NAME: "零件更换" }
                        ]
                    }
                    if (result.Status == 0) {
                        self.maintain.UpdateTableView(result.Data, columns);
                    }

                });
            },
            UpdateTableView: function(reList, columns) {
                var NO = 1;
                var imgUrl;
                if (reList != null) {
                    //计算页数
                    var pages = 0;
                    var pageSize = parseInt(($("#tabledata").height() - 15) / (39 * $.VisualConfig.times), 10);
                    var pages = Math.ceil(reList.length / pageSize);
                    var m = 1;
                    this.showdataStatus(reList, m, pageSize, pages, columns);
                } else {
                    $("#TabData").empty();
                }
            },
            _showdataStatus: function(ddobjec, m, pageSize, pages, columns) {
                return function() {
                    $.VisualConfig.maintain.showdataStatus(ddobjec, m, pageSize, pages, columns)
                }
            },
            showdataStatus: function(data, m, pageSize, pages, columns) {
                if (m <= pages) {
                    var NO = 1;
                    NO = 1; //初始化序号
                    $("#TabData").empty();
                    var length;
                    if ((m * pageSize) <= data.length) {
                        length = m * pageSize;
                    } else {
                        length = data.length;
                    }
                    for (var i = (m - 1) * pageSize; i < length; i++) {
                        var tempdata = data[i];
                        var strhtml = '<tr><td style="border-radius:5px 5px 5px 5px;padding:2px;" id="' + name + '">' +
                            '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>';
                        var TableStatus;
                        if (i % 2 == 1) {
                            TableStatus = "TableStatus1";
                        } else {
                            TableStatus = "TableStatus2";
                        }
                        for (var j = 0; j < columns.length; j++) {
                            if (columns[j].field == "NO") {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '" style="border-radius:3px 0px 0px 3px;">' + (i + 1) + '</td>';
                            } else if (columns[j].field == "TL_PERCENTAGE") {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + (tempdata[columns[j].field] * 100).toFixed(1) + '%</td>';
                            } else {
                                if (columns[j].type == "datetime") {
                                    //strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + statusClassName + '" style="background:' + tempdata.STATUS_COLOR + ';">' + moment(tempdata[columns[j].field]).format("YYYY-MM-DD HH:mm:ss") + '</td>';
                                    strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + moment(tempdata[columns[j].field]).format("YYYY-MM-DD HH:mm:ss") + '</td>';
                                } else {
                                    strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + tempdata[columns[j].field] + '</td>';
                                }
                            }
                        }
                        strhtml = strhtml + '</tr></table></td></tr>';
                        $("#TabData").append(strhtml);
                    }
                    //页码
                    var pagenum = '<tr><td align="right" id="pagenum" style="">' + String.format("第{0}页/共{1}页", m, pages) + '</td></tr>';
                    $("#TabData").append(pagenum);
                    m++;
                    setTimeout(this._showdataStatus(data, m, pageSize, pages, columns), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
                } else {
                    //切换页面
                    $.VisualConfig.chageshowPage()
                }
            }
        },
        camera: {
            init: function(npage) {
                var html = `<div class="camera_row">
                <div class="camera_col"></div>
                <div class="camera_col"></div>
                <div class="camera_col"></div>
                <div class="camera_col"></div>
                <div class="camera_col"></div>
                <div class="camera_col"></div>
                <div class="camera_col"></div>
                <div class="camera_col"></div>
                <div class="camera_col"></div>
                <div class="camera_col"></div>
                <div class="camera_col"></div>
                <div class="camera_col"></div>
                </div>`;
                $("#context").append(html);
                $.VisualConfig._dd();
                setTimeout(this.pageout, 5000);
            },
            updatedata: function(self, pobj) {

                //$.VisualConfig.chageshowPage();
            },
            pageout: function() {
                $.VisualConfig.chageshowPage();
            }
        },
        chageshowPage: function() {
            var self = this;
            if (self.pg.length <= (self.Index + 1)) {
                self.Index = 0;
            } else {
                self.Index++;
            }
            self._showpage(self.pg[self.Index]);
        }
    });
})(jQuery);
(function($, undefined) {
    $.widget("BZ.hisChart", {
        options: {
            type: "column",
            title: "",
            titlebool: true,
            subtitle: "",
            subtitlebool: true,
            height: 500,
            stacking: null,
            dataSource: [],
            yAxistile: "",
            margin: 75,
            exportEnable: true,
            legend: {
                y: 0
            }
        },
        _create: function() {
            var self = this;
            this.chartOptions = {
                chart: {
                    renderTo: this.element[0].id,
                    type: this.options.type,
                    margin: this.options.margin,
                    height: this.options.height,
                    backgroundColor: "#13364B",
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: 0,
                        depth: 60,
                        viewDistance: 25
                    }
                },
                title: this.options.titlebool ? {
                    text: this.options.title,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        fontSize: 30,
                        color: "#fff"
                    },
                    y: 30
                } : "",
                subtitle: this.options.subtitlebool ? {
                    text: this.options.subtitle,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#fff"
                    },
                    y: 50
                } : "",
                credits: {
                    enabled: false
                },
                yAxis: {
                    gridLineWidth: 0,
                    lineColor: '#FFF',
                    lineWidth: 1,
                    tickWidth: 1,
                    tickColor: '#FFF',
                    title: {
                        text: this.options.yAxistile,
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#fff"
                        }
                    },
                    labels: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#fff",
                            fontSize: 16
                        }
                    },
                    min: 0,
                    max: this.options.ymax + 25
                },
                xAxis: {
                    //type: 'datetime',
                    //tickInterval: 1000 * 86400,
                    categories: this.options.categories,
                    title: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            color: "#fff"
                        }
                    },
                    labels: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#fff",
                            fontSize: 16
                        }
                    },
                },
                legend: {
                    y: this.options.legend.y,
                    itemStyle: {
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 20
                    },
                    enabled: false
                },
                plotOptions: {
                    column: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                color: '#fff',
                                fontSize: 18
                            },
                            formatter: function() {
                                return (this.y == null) ? "" : this.y.toFixed(1) + '%';
                            }
                        }
                    },
                    line: {
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                color: '#fff'
                            },
                            formatter: function() {
                                return (this.y == null) ? "" : this.y.toFixed(1) + '%';
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y.toFixed(1) + '%';
                    }
                },
                exporting: {
                    enabled: this.options.exportEnable
                },
                series: this.options.dataSource
            }
            this.chart = new Highcharts.Chart(this.chartOptions);
        },
        destroy: function() {
            this.chart.destroy();
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);
(function($, undefined) {
    $.widget("BZ.yieldTrend", {
        options: {
            type: "column",
            title: "",
            titlebool: true,
            subtitle: "",
            subtitlebool: true,
            height: 500,
            stacking: null,
            dataSource: [],
            yAxistile: "",
            margin: 75,
            exportEnable: true,
            plotvalue: 80,
            legend: {
                y: 0
            }
        },
        _create: function() {
            var self = this;
            this.chartOptions = {
                chart: {
                    renderTo: this.element[0].id,
                    type: this.options.type,
                    margin: this.options.margin,
                    height: this.options.height,
                    backgroundColor: this.options.backcolor,
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: 0,
                        depth: 60,
                        viewDistance: 25
                    }
                },
                title: this.options.titlebool ? {
                    text: this.options.title,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        fontSize: 30,
                        color: "#fff"
                    },
                    y: 30
                } : "",
                subtitle: this.options.subtitlebool ? {
                    text: this.options.subtitle,
                    style: {
                        fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                        fontWeight: "bold",
                        color: "#fff"
                    },
                    y: 50
                } : "",
                credits: {
                    enabled: false
                },
                yAxis: {
                    gridLineWidth: 0,
                    lineColor: '#FFF',
                    lineWidth: 1,
                    tickWidth: 1,
                    tickColor: '#FFF',
                    plotLines: [{
                        id: 'plot-line-1',
                        color: 'red', //线的颜色，定义为红色
                        dashStyle: 'solid', //默认是值，这里定义为长虚线
                        value: this.options.plotvalue, //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                        width: 2, //标示线的宽度，2px
                        label: {
                            text: '', //标签的内容
                            align: 'left', //标签的水平位置，水平居左,默认是水平居中center
                            x: 10, //标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
                            style: {
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }
                        }
                    }],
                    title: {
                        text: this.options.yAxistile,
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#fff"
                        }
                    },
                    labels: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#fff",
                            fontSize: 16
                        }
                    },
                    min: 0
                },
                xAxis: {
                    //type: 'datetime',
                    //tickInterval: 1000 * 86400,
                    categories: this.options.categories,
                    title: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            color: "#fff"
                        }
                    },
                    labels: {
                        style: {
                            fontfamily: "Helvetica Neue,Microsoft Yahei,Hiragino Sans GB,WenQuanYi Micro Hei,sans-serif;",
                            fontWeight: "bold",
                            color: "#fff",
                            fontSize: 16
                        },
                        align: 'center'
                    },
                    tickmarkPlacement: 'on'
                },
                legend: {
                    y: this.options.legend.y,
                    itemStyle: {
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 20
                    },
                    enabled: false
                },
                plotOptions: {
                    column: {
                        stacking: this.options.stacking,
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                color: '#fff',
                                fontSize: 18
                            },
                            formatter: function() {
                                return (this.y == null) ? "" : this.y.toFixed(0) + '';
                            }
                        }
                    },
                    line: {
                        depth: 0,
                        dataLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                color: '#fff'
                            },
                            formatter: function() {
                                return (this.y == null) ? "" : this.y.toFixed(0) + '';
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y.toFixed(1) + '';
                    }
                },
                exporting: {
                    enabled: this.options.exportEnable
                },
                series: this.options.dataSource
            }
            this.chart = new Highcharts.Chart(this.chartOptions);
        },
        destroy: function() {
            this.chart.destroy();
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);
(function($, undefined) {
    $.widget("BZ.statusRatio", {
        options: {
            type: "pie",
            title: "",
            titlebool: true,
            subtitle: "",
            subtitlebool: true,
            height: 500,
            stacking: null,
            dataSource: [],
            yAxistile: "",
            margin: 50,
            size: 80,
            exportEnable: true,
            legend: {
                y: 0
            }
        },
        _create: function() {
            var self = this;
            this.chartOptions = {
                chart: {
                    renderTo: this.element[0].id,
                    backgroundColor: '#13364B',
                    plotBackgroundColor: '#13364B',
                    height: this.options.height,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    style: {
                        fontfamily: "Microsoft YaHei",
                        color: "#fff"
                    },
                    text: this.options.title,
                    y: 30,
                    style: { "color": "#eee", "fontSize": "26px" }
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false,
                            style: { "color": "#eee", "fontSize": "18px" },
                            connectorColor: '#eee',
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        },
                        size: self.options.size
                    }
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true

                },
                exporting: {
                    enabled: false
                },
                series: [{
                    type: 'pie',
                    name: '状态比例',
                    data: this.options.dataSource
                }]

            }

            this.chart = new Highcharts.Chart(this.chartOptions);
        },

        destroy: function() {
            this.chart.destroy();
            $.Widget.prototype.destroy.call(this);
        }
    })
})(jQuery);