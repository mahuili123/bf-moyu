;(function($, window, document, undefined){
    'use strict';

    var addNum = function(){
        //加减数量
        /*var err = function(text){
            var html = '<div class="js-stock-tips c-e73d4d">'+ text +'</div>';
            return html;
        };*/
        var countNum = function(box, type){
            if(box.hasClass('disabled')){
                return false;
            }

            var input = box.find('input');
            //var id = box.closest('li').data('id');
            var minVal = parseInt(box.data('min'));
            var maxVal = parseInt(box.data('max'));
            var val = parseInt(input.val());
            var to = 0;
            /*var errMsg = input.data('mgs');
            var showErr = function(text){
                var e = box.next('.js-stock-tips');
                if(e[0]){
                    e.text(text);
                } else {
                    box.after(err(text));
                }
            };
            var removeErr = function(){
                var e = box.next('.js-stock-tips');
                if(e[0]){
                    e.remove();
                }
            };
            //removeErr();*/
            val = val ? val : 1;
            to = val + type;
            if(to < minVal){
                to = minVal;
            } else if(to > maxVal){
                to = maxVal;
                //显示错误
                //showErr(errMsg);
            }
            input.val(to);
            return false;
        };
        $('body').on('click', '.moyu-input-number .cut', function(){
            var box = $(this).closest('.moyu-input-number');
            countNum(box, -1);
            return false;
        });
        $('body').on('click', '.moyu-input-number .add', function(){
            var box = $(this).closest('.moyu-input-number');
            countNum(box, 1);
            return false;
        });
        $('body').on('change', '.moyu-input-number input', function(){
            var box = $(this).closest('.moyu-input-number');
            countNum(box, 0);
            return false;
        });
    };

    $(document).ready(function(){
        var imgFile = $('#image-file');
        var thumbs = $('#img-thumb-list');
        var addBtn = thumbs.find('.add');
        var loading = function(){
            var html = '<li><div class="loading">'+ MOYU.svgTemp('loading') +'</div></li>';
            return html;
        };
        var uploadErr = function(){
            var html = '<li><div class="img-error"><i>!</i></div></li>';
            return html;
        };
        var itemTemp = function(url){
            var html = '<li data-value="'+ url +'"><a href="javascript:;"><div class="img-bg" style="background-image:url('+ url +');"></div></a><a href="javascript:;" class="remove">'+ MOYU.svgTemp('remove') +'</a></li>';
            return html;
        };
        var upload = function(){
            var me = $(this);
            var val = me.val();
            if(val.length > 0){
                //开始上传
                var $loading = $(loading);
                addBtn.before($loading);

                $.ajaxFileUpload({
                    url: '/h5/data/uploadimage.json',
                    secureuri: false,
                    fileElementId: 'image_file',
                    dataType: 'json',
                    success: function (data){

                        //检查是否存在相同的图片
                        var  url = data.data.url;
                        var old = thumbs.find('li[data-value="'+ url +'"]');
                        if(old[0]){
                            $loading.remove();
                            MOYU.alert('您已经上传了一张同样的图片！');
                            return false;
                        }
                        var item = itemTemp(url);
                        $loading.replaceWith(item);

                        //判断是否有5张图，有五张图隐藏上传按钮
                        if(thumbs.find('li:not(.add)').length >= 5){
                            addBtn.hide();
                        }
                    },
                    error: function (){
                        var err = $(uploadErr());
                        err.on('click', function(){
                            err.remove();
                        });
                        $loading.replaceWith(err);
                    }
                });
            }
            return false;
        };

        imgFile.on('change', upload);

        thumbs.on('click', function(){
            var me = $(this);
            me.closest('li').remove();
            if(thumbs.find('li:not(.add)').length < 5){
                addBtn.show();
            }
        });

        $('.js-upload-img').on('click', function(){
            imgFile.trigger('click');
            return false;
        });

        //数量的加减
        addNum();

        //提交数据
        $('#js-submit').on('click', function(){
            alert('提交');
            /*
            var data = {
                "order_goods_no":$("#order_goods_no").val(),
                "order_return_goods_num":$("#buy-num").val(),
                "order_return_detail":$("#return_detail").val(),
                "order_return_link_name":$("#name").val(),
                "order_return_link_mobile":$("#mobile").val(),
                "order_return_link_address":$("#address").val(),
                "order_return_goods_img_1":$("#img-thumb-list li").eq(0).attr("data-value"),
                "order_return_goods_img_2":$("#img-thumb-list li").eq(1).attr("data-value"),
                "order_return_goods_img_3":$("#img-thumb-list li").eq(2).attr("data-value"),
                "order_return_goods_img_4":$("#img-thumb-list li").eq(3).attr("data-value"),
                "order_return_goods_img_5":$("#img-thumb-list li").eq(4).attr("data-value")
        	};
            */
        });
    });

})(jQuery, window, document);
