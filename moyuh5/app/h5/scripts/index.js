;(function($, window, document, undefined){
    'use strict';
    $(document).ready(function(){
        //焦点图
        $('#js-slides').slidesjs({
            navigation: {
                active: false
            },
            effect: {
                fade: {
                    speed: 400
                }
            },
            play: {
                active: false,
                auto: true,
                pauseOnHover: true,
                interval: 4000,
                swap: true
            }
        });

        $(window).scroll(function(){
            var gotop = $('.js-gotop');
			if($(document).scrollTop() > 120){
				gotop.fadeIn(200);
			} else {
				gotop.fadeOut(200);
			}
		});
    });
})(jQuery, window, document);
