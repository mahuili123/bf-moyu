;(function($, window, document, undefined){
    'use strict';

    /*ajax错误代码*/
    MOYU.ajaxerror = {
        '1': '与服务器交互发生错误，请稍后再试！'
    };

    MOYU.ajax = function(opts){
        if(!opts || $.isEmptyObject(opts)){
            alert('参数配置不正确！');
            return false;
        }
        var option = {
            url: [],
            params: null,
            succ: function(){},
            sys_type: true,
            sys_error: function(){},
            error: function(){}
        };
        option = $.extend(true, option, {}, opts || {});
        $.ajax({
            type: option.url[0],
            dataType: option.url[1],
            url: option.url[2],
            data: option.params,
            success: function(data){
                if(parseInt(data.code) === 0){
                    if(option.succ && $.isFunction(option.succ)){
                        option.succ(data);
                    }
                } else {
                    if(option.sys_type){
                        var cb = function(){
                            option.sys_error(data);
                        };
                        MOYU.alert(data.msg, cb);
                    } else {
                        if(option.sys_error && $.isFunction(option.sys_error)){
                            option.sys_error(data);
                        }
                    }
                }
            },
            error: function(data){
                var cb = function(){
                    option.error(data);
                };
                MOYU.alert(MOYU.ajaxerror['1'], cb);
            }
        });
    };

})(jQuery, window, document);
