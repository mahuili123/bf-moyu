;(function($,window,document,undefined){
    'use strict';
    var init=function(){
        var addBox=$('.address-box');
        var backLink=addBox.find('.back');
        var province=addBox.find('.province');
        var city=addBox.find('.city');
        var area=addBox.find('.area');
        var title=addBox.find('.address-title');
        var pData=MOYU.addr.getDataList();
        var cData=[];
        var aData=[];
        var itemTemp=function(d){
            var html='';
            $.each(d,function(k,v){
                html+='<li data-id="'+ v.id+'">'+ v.name+'</li>'
            });
            return html;
        };
        var pHtml=itemTemp(pData);
        var cHtml='';
        var aHtml='';
        var step=0;
        var result=[];
        var stepText=['province','city','area'];
        var addrShowInput=$('input[name="add_addresss"]');
        var setData=function(type){
            var provinceId=$('input[name="add_province_id"]');
            var provinceName=$('input[name="add_province_name"]');
            var cityId=$('input[name="add_city_id"]');
            var cityName=$('input[name="add_city_name"]');
            var areaId=$('input[name="add_area_id"]');
            var areaName=$('input[name="add_area_name"]');
            if(type==='get'){
                return [provinceId.val(),cityId.val(),areaId.val()]
            }else{
                provinceId.val(result[0].id);
                provinceName.val(result[0].name);
                cityId.val(result[1].id);
                cityName.val(result[1].name);
                areaId.val(result[0].id);
                areaName.val(result[0].name);
            }
        };
        var changeStep=function(){
            var text=stepText[step];
            title.text('请选择'+MOYU.addr.default[text]);
            if(step>0){
                backLink.show();
            }else{
                backLink.hide();
            }
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
        province.find('ul').html(pHtml);
    //选择省
        province.on('click','li',function(){
            var me=$(this);
            var id=me.data('id');
            var name=me.text();
            result[0]={id:id,name:name};
            step=1;
            changeStep();
            cData=MOYU.addr.getDataList(id);
            cHtml=itemTemp(cData);
            city.html(cHtml);
        });
    //选择市
        city.on('click','li',function(){
            var me=$(this);
            var id=me.data('id');
            var name=me.text();
            result[1]={id:id,name:name};
            step=2;
            changeStep();
            aData=MOYU.addr.getDataList(result[0].id,id);
            aHtml=itemTemp(aData);
            area.html(aHtml);
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
            $.each(result,function(k,v){
                text += v.name+' ';
            });
            addrShowInput.val(text);
            setData();
        });
        $('.js-address-link').on('click',function(){
            addBox.show();
        });
        addBox.on('click','.close',function(){
            step=0;
            addBox.hide();
            changeStep();
        });
    };
    $(document).ready(init());
})(jQuery,window,document);
