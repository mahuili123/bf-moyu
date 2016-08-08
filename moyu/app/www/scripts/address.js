;(function($, window, document, undefined){
    'use strict';
    var MoyuAddress = function(option){
        var self = this;
        var data = null;
        var defaultIndex = -1;
        var defaultId = '';
        var opts = {
            list: null,
            callback: function(){}
        };
        opts = $.extend(true, opts, {}, option || {});
        this.query = function(){
            var url = ['GET', 'json', '/user/center/myaddress'];
            MOYU.ajax({
                url: url,
                params: {},
                succ: function(data){
                    $.publish('getdata.address', [data.data]);
                }
            });
        };

        this.item = function(d){
            var checked = parseInt(d.user_address_link_default) === 2 ? ' class="checked"' : '';
            var isDefault = parseInt(d.user_address_link_default) === 2 ? '默认收货地址' : '<a href="javascript:;" class="set_default c-e73d4d" data-id="'+ d.user_address_id +'">设为默认地址</a>';
            var html = '<li data-id="'+ d.user_address_id +'"'+ checked +'>'+
                '    <h4 class="row">'+ d.user_address_link_name +'</h4>'+
                '    <span class="row">'+ d.user_address_link_mobile +'</span>'+
                '    <span class="row">'+ d.user_address_link_province_name +' '+ d.user_address_link_city_name +' '+ d.user_address_link_area_name +'</span>'+
                '    <span class="row">'+ d.user_address_link_detail +'</span>'+
                '    <div class="row action">'+
                '        <a href="javascript:;" class="edit c-e73d4d" data-id="'+ d.user_address_id +'">修改</a> <a href="javascript:;" class="del c-e73d4d" data-id="'+ d.user_address_id +'">删除</a>'+
                '        <span class="isdefault">'+ isDefault +'</span>'+
                '    </div>'+
                '    <i class="ok"></i>'+
                '</li>';
            return html;
        };

        this.getData = function(id){
            var res = null;
            id = parseInt(id);
            $.each(data, function(){
                var v = arguments[1];
                if(parseInt(v.user_address_id) === id){
                    res =  v;
                    return false;
                }
            });
            return res;
        };

        this.removeData = function(id){
            id = parseInt(id);
            $.each(data, function(k, v){
                if(parseInt(v.user_address_id) === id){
                    data.splice(k, 1);
                    var list = self.getList();
                    opts.list.find('ul').replaceWith(list);
                    return false;
                }
            });
            return data;
        };

        this.setDefault = function(id){
            id = parseInt(id);
            $.each(data, function(k, v){
                if(parseInt(v.user_address_id) === id){
                    var newData = $.extend(true, {} , {}, v || {});
                    newData.user_address_link_default = 2;
                    data.splice(k, 1);
                    data.unshift(newData);
                } else {
                    data[k].user_address_link_default = 1;
                }
            });
            var list = self.getList();
            opts.list.find('ul').replaceWith(list);
            return data;
        };

        this.getList = function(){
            var html = '';
            if(data){
                if(data.length < 8){
                    html = '<li class="add"><a href="javascript:;"><i></i>添加新地址</a></li>';
                }
                $.each(data, function(){
                    var v = arguments[1];
                    html += self.item(v);
                });
                html = '<ul>'+ html +'</ul>';
            }
            return html;
        };
        this.getDefauleId = function(){
            return defaultId;
        };

        this.addForm = function(type, d){
            var title = type === 'add' ? '新增' : '修改';
            var html = '<div class="moyu-add-address-box" id="js-moyu-add-address">'+
                    '    <div class="moyu-add-address">'+
                    '        <div class="title"><span>'+ title +'收货地址</span></div>'+
                    '        <div class="form">'+
                    '            <ul>'+
                    '                <li>'+
                    '                    <label>'+
                    '                        <span class="t">收货人姓名：</span>'+
                    '                        <input type="text" class="input" name="user_address_link_name">'+
                    '                        <input type="hidden" class="input" name="user_address_id">'+
                    '                        <input type="hidden" class="input" name="user_address_link_default">'+
                    '                    </label>'+
                    '                </li>'+
                    '                <li>'+
                    '                    <label>'+
                    '                        <span class="t">手机号：</span>'+
                    '                        <input type="text" class="input" name="user_address_link_mobile">'+
                    '                    </label>'+
                    '                </li>'+
                    '                <li class="china-addr-item">'+
                    '                </li>'+
                    '                <li>'+
                    '                    <label>'+
                    '                        <span class="t">详细地址：</span>'+
                    '                        <input type="text" class="input" name="user_address_link_detail">'+
                    '                    </label>'+
                    '                </li>'+
                    '                <li>'+
                    '                    <label>'+
                    '                        <span class="t">邮政编码：</span>'+
                    '                        <input type="text" class="input" name="user_address_link_code">'+
                    '                    </label>'+
                    '                </li>'+
                    '                <li>'+
                    '                    <label>'+
                    '                        <span class="t">标签，如家、公司、父母家：</span>'+
                    '                        <input type="text" class="input" name="user_address_link_tag">'+
                    '                    </label>'+
                    '                </li>'+
                    '                <li class="btns">'+
                    '                    <button type="button" class="ok">保存</button>'+
                    '                    <button type="button" class="canncel">取消</button>'+
                    '                </li>'+
                    '            </ul>'+
                    '        </div>'+
                    '    </div>'+
                    '</div>';
            var $html = $(html);
            var fd = {
                user_address_id: '',
                user_address_link_name: '',
                user_address_link_mobile: '',
                user_address_link_province_id: '',
                user_address_link_province_name: '',
                user_address_link_city_id: '',
                user_address_link_city_name: '',
                user_address_link_area_id: '',
                user_address_link_area_name: '',
                user_address_link_detail: '',
                user_address_link_code: '',
                user_address_link_tag: '',
                user_address_link_default: '1'//1常规，2默认
            };
            fd = $.extend(true, fd, {}, d || {});
            $.each(fd, function(k, v){
                var f = v ? v : '';
                var input = $html.find('[name="'+ k +'"]');
                if(input[0]){
                    input.val(f);
                    if(f){
                        input.prev('.t').hide();
                    }
                }
            });
            if(type === 'add'){
                $html.find('.china-addr-item').html(MOYU.chinaAddr.init());
            } else { //编辑赋值
                if(d){
                    $html.find('.china-addr-item').html(MOYU.chinaAddr.init({
                        province: {
                            id: d.user_address_link_province_id,
                            name: d.user_address_link_province_name
                        },
                        city: {
                            id: d.user_address_link_city_id,
                            name: d.user_address_link_city_name
                        },
                        area: {
                            id: d.user_address_link_area_id,
                            name: d.user_address_link_area_name
                        }
                    }));
                }
            }
            $html.find('.input').on('focus', function(){
                var li = $(this).closest('li');
                var t = li.children('label').children('.t');
                if(!t.is(':hidden')){
                    t.animate({
                        top: 0
                    }, 100, 'easeInOutExpo');
                }
                li.addClass('focus');
            }).on('blur', function(){
                var li = $(this).closest('li');
                var t = li.children('label').children('.t');
                if($(this).val() === '' && !t.is(':hidden')){
                    t.animate({
                        top: 25
                    }, 100, 'easeInOutExpo');
                }
                li.removeClass('focus');
            });
            $html.find('.canncel').on('click', function(){
               $html.remove();
            });
            $html.find('.ok').on('click', function(){
                var formArr = $html.find(':input').serializeArray();
                var postData = {};
                var pca = ['province_id', 'province_name', 'city_id', 'city_name', 'area_id', 'area_name'];
                $.each(formArr, function(){
                    var v = arguments[1];
                    if($.inArray(v.name, pca) > -1){
                        postData['user_address_link_'+ v.name] = v.value;
                    } else {
                        postData[v.name] = v.value;
                    }
                });
                MOYU.ajax({
                    url: ['GET', 'json', '/www/data/succ.json'],
                    params: postData,
                    succ: function(respone){
                        postData.user_address_id = respone.data;
                        if(defaultIndex === 0){
                            data.splice(1, 0, postData);
                        } else {
                            data.unshift(postData);
                        }
                        var list = self.getList();
                        opts.list.find('ul').replaceWith(list);
                        $html.remove();
                    }
                });
            });

            $html.height($(document).height());

            $('body').append($html);
        };

        $.subscribe('getdata.address', function(){
            var d = arguments[1];
            data = [];

            //把默认地址放在第一个
            $.each(d, function(){
                var v = arguments[1];
                if(parseInt(v.user_address_link_default) === 2){
                    data.unshift(v);
                    defaultIndex = 0;
                    defaultId = v.user_address_id;
                } else {
                    data.push(v);
                }
            });

            if(opts.callback && $.isFunction(opts.callback)){
                opts.callback(data);
            }
        });
    };
    $.fn.address = function(){
        var objs = this;
        var moyuAddress = new MoyuAddress({
            list: objs,
            callback: function(){
                var html = moyuAddress.getList();
                $.each(objs, function(){
                    var me = $(this);
                    me.addClass('js-moyu-addrs').html(html);
                    me.on('click', 'li.add', function(){
                        moyuAddress.addForm('add');
                        return false;
                    });
                    me.on('click', '.edit', function(){
                        var id = $(this).data('id');
                        var d = moyuAddress.getData(id);
                        moyuAddress.addForm('edit', d);
                        return false;
                    });
                    me.on('click', '.del', function(){
                        var id = $(this).data('id');
                        MOYU.ajax({
                            url: ['GET', 'json', '/www/data/succ.json'],
                            params: {id: id},
                            succ: function(){
                                moyuAddress.removeData(id);
                            }
                        });
                        $.publish('del.address');
                        return false;
                    });
                    me.on('click', '.set_default', function(){
                        var id = $(this).data('id');
                        MOYU.ajax({
                            url: ['GET', 'json', '/www/data/succ.json'],
                            params: {id: id},
                            succ: function(){
                                moyuAddress.setDefault(id);
                            }
                        });
                        return false;
                    });
                    if(me.data('canchecked')){
                        var inputName = me.data('canchecked');
                        var defaultId = moyuAddress.getDefauleId();
                        defaultId = defaultId ? defaultId : '';
                        me.append('<input type="hidden" name="'+ inputName +'" value="'+ defaultId +'">');
                        me.on('click', 'li:not(.add)', function(){
                            var id = $(this).data('id');
                            me.find('input[name="'+ inputName +'"]').val(id);
                            $(this).addClass('checked').siblings().removeClass('checked');
                            return false;
                        });
                    } else {
                        me.find('.checked').removeClass('checked');
                    }
                    $.publish('init.address');
                });
            }
        });
        moyuAddress.query();
    };

})(jQuery, window, document);
