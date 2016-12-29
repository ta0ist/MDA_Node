/// <reference path="../WebMethod/GetDemoMethod.asmx" />k
/// <reference path="../WebMethod/GetDemoMethod.asmx" />
/// <reference path="jquery-ui-1.10.0.custom.js" />
(function ($, undefined) {
    $.widget("BZ.VisualConfig", {
        options: {
            headShow: true, //head区域是否显示
            footShow: true,  //foot区域是否显示
            notice: true,
            pagePar: [ //页面显示内容参数配置，此处数组的个数决定了页面的数目
                {
                    url: "/Visual/View/GetImmediateState", demo: true, name: "factoryView", type: "view", showtimes: 2, time: 5000, id: 1
                },
                

                {
                    url: "/Visual/View/GetShiftActivation", demo: true, name: "activation", type: "chart", time: 5000
                },
                {
                    url: "/Visual/View/GetWarnTool", demo: true, name: "toollife", type: "table", time: 5000, columns: [
                     { field: "MAC_NAME", title: $.Translate("Visual.MAC_NAME"), width: "20%" },
                     { field: "TL_NO", title: $.Translate("Visual.TL_NO"), width: "20%" },
                     { field: "INITIAL_LIFE", title: $.Translate("Visual.INITIAL_LIFE"), width: "15%" },
                     { field: "LIFE", title: $.Translate("Visual.LIFE"), width: "15%" },
                     //{ field: "MAX_LIFE", title: $.Translate("Visual.MAX_LIFE"), width: "15%" },
                     { field: "WARNING_LIFE", title: $.Translate("Visual.WARNING_LIFE"), width: "15%" },
                     { field: "TL_PERCENTAGE", title: $.Translate("Visual.TL_PERCENTAGE"), width: "15%" }
                    ]
                },
                {
                    url: "/Visual/View/GetUnComplete", demo: true, name: "maintain", type: "table", time: 5000, columns: [
                     { field: "NO", title: $.Translate("Visual.NO"), width: "5%" },
                     { field: "MAC_NAME", title: $.Translate("Visual.MAC_NAME"), width: "10%" },
                     { field: "MAINTAIN_NO", title: $.Translate("Visual.MAINTAIN_NO"), width: "20%" },
                     { field: "BEGIN_DATE", type: "datetime", title: $.Translate("Visual.BEGIN_DATE"), width: "15%" },
                     { field: "MEN_NAME", title: $.Translate("Visual.MEN_NAME"), width: "10%" },
                     { field: "PROJECT_NAME", title: $.Translate("Visual.PROJECT_NAME"), width: "35%" }
                    ]
                },


                {
                    url: "/Visual/View/GetImmediateState", demo: true, name: "factoryView", type: "view", showtimes: 2, time: 5000, id: 2
                },
                {
                    url: "/Visual/View/GetOrderYieldByMachine", demo: true, name: "shiftRatio", type: "table", time: 5000, columns: [
                     { field: "MAC_NAME", title: "设备", width: "10%" },
                     { field: "TASK_NO", title: "工单", width: "20%" },
                     { field: "PROD_NAME", title: "产品", width: "20%" },
                     { field: "PROD_COUNT", title: "预计产量", width: "10%" },
                     { field: "REAL_COUNT", title: "当前产量", width: "10%" },
                     { field: "FINISH_PROGRESS", title: "完成率", width: "30%" }
                    ]
                }
            ]
        },
        _init: function () {
            window.onresize = function () {
                $.VisualConfig.Onresize();

            }
            this.Onresize();
        },
        _create: function () {
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
                beforeSend: function (xhr, data) {
                    if (data && data.type == "POST" && $("#ajaxLoading").length == 0) {
                        $("body").append("<div id='ajaxLoading' style='top:0;right:0;padding:5px;background-color:red;position:absolute;z-index:999999;width:120px;text-align:center;'><span style='color:#fff;' class='font16'><i class='fa fa-refresh fa-spin'></i> _ 处理中...</span></div>");
                    }
                },
                complete: function () {
                    $("#ajaxLoading").remove();
                },
                error: function (o) {
                    //if (o.responseText != null) {
                    //    alert("错误:" + o.responseText);
                    //}
                    $("#ajaxLoading").remove();
                    return false;
                }
            });
            var logimg;
            //计算放大比例
            if (this._getPgis() == "pc") {
                this.times = Math.sqrt((window.screen.width * window.screen.height) / (1366 * 768));
                less.modifyVars({
                    '@times': this.times
                });
                logimg = "BandexLogo.png";
                if (window.Event)
                    document.captureEvents(Event.MOUSEUP);
                function nocontextmenu(event) {
                    event.cancelBubble = true
                    event.returnValue = false;
                    return false;
                }
                function norightclick(e, event) {
                    if (window.Event) {
                        if (e.which == 3) {//右键
                            //计算菜单位置
                            $("#menu").removeAttr("style");
                            var posit = {};
                            if (($("#menu").width() + e.clientX) > $(window).width()) {
                                posit.left = ($(window).width() - $("#menu").width() - 20) + "px";
                            }
                            else {
                                posit.left = e.clientX + "px";
                            }
                            if (($("#menu").height() + e.clientY) > $(window).height()) {
                                posit.top = ($(window).height() - $("#menu").height() - 20) + "px";
                            }
                            else {
                                posit.top = e.clientY + "px";
                            }

                            posit.position = "absolute";
                            $("#menu").css(posit).show();
                        }
                    }
                    else
                        if (event.button == 2 || event.button == 3) {
                            event.cancelBubble = true
                            event.returnValue = false;
                            return false;
                        }
                }
                document.oncontextmenu = nocontextmenu; // for IE5+ 
                document.onmousedown = norightclick; // for all others
            }
            else {
                this.times = 1;
                this.timeOutEvent = 0;//定时器 
                less.modifyVars({
                    '@times': 1
                });
                logimg = "BandexLogo_min.png";
                $("body").on({
                    "touchstart": function (e) {
                        //开始按 
                        $.VisualConfig.timeOutEvent = setTimeout(function () {
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
                        }, 2000);//这里设置定时器，定义长按500毫秒触发长按事件
                    },
                    "touchmove": function () {
                        clearTimeout($.VisualConfig.timeOutEvent);//清除定时器 
                        $.VisualConfig.timeOutEvent = 0;
                    },
                    "touchend": function () {
                        clearTimeout($.VisualConfig.timeOutEvent);//清除定时器 
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
                    '<td id="head"><div style="padding-left: 5px;">' +
                        '<img id="logo" src="/Modules/Visual/Images/' + logimg + '" style="margin-top: -6px;"/>' +
                        '<span id="title">' + $.Translate("Visual.Company") + '</span></div></td>' +
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
'<li role="presentation" data-attr="chinese"><a role="menuitem" tabindex="-1" href="#">' + $.Translate("Visual.CHINESE") + '</a></li>' +
'<li role="presentation" data-attr="english"><a role="menuitem" tabindex="-1" href="#">' + $.Translate("Visual.ENGLISH") + '</a></li>' +
'<li role="presentation" class="divider"></li>' +
//'<li role="presentation" data-attr="setup"><a role="menuitem" tabindex="-1" href="#">' + $.Translate("Visual.SETUP") + '</a></li>' +
'<li role="presentation" data-attr="exit"><a role="menuitem" tabindex="-1" href="#">' + $.Translate("Visual.EXIT") + '</a></li>' +
'</ul>');
            if (this._getPgis() == "pc") {
                $("#menu li").bind("click", function (e) {
                    MenuEvent($(this).attr("data-attr"));
                    $("#menu").hide();
                    return false;
                });
            }
            else {
                $("#menu li").bind("touchstart", function (e) {
                    MenuEvent($(this).attr("data-attr"));
                    $(this).children().css({
                        "color": "#FFF",
                        "background-color": "#428BCA"
                    });
                    setTimeout(function () {
                        $("#menu").hide();
                    }, 200);
                    return false;
                });
                window.onorientationchange = function () {
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
            if (self.options.notice) { //建立后台推送机制
                var MessagesHub = $.connection.messagesHub;
                MessagesHub.client.showMessage = function (perc) {
                    var reList = JSON.parse(perc);
                    var mes;
                    if (reList.length > 0) {
                        mes = "公告信息--";
                    }
                    else {
                        mes = "";
                    }
                    for (var i = 0; i < reList.length; i++) {
                        mes = mes + reList[i].CONTENT + ";   ";
                    }
                    $("#accountmesg").html(mes);
                    //处理接收数据

                };
                MessagesHub.client.GetNoBeginApplay = function (perc) {
                    var reList = JSON.parse(perc);
                    var dd = [];
                    for (var i = 0; i < reList.length; i++) {
                        if (reList[i].WORKSHOP_CODE == self.url.wid) {
                            dd.push(reList[i]);
                        }
                    }
                    var mes;
                    if (dd.length > 0) {
                        mes = "维修信息--";
                    }
                    else {
                        mes = "";
                    }
                    for (var j = 0; j < dd.length; j++) {
                        mes = mes + dd[j].MAC_NAME + "申请维修;   ";
                    }
                    $("#servicemesg").html(mes);
                };
                MessagesHub.client.lactionurl = function () { //刷新客户端url
                    window.location.href = window.location;
                }
                $.connection.hub.start();
            }
            //开始显示页面
            //1、根据设定值显示页面；2、根据url设定的page参数来显示页面；
            //获取所有的url参数
            self.url = {};
            self.url = {
                wid: self._getparam("wid"),
                page: self._getparam("page"),
                head: self._getparam("head"),
                foot: self._getparam("foot"),
                toggle: self._getparam("toggle"),//是否切换页面；当=false时不能切换页面
                model: self._getparam("model") //模式选择；1=演示模式；2=正常模式
                //lang: self._getparam("lang")//语言选择
            };
            if (self.url.wid == null) {
                //BzAlert($.Translate("PleaseEnterAQueryLine"));
                //return;
                self.url.wid = "cj01";
            }
            //初始加载维修单号信息
            $.get("/Visual/View/GetNoBeginApplay", function (data) {
                if (data.Status == 0) {
                    var dd = [];
                    for (var i = 0; i < data.Data.length; i++) {
                        if (data.Data[i].WORKSHOP_CODE == self.url.wid) {
                            dd.push(data.Data[i]);
                        }
                    }
                    var mes;
                    if (dd.length > 0) {
                        mes = "维修信息--";
                    }
                    else {
                        mes = "";
                    }
                    for (var j = 0; j < dd.length; j++) {
                        mes = mes + dd[j].MAC_NAME + "申请维修;   ";
                    }
                    $("#servicemesg").html(mes);
                    //BzSuccess(data.Message);
                }
                else {
                    BzAlert(data.Message);
                }
            })
            self.Index = 0;//全局索引
            if (self.url.page != null) {
                self.pg = self.url.page.split(",");
                self._showpage(parseInt(self.pg[0], 10));
            }
            else {
                self.pg = [];
                for (var i = 0; i < self.options.pagePar.length; i++) {
                    self.pg.push(i);
                }
                self._showpage(self.pg[0]);
            }
        },
        //获取设备类型
        _getPgis: function () {
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
        Onresize: function () {
            var newWidth = $(window).width();
            var newHeight = $(window).height();
            if (Math.abs($.VisualConfig.OldWith - newWidth) > 1 || Math.abs($.VisualConfig.OldHeight - newHeight) > 1) {
                $.VisualConfig.OldWith = newWidth;
                $.VisualConfig.OldHeight = newHeight;
                $.VisualConfig.Onresize();
            }
            else {
                setTimeout(function () {
                    $.VisualConfig._dd();
                    //alert($(window).width())
                }, 200);
            };
        },
        _dd: function () {
            this._ddSetHW($(window).width(), $(window).height())
        },
        _ddSetHW: function (ww, hh) {
            //alert(ww + "," + hh);
            var windowHeight = hh;
            var windowWidth = ww;
            $("#context").css("padding-top", "0px");
            //$("#context").height(windowHeight - $("#head").height() - $("#foot").height() - 5);
            //$("#context").width(windowWidth - 10);
            $("#context").height(windowHeight - $("#head").height() - $("#foot").height() - 5);
            $("#context").width(windowWidth - 10);
            if (typeof ($.VisualConfig.paper) != "undefined") {
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
        _getparam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        _showpage: function (n) {
            var self = this;
            $("#context").hide("slide", { direction: "left" }, 1000, function () {
                $("#context").empty();
                $("#statusDetail").remove();
                //根据具体的页面显示内容
                switch ($.VisualConfig.options.pagePar[n].type) {
                    case "table":
                        $.VisualConfig[$.VisualConfig.options.pagePar[n].name].init($.VisualConfig.options.pagePar[n].columns);
                        break;
                    case "chart": case "view":
                        $.VisualConfig[$.VisualConfig.options.pagePar[n].name].init();
                        break;
                }

                //this.options.hidepage.call(this, n);
                $("#context").show("slide", { direction: "right" }, 1000, function () {
                    //获取数据(是否是demo)
                    //this.options.showpage.call(this, n);
                    var self = $.VisualConfig;
                    //self.Index++;
                    if (self.options.pagePar[n].demo) {
                        self[self.options.pagePar[n].name].updatedatademo(self, self.options.pagePar[n].columns);
                    }
                    else {
                        self[self.options.pagePar[n].name].updatedata(self, self.options.pagePar[n]);
                    }
                });
            });
        },
        _resizeRaphael: function (paper) {
            if (typeof (paper) != "undefined") {
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
            init: function (npage) {
                this.showtimes = 0;
                //设备配置表
                this.CONFIG = {
                    //13T缸盖线
                    //说明：key--客户设备编号(唯一)【可以改动】;value--VISUAL内部设备编号(唯一)【不能改动】
                    "LB200": "LB200",
                    "LBR370": "LBR370",
                    "CTX310": "CTX310",
                    "XD32H": "XD32H",
                    "B0385L": "B0385L",
                    "H4000": "X4000",
                    "MCi25": "MC125",
                    "V55": "Vcenter55",
                    "510C-4": "N510C_3",
                    "510C-3": "N510C_2",
                    "510C-2": "N510C_1",
                    "510C-1": "N510C_0"

                    //吉利
                    , "A_OP170": "A_OP170"
                    , "A_OP160": "A_OP160"
                    , "A_OP150": "A_OP150"
                    , "A_OP140": "A_OP140"
                    , "A_OP130": "A_OP130"
                    , "A_OP120": "A_OP120"
                    , "A_OP110": "A_OP110"
                    , "A_OP100": "A_OP100"
                    , "A_OP90": "A_OP90"
                    , "A_OP80": "A_OP80"
                    , "A_OP70": "A_OP70"
                    , "A_OP60": "A_OP60"
                    , "A_OP50": "A_OP50"
                    , "A_OP40": "A_OP40"
                    , "A_OP30": "A_OP30"
                    , "A_OP20": "A_OP20"
                    , "A_OP10": "A_OP10"
                    , "A_OP180": "A_OP180"
                    , "A_OP185": "A_OP185"
                    , "A_OP190": "A_OP190"
                    , "A_OP200": "A_OP200"

                    , "B_OP10": "B_OP10"
                    , "B_OP20": "B_OP20"
                    , "B_OP30": "B_OP30"
                    , "B_OP40": "B_OP40"
                    , "B_OP50": "B_OP50"
                    , "B_OP60": "B_OP60"
                    , "B_OP70": "B_OP70"
                    , "B_OP80": "B_OP80"
                    , "B_OP90": "B_OP90"
                    , "B_OP100": "B_OP100"
                    , "B_OP105": "B_OP105"
                    , "B_OP110": "B_OP110"
                    , "B_OP120": "B_OP120"
                    , "B_OP130": "B_OP130"
                    , "B_OP140": "B_OP140"
                    , "B_OP150": "B_OP150"
                    , "B_OP160": "B_OP160"
                    , "B_OP170": "B_OP170"
                    , "B_OP180": "B_OP180"
                    , "B_OP190": "B_OP190"
                    , "B_OP200": "B_OP200"
                }
                //svg布局图
                $.VisualConfig.paper = Raphael("context", 1360, 680);
                this.MAC = drawFactoryView($.VisualConfig.paper, $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].id);
                $.VisualConfig._dd();
                //获取状态名称
                $.get("/Visual/View/GetStatus", function (data) {
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
            updatedata: function (self, pobj) {
                this.showtimes++;
                this.demo = false;
                $.get("/Visual/View/GetImmediateState", { Page: $.VisualConfig.url.wid }, function (result) {
                    if (result.Status == 0) {
                        self.factoryView.UpdateTableView(result.Data);
                    }
                    else {
                        BzAlert(result.Message);
                    }
                });
            },
            updatedatademo: function (self) {
                this.showtimes++;
                this.demo = true;
                $.get("/Visual/Demo/GetDemo", function (result) {
                    var result = {
                        Status: 0,
                        Data: [
                            { MAC_NO: "LB200", MAC_NAME: "加工中心", STATUS_NBR: 1, STATUS_NAME: "停机", STATUS_COLOR: "#94968f", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "LBR370", MAC_NAME: "加工中心", STATUS_NBR: 3, STATUS_NAME: "空闲", STATUS_COLOR: "#d4cc11", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "CTX310", MAC_NAME: "加工中心", STATUS_NBR: 4, STATUS_NAME: "关机", STATUS_COLOR: "#0000ff", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "XD32H", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B0385L", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "H4000", MAC_NAME: "加工中心", STATUS_NBR: 1, STATUS_NAME: "停机", STATUS_COLOR: "#94968f", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "MCi25", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "V55", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "510C-4", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "510C-3", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "510C-2", MAC_NAME: "加工中心", STATUS_NBR: 5, STATUS_NAME: "调试", STATUS_COLOR: "#ec32f0", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "510C-1", MAC_NAME: "加工中心", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },

                            //吉利
                            { MAC_NO: "A_OP170", MAC_NAME: "OP170", STATUS_NBR: 1, STATUS_NAME: "停机", STATUS_COLOR: "#94968f", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP160", MAC_NAME: "OP160", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP150", MAC_NAME: "OP150", STATUS_NBR: 3, STATUS_NAME: "空闲", STATUS_COLOR: "#d4cc11", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP140", MAC_NAME: "OP140", STATUS_NBR: 4, STATUS_NAME: "关机", STATUS_COLOR: "#0000ff", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP130", MAC_NAME: "OP130", STATUS_NBR: 5, STATUS_NAME: "调试", STATUS_COLOR: "#ec32f0", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP120", MAC_NAME: "OP120", STATUS_NBR: 1, STATUS_NAME: "停机", STATUS_COLOR: "#94968f", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP110", MAC_NAME: "OP110", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP100", MAC_NAME: "OP100", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP90", MAC_NAME: "OP90", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP80", MAC_NAME: "OP80", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP70", MAC_NAME: "OP70", STATUS_NBR: 5, STATUS_NAME: "调试", STATUS_COLOR: "#ec32f0", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP60", MAC_NAME: "OP60", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP50", MAC_NAME: "OP50", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP40", MAC_NAME: "OP40", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP30", MAC_NAME: "OP30", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP20", MAC_NAME: "OP20", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP10", MAC_NAME: "OP10", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP180", MAC_NAME: "OP180", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP190", MAC_NAME: "OP190", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "A_OP200", MAC_NAME: "OP200", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },

                            { MAC_NO: "B_OP10", MAC_NAME: "OP10", STATUS_NBR: 1, STATUS_NAME: "停机", STATUS_COLOR: "#94968f", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP20", MAC_NAME: "OP20", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP30", MAC_NAME: "OP30", STATUS_NBR: 3, STATUS_NAME: "空闲", STATUS_COLOR: "#d4cc11", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP40", MAC_NAME: "OP40", STATUS_NBR: 4, STATUS_NAME: "关机", STATUS_COLOR: "#0000ff", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP50", MAC_NAME: "OP50", STATUS_NBR: 5, STATUS_NAME: "调试", STATUS_COLOR: "#ec32f0", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP60", MAC_NAME: "OP60", STATUS_NBR: 1, STATUS_NAME: "停机", STATUS_COLOR: "#94968f", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP70", MAC_NAME: "OP70", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP80", MAC_NAME: "OP80", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP90", MAC_NAME: "OP90", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP100", MAC_NAME: "OP100", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP105", MAC_NAME: "OP105", STATUS_NBR: 5, STATUS_NAME: "调试", STATUS_COLOR: "#ec32f0", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP110", MAC_NAME: "OP110", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP120", MAC_NAME: "OP120", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP130", MAC_NAME: "OP130", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP140", MAC_NAME: "OP140", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP150", MAC_NAME: "OP150", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP160", MAC_NAME: "OP160", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP170", MAC_NAME: "OP170", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP180", MAC_NAME: "OP180", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP190", MAC_NAME: "OP190", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" },
                            { MAC_NO: "B_OP200", MAC_NAME: "OP200", STATUS_NBR: 2, STATUS_NAME: "运行", STATUS_COLOR: "#46f905", RUNNING_DATE: "2015-01-01 8:00:00", DURATION: "02:05:06" }
                        ],
                        Message: "mmm"
                    };
                    if (result.Status == 0) {
                        self.factoryView.UpdateTableView(result.Data);
                    }
                    else {
                        BzAlert(result.Message);
                    }
                });
            },
            _update: function () {
                return function () {
                    var index = $.VisualConfig.Index;
                    if ($.VisualConfig.factoryView.showtimes < $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].showtimes) {
                        if ($.VisualConfig.factoryView.demo) {
                            $.VisualConfig.factoryView.updatedatademo($.VisualConfig);
                        }
                        else {
                            $.VisualConfig.factoryView.updatedata($.VisualConfig);
                        }
                    }
                    else {
                        $.VisualConfig.factoryView.showtimes = 0;//清零
                        $.VisualConfig.chageshowPage();
                    }
                }
            },
            UpdateTableView: function (data) {
                for (var i = 0; i < data.length; i++) {
                    var mac_no = data[i].MAC_NO;
                    if (this.MAC[this.CONFIG[mac_no]] != undefined) {
                        this.MAC[this.CONFIG[mac_no]].MAC.attr("fill", data[i].STATUS_COLOR);
                        //this.MAC[this.CONFIG[mac_no]].TEXT.attr("text", data[i].MAC_NAME);
                    }
                }
                $("tspan").attr("dy", 0);
                //console.log(new Date())
                setTimeout(this._update(), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
            }
        },
        //状态表
        statusTable: {
            lang: {},
            init: function (npage) {
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
            updatedata: function (self, pobj) {
                $.ajax({
                    url: pobj.url,
                    data: '{"Page":"' + self.url.wid + '"}',
                    success: function (result) {
                        if (result.Status == 0) {
                            self.statusTable.UpdateTableView(result.Data, pobj.columns);
                        }
                        else {
                            BzAlert(result.Message);
                        }
                    }
                });
            },
            updatedatademo: function (self, columns) {
                $.get("/Visual/Demo/GetDemo", function (result) {
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
                    }
                    else {
                        BzAlert(result.Message);
                    }
                    //var data = [];
                    //for (var mm in result.RELIST) {
                    //    data.push(result.RELIST[mm]);
                    //}
                    //self.statusTable.UpdateTableView(data, columns);
                });
            },
            UpdateTableView: function (reList, columns) {
                var NO = 1;
                var imgUrl;
                if (reList != null) {
                    //计算页数
                    var pages = 0;
                    var pageSize = parseInt(($("#tabledata").height() - 15) / (39 * $.VisualConfig.times), 10);
                    var pages = Math.ceil(reList.length / pageSize);
                    var m = 1;
                    this.showdataStatus(reList, m, pageSize, pages, columns);
                }
                else {
                    $("#TabData").empty();
                }
            },
            _showdataStatus: function (ddobjec, m, pageSize, pages, columns) {
                return function () {
                    $.VisualConfig.statusTable.showdataStatus(ddobjec, m, pageSize, pages, columns)
                }
            },
            showdataStatus: function (data, m, pageSize, pages, columns) {
                if (m <= pages) {
                    var NO = 1;
                    var imgUrl;
                    var statusClassName;
                    NO = 1; //初始化序号
                    $("#TabData").empty();
                    var length;
                    if ((m * pageSize) <= data.length) {
                        length = m * pageSize;
                    }
                    else {
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
                            }
                            else if (columns[j].field == "NO") {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + statusClassName + '" style="background:' + tempdata.STATUS_COLOR + ';">' + (i + 1) + '</td>';
                            }
                            else {
                                if (columns[j].type == "datetime") {
                                    strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + statusClassName + '" style="background:' + tempdata.STATUS_COLOR + ';">' + moment(tempdata[columns[j].field]).format("YYYY-MM-DD HH:mm:ss") + '</td>';
                                }
                                else {
                                    strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + statusClassName + '" style="background:' + tempdata.STATUS_COLOR + ';">' + tempdata[columns[j].field] + '</td>';
                                }
                            }
                        }
                        strhtml = strhtml + '</tr></table></td></tr>';
                        $("#TabData").append(strhtml);
                    }
                    //页码
                    //Page second / 5 pages
                    var pagenum = '<tr><td align="right" id="pagenum" style="">' + String.format($.Translate("Visual.PAGES"), m, pages) + '</td></tr>';
                    $("#TabData").append(pagenum);
                    m++
                    setTimeout(this._showdataStatus(data, m, pageSize, pages, columns), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
                }
                else {
                    //切换页面
                    $.VisualConfig.chageshowPage()
                }
            }
        },
        //班次达成率
        shiftRatio: {
            lang: {},
            init: function (npage) {
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
            updatedata: function (self, pobj) {
                $.get(pobj.url, { Page: $.VisualConfig.url.wid }, function (result) {
                    if (result.Status == 0) {
                        for (var i = 0; i < result.Data.length; i++) {
                            result.Data[i].ACHIEVINGRATE = (result.Data[i].ACHIEVINGRATE * 100).toFixed(1) + "%";
                            result.Data[i].QUALIFIEDRATE = (result.Data[i].QUALIFIEDRATE * 100).toFixed(1) + "%";
                        }
                        self.shiftRatio.UpdateTableView(result.Data, pobj.columns);
                    }
                })
            },
            updatedatademo: function (self, columns) {
                $.get("/Visual/Demo/GetDemo", function (result) {
                    var result = {
                        Status: 0,
                        Message: "OK",
                        Data: [
                            { MAC_NAME: "LB200", TASK_NO: "1306626", PROD_NAME: "1702101a021", PROD_COUNT: 600,REAL_COUNT:500,FINISH_PROGRESS:0.8 },
                            { MAC_NAME: "LBR370", TASK_NO: "1306627", PROD_NAME: "1702101a022", PROD_COUNT: 800, REAL_COUNT: 500, FINISH_PROGRESS: 0.9 },
                            { MAC_NAME: "CTX310", TASK_NO: "1306628", PROD_NAME: "1702101a023", PROD_COUNT: 700, REAL_COUNT: 500, FINISH_PROGRESS: 0.65 },
                            { MAC_NAME: "XD32H", TASK_NO: "1306629", PROD_NAME: "1702101a024", PROD_COUNT: 1200, REAL_COUNT: 500, FINISH_PROGRESS: 0.32 },
                            { MAC_NAME: "B0385L", TASK_NO: "1306630", PROD_NAME: "1702101a025", PROD_COUNT: 600, REAL_COUNT: 500, FINISH_PROGRESS: 0.16 },
                            { MAC_NAME: "H4000", TASK_NO: "1306631", PROD_NAME: "1702101a026", PROD_COUNT: 450, REAL_COUNT: 500, FINISH_PROGRESS: 0.80 },
                            { MAC_NAME: "MCi25", TASK_NO: "1306632", PROD_NAME: "1702101a027", PROD_COUNT: 600, REAL_COUNT: 500, FINISH_PROGRESS: 0.97 },
                            { MAC_NAME: "V55", TASK_NO: "1306633", PROD_NAME: "1702101a028", PROD_COUNT: 800, REAL_COUNT: 500, FINISH_PROGRESS: 0.86 },
                            { MAC_NAME: "510C-4", TASK_NO: "1306634", PROD_NAME: "1702101a029", PROD_COUNT: 900, REAL_COUNT: 500, FINISH_PROGRESS: 0.9 },
                            { MAC_NAME: "510C-3", TASK_NO: "1306635", PROD_NAME: "1702101a030", PROD_COUNT: 860, REAL_COUNT: 500, FINISH_PROGRESS: 0.95 },
                            { MAC_NAME: "510C-2", TASK_NO: "1306636", PROD_NAME: "1702101a031", PROD_COUNT: 880, REAL_COUNT: 500, FINISH_PROGRESS: 0.18 },
                            { MAC_NAME: "510C-1", TASK_NO: "1306637", PROD_NAME: "1702101a032", PROD_COUNT: 960, REAL_COUNT: 500, FINISH_PROGRESS: 0.8 }

                        ]
                    }
                    if (result.Status == 0) {
                        for (var i = 0; i < result.Data.length; i++) {
                            result.Data[i].QUALIFIEDRATE = (result.Data[i].QUALIFIEDRATE * 100).toFixed(1) + "%";
                        }
                        self.shiftRatio.UpdateTableView(result.Data, columns);
                    }

                });
            },
            UpdateTableView: function (reList, columns) {
                var NO = 1;
                var imgUrl;
                if (reList != null) {
                    //计算页数
                    var pages = 0;
                    var pageSize = parseInt(($("#tabledata").height() - 15) / (39 * $.VisualConfig.times), 10);
                    var pages = Math.ceil(reList.length / pageSize);
                    var m = 1;
                    this.showdataStatus(reList, m, pageSize, pages, columns);
                }
                else {
                    $("#TabData").empty();
                }
            },
            _showdataStatus: function (ddobjec, m, pageSize, pages, columns) {
                return function () {
                    $.VisualConfig.shiftRatio.showdataStatus(ddobjec, m, pageSize, pages, columns)
                }
            },
            showdataStatus: function (data, m, pageSize, pages, columns) {
                if (m <= pages) {
                    var NO = 1;
                    NO = 1; //初始化序号
                    $("#TabData").empty();
                    var length;
                    if ((m * pageSize) <= data.length) {
                        length = m * pageSize;
                    }
                    else {
                        length = data.length;
                    }
                    for (var i = (m - 1) * pageSize; i < length; i++) {
                        var tempdata = data[i];
                        var strhtml = '<tr><td style="border-radius:5px 5px 5px 5px;padding:2px;" id="' + name + '">' +
                        '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>';
                        var TableStatus;
                        if (i % 2 == 1) {
                            TableStatus = "TableStatus1";
                        }
                        else {
                            TableStatus = "TableStatus2";
                        }

                        for (var j = 0; j < columns.length; j++) {
                            if (columns[j].field == "NO") {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '" style="border-radius:3px 0px 0px 3px;">' + (i + 1) + '</td>';
                            }
                            else if (columns[j].field == "COMP_RATE" || columns[j].field == "FINISH_PROGRESS") {
                                var strcolor;
                                var Custom_Ration = 20;
                                if (parseFloat(tempdata[columns[j].field] * 100, 10) <= Custom_Ration) {
                                    strcolor = "#FF0000";
                                }
                                else {
                                    strcolor = "#30971D";
                                }
                                var ratio;
                                if (parseFloat(tempdata[columns[j].field] * 100, 10) > 100) {
                                    ratio = 100;
                                }
                                else {
                                    ratio = tempdata[columns[j].field] * 100;
                                }
                                //strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + (tempdata[columns[j].field] * 100).toFixed(1) + '%</td>';
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' +
                                    '<div class="rate" style="border: 0px solid red; width: 250px;  text-align: left;">' +
                                    '<div style="height: 30px;line-height:30px; float: left; border-radius: 3px 3px 3px 3px; width: 248px; border: 1px solid ' + strcolor + ';">' +
                                    (tempdata[columns[j].field] * 100).toFixed(1) + '%</div>' +
                                    '<div style="height: 30px; background-color: ' + strcolor + '; border-radius: 3px 3px 3px 3px; width: ' + ratio + '%;"></div>' +
                                    '</div></td>';
                            }
                            else {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + tempdata[columns[j].field] + '</td>';
                            }
                        }
                        strhtml = strhtml + '</tr></table></td></tr>';
                        $("#TabData").append(strhtml);
                    }
                    //页码
                    var pagenum = '<tr><td align="right" id="pagenum" style="">' + String.format($.Translate("Visual.PAGES"), m, pages) + '</td></tr>';
                    $("#TabData").append(pagenum);
                    m++;
                    setTimeout(this._showdataStatus(data, m, pageSize, pages, columns), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
                }
                else {
                    //切换页面
                    $.VisualConfig.chageshowPage()
                }
            }
        },
        //产量表
        YieldTable: {

        },
        //稼动率
        activation: {
            lang: {},
            init: function (npage) {
                $("#context").append('<div id="chart" style="width:99%;height:100%"></div>');
                $.VisualConfig.Chart1 = {};
                $.VisualConfig.Chart2 = {};
                $.VisualConfig._dd();
                //$.VisualConfig._ddSetHW();
            },
            updatedata: function (self, pobj) {
                $.get(pobj.url, { Page: $.VisualConfig.url.wid }, function (result) {
                    if (result.Status == 0) {
                        self.activation.UpdateTableView(result.Data);
                    }
                })
            },
            updatedatademo: function (self, pobj) {
                $.get("/Visual/Demo/GetDemo", function (result) {
                    var result = {
                        Status: 0,
                        Message: "OK",
                        Data: [
                            {
                                GROUP_NAME: "1#线", Data: [
                                    { MAC_NAME: "0P10", SHIFT_NAME: "白班", SOLUTION: "方案1", SHIFT_ID: 1, VALUE: 0.93 },
                                    { MAC_NAME: "0P20", SHIFT_NAME: "白班", SOLUTION: "方案1", SHIFT_ID: 1, VALUE: 0.91 },
                                    { MAC_NAME: "0P30", SHIFT_NAME: "白班", SOLUTION: "方案1", SHIFT_ID: 1, VALUE: 0.91 },
                                    { MAC_NAME: "0P40", SHIFT_NAME: "白班", SOLUTION: "方案1", SHIFT_ID: 1, VALUE: 0.90 },
                                    { MAC_NAME: "0P50", SHIFT_NAME: "白班", SOLUTION: "方案1", SHIFT_ID: 1, VALUE: 0.70 },
                                    { MAC_NAME: "0P60", SHIFT_NAME: "白班", SOLUTION: "方案1", SHIFT_ID: 1, VALUE: 0.70 },
                                    { MAC_NAME: "0P70", SHIFT_NAME: "白班", SOLUTION: "方案1", SHIFT_ID: 1, VALUE: 0.69 },
                                    { MAC_NAME: "0P80", SHIFT_NAME: "白班", SOLUTION: "方案1", SHIFT_ID: 1, VALUE: 0.68 },
                                    { MAC_NAME: "0P90", SHIFT_NAME: "白班", SOLUTION: "方案1", SHIFT_ID: 1, VALUE: 0.40 },
                                    { MAC_NAME: "0P100", SHIFT_NAME: "白班", SOLUTION: "方案1", SHIFT_ID: 1, VALUE: 0.38 },
                                    { MAC_NAME: "0P110", SHIFT_NAME: "白班", SOLUTION: "方案1", SHIFT_ID: 1, VALUE: 0.38 },
                                    { MAC_NAME: "0P120", SHIFT_NAME: "白班", SOLUTION: "方案1", SHIFT_ID: 1, VALUE: 0.35 }
                                ]
                            }
                        ]
                    };
                    if (result.Status == 0) {
                        self.activation.UpdateTableView(result.Data);
                    }

                });
            },
            UpdateTableView: function (reList) {
                if (reList != null) {
                    //计算页数
                    //var pages = reList.length;
                    var pages = 1;
                    var m = 1;
                    this.showdataActivation(reList, m, pages);
                }
                else {
                    $("#TabData").empty();
                }
            },
            _showdataStatus: function (ddobjec, m, pages) {
                return function () {
                    $.VisualConfig.activation.showdataActivation(ddobjec, m, pages);
                }
            },
            showdataActivation: function (data, m, pages) {
                if (m <= pages) {
                    var nData = data[m - 1];
                    //设置分行
                    //var par = {};
                    //par.xdata = [];
                    //par.ydata = [];
                    //par.title = nData.GROUP_NAME;
                    //var tjson = {};
                    //tjson.name = $.Translate("Visual.Activation");//班次名称
                    //tjson.data = [];
                    //tjson.color = "#55C00A";
                    //for (var i = 0; i < nData.Data.length; i++) {
                    //    par.xdata.push(nData.Data[i].MAC_NAME);
                    //    tjson.data.push(nData.Data[i].VALUE * 100);//数据
                    //}
                    //par.ydata.push(tjson);
                    //try {
                    //    Chart.destroy();
                    //    $("#chart").empty();
                    //}
                    //catch (e) { }
                    //this.drawChart(par);

                    var par = {};
                    par.xdata = [];
                    par.ydata = [];
                    par.title = nData.GROUP_NAME;
                    var tjson = {};
                    tjson.name = $.Translate("Visual.Activation");//班次名称
                    tjson.data = [];
                    tjson.color = "#55C00A";
                    for (var i = 0; i < 12; i++) {
                        par.xdata.push(nData.Data[i].MAC_NAME);
                        tjson.data.push(nData.Data[i].VALUE * 100);//数据
                    }
                    par.ydata.push(tjson);
                    try {
                        $.VisualConfig.Chart1.destroy();
                        $("#chart").empty();
                    }
                    catch (e) { }
                    this.drawChart("#chart", par, "Chart1");


                    //var par = {};
                    //par.xdata = [];
                    //par.ydata = [];
                    //par.title = nData.GROUP_NAME;
                    //var tjson = {};
                    //tjson.name = $.Translate("Visual.Activation");//班次名称
                    //tjson.data = [];
                    //tjson.color = "#55C00A";
                    //for (var i = 11; i < nData.Data.length; i++) {
                    //    par.xdata.push(nData.Data[i].MAC_NAME);
                    //    tjson.data.push(nData.Data[i].VALUE * 100);//数据
                    //}
                    //par.ydata.push(tjson);
                    //try {
                    //    $.VisualConfig.Chart2.destroy();
                    //    $("#chart2").empty();
                    //}
                    //catch (e) { }
                    //this.drawChart("#chart2", par, "Chart2");
                    //$("#chart").append('<div align="right" id="pagenum" style="position:relative;top:-50px;">' + String.format($.Translate("Visual.PAGES"), m, pages) + '</td></tr>');
                    m++
                    setTimeout(this._showdataStatus(data, m, pages), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
                }
                else {
                    //切换页面
                    $.VisualConfig.chageshowPage()
                }
            },
            drawChart: function (id, data, chart) {
                $.VisualConfig[chart] = $(id).hisChart({
                    type: "column",
                    title: data.title + $.Translate("Visual.ShiftActivationMap"),
                    height: $("#chart").height() - 0,
                    subtitle: "",
                    exportEnable: false,
                    categories: data.xdata,
                    dataSource: data.ydata,
                    stacking: null
                }).data("BZ-hisChart");

            }
        },
        //刀具寿命
        toollife: {
            lang: {},
            init: function (npage) {
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
            updatedata: function (self, pobj) {
                $.get(pobj.url, { Page: $.VisualConfig.url.wid }, function (result) {
                    if (result.Status == 0) {
                        self.toollife.UpdateTableView(result.Data, pobj.columns);
                    }
                })
            },
            updatedatademo: function (self, columns) {
                $.get("/Visual/Demo/GetDemo", function (result) {
                    var result = {
                        Status: 0,
                        Message: "OK",
                        Data: [
                            { MAC_NAME: "OP10", LIFE_FLAG: 0, TL_NO: "001", INITIAL_LIFE: 100, LIFE: 50, MAX_LIFE: 200, WARNING_LIFE: 90, TL_PERCENTAGE: 0.56 },
                            { MAC_NAME: "OP20", LIFE_FLAG: 1, TL_NO: "002", INITIAL_LIFE: 100, LIFE: 92, MAX_LIFE: 200, WARNING_LIFE: 90, TL_PERCENTAGE: 0.95 },
                            { MAC_NAME: "OP30", LIFE_FLAG: 1, TL_NO: "003", INITIAL_LIFE: 100, LIFE: 95, MAX_LIFE: 200, WARNING_LIFE: 90, TL_PERCENTAGE: 0.93 },
                            { MAC_NAME: "OP40", LIFE_FLAG: 2, TL_NO: "004", INITIAL_LIFE: 100, LIFE: 105, MAX_LIFE: 200, WARNING_LIFE: 90, TL_PERCENTAGE: 1.05 },
                            { MAC_NAME: "OP50", LIFE_FLAG: 2, TL_NO: "005", INITIAL_LIFE: 100, LIFE: 110, MAX_LIFE: 200, WARNING_LIFE: 90, TL_PERCENTAGE: 1.1 },
                            { MAC_NAME: "OP60", LIFE_FLAG: 0, TL_NO: "006", INITIAL_LIFE: 100, LIFE: 70, MAX_LIFE: 200, WARNING_LIFE: 90, TL_PERCENTAGE: 0.76 },
                            { MAC_NAME: "OP70", LIFE_FLAG: 0, TL_NO: "007", INITIAL_LIFE: 100, LIFE: 50, MAX_LIFE: 200, WARNING_LIFE: 90, TL_PERCENTAGE: 0.56 },
                            { MAC_NAME: "OP80", LIFE_FLAG: 0, TL_NO: "008", INITIAL_LIFE: 100, LIFE: 60, MAX_LIFE: 200, WARNING_LIFE: 90, TL_PERCENTAGE: 0.87 },
                            { MAC_NAME: "OP90", LIFE_FLAG: 2, TL_NO: "009", INITIAL_LIFE: 100, LIFE: 110, MAX_LIFE: 200, WARNING_LIFE: 90, TL_PERCENTAGE: 1.1 },
                            { MAC_NAME: "OP100", LIFE_FLAG: 0, TL_NO: "010", INITIAL_LIFE: 100, LIFE: 50, MAX_LIFE: 200, WARNING_LIFE: 90, TL_PERCENTAGE: 0.56 },
                            { MAC_NAME: "OP110", LIFE_FLAG: 0, TL_NO: "011", INITIAL_LIFE: 100, LIFE: 60, MAX_LIFE: 200, WARNING_LIFE: 90, TL_PERCENTAGE: 0.87 },
                            { MAC_NAME: "OP120", LIFE_FLAG: 1, TL_NO: "012", INITIAL_LIFE: 100, LIFE: 95, MAX_LIFE: 200, WARNING_LIFE: 90, TL_PERCENTAGE: 0.93 }
                        ]
                    }
                    if (result.Status == 0) {
                        self.toollife.UpdateTableView(result.Data, columns);
                    }

                });
            },
            UpdateTableView: function (reList, columns) {
                var NO = 1;
                var imgUrl;
                if (reList != null) {
                    //计算页数
                    var pages = 0;
                    var pageSize = parseInt(($("#tabledata").height() - 15) / (39 * $.VisualConfig.times), 10);
                    var pages = Math.ceil(reList.length / pageSize);
                    var m = 1;
                    this.showdataStatus(reList, m, pageSize, pages, columns);
                }
                else {
                    $("#TabData").empty();
                }
            },
            _showdataStatus: function (ddobjec, m, pageSize, pages, columns) {
                return function () {
                    $.VisualConfig.toollife.showdataStatus(ddobjec, m, pageSize, pages, columns)
                }
            },
            showdataStatus: function (data, m, pageSize, pages, columns) {
                if (m <= pages) {
                    var NO = 1;
                    NO = 1; //初始化序号
                    $("#TabData").empty();
                    var length;
                    if ((m * pageSize) <= data.length) {
                        length = m * pageSize;
                    }
                    else {
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
                            }
                            else if (columns[j].field == "TL_PERCENTAGE") {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + (tempdata[columns[j].field] * 100).toFixed(1) + '%</td>';
                            }
                            else {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + tempdata[columns[j].field] + '</td>';
                            }
                        }
                        strhtml = strhtml + '</tr></table></td></tr>';
                        $("#TabData").append(strhtml);
                    }
                    //页码
                    var pagenum = '<tr><td align="right" id="pagenum" style="">' + String.format($.Translate("Visual.PAGES"), m, pages) + '</td></tr>';
                    $("#TabData").append(pagenum);
                    m++;
                    setTimeout(this._showdataStatus(data, m, pageSize, pages, columns), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
                }
                else {
                    //切换页面
                    $.VisualConfig.chageshowPage()
                }
            }
        },
        //TPM维修保养
        maintain: {
            lang: {},
            init: function (npage) {
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
            updatedata: function (self, pobj) {
                $.get(pobj.url, { Page: $.VisualConfig.url.wid }, function (result) {
                    if (result.Status == 0) {
                        self.maintain.UpdateTableView(result.Data, pobj.columns);
                    }
                })
            },
            updatedatademo: function (self, columns) {
                $.get("/Visual/Demo/GetDemo", function (result) {
                    var result = {
                        Status: 0,
                        Message: "OK",
                        Data: [
                            { MAC_NAME: "OP10", MAINTAIN_NO: "BY2015012101", BEGIN_DATE: "2015/03/25 08:00", MEN_NAME: "王*", PROJECT_NAME: "设备定时检验" },
                            { MAC_NAME: "OP20", MAINTAIN_NO: "BY2015012102", BEGIN_DATE: "2015/03/25 08:00", MEN_NAME: "李*", PROJECT_NAME: "切削油更换" },
                            { MAC_NAME: "OP30", MAINTAIN_NO: "BY2015012103", BEGIN_DATE: "2015/03/25 08:00", MEN_NAME: "张*", PROJECT_NAME: "定期保养" },
                            { MAC_NAME: "OP40", MAINTAIN_NO: "BY2015012104", BEGIN_DATE: "2015/03/25 08:00", MEN_NAME: "赵*", PROJECT_NAME: "更换轴承" },
                            { MAC_NAME: "OP50", MAINTAIN_NO: "BY2015012105", BEGIN_DATE: "2015/03/25 08:00", MEN_NAME: "施*", PROJECT_NAME: "定期保养" },
                            { MAC_NAME: "OP60", MAINTAIN_NO: "BY2015012106", BEGIN_DATE: "2015/03/25 08:00", MEN_NAME: "杨*", PROJECT_NAME: "定期保养" },
                            { MAC_NAME: "OP70", MAINTAIN_NO: "BY2015012107", BEGIN_DATE: "2015/03/25 08:00", MEN_NAME: "季*", PROJECT_NAME: "定期保养" },
                            { MAC_NAME: "OP80", MAINTAIN_NO: "BY2015012108", BEGIN_DATE: "2015/03/25 08:00", MEN_NAME: "张*", PROJECT_NAME: "切削油更换" },
                            { MAC_NAME: "OP90", MAINTAIN_NO: "BY2015012109", BEGIN_DATE: "2015/03/25 08:00", MEN_NAME: "李*", PROJECT_NAME: "切削油更换" },
                            { MAC_NAME: "OP100", MAINTAIN_NO: "BY2015012110", BEGIN_DATE: "2015/03/25 08:00", MEN_NAME: "赵*", PROJECT_NAME: "设备定时检验" },
                            { MAC_NAME: "OP110", MAINTAIN_NO: "BY2015012111", BEGIN_DATE: "2015/03/25 08:00", MEN_NAME: "韩*", PROJECT_NAME: "定期保养" },
                            { MAC_NAME: "OP120", MAINTAIN_NO: "BY2015012112", BEGIN_DATE: "2015/03/25 08:00", MEN_NAME: "魏*", PROJECT_NAME: "定期保养" }
                        ]
                    }
                    if (result.Status == 0) {
                        self.maintain.UpdateTableView(result.Data, columns);
                    }

                });
            },
            UpdateTableView: function (reList, columns) {
                var NO = 1;
                var imgUrl;
                if (reList != null) {
                    //计算页数
                    var pages = 0;
                    var pageSize = parseInt(($("#tabledata").height() - 15) / (39 * $.VisualConfig.times), 10);
                    var pages = Math.ceil(reList.length / pageSize);
                    var m = 1;
                    this.showdataStatus(reList, m, pageSize, pages, columns);
                }
                else {
                    $("#TabData").empty();
                }
            },
            _showdataStatus: function (ddobjec, m, pageSize, pages, columns) {
                return function () {
                    $.VisualConfig.maintain.showdataStatus(ddobjec, m, pageSize, pages, columns)
                }
            },
            showdataStatus: function (data, m, pageSize, pages, columns) {
                if (m <= pages) {
                    var NO = 1;
                    NO = 1; //初始化序号
                    $("#TabData").empty();
                    var length;
                    if ((m * pageSize) <= data.length) {
                        length = m * pageSize;
                    }
                    else {
                        length = data.length;
                    }
                    for (var i = (m - 1) * pageSize; i < length; i++) {
                        var tempdata = data[i];
                        var strhtml = '<tr><td style="border-radius:5px 5px 5px 5px;padding:2px;" id="' + name + '">' +
                        '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tr>';
                        var TableStatus;
                        if (i % 2 == 1) {
                            TableStatus = "TableStatus1";
                        }
                        else {
                            TableStatus = "TableStatus2";
                        }
                        for (var j = 0; j < columns.length; j++) {
                            if (columns[j].field == "NO") {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '" style="border-radius:3px 0px 0px 3px;">' + (i + 1) + '</td>';
                            }
                            else if (columns[j].field == "TL_PERCENTAGE") {
                                strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + (tempdata[columns[j].field] * 100).toFixed(1) + '%</td>';
                            }
                            else {
                                if (columns[j].type == "datetime") {
                                    //strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + statusClassName + '" style="background:' + tempdata.STATUS_COLOR + ';">' + moment(tempdata[columns[j].field]).format("YYYY-MM-DD HH:mm:ss") + '</td>';
                                    strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + moment(tempdata[columns[j].field]).format("YYYY-MM-DD HH:mm:ss") + '</td>';
                                }
                                else {
                                    strhtml = strhtml + '<td width="' + columns[j].width + '" align="Center" valign="middle" class="' + TableStatus + '">' + tempdata[columns[j].field] + '</td>';
                                }
                            }
                        }
                        strhtml = strhtml + '</tr></table></td></tr>';
                        $("#TabData").append(strhtml);
                    }
                    //页码
                    var pagenum = '<tr><td align="right" id="pagenum" style="">' + String.format($.Translate("Visual.PAGES"), m, pages) + '</td></tr>';
                    $("#TabData").append(pagenum);
                    m++;
                    setTimeout(this._showdataStatus(data, m, pageSize, pages, columns), $.VisualConfig.options.pagePar[$.VisualConfig.pg[$.VisualConfig.Index]].time);
                }
                else {
                    //切换页面
                    $.VisualConfig.chageshowPage()
                }
            }
        },
        chageshowPage: function () {
            var self = this;
            if (self.pg.length <= (self.Index + 1)) {
                self.Index = 0;
            }
            else {
                self.Index++;
            }
            self._showpage(self.pg[self.Index]);
        }
    });
})(jQuery);
(function ($, undefined) {
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
        _create: function () {
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
                        }
                    },
                },
                legend: {
                    y: this.options.legend.y,
                    itemStyle: {
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 20
                    }
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
                            formatter: function () {
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
                            formatter: function () {
                                return (this.y == null) ? "" : this.y.toFixed(1) + '%';
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
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
        destroy: function () {
            this.chart.destroy();
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);