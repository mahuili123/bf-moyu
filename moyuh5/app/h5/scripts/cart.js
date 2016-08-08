;(function($, window, document, undefined){
    'use strict';
    var data = [];
    var addNum = function(){
        //加减数量
        var err = function(text){
            var html = '<div class="js-stock-tips c-e73d4d">'+ text +'</div>';
            return html;
        };
        var countNum = function(box, type){
            if(box.hasClass('disabled')){
                return false;
            }

            var input = box.find('input');
            var id = box.closest('li').data('id');
            var minVal = parseInt(box.data('min'));
            var maxVal = parseInt(box.data('max'));
            var val = parseInt(input.val());
            var to = 0;
            var errMsg = input.data('mgs');
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
            removeErr();
            val = val ? val : 1;
            to = val + type;
            if(to < minVal){
                to = minVal;
            } else if(to > maxVal){
                to = maxVal;
                //显示错误
                showErr(errMsg);
            }
            input.val(to);
            $.publish('change.cart', {
                type: 'num',
                id: id,
                num: to
            });
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
    var cartInit = function(){
        var listTemp = function(index, d){
            var num = parseInt(d.num);
            var maxNum = parseInt(d.max_num);
            var disabled = (num === 0 || maxNum === 0) ? ' disabled' : '';
            var checked = parseInt(d.checked) === 1 ? ' checked' : '';
            var outer = (num === 0 || maxNum === 0) ? '<div class="js-stock-tips c-ff3333">'+ d.error_msg +'</div>' : '';
            var dHtml = (num === 0 || maxNum === 0) ? '<div class="disabled-mark"><span>失效</span></div>' : '';
            var html = '<li class="row'+ disabled +'" data-id="'+ d.id +'" data-index="'+ index +'">'+
                '    <div class="cart-checkbox">'+
                '        <label><input type="checkbox" class="js-rewrite js-item-checked"'+ disabled + checked +'></label>'+
                '    </div>'+
                '    <div class="img img180180">'+
                '        <a href="'+ d.product.url +'"><img src="'+ d.product.image +'"></a>'+ dHtml +
                '    </div>'+
                '    <div class="item-right">'+
                '        <div class="info row">'+
                '            <a href="'+ d.product.url +'" class="f-14">'+ d.product.name +'</a>'+
                '            <p class="c-999 f-12">'+ d.product.info +'</p>'+
                '        </div>'+
                '        <div class="action row">'+
                '            <span class="price c-ff3333">¥<span class=" class="js-item-total">'+ d.total +'</span></span>'+
                '            <div class="number">'+
                '                <div class="moyu-input-number '+ disabled +'" data-min="'+ d.min_num +'" data-max="'+ d.max_num +'">'+
                '                    <a href="javascript:;" class="cut">-</a>'+
                '                    <input type="number" value="'+ d.num +'"'+ disabled +' data-mgs="'+ d.error_msg +'">'+
                '                    <a href="javascript:;" class="add">+</a>'+
                '                </div>'+ outer +
                '            </div>'+
                '            <a herf="javascript:;" class="del js-del">'+
                '                '+ MOYU.svgTemp('del') +
                '            </a>'+
                '        </div>'+
                '    </div>'+
                '</li>';
            return html;
        };
        var html = '';
        var box = $('#js-cart-list');
        var totalNum = $('#js-total-num');
        var totalPrice = $('#js-total-price');
        var getDataIndex = function(id){
            var index = null;
            $.each(data, function(k, v){
                if(parseInt(v.id) === parseInt(id)){
                    index = k;
                    return false;
                }
            });
            return index;
        };
        var countPrice = function(){
            var total = 0;
            $.each(data, function(k, v){
                if(parseInt(v.checked) === 1){
                    total += Number(v.total);
                }
            });
            totalPrice.text(total.toFixed(2));
        };
        var countChecked = function(){
            var total = 0;
            $.each(data, function(k, v){
                if(parseInt(v.checked) === 1){
                    total += 1;
                }
            });
            totalNum.text(total);
        };
        var isCheckall = 0;

        data = $.extend(true, [], [], $CONFIG.data || []);
        $.each(data, function(k, v){
            html += listTemp(k, v);
            if(parseInt(v.checked) === 1){
                isCheckall += 1;
            }
        });
        box.html(html);

        //checkbox美化
        $('input.js-rewrite').moyuCR();
        if(isCheckall === data.length){
            $('.check-all').moyuCR('setChecked', true);
        }
        countChecked();
        countPrice();
        addNum();

        $('body').on('change', '.js-item-checked', function(){
            var me = $(this);
            var id = me.closest('li').data('id');
            var checked = me.is(':checked') ? 1 : 0;
            var items = $('.js-item-checked:not(:disabled)');
            var all = $('.check-all');
            if(items.not(':checked').length === 0){
                all.moyuCR('setChecked', true);
            } else {
                all.moyuCR('setChecked', false);
            }
            $.publish('change.cart', {
                type: 'checked',
                id: id,
                checked: checked
            });
        });

        //全选
        $('body').on('change', '.check-all', function(){
            var me = $(this);
            var items = $('.js-item-checked').not(':disabled');
            var checked = me.is(':checked') ? 1 : 0;
            items.moyuCR('setChecked', me.is(':checked'));
            $.publish('change.cart', {
                type: 'checkAll',
                checked: checked
            });
        });

        //删除
        $('body').on('click', '.js-del', function(){
            var me = $(this);
            var id = me.closest('li').data('id');
            var dialog = null;
            var reset = function(){
                me.removeClass('posting');
            };
            var removeReal = function(){
                dialog.hide();
                MOYU.ajax({
                    url: $CONFIG.urls.delete,
                    params: {goods_id: id},
                    succ: function(){
                        $.publish('change.cart', {
                            type: 'delete',
                            id: id
                        });
                        reset();
                    },
                    sys_error: reset,
                    error: reset
                });
            };
            if(me.hasClass('posting')){
                return false;
            }
            me.addClass('posting');
            dialog = new MOYU.sysinfo({
                msg: '确认删除商品？',
                buttons: [{
                    text: '删除',
                    ex_class: 'ok',
                    func: function(){
                        removeReal();
                    }
                }, {
                    text: '取消',
                    ex_class: 'canncel',
                    func: function(){
                        reset();
                        dialog.hide();
                    }
                }]
            });
            dialog.show();
            return false;
        });

        //订阅页面变化
        $.subscribe('change.cart', function(){
            var d = arguments[1];
            var index = getDataIndex(d.id);
            if(d.type === 'num'){
                if(typeof(index) !== 'undefined'){
                    data[index].num = d.num;
                    data[index].total = parseInt(d.num) * Number(data[index].price);
                    box.find('li[data-id="'+ d.id +'"]').find('.js-item-total').text(data[index].total);
                    countPrice();
                }
            } else if(d.type === 'checked'){
                if(typeof(index) !== 'undefined'){
                    data[index].checked = d.checked; //1选中 0不选中
                    countChecked();
                    countPrice();
                }
            } else if(d.type === 'checkAll'){
                $.each(data, function(k){
                    var dd = data[k];
                    if(parseInt(dd.max_num) > 0){
                        data[k].checked = d.checked;
                    }
                });
                countChecked();
                countPrice();
            } else if(d.type === 'delete'){
                data.splice(index, 1);
                box.find('li[data-id="'+ d.id +'"]').remove();
                countChecked();
                countPrice();
                if(data.length === 0){
                    window.location.reload(true);
                }
            }
        });

        //检查是否能提交数据
        var checkPostData = function(){
            var arr = [];
            $.each(data, function(){
                var v = arguments[1];
                if(parseInt(v.checked) === 1){
                    arr.push(v.id +':'+ v.num);
                }
            });
            if(arr.length > 0){
                return { buy_goods_list: arr.join(',')};
            } else {
                MOYU.alert('请选择需要购买的商品！');
                return false;
            }
        };
        var save = function(){
            var me = $(this);
            var reset = function(){
                me.text('去结算').prop('disabled', false);
            };
            var sysError = function(res){
                MOYU.flashInfo({
                    msg: res.msg
                });
                reset();
            };

            var params = checkPostData();
            if(params === false){
                return false;
            }
            me.text('订单提交中...').prop('disabled', true);
            MOYU.ajax({
                url: $CONFIG.urls.check_order,
                params: params,
                succ: function(res){
                    window.location.href = res.data;
                },
                sys_type: false,
                sys_error: sysError,
                error: reset
            });
        };
        $('#js-pay').on('click', save);
    };

    $(document).ready(function(){

        if(typeof($CONFIG) === 'undefined'){
            return false;
        }
        cartInit();
    });

})(jQuery, window, document);
