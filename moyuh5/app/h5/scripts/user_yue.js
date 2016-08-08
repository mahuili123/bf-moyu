;(function($, window, document, undefined){
    'use strict';

    var addYue = function(){
        var me = $(this);
        var input = $('#js-yue-input');
        var code = input.val();
        var reset = function(){
            me.prop('disabled', false).text('兑换');
        };
        if(code){
            me.prop('disabled', true).text('兑换中');
            $.ajax({
                type: 'GET',
                dataType: 'json',
                data: { code: code },
                url: '/user/balance/ajax_code_exchange',
                success: function(data){
                    if(parseInt(data.code) === 0){
                        window.location.reload(true);
                    } else {
                        MOYU.alert(data.msg);
                    }
                    reset();
                },
                error: function(){
                    MOYU.alert('交互出错，请稍后再试！');
                    reset();
                }
            });
        } else {
            MOYU.alert('请输入兑换码');
        }
        return false; 
    };
    $(document).ready(function(){
        $('#js-new-yue').on('click', addYue);
    });

})(jQuery, window, document);