;(function($, window, document, undefined){
    'use strict';

    var dialog = function(){
        var html = '<div class="user-add-box" id="js-add-balance">'+
            '    <div class="user-add-form">'+
            '        <h2><span>兑换码</span></h2>'+
            '        <div class="user-add-list">'+
            '            <ul>'+
            '                <li class="text"><input type="text" placeholder="请输入兑换码"></li>'+
            '                <li class="btns">'+
            '                    <button type="button" class="btn-red-large fl js-save">兑换</button>'+
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
                showErr('请输入兑换码');
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
    });

})(jQuery, window, document);
