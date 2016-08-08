;(function($, window, document, undefined){
    'use strict';
    
    //购买区域
    var MyProduct = function(){

        if(typeof($CONFIG) === 'undefined' || !$CONFIG || !$CONFIG.products || $CONFIG.products.length === 0){
            return false;
        }

        var self = this;
        var pos = $('#js-dim-position');
        var addCart = $('#js-add-cart');
        var showPrice = $('#js-product-price');
        var box = $('#js-buy-area');
        var buyNum = $('#js-my-input-number');
        var parms = $.extend(true, [], [], $CONFIG.parms || []);
        var products = $.extend(true, [], [], $CONFIG.products || []);
        var data = $.extend(true, [], [], parms);
        var usable = {}; //map
        var checkProduct = null; //选中的产品

        //查询维度id 是否在当前sku中
        this.checkIdin = function(pid, sid, arr){
            var res = false;
            $.each(arr, function(){
                var v1 = arguments[1];
                if(parseInt(sid) === parseInt(v1.sid) && parseInt(pid) === parseInt(v1.pid)){
                    res = true;
                    return false;
                }
            });
            return res;
        };

        //重新组织一份数据方便查找
        this.merge = function(){
            var getProduct = function(pid, sid){
                var res = [];
                $.each(products, function(){
                    var arr = arguments[1];
                    var isIn = self.checkIdin(pid, sid, arr.parms);
                    if(isIn === true){
                        res.push(arr);
                    }
                });
                return res;
            };
            var setProduct = function(index){
                var d = data[index];
                var pid = d.id;
                $.each(d.list, function(k, v){
                    var product = getProduct(pid, v.id);
                    data[index].list[k].product = product;
                });
            };
            $.each(data, function(k){
                setProduct(k);
            });
        };
        this.setUuid = function(v){
            var res = '';
            $.each(v, function(k){
                var sp = k === 0 ? '' : '|||';
                res += (sp + v[k].pid +'|'+ v[k].sid);
            });
            return res;
        };

        //剔除库存为0的数据
        this.rmZero = function(){
            $.each(products, function(){
                var v = arguments[1];
                var u = self.setUuid(v.parms);
                v.uuid = u;
                if(parseInt(v.stock) > 0){
                    usable[u] = v;
                }
            });
        };

        //查找单个维度的库存以及价格区间
        this.getSingalSkuInfo = function(pindex, sindex){
            var d = data[pindex].list[sindex].product;
            var minPrice = -1;
            var maxPrice = -1;
            var total = 0;
            $.each(d, function(){
                var sd = arguments[1];
                var price = Number(sd.price);
                var stock = Number(sd.stock);

                if(maxPrice > -1){
                    if(price > maxPrice){
                        maxPrice = price;
                    }
                } else {
                    maxPrice = price;
                }

                if(minPrice > -1){
                    if(price < minPrice){
                        minPrice = price;
                    }
                } else {
                    minPrice = price;
                }
                total += stock;
            });
            return [minPrice, maxPrice, total];
        };
        this.item = function(d){
            var checked = Number(d.checked) === 0 ? 'checked' : '';
            var disabled = Number(d.disabled) === 0 ? 'disabled' : '';
            var html = '<li class="js-dim-item '+ checked +' '+ disabled +'" data-id="'+ d.id +'" data-pid="'+ d.pid +'" data-min="'+ d.minPrice +'" data-max="'+ d.maxPrice +'" data-pindex="'+ d.pindex +'" data-index="'+ d.index +'"><a href="javascript:;">'+ d.name +'<i>'+ MOYU.svgTemp('ok') +'</i></a></li>';
            return html;
        };
        this.temp = function(){
            var html = '';
            var getItems = function(pindex){
                var res = '';
                var d = data[pindex].list;
                $.each(d, function(k){
                    var v = $.extend(true, {}, {}, d[k] || {});
                    var skuInfo = self.getSingalSkuInfo(pindex, k);
                    v.pid = data[pindex].id;
                    v.minPrice = skuInfo[0];
                    v.maxPrice = skuInfo[1];
                    v.disabled = skuInfo[2];
                    v.checked = 1;
                    v.pindex = pindex;
                    v.index = k;
                    res += self.item(v);
                });
                return res;
            };
            $.each(data, function(k){
                var d = parms[k];
                var sub = getItems(k);
                html += '<li class="row item-param js-row-'+ d.id +'">'+
                    '    <label class="label">选择'+ d.name +'</label>'+
                    '    <div class="form">'+
                    '        <ul class="dim">'+ sub +
                    '        </ul>'+
                    '    </div>'+
                    '</li>';
            });
            return html;
        };
        this.checkIsDisabled = function(d){
            var res = false;
            var a = [];
            var minPrice = -1; //最低价格
            var chIn = function(key, ta){
                var r = [];
                for(var i=0; i<ta.length; i++){
                    if(key.indexOf(ta[i]) > -1){
                        r.push(true);
                    }
                }
                return r.length === ta.length ? true : false;
            };
            $.each(d, function(){
                var td = arguments[1];
                var ch = self.setUuid([td]);
                a.push(ch);
            });
            $.each(usable, function(k, v){
                var r = chIn(k, a);
                if(r === true){
                    var p = Number(v.price);
                    if(minPrice === -1){
                        minPrice = p;
                    } else {
                        if(minPrice > p){
                            minPrice = p;
                        }
                    }
                    res = true;
                    return false;
                }
            });
            return [res, minPrice];
        };
        this.setLiClass = function(d, r){
            for(var i=0; i<d.length; i++){
                var li = box.find('li[data-pid="'+ d[i].pid +'"][data-id="'+  d[i].sid +'"]');
                if(li[0] && !li.hasClass('checked')){
                    if(r){
                        li.removeClass('disabled');
                    } else {
                        li.addClass('disabled');
                    }
                }
            }
        };

        //点击操作是处理
        this.action = function(){
            var items = box.find('li.checked');
            var cArray = []; //选中的行
            var ucArray = []; //没有选中行
            var rightArr = [];
            var mixArr = [];
            var setFormat = function(k){
                var d = parms[k];
                var pid = d.id;
                $.each(d.list, function(k1, v1){
                    rightArr.push({
                        pid: pid,
                        sid: v1.id,
                        pindex: k,
                        index: k1
                    });
                });
            };
            var minPrice = -1;

            for(var i=0; i<parms.length; i++){
                ucArray.push(i);
            }

            $.each(items, function(){
                var me = $(this);
                var pindex = Number(me.data('pindex'));
                var pid = Number(me.data('pid'));
                var id = Number(me.data('id'));
                var ucIndex = $.inArray(pindex, ucArray);
                cArray.push({
                    pid: pid,
                    sid: id
                });
                if(ucIndex > -1){
                    ucArray.splice(ucIndex, 1);
                }
            });

            if(ucArray.length === 0){ //可以确定一个产品
                checkProduct = usable[self.setUuid(cArray)];
                showPrice.text(checkProduct.price +'元');
            } else {
                checkProduct = null;

                //将没有选中的部分变一维数组
                $.each(ucArray, function(k){
                    setFormat(ucArray[k]);
                });

                //组织新的合并数组 rightArr * cArray
                $.each(rightArr, function(){
                    var arr = $.extend(true, [], [], cArray || []);
                    arr.push(arguments[1]);
                    mixArr.push(arr);
                });
                //把可用的还原，不可用的禁用
                $.each(mixArr, function(){
                    var d = arguments[1];
                    var res = self.checkIsDisabled(d);
                    self.setLiClass(d, res[0]);
                    if(minPrice === -1){
                        minPrice = res[1];
                    } else {
                        if(res[1] !== -1 && minPrice > res[1]){
                            minPrice = res[1];
                        }
                    }
                });
                if(minPrice !== -1){
                    showPrice.text(minPrice +'元起');
                }
            }
        };

        //显示错误
        this.showErr = function(obj, text){
            var html = $('<span class="detail-error">'+ text +'</span>');
            var next = obj.next('.detail-error');
            if(next[0]){
                next.remove();
            }
            obj.after(html);
        };
        //隐藏错误
        this.hideErr = function(){
            var err = box.find('.detail-error');
            err.remove();
        };

        //验证是否是一个SKU
        this.verify = function(){
            var res = [];
            var errText = [];
            if(checkProduct){
                res = [true, checkProduct];
            } else {
                res[0] = false;
                res[1] = '请先选择';
                $.each(parms, function(){
                    var d = arguments[1];
                    var li = box.find('li.checked[data-pid="'+ d.id +'"]');
                    if(li.length === 0){
                        errText.push(d.name);
                    }
                });
                if(errText.length > 2){
                    for(var i=0; i<errText.length; i++){
                        var sp = '、';
                        if(i === 0){
                            sp = '';
                        } else if(i === (errText.length - 1)){
                            sp = '和';
                        }
                        res[1] += (sp + errText[i]);
                    }
                } else {
                    res[1] += errText.join('和');
                }
            }
            return res;
        };

        this.init = function(){
            self.merge();
            self.rmZero();
            var html = self.temp();
            pos.before(html);


            $('.js-dim-item').on('click', function(){
                var me = $(this);
                if(me.hasClass('disabled')){
                    return false;
                }
                if(me.hasClass('checked')){
                    me.removeClass('checked');
                } else {
                    me.addClass('checked').siblings('li').removeClass('checked');
                }
                self.hideErr();
                self.action();
            });

            addCart.on('click', function(){
                var res = self.verify();
                if(res[0] === true){
                    //加入购物车
                } else {
                    MOYU.alert(res[1]);
                    //self.showErr($(this), res[1]);
                }
                return false;
            });

            //加减数量
            var countNum = function(type){
                var res = self.verify();
                var input = buyNum.find('input');
                var val = parseInt(input.val());
                var stock = 0;
                var to = 0;
                if(res[0] === true){
                    if(val){
                        stock = parseInt(res[1].stock);
                        to = val + type;
                        if(to < 1){
                            to = 1;
                        } else if(to > stock){
                            to = stock;
                            self.showErr(buyNum, '最多只能购买'+ stock +'个商品');
                            setTimeout(function(){
                                buyNum.next('.detail-error').remove();
                            }, 1000);
                        }
                    } else {
                        to = 1;
                    }
                    input.val(to);
                } else {
                    input.val(1);
                    self.showErr(buyNum, res[1]);
                }
                return false;
            };
            buyNum.on('click', '.cut', function(){
                countNum(-1);
                return false;
            });
            buyNum.on('click', '.add', function(){
                countNum(1);
                return false;
            });
            buyNum.on('change', 'input', function(){
                countNum(0);
                return false;
            });
            
            //维度过多时一行显示
            var items = box.find('.form');
            var getItemWidth = function(obj){
                var res = 0;
                $.each(obj.find('li'), function(){
                    res += ($(this).outerWidth() + 10);    
                });
                return res;
            };
            $.each(items, function(){
                var me = $(this);
                var hammer = new Hammer(me[0], {
                    domEvents: true
                });
                var width = getItemWidth(me);
                var maxLeft = 6;
                var minLeft = me.width() - width;
                var ul = me.find('ul');
                var left = 0;
                if(minLeft < 0){
                    ul.width(width);
                    me.on('panstart', function(){
                        left = parseInt(ul.css('left').replace('px', ''));     
                    });
                    me.on('pan', function(event){
                        var delta = left + event.originalEvent.gesture.deltaX; 
                        if (delta >= minLeft && delta <= maxLeft) {
                            ul.css({
                                left: left + event.originalEvent.gesture.deltaX
                            }); 
                        }
                    });
                }
            });
            
        };
    };
    var myPro = new MyProduct();
    
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
        
        if(typeof($CONFIG) !== 'undefined' && $CONFIG && $CONFIG.products && $CONFIG.products.length > 0){
            myPro.init();
        }
    });
})(jQuery, window, document);