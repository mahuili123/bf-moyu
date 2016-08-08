;(function($, window, document, undefined){
    'use strict';

    //付款倒计时
    var payCountTime = function(){
        var items = $('.js-count-time');
        var diff = 1000; //1分钟
        var format = function(d){
            var h = parseInt(d/3600);
            var m = parseInt((d%3600) / 60);
            var s = parseInt((d%3600) % 60);
            return h +'小时'+ m +'分'+ s +'秒';
        };
        if(items.length === 0){
            return false;
        }
        $.each(items, function(){
            var me = $(this);
            var total = parseInt(me.data('left'));
            var timer = null;
            if(total){
                timer = setInterval(function(){
                    total -= 1;
                    if(total <= 0 && timer){
                        clearInterval(timer);
                        window.location.reload(true);
                    } else {
                        me.html(format(total));
                    }
                }, diff);
            }
        });
    };
    $(document).ready(function(){
        payCountTime();
    });

})(jQuery, window, document);
