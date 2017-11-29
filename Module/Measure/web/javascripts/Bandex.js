/// <reference path="kendo/2014.1.318/cultures/kendo.culture.zh-CN.min.js" />
/// <reference path="kendo/2014.1.318/cultures/kendo.culture.zh-CN.min.js" />
/// <reference path="kendo/2014.1.318/cultures/kendo.culture.zh-CN.min.js" />
$.ajaxSetup({
   global: true,
   type: "POST",
  dataType: "json",
    //contentType: 'application/json',
    beforeSend: function (xhr, data) {

        if (data && data.type == "POST" && $("#ajaxLoading").length == 0) {
        //if (data  && $("#ajaxLoading").length == 0) {
           $("body").append("<div id='ajaxLoading' style='top:45px;right:0;padding:5px;background-color:red;position:fixed;z-index:999999;width:120px;text-align:center;'><span style='color:#fff;' class='font16'><i class='fa fa-refresh fa-spin'></i> _ " + "读取中"+ "</span></div>");
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
(function ($) {
    $.getparam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);
//guid
function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}
/*cookie*/
jQuery.cookie = function (name, subName, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : ';path=/';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';

        //If value is an object, each property will be a sub key;
        if (typeof value == "object") {
            var k = 0;
            var tempResult = "";
            for (var tempValue in value) {
                if (k > 0) {
                    tempResult += "&";
                }
                tempResult += tempValue + "=" + encodeURIComponent(value[tempValue]);
                k++;
            }
            value = tempResult;
        }
        else {
            value = encodeURIComponent(value);
        }

        document.cookie = [name, '=', value, expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

                    //Search sub key
                    if (typeof subName != 'undefined' && subName != null && subName != "") {
                        var subCookies = cookieValue.toString().split('&');
                        for (var j = 0; j < subCookies.length; j++) {
                            var subCookie = jQuery.trim(subCookies[j]);
                            if (subCookie.substring(0, subName.length + 1) == (subName + '=')) {
                                cookieValue = decodeURIComponent(subCookie.substring(subName.length + 1));
                                break;
                            }
                        }
                    }

                    break;
                }

            }
        }
        return cookieValue;
    }
};
/*字符串处理*/
String.format = function (text) {
    //check if there are two arguments in the arguments list
    if (arguments.length <= 1) {
        return text;
    }
    //decrement to move to the second argument in the array
    var tokenCount = arguments.length - 2;
    for (var token = 0; token <= tokenCount; token++) {
        //iterate through the tokens and replace their
        // placeholders from the original text in order
        text = text.replace(new RegExp("\\{" + token + "\\}", "gi"), arguments[token + 1]);
    }
    return text;
};
var UT = {};
//MD5加密
UT.MD5 = function (string) {

    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }

    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }

    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

    return temp.toLowerCase();
}
//加载多语言
$.extend({
    includePath: '',
    include: function (file) {
        var files = typeof file == "string" ? [file] : file;
        for (var i = 0; i < files.length; i++) {
            var name = files[i].replace(/^\s|\s$/g, "");
            var att = name.split('.');
            var ext = att[att.length - 1].toLowerCase();
            var isCSS = ext == "css";
            var tag = isCSS ? "link" : "script";
            var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' id='languagepack' ";
            $.includePath = '/Scripts/Lang/';
            var link = (isCSS ? "href" : "src") + "='" + $.includePath + name + "'";
            if ($(tag + "[" + link + "]").length == 0) document.write("<" + tag + attr + link + "></" + tag + ">");
        }
    }
});

if (typeof (kendo) != "undefined") {

    /*KendoUI Extend 获取选择的行数据*/
    kendo.ui.Grid.prototype.selectedDataRows = function () {
        var rows = this.select();
        var data = [];
        for (var i = 0; i < rows.length; i++) {
            data.push(this.dataItem(rows[i]));
        }
        return data;
    };
    /*删除选择行的数据*/
    kendo.ui.Grid.prototype.deleteDataRows = function (ds) {
        var rows = this.select();
        var data = [];
        for (var i = 0; i < rows.length; i++) {
            data.push(this.dataItem(rows[i]));
        }
        if (data.length == 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            ds.remove(data[i]);
        }
        ds.sync();
        return true;
    };
    /*grid 调整大小*/
    kendo.ui.Grid.prototype.resizeGrid = function (height) {
        var gridElement = $(this);
        var dataArea = gridElement[0].content;

        var newGridHeight = height;
        var newDataAreaHeight = newGridHeight - 65;

        dataArea.height(newDataAreaHeight);
        gridElement[0].element.height(newGridHeight);

        this.refresh();
    };
}

//本地化GRID信息
//(function () {
//    switch ($.GetCurrentLanguage()) {
//        case "zh-cn":
//            $.extend(kendo.ui.FilterMenu.prototype.options.messages, {
//                and: "并且",
//                clear: "清除条件",
//                filter: "筛选",
//                info: "筛选记录",
//                isFalse: "禁用",
//                isTrue: "启用",
//                or: "或者",
//                selectValue: "-选择-"
//            });

//            $.extend(kendo.ui.FilterMenu.prototype.options.operators, {
//                string: {
//                    eq: "等于",
//                    neq: "不等于",
//                    startswith: "开始包含",
//                    contains: "包含",
//                    endswith: "结束包含"
//                },
//                //filter menu for "number" type columns
//                number: {
//                    eq: "等于",
//                    neq: "不等于",
//                    gte: "大于或等于",
//                    gt: "大于",
//                    lte: "小于等于",
//                    lt: "小于"
//                },
//                //filter menu for "date" type columns
//                date: {
//                    eq: "等于",
//                    neq: "不等于",
//                    gte: "在此日期或之后",
//                    gt: "此日期之后",
//                    lte: "在此日期或之前",
//                    lt: "此日期之前"
//                },
//                //filter menu for foreign key values
//                enums: {
//                    eq: "等于",
//                    neq: "不等于"
//                }
//            });

//            $.extend(kendo.ui.Pager.prototype.options.messages, {
//                display: "{0} - {1}  共 {2} 条",
//                empty: "没有记录",
//                page: "页",
//                of: "{0}",
//                itemsPerPage: "每页记录数",
//                first: "第一页",
//                previous: "前一页",
//                next: "后一页",
//                last: "最后一页",
//                refresh: "刷新"
//            });
//            $.extend(kendo.ui.Groupable.prototype.options.messages, {
//                empty: "拖动列标题放这里"
//            });

//            //        $.extend(kendo.ui.MultiDayView.prototype.options.messages, {
//            //        allDay: "整天"
//            //    });


//            kendo.culture("zh-CN");
//            break;
//    }
//})();

/*
    封装KENDO grid
    grid_no有表示AJAX获取列和数据源信息， 没有则必须定义custom

*/
$.widget("bz.grid", {
    // default options
    options: {
        toolbar: null,
        grid_no: "",
        baseUrl: "",
        readData: {},
        selectable: "row multiple", //选择方式
        sort: [], //[{ field: "RETAIL_NO", dir: "desc" }]
        editable: false, //表格可编辑
        isPage: true, //是否是分页 数据
        height: 500,
        widht: 1500,
        server: true,
        autoBind: true,
        dataBound: $.noop,
        requestEnd: $.noop,
        detailInit: null,
        scrollable: false,
        checkBoxColumn: false,
        checkBoxColumnlock: false,
        pageable: true,
        template: null,
        actionUrl: ["getlist", "add", "update", "del"],
        contextMenu: null,
        rowClick: $.noop,
        filter: null,
        logic: null,
        resizeGridWidth: false,
        detailTemplate: null,
        detailExpand: $.noop,
        allDetailExpand: true,
        group: false,
        groupfield: null,
        dataSource: true,//使用dataSource数据源
        customsearch: false,//自定义查询，分页model不一样需要配置
        custom: {
            PrimaryKey: "",
            fields: {},
            aggrs: [],
            cols: []
        }
    },
    grid: null,
    ds: null,
    selectall: false,
    //initlize 
    _init: function () {

    },
    // the constructor
    _create: function () {
        var $opts = this.options;
        var $this = this;
        if ($opts.grid_no == "") {
            /*
            手动设置列，数据源；
            主键   g.PrimaryKey
             数据源 g.fields
             合计列 g.aggrs 
             GRID列 g.cols
            */
            var g = $opts.custom;
            $this._buildGrid(g);
        } else {
            $.getJSON($.gridurl, { grid_no: $opts.grid_no }, function (g) {
                if (g.result.ResultNo == 0) {
                    x5alert(String.format("没有找到 {0} 格式", $opts.grid_no));
                    return;
                }
                $this._buildGrid(g);
            });
        }
        this._refresh();
        if (this.options.resizeGridWidth) {
            this.resizeGridWidth();
        }
    },
    // called when created, and later when changing options
    _refresh: function () {
        //this._trigger("change");
    },
    //创建Grid
    _buildGrid: function (g) {
        var $opts = this.options;
        var $this = this;
        $this.ds = new kendo.data.DataSource({
            transport: {
                read: {
                    url: $opts.baseUrl + $opts.actionUrl[0],
                    contentType: 'application/json',
                    data: $opts.readData,
                },
                create: {
                    url: $opts.baseUrl + $opts.actionUrl[1],
                    contentType: 'application/json', //提交类型为json
                    type: "POST"
                },
                update: {
                    url: $opts.baseUrl + $opts.actionUrl[2],
                    contentType: 'application/json', //提交类型为json
                    type: "POST"
                },
                destroy: {
                    url: $opts.baseUrl + $opts.actionUrl[3],
                    contentType: 'application/json', //提交类型为json
                    type: "POST"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return JSON.stringify({ models: options.models });
                    } else {
                        //查找是否有条件函数
                        if (typeof ($opts.filter) === "function") {
                            //如果已经有filter
                            if (options.filter === undefined || options.filter == null) {
                                if ($opts.customsearch) {

                                    if ($opts.filter()==undefined) {
                                        return JSON.stringify(options);
                                    }

                                    if ($opts.filter().length == 0) {
                                        return JSON.stringify(options);
                                    }
                                    if ($opts.filter().length == 1) {
                                       
                                       // if ($opts.filter()[0].flag == "false")
                                       // {
                                       //     options.Keywords = $opts.filter()[0].value;
                                       //     return JSON.stringify($opts.filter()[0]);
                                       // }
                                       //else if ($opts.filter()[0].flag == "true")
                                       // {
                                       //     options.Keywords = $opts.filter()[0].value;
                                       //     return JSON.stringify(options);

                                       //}
                                       // else
                                        //{
                                       
                                            options.Keywords = $opts.filter()[0].Keywords;
                                            options.PageIndex = options.page;
                                            options.date_begin= $opts.filter()[0].date_begin;
                                            options.end_dt = $opts.filter()[0].end_dt;
                                           
                                            return JSON.stringify(options);
                                       // }
                                    }
                                   
                                    $.extend(options, { filter: { filters: $opts.filter(), logic: ($opts.logic != null) ? $opts.logic : "and" } });
                                    return JSON.stringify(options);
                                }
                                else {
                                    
                                    var fs = {
                                        PageIndex: options.page,
                                        PageSize: options.pageSize
                                        //keyword : $opts.filter().value
                                    }
                                    var ft = $opts.filter();
                                    if (ft == undefined)
                                    {
                                        return JSON.stringify(options);
                                    }
                                    var tempjson = {};
                                    for (var i = 0; i < ft.length; i++) {
                                        tempjson[ft[i].field] = ft[i].value;
                                        if ($opts.filter()[0].flag == "false") {
                                            options.Keywords = $opts.filter()[0].Keywords;
                                            options.PageIndex = options.page;
                                            return JSON.stringify(options);
                                        }
                                    }
                                    $.extend(fs, tempjson);
                                    return JSON.stringify(fs);
                                }
                            }
                            else {
                                var fs = $opts.filter().filters;
                                options.filter.filters = options.filter.filters.concat(fs);
                            };
                        };
                        //没有排序，获取默认排序
                        if (options.sort == undefined) {
                            options.sort = $opts.sort;
                        }

                        return JSON.stringify(options);
                    }
                }
            },
            serverPaging: $opts.server && $opts.isPage,
            serverFiltering: $opts.server,
            serverSorting: $opts.server && $opts.isPage,
            batch: true,
            pageSize: $opts.isPage ? 20 : 999,
            schema: {
                model: {
                    id: g.PrimaryKey, //ID如果不存在于fields,新增和更改无法识别。
                    fields: g.fields
                },
                data: function (response) {
                    if ($opts.isPage) {
                        if (response.Data.List == undefined) {//前端分页
                            return response.Data;
                        }
                        else {
                            return response.Data.List;
                        }
                    } else {
                        return response.Data;
                    }
                },
                total: function (response) {
                    if ($opts.isPage) {
                        //return response.row_count;
                        if (response.Data.PageInfo == undefined) {//前端分页
                            return response.Data.length;
                        }
                        else {
                            return response.Data.PageInfo.RecordCount;
                        }
                    } else {
                        return response.length;
                    }
                }
            },
            group: $opts.group ? $opts.groupfield : [],
            aggregate: g.aggrs,
            change: function (e) {
            },
            error: function (e) {
                alert("远程操作错误；" + e.xhr.responseText);
            },
            requestEnd: function (e) {
                if (e.type == "update" || e.type == "destroy" || e.type == "create") {
                    if (e.response.IsSuccess) {
                        //Dialog.Notify("操作成功" + e.type);
                        showTipsMsg("操作成功" + e.type, 3000, "ok");
                    } else {
                        x5alert(String.format("<div class='red fa-2x'><i class='fa fa-bell'></i>{0} 操作失败</div><p>{1}</p>", e.type, e.response.ResultDescription));
                        $this.ds.cancelChanges();
                    }
                } else {

                    $opts.requestEnd.call(this, e.response);
                }
            }
        });
        if ($opts.checkBoxColumn) {
            g.cols.splice(0, 0, {
                field: "CHECK",
                title: "&nbsp;",
                template: String.format('<input type="checkbox" class="check-single" noclick="f_Singlecheck(this);" id="#:{0}#" style="margin-left: 3px;"/>', g.PrimaryKey),
                headerTemplate: '<input type="checkbox" id="check-all"></input>',
                filterable: false,
                sortable: false,
                width: 30,
                locked: $opts.checkBoxColumnlock,
                lockable: $opts.checkBoxColumnlock
            });
        };
        //grid
        $this.grid = $this.element.kendoGrid({
            dataSource: $this.ds,
            toolbar: $opts.toolbar,
            rowTemplate: $opts.template,
            navigatable: true,
            height: $opts.height,
            width: $opts.width,
            reorderable: true,
            pageable: $opts.isPage ? {
                input: typeof ($opts.pageable) === "object" ? $opts.pageable.input : true,
                refresh: typeof ($opts.pageable) === "object" ? $opts.pageable.refresh : true,
                pageSizes: typeof ($opts.pageable) === "object" ? $opts.pageable.pageSizes : true,
                numeric: typeof ($opts.pageable) === "object" ? $opts.pageable.numeric : true,
                previousNext: typeof ($opts.pageable) === "object" ? $opts.pageable.previousNext : true,
                info: typeof ($opts.pageable) === "object" ? $opts.pageable.info : true
            } : false,
            sortable: {
                mode: "single"
            },
            editable: $opts.editable,
            scrollable: $opts.scrollable,
            filterable: true,
            resizable: true,
            columnMenu: false,
            autoBind: false,
            detailTemplate: $opts.detailTemplate,

            detailExpand: $opts.detailExpand,
            dataBound: function (e) {
                for (var i = 0; i < $(".k-grid-aa").length; i++) {
                    $($(".k-grid-aa")[i]).removeClass("k-button");
                }
                for (var i = 0; i < $(".k-grid-bb").length; i++) {
                    $($(".k-grid-bb")[i]).removeClass("k-button");
                }
                for (var i = 0; i < $(".k-grid-cc").length; i++) {
                    $($(".k-grid-cc")[i]).removeClass("k-button");
                }
                //如果是获取数据，是否有获取数据后的事件
                $opts.dataBound.call(this, e);
            },
            detailInit: $opts.detailInit,
            selectable: $opts.selectable,
            columns: g.cols,
            change: function (e) {
                if (typeof ($opts.rowClick) != "function") { return; }
                var data = $this.grid.selectedDataRows();
                $opts.rowClick.call(this, data);
            }
        }).data("kendoGrid");
        $("#check-all").click(function (e) {
            var checkboxs = $(".check-single");
            if (this.checked) {
                for (var i = 0; i < checkboxs.length; i++) {
                    checkboxs[i].checked = true;
                }
            }
            else {
                for (var i = 0; i < checkboxs.length; i++) {
                    checkboxs[i].checked = false;
                }
            }
            e.stopPropagation();
        });
        //插入展开按钮
        if ($opts.detailTemplate != null && $opts.allDetailExpand) {
            $(".k-hierarchy-cell").append('<i id="grid_expand" class="icon-sitemap" style=" cursor: pointer;"></i>');
            $("#grid_expand").toggle(function () {
                $("#grid").data("kendoGrid").expandRow(".k-master-row");
            }, function () {
                $("#grid").data("kendoGrid").collapseRow(".k-master-row");
            });
        }
        if ($opts.autoBind) {
            $this.ds.query();
        }
        if ($opts.contextMenu != false) {
            //$this.grid.contextMenu({

            //}, function (key, Options) {
            //    alert(key);
            //});
        }
    },
    // 公共方法; 刷新数据源 $().singleDept("refresh");
    refresh: function (func, logic) {
        var $opts = this.options;
        if (func === undefined) {
            this.ds.query();
        } else {
            $opts.filter = func;
            if (logic != undefined) {
                $opts.logic = logic.logic;
            }
            this.ds.read();
        }
    },
    //获取选择的数据
    selectedDataRows: function () {
        if (this.grid) {
            var data = this.grid.selectedDataRows();
            return data;
        } else {
            return null; //但grid没有初始化好的时候。
        }
    },
    //选择框选择的行
    checkedDataRows: function () {
        var checkboxs = $(".check-single");
        var dataSource = this.ds;
        var dataItemAarry = [];
        for (var i = 0; i < checkboxs.length; i++) {
            if (checkboxs[i].checked) {
                dataItemAarry.push(dataSource.get($(checkboxs[i]).attr("id")));
            }
        }
        return dataItemAarry;
    },
    //选择所有行
    selectAll: function () {
        if (this.selectall) {
            this.grid.clearSelection();
        } else {
            this.grid.selectAll();
        }
        this.selectall = !this.selectall;
    },
    //删除行
    deleteRows: function () {
        this.grid.deleteDataRows(this.ds);
    },
    //新增行
    addNew: function (row) {
        if (row === undefined) {
            this.ds.add();
        } else {
            this.ds.add(row);
        }
    },
    //保存行
    save: function () {
        this.ds.sync();
    },
    //调整GRID 高度
    resizeGrid: function (height) {
        this.grid.resizeGrid(height);
    },
    //调整GRID 宽度,防止无限拉伸
    resizeGridWidth: function () {
        $(this.element).width($("#contextPage").width() - this.options.dwidth == undefined ? 245 : this.options.dwidth);//lkj
    },
    // 销毁对象
    _destroy: function () {
        // remove generated elements
        this.element.remove();
    },
    // _setOptions is called with a hash of all options that are changing always refresh when changing options
    _setOptions: function () {
        // _super and _superApply handle keeping the right this-context
        this._superApply(arguments);
        this._refresh();
    },
    // _setOption is called for each individual option that is changing
    _setOption: function (key, value) {
        this._super(key, value);
    }
});

