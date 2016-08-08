;(function($, window, document, undefined){
    'use strict';

    var checkUrl = '/user/order/payfinish?order_info_no='+ $CONFIG.order_id;
    var countTimer = $('#js-count-time');
    var totalTime = parseInt(countTimer.data('total'));
    var formatTime = function(num){
        var h = parseInt(num/3600);
        var m = parseInt((num%3600) / 60);
        var s = (num%3600) % 60;
        h = h<10 ? '0'+ h : h;
        m = m<10 ? '0'+ m : m;
        s = s<10 ? '0'+ s : s;
        return h +'小时'+ m +'分'+ s +'秒';
    };
    var count = function(){
        setTimeout(function(){
            totalTime--;
            if(totalTime > 0){
                count();
                countTimer.text(formatTime(totalTime));
            } else {
                window.location.reload();
            }
        }, 1000);
    };

    var openLink = function(){
        var dialog = new MOYU.sysinfo({
            width: 500,
            height: 260,
            title: '正在支付...',
            ex_class: 'pay-dialog',
            msg: '支付完成前请不要关闭该窗口 <br> 支付遇到问题请查看 <a href="#" class="c-e73d4d" target="_blank">帮助中心</a>',
            buttons: [{
                text: '支付成功',
                ex_class: 'ok',
                func: function(){
                    window.location.href = checkUrl;
                }
            }, {
                text: '选择其他支付方式',
                ex_class: 'canncel',
                func: function(){
                    dialog.hide();
                }
            }]
        });
        dialog.show();
    };

    var scanCode = function(url){
        var checkTimer = null;
        var html = '<div id="js-weixin-code" class="winxin-code-box">'+
            '    <div class="winxin-code">'+
            '        <a href="javascript:;" class="close"><i class="icon-24 icon-24-del"></i></a>'+
            '        <ul>'+
            '            <li><img src="'+ url +'" width="200" height="200"></li>'+
            '            <li class="m"><i></i>微信扫描码支付</li>'+
            '            <li class="c-df1f26 f-24">¥ '+ $CONFIG.total +'</li>'+
            '        </ul>'+
            '    </div>'+
            '</div>';
        var $html = $(html);
        var checked = function(){
            checkTimer = setTimeout(function(){
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: '/www/data/error.json',
                    data: { orderid: $CONFIG.order_id },
                    success: function(data){
                        if(parseInt(data.code) === 0){
                            window.location.href = checkUrl;
                        } else {
                            checked();
                        }
                    },
                    error: function(){
                        checked();
                    }
                });
            }, 5000);
        };

        $html.height($(document).height());
        $html.on('click', '.close', function(){
            $html.remove();
            if(checkTimer){
                clearTimeout(checkTimer);
            }
        });
        $('body').append($html);

        //轮询检测支付状态
        checked();
    };

    var init = function(){
        //订单详细
        var s = $('table.s');
        $('.js-more-detail').on('click', function(){
            var c = 'more-detail';
            var m = $(this);
            if(s.is(':hidden')){
                m.addClass(c);
                s.show();
            } else {
                m.removeClass(c);
                s.hide();
            }
            return false;
        });

        //切换支付方式
        $('.bank-list').on('click', 'li', function(){
            var me = $(this);
            var items = me.closest('.bank-list').find('li').not(me);
            if(me.hasClass('checked')){
                me.removeClass('checked');
            } else {
                items.removeClass('checked');
                me.addClass('checked');
            }
            return false;
        });

        //付款
        $('#js-pay').on('click', function(){
            var checked = $('.bank-list').find('li.checked');
            var id = Number(checked.data('id'));
            var val = checked.data('value');
            if(checked.length === 0){
                MOYU.alert('请先选择支付方式！');
            } else {
                if(id === 1){ //支付宝
                    openLink();
                    window.open(val);
                } else if(id === 2){ //微信支付
                    scanCode(val);
                } else {
                    MOYU.alert('无效的支付方式！');
                }
            }
            return false;
        });

        //订单支付倒计时
        count();
    };

    $(document).ready(init);

})(jQuery, window, document);
