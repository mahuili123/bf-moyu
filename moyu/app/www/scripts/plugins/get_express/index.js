;(function($, window, document, undefined){
    /*查看物流*/
    if(typeof(MOYU) === 'undefined'){
        var MOYU = {};
    }
    MOYU.getExpressInfo = function(me){
        if(me.hasClass('posting')){
            return false;
        }

        var name = me.attr('data-name');
        var number = me.attr('data-number');
        var box = $('#express-info-'+ number);
        if(box[0]){
            box.remove();
            return false;
        }

        var data = {
            order_express_short_name: name,
            order_express_number: number
        };
        var listItem = function(list){
            var html = '';
            $.each(list, function(k){
                var d = list[k];
                var c = k === 0 ? ' class="first"' : '';
                html += '<li'+ c +'>'+
                    '        <i class="i-round"></i>'+
                    '        <p>'+ d.status +'</p>'+
                    '        <span class="timer">'+ d.time +'</span>'+
                    '</li>';
            });
            return html;
        };
        var temp = function(){
            var html = '';
            var items = '<li class="loading">数据查询中...</li>';
            html = '<div class="moyu-show-express" id="express-info-'+ number +'">'+
                '    <h4>运单号：'+ number +'</h4>'+
                '    <i class="i-arrow"></i>'+
                '    <div class="express-list">'+
                '        <ul>'+ items +
                '        </ul>'+
                '    </div>'+
                '</div>';
            return html;
        };
        if(!name || !number){
            alert('查询参数不正确！');
            return false;
        }
        //创建载入窗口
        var creatWin = function(){
            var offset = me.offset();
            var left = offset.left - ((330 - me.outerWidth()) / 2);
            var top = offset.top + me.outerHeight() + 8;
            var $html = $(temp());
            $html.css({
                position: 'absolute',
                left: left +'px',
                top: top +'px'
            });
            return $html;
        };
        box = creatWin();
        $('body').append(box);
        me.addClass('posting');
        $.ajax({
            url: '/expressnode',
            //type: 'POST',
            type: 'GET',
            data: data,
            dataType: 'json',
            success: function(data) {
                if (parseInt(data.code) === 0) {
                    var d = data.data.list;
                    var items = listItem(d);
                    box.find('.express-list').html(items);
                } else {
                    box.find('.express-list li').html(data.msg);
                }
                me.removeClass('posting');
            },
            error: function(){
                box.find('.express-list li').html('与服务器交互错误，请稍后再试！');
                me.removeClass('posting');
            }
        });
    };

    $(document).ready(function(){
        $('body').on('click', '.get-express-info', function(){
            var me = $(this);
            MOYU.getExpressInfo(me);
            return false;
        });
        $('body').on('click', function(event){
            var me = $(event.target);
            if(!me.hasClass('get-express-info')){
                $('.moyu-show-express').remove();
            }
        });
    });
})(jQuery, window, document);
