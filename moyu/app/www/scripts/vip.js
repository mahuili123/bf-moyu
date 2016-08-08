;(function($, window, document, undefined){
    'use strict';

    var countPrice = function(){
        var p = Number($('.js-product-type li.checked').data('price'));
        var y =  $('#js-yue-num');
        var t = y.is(':checked') ? Number(y.val()) : 0;
        var d = p - t;
        d = d < 0 ? 0 : d;
        $('#js-total').text(p);
        $('#js-yue-total').text(t);
        $('#js-pay-total').text(d);
    };

    $(document).ready(function(){
        $('.js-product-type, .payway').on('click', 'li', function(){
            var me = $(this);
            me.addClass('checked').siblings().removeClass('checked');
            countPrice();
            return false;
        });

        $('#js-yue-num').on('change', function(){
            countPrice();
        }).moyuCR();

        countPrice();

        $('#js-pay-submit').on('click', function(){
            var me = $(this);
            var pid = $('.js-proudct-type li.checked').data('pid');
            var type = $('.payway li.checked').data('value');
            var isuse = $('#js-yue-num').is(':checked') ? 1 : 2;
            var reset = function(){
                me.prop('disabled', false).text('提交订单');
            }

            if(!pid || !type || !isuse){
                MOYU.alert('参数不正确！');
                return false;
            }

            me.prop('disabled', true).text('订单提交中...');
            MOYU.ajax({
                url: ['GET', 'json', '/www/data/succ.json'],
                params: { pid: pid, type: type, isuse: isuse },
                succ: function(){
                    reset();
                },
                sys_error: reset,
                error: reset
            });
        });
    });

})(jQuery, window, document);
