(function ($) {
    var NoticeList = new Array();

    $.NoticeManager = {
        GetNotice: function (id) {
            for (var i = 0; i < NoticeList.length; i++) {
                if (NoticeList[i].ID == id)
                    return NoticeList[i];
            }
            return null;
        },

        RemoveNotice: function (id) {
            for (var i = 0; i < NoticeList.length; i++) {
                if (NoticeList[i].ID == id)
                {
                    $(NoticeList[i].element).remove();
                    NoticeList = NoticeList.splice(i, 1);
                    break;
                }
            }
            return true;
        },

        AddNotice: function (id, message, url, element) {
            NoticeList.push( { id: id, message: message, url: url, element: element });
            return true;
        },

        GetNoticeCount:function()
        {
            return NoticeList.length;
        }
    };

    function UpdateList(self,data)
    {
        self.DataSource = data;
        var firstChildren = $(self.element).find("#inbox-dropdown-menu").children("li:first");
        for (var i = 0; i < data.length; ++i) {
            //alert(new Date(eval(data[i].EVENT_DATE).source));
            var html = '<li class="notices"><a href="' + data[i].URL + '">' +
                //'<span class="photo"><img src="/UI/Scripts/media/image/avatar2.jpg" alt=""></span>'+
                '<span class="subject">' +
                '<span class="from" style="margin-right: 20px;">2</span>' +
                '<span class="from">' + data[i].FROM_SOURCE + '</span>' +
                '<span class="time">' + moment(data[i].EVENT_DATE).format("YYYY-MM-DD HH:mm:ss") + '</span>' +
                '</span>' +
                '<span class="message" style="margin-left: 25px;">' +
                data[i].SUBJECTS +
                '</span></a>' +
                '</li>';
            var e=$(html).insertAfter(firstChildren);
            $.NoticeManager.AddNotice(data[i].ID, data[i].SUBJECTS, data[i].URL, e);
        }
        $(self.element).find("#notification_icon").text($.NoticeManager.GetNoticeCount());
    }

    $.widget('Bandex.Notice', {
        options: {
            DataUrl: false
            , DataUrlMethod: "post"
            , Page: 1
            , PageSize: 5
        },

        _init: function () {
        },

        _create: function () {
            var self = this;
            var $opts = this.options;
            $("#message_swapright").on("click", function (e) {
                $opts.Page++;
                if ($opts.Page > 1) {
                    $("#message_swapleft").show();
                }
                if ($opts.Page == self.PageCount) {
                    $("#message_swapright").hide();
                }
                self._refresh();
                e.stopPropagation();
            });
            $("#message_swapleft").on("click", function (e) {
                $opts.Page--;
                if ($opts.Page == 1) {
                    $("#message_swapleft").hide();
                }
                if ($opts.Page < self.PageCount) {
                    $("#message_swapright").show();
                }
                self._refresh();
                e.stopPropagation();
            });
            this.Refresh();
        },

        _destory: function () {
        },
        _UpdateList: function (data) {
            this.DataSource = data;
            $opts =this.options;
            this.PageCount = Math.ceil(data.length / $opts.PageSize);
            $(this.element).find("#notification_icon").text(this.DataSource.length);
            if (this.PageCount == 1) {
                $("#message_swapright").hide();
                $("#message_swapleft").hide();
            }
            this._refresh();
        },
        _refresh: function () {
            $opts = this.options;
            var length = 0;
            if ($opts.Page < this.PageCount) {
                length = $opts.PageSize * $opts.Page;
            }
            else{
                length = this.DataSource.length;
            }
            var shtml = "";
            for (var i = $opts.PageSize * ($opts.Page - 1) ; i < length; i++) {
                shtml = shtml + '<li class="notices"><a href="' + this.DataSource[i].URL + '">' +
                //'<span class="photo"><img src="/UI/Scripts/media/image/avatar2.jpg" alt=""></span>'+
                '<span class="subject">' +
                '<span class="from" style="margin-right: 20px;">' + (i + 1) + '.</span>' +
                '<span class="from">' + this.DataSource[i].FROM_SOURCE + '</span>' +
                '</span>' +
                '<span class="message" style="margin-left: 25px;">[' + this.DataSource[i].SUBJECTS + ']</span>' +
                '<span class="message" style="margin-left: 25px; font-style: italic; font-weight: 600;">' + moment(this.DataSource[i].EVENT_DATE).format("YYYY-MM-DD HH:mm:ss") + '</span>' +
                '</a>' +
                '</li>';
            }
            var firstChildren = $(this.element).find("#inbox-dropdown-menu").children("li:first");
            $(".notices").remove();
            $(shtml).insertAfter(firstChildren).show("slow");
        },
        Refresh: function () {
            var self = this;
            $.ajax(
               {
                   url: this.options.DataUrl,
                   async: true,
                   data: JSON.stringify({ pageIndex: this.options.Page, pageSize: this.options.PageSize }),
                   type: this.options.DataUrlMethod,
                   success: function (data) {
                       self._UpdateList(data.Data);
                   }
               });
        }
    });
})(jQuery);
