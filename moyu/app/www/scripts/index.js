;(function($, window, document, undefined){
    'use strict';
    $(document).ready(function(){
        //焦点图
        $('#js-slides').slidesjs({
            height: 512,
            navigation: {
                effect: 'fade'
            },
            pagination: {
                effect: 'fade'
            },
            effect: {
                fade: {
                    speed: 400
                }
            },
            play: {
                active: false,
                auto: true,
                effect: 'fade',
                pauseOnHover: true,
                interval: 4000,
                swap: true
            }
        });

        var sliderBox = $('.js-index-slider');
        var slidesPagination = function(type){
            var prev = sliderBox.find('.slidesjs-previous');
            var next = sliderBox.find('.slidesjs-next');
            var width = $(document).width();
            var fixedWidth = 1226;
            var half = parseInt((width-fixedWidth) / 2) - 70;
            if(type === 'show'){
                half = half < 0 ? 0 : half;
                prev.css('left', half).show();
                next.css('right', half).show();
            } else {
                prev.hide();
                next.hide();
            }
        };
        sliderBox.on('mouseenter', function(){
            slidesPagination('show');
        }).on('mouseleave', function(){
            slidesPagination('hide');
        });

        //显示边栏
        var countPositionArr = [];
        var setPosition = function(){ //初始化位置数组
            var items = $('.js-side-item');
            $.each(items, function(index){
                var me = $(this);
                var minTop = me.offset().top;
                var maxTop = minTop + me.outerHeight();
                var oldMintop = minTop;
                //最小值加上偏移值
                if(index > 0){
                    minTop -= (index * 50);
                } else {
                    minTop -= 200;
                }
                countPositionArr.push([minTop, maxTop, oldMintop]);
            });
        };
        var getPosition = function(num){ //当前显示那个区域
            var res = null;
            $.each(countPositionArr, function(k, v){
                if(num >= v[0] && num < v[1]){
                    res = k;
                    return false;
                }
            });
            return res;
        };
        setPosition(); //[[822, 1431], [1431, 2040], [2040, 2912], [2912, 3252]]


        var countPosition = function(){
            var ctrls = $('.js-index-sidebar .index-nav li:not(.flow)');
            var flow = $('.js-index-sidebar .flow');
            var top = flow.offset().top;
            var index = getPosition(top);
            if(index !== null){
                ctrls.eq(index).addClass('current').siblings('li').removeClass('current');
                flow.css({
                    top: 50 * index
                }).show();
            } else {
                ctrls.removeClass('current');
                flow.hide();
            }
        };

        var scrollTimer = null;
        $(window).scroll(function(){
            var sidebar = $('.js-index-sidebar');
			if($(document).scrollTop() > 120){
				sidebar.fadeIn(200);
			} else {
				sidebar.fadeOut(200);
			}

            //计算当前分类的位置
            if(scrollTimer){
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(function(){
                countPosition();
            }, 30);
		});

        //跳转到对应的位置
        $('body').on('click', '.js-index-sidebar .index-nav li:not(.flow)', function(){
            var index = $('.js-index-sidebar .index-nav li:not(.flow)').index(this);
            $('body, html').animate({
                scrollTop: countPositionArr[index][2] - 50
            }, 600, 'easeInOutExpo');
            return false;
        });
    });
})(jQuery, window, document);