//editer
(function ($, undefined) {
    $.widget("BZ.editer", {
        options: {
            url: "",
            title: "",
            Ok: $.noop,
            Close: $.noop,
            type: null,
            direction: "",
            comboxTree: {
                url: "",
                data: null,
                treetemplate: null,
                url2: ""
            },
            template: null,
            grouptype: 1 //针对组的类别 //分类别,1:设备组;2:设备组+设备;3:人员组;4:人员组+人员;
        },
        _init: function () {

        },
        _create: function () {
            var pt = this._position();
            if ($(".editable-container").length > 0) {
                $(".editable-container").remove();
            }
            if (this.options.template != null) {
                $("body").append('<div class="popover fade in editable-container editable-popup right" style="display:block;z-index:9999;">' +
                            '<div class="arrow" style="left: -10px;"></div>' +
                            '<h3 class="popover-title">' + this.options.title + '</h3>' +
                            '<div class="popover-content"> <div><div class="editableform-loading" style="display: none;"></div>' + this.options.template +
                            '</div></div></div></div>');
                //获取值
                //$("#BzEditerText").val(this.element.html());
                $("#BzEditerOk").bind("click", { obj: this }, function (event) {
                    event.data.obj.options.Ok.caller(event.data.obj);

                });
                //关闭编辑框
                $("#BzEditerCancel").bind("click", { obj: this }, function (event) {
                    event.data.obj.options.Cancel.caller(event.data.obj);
                });
            }
            else {
                switch (this.options.type) {
                    case "comboxtree": $("body").append('<div class="popover fade in editable-container editable-popup right" style="display:block;z-index:9999;">' +
                            '<div class="arrow" style="left: -10px;"></div>' +
                            '<h3 class="popover-title">' + this.options.title + '</h3>' +
                            '<div class="popover-content"> <div><div class="editableform-loading" style="display: none;"></div>' +
                            '<div class="form-inline editableform" style=""><div class="control-group"><div>' +
                            '<div class="editable-input" style="position: relative;">' +
                            '<input type="text" id="BzEditerComboxTree" class="input-medium" style="padding-right: 24px;"></div><div class="editable-buttons">' +
                            '<button id="BzEditerOk" class="btn btn-primary" style="padding-bottom: 6px; padding-top: 6px; margin-top: 0px; height: 34px; border-width: 1px;"><i class="icon-ok icon-white"></i></button>' +
                            '<button id="BzEditerCancel" class="btn editable-cancel" style="width: 44px; padding-bottom: 6px; padding-top: 6px; margin-top: 0px; height: 34px; border-width: 1px;"><i class="icon-remove"></i></button></div></div><div class="editable-error-block help-block" style="display: none;"></div></div></div></div></div></div>');
                        this.comboxtree = $("#BzEditerComboxTree").comboxTree({
                            url: this.options.comboxTree.url,
                            url2: this.options.comboxTree.url2,
                            data: this.options.comboxTree.data,
                            treetemplate: this.options.comboxTree.treetemplate,
                            type: this.options.comboxTree.grouptype,
                            remote: true,
                            diffwidth: 36
                        }).data("BZ-comboxTree");
                        $("#BzEditerOk").bind("click", { obj: this }, function (event) {
                            event.data.obj.options.Ok.call(event.data.obj, event.data.obj.comboxtree);

                        });
                        $(document).unbind("mouseup").bind("mouseup", { obj: this }, function (event) {
                            if ($(event.target).parents(".editable-container").length == 0 && $(event.target).parents("#Combox_orgnizetree_BzEditerComboxTree").length == 0 && $(event.target).parents("#bz_Search_obj").length == 0) {
                                event.data.obj.close();
                            }
                        });
                        break;
                    default://默认编辑框
                        $("body").append('<div class="popover fade in editable-container editable-popup right" style="display:block;z-index:9999;">' +
                            '<div class="arrow" style="left: -10px;"></div>' +
                            '<h3 class="popover-title">' + this.options.title + '</h3>' +
                            '<div class="popover-content"> <div><div class="editableform-loading" style="display: none;"></div>' +
                            '<div class="form-inline editableform" style=""><div class="control-group"><div>' +
                            '<div class="editable-input" style="position: relative;">' +
                            '<input type="text" id="BzEditerText" class="input-medium" style="padding-right: 24px; padding-top: 6px; padding-bottom: 6px;"><span class="editable-clear-x"></span></div><div class="editable-buttons">' +
                            '<button id="BzEditerOk" class="btn btn-primary" style="padding-bottom: 6px; padding-top: 6px; margin-top: 0px; height: 34px; border-width: 1px;"><i class="icon-ok icon-white"></i></button>' +
                            '<button id="BzEditerCancel" class="btn editable-cancel" style="width: 44px; padding-bottom: 6px; padding-top: 6px; margin-top: 0px; height: 34px; border-width: 1px;"><i class="icon-remove"></i></button></div></div><div class="editable-error-block help-block" style="display: none;"></div></div></div></div></div></div>');
                        //获取值
                      
                        $("#BzEditerText").val(this.element.html());
                        $("#BzEditerOk").bind("click", { obj: this }, function (event) {
                            event.data.obj.options.Ok.call(event.data.obj, $("#BzEditerText").val());

                        });
                        $(".editable-clear-x").bind("click", function () {
                            $("#BzEditerText").val("");
                        });
                        $(document).unbind("mouseup").bind("mouseup", { obj: this }, function (event) {
                            if ($(event.target).parents(".editable-container").length == 0) {
                                event.data.obj.close();
                            }
                        });
                        break;
                }
                //关闭编辑框
                $("#BzEditerCancel").bind("click", { obj: this }, function (event) {
                    if (typeof (event.data.obj.options.Close) == "function") {
                        event.data.obj.options.Close.call(event.data.obj, $("#BzEditerText").val());
                    }
                    event.data.obj.close();
                });
            }
            $(".editable-container").css({
                top: pt.top + pt.height / 2 - $(".editable-container").height() / 2 + "px",
                left: (pt.left + pt.width) + "px"
            });

        },
        show: function () {
            var pt = this._position();
            $(".editable-container").css({
                top: pt.top + pt.height / 2 - $(".editable-container").height() / 2 + "px",
                left: (pt.left + pt.width) + "px"
            });
            //获取值
            $("#BzEditerText").val(this.element.html());
            $(".editable-container").show();
        },
        close: function () {
            this.destroy();
            $(".editable-container").remove();
            if (this.comboxtree != undefined) {
                this.comboxtree.destroy();
                $("#Combox_orgnizetree").remove();
            }
        },
        hide: function () {
            $(".editable-container").hide();
        },
        _position: function () {
            var position = this.element.offset();
            return tjson = {
                top: position.top,
                left: position.left,
                width: this.element.outerWidth(true),
                height: this.element.outerHeight(true)
            }
        }
    })
})(jQuery);

//对话框
(function ($) {
    $.x5window = function (title, content, callback, par) {
        function _callback(data) {
            if (par != undefined) {
                callback(data, par);
            }
            else {
                callback(data);
            }
        }
        $("body").append('<div id="x5window"></div>');
        $("#x5window").kendoWindow({
            actions: ["Close"],
            modal: true,
            iframe: true,
            draggable: true,
            resizable: false,
            title: title,
            close: function (e) {
                if (typeof (callback) != "undefined") {
                    //if (this.ok) {
                    _callback(this.data);//回调关闭窗口事件
                    //}
                }
                this.destroy();
            }
        }).data("kendoWindow").content(content).center();
        $("#Win_Cancel").click(function () {
            $("#x5window").data("kendoWindow").close();
        });
    }

    /*
    单选行或多选行，对话框
    标题，数据，字段，是否单选，确定回传事件
    fields like {field:{title:"1"},field2:{title:"2",type:"string"}}
    */
    $.x5selectWindow = function (title, jsonData, fields, callback, isSingle) {
        if (isSingle == undefined) {
            isSingle = true;
        }
        parent.$("body").append('<div id="x5selectwindow">' +
            '<div id="x5selectwindow-grid"></div>' +
            '<div style="float:right;margin:5px;">' +
            '<button class="btn btn-sm btn-primary">确定</button><button class="btn btn-sm">取消</button></div></div>');
        //加载
        var cols = [];
        for (var key in fields) {
            cols.push({ field: key, title: " ", width: "120px" });
        };
        var grid = parent.$("#x5selectwindow-grid").kendoGrid({
            dataSource: {
                data: jsonData,
                schema: {
                    model: {
                        fields: fields
                    }
                }
            },
            height: 450,
            width: 500,
            scrollable: true,
            sortable: true,
            filterable: true,
            pageable: false,
            selectable: isSingle ? "row" : "multiple, row",
            columns: cols
        }).data("kendoGrid");

        var wind = parent.$("#x5selectwindow").kendoWindow({
            actions: ["Close"],
            modal: true,
            iframe: false,
            draggable: true,
            resizable: true,
            width: 520,
            title: title,
            close: function (e) {
                if (typeof (callback) != "undefined") {
                    if (this.ok) {
                        callback(this.data);
                    }
                }
                this.destroy();
            }
        }).data("kendoWindow").center();

        var buttons = parent.$("#x5selectwindow").find("button");

        $(buttons[0]).click(function (e) {
            if (typeof (callback) != "undefined") {
                //判断是否选择了行
                var selectedRows = grid.select();
                if (selectedRows.length == 0) {
                    alert("请选择行");
                    return;
                }
                var selectedDataItems = [];
                for (var i = 0; i < selectedRows.length; i++) {
                    var dataItem = grid.dataItem(selectedRows[i]);
                    selectedDataItems.push(dataItem);
                }

                callback.call(this, isSingle ? selectedDataItems[0] : selectedDataItems);
                wind.close();
            }
        });

        $(buttons[1]).click(function (e) {
            wind.close();
        });
    }
})(jQuery);

function reset() {
    parent.alertify.set({
        labels: {
            ok:"ok",
            cancel: "取消 "
        },
        delay: 3000,
        buttonReverse: true,
        buttonFocus: "none"
    });
}
function BzSuccess(message) {
    reset();
    parent.alertify.success(message);
}
function BzAlert(message) {
    reset();
    parent.alertify.alert(message);
    parent.$(".alertify-dialog").css({ "word-break": "break-all", "word-wrap": "break-word" });
}

function BzConfirm(message, callback, par) {
    reset();
    function _callback(e) {
        if (par != undefined) {
            callback(e, par);
        }
        else {
            callback(e);
        }
    };
    parent.alertify.confirm(message, function (e) {
        _callback(e);
        //if (e) {
        //    //if()
        //    _callback(e);
        //    //parent.alertify.success("You've clicked OK");
        //} else {
        //    //alertify.error("You've clicked Cancel");
        //    _callback(e);
        //}
    });
}

