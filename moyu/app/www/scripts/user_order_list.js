;(function($, window, document, undefined){
    'use strict';

    //付款倒计时
    var payCountTime = function(){
        var items = $('.js-count-time');
        var diff = 1000*60; //1分钟
        var format = function(d){
            var h = parseInt(d/3600);
            var m = parseInt((d%3600) / 60);
            return '还剩'+ h +'小时'+ m +'分';
        };
        $.each(items, function(){
            var me = $(this);
            var total = parseInt(me.data('left'));
            var timer = null;
            var td = me.closest('td');
            var status = td.prev().find('.js-status');
            if(total){
                timer = setInterval(function(){
                    total -= 60;
                    if(total <= 0 && timer){
                        clearInterval(timer);
                        status.replaceWith('<span class="cl c-999">已取消</span>');
                        td.html('&nbsp;');
                    } else {
                        me.html(format(total));
                    }
                }, diff);
            }
        });
    };
    payCountTime();

})(jQuery, window, document);
