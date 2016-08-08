;(function($, window, document, undefined){
    'use strict';

    var init = function(){
        var addrBox = $('.china-addr-box');
        var backLink = addrBox.find('.back');
        var title = addrBox.find('.title');
        var province = addrBox.find('.province');
        var city = addrBox.find('.city');
        var area = addrBox.find('.area');
        var pData = MOYU.chinaAddr.getDataList();
        var cData = [];
        var aData = [];
        var item = function(d){
            var html = '<li data-id="'+ d.id +'">'+ d.name +'</li>';
            return html;
        };
        var forItems = function(d){
            var html = '';
            $.each(d, function(){
                var td = arguments[1];
                html += item(td);
            });
            return html;
        };
        var phtml = forItems(pData);
        var chtml = '';
        var ahtml = '';
        var result = [];
        var stepText = ['province', 'city', 'area'];
        var step = 0;
        var changeStep = function(){
            var text = stepText[step];
            if(step > 0){
                backLink.show();
            } else {
                backLink.hide();
            }
            title.text('请选择'+ MOYU.chinaAddr.default[text]);
            if(step === 0){
                province.animate({
                    left: '0'
                }, 300);
                city.animate({
                    left: '100%'
                }, 300);
                area.animate({
                    left: '200%'
                }, 300);
            } else if(step === 1){
                province.animate({
                    left: '-100%'
                }, 300);
                city.animate({
                    left: '0'
                }, 300);
                area.animate({
                    left: '100%'
                }, 300);
            } else if(step === 2){
                province.animate({
                    left: '-200%'
                }, 300);
                city.animate({
                    left: '-100%'
                }, 300);
                area.animate({
                    left: '0'
                }, 300);
            }
        };
        var addrShowInput = $('input[name="addr_link"]');
        var setData = function(type){
            var pid = $('input[name="user_address_link_province_id"]');
            var pname = $('input[name="user_address_link_province_name"]');
            var cid = $('input[name="user_address_link_city_id"]');
            var cname = $('input[name="user_address_link_city_name"]');
            var aid = $('input[name="user_address_link_area_id"]');
            var aname = $('input[name="user_address_link_area_name"]');
            if(type === 'get'){
                return [pid.val(), cid.val(), aid.val()];
            } else {
                pid.val(result[0].id);
                pname.val(result[0].name);
                cid.val(result[1].id);
                cname.val(result[1].name);
                aid.val(result[2].id);
                aname.val(result[2].name);
            }
        };

        addrBox.on('click', '.close', function(){
            step = 0;
            addrBox.hide();
            changeStep();
        });
        $('.china-addr-link').on('click', function(){
            addrBox.show();
        });
        province.find('ul').html(phtml);

        //初始选中

        //选择省
        province.on('click', 'li', function(){
            var me = $(this);
            var id = me.data('id');
            var name = me.text();
            result[0] = { id: id, name: name };
            step = 1;
            changeStep();
            cData = MOYU.chinaAddr.getDataList(id);
            chtml = forItems(cData);
            city.html(chtml);
        });

        //选择事
        city.on('click', 'li', function(){
            var me = $(this);
            var id = me.data('id');
            var name = me.text();
            result[1] = { id: id, name: name };
            step = 2;
            changeStep();
            aData = MOYU.chinaAddr.getDataList(result[0].id, id);
            ahtml = forItems(aData);
            area.html(ahtml);
        });

        //选择地区
        area.on('click', 'li', function(){
            var me = $(this);
            var id = me.data('id');
            var name = me.text();
            result[2] = { id: id, name: name };
            step = 0;
            addrBox.hide();
            changeStep();

            var text = '';
            $.each(result, function(){
                var d = arguments[1];
                text += d.name +' ';
            });
            addrShowInput.val(text);
            setData();
        });

        backLink.on('click', function(){
            step --;
            if(step < 0){
                step = 0;
            }
            changeStep();
        });

        //保存并使用
        $('#js-submit').on('click', function(){
            alert('save');
        });
    };
    $(document).ready(init);
})(jQuery, window, document);