function BzPrompt(message, callback, value) {
    reset();
    parent.alertify.prompt(message, function (e, str) {
        if (e) {
            callback.call(this, str);
        } else {

        }
    }, value);
}

//*获取账号组
function FindSubGroupByParentIdRecycle(id, chtml) {
    $.get("/Common/PeopleManageGroup/FindSubGroupByParentIdRecycle", { GroupId: id }, function (data) {
        if (data.Status == 0) {
            $("#orgnizetree").kendoTreeView({
                dataSource: {
                    data: fomattree(gettree(data.Data, "icon-group"))
                },
                template: kendo.template(chtml),
                select: function (e) {
                    grid.grid("refresh", function () {
                        return [
                            { field: "keyword", Operator: "eq", value: parseInt($(e.node).find('[attr="treenode"]').attr("nodeid")) },
                            { field: "userType", Operator: "eq", value: parseInt($('.nav-tabs li[class="active"]').attr("value")) }
                        ];
                    });
                }
            }).data("kendoTreeView").collapse(".k-item");
            if (data.Data.length > 0) {
                var treeview = $("#orgnizetree").data("kendoTreeView")
                treeview.select($(".k-item:first"));
                $("#tree_addRootNode").show();
                refreshGrid();
            }
        }
        else {
            BzAlert(data.Message);
        }
    });
}
//*获取账号组+账号
function FindSubUserGroupByParentIdRecycle(id, chtml, callback) {
    function _callback(data) {
        callback(data);
    }
    $.get("/Common/PeopleManageGroup/FindSubUserGroupByParentIdRecycle", { GroupId: id }, function (data) {
        if (data.Status == 0) {
            $("#orgnizetree").kendoTreeView({
                dataSource: {
                    data: accountToGroup(fomattree(gettree(data.Data.GroupInfo, "icon-group")), data.Data.UserInfo, "icon-user")
                },
                template: kendo.template(chtml),
                select: function (e) {
                    if (typeof (callback) != "undefined") {
                        _callback(e.node);//协助诊断用
                    }
                    //var accuntid = parseInt($(e.node).find('[attr="treenode"]').attr("nodeid")),
                    //    type = parseInt($(e.node).find('[attr="treenode"]').attr("flag")),
                    //    treeobj = $("#orgnizetree_menu").data("kendoTreeView"),
                    //    selectedNode = treeobj.select();
                    ////menuid = selectedNode.find('.k-state-selected span').attr("nodeid");
                    //getAceess(accuntid, selectedNode, type, selectedNode.find('.k-state-selected span').attr("nodeid"));
                    //if (parseInt($(e.node).find('[attr="treenode"]').attr("flag")) == 0) {//账号组
                    //    $.get("/Common/Function/GetUserGroupAccredit", { groupId: id }, function (data) {
                    //        if (data.Status == 0) {
                    //            for (var i = 0; i < data.Data.length; i++) {
                    //                var id = data.Data[i].FUNC_NBR.replace(/\./g, "");
                    //                $('input[name="' + id + '"]').removeAttr("checked");
                    //                if (data.Data[i].PERMISSION == 2 || data.Data[i].PERMISSION == 3) {
                    //                    //'<label class="radio" style="margin-top: 0px !important;font-size: 12px;"><input type="radio" name="' + data[i].FUNC_NBR.replace(/\./g, "") + '" value="2" value1="' + data[i].PERMISSION + '" ' + ((data[i].PERMISSION == 2 || data[i].PERMISSION == 3) ? "checked" : "") + '/>' + (data[i].PERMISSION == 2 ? "继承(授予)" : (data[i].PERMISSION == 3 ? "继承(拒绝)" : "继承")) + '</label>' +
                    //                    $('input[name="' + id + '"][value="2"]').attr("checked", true);
                    //                    $('input[name="' + id + '"][value="2"]').attr("value1", data.Data[i].PERMISSION);
                    //                    if (data.Data[i].PERMISSION == 2) {
                    //                        $('input[name="' + id + '"][value="2"]').parents("label").children().eq(1).text($.Translate("Common.INHERIT_GRANT"));
                    //                    }
                    //                    else {
                    //                        $('input[name="' + id + '"][value="2"]').parents("label").children().eq(1).text($.Translate("Common.INHERIT_FEFUSE"));
                    //                    }
                    //                }
                    //                else {
                    //                    $('input[name="' + id + '"][value="' + data.Data[i].PERMISSION + '"]').attr("checked", true);
                    //                }
                    //            }
                    //            App.initUniform();
                    //        }
                    //        else {
                    //            BzAlert(data.Message);
                    //        }
                    //    });
                    //}
                    //else {
                    //    $.get("/Common/Function/GetUserAccredit", { userId: id }, function (data) {
                    //        if (data.Status == 0) {
                    //            for (var i = 0; i < data.Data.length; i++) {
                    //                var id = data.Data[i].FUNC_NBR.replace(/\./g, "");
                    //                $('input[name="' + id + '"]').removeAttr("checked");
                    //                if (data.Data[i].PERMISSION == 2 || data.Data[i].PERMISSION == 3) {
                    //                    //'<label class="radio" style="margin-top: 0px !important;font-size: 12px;"><input type="radio" name="' + data[i].FUNC_NBR.replace(/\./g, "") + '" value="2" value1="' + data[i].PERMISSION + '" ' + ((data[i].PERMISSION == 2 || data[i].PERMISSION == 3) ? "checked" : "") + '/>' + (data[i].PERMISSION == 2 ? "继承(授予)" : (data[i].PERMISSION == 3 ? "继承(拒绝)" : "继承")) + '</label>' +
                    //                    $('input[name="' + id + '"][value="2"]').attr("checked", true);
                    //                    $('input[name="' + id + '"][value="2"]').attr("value1", data.Data[i].PERMISSION);
                    //                    if (data.Data[i].PERMISSION == 2) { 
                    //                        $('input[name="' + id + '"][value="2"]').parents("label").children().eq(1).text($.Translate("Common.INHERIT_GRANT"));
                    //                    }
                    //                    else {
                    //                        $('input[name="' + id + '"][value="2"]').parents("label").children().eq(1).text($.Translate("Common.INHERIT_FEFUSE"));
                    //                    }
                    //                }
                    //                else {
                    //                    $('input[name="' + id + '"][value="' + data.Data[i].PERMISSION + '"]').attr("checked", true);
                    //                }
                    //            }
                    //            App.initUniform();
                    //        }
                    //        else {
                    //            BzAlert(data.Message);
                    //        }
                    //    });
                    //}
                }
            }).data("kendoTreeView").collapse(".k-item");
        }
        else {
            BzAlert(data.Message);
        }
    });
}
//*获取设备组
//*获取设备组
function GetGrouplist(id, url,chtml,icon) {
    $.post(url, { groupID: id }, function (data) {
      //  data = JSON.parse(data);
        $("#orgnizetree").kendoTreeView({
            dataSource: {
                data: fomattree(gettree(data.Data, icon))
            },
            template: kendo.template(chtml),
            select: function (e) {
                //if (typeof (callback) != "undefined") {
                //    _callback(e.node);//协助诊断用
                //}
                //else {
                grid.grid("refresh", function () {
                    var type = $('.nav-tabs li[class="active"]').attr("value");
                    if(type==undefined){
                        return [
                        { field: "keyword", Operator: "eq", value: parseInt($(e.node).find('[attr="treenode"]').attr("nodeid")) }
                    ];
                    }else{
                         return [
                        { field: "keyword", Operator: "eq", value: parseInt($(e.node).find('[attr="treenode"]').attr("nodeid")) },
                       { field: "userType", Operator: "eq", value: parseInt($('.nav-tabs li[class="active"]').attr("value")) }]
                    }
                    
                });
               // }
            }
        }).data("kendoTreeView");
        $("#orgnizetree").data("kendoTreeView").collapse(".k-item");
        
        if (data.Data.length > 0) {
            var treeview = $("#orgnizetree").data("kendoTreeView")
            treeview.select($(".k-item:first"));
            $("#tree_addRootNode").show();
            //if (typeof (callback) != "undefined") {
            //    _callback(treeview.select());
            //}
            //else {
              refreshGrid();
            //}
        }
    });
}
//*获取设备组+设备
function GetAllMachineAndMachineGroup(id, chtml, callback) {
    function _callback(data) {
        callback(data);
    }
    $.get("/Common/MachineManage/GetAllMachineAndMachineGroup", { GroupId: id }, function (data) {
        if (data.Status == 0) {
            $("#orgnizetree").kendoTreeView({
                dataSource: {
                    data: machineToGroup(fomattree(gettree(data.Data.GetAllMachineGroupList, "icon-cogs")), data.Data.GetAllMachineList, "icon-cog")
                },
                template: kendo.template(chtml),
                select: function (e) {
                    if (typeof (callback) != "undefined") {
                        _callback(e);
                    }
                }
            }).data("kendoTreeView").collapse(".k-item");
        }
        else {
            BzAlert(data.Message);
        }
    });
}
//*获取人员组
function GetMemberGrouplist(id, chtml, callback) {
    function _callback(data) {
        callback(data);
    }
    $.post("/member/GetGrouplist", JSON.stringify({ groupId: id }), function (data) {
        if (data.Status == 0) {
            $("#orgnizetree").kendoTreeView({
                dataSource: {
                    data: fomattree(gettree(data.Data, "icon-group"))
                },
                template:null,
                select: function (e) {
                    //if (typeof (callback) != "undefined") {
                    //    _callback(e.node);
                    //}
                   // else {
                        grid.grid("refresh", function () {
                            return [
                                { field: "keyword", Operator: "eq", value: parseInt($(e.node).find('[attr="treenode"]').attr("nodeid")) },
                                { field: "userType", Operator: "eq", value: parseInt($('.nav-tabs li[class="active"]').attr("value")) }
                            ];
                        });
                   // }
                }
            }).data("kendoTreeView").collapse(".k-item");
            if (data.Data.length > 0) {
                var treeview = $("#orgnizetree").data("kendoTreeView")
                treeview.select($(".k-item:first"));
                $("#tree_addRootNode").show();
                refreshGrid();
                //if (typeof (callback) != "undefined") {
                //    _callback(treeview.select());
                //}
                //else {
                //    refreshGrid();
                //}
            }
        }
        else {
            BzAlert(data.Message);
        }
    });
}
//*获取产品组
function GetProductionGrouplist(id, chtml) {
    $.get("/ProductionTask/BasicData/getProGroup", { GroupId: id }, function (data) {
        if (data.Status == 0) {
            $("#orgnizetree").kendoTreeView({
                dataSource: {
                    data: fomattree(gettree(data.Data, "icon-group"))
                },
                template: kendo.template(chtml),
                select: function (e) {
                    grid.grid("refresh", function () {
                        return [
                            { field: "GP_NBR", Operator: "eq", value: parseInt($(e.node).find('[attr="treenode"]').attr("nodeid")) }
                            //{ field: "userType", Operator: "eq", value: parseInt($('.nav-tabs li[class="active"]').attr("value")) }
                        ];
                    });
                }
            }).data("kendoTreeView").collapse(".k-item");
            if (data.Data.length > 0) {
                var treeview = $("#orgnizetree").data("kendoTreeView")
                treeview.select($(".k-item:first"));

                refreshGrid();
            }
            $("#tree_addRootNode").show();
        }
        else {
            BzAlert(data.Message);
        }
    });
}

//*工单模块-获取产品组
function GetProductionGroups(id, chtml) {
    $.get("/Order/ProductMaintenance/getProductGroup", { gp_nbr: id }, function (data) {
        if (data.Status == 0) {
            $("#orgnizetree").kendoTreeView({
                dataSource: {
                    data: fomattree(gettree(data.Data, "icon-group"))
                },
                template: kendo.template(chtml),
                select: function (e) {
                    grid.grid("refresh", function () {
                        return [
                            { field: "keyword", Operator: "eq", value: parseInt($(e.node).find('[attr="treenode"]').attr("nodeid")) }
                        ];
                    });
                }
            }).data("kendoTreeView").collapse(".k-item");
            if (data.Data.length > 0) {
                var treeview = $("#orgnizetree").data("kendoTreeView")
                treeview.select($(".k-item:first"));

                refreshGrid();
            }
            $("#tree_addRootNode").show();
        }
        else {
            BzAlert(data.Message);
        }
    });
}

//*工单模块-获取产品组
function GetProductionGroupsf(id, chtml) {
    $.get("/Order/ProductMaintenance/getProductGroup", { gp_nbr: id }, function (data) {        
        if (data.Status == 0) {
            $("#orgnizetree").kendoTreeView({
                dataSource: {
                    data: fomattree(gettree(data.Data, "icon-group"))
                },
                template: kendo.template(chtml),
                select: function (e) {
                    grid.grid("refresh", function () {                                           
                        return [
                            { field: "keyword", Operator: "eq", value: parseInt($(e.node).find('[attr="treenode"]').attr("nodeid")) }
                        ];
                    });
                    $("#slide").text("折叠");
                    $("#slide").toggle(function () {
                        $("#slide").text("展开");
                        $("#grid").data("kendoGrid").collapseRow(".k-grouping-row");
                    }, function () {
                        $("#slide").text("折叠");
                        $("#grid").data("kendoGrid").expandRow(".k-grouping-row");
                    });

                   
                }
            }).data("kendoTreeView").collapse(".k-item");
            if (data.Data.length > 0) {
                var treeview = $("#orgnizetree").data("kendoTreeView")
                treeview.select($(".k-item:first"));             
                refreshGrid();
            }
            $("#tree_addRootNode").show();
           
        }
        else {
            BzAlert(data.Message);
        }
    });
}

