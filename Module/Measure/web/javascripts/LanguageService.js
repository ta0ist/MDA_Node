(function ($) {

    var mLanguages = {};
    var cookieName = "X1.Core.Language.Current";

    function tryGetBrowserLanguage()
    {
        var currentLang = navigator.language;  
        if(!currentLang)
            currentLang = navigator.browserLanguage;
        if(!currentLang)
            currentLang="zh-CN";
        return currentLang.toLocaleLowerCase();
    }

    function tryGetLanguageData(targetLanguage)
    {
        var lang = mLanguages[targetLanguage];
        if (typeof (lang) == 'undefined') {
            var resultObj = $.ajax({ url: "/X1System/Language?name=" + targetLanguage, async: false, type: "GET" });
            if (!resultObj || !resultObj.responseJSON)
                return null;

            mLanguages[targetLanguage] = resultObj.responseJSON;
            return mLanguages[targetLanguage];
        }
        return lang;
    }

    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
    
    $.GetCurrentLanguage=function () {
        var targetLanguage = getCookie(cookieName);
        if (!targetLanguage)
            targetLanguage = tryGetBrowserLanguage();
        return targetLanguage;
    }

    $.SetCurrentLanguage=function(targetLanguage)
    {
        if (!targetLanguage)
            targetLanguage = tryGetBrowserLanguage();
        var lang = tryGetLanguageData(targetLanguage);
        if (!lang) {
            return false;
        }
        var resultObj = $.ajax({ url: "/X1System/Language/Current?name=" + targetLanguage + "&id=" + Math.random(), async: false, type: "GET" });
        if (!resultObj || !resultObj.responseJSON) {
            return false;
        }
        //语言存入cookie
        //$.cookie(cookieName, "", targetLanguage, { expires: 365, path: "/", secure: false });
        return resultObj.responseJSON.Status==0;
    }

    $.Translate = function (id, targetLanguage) {
        if (!targetLanguage)
            targetLanguage = getCookie(cookieName);

        if (!targetLanguage)
            targetLanguage = tryGetBrowserLanguage();

        var lang = tryGetLanguageData(targetLanguage);

        if (!lang)
            return id;

        var result = lang[id];
        if (!result)
            return id;
        return result;
    }

    $.fn.extend({
        Translate: function (targetLanguage) {
            $(this).find("[data-lang]").each(function () {
                var id = $(this).attr("data-lang");
                if(id)
                    $(this).text($.Translate(id, targetLanguage));
            });
        }
    })
})(jQuery);