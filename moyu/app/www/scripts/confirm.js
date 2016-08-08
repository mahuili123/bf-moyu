;(function($, window, document, undefined){
    'use strict';

    $(document).ready(function(){
        var addr = $('.js-addrs');
        var addrMore = $('.js-address-more');
        addr.address();

        $.subscribe('init.address del.address', function(){
            if(addr.find('li').length > 4){
                addrMore.show();
            } else {
                addrMore.hide();
            }
        });
        addrMore.on('click', 'a', function(){
            var me = $(this);
            var c = 'icon-address-more-c';
            var i = me.find('i');
            if(i.hasClass(c)){
                addr.height(176);
                i.removeClass(c);
            } else {
                addr.height('100%');
                i.addClass(c);
            }
        });


        //美化表单
        $('input.js-rewrite').moyuCR();

        //计算总价
        var countPrice = function(){
            var freightEle = $('#js-freight'); //运费
            var totalEle = $('#js-total'); //商品总价
            var payTotalEle = $('#js-pay-total'); //显示支付总价
            var couponTotalEle = $('#js-coupon-total'); //优惠券抵扣金额
            var yueTotalEle = $('#js-yue-total'); //余额抵扣金额
            var yueInputEle = $('#js-yue-num'); //余额
            var payTotal = 0; //支付总价

            var freight = Number(freightEle.html());
            var total = Number(totalEle.html());
            var couponTotal = 0; //优惠券抵扣总金额
            var yueTotal = yueInputEle.is(':checked') ? Number(yueInputEle.val()) : 0; //余额抵扣金额

            var products = $('#js-goods').find('tr'); //商品列表
            var coupons = $('#js-coupons').find('input:checked'); //使用优惠券

            var pids = []; //产品数据 { id: 产品id, price: 小计价格, ext: [{ id: 优惠券id, num: 减去金额 }] }
            var cids = []; //优惠券数据 { id: 优惠券id, total: 总金额, products: [可用产品id], ext: [{ id: 产品id, num: 减去金额 }] }

            if(coupons.length === 0){
                payTotal = freight + total;
            } else {
                //组织产品初始数据
                $.each(products, function(){
                    var me = $(this);
                    var id = me.attr('data-goodsid');
                    var itemTotal = Number(me.data('total'));
                    pids.push({
                        id: id,
                        price: itemTotal,
                        ext: []
                    });
                });

                //组织优惠券初始数据
                $.each(coupons, function(){
                    var me = $(this);
                    var id = me.val();
                    var itemTotal = Number(me.data('money'));
                    var goods = me.attr('data-goods');
                    var pList = goods.split(',');
                    cids.push({
                        id: id,
                        total: itemTotal,
                        products: pList,
                        ext: []
                    });
                });

                //优惠券减免
                var setCoupon = function(index, d){
                    var pid = d.id; //产品id
                    var price = d.price; //产品价格
                    $.each(cids, function(k){
                        var cd = cids[k];
                        var cPids = cd.products;
                        var cTotal = cd.total;
                        if($.inArray(pid, cPids) > -1 && cTotal > 0){ //可以使用该优惠券
                            var diff = price - cTotal;
                            if(diff < 0){ //该优惠券作用该产品还有结余
                                cids[k].total = -1 * diff; //修改优惠券的剩余金额
                                cids[k].ext.push({
                                    id: pid,
                                    num: price
                                });

                                pids[index].price = 0;
                                pids[index].ext.push({
                                    id: cd.id,
                                    num: price
                                });

                                couponTotal += price;
                            } else { //该产品完全使用这张优惠券
                                cids[k].total = 0;
                                cids[k].ext.push({
                                    id: pid,
                                    num: price
                                });

                                pids[index].price = diff;
                                pids[index].ext.push({
                                    id: cd.id,
                                    num: cTotal
                                });

                                couponTotal += cTotal;
                            }
                        }
                    });
                };
                $.each(pids, function(k){
                    var d = pids[k];
                    setCoupon(k, d);
                });

                payTotal = freight;
                $.each(pids, function(k){
                    var d = pids[k];
                    payTotal += d.price;
                });
            }

            payTotal = payTotal - yueTotal;
            payTotal = payTotal < 0 ? 0 : payTotal;

            payTotalEle.html(payTotal.toFixed(2));
            couponTotalEle.html(couponTotal.toFixed(2));
            yueTotalEle.html(yueTotal.toFixed(2));
        };

        //初始处理
        var pageInit = function(){
            var allCoupons = $('#js-coupons').find('input[name="coupon"]');
            var maxCoupon = 0;
            var maxCouponItem = null;
            $.each(allCoupons, function(){
                var me = $(this);
                var num = Number(me.data('money'));
                if(num > maxCoupon){
                    maxCoupon = num;
                    maxCouponItem = me;
                }
            });

            //选中最大可用金额
            if(maxCouponItem && maxCouponItem[0] && !maxCouponItem.is(':disabled')){
                maxCouponItem.prop('checked', true).trigger('change');
            }
            countPrice();

            //用余额
            $('#js-yue-num').on('change', function(){
                countPrice();
            });
        };

        //选择优惠券的事件
        $('#js-coupons').on('change', 'input', function(){
            countPrice();
        });

        //绑定优惠券
        var checkCoupon = function(goodids){
            var arr = goodids.split(',');
            var res = false;
            $.each(arr, function(k){
                var product = $('#js-goods').find('tr[data-goodsid="'+ arr[k] +'"]');
                if(product.length > 0){
                    res = true;
                    return false;
                }
            });
            return res;
        };
        var couponTemp = function(d){
            var disabled = checkCoupon(d.goods) ? '' : ' disabled';
            var html = '<li>'+
                '    <label>'+
                '        <input type="radio" name="coupon" value="'+ d.id +'" data-money="'+ d.money +'" data-goods="'+ d.goods +'" class="js-rewrite"'+ disabled +'>'+
                '        <span class="p20">全品大促券</span>'+
                '        <span class="p20">可优惠：'+ d.money +'</span>'+
                '    </label>'+
                '</li>';
            return html;
        };
        var getProductId = function(){
            var ids = [];
            var items = $('#js-goods tr');
            $.each(items, function(){
                ids.push($(this).data('goodsid'));
            });
            return ids.join(',');
        };
        var newCoupon = function(btn, couponCode){
            var input = btn.prev('input');
            var reset = function(){
                btn.prop('disabled', false).text('绑定优惠券');
                input.select();
            };
            btn.prop('disabled', true).text('处理中...');
            MOYU.ajax({
                url: ['GET', 'json', '/user/center/couponsubmit'],
                params: { coupon_code: couponCode, pids: getProductId() },
                succ: function(data){
                    var $html = $(couponTemp(data.data));
                    $('#js-coupons').find('ul').append($html);
                    $html.find('.js-rewrite').moyuCR();
                    MOYU.alert('优惠券码绑定成功！');
                    input.val('');
                    reset();
                },
                sys_error: reset,
                error: reset
            });
        };

        $('#js-new-coupon').on('click', function(){
            var me = $(this);
            var couponCode = me.prev('input').val();
            if(couponCode){
                newCoupon(me, couponCode);
            } else {
                MOYU.alert('请先输入优惠券码！');
            }
            return false;
        });


        //提交订单
        $('#js-confirm-submit').on('click', function(){
            var me = $(this);
            var addr = $('input[name="moyaddr_checked_input"]').val();
            var coupon = $('input[name="coupon"]:checked').val();
            var useYue = $('input[name="use_yue"]');
            var isUse = useYue.is(':checked') ? 1 : 2;
            var reset = function(){
                me.prop('disabled', false).text('提交订单');
            };
            coupon = coupon ? coupon : '';
            if(!addr){
                MOYU.alert('请选择收货地址！');
                return false;
            }
            me.prop('disabled', true).text('订单提交中...');
            MOYU.ajax({
                url: ['GET', 'json', '/user/order/confirmsubmit'],
                params: {
                    user_address_id: addr,
                    order_info_coupon_id: coupon,
                    is_use_red: isUse
                },
                succ: function(){
                    reset();
                    window.location.href = '/pay';
                },
                sys_error: reset,
                error: reset
            });
        });

        //开始初始化
        pageInit();
    });

})(jQuery, window, document);