//*获取文档列表
function GetDocumentList(chtml, callback) {
    function _callback(data) {
        callback(data);
    }
    $.get("/Document/DocumentManage/GetAllFiles", { pid: 0 }, function (data) {
        if (data.Status == 0) {
            $("#orgnizetree").kendoTreeView({
                dataSource: {
                    data: fomattree(gettree_document(data.Data, "icon-folder-close-alt"))
                },
                template: kendo.template(chtml),
                select: function (e) {
                    if (typeof (callback) != "undefined") {
                        _callback(e.node);//
                    }
                }
            }).data("kendoTreeView");
            $("#tree_addRootNode").show();
        }
        else {
            BzAlert(data.Message);
        }
    });
}
function gettree_document(nodes, icon) {
    var gc = function (pid, icon) {
        var cn = [];
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.ParentId === pid) {
                n.id = n.DirectoryId
                n.text = n.DirectoryName;
                n.icon = icon;//"icon-group";
                n.expanded = false;
                n.PID = n.ParentId;
                n.flag = n.IsFolder;//文件夹标志
                n.items = gc(n.id, icon);
                cn.push(n);
            }
        }
        return cn;
    }
    return gc(0, icon);
}
function gettree(nodes, icon) {//遍历组
    var gc = function (pid, icon) {
        var cn = [];
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.PID === pid) {
                n.id = n.GP_NBR
                n.text = n.GP_NAME;
                n.icon = icon;//"icon-group";
                n.expanded = true;
                n.flag = 0;//账号组标志
                n.items = gc(n.id, icon);
                cn.push(n);
            }
        }
        return cn;
    }
    return gc(0, icon);
}
function accountToGroup(data1, data2, icon) { //账号组中添加账号
    for (var i = 0; i < data1.length; i++) {
        for (var j = 0; j < data2.length; j++) {
            if (data1[i].flag == "0") { //如果是账号组
                if (data1[i].id == data2[j].PID) {
                    if (data1[i].items == undefined) {
                        data1[i].items = [];
                    }
                    var dd = {};
                    dd.id = data2[j].USER_NBR;
                    dd.text = data2[j].USER_NAME;
                    dd.icon = icon//"icon-user";
                    dd.expanded = true;
                    dd.flag = 1;//账号标志
                    data1[i].items.push(dd);
                }
            }
        }
        if (data1[i].items != undefined) {
            accountToGroup(data1[i].items, data2, icon);
        }
    }
    return data1;
}
function memberToGroup(data1, data2, icon) { //账号组中添加账号
    for (var i = 0; i < data1.length; i++) {
        for (var j = 0; j < data2.length; j++) {
            if (data1[i].flag == "0") { //如果是账号组
                if (data1[i].id == data2[j].GP_NBR) {
                    if (data1[i].items == undefined) {
                        data1[i].items = [];
                    }
                    var dd = {};
                    dd.id = data2[j].MEM_NBR;
                    dd.text = data2[j].MEM_NAME;
                    dd.icon = icon//"icon-user";
                    dd.expanded = true;
                    dd.flag = 1;//账号标志
                    data1[i].items.push(dd);
                }
            }
        }
        if (data1[i].items != undefined) {
            memberToGroup(data1[i].items, data2, icon);
        }
    }
    return data1;
}

function machineToGroup(data1, data2, icon) {
    for (var i = 0; i < data1.length; i++) {
        for (var j = 0; j < data2.length; j++) {
            if (data1[i].flag == "0") { //如果是账号组
                if (data1[i].id == data2[j].GP_NBR) {
                    if (data1[i].items == undefined) {
                        data1[i].items = [];
                    }
                    var dd = {};
                    dd.id = data2[j].MAC_NBR;
                    dd.text = data2[j].MAC_NAME;
                    dd.icon = icon//"icon-user";
                    dd.expanded = true;
                    dd.flag = 1;//账号标志
                    data1[i].items.push(dd);
                }
            }
        }
        if (data1[i].items != undefined) {
            machineToGroup(data1[i].items, data2, icon);
        }
    }
    return data1;
}

function productToGroup(data1, data2, icon)
{
    for (var i = 0; i < data1.length; i++) {
        for (var j = 0; j < data2.length; j++) {
            if (data1[i].flag == "0") {
                if (data1[i].id == data2[j].GP_NBR) {
                    if (data1[i].items == undefined) {
                        data1[i].items = [];
                    }
                    var dd = {};
                    dd.id = data2[j].PROD_NBR;
                    dd.pname = data2[j].PROD_NAME;
                    dd.text = data2[j].PROD_NO;
                    dd.icon = icon//"icon-user";
                    dd.expanded = true;
                    dd.flag = 1;//账号标志
                    data1[i].items.push(dd);
                }
            }
        }
        if (data1[i].items != undefined) {
            productToGroup(data1[i].items, data2, icon);
        }
    }
    return data1;
}

