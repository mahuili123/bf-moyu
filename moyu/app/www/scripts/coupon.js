;(function($, window, document, undefined){
    'use strict';

    var dialog = function(){
        var html = '<div class="user-add-box" id="js-add-balance">'+
            '    <div class="user-add-form">'+
            '        <h2><span>绑定优惠券</span></h2>'+
            '        <div class="user-add-list">'+
            '            <ul>'+
            '                <li class="text"><input type="text" placeholder="请输入优惠券码"></li>'+
            '                <li class="btns">'+
            '                    <button type="button" class="btn-red-large fl js-save">绑定</button>'+
            '                    <button type="button" class="btn-white-large fr js-close">取消</button>'+
            '                </li>'+
            '            </ul>'+
            '        </div>'+
            '    </div>'+
            '</div>';
        var $html = $(html);
        $html.height($(document).height());
        $html.on('click', '.js-close', function(){
            $html.find('input').val('');
            $html.find('.error').remove();
            $html.hide();
            return false;
        });
        $html.on('click', '.js-save', function(){
            var me = $(this);
            var input = $html.find('input');
            var code = input.val();
            var showErr = function(text){
                var error = input.next('.error');
                if(error[0]){
                    error.text(text);
                } else {
                    input.after('<span class="error">'+ text +'</span>');
                }
                input.select();
            };
            var reset = function(){
                me.prop('disabled', false).text('绑定');
            };
            if(code){
                me.prop('disabled', true).text('绑定中');
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    data: { coupon_code: code },
                    url: '/user/coupon/ajax_code_bind',
                    success: function(data){
                        if(parseInt(data.code) === 0){
                            window.location.reload(true);
                        } else {
                            showErr(data.msg);
                        }
                        reset();
                    },
                    error: function(){
                        showErr('交互出错，请稍后再试！');
                        reset();
                    }
                });
            } else {
                showErr('请输入优惠券码');
            }
            return false;
        });
        return $html;
    };
    $(document).ready(function(){
        var addBalance = $('#js-add-balance');
        $('.js-input-code').on('click', function(){
            if(addBalance[0]){
                addBalance.show();
            } else {
                addBalance = dialog();
                $('body').append(addBalance);
            }
            return false;
        });

        $('.coupon-title').on('click', 'li', function(){
            var index = $('.coupon-title li').index(this);
            $(this).addClass('current').siblings().removeClass('current');
            $('.coupon-item').eq(index).show().siblings().hide();
        });
    });

})(jQuery, window, document);
