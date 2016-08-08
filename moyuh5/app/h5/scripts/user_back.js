;(function($, window, document, undefined){
    'use strict';

    var showBigImg = function(src){
        var imgDialog = '<div class="img-dialog"><img src="'+ src +'"><a class="close" href="javascript:;">'+ MOYU.svgTemp('remove') +'</a></div>';
        var $imgDialog = $(imgDialog);
        $imgDialog.height($(document).height());
        $imgDialog.find('a').on('click', function(){
            $imgDialog.remove();
        });
        $('body').append($imgDialog);
    };

    var setExpress = function(){
        var html = '<div class="dialog-form-box">'+
            '    <div class="dialog-form f-14">'+
            '        <a class="close" href="javascript:;">'+ MOYU.svgTemp('remove') +'</a>'+
            '        <ul>'+
            '            <li>'+
            '                <label class="t">物流公司</label>'+
            '                <div class="input"><input type="text" placeholder="请填写物流公司" name="wl"></div>'+
            '            </li>'+
            '            <li>'+
            '                <label class="t">运单号</label>'+
            '                <div class="input"><input type="text" name="num"></div>'+
            '            </li>'+
            '            <li class="btn">'+
            '                <button type="button" class="btn-red-small save">确 定</button>'+
            '            </li>'+
            '        </ul>'+
            '    </div>'+
            '</div>';
        var $html = $(html);
        $html.on('click', '.close', function(){
            $html.remove();
        });
        $html.on('focus', 'input', function(){
            $(this).next('span').remove();
        });
        $html.on('click', '.save', function(){
            var me = $(this);
            var company = $html.find('input[name="wl"]');
            var num = $html.find('input[name="num"]');
            var reset = function(){
                me.prop('disabled', false);
            };
            if(!company.val()){
                company.next().remove();
                company.after('<span>需填写物流公司</span>');
                return false;
            }
            if(!num.val()){
                num.next().remove();
                num.after('<span>需填写运单号</span>');
                return false;
            }
            me.prop('disabled', true);
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: '/h5/data/succ.json',
                data: { company: company.val(), num: num.val() },
                success: function(data){
                    if(parseInt(data.code) === 0){
                        window.location.reload(true);
                    } else {
                        reset();
                        MOYU.alert(data.msg);
                    }
                },
                error: function(){
                    reset();
                    MOYU.alert('与服务器交互发生错误，请稍后再试！');
                }
            });

            return false;
        });
        $('body').append($html);
    };

    $(document).ready(function(){
        $('.js-imgs').on('click', 'a', function(){
            var me = $(this);
            var src = me.attr('href');
            showBigImg(src);
            return false;
        });

        $('.js-set-express').on('click', setExpress);
    });

})(jQuery, window, document);
