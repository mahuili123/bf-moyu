;(function($, window, document, undefined){
    'use strict';

    $.fn.moyuCR = function(type, value){
        var opt = {
            width: 18,
            height: 18,
            cboxClass: 'moyu-checkbox-box',
            cimgClass: 'moyu-checkbox',
            rboxClass: 'moyu-radio-box',
            rimgClass: 'moyu-radio',
            initClass: 'moyuCRInit'
        };
        var events = {
            init: function(){},
            destroy: function(){},
            setChecked: function(){},
            setDisabled: function(){}
        };
        var tmp = function(data){
            var checked = data.checked === true ? ' checked' : '';
            var disabled = data.disabled === true ? ' disabled' : '';
            var imgClass = data.type === 'radio' ? opt.rimgClass : opt.cimgClass;
            var html = '<div class="'+ imgClass + checked + disabled +'"></div>';
            return html;
        };
        var setOther = function(obj){
            var items = $('input[name="'+ obj.attr('name') +'"]').not(obj);
            $.each(items, function(){
                var me = $(this);
                var type = me.attr('type');
                var imgClass = type === 'radio' ? opt.rimgClass : opt.cimgClass;
                var prev = me.prev('.'+ imgClass);
                if(!prev.is(':disabled')){
                    prev.removeClass('checked');
                }
            });
        };
        var getClass = function(obj, key){
            var res = '';
            var type = obj.attr('type');
            var k = type === 'radio' ? 'r' : 'c';
            k = k + key;
            res = opt[k];
            return res;
        };
        var checkInit = function(obj){
            var res = obj.hasClass(opt.initClass);
            if(!res){
                alert('请先初始化');
            }
            return res;
        };
        var objs = this;
        type = events[type] ? type : 'init';
        events.init = function(){
            $.each(objs, function(){
                if($(this).hasClass(opt.initClass)){
                    return false;
                }
                var me = $(this);
                var parent = me.parent();
                var data = {};
                var html = '';
                var type = me.attr('type');
                var boxClass = '';
                if(type === 'checkbox' || type === 'radio'){
                    data.checked = me.is(':checked');
                    data.disabled = me.is(':disabled');
                    data.type = type;
                    boxClass = getClass(me, 'boxClass');
                    html = $(tmp(data));
                    parent.addClass(boxClass);
                    parent.css({
                        position: 'relative',
                        paddingLeft: (opt.width + 6)
                    });
                    me.css({
                        width: opt.width,
                        height: opt.height,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        opacity: 0,
                        zIndex: 2
                    });
                    html.css({
                        width: opt.width,
                        height: opt.height,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        zIndex: 1
                    });
                    me.before(html);
                    me.on('change.moyu', function(){
                        var self = $(this);
                        if(self.is(':checked')){
                            html.addClass('checked');
                            if(type === 'radio'){
                                setOther(self);
                            }
                        } else {
                            html.removeClass('checked');
                        }
                        if(self.is(':disabled')){
                            html.addClass('disabled');
                        } else {
                            html.removeClass('disabled');
                        }
                    });
                    me.addClass(opt.initClass);
                }
            });
        };
        events.destroy = function(){
            $.each(objs, function(){
                var me = $(this);
                var parent = me.parent();
                var isInit = checkInit(me);
                if(isInit){
                    parent.removeClass(getClass(me, 'boxClass')).removeAttr('style');
                    me.removeAttr('style');
                    me.prev('.'+ getClass(me, 'imgClass')).remove();
                    me.off('change.moyu');
                }
            });
        };
        events.setChecked = function(){
            $.each(objs, function(){
                var me = $(this);
                var isInit = checkInit(me);
                if(isInit){
                    me.prop('checked', value).trigger('change.moyu');
                }
            });
        };
        events.setDisabled = function(){
            $.each(objs, function(){
                var me = $(this);
                var isInit = checkInit(me);
                if(isInit){
                    me.prop('disabled', value).trigger('change.moyu');
                }
            });
        };
        events[type]();
    };

})(jQuery, window, document);