function fomattree(data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].items.length == 0) {
            delete data[i].items;
        }
        else {
            fomattree(data[i].items);
        }
    }
    return data;
}
//combox插件(树形列表+自动搜索)
(function ($, undefined) {
    $.widget("BZ.comboxTree", {
        options: {
            value: "",
            difH: 0, //宽度补差
            difW: 0, //高度补差
            width: 174,
            height: 80,//筛选结果区域高度
            cheight: 240,
            diffwidth: 39,
            size: 10,//单页请求条数
            tag: 1,//页码
            url: "",
            url2: "",
            checkbox: false,
            remote: false,
            target: null,
            validateMessage: "",
            keyup: true,
            type: 1 //分类别,1:设备组;2:设备组+设备;3:人员组;4:人员组+人员;5:菜单
        },
        _create: function () {
            var eleid = this.element.attr("id");
            if ($("#Combox_orgnizetree_" + eleid).length != 0) {
                $("#Combox_orgnizetree_" + eleid).remove();
            }
            if ($("#bz_Search_obj_" + eleid).length != 0) {
                $("#bz_Search_obj_" + eleid).remove();
            }
        },
        _init: function () {
            var self = this;
            self.rData = null;
            var eleid = self.element.attr("id");
            var strhtml = '<div class="input-append">' +
                            '<input id="input_' + eleid + '" type="text" class="span6 m-wrap" style="width: ' + this.options.width + 'px; border: 1px solid rgb(229, 229, 229);">' +
			                '<span class="add-on" style="padding-left: 4px; padding-right: 4px; margin-left:-2px;"><i class="icon-sort-down"></i></span>' +
                        '</div><label for="' + eleid + '" class="error" style="display: none;">' + this.options.validateMessage + '</label>';
            var contextstrhtml = '<div id="Combox_orgnizetree_' + eleid + '" class="Combox_orgnizetree" style="background-color:#FFFFFF; width: ' + (self.options.width + self.options.diffwidth) + 'px;display:none;">' +
                '<div id="Combox_orgnizetree_context_' + eleid + '" style="width: ' + (self.options.width + self.options.diffwidth) + 'px; height: ' + self.options.cheight + 'px; overflow-y: auto;"></div>' +
            '</div>';
            this.element.hide();
            $(strhtml).insertAfter(this.element);
            $("body").append(contextstrhtml);
            $("#input_" + eleid).focus(function () {
                $(this).addClass("inputtree_focus");
                $(this).next().addClass("inputtree_focus_add");
            }).blur(function () {
                if ($('#Combox_orgnizetree_' + eleid).is(":hidden")) {
                    $(this).removeClass("inputtree_focus");
                    $(this).next().removeClass("inputtree_focus_add");
                }
            });

            //初始化组织树
            if (this.options.checkbox) {
                self.TreeData = $('#Combox_orgnizetree_context_' + eleid).kendoTreeView({
                    checkboxes: {
                        checkChildren: true
                    },
                    template: this.options.treetemplate == null ? null : kendo.template(this.options.treetemplate)
                }).data("kendoTreeView");

            }
            else {
                self.TreeData = $("#Combox_orgnizetree_context_" + eleid).kendoTreeView({
                    obj: self,
                    template: this.options.treetemplate == null ? null : kendo.template(this.options.treetemplate),
                    select: function (e) {
                        //var comboxtree = self.options.obj;
                        switch (self.options.type) {
                            case 1: case 3://组
                                var eleid = self.element.attr("id");
                                $("#input_" + eleid).val(this.text(e.node));
                                self.rData = parseInt($(e.node).find('[attr="treenode"]').attr("nodeid"));
                                break;
                            case 2: case 4://组+人员或设备
                                if ($(e.node).find('[attr="treenode"]').attr("flag") == 1) {
                                    var eleid = self.element.attr("id");
                                    //$("#input_" + eleid).val(this.text(e.node));
                                    $("#input_" + eleid).val($(e.node).children().children().find("span").text());
                                    self.rData = parseInt($(e.node).find('[attr="treenode"]').attr("nodeid"));
                                    //验证
                                    self.validate();
                                }
                                break;
                            case 5:
                                if ($(e.node).find('[attr="treenode"]').attr("flag") == 0) {
                                    var eleid = self.element.attr("id");
                                    //$("#input_" + eleid).val(this.text(e.node));
                                    $("#input_" + eleid).val($(e.node).children().children().find("span").text());
                                    self.rData = $(e.node).find('[attr="treenode"]').attr("nodeid");
                                    self.name = $(e.node).find('[attr="treenode"]').text();
                                    self.url = $(e.node).find('[attr="treenode"]').attr("url");
                                    self.icon = $(e.node).find('[attr="treenode"]').prev().attr("class");
                                }
                                break;
                        }
                    }
                }).data("kendoTreeView");
            }

            $("#input_" + eleid).next().bind("click", { obj: self }, function (e, obj) {
                //加载组织结构，基于kendo tree
                var x5Combox = e.data.obj;
                var _top = ($(this).prev().offset().top + $(this).prev().parent().height() + x5Combox.options.difH) + "px";
                var _left = ($(this).prev().offset().left + x5Combox.options.difW) + "px";
                $("#Combox_orgnizetree_" + eleid).css({ "position": "absolute", "top": _top, "left": _left }).slideDown("slow");
                $(this).addClass("inputtree_focus_add");
                $(this).prev().addClass("inputtree_focus");
                $(document).mouseup(function (event) {
                    if ($(event.target).parents("#Combox_orgnizetree_" + eleid).length == 0) {
                        $("#Combox_orgnizetree_" + eleid).hide();
                        $("#input_" + eleid).removeClass("inputtree_focus")
                        $("#input_" + eleid).next().removeClass("inputtree_focus_add");
                    }
                });
                //$("#bz_Search_obj").hide();
                ////清空input
                //$(this).prev().val("");
                //加载数据，根据是部门，组，还是人员来获取相应的数据
                e.data.obj._ajaxRequest();
            });
            if (self.options.keyup) {
                $("#input_" + eleid).bind("keyup", { obj: self }, function (e) {
                    self.rData = null;
                    $("#Combox_orgnizetree_" + eleid).hide();
                    var x5Combox = e.data.obj;
                    x5Combox.options.tag = 1;
                    x5Combox.options.value = $(this).val();
                    if ($(this).val() != "") {
                        if ($("#bz_Search_obj_" + eleid).length == 0) {
                            $("body").append('<div id="bz_Search_obj_' + eleid + '" style="border: 1px solid #999;border-top-width:0px;background-color: #FFFFFF; width: ' + (x5Combox.options.width + x5Combox.options.diffwidth) + 'px;display:none;z-index:99999;">' +
                '<div id="bz_Search_obj_loading_' + eleid + '"><i class="icon-spinner icon-spin" style="margin-top: 5px; margin-left: 10px;"></i></div>' +
                '<div id="bz_Search_obj_context_' + eleid + '" style="width: ' + (x5Combox.options.width + x5Combox.options.diffwidth) + 'px; height: ' + x5Combox.options.cheight + 'px; overflow-y: auto;">' +
                '</div></div>');
                            var _top = ($(this).offset().top + $(this).parent().height() + x5Combox.options.difH) + "px";
                            var _left = ($(this).offset().left + x5Combox.options.difW) + "px";
                            $("#bz_Search_obj_" + eleid).css({ "position": "absolute", "top": _top, "left": _left }).slideDown("slow");
                            $(document).mouseup(function (event) {
                                if ($(event.target).parents("#bz_Search_obj_" + eleid).length == 0 && $(event.target).parents("#X5Combox_selecttable").length == 0) {
                                    $("#bz_Search_obj_" + eleid).hide();

                                    $("#input_" + eleid).removeClass("inputtree_focus")
                                    $("#input_" + eleid).next().removeClass("inputtree_focus_add");
                                }
                            });
                            x5Combox._keyups();
                        }
                        else {
                            $("#bz_Search_obj_loading_" + eleid).show();
                            var _top = ($(this).offset().top + $(this).parent().height() + x5Combox.options.difH) + "px";
                            var _left = ($(this).offset().left + x5Combox.options.difW) + "px";
                            $("#bz_Search_obj_" + eleid).css({ "position": "absolute", "top": _top, "left": _left }).slideDown("slow");
                            $("#bz_Search_obj_context_" + eleid).empty();
                            x5Combox._keyups();
                        }
                    }
                    else {
                        $("#bz_Search_obj_" + eleid).hide();
                    }
                });
            }
            self.dataAarry = {}; //初始化
        },
        _ajaxRequest: function () {
            var self = this;
            $.ajax({
                type: "post",
                url: self.options.url,
                data: JSON.stringify(self.options.data),
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (data) {
                    switch (self.options.type) {
                        case 1:
                            var data = fomattree(gettree(data.Data, "icon-cogs"));
                            self.TreeData.setDataSource(data);
                            self.TreeData.collapse(".k-item");
                            if (self.options.checkbox) {
                                self.TreeData.dataSource.bind("change", function () {
                                    // e.data.obj._gettreenodebindchecked();
                                    self._gettreenodebindchecked();
                                });
                            }
                            break;
                        case 2:
                            var data = machineToGroup(fomattree(gettree(data.Data.GetAllMachineGroupList, "icon-cogs")), data.Data.GetAllMachineList, "icon-cog");
                            self.TreeData.setDataSource(data);
                            self.TreeData.collapse(".k-item");
                            if (self.options.checkbox) {
                                self.TreeData.dataSource.bind("change", function () {
                                    self._gettreenodebindchecked();
                                });
                            }
                            break;
                        case 3:
                            var data = fomattree(gettree(data.Data, "icon-group"));
                            self.TreeData.setDataSource(data);
                            self.TreeData.collapse(".k-item");
                            if (self.options.checkbox) {
                                self.TreeData.dataSource.bind("change", function () {
                                    self._gettreenodebindchecked();
                                });
                            }
                            break;
                        case 4:
                            var data = memberToGroup(fomattree(gettree(data.Data.MemberGroupInfo, "icon-group")), data.Data.MemberInfo, "icon-user");
                            self.TreeData.setDataSource(data);
                            self.TreeData.collapse(".k-item");
                            if (self.options.checkbox) {
                                self.TreeData.dataSource.bind("change", function () {
                                    self._gettreenodebindchecked();
                                });
                            }
                            break;
                        case 5:
                            self.TreeData.setDataSource(menuFomattree(data.Data));
                            self.TreeData.collapse(".k-item");
                            break;
                    }
                }
            });
        },
        _gettreenodebindchecked: function () {
            var self = this;
            var checkedNodes = [];
            var treeView = self.TreeData;
            self._checkedNodeIds(treeView.dataSource.view(), checkedNodes);
            for (var i = 0; i < checkedNodes.length; i++) {
                self.dataAarry[checkedNodes[i].ID] = checkedNodes[i].text;
            }
            $("#X5Combox_select" + self.element.attr("id") + " ul").empty();
            for (var m in self.dataAarry) {
                $("#X5Combox_select" + self.element.attr("id") + " ul").append('<li style="border:1px solid #DBDBDE;float: left;line-height: 1.5em;margin: 1px 0 1px 1px;padding: 0.1em 0.15em 0.1em 0.4em;"><span>' + self.dataAarry[m] + '</span><span class="k-icon k-delete bz_delete" id="' + m + '"></span></li>');
            }
            //自动滚动到底部
            //$("#" + targetele).scrollTop(document.getElementById(targetele).scrollHeight);
            $("#X5Combox_select" + self.element.attr("id")).scrollTop(document.getElementById("X5Combox_select" + self.element.attr("id")).scrollHeight);
            $(".bz_delete").click(function () {
                for (var m in self.dataAarry) {
                    if (m == $(this).attr("id")) {
                        delete self.dataAarry[m];
                        $(this).parent().remove();
                    }
                }
            });
        },
        value: function () {
            return this.dataAarry;
        },
        validate: function () {
            var eleid = this.element.attr("id");
            if (this.rData == null) {
                $("#input_" + eleid).addClass("error");
                $("#input_" + eleid).next().addClass("error");
                $('label[for="' + eleid + '"]').show();
                return false;
            }
            else {
                $("#input_" + eleid).removeClass("error");
                $("#input_" + eleid).next().removeClass("error");
                $('label[for="' + eleid + '"]').hide();
                return true;
            }
        },
        _checkedNodeIds: function (nodes, checkedNodes) {
            var self = this;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].checked) {
                    if (typeof (nodes[i].ID) != "undefined") {
                        var tempitem = {};
                        tempitem.ID = nodes[i].ID;
                        tempitem.text = nodes[i].text;
                        checkedNodes.push(tempitem);
                    }
                }
                if (nodes[i].hasChildren) {
                    self._checkedNodeIds(nodes[i].children.view(), checkedNodes);
                }
            }
        },
        _keyups: function () {
            var self = this;
            var eleid = self.element.attr("id");
            var data = {
                PageIndex: self.options.tag,
                PageSize: self.options.size,
                keyword: self.options.value
            };
            $.ajax({
                type: "POST",
                url: self.options.url2,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(data),
                dataType: "json",
                success: function (data) {
                    var result = data.Data.List;
                    if (result.length > 0) {
                        $("#bz_Search_obj_loading_" + eleid).hide();
                        if (self.options.tag == 1) {//页数
                            var html = '<ul style="list-style: none outside none; margin-left: 0px; margin-bottom: 0px;width:' + (self.options.width + 22) + 'px">';
                        }
                        else {
                            var html = '';
                        }
                        if (self.options.type == 1 || self.options.type == 3) {
                            for (var i = 0; i < result.length; i++) {
                                html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].GP_NBR + '" style="line-height:20px;padding:1px 5px;">' + result[i].GP_NAME + '</li>';
                            }
                        }
                        else if (self.options.type == 2) {
                            for (var i = 0; i < result.length; i++) {
                                html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].MAC_NBR + '" style="line-height:20px;padding:1px 5px;">' + result[i].MAC_NAME + '</li>';
                            }
                        }
                        else if (self.options.type == 4) {
                            for (var i = 0; i < result.length; i++) {
                                html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].MEM_NBR + '" style="line-height:20px;padding:1px 5px;">' + result[i].MEM_NAME + '</li>';
                            }
                        }
                        if (result.length == self.options.size && self.options.tag == 1) {
                            html = html + '<li id="dataload" style="line-height:20px;padding:1px 5px;"><span class="icon-spinner icon-spin"></span></li>';
                        }
                        if (self.options.tag == 1) {//页数
                            html = html + "</ul";
                            $("#bz_Search_obj_context_" + eleid).append(html);
                            if (self.options.remote) {
                                $("#dataload").bind("click", { obj: self }, function (e) {
                                    e.data.obj._keyups();
                                });
                            }
                            else {
                                $("#dataload").remove();
                            }
                        }
                        else {
                            $(html).insertBefore("#dataload");
                        }
                        self.options.tag++;
                        $("#bz_Search_obj_context_" + eleid + " > ul > li").hover(
                            function () {
                                $(this).css("background-color", "#7DD3F6");
                            },
                            function () {
                                $(this).css("background-color", "#FFFFFF");
                            }
                        );
                        //单击
                        $(".li_bz_Search_obj_context").unbind("click");
                        $(".li_bz_Search_obj_context").bind("click", { obj: self }, function (event) {

                            var eleid = event.data.obj.element.attr("id")
                            $("#input_" + eleid).val($(this).text());
                            event.data.obj.rData = parseInt($(this).attr("id"));

                            $("#input_" + eleid).addClass("inputtree_focus");
                            $("#input_" + eleid).next().addClass("inputtree_focus_add");
                            //验证
                            self.validate();
                        });
                        if (result.length < 10) {
                            $("#dataload").remove();
                        }
                    }
                    else {
                        if (self.options.tag == 1) {
                            $("#bz_Search_obj_" + eleid).hide();
                        }
                        else {
                            $("#dataload").remove();
                        }
                    }
                }
            });
        }
    });
})(jQuery);
function menuFomattree(data) {
    for (var i = 0; i < data.length; i++) {
        data[i].urls = data[i].url;
        delete data[i].url;
        if (data[i].items.length == 0) {
            delete data[i].items;
        }
        else {
            menuFomattree(data[i].items);
        }
    }
    return data;
}
(function ($, undefined) {
    $.widget("BZ.Tree", {
        options: {
            url: "",
            checkbox: false,
            treetemplate: null,
            data: null,
            type: 1   //分类别,1:设备组;2:设备组+设备;3:人员组;4:人员组+人员;
        },
        _init: function () {
            this.TreeData = null;
            if (this.options.checkbox) {
                this.TreeData = this.element.kendoTreeView({
                    checkboxes: {
                        checkChildren: true
                    },
                    template: this.options.treetemplate == null ? null : kendo.template(this.options.treetemplate)
                }).data("kendoTreeView");
            }
            else {
                this.TreeData = this.element.kendoTreeView({
                    template: this.options.treetemplate == null ? null : kendo.template(this.options.treetemplate)
                }).data("kendoTreeView");
            }
            this._ajaxRequest();
        },
        _create: function () {

        },
        _ajaxRequest: function () {
            var self = this;
            $.ajax({
                type: "get",
                url: self.options.url,
                data: self.options.data,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (data) {
                    switch (self.options.type) {
                        case 2:
                            var data = machineToGroup(fomattree(gettree(data.Data.GetAllMachineGroupList, "icon-cogs")), data.Data.GetAllMachineList, "icon-cog")
                            self.TreeData.setDataSource(data);
                            self.TreeData.collapse(".k-item");
                            //App.initUniform('#machineTree input[type="checkbox"]');
                            if (self.options.checkbox) {
                                self.TreeData.dataSource.bind("change", function () {
                                    self.dataAarry = {};
                                    self._gettreenodebindchecked();
                                    //App.initUniform('#machineTree input[type="checkbox"]');
                                });
                            }
                            break;
                        case 3:
                            var data = fomattree(gettree(data.Data, "icon-group"));
                            self.TreeData.setDataSource(data);
                            if (self.options.checkbox) {
                                self.TreeData.dataSource.bind("change", function () {
                                    // e.data.obj._gettreenodebindchecked();
                                    self._gettreenodebindchecked();
                                });
                            }
                            break;
                    }
                }
            });
        },
        value: function () {
            return this.dataAarry;
        },
        _gettreenodebindchecked: function () {
            var self = this;
            var checkedNodes = [];
            var treeView = self.TreeData;
            self._checkedNodeIds(treeView.dataSource.view(), checkedNodes);
            for (var i = 0; i < checkedNodes.length; i++) {
                self.dataAarry[checkedNodes[i].ID] = checkedNodes[i].text;
            }
        },
        _checkedNodeIds: function (nodes, checkedNodes) {
            var self = this;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].checked) {
                    if (nodes[i].flag == 1) {
                        var tempitem = {};
                        tempitem.ID = nodes[i].id;
                        tempitem.text = nodes[i].text;
                        checkedNodes.push(tempitem);
                    }
                }
                if (nodes[i].hasChildren) {
                    self._checkedNodeIds(nodes[i].children.view(), checkedNodes);
                }
            }
        }
    });
})(jQuery);
//MultipleCombox插件(树形列表+自动搜索)
(function ($, undefined) {
    $.widget("BZ.multipleComboxTree", {
        options: {
            value: "",//关键字
            difH: 0, //高度补差
            difW: 0, //宽度补差
            width: 174,
            height: 80,//筛选结果区域高度
            cheight: 260,
            size: 10,//单页请求条数
            tag: 1,//页码
            url: "",
            url2: "",
            checkbox: false,
            inputheight: 34,
            diffwidth: 24,
            diffinputwidth: 0,
            remote: true,//ajax远程获取数据
            data: null,
            tree: true,
            checkChildren: true,
            multiple: true,//是否多选
            validate: true,
            validateMessage: "",
            plans: true,//计划帅选标志，true=计划根据产品过滤；false=不根据产品过滤
            type: 1, //分类别,1:设备组;2:设备组+设备;3:人员组;4:人员组+人员;5:产品;6:计划;7:参数列表;8:班次;9:保养报表单号;10:维修申请单号;11:零件名称;12:产品(太荣);13:程序号
            select: null
        },
        _init: function () {
        },
        _create: function () {
            var self = this;
            //self.dataAarry = null;
            var eleid = self.element.attr("id");
            var strhtml = '<div class="input-append">' +
                            '<input id="input_' + eleid + '" placeholder="0" readonly type="text" class="span6 m-wrap" style="height: ' + self.options.inputheight + 'px ! important;width: ' + this.options.width + 'px; border: 1px solid rgb(229, 229, 229);">' +
			                '<span id="down_' + eleid + '" class="add-on" style="padding-left: 4px; padding-right: 4px; "><i class="icon-sort-down"></i></span>' +
                        '</div><label for="' + eleid + '" class="error" style="display: none;">' + this.options.validateMessage + '</label>';
            var contextstrhtml = '<div id="Combox_orgnizetree_' + eleid + '" class="Combox_orgnizetree" style="background-color:#FFFFFF; width: ' + (self.options.width + self.options.diffwidth) + 'px;height:' + self.options.cheight + 'px;display:none;">' +
                '<div><input type="text" style="width:' + (self.options.width + self.options.diffinputwidth - 10) + 'px; padding-right: 24px !important; padding-top: 6px; padding-bottom: 6px; margin: 1px;" class="input-medium m-wrap" id="multipleKeyText_' + eleid + '"><span class="editable-clear-x delete_' + eleid + '" style="top: 10px; margin-top: 0px;"></span></div>' +
                '<div id="Combox_orgnizetree_context_' + eleid + '" style="width: ' + (self.options.width + self.options.diffwidth) + 'px; height: ' + (self.options.cheight - 36) + 'px;overflow-y: auto;"></div>' +
                '<div style="display:none;"><div id="Combox_context_' + eleid + '" style="width: ' + (self.options.width + self.options.diffwidth) + 'px; height: ' + (self.options.cheight - 66) + 'px; overflow-y: auto;"></div>' +
                '<div style="height: 30px; line-height:30px; position: absolute; bottom: 0px; width: 100%; border-top: 1px solid rgb(153, 153, 153); text-align: right;">' +
                    '<span style="margin-right: 10px;"><input type="checkbox" id="allcheck_' + eleid + '">' +'全部'+ '</span></div></div>' +
            '</div>';
            var contextstrhtml = contextstrhtml + '<div id="Combox_detail" style="z-index:999999;border:1px solid #999999;background-color:#FFFFFF; width: ' + (self.options.width + self.options.diffwidth) + 'px;display:none;">' +
                '<div id="Combox_detailcontext" style="width: ' + (self.options.width + self.options.diffwidth) + 'px; max-height: 100px; overflow-y: auto;"><ul style="margin-left: 0px; margin-bottom: 0px;"></ul></div>' +
            '</div>';
            this.element.hide();
            $(strhtml).insertAfter(this.element);
            $("body").append(contextstrhtml);

            //清除搜索框内容
            $(".delete_" + eleid).bind("click", function () {
                $(this).prev().val("");
            });
            if (!this.options.multiple) {
                $("#allcheck_" + eleid).attr("disabled", "disabled");
            }
            else {
                $("#allcheck_" + eleid).bind("click", function () {
                    self.dataAarry = [];
                    if ($(this).prop("checked")) {//全选
                        var eleobj = $("#Combox_context_" + eleid + " ul li");
                        for (var i = 0; i < eleobj.length; i++) {
                            if ($(eleobj[i]).attr("id") != "dataload") {
                                self.dataAarry[isNaN(parseInt($(eleobj[i]).attr("id"))) ? $(eleobj[i]).attr("id") : parseInt($(eleobj[i]).attr("id"))] = $(eleobj[i]).attr("name");
                                self._updateSelect();
                                $(eleobj[i]).addClass("k-state-selected").addClass("k-state-focused");
                            }
                        }
                    }
                    else {
                        var eleobj = $("#Combox_context_" + eleid + " ul li");
                        for (var i = 0; i < eleobj.length; i++) {
                            if ($(eleobj[i]).attr("id") != "dataload") {
                                $(eleobj[i]).removeClass("k-state-selected").removeClass("k-state-focused");
                                delete self.dataAarry[isNaN(parseInt($(eleobj[i]).attr("id"))) ? $(eleobj[i]).attr("id") : parseInt($(eleobj[i]).attr("id"))];
                                self._updateSelect();
                            }
                        }
                    }
                });
            }
            $("#input_" + eleid).focus(function () {
                $(this).addClass("inputtree_focus");
                $(this).next().addClass("inputtree_focus_add");
            }).blur(function () {
                if ($('#Combox_orgnizetree_' + eleid).is(":hidden")) {
                    $(this).removeClass("inputtree_focus")
                    $(this).next().removeClass("inputtree_focus_add");
                }
            });

            //初始化组织树
            if (this.options.tree) {
                if (this.options.checkbox) {
                    self.TreeData = $('#Combox_orgnizetree_context_' + eleid).kendoTreeView({
                        checkboxes: {
                            checkChildren: self.options.checkChildren
                        },
                        template: kendo.template('<i class="#:item.icon#"></i>' +
        '<span type="1" nodeid="#:item.id#" pid="#:item.PID#" level_nbr="#:item.LEVEL_NBR#" flag="#:item.flag#" pname="#:item.pname#" attr="treenode">#:item.text#</span>')
                    }).data("kendoTreeView");
                }
                else {
                    self.TreeData = $('#Combox_orgnizetree_context_' + eleid).kendoTreeView({
                        obj: self,
                        template: kendo.template('<i class="#:item.icon#"></i>' +
        '<span type="1" nodeid="#:item.id#" pid="#:item.PID#" level_nbr="#:item.LEVEL_NBR#" flag="#:item.flag#" pname="#:item.pname#" attr="treenode">#:item.text#</span>'),
                        select: function (e) {
                            //var comboxtree = self.options.obj;
                            switch (self.options.type) {
                                case 1: case 3://组
                                    var eleid = self.element.attr("id");
                                    $("#input_" + eleid).val(this.text(e.node));
                                    self.rData = parseInt($(e.node).find('[attr="treenode"]').attr("nodeid"));
                                    break;
                                case 2: case 4://组+人员或设备
                                    if ($(e.node).find('[attr="treenode"]').attr("flag") == 1) {
                                        var eleid = self.element.attr("id");
                                        //$("#input_" + eleid).val(this.text(e.node));
                                        $("#input_" + eleid).val($(e.node).children().children().find("span").text());
                                        self.rData = parseInt($(e.node).find('[attr="treenode"]').attr("nodeid"));
                                        //验证
                                        //self.validate();
                                    }
                                    break;
                                case 5:
                                    //触发select
                                    if ($(e.node).find('[attr="treenode"]').attr("flag") == 1) {
                                        var eleid = self.element.attr("id");
                                        $("#input_" + eleid).val($(e.node).children().children().find("span").text());
                                        var prod_nbr = $(e.node).find('[attr="treenode"]').attr("nodeid")
                                        var prod_name = $(e.node).find('[attr="treenode"]').attr("pname")
                                        var datas = {
                                            prod_name:prod_name,
                                            prod_nbr: prod_nbr,
                                            prod_no: $(e.node).children().children().find("span").text()
                                        }
                                        self.rData = parseInt($(e.node).find('[attr="treenode"]').attr("nodeid"));
                                        self.options.select.call(self, datas);
                                    }
                                    break;
                            }
                        }
                    }).data("kendoTreeView");
                }
            }
            if (this.options.multiple) {
                $("#input_" + eleid).bind("click", { obj: self }, function (event) {
                    if (typeof (self.options.select) == "function") {
                        return;
                    }
                    $("#Combox_detailcontext ul").empty();
                    var shtml = "";
                    for (var m in event.data.obj.dataAarry) {
                        shtml = shtml + '<li style="border:1px solid #DBDBDE;list-style-type:none;float: left;line-height: 1.5em;margin: 1px 0 1px 1px;padding: 0.1em 0.15em 0.1em 0.4em;"><span>' + event.data.obj.dataAarry[m] + '</span><span class="k-icon k-delete bz_delete" id="' + m + '"></span></li>';
                    }
                    if (!jQuery.isEmptyObject(event.data.obj.dataAarry)) {
                        $("#Combox_detailcontext ul").append(shtml);
                        //计算位置
                        var x5Combox = event.data.obj;
                        var _top = $(this).offset().top;
                        var _left = ($(this).offset().left + x5Combox.options.difW) + "px";
                        $("#Combox_detail").show();
                        var Combox_detail_height = $("#Combox_detailcontext").height();
                        $("#Combox_detail").css({ "position": "absolute", "top": (_top - Combox_detail_height - 1) + "px", "left": _left }).slideDown("slow");
                        //$("#Combox_detail").unbind("mouseout").bind("mouseout", { obj: self }, function (event) {
                        //    $("#Combox_detail").hide();
                        //});
                        $(document).mouseup(function (event) {
                            if ($(event.target).parents("#Combox_detail").length == 0) {
                                $("#Combox_detail").hide();
                                $("#input_" + eleid).removeClass("inputtree_focus")
                                $("#input_" + eleid).next().removeClass("inputtree_focus_add");
                            }
                        });
                        $(".bz_delete").bind("click", { obj: event.data.obj, ele: this }, function (event) {
                            $(this).parent().remove();
                            delete event.data.obj.dataAarry[isNaN(parseInt($(this).attr("id"))) ? $(this).attr("id") : parseInt($(this).attr("id"))];
                            event.data.obj._updateSelect();
                            //计算位置
                            var x5Combox = event.data.obj;
                            var _top = $(event.data.ele).offset().top;
                            var Combox_detail_height = $("#Combox_detailcontext").height();
                            $("#Combox_detail").css({ "top": (_top - Combox_detail_height - 1) + "px" });
                            if (jQuery.isEmptyObject(event.data.obj.dataAarry)) {
                                $("#Combox_detail").hide();
                            }
                        });
                    }
                });
            }
            $("#down_" + eleid).bind("click", { obj: self }, function (e, obj) {
                $(".li_bz_Search_obj_context").removeClass("k-state-selected").removeClass("k-state-focused");
                //加载组织结构，基于kendo tree
                var x5Combox = e.data.obj;
                var _top = ($(this).prev().offset().top + $(this).prev().parent().height() + x5Combox.options.difH) + "px";
                var _left = ($(this).prev().offset().left + x5Combox.options.difW) + "px";
                $('#Combox_orgnizetree_' + eleid).css({ "position": "absolute", "top": _top, "left": _left }).slideDown("slow");
                $(this).addClass("inputtree_focus_add");
                $(this).prev().addClass("inputtree_focus");
                $(document).off("mouseup").on("mouseup", function (event) {
                    if ($(event.target).parents("#Combox_orgnizetree_" + eleid).length == 0) {
                        $("#Combox_orgnizetree_" + eleid).hide();
                        $("#input_" + eleid).removeClass("inputtree_focus")
                        $("#input_" + eleid).next().removeClass("inputtree_focus_add");
                    }
                });

                //加载数据，根据是部门，组，还是人员来获取相应的数据
                $("#Combox_orgnizetree_context_" + eleid + " ul").empty();
                if (self.options.type != 6 && self.options.type != 7 && self.options.type != 8 && self.options.type != 9 && self.options.type != 10 && self.options.type != 11 && self.options.type != 12 && self.options.type != 13) {
                    e.data.obj._ajaxRequest();
                }
                else {
                    //产品与计划使用的时候。返回的数据加载到Combox_context内
                    //初始化页数
                    self.options.tag = 1;
                    $("#Combox_orgnizetree_context_" + eleid).hide();
                    $("#Combox_context_" + eleid).empty().parent().show();
                    self._keyups();
                }

            });
            $("#multipleKeyText_" + eleid).bind("keyup", { obj: self }, function (e) {
                self.dataAarry = {};
                $("#Combox_orgnizetree_context_" + eleid).hide();
                var x5Combox = e.data.obj;
                x5Combox.options.tag = 1;
                x5Combox.options.value = $(this).val();
                if ($(this).val() != "") {
                $("#Combox_orgnizetree_context_" + eleid).hide();
                $("#Combox_context_" + eleid).empty().parent().show();
                    x5Combox._keyups();
                }
                else {
                    $("#Combox_orgnizetree_context_" + eleid).show();
                    $("#Combox_context_" + eleid).parent().hide();
                }
            });
            self.dataAarry = {}; //初始化
        },
        _ajaxRequest: function () {
            var self = this;
            $.ajax({
                type: "get",
                url: self.options.url,
                data: self.options.data,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (data) {
                    switch (self.options.type) {
                        case 1:
                            var data = fomattree(gettree(data.Data, "icon-cogs"));
                            self.TreeData.setDataSource(data);
                            self.TreeData.collapse(".k-item");
                            if (self.options.checkbox) {
                                self.TreeData.dataSource.bind("change", function () {
                                    self._gettreenodebindchecked();
                                });
                            }
                            break;
                        case 2:
                            var data = machineToGroup(fomattree(gettree(data.Data.GetAllMachineGroupList, "icon-cogs")), data.Data.GetAllMachineList, "icon-cog");
                            self.TreeData.setDataSource(data);
                            self.TreeData.collapse(".k-item");
                            if (self.options.checkbox) {
                                self.TreeData.dataSource.bind("change", function () {
                                    self._gettreenodebindchecked();
                                    if (self.options.validate) {
                                        self.validate();
                                    }
                                });
                            }
                            break;
                        case 3:
                            var data = fomattree(gettree(data.Data, "icon-group"));
                            self.TreeData.setDataSource(data);
                            if (self.options.checkbox) {
                                self.TreeData.dataSource.bind("change", function () {
                                    self._gettreenodebindchecked();
                                });
                            }
                            break;
                        case 4:
                            var data = memberToGroup(fomattree(gettree(data.Data.MemberGroupInfo, "icon-group")), data.Data.MemberInfo, "icon-user");
                            self.TreeData.setDataSource(data);
                            self.TreeData.collapse(".k-item");
                            if (self.options.checkbox) {
                                self.TreeData.dataSource.bind("change", function () {
                                    self._gettreenodebindchecked();
                                    if (self.options.validate) {
                                        self.validate();
                                    }
                                });
                            }
                            break;
                        case 5://产品
                            var data = productToGroup(fomattree(gettree(data.Data.ProGroupList, "icon-group")), data.Data.ProdList, "icon-user");
                            self.TreeData.setDataSource(data);
                            self.TreeData.collapse(".k-item");
                            if (self.options.checkbox) {
                                self.TreeData.dataSource.bind("change", function () {
                                    self._gettreenodebindchecked();
                                    if (self.options.validate) {
                                        self.validate();
                                    }
                                });
                            }
                            break;
                    }
                }
            });
        },
        _gettreenodebindchecked: function () {
            var self = this;
            var checkedNodes = [];
            var treeView = self.TreeData;
            self._checkedNodeIds(treeView.dataSource.view(), checkedNodes);
            self.dataAarry = {};
            for (var i = 0; i < checkedNodes.length; i++) {
                self.dataAarry[checkedNodes[i].ID] = checkedNodes[i].text;
            }
            self._updateSelect();
        },
        _checkedNodeIds: function (nodes, checkedNodes) {
            var self = this;
            var flag;
            if (self.options.type == 1 || self.options.type == 3) {//设备组
                flag = 0;
            }
            else if (self.options.type == 2 || self.options.type == 4) {//设备
                flag = 1;
            }
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].checked) {

                    if (nodes[i].flag == flag) {
                        var tempitem = {};
                        tempitem.ID = nodes[i].id;
                        tempitem.text = nodes[i].text;
                        checkedNodes.push(tempitem);
                    }
                }
                if (nodes[i].hasChildren) {
                    self._checkedNodeIds(nodes[i].children.view(), checkedNodes);
                }
            }
        },
        _updateSelect: function () {
            var self = this;
            if (typeof (self.options.select) == "function") {
                var eleid = self.element.attr("id");
                //$("#Combox_orgnizetree_" + eleid).hide();
                self.options.select.call(self, self.dataAarry);
            }
            else {
                if (this.options.multiple) {
                    var k = 0;
                    for (var m in self.dataAarry) {
                        k++;
                    }
                    var id = self.element.attr("id");
                    $("#input_" + id).attr("placeholder", k);
                }
                else {
                    var id = self.element.attr("id");
                    for (var m in self.dataAarry) {
                        $("#input_" + id).attr("placeholder", self.dataAarry[m]);
                    }
                }
            }
        },
        validate: function () {
            var eleid = this.element.attr("id");
            if ($.isEmptyObject(this.dataAarry)) {
                $("#input_" + eleid).addClass("error");
                $("#input_" + eleid).next().addClass("error");
                $('label[for="' + eleid + '"]').show();
                return false;
            }
            else {
                $("#input_" + eleid).removeClass("error");
                $("#input_" + eleid).next().removeClass("error");
                $('label[for="' + eleid + '"]').hide();
                return true;
            }
        },
        clear: function () {
            this.dataAarry = {}; //清空
            var eleid = this.element.attr("id");
            $("#input_" + eleid).attr("placeholder", 0);
        },
        _keyupsdata: function (data) {
            var self = this;
            var eleid = self.element.attr("id");
            var result = data;
            if (result.length > 0) {
                // $("#bz_Search_obj_loading").hide();
                if (self.options.tag == 1) {//页数
                    var html = '<ul style="list-style: none outside none; margin-left: 0px; margin-bottom: 0px;">';
                }
                else {
                    var html = '';
                }
                if (self.options.type == 1 || self.options.type == 3) {//设备组或人员组
                    for (var i = 0; i < result.length; i++) {
                        html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].GP_NBR + '" name="' + result[i].GP_NAME + '" style="line-height:20px;padding:1px 5px;">' + result[i].GP_NAME + '</li>';
                    }
                }
                else if (self.options.type == 2) {//设备
                    for (var i = 0; i < result.length; i++) {
                        html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].MAC_NBR + '" name="' + result[i].MAC_NAME + '" style="line-height:20px;padding:1px 5px;"><i class="icon-cog"></i>' + result[i].MAC_NAME + "(" + result[i].MAC_NO + ")" + '</li>';
                    }
                }
                else if (self.options.type == 4) {//人员
                    for (var i = 0; i < result.length; i++) {
                        html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].MEM_NBR + '" name="' + result[i].MEM_NAME + '" style="line-height:20px;padding:1px 5px;"><i class="icon-user"></i>' + result[i].MEM_NAME + '</li>';
                    }
                }
                else if (self.options.type == 5) {//产品
                    for (var i = 0; i < result.length; i++) {
                        html = html + '<li class="li_bz_Search_obj_context" id="' + result[i] + '" name="' + result[i] + '" style="line-height:20px;padding:1px 5px;">' + result[i] + '</li>';
                    }
                }
                else if (self.options.type == 6) {//计划
                    for (var i = 0; i < result.length; i++) {
                        html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].MANUFACTURE_NO + '" name="' + result[i].MANUFACTURE_NO + '" style="line-height:20px;padding:1px 5px;">' + result[i].MANUFACTURE_NO + '</li>';
                    }
                }
                else if (self.options.type == 7) {//参数
                    for (var i = 0; i < result.length; i++) {
                        html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].VALUE + '" name="' + result[i].NAME + '" style="line-height:20px;padding:1px 5px;">' + result[i].NAME + '</li>';
                    }
                }
                else if (self.options.type == 8) {//班次
                    for (var i = 0; i < result.length; i++) {
                        html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].SHIFT_NBR + '" name="' + result[i].SOLUTION_NAME + '(' + result[i].SHIFT_NAME + ')' + '" style="line-height:20px;padding:1px 5px;">' + result[i].SOLUTION_NAME + '(' + result[i].SHIFT_NAME + ')' + '</li>';
                    }
                }
                else if (self.options.type == 9) {//保养报表单号
                    for (var i = 0; i < result.length; i++) {
                        html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].MAINTAIN_NBR + '" name="' + result[i].MAINTAIN_NO + '" style="line-height:20px;padding:1px 5px;">' + result[i].MAINTAIN_NO + '</li>';
                    }
                }
                else if (self.options.type == 10) {//维修申请单号
                    for (var i = 0; i < result.length; i++) {
                        html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].APPLAY_NBR + '" name="' + result[i].APPLAY_NO + '" style="line-height:20px;padding:1px 5px;">' + result[i].APPLAY_NO + '</li>';
                    }
                }
                else if (self.options.type == 11) {//配件名称
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].PART_NO == undefined) {
                            html = html + '<li class="li_bz_Search_obj_context" id="' + result[i] + '" name="' + result[i] + '" style="line-height:20px;padding:1px 5px;">' + result[i] + "(" + result[i] + ")" + '</li>';
                        }
                        else {
                            html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].PART_NO + '" name="' + result[i].PART_NAME + '" style="line-height:20px;padding:1px 5px;">' + result[i].PART_NAME + "(" + result[i].PART_NO + ")" + '</li>';
                        }
                    }
                }
                else if (self.options.type == 12) {//产品(太荣)
                    for (var i = 0; i < result.length; i++) {
                        html = html + '<li class="li_bz_Search_obj_context" id="' + result[i].PROD_NBR + '" name="' + result[i].PROD_NAME + '" style="line-height:20px;padding:1px 5px;">' + result[i].PROD_NAME + "(" + result[i].PROD_NO + ")" + '</li>';
                    }
                }
                else if (self.options.type == 13) {//程序号
                    for (var i = 0; i < result.length; i++) {
                        
                        html = html + '<li class="li_bz_Search_obj_context" id="' + result[i] + '" name="' + result[i] + '" style="line-height:20px;padding:1px 5px;">' + result[i] + '</li>';
                    }
                }

                //else if (self.options.type == 14) {//程序号
                //    for (var i = 0; i < result.length; i++) {
                //        html = html + '<li class="li_bz_Search_obj_context" id="' + result[i] + '" name="' + result[i] + '" style="line-height:20px;padding:1px 5px;">' + result[i] + '</li>';
                //    }
                //}
                if (result.length == self.options.size && self.options.tag == 1) {
                    html = html + '<li id="dataload" style="line-height:20px;padding:1px 5px;"><span class="icon-spinner icon-spin"></span></li>';
                }
                if (self.options.tag == 1) {//页数
                    html = html + "</ul";
                    $("#Combox_context_" + eleid).append(html);
                    //if (self.options.remote) {
                    //    $("#dataload").bind("click", { obj: self }, function (e) {
                    //        e.data.obj._keyups();
                    //    });
                    //}
                    //else {
                    //    $("#dataload").remove();
                    //}
                }
                else {
                    $(html).insertBefore("#dataload");
                }
                self.options.tag++;
                $("#Combox_context_" + eleid + " > ul > li").hover(
                    function () {
                        $(this).addClass("k-state-hover");
                    },
                    function () {
                        $(this).removeClass("k-state-hover");
                    }
                );
                //单击
                $(".li_bz_Search_obj_context").unbind("click");
                $(".li_bz_Search_obj_context").bind("click", { obj: self }, function (event) {
                    if (event.data.obj.options.multiple) {
                        if ($(this).hasClass("k-state-selected")) {//被选中
                            $(this).removeClass("k-state-selected").removeClass("k-state-focused");
                            var eleid = event.data.obj.element.attr("id")
                            delete event.data.obj.dataAarry[isNaN(parseInt($(this).attr("id"))) ? $(this).attr("id") : parseInt($(this).attr("id"))];
                            self._updateSelect();
                        }
                        else {
                            var eleid = event.data.obj.element.attr("id")
                            event.data.obj.dataAarry[isNaN(parseInt($(this).attr("id"))) ? $(this).attr("id") : parseInt($(this).attr("id"))] = $(this).attr("name");
                            self._updateSelect();
                            $(this).addClass("k-state-selected").addClass("k-state-focused");
                        }
                    }
                    else {
                        $(".k-state-selected").removeClass("k-state-selected");
                        event.data.obj.dataAarry = {};
                        event.data.obj.dataAarry[isNaN(parseInt($(this).attr("id"))) ? $(this).attr("id") : parseInt($(this).attr("id"))] = $(this).attr("name");
                        self._updateSelect();
                        $(this).addClass("k-state-selected").addClass("k-state-focused");
                    }
                });
                if (result.length < 10) {//已经到最后一条了
                    $("#dataload").remove();
                    $("#Combox_context_" + eleid).unbind("scroll");
                }
                else {
                    //注册Combox_context_滚动事件
                    $("#Combox_context_" + eleid).bind("scroll", function (e) {
                        var distanceScrollCount = $(this)[0].scrollHeight;
                        var distanceScroll = $(this)[0].scrollTop;
                        var offsetHeight = $(this)[0].offsetHeight;
                        if (distanceScroll > 0) {
                            if (distanceScroll + offsetHeight >= distanceScrollCount) {
                                $("#Combox_context_" + eleid).unbind("scroll");
                                if (self.options.type != 7) {//参数不需要滚动触发事件
                                    self._keyups();
                                }
                            }
                        }
                    });
                }
            }
            else {
                if (self.options.tag == 1) {
                    $("#bz_Search_obj").hide();
                }
                else {
                    $("#dataload").remove();
                }
                $("#Combox_context_" + eleid).empty()
            }
        },
        _keyups: function () {
            var self = this;
            var data = {
                PageIndex: self.options.tag,
                PageSize: self.options.size,
                keyword: self.options.value
            }
            if (self.options.type == 6) {
                var array = [];
                if (self.options.plans) {//筛选
                    for (var m in self.options.data.dataAarry) {
                        array.push(self.options.data.dataAarry[m]);
                    }
                }
                data.productName = array;
            }
            var eleid = self.element.attr("id");
            if (self.options.remote) {
                $.ajax({
                    type: "POST",
                    url: self.options.url2,
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function (data) {
                        if (self.options.type == 8 || self.options.type == 11) { //班次或者配件
                            self._keyupsdata(data.Data);
                        }
                        else {
                            self._keyupsdata(data.Data.List);
                        }
                    }
                });
            }
            else {
                if (self.options.data.rData != undefined) {//判断有没有选择设备
                    $.ajax({
                        type: "POST",
                        url: self.options.url2,
                        contentType: "application/json;charset=utf-8",
                        data: JSON.stringify({ MachineId: self.options.data.rData }),
                        dataType: "json",
                        success: function (data) {
                            var ndata = [];
                            $.each(parameter[data.Data[0].CATEGORY == null ? "DEFAULT" : data.Data[0].CATEGORY], function (item, k) {
                                if (k.EN_ABLE && k.HIS) {
                                    var tjson = {
                                        VALUE: item,
                                        NAME: $.Translate(item)
                                    };
                                    ndata.push(tjson);
                                }
                            });
                            self._keyupsdata(ndata);
                        }
                    });
                }
            }
        },
        _destroy: function () {
            var eleid = this.element.attr("id");
            $("#Combox_orgnizetree_" + eleid).remove();
            $("#Combox_detail").remove();
            // call the base destroy function
            $.Widget.prototype.destroy.call(this);
        }
    })
})(jQuery);
//获取任务列表
function getProductionPlan(chtml) {
    $.get("/YieldAnalysis/ProductionTask/getProductionPlan", function (data) {
        if (data.Status == 0) {
            var tdata = [];
            for (var i = 0; i < data.Data.length; i++) {
                var tjson = {};
                tjson.id = data.Data[i].MANUFACTURE_NBR;
                tjson.text = data.Data[i].MANUFACTURE_NO;
                tjson.icon = "icon-list-alt";
                tjson.product_name = data.Data[i].PRODUCT_NAME;
                tjson.pridict_num = data.Data[i].PRIDICT_NUM;
                tjson.process_name = data.Data[i].PROCESS_NAME;
                tjson.memo = data.Data[i].MEMO;
                tdata.push(tjson);
            }
            $("#orgnizetree").kendoTreeView({
                dataSource: new kendo.data.HierarchicalDataSource({
                    data: tdata,
                    schema: {
                        model: {
                            id: "id"
                        }
                    }
                }),
                template: kendo.template(chtml),
                select: function (e) {
                    grid.grid("refresh", function () {
                        return [
                            { field: "productionplanNo", Operator: "eq", value: $(e.node).find('[attr="treenode"]').text() }
                            //{ field: "keyword", Operator: "eq", value: parseInt($(e.node).find('[attr="treenode"]').attr("nodeid")) },
                            //{ field: "userType", Operator: "eq", value: parseInt($('.nav-tabs li[class="active"]').attr("value")) }
                        ];
                    });
                }
            }).data("kendoTreeView").collapse(".k-item");
            if (data.Data.length > 0) {
                var treeview = $("#orgnizetree").data("kendoTreeView")
                treeview.select($(".k-item:first"));
                refreshGrid();
            }
        }
        else {
            BzAlert(data.Message);
        }
    });
}
//报表生成+自定义合并单元格
(function ($, undefined) {
    $.widget("BZ.tableGrid", {
        options: {
            columns: [
                { name: 'kpi_type', title: "", hidGrid: true },//idMerge:"是否合并";hidGrid:'true'是否隐藏
                { name: 'kpi_type_name', title: "", idMerge: true },
                { name: 'kpi_seq', title: "" },
                { name: 'kpi_name', title: "" },
                { name: 'kpi_unit', title: "" },
                { name: 'kpi_value', title: "" },
                { name: 'kpi_desc', title: "", idMerge: true }
            ],
            dataSource: []
        },
        _init: function () {

        },
        _create: function () {
            var eleid = this.element.attr("id");
            var shtml = '<table class="table table-striped1 table-bordered table-advance table-hover1"><thead>';
            //标题
            for (var i = 0; i < this.options.columns.length; i++) {
                if (!this.options.columns[i].hidGrid) {
                    if (this.options.columns[i].width != undefined) {
                        shtml = shtml + '<th width="' + this.options.columns[i].width + '">' + this.options.columns[i].title + "</th>";
                    }
                    else {
                        shtml = shtml + "<th>" + this.options.columns[i].title + "</th>";
                    }
                }
            }
            shtml = shtml + '</thead><tbody id="table_' + eleid + '"></tbody><table>';
            this.element.append(shtml);
            this._merageTable();

        },
        _merageTable: function () {
            var self = this;
            //        var list = [
            //{ kpi_type: '1', kpi_type_name: '积分客户数', kpi_seq: '1', kpi_name: '积分客户总数', kpi_unit: '户', kpi_value: '3824934', kpi_desc: '截止到统计期末有回馈积分且积分余额大于0的客户总数量' },
            //{ kpi_type: '1', kpi_type_name: '积分客户数', kpi_seq: '2', kpi_name: '可兑换积分客户数', kpi_unit: '户', kpi_value: '3824934', kpi_desc: '截止到统计期末可以进行积分兑换的客户数' },
            //{ kpi_type: '1', kpi_type_name: '积分客户数', kpi_seq: '3', kpi_name: '(0-999)分可兑换积分客户数', kpi_unit: '户', kpi_value: '3824934', kpi_desc: '截止到统计期末有回馈积分且积分余额大于0的客户总数量' },
            //{ kpi_type: '1', kpi_type_name: '积分客户数', kpi_seq: '4', kpi_name: '(1000-4999)分可兑换积分客户数', kpi_unit: '户', kpi_value: '3824934', kpi_desc: '截止到统计期末有回馈积分且积分余额大于0的客户总数量' },
            //{ kpi_type: '1', kpi_type_name: '积分客户数', kpi_seq: '5', kpi_name: '(5000-9999)分可兑换积分客户数', kpi_unit: '户', kpi_value: '3824934', kpi_desc: '截止到统计期末有回馈积分且积分余额大于0的客户总数量' },
            //{ kpi_type: '1', kpi_type_name: '积分客户数', kpi_seq: '6', kpi_name: '(10000分以上)可兑换积分客户数', kpi_unit: '户', kpi_value: '3824934', kpi_desc: '截止到统计期末有回馈积分且积分余额大于0的客户总数量' },
            //{ kpi_type: '2', kpi_type_name: '积分基础分值', kpi_seq: '7', kpi_name: '不可兑换积分客户数', kpi_unit: '户', kpi_value: '3824934', kpi_desc: '截止到统计期末不可以进行积分兑换行为的客户数' },
            //{ kpi_type: '2', kpi_type_name: '积分基础分值', kpi_seq: '8', kpi_name: '0分以下不可兑换积分客户数', kpi_unit: '户', kpi_value: '3824934', kpi_desc: '截止到统计期末不可以进行积分兑换行为的客户数' },
            //{ kpi_type: '3', kpi_type_name: '积分兑换情况', kpi_seq: '9', kpi_name: '活跃积分客户数', kpi_unit: '户', kpi_value: '3824934', kpi_desc: '在统计期内进行积分兑换的客户数' }
            //        ];
            var list = this.options.dataSource;
            var eleid = this.element.attr("id");
            _table = document.getElementById("table_" + eleid);
            // _table.border = "1px";
            var _columns = this.options.columns;
            var currMergeTds = [];
            for (var i = 0; i < list.length; i++) {
                var row = document.createElement("tr");
                for (var colIdx = 0; colIdx < _columns.length; colIdx++) {
                    var col = _columns[colIdx];
                    if (col['hidGrid']) {
                        continue;
                    }
                    if (col['idMerge']) {
                        if (i > 0 && list[i][col['name']] === currMergeTds[colIdx]['value']) {
                            currMergeTds[colIdx]['cell'].setAttribute('rowspan', ++currMergeTds[colIdx]['cell_count']);
                        } else {
                            var cell = document.createElement("TD");
                            cell.setAttribute('rowspan', 1);
                            if (col["click"] != undefined) {
                                //cell.style = "background-color:" + col['bgcolor'];
                                cell.className = "tableselect";
                                cell.setAttribute('col', colIdx);
                                cell.onclick = function (e) {
                                    //获取控件的Id
                                    var eid = $(e.currentTarget).parent().parent().attr("id").split("_")[1];
                                    var obj = $("#" + eid).data("BZ-tableGrid");
                                    $(".tableselect").removeClass("k-state-selected");
                                    $(e.currentTarget).addClass("k-state-selected");
                                    obj.options.columns[parseInt($(e.currentTarget).attr("col"))].click.call(obj, this.textContent, this);
                                }
                            }
                            cell.innerHTML = list[i][col['name']];
                            if (typeof (col['par']) != undefined) {
                                cell.setAttribute('gpname', list[i][col['par']])
                            }
                            var mergeTd = {};
                            mergeTd['value'] = list[i][col['name']];
                            mergeTd['cell'] = cell;
                            mergeTd['cell_count'] = 1;
                            currMergeTds[colIdx] = mergeTd;
                            row.appendChild(cell);
                        }
                    } else {
                        var cell = document.createElement("TD");
                        if (typeof (col['par']) != undefined) {
                            cell.setAttribute('gpname', list[i][col['par']])
                        }
                        cell.innerHTML = list[i][col['name']];
                        row.appendChild(cell);
                    }
                }

                _table.appendChild(row);
                //document.body.appendChild(_table);
            }
        },
        destroy: function () {
            this.element.empty();
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);
//获取工单多、单选
(function ($, underfined) {
    $.widget("BZ.comboxList", {
        options: {
            value: "",//关键字
            difH: 0, //高度补差
            difW: 0, //宽度补差
            width: 174,
            height: 80,//筛选结果区域高度
            cheight: 260,
            size: 10,//单页请求条数
            tag: 1,//页码
            url: "",
            checkbox: false,
            inputheight: 34,
            diffwidth: 24,
            diffinputwidth: 0,
            remote: true,//ajax远程获取数据
            data: null,
            tree: true,
            checkChildren: true,
            multiple: true,//是否多选
            validate: true,
            validateMessage: "",
            plans: true,//计划帅选标志，true=计划根据产品过滤；false=不根据产品过滤
            type: 1,
            select: null
        },
        _create: function () {
            var self = this,
                eleid = self.element.attr("id");
            strhtml = '<div class="input-append">' +
                          '<input id="input_' + eleid + '" placeholder="0" readonly type="text" class="span6 m-wrap" style="height: ' + self.options.inputheight + 'px ! important;width: ' + this.options.width + 'px; border: 1px solid rgb(229, 229, 229);">' +
                          '<span id="down_' + eleid + '" class="add-on" style="padding-left: 4px; padding-right: 4px; height:28px;">' +
                              '<i class="icon-sort-down"></i>' +
                          '</span>' +
                      '</div>' +
                      '<label for="' + eleid + '" class="error" style="display: none;">' + this.options.validateMessage + '</label>',
            contextstrhtml = '<div id="Combox_orgnizetree_' + eleid + '" class="Combox_orgnizetree" style="background-color:#FFFFFF; height:' + self.options.cheight + 'px;display:none;">' +
                                 '<div>' +
                                     '<input type="text" style="padding-right: 24px !important; padding-top: 6px; padding-bottom: 6px; margin: 1px;" class="inputfilter input-medium m-wrap" id="multipleKeyText_' + eleid + '">' +
                                     '<span class="editable-clear-x delete_' + eleid + '" style="top: 10px; margin-top: 0px;"></span>' +
                                 '</div>' +
                                 //'<div id="Combox_orgnizetree_context_' + eleid + '" style="height: ' + (self.options.cheight - 36) + 'px;overflow-y: auto;"></div>' +
                                 '<div>' +
                                     '<div id="Combox_context_' + eleid + '" style="width: ' + (self.options.width + self.options.diffwidth) + 'px; height: ' + (self.options.cheight - 78) + 'px; overflow-y: auto;"></div>' +
                                     '<div style="height: 40px; line-height:40px; position: absolute; bottom: 0px; width: 100%; border-top: 1px solid rgb(153, 153, 153);">' +
                                         '<input type="text" class="startdate span6 m-wrap" style="width: 214px; margin-left: 2px;margin-top:2px; " />' +
                                         '<input type="text" class="enddate span6 m-wrap" style="width: 214px; margin-left: 2px; margin-top:2px;" />' +
                                         '<div class="inbox">' +
                                            '<div>' +
                                              '<ul class="inbox-nav menu-nav margin-bottom-10" style="padding-right:2px;">' +
                                                  '<li class="all"><a data-title="Sent" href="javascript:;" class="btn">所有工单</a><b></b></li>' +
                                                  '<li class="ending active"><a data-title="Draft" href="javascript:;" class="btn">已结束</a><b></b></li>' +
                                                  '<li class="working"><a data-title="Draft" href="javascript:;" class="btn">作业中</a><b></b></li>' +
                                                  '<li class="nostart"><a data-title="Trash" href="javascript:;" class="btn">未开始</a><b></b></li>' +
                                              '</ul>' +
                                            '</div>' +
                                         '</div>'
            '<span style="margin-right: 10px;"><input type="checkbox" id="allcheck_' + eleid + '">' + $.Translate("YieldAnalysis.ALL") + '</span>' +
        '</div>' +
    '</div>' +
'</div>',
contextstrhtml = contextstrhtml + '<div id="Combox_detail" style="z-index:999999;border:1px solid #999999;background-color:#FFFFFF; width: ' + (self.options.width + self.options.diffwidth) + 'px;display:none;">' +
                     '<div id="Combox_detailcontext" style="width: ' + (self.options.width + self.options.diffwidth) + 'px; max-height: 100px; overflow-y: auto;">' +
                         '<ul style="margin-left: 0px; margin-bottom: 0px;"></ul>' +
                     '</div>' +
                 '</div>';


            this.element.hide();
            $(strhtml).insertAfter(this.element);
            $("body").append(contextstrhtml);
            var ctrWidth = $("#" + "input_" + eleid).parent().width();
            $("#Combox_orgnizetree_" + eleid).width(ctrWidth - 2);
            $("#multipleKeyText_" + eleid).width(ctrWidth - 36);
            $("#Combox_orgnizetree_context_" + eleid).width(ctrWidth - 4);
            $("#Combox_context_" + eleid).width();
            //初始化日期
            $("#Combox_orgnizetree_" + eleid).find(".startdate").kendoDatePicker({
                format: "yyyy/MM/dd",
                change: function (e) {
                    self._keyups();
                }
            });
            $("#Combox_orgnizetree_" + eleid).find(".enddate").kendoDatePicker({
                format: "yyyy/MM/dd",
                change: function (e) {
                    self._keyups();
                }
            });
            self.orderStatus = 3;
            $(".menu-nav li a.btn").on("click", function () {
                $(".menu-nav li.active").removeClass("active");
                $(this).parent().addClass("active");
                if ($(this).parent().hasClass("all")) {
                    self.orderStatus = 0;
                }
                else if ($(this).parent().hasClass("ending")) {
                    self.orderStatus = 3;
                }
                else if ($(this).parent().hasClass("working")) {
                    self.orderStatus = 2;
                }
                else if ($(this).parent().hasClass("nostart")) {
                    self.orderStatus = 1;
                }
                self.options.tag = 1;
                self._keyups();
            })

            $("#down_" + eleid).bind("click", { obj: self }, function (e, obj) {
                $(".li_bz_Search_obj_context").removeClass("k-state-selected").removeClass("k-state-focused");
                //加载组织结构，基于kendo tree
                var x5Combox = e.data.obj;
                var _top = ($(this).prev().offset().top + $(this).prev().parent().height() + x5Combox.options.difH) + "px";
                var _left = ($(this).prev().offset().left + x5Combox.options.difW) + "px";
                $('#Combox_orgnizetree_' + eleid).css({ "position": "absolute", "top": _top, "left": _left }).slideDown("slow");
                $(this).addClass("inputtree_focus_add");
                $(this).prev().addClass("inputtree_focus");
                $("body").off("mouseup").on("mouseup", function (event) {
                    if ($(event.target).parents("[data-role='calendar']").length > 0) {
                        return;
                    }
                    if ($(event.target).parents("#Combox_orgnizetree_" + eleid).length == 0) {
                        $("#Combox_orgnizetree_" + eleid).hide();
                        $("#input_" + eleid).removeClass("inputtree_focus")
                        $("#input_" + eleid).next().removeClass("inputtree_focus_add");
                    }
                });

                //加载数据
                //e.data.obj._ajaxRequest();
                self.options.tag = 1;
                self._keyups()

                //$("#Combox_orgnizetree_context_" + eleid + " ul").empty();
                //if (self.options.type != 5 && self.options.type != 6 && self.options.type != 7 && self.options.type != 8 && self.options.type != 9 && self.options.type != 10 && self.options.type != 11 && self.options.type != 12) {
                //    e.data.obj._ajaxRequest();
                //}
                //else {
                //    //产品与计划使用的时候。返回的数据加载到Combox_context内
                //    //初始化页数
                //    self.options.tag = 1;
                //    $("#Combox_orgnizetree_context_" + eleid).hide();
                //    $("#Combox_context_" + eleid).empty().parent().show();
                //    self._keyups();
                //}
                self.dataAarry = {}; //初始化
            });
            $("#multipleKeyText_" + eleid).bind("keyup", { obj: self }, function (e) {
                self.dataAarry = {};
                self.options.tag = 1;
                self.options.value = $(this).val();
                $("#Combox_context_" + eleid).empty();
                self._keyups();
            });

        },
        _updateSelect: function () {
            var self = this;
            if (typeof (self.options.select) == "function") {
                var eleid = self.element.attr("id");
                //$("#Combox_orgnizetree_" + eleid).hide();
                self.options.select.call(self, self.dataAarry);
            }
            else {
                if (this.options.multiple) {
                    var v = "";
                    for (var m in self.dataAarry) {
                        v = v + self.dataAarry[m] + ",";
                    }

                    var id = self.element.attr("id");
                    $("#input_" + id).attr("placeholder", v);
                }
                else {
                    var id = self.element.attr("id");
                    for (var m in self.dataAarry) {
                        $("#input_" + id).attr("placeholder", self.dataAarry[m]);
                    }
                }
            }
        },
        _keyupsdata: function (data) {
            var self = this
            eleid = self.element.attr("id");
            if (data.Status == 0) {
                if (self.options.tag == 1) {//页数
                    $("#Combox_context_" + eleid).empty();
                    var html = '<ul style="list-style: none outside none; margin-left: 0px; margin-bottom: 0px;">';
                }
                else {
                    var html = '';
                }
                for (var i = 0; i < data.Data.List.length; i++) {
                    html = html + '<li class="li_bz_Search_obj_context" id="' + data.Data.List[i].TASK_NBR + '" name="' + data.Data.List[i].TASK_NO + '" style="line-height:20px;padding:1px 5px;">' + data.Data.List[i].TASK_NO + '</li>';
                }
                if (data.Data.List.length == self.options.size && self.options.tag == 1) {
                    html = html + '<li id="dataload" style="line-height:20px;padding:1px 5px;"><span class="icon-spinner icon-spin"></span></li>';
                }
                if (self.options.tag == 1) {//页数
                    html = html + "</ul";
                    $("#Combox_context_" + eleid).append(html);
                    //if (self.options.remote) {
                    //    $("#dataload").bind("click", { obj: self }, function (e) {
                    //        e.data.obj._keyups();
                    //    });
                    //}
                    //else {
                    //    $("#dataload").remove();
                    //}
                }
                else {
                    $(html).insertBefore("#dataload");
                }
                self.options.tag++;
                $("#Combox_context_" + eleid + " > ul > li").hover(
                    function () {
                        $(this).addClass("k-state-hover");
                    },
                    function () {
                        $(this).removeClass("k-state-hover");
                    }
                );
                //单击
                $(".li_bz_Search_obj_context").unbind("click");
                $(".li_bz_Search_obj_context").bind("click", { obj: self }, function (event) {
                    if (event.data.obj.options.multiple) {
                        if ($(this).hasClass("k-state-selected")) {//被选中
                            $(this).removeClass("k-state-selected").removeClass("k-state-focused");
                            var eleid = event.data.obj.element.attr("id")
                            delete event.data.obj.dataAarry[isNaN(parseInt($(this).attr("id"))) ? $(this).attr("id") : parseInt($(this).attr("id"))];
                            self._updateSelect();
                        }
                        else {
                            var eleid = event.data.obj.element.attr("id")
                            event.data.obj.dataAarry[isNaN(parseInt($(this).attr("id"))) ? $(this).attr("id") : parseInt($(this).attr("id"))] = $(this).attr("name");
                            self._updateSelect();
                            $(this).addClass("k-state-selected").addClass("k-state-focused");
                        }
                    }
                    else {
                        $(".k-state-selected").removeClass("k-state-selected");
                        event.data.obj.dataAarry = {};
                        event.data.obj.dataAarry[isNaN(parseInt($(this).attr("id"))) ? $(this).attr("id") : parseInt($(this).attr("id"))] = $(this).attr("name");
                        self._updateSelect();
                        $(this).addClass("k-state-selected").addClass("k-state-focused");
                    }
                });
                if (data.Data.List.length < 10) {//已经到最后一条了
                    $("#dataload").remove();
                    $("#Combox_context_" + eleid).unbind("scroll");
                }
                else {
                    //注册Combox_context_滚动事件
                    $("#Combox_context_" + eleid).bind("scroll", function (e) {
                        var distanceScrollCount = $(this)[0].scrollHeight;
                        var distanceScroll = $(this)[0].scrollTop;
                        var offsetHeight = $(this)[0].offsetHeight;
                        if (distanceScroll > 0) {
                            if (distanceScroll + offsetHeight >= distanceScrollCount) {
                                $("#Combox_context_" + eleid).unbind("scroll");
                                if (self.options.type != 7) {//参数不需要滚动触发事件
                                    self._keyups();
                                }
                            }
                        }
                    });
                }
            }
        },
        _keyups: function () {
            var self = this,
                eleid = self.element.attr("id");
            //根据条件判断参数
            var pdata;
            if ($("#Combox_orgnizetree_" + eleid).find(".startdate").eq(1).val() != "" || $("#Combox_orgnizetree_" + eleid).find(".enddate").eq(1).val() != "") {
                if (self.orderStatus != 0) { //
                    pdata = {
                        filter: {
                            filters: [
                                { field: "PRE_START", operator: "eq", value: $("#Combox_orgnizetree_" + eleid).find(".startdate").eq(1).val() },
                                { field: "PRE_END", operator: "eq", value: $("#Combox_orgnizetree_" + eleid).find(".enddate").eq(1).val() }
                            ],
                            logic: "and"
                        },
                        page: self.options.tag,
                        pageSize: self.options.size,
                        skip: 0,
                        sort: [],
                        take: self.options.size
                    };
                    if (self.options.value != "") {
                        pdata.filter.filters.push({ field: "TASK_NO", operator: "contains", value: self.options.value });
                    }
                }
                else {
                    pdata = {
                        filter: {
                            filters: [
                                { field: "PRE_START", operator: "eq", value: $("#Combox_orgnizetree_" + eleid).find(".startdate").eq(1).val() },
                                { field: "PRE_END", operator: "eq", value: $("#Combox_orgnizetree_" + eleid).find(".enddate").eq(1).val() },
                                { field: "STATE", operator: "eq", value: self.orderStatus }
                            ],
                            logic: "and"
                        },
                        page: self.options.tag,
                        pageSize: self.options.size,
                        skip: 0,
                        sort: [],
                        take: self.options.size
                    };
                    if (self.options.value != "") {
                        pdata.filter.filters.push({ field: "TASK_NO", operator: "contains", value: self.options.value });
                    }
                }
            }
            else {
                if (self.orderStatus != 0) { //
                    pdata = {
                        filter: {
                            filters: [
                                { field: "STATE", operator: "eq", value: self.orderStatus }
                            ]
                        },
                        page: self.options.tag,
                        pageSize: self.options.size,
                        skip: 0,
                        sort: [],
                        take: self.options.size
                    };
                    if (self.options.value != "") {
                        pdata.filter.filters.push({ field: "TASK_NO", operator: "contains", value: self.options.value });
                        pdata.filter["logic"] = "and";
                    }
                }
                else {
                    pdata = {
                        page: self.options.tag,
                        pageSize: self.options.size,
                        skip: 0,
                        sort: [],
                        take: self.options.size
                    };
                    if (self.options.value != "") {
                        pdata.filter["filters"] = [];
                        pdata.filter.filters.push({ field: "TASK_NO", operator: "contains", value: self.options.value });
                        pdata.filter["logic"] = "and";
                    }
                }
            }

            $.post(self.options.url, JSON.stringify(pdata), function (data) {
                self._keyupsdata(data);

            })
        }
    });
})(jQuery);

/*元素resize*/
(function ($, h, c) { var a = $([]), e = $.resize = $.extend($.resize, {}), i, k = "setTimeout", j = "resize", d = j + "-special-event", b = "delay", f = "throttleWindow"; e[b] = 250; e[f] = true; $.event.special[j] = { setup: function () { if (!e[f] && this[k]) { return false } var l = $(this); a = a.add(l); $.data(this, d, { w: l.width(), h: l.height() }); if (a.length === 1) { g() } }, teardown: function () { if (!e[f] && this[k]) { return false } var l = $(this); a = a.not(l); l.removeData(d); if (!a.length) { clearTimeout(i) } }, add: function (l) { if (!e[f] && this[k]) { return false } var n; function m(s, o, p) { var q = $(this), r = $.data(this, d); r.w = o !== c ? o : q.width(); r.h = p !== c ? p : q.height(); n.apply(this, arguments) } if ($.isFunction(l)) { n = l; return m } else { n = l.handler; l.handler = m } } }; function g() { i = h[k](function () { a.each(function () { var n = $(this), m = n.width(), l = n.height(), o = $.data(this, d); if (m !== o.w || l !== o.h) { n.trigger(j, [o.w = m, o.h = l]) } }); g() }, e[b]) } })(jQuery, this);
/**************************************************************/
var format = function(time, format)

{
    var t = new Date(time);
    var tf = function(i){return (i < 10 ? '0' : "") + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}