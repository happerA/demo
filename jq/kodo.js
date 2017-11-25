(function(window, document) {
    var w = window,
        doc = document
    var Kodo = function(selector) {
        return new Kodo.prototype.init(selector)
    }
    Kodo.prototype = {
        constructor: Kodo,
        length: 0,
        splice: [].splice,
        selector: '',
        init: function(selector) {}
    }
    Kodo.prototype.init.prototype = Kodo.prototype

    Kodo.ajax = function() {
        console.log(this);
    }
    window.f = Kodo
})(window, document);


//esdo
var esDO = {
    //去空格 type1：所有空格 2：前后空格 3：前空格 4：后空格
    trim: function(str, type) {
        type = type || 2
        switch (type) {
            case 1:
                return str.replace(/\s+/g, '')
            case 2:
                return str.replace(/(^\s*)|(\s*$)/g, '')
            case 3:
                return str.replace(/(^\s*)/g, '')
            case 4:
                return str.replace(/(\s*$)/g, '')
            default:
                return str
        }
    },
    /*type
    1.首字母大写
    2.首字母小写
    3.大小写转化
    4.全部大写
    5.全部小写
    */
    changeCase: function(str, type) {
        function toggleCase(str) {
            var newStr = ''
            str.split('').forEach(function(item) {
                if (/[a-z]/.test(item)) {
                    newStr += item.toUpperCase()
                } else if (/[A-Z]/.test(item)) {
                    newStr += item.toLowerCase()
                } else {
                    newStr += item
                }
            })
            return newStr
        }
        type = type || 1
        switch (type) {
            case 1:
                return str.replace(/\b\w+\b/g, function(s) {
                    return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase()
                })
            case 2:
                return str.replace(/\b\w+\b/g, function(s) {
                    return s.substring(0, 1).toLowerCase() + s.substring(1).toUpperCase()
                })
            case 3:
                return toggleCase(str)
            case 4:
                return str.toUpperCase()
            case 5:
                return str.toLowerCase()
            default:
                return str
        }
    },
    /*循环复制
    str->字符串 num->次数
    */
    repeatStr: function(str, num) {
        var text = ''
        num = num || 1
        str = str || ''
        for (var i = 0; i < num; i++) {
            text += str
        }
        return text
    },
    /*
    字符替换
    */
    replaceAll: function(str, findStr, repStr) {
        var raRegExp = new RegExp(findStr, 'g')
        return str.replace(raRegExp, repStr)
    },
    /*
    检测字符串
    */
    checkStrType: function(str, type) {
        type = type || ''
        str = str || ''
        switch (type) {
            case 'email':
                return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str)
            case 'phone':
                return /^1[3|4|5|7|8][0-9]{9}$/.test(str)
            case 'tel':
                return /^(0\d{2,3}-\d{7,8})(-\d{1,4})$/.test(str)
            case 'number':
                return /^[0-9]$/.test(str)
            case 'english':
                return /^[a-zA-Z]+$/.test(str)
            case 'text':
                return /^\w+$/.test(str)
            case 'chinese':
                return /^[\u4E00-\u9FA5]+$/.test(str)
            case 'lower':
                return /^[a-z]+$/.test(str)
            case 'upper':
                return /^[A-Z]+$/.test(str)
            default:
                return true
        }
    },
    /*
    检测密码强度
    result 123
    */
    checkPsw: function(str) {
        var num = 0
        if (str.length < 6) {
            return num
        }
        if (/[0-9].test(str)/) {
            num++
        }
        if (/[a-z]/.test(str)) {
            num++
        }
        if (/[A-Z]/.test(str)) {
            num++
        }
        if (/[\.|-|_]/.test(str)) {
            num++
        }
        return num
    },
    /*随机码
     */
    randomWord: function(count) {
        count = count || 3
        return Math.random.toString(count).substring(2)
    },
    //句子首字母大写
    titleCaseUp: function(str) {
        var splitStr = /\s+/g
        var strArr = str.split(splitStr)
        var result = ''
        var _this = this
        strArr.forEach(function(item) {
            result += _this.changeCase(item, 1) + ' '
        })
        return this.trim(result, 4)
    },
    /*数组
    数组去重
    */
    removeRepeat: function(arr) {
        return arr.filter(function(item, index, self) {
            return self.indexOf(item) === index
        })
    },
    /*
    数组打乱顺序
    */
    upsetArr: function(arr) {
        return arr.sort(function() {
            return Math.random() - 0.5
        })
    },
    //最大值
    maxArr: function(arr) {
        return Math.max.apply(null, arr)
    },
    //最小值
    minArr: function(arr) {
        return Math.min.apply(null, arr)
    },
    //去和
    sumArr: function(arr) {
        return arr.reduce(function(pre, cur) {
            return pre + cur
        })
    },
    //平均
    covArr: function(arr) {
        return this.sumArr(arr) / this.arr.length
    },
    //从数组中随机取数
    randomOne: function(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
    },
    //数组 字符串中出现次数
    getEleCount: function(obj, el) {
        var num = 0
        for (var i = 0; i < obj.length; i++) {
            if (ele === obj[i]) {
                num++
            }
        }
        return num
    },
    //返回数组中出现最多的元素和次数
    getCout: function(arr) {
        var obj = {}
        for (var i = 0; i < arr.length; i++) {
            if (!obj[arr[i]]) {
                obj[arr[i]] = 1
            } else {
                obj[arr[i]]++
            }
            if (!obj['max_value']) {
                obj['max_value'] = arr[i]
            } else if (obj['max_value'] < obj[arr[i]]) {
                obj['max_value'] = arr[i]
            }
        }
        return obj
    },
    //筛选数组
    removeArrayForValue: function(arr, keys, type) {
        return arr.filter(function(item, index, self) {
            return type ? item.indexOf(keys) === -1 : keys !== item
        })
    },
    //数组扁平
    steamRoller: function(arr) {
        var newArr = []
        for (var i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                newArr.push.apply(null, this.steamRoller(arr[i]))
            } else {
                newArr.push(arr[i])
            }
        }
        return newArr
    },
    //适配rem
    getFontSize: function() {
        var doc = document,
            win = window;
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? orientation : resize,
            recalc = function() {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return
                if (clientWidth > 750) {
                    clientWidth = 750
                }
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px'
            }
        win.addEventListener(resizeEvt, recalc, false)
        doc.addEventListener('DOMContentLoaded', recalc, false)
    },
    //到某一时间的倒计时
    getEndTime: function(endTime) {
        var startData = new Date(),
            endTime = new Date(endTime),
            t = endTime.getTime() - startData.getTime(),
            d = 0,
            h = 0,
            m = 0,
            s = 0
        if (t > 0) {
            d = Math.floor(t / 1000 / 3600 / 24)
            h = Math.floor(t / 1000 / 3600 % 24)
            m = Math.floor(t / 1000 / 60 % 60)
            s = Math.floor(t / 1000 % 60)
        } else {
            return false
        }
        return `剩余时间${d}天${h}小时${m}分${s}秒`
    },
    //随机颜色
    randomColor: function() {
        return '#' + Math.ranodm().toString(2).substring(2).substr(0, 6)
    },
    //随机范围
    randomArr: function(n1, n2) {
        if (arguments.length === 2) {
            return Math.round(n1 + Math.random() * (n2 - n1))
        } else if (arguments.length === 1) {
            return Math.round(Math.random() * n1)
        } else {
            return Math.round(Math.random() * 255)
        }
    },
    //设置URL参数
    setUrl: function(obj) {
        var _rs = [];
        for (var key in obj) {
            if (obj[key] != null && obj[key] != '') {
                _rs.push(key + '=' + obj[key])
            }
        }
        return _rs.join('&')
    },
    //获取url参数
    getUrl: function(url) {
        var url = url ? url : window.location.href,
            param = url.substring(url.indexOf('?') + 1),
            _arrS = param.split('&'),
            _rs = {}
        for (var i = 0; i < _arrS.length; i++) {
            var pos = _arrS[i].indexOf('=')
            if (pos === -1) {
                continue
            }
            var name = _arrS[i].substring(0, pos),
                value = _arrS[i].substring(pos + 1)
            _rs[name] = value
        }
        return _rs
    },
    getUrl1: function(url) {
        var url = url ? url : window.location.href,
            search = url.substring(url.lastIndexOf("?") + 1)
        if (!search) {
            return {}
        }
        return JSON.parse('{"' + decodeURIComponent(search)
            .replace(/"/g, '/\\"/')
            .replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    },
    //格式化字符串
    formatText: function(str, size, delimiter) {
        var _size = size || 3,
            _delimiter = delimiter || ' ',
            regText = '\\B(?=(\\w{' + _size + '})+(?!\\w))',
            reg = new RegExp(regText, 'g')
        return str.replace(reg, _delimiter)
    },
    //现金转大写
    upDigit: function(n) {
        var fraction = ['角', '分'];
        var digit = [
            '零', '壹', '贰', '叁', '肆',
            '伍', '陆', '柒', '捌', '玖'
        ];
        var unit = [
            ['元', '万', '亿'],
            ['', '拾', '佰', '仟']
        ];
        var head = n < 0 ? '欠' : '';
        n = Math.abs(n);
        var s = '';
        for (var i = 0; i < fraction.length; i++) {
            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
        }
        s = s || '整';
        n = Math.floor(n);
        for (var i = 0; i < unit[0].length && n > 0; i++) {
            var p = '';
            for (var j = 0; j < unit[1].length && n > 0; j++) {
                p = digit[n % 10] + unit[1][j] + p;
                n = Math.floor(n / 10);
            }
            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
        }
        return head + s.replace(/(零.)*零元/, '元')
            .replace(/(零.)+/g, '零')
            .replace(/^整$/, '零元整');
    },
    //清除对象值为空
    filterParam: function(obj) {
        var newObj = {}
        for (var key in obj) {
            if (obj[key] === 0 || obj[key] && obj[key].toString().replace(/(^\s)|(\s$)/g, '') != '') {
                newObj[key] = obj[key]
            }
        }
    },
    //设置cookie
    setCookie: function(name, value, iDay) {
        var oData = new Date()
        oData.setDate(oData.getDate() + iDay)
        document.cookie = name + '=' + value + ';expires=' + oData
    },
    //获取cookie
    getCookie: function(name) {
        var arr = document.cookie.split('; ')
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=')
            if (arr2[0] === name) {
                return arr2[1]
            }
        }
        return ''
    },
    //删除cookie
    removeCookie: function(name) {
        this.setCookie(name, 1, -1)
    },
    //数据类型判断
    istype: function(o, type) {
        var _type = type.toLowerCase() || 'string'
        switch (_type) {
            case 'string':
                return Object.prototype.toString.call(o) === '[Object String]'
            case 'array':
                return Object.prototype.toString.call(o) === '[Object Array]'
            case 'number':
                return Object.prototype.toString.call(o) === '[Object Number]'
            case 'boolean':
                return Object.prototype.toString.call(o) === '[Object Boolean]'
            case 'undefined':
                return Object.prototype.toString.call(o) === '[Object Undefined]'
            case 'null':
                return Object.prototype.toString.call(o) === '[Object Null]'
            case 'function':
                return Object.prototype.toString.call(o) === '[Object Function]'
            case 'object':
                return Object.prototype.toString.call(o) === '[Object Object]'
            case 'nan':
                return isNaN(o)
            case 'element':
                return Object.prototype.toString.call(o).indexOf('HTML') !== -1
            default:
                return Object.prototype.toString.call(o)
        }
    },
    //检测对象有哪些类
    hasClass: function(obj, name) {
        if (obj.className && this.trim(obj.className, 1) !== '') {
            var arr = obj.className.split(/\s+/)
            return arr.indexOf(name) === -1 ? false : true
        } else {
            return false
        }
    },
    //添加类
    addClass: function(obj, name) {
        if ((this.istype(obj, 'array') || this.istype(obj, 'element')) && obj.length > 1) {
            for (var i = 0; i < obj.length; i++) {
                if (!this.hasClass(obj[i], name)) {
                    obj[i].className += ' ' + name
                }
            }
        } else {
            if (!this.hasClass(obj, name)) {
                obj.className += ' ' + name
            }
        }
    },
    //删除类
    removeClass: function(obj, name) {
        if ((this.istype(obj, 'array') || this.istype(obj, 'element')) && obj.length > 1) {
            for (var i = 0; i < obj.length; i++) {
                if (this.hasClass(obj[i], name)) {
                    var reg = new RegExp('(\\s|^)' + name + '(\\s|$)')
                    obj[i].className = obj[i].className.replace(reg, '')
                }
            }
        } else {
            if (this.hasClass(obj, name)) {
                var reg = new RegExp('(\\s|^)' + name + '(\\s|$)')
                obj.className = obj.className.replace(reg, '')
            }
        }
    },
    //替换类
    replaceClass: function(obj, newC, oldC) {
        this.removeClass(obj, oldC)
        this.addClass(obj, newC)
    },
    //获取兄弟接点
    siblings: function(obj, opt) {
        var a = [],
            p = obj.previousSibling()
    },
    //图片加载
    aftLoadImg: function(obj, url, errorUrl, fn) {
        var oImg = new Image(),
            _this = this
        oImg.src = url
        oImg.onload = function() {
            obj.src = oImg.src
            if (fn && this.istype(fn, 'function')) {
                fn(obj)
            }
        }
        oImg.onerror = function() {
            obj.src = errorUrl
            if (fn && this.istype(fn, 'function')) {
                fn(obj)
            }
        }
    },
    //图片滚动懒加载
    //@className {string} 要遍历图片的类名
    //@num {number} 距离多少的时候开始加载 默认 0
    //比如，一张图片距离文档顶部3000，num参数设置200，那么在页面滚动到2800的时候，图片加载。不传num参数就滚动，num默认是0，页面滚动到3000就加载
    //html代码
    //<p><img data-src="lawyerOtherImg.jpg" class="load-img" width='528' height='304' /></p>
    //<p><img data-src="lawyerOtherImg.jpg" class="load-img" width='528' height='304' /></p>
    //<p><img data-src="lawyerOtherImg.jpg" class="load-img" width='528' height='304' /></p>....
    //data-src储存src的数据，到需要加载的时候把data-src的值赋值给src属性，图片就会加载。
    //详细可以查看testLoadImg.html

    //window.onload = function() {
    //	loadImg('load-img',100);
    //	window.onscroll = function() {
    //		loadImg('load-img',100);
    //		}
    //}
    loadImg: function(name, num, errorUrl) {
        var _className = name || 'ec-load-img',
            _num = num || 0,
            _this = this,
            _errorUrl = errorUrl || null,
            oImgLoad = document.getElementsByClassName(_className)
        for (var i = 0; i < oImgLoad.length; i++) {
            if (document.documentElement.clientHeight + document.documentElement.scrollTop > oImgLoad[i].offsetTop - _num && !oImgLoad[i].isLoad) {
                oImgLoad[i].isLoad = true
                oImgLoad[i].style.cssText = "transform:'';opacity: 0;"
                if (oImgLoad[i].dataset) {
                    this.aftLoadImg(oImgLoad[i], oImgLoad[i].dataset.src, _errorUrl, function(o) {
                        setTimeout(function() {
                            if (o.isLoad) {
                                _this.removeClass(0, _className)
                                o.style.cssText = ''
                            }
                        }, 1000)
                    })
                } else {
                    this.aftLoadImg(oImgLoad[i], oImgLoad[i].getAttribute('data-src'), _errorUrl, function(o) {
                        setTimeout(function() {
                            if (o.isLoad) {
                                _this.removeClass(0, _className)
                                o.style.cssText = ''
                            }
                        }, 1000)
                    })
                }
                (function(i) {
                    setTimeout(function() {
                        oImgLoad[i].style.cssText = "transition:all 1s; opacity: 1;";
                    }, 16)
                })(i)
            }
        }
    },
    //ajax
    ajax: function(obj) {
        obj = obj || {}
        obj.type = obj.type.toUpperCase() || 'POST'
        obj.url = obj.url || ''
        obj.async = obj.async || true
        obj.data = obj.data || null
        obj.success = obj.success || function() {}
        obj.error = obj.error || function() {}
        var xmlHttp = null
        if (XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest()
        } else {
            xmlHttp = new ActiveXObject('Misrosoft.XMLHTTP')
        }
        var params = []
        for (var key in obj.data) {
            params.push(key + '=' + obj.data[key])
        }
        var posData = params.join('&')
        if (obj.type === 'POST') {
            xmlHttp.open(obj.type, obj.url, obj.async)
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
            xmlHttp.send(posData)
        } else if (obj.type === 'GET') {
            xmlHttp.open(obj.type, obj.url + '?' + posData, obj.async)
            xmlHttp.send(null)
        }
        xmlHttp.onreadystestatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                obj.success(xmlHttp.responseText)
            } else {
                obj.error(xmlHttp.responseText)
            }
        }
    },
    //创建正则字符
    createKeyExp: function(strArr) {
        var str = ''
        for (var i = 0; i < strArr.length; i++) {
            if (i != strArr.length - 1) {
                str = str + strArr[i] + "|"
            } else {
                str = str + strArr[i]
            }
        }
        return "(" + str + ")"
    },
    //手机类型判断
    browserInfo: function(type) {
        switch (type) {
            case 'android':
                return navigator.userAgent.toLowerCase().indexOf('android') !== -1
            case 'iphone':
                return navigator.userAgent.toLowerCase().indexOf('iphone') !== -1
            case 'ipad':
                return navigator.userAgent.toLowerCase().indexOf('ipad') !== -1
            case 'weixin':
                return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
            default:
                return navigator.userAgent.toLowerCase()
        }
    },

};