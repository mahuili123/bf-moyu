;(function($, window, document, undefined){
    'use strict';

    $(document).ready(function(){
        $('.js-back').on('click', function(){
            var dialog = new MOYU.sysinfo({
                msg: '您确定要申请退款吗？',
                buttons: [{
                    text: '确定',
                    ex_class: 'ok',
                    func: function(){}
                }, {
                    text: '取消',
                    ex_class: 'canncel',
                    func: function(){}
                }]
            });
            dialog.show();
        });
    });

})(jQuery, window, document);
