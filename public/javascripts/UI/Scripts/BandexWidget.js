(function ($) {
    var WidgetList = new Array();
    
    $.WidgetManager = {
        GetWidgetByName: function (name) {
            for(var i=0;i<WidgetList.length;i++)
            {
                if (WidgetList[i].options.Name == name)
                    return WidgetList[i];
            }
            return null;
        }
    };

    var nameIndex = 0;
    function _RefreshTheWidget(dataurl, options)
    {
        if (!dataurl)
            dataurl = options.DataUrl;
        if (!dataurl)
            return false;
        
        if (typeof(options.OnRefresh) == "function") {
            $.ajax(
                {
                    url: dataurl,
                    async: true,
                    type: options.DataUrlMethod,
                    success: function (data) {
                        options.OnRefresh(data);
                    },
                    error: function (data) {
                        if (options.OnError)
                            options.OnError(data);
                    }
                });
            return true;
        }
        return false;
    }

    $.widget('Bandex.WidgetBase', {
        options: {
            Name: "widget" + (nameIndex++)
            , DataUrl: false
            , TargetUrl: false
            , DataUrlMethod: "GET"
            , OnRefresh: false
            , OnError: false
        },

        _init: function () {
            WidgetList.push(this);
        },
        
        _create: function () {
            
            //$(this.element).resizable({animate: true});

            //if($("#move-handle", this.element).length!=0)
               // $(this.element).draggable({ handle: "#move-handle" });
            _RefreshTheWidget(false, this.options);
        },

        _destory: function () {
            //$(this.element).draggable("destory");
            //$(this.element).resizable("destory");
        },

        turnOffTargetUrl: function () {
            if (this.options.TargetUrl) {
                location.url = this.options.TargetUrl;
            }
        },
        Refresh: function (dataurl) {
            _RefreshTheWidget(dataurl, this.options);
        }
    });
})(jQuery);
