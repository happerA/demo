(function($){
    var ms = {
        init: function (obj, opt){
            this.fillHtml(obj,opt);
            this.bindEvent(obj,opt);
        },
        fillHtml: function(obj,opt) {
            obj.empty();
            if(opt.current>1) {
                obj.append('<a href="javascript:;" class="prevPage">pre</a>')
            }else{
                obj.remove('.prevpage');
                obj.append('<span class="disable">prev</span>')
            }
            if(opt.current!=1&&opt.current>3) {
                obj.append('<a class="tcdNumber" href=""javascript:;>'+1+'</a>')
            }
            if(opt.current-2>2 && opt.current<=opt.pageCount && opt.pageCount>5){
                obj.append('<span>....</span>')
            }
            var star = parseInt(opt.current,10)-2,end = parseInt(opt.current,10)+2;
            if(opt.current==1) {
                end++
            }
            for(;star<=end;star++) {
                if(star>=1&&star<=opt.pageCount) {
                    if(star == opt.current) {
                        obj.append('<span class="current">'+star+'</span>')
                    }
                    else{
                        obj.append('<a href="javascript:;" class="tcdNumber">'+star+'</a>')
                    }
                }
            }
            if(opt.current<opt.pageCount-3&&opt.current>=1&&opt.pageCount>5) {
                     console.log(opt.pageCount)
                obj.append('<span>....</span>');
            }
            if(opt.current<opt.pageCount-2&&opt.current!=opt.pageCount&&opt.pageCount!=4) {
                obj.append('<a href="javascript:;" class="tcdNumber">'+opt.pageCount+'</a>')
            }
            if(opt.current!=opt.pageCount) {
                obj.append('<a href="javascript:;" class="nextPage">next</a>')
            }
            else{
                obj.remove('.nextPage');
                obj.append('<span class="disabled">next</span>')
            }
        },
        bindEvent: function(obj,opt) {
            obj.on('click','.prevPage',function(){
                var number = $('.current').text();  
                ms.fillHtml(obj,{current:parseInt(number)-1,pageCount:opt.pageCount})
            })
             obj.on('click','.nextPage',function(){
                 var number = $('.current').text(); 
                ms.fillHtml(obj,{current:parseInt(number)+1,pageCount:opt.pageCount})
            })
              obj.on('click','.tcdNumber',function(){
                var number = $(this).text();  
                ms.fillHtml(obj,{current:number,pageCount:opt.pageCount})
            })
        }
        
    }
    $.fn.createPage = function(option) {
        var opt = $.extend([],{
            current:1,
            pageCount:10,
            backFun: function(option) {
                
            }
        },option)
        ms.init(this,opt)
    }
})(jQuery)