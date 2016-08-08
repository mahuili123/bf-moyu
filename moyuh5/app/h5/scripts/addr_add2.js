;(function($,window,document,undefined){
    'use strict';
    var init=function(){
        var addBox=$('.address-box');
        var backLink=addBox.find('.back');
        var title=addBox.find('.address-title');
        var province=addBox.find('.province');
        var city=addBox.find('.city');
        var area=addBox.find('.area');
        var provinceData=MOYU.chinaAddr.getDataList();
        var cityData=[];
        var areaData=[];
        var item=function(d){
            var html='<li data-id="'+ d.id+'">'+ d.name+'</li>';
            return html;
        };
        var itemTemp=function(d){
            var html='';
            $.each(d,function(){
                var td=arguments[1];
                html += item(td);
            });
            return html;
        };
        var provinceHtml=itemTemp(provinceData);
        var cityHtml='';
        var areaHtml='';
        var result=[];
        var stepText=['province','city','area'];
        var step=0;
        var changeStep=function(){
            var text=stepText[step];
            if(step>0){
                backLink.show();
            }else{
                backLink.hide();
            }
            title.text('请选择'+MOYU.chinaAddr.default[text]);
            if(step===0){
                province.animate({
                 left:'0'
                },300);
                city.animate({
                    left:'100%'
                },300);
                area.animate({
                    left:'200%'
                },300);
            }else if(step===1){
                province.animate({
                    left:'-100%'
                },300);
                city.animate({
                    left:'0'
                },300);
                area.animate({
                    left:'100%'
                },300);
            }else if(step===2){
                province.animate({
                    left:'-200%'
                },300);
                city.animate({
                    left:'-100%'
                },300);
                area.animate({
                    left:'0'
                },300);
            }
        };
        var addressShowInput=$('input[name="add_addresss"]');
        var setAddressData=function(type){
            var provinceId=$('input[name="add_province_id"]');
            var provinceName=$('input[name="add_province_name"]');
            var cityId=$('input[name="add_city_id"]');
            var cityName=$('input[name="add_city_name"]');
            var areaId=$('input[name="add_area_id"]');
            var areaName=$('input[name="add_area_name"]');
            if(type==='get'){
                return [provinceId.val(),cityId.val(),areaId.val()];
            }else{
                provinceId.val(result[0].id);
                provinceName.val(result[0].name);
                cityId.val(result[1].id);
                cityName.val(result[1].name);
                areaId.val(result[2].id);
                areaName.val(result[2].name);
            }
        };
    //选择省
        province.on('click','li',function(){
            var me=$(this);
            var id=me.data('id');
            var name=me.text();
            result[0]={id:id,name:name};
            step=1;
            changeStep();
            cityData=MOYU.chinaAddr.getDataList(id);
            cityHtml=itemTemp(cityData);
            city.html(cityHtml);
        });
    //选择市
        city.on('click','li',function(){
            var me=$(this);
            var id=me.data('id');
            var name=me.text();
            result[1]={id:id,name:name};
            step=2;
            changeStep();
            areaData=MOYU.chinaAddr.getDataList(result[0].id,id);
            areaHtml=itemTemp(areaData);
            area.html(areaHtml);
        });
    //选择区
        area.on('click','li',function(){
            var me=$(this);
            var id=me.data('id');
            var name=me.text();
            result[2]={id:id,name:name};
            step=0;
            addBox.hide();
            changeStep();
            var text='';
            $.each(result,function(){
                var t=arguments[1];
                text+= t.name;
                addressShowInput.val(text);
            });
            setAddressData();
        });









        province.find('ul').html(provinceHtml);
        addBox.on('click','.close',function(){
            step=0;
            addBox.hide();
            changeStep();
        });
        $('.js-address-link').on('click',function(){
            addBox.show();
        });
    };
    $(document).ready(init());
})(jQuery,window,document);
