;(function($, window, document, undefined){
    'use strict';
    $(document).ready(function(){
        //js载入更多数据
        //loading模板
        var loadingTmp = function(text){
            var html = '<div class="loading row">'+
                '    <span class="loading-text f-14">'+ text +'</span>'+
                '</div>';
            return html;
        };

        //错误提示
        var errorTmp = function(text){
            return '<div class="error row">'+ text +'</div>';
        };

        //单个产品模板
        var itemTmp = function(d){
            var price = Number(d.product_money_type) === 0 ? d.product_money +'元起' : d.product_money +'元';
            var iout = parseInt(d.product_store) === 0 ? '<i class="iout"></i>' : '';
            var html = '<li>'+
                '    <a href="detail.html" title="'+ d.product_name +'">'+
                '        <div class="img"><img src="'+ d.product_img_url +'" alt="'+ d.product_name +'"></div>'+
                '        <div class="info">'+
                '            <strong class="pname f-12">'+ d.product_name +'</strong>'+
                '            <span class="price f-14">'+ price +'</span>'+
                '        </div>'+ iout +
                '    </a>'+
                '</li>';
            return html;
        };

        var current = 1; //当前页码
        var isLoading = true; //是否能载入
        var retry = 0; //重试次数
        var box = $('#js-page-container');
        var total = parseInt(box.data('total'));
        var catId = box.data('catid');
        var checkBottom = function(){
            var dh = $(document).height();
            var sh = $(window).scrollTop();
            var wh = $(window).height();
            var res = false;
            if(dh === (sh+wh)){
                res = true;
            }
            return res;
        };
        var loadInit = null;
        //载入数据
        var getData = function(){
            var data = {
                cat_id: catId,
                cpage: current + 1
            };
            var reset = function(){
                $('.error').remove();
                $('.loading').remove();
                isLoading = true;
            };
            isLoading = false;
            box.after(loadingTmp('正在加载...'));
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: '/product/listpage',
                data: data,
                success: function(data){
                    reset();
                    if(parseInt(data.code) === 0){
                        var html = '';
                        $.each(data.data, function(i){
                            var d = data.data[i];
                            html += itemTmp(d);
                        });
                        box.find('ul').append(html);
                        current++;
                    } else {
                        var err = errorTmp(data.msg);
                        box.after(err);
                    }
                },
                error: function(){
                    reset();
                    if(retry < 3){
                        loadInit();
                        retry++;
                    } else {
                        var err = errorTmp('数据交互出现错误，请刷新重试！');
                        box.after(err);
                    }
                }
            });
        };
        loadInit = function(){
            if(total <= current || checkBottom() === false || isLoading === false || retry > 3){
                return false;
            }
            getData();
        };

        //回到顶部
        $(window).scroll(function(){
            var sidebar = $('.js-gotop');
			if($(document).scrollTop() > 120){
				sidebar.fadeIn(200);
			} else {
				sidebar.fadeOut(200);
			}
            loadInit();
		});

        loadInit();
    });
})(jQuery, window, document);
