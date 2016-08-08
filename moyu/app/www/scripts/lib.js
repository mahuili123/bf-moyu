var MOYU = {};
;(function($, window, document, undefined){
    'use strict';

    /* 发布订阅模式
     * 使用范例：
     * $(function () {
     *     $.getJSON('data.json', function (results) {
     *         $.publish('add', results);
     *     });
     *     $.subscribe('add', function(e, results) {
     *         $('body').html(results.one);
     *     });
     * });
     */
    var moyuPubSub = $({}); //自定义事件对象
	$.each({
		trigger: 'publish', //发布
		on: 'subscribe', //订阅
		off: 'unsubscribe' //取消订阅
	}, function(key, val) {
		$[val] = function() {
			moyuPubSub[key].apply(moyuPubSub, arguments);
		};
	});

    /* 载入svg
     * @param svgs { string, array } svgurl ex: 'path/ex.svg', 'path/ex1.svg, path/ex2.svg', ['path/ex1.svg', 'path/ex2.svg']
     * @param host { string } 域名 ex: "http://www.example.com/"
     */
    MOYU.loadSvg = function(svgs, host){
        if(svgs){
            var type = typeof(svgs);
            var ajax = function(url){
                url = $.trim(url);
                host = host ? host : '/';
                if(url){
                    $.ajax({
                        type: 'GET',
                        dataType: 'text',
                        url: host + url,
                        success: function(data){
                            $('head').append(data);
                        },
                        error: function(){}
                    });
                }
            };
            if(type === 'string'){
                svgs = svgs.split(',');
            }
            for(var i=0; i<svgs.length; i++){
                ajax(svgs[i]);
            }
        }
    };

    /*获取购物车数量*/
    MOYU.getCartTotal = function(callback){
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: '/user/cart/goodsnum',
            data: '',
            success: function(data){
                if(parseInt(data.code) === 0){
                    var total = data.data ? data.data : '0';
                    if(callback && $.isFunction(callback)){
                        callback(total);
                    }
                }
            },
            error: function(){}
        });
    };

    /* alert */
    MOYU.sysinfo = function(option){
        var dialog = null;
        var opts = {
            width: 414,
            height: 206,
            msg: '',
            title: '',
            ex_class: '',
            buttons: [{
                text: '确定',
                ex_class: '',
                func: function(){}
            }, {
                text: '取消',
                ex_class: '',
                func: function(){}
            }]
        };
        opts = $.extend(false, opts, {}, option || {});

        this.creatDialog = function(d){
            var html = '<div class="moyu-sysinfo-box '+ opts.ex_class +'">'+
                '    <div class="moyu-sysinfo">'+
                '        <div class="title">'+ opts.title +'<a href="javascript:;" class="close"><i class="icon-24 icon-24-del"></i></a></div>'+
                '        <div class="info"></div>'+
                '        <div class="btns">'+
                '        </div>'+
                '    </div>'+
                '</div>';
            var $html = $(html);
            $html.height($(document).height());
            $html.find('.info').html(d.msg);
            $html.find('.moyu-sysinfo').css({
                width: d.width,
                height: d.height,
                marginLeft: '-'+ parseInt(d.width / 2) +'px',
                marginTop: '-'+ parseInt(d.height / 2) +'px'
            });
            $html.on('click', 'a.close', function(){
                $html.remove();
            });
            $.each(d.buttons, function(k, v){
                var btn = $('<button type="button" class="b-'+ k +' '+ v.ex_class +'">'+ v.text +'</button>');
                btn.on('click', function(){
                    if(v.func && $.isFunction(v.func)){
                        v.func(btn);
                    }
                });
                $html.find('.btns').append(btn);
            });
            return $html;
        };
        this.show = function(){
            dialog = this.creatDialog(opts);
            $('body').append(dialog);
        };
        this.hide = function(){
            if(dialog){
                dialog.remove();
            }
        };
    };
    MOYU.alert = function(msg, cb){
        var alt = new MOYU.sysinfo({
            msg: msg,
            buttons: [{
                text: '我知道了',
                ex_class: 'ok',
                func: function(){
                    alt.hide();
                    if(cb && $.isFunction(cb)){
                        cb();
                    }
                    return false;
                }
            }]
        });
        alt.show();
    };
    MOYU.flashInfo = function(option){
        var $html = null;
        var opts = {
            width: 232,
            height: 82,
            msg: '',
            cb: function(){},
            delay: 1000
        };
        opts = $.extend(true, opts, {}, option || {});
        $html = $('<div class="moyu-flash-info">'+ opts.msg +'</div>');
        $html.css({
            width: opts.width,
            height: opts.height,
            marginLeft: '-'+ parseInt(opts.width / 2) +'px',
            marginTop: '-'+ parseInt(opts.height / 2) +'px',
            lineHeight: opts.height +'px'
        });
        $('body').append($html);
        setTimeout(function(){
            $html.remove();
        }, opts.delay);
    };

    $(document).ready(function(){
        var topCartTotal = $('#js-top-cart-total');
        if(topCartTotal[0]){
            MOYU.getCartTotal(function(total){
                topCartTotal.text(total);
            });
        }

        //回到顶部
        $('body').on('click', '.js-gotop', function(){
            $('body, html').animate({
                scrollTop: 0
            }, 600, 'easeInOutExpo');
            return false;
        });
    });

})(jQuery, window, document);
