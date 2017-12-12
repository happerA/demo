function addlisten(el, type, fun) {
    if (el.addEventListener) {
        el.addEventListener(type, fun)
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, fun)
    } else {
        el['on' + type] = fun
    }
}

function delegateEvent(obj, str, type, handle) {
    addlisten(obj, type, function(event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;
        if (e == str) {
            handle
        }
    })
}

function $(str) {
    if (str.indexOf(' ') == -1) {
        var a = str.slice(0, 1);
        if (a == '#') {
            return document.querySelector(str);
        } else {
            return document.querySelectorAll(str)[0]
        }
    } else {
        var arr = str.split(' ');
        var dom = document;
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i].slice(0, 1);
            if (a == '#') {
                dom = dom.querySelector(str);
            } else {
                dom = dom.querySelectorAll(str)[0]
            }
        }
    }
}

function unbindListen(el, type, fun) {
    if (el.removeEventListener) {
        el.removeEventListener(type, fun)
    } else {
        el.detachEvent('on' + type, fun)
    }
}

function uniqArray(arr) {
    var newarr = [],
        having = {};
    for (var i = 0; i < arr.length; i++) {
        if (!having[arr[i]]) {
            newarr.push(arr[i])
            having[arr[i]] = true;
        }
    }
    return newarr
}

function cloneObj(obj) { //不包含正则表达式类型、函数类型等无法进行深复制
    var newobj = JSON.parse(JSON.stringify(obj))
    return newobj;
}

function is(obj, str) {
    var toString = Object.prototype.toString,
        undefined;
    return (str === 'Null' && obj === null) || (str === 'Undefined' && obj === undefined) || toString.call(obj).slice(8, -1) === str
}

function deepclone(result, obj) {
    for (var key in obj) {
        var copy = obj[key]
        if (copy === obj) continue;
        if (is(copy, 'Object')) {
            result[key] = arguments.callee(result[key] || {}, copy)
        } else if (is(copy, 'Array')) {
            result[key] = arguments.callee(result[key] || [], copy)
        } else {
            result[key] = copy
        }
    }
    return result
}

function isEmail(str) {
    return /^(\w)+(\.\w)*@(\w)+((\.\w{2,3})){1,3}$/.test(str)
}

function isPhone(str) {
    if (!is(str, 'Number')) return false;
    return /^1[358]\d{9}/.test(str)
}

function each(arr, fn) {
    if (!is(arr, 'Array')) return false
    arr.forEach(function(e) {
        fn(e)
    })
}

function addClass(obj, newClass) {
    obj.className += ' ' + newClass;
    obj.className = obj.className.trim();
}

function removeClass(obj, oldClass) {
    var arr = obj.className.split(' ');
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] == oldClass) {
            arr[i] = ''
        }
    }
    obj.className = arr.join(' ').replace('  ', ' ').trim();
}

function setCookies(cookieName, cookieVal, expireDays) {
    expireDays = parseInt(expireDays);
    var day = (expireDays >= 0 && expireDays <= 30) ? expireDays : 30;
    var date = new Date();
    date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
    document.cookie = cookieName + '=' + escape(cookieVal) + ';expires:' + date.toGMTString();
}

function getCookie(cookieName) {
    var arr, reg = new RegExp('(^| )' + cookieName + '=([^;]*)([;|$])');
    arr = document.cookie.match(reg);
    return unescape(arr[2]);
    return null;
}

function getCook(cookieName) {
    var strStart = document.cookie.indexOf(cookieName + '=');
    if (strStart != -1) {
        var strEnd = document.cookie.indexOf(';', strStart);
        if (strEnd != -1) {
            return document.cookie.substring((strStart + cookieName.length + 1), strEnd);
        }
    }
    return null
}

function ajax(url, opt) {
    var xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject('Micrsoft.xmlHTTP')
    }
    var type = opt.type || 'get';
    xhr.open(type, url);
    if (opt.data) {
        xhr.send(opt.data)
    }
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                opt.onsuccess
            } else {
                opt.onerror
            }
        }
    }
}

function canvasMove(event) {
    event = window.event || '';
    var x, y;
    if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
    } else {
        x = event.clientX + document.body.scrollLeft;
        y = event.clientY + document.body.scrollTop;
    }
    x -= this.offsetLeft;
    y -= this.offsetTop;
}
//siblings
function getsiblings(el) {
    return a = [].filter.call(el.parentNode.children, function(child) {
        return child !== el
    })
}
//closest jq 匹配第一个祖父元素
function closest(el, selectStr) {
    var matchesSeletor = el.matches || el.webkitMatchesSeletor || el.mozMatchesSeletor || el.msMatchesSeletor;
    while (el) {
        if (matchesSeletor.call(el, selectStr)) {
            return el;
        } else {
            el = el.parentNode;
        }
    }
    return null;
}

function parentUntils(el, selector, filter) {
    var result = [],
        matchesSelector = el.matches || el.webkitMatchesSeletor || el.mozMatchesSeletor || el.msMatchesSeletor;
    el = el.parentNode;
    while (el) {
        if (matchesSeletor.call(el, selector)) {
            if (filter) {
                if (matchesSelector.call(el, filter)) {
                    result.push(el);
                } else {
                    el = el.parentNode;
                }
            } else {
                result.push(el);
            }
        } else {
            el = el.parentNode;
        }
    }
    return result;
}
//get css
function getcss(el) {
    var win = el.ownerDocument.defaultView;
    return win.getComputedStyle(el, null).color;
}
// add class
function addClass(el, class) {
    el.classList.add(class);
}
// remove class
function removeClass(el, class) {
    el.classList.remove(class);
}
// have class
function hasClass(el, class) {
    el.classList.contains(class);
}
//toggle class 有删除没有填加
function toggleClass(el, class) {
    el.classList.toggle(class);
}
//window height
function winHeight() {
    //有scrollbar
    return window.innerHeight;
    //meiyou
    return window.document.documentElement.clientHeight;
}
//docuemnt height
function docHeight() {
    document.documentElement.scrollHeight;
}
//element height
//content height
function eleHeight(el) {
    var styles = el.getComputedStyle;
    var height = el.offsetHeight;
    var borderTopWidth = styles.borderTopWidth;
    var borderbotWidth = styles.borderBottomWidth;
    var padTopWidth = styles.paddingTop;
    var padBotWidth = styles.paddingBottom;
    return height - padBotWidth - padTopWidth - borderTopWidth - borderbotWidth;
}

function elesHeight(el) {
    return el.clientHeight;
    return el.getBoundingClientRect().height;
}
//position
function position(el) {
    return pos = {
        left: el.offsetLeft,
        top: el.offsetTop
    }
}
//offset
function elOffset(el) {
    var box = el.getBoundingClientRect();
    return {
        top: box.top + window.pageYoffset - document.documentElement.clientTop,
        left: box.left + window.pageXoffset - document.documentElement.clientLeft
    }
}
//scrolltop
function scrolltop() {
    (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
}

function text(el, str) {
    var get = function() {
        return el.textContent;
    }
    var set = function() {
        el.textContent = str;
    }
}
//继承 extend
function extendObj(defaults, opts) {
    Object.assign({}, defaults, opts);
}
//lazyman
function _LazyMan(name) {
    var _this = this;
    _this.name = name;
    _this.task = [];
    _this.task.push(function() {
        console.log('hello ' + _this.name);
        _this.next();
    })
    setTimeout(function() {
        _this.next();
    }, 0)
}
_LazyMan.prototype.next = function() {
    var _this = this;
    var _fn = _this.task.shift();
    _fn && _fn();
}
_LazyMan.prototype.sleep = function(time) {
    var _this = this;
    _this.task.push(function() {
        setTimeout(function() {
            console.log('will sleep after ' + time);
            _this.next()
        }, time)
    })
    return _this;
}
_LazyMan.prototype.sleepFirst = function(time) {
    var _this = this;
    _this.task.unshift(function() {
        setTimeout(function() {
            console.log('will sleep after ' + time);
            _this.next();
        }, time)
    })
    return _this;
}
_LazyMan.prototype.eat = function(eat) {
    var _this = this;
    _this.task.push(function() {
        console.log('Eat ' + eat);
        _this.next();
    })
    return _this;
}
var lazyman = function(name) {
    return new _LazyMan(name)
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
//多个数组的合并 执行concat(arr1,arr2,arr3)
var concat = (function() {
        var _concat = function(tar, sou) {
            for (var i = 0, len = sou.length; i < len; i++) {
                tar.indexOf(sou[i]) === -1 ? tar.push(sou[i]) : 0
            }
        }
        return function(arr) {
            var res = arr.slice();
            for (var i = 0, len = arguments.length; i < len; i++) {
                _concat(res, arguments[i]);
            }
            return res;
        }
    }())
    //临时构造器继承
function inheit() {
    var F = function() {};
    return function(C, P) {
        F.prototype = P.prototype;
        C.prototype = new F();
        C.uber = P.prototype;
        C.prototype.constructor = C;
    }
}
//实现multi(1)(2)(3) 1*2*3
function multi(n) {
    var fn = function(x) {
        return multi(n * x);
    }
    fn.valueOf = function() {
        return n
    }
    return fn;
}
//不支持getelementbyclass
function getByClass(el, classname) {
    if (el.getElementByClassName) {
        return el.getElementsByClassName(classname);
    } else {
        var elList = el.getElementsByTagName('*'),
            res = [];
        for (var i = 0, len = elList.length; i < len; i++) {
            var classList = elList[i].classname.split(' ');
            if (findClass(classList, classname)) {
                res.push(elList[i]);
            }
        }
        return res
    }
}

function findClass(arr, classname) {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] === classname) {
            return true;
        }
    }
    return false;
}
//兼容ie xhr
function getXhr() {
    var objXHR = '';
    if (window.XMLHttpRequest) {
        objXHR = window.XMLHttpRequest;
        l
    } else {
        objXHR = new ActiveXObject('Micrsoft.XMLHTTP');
    }
    return objXHR;
}

//判断质数
function isPrame(number) {
    if (typeof number != 'number' || !Number.isInteger(number)) {
        return false;
    }
    if (number < 2) {
        return false;
    }
    if (number === 2) {
        return true;
    } else if (number % 2 == 0) {
        return false;
    }
    var sqrtNumber = Math.sqrt(number);
    for (var i = 3; i < sqrtNumber; i += 2) {
        if (number % i === 0) {
            return false;
        }
    }
    return true;
}

//3-32随机不重复数组
/**
 *获取指定个数的随机整数 范围[3,32]
 *输入值为正整数 范围为[3,32]
 *返回值为数组 输入不合法是返回空数组
 */
function fn(n) {
    //数组范围
    var minArr = 3,
        maxArr = 32;
    //检验函数
    if (!isThere(n)) return [];
    if (!formateIsNumber(n)) return [];
    if (!rangOk(n, maxArr, minArr)) return [];
    //保存容器
    var arr = []
    for (var i = 0; i < n; i++) {
        var d = getRand(minArr, maxArr);
        if (isChecked(n, arr)) {
            i--
        } else {
            arr.push(d)
        }
    }
    return arr;
}

/**
 *数组展平
 *[1,2,3,[4,5,6],5]->[1,2,3,4,5,6,5]
 *参数数组 返回值为数组
 */
function fattern(arr) {
    if (!isArrays(arr) || !arr.length) {
        return []
    } else {
        return Array.prototype.concat.apply([], arr.map(function(arrItem) {
            return isArrays(arrItem) ? fattern(arrItem) : arrItem
        }))
    }

    function isArrays(arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    }
}

/**
 *找出字符串中出现次数最多的字符
 *返回值出现次数 最多的字符
 */

function getMaxCharInStr(str) {
    return (str + '').split('').reduce(function(pre, cur, index, arr) {
        cur in pre ? pre[cur]++ : (pre[cur] = 1)
        pre[cur] > pre.value && (pre.char = cur, pre.value = pre[cur])
        return pre
    }, { value: 0 })
}

function getMaxStr(str) {
    var obj = { value: 0 }
    str.split('').forEach(function(item) {
        obj[item] ? obj[item]++ : (obj[item] = 1)
        if (obj[item] > obj.value) {
            obj.value = obj[item];
            obj.char = item;
        }
    })
    return obj
}
/**
 *柯里化
 */
function curing(item) {
    var cur = item;
    var iner = function(nextItem) {
        if (nextItem != null) {
            cur += nextItem;
        }
        return cur;
    }
    iner.toString = function() {
        return cur;
    }
    return iner;
}
/**
 *二分法
 *非递归
 */
function getNumber(arr, item) {
    var d = arr.length - 1;
    var l = 0;
    while (l <= d) {
        var m = Math.floor((d + l) / 2);
        if (item == arr[m]) {
            return m
        } else if (item > arr[m]) {
            l = m + 1;
        } else {
            d = m - 1;
        }
    }
    return false;
}
/**
 *发布订阅
 *pub-sub
 */
function pubSub() {
    var pub = {};
    pub.clientList = [];
    pub.listen = function(fn) {
        pub.clientList.push(fn);
    }
    pub.trigger = function() {
        for (var i = 0; i < this.clientList.length; i++) {
            this.clientList[i].apply(this, arguments);
        }
    }
}
/**
 *发布订阅
 *pub-sub
 *订阅自己感兴趣的内容
 */
function pubSub() {
    var pub = {};
    pub.clientList = {};
    pub.listen = function(key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = []
        }
        this.clientList[key].push(fn)
    }
    pub.trigger = function() {
        var key = Array.prototype.shift.call(arguments);
        var fns = this.clientList[key];
        for (var i = 0; i < fns.length; i++) {
            fns[i].apply(this, arguments);
        }
    }
}
/**
发布订阅
*pub-sub
*动态设置发布者
*/
function pubSub() {
    var pubs = {};
    var event = {
        clientList: {},
        listen: function(key, fn) {
            if (!this.clientList[key]) {
                this.clientList[key] = []
            }
            this.clientList[key].push(fn)
        },
        trigger: function() {
            var key = Array.prototype.shift.call(arguments);
            var fns = this.clientList[key];
            if (!fns || fns.length === 0) return false;
            for (var i = 0; i < fns.length; i++) {
                fns[i].apply(this, arguments);
            }
        },
        remove: function(key, fn) {
            var fns = this.clientList[key];
            if (!fns || fns.length == 0) {
                return false;
            } else if (fns.length && !fn) {
                fns.length = 0;
            }
            for (var i = 0; i < fns.length; i++) {
                if (fns[i] == fn) {
                    fns.splice(i, 1);
                    i--;
                }
            }
        }

    };
    var installObj = function(obj) {
        for (var i in event) {
            obj[i] = event[i]
        }
    }
    installObj(pubs);
}
/**
发布订阅
*pub-sub
*动态设置发布者
*/
function pubSub() {
    var event = {
        clientList: {},
        _shift: Array.prototype.shift,
        _slice: Array.prototype.slice,
        _unshift: Array.prototype.unshift,
        namespace: {},
        listen: function(key, fn, cache) {
            if (!cache[key]) {
                cache[key] = []
            }
            cache[key].push(fn)
        },
        _each: function(arr, fn) {
            var ret = {};
            for (var i = 0; i < arr.length; i++) {
                n = arr[i];
                ret = fn.call(n, i, n);
            }
            return ret;
        },
        trigger: function() {
            var cache = _shift.call(arguments);
            var key = _shift.call(arguments);
            var arg = arguments;
            var stag = cache[key];
            var self = this;
            if (!stag || !stag.length) {
                return;
            }
            return this._each(stag, function() {
                return this.apply(self, arg)
            })
        },
        remove: function(key, fn, cache) {
            var fns = cache[key];
            if (!fns || fns.length == 0) {
                return false;
            } else if (fns.length && !fn) {
                fns.length = 0;
            }
            for (var i = 0; i < fns.length; i++) {
                if (fns[i] == fn) {
                    fns.splice(i, 1);
                    i--;
                }
            }
        }

    };
    var installObj = function(obj) {
        for (var i in event) {
            obj[i] = event[i]
        }
    }
    installObj(pubs);
}

//缓动动画
function easeout(A, B, rate, callback) {
    if (A == B || typeof A != 'number') {
        return
    }
    B = B || 0;
    rate = rate || 2;
    var step = function() {
        A = A - (A - B) / rate;
        if (A < 1) {
            callback(B, false);
        } else {
            callback(A, false);
        }
        requestAnimationFrame(step);
    }
    step();
}
var doc = document.body.scrollTop ? document.body : documnent.documentElement;
easeout(doc.scrollTop, 0, 4, function(value) {
    doc.scrollTop = value;
})

//animation.js
var animationJs = function(from, to, durating, easing, fn) {
        var isUndefined = function(obj) {
            return typeof obj == 'undefined'
        }
        var isfun = function(obj) {
            return typeof obj == 'function'
        }
        var isNum = function(obj) {
            return typeof obj == 'number'
        }
        var isStr = function(obj) {
                return typeof obj == 'string'
            }
            //转化成毫秒
        var toMillisecond = function(obj) {
                if (isNum(obj)) {
                    return obj
                } else if (isStr(obj)) {
                    if (/^\d+m?s/.test(obj)) {
                        if (/ms/.test(obj)) {
                            return 1 * obj.replace('ms', '')
                        }
                        return 1000 * obj.replace('s', '')
                    } else if (/^\d+$/.test(obj)) {
                        return +obj
                    }
                    return -1
                }
            }
            //tween
        var tween = Math.tween || window.tween;
        if (!tween) {
            if (window.console) {
                console.error('tween is undefined');
            }
            return 0
        }

        var option = {
            durating: 300,
            easing: 'Linear',
            fn: function() {}
        }
        var setOptions = function(obj) {
            if (isfun(obj)) {
                option.fn = obj;
            } else if (toMillisecond(obj) != -1) {
                option.durating = toMillisecond(obj)
            } else if (isStr(obj)) {
                option.easing = obj;
            }
        }
        setOptions(fn);
        setOptions(durating);
        setOptions(easing);

        //requestAnimationFrame兼容性
        if (!window.requestAnimationFrame) {
            requestAnimationFrame = function(fn) {
                return setTimeout(fn, 17)
            }
        }

        var start = 0;
        var during = option.durating / 17;
        option.easing = option.easing.slice(0, 1).toUpperCase() + option.easing.slice(1);
        var arrTween = option.easing.split('.');
        var getNewValue;
        if (arrTween.length == 1) {
            getNewValue = tween[arrTween[0]]
        } else if (arrTween.length == 2) {
            getNewValue = tween[arrTween[0]] && tween[arrTween[0]][arrTween[1]]
        }
        if (!isfun(getNewValue)) {
            return 0;
        }

        var step = function() {
            var value = getNewValue(start, from, to, -from, during);
            start++;
            if (start <= during) {
                option.fn(value)
                requestAnimationFrame(step);
            } else {
                option.fn(to)
            }
        }
        step();
    }
    //拖拽插件
;
(function(window, undefined) {
    var dom = {
        //绑定事件
        on: function(node, name, fn) {
            if (node.addEventListener) {
                node.addEventListener(name, fn)
            } else {
                node.attachEvent(on + name, fn)
            }
        },
        //获取元素的样式
        getCss: function(node, name) {
            var styleVal = null;
            if (window.getComputedStyle) {
                styleVal = window.getComputedStyle(node, null)[name]
            } else if (node.currentStyle) {
                styleVal = node.currentStyle[name]
            }
            return styleVal;
        },
        //获取设置元素的样式
        setCss: function(node, css) {
            for (var key in css) {
                node.style[key] = css[key]
            }
        }
    };

    //#region 拖拽元素类
    function dragEle(node) {
        this.node = node;
        this.x = 0;
        this.y = 0;
    }
    dragEle.prototype = {
        constructor: dragEle,
        init: function() {
            this.setEleCss({ 'left': dom.getCss(node, 'left'), top: dom.getCss(node, 'top') }).setXy(node.style.left, node.style.top)
        },
        setEleCss: function(css) {
            dom.setCss(this.node, css)
            return this;
        },
        setXy: function(x, y) {
            this.x = parseInt(x) || 0;
            this.y = parseInt(y) || 0;
            return this
        }
    }

    //#endregion

    //#region 鼠标元素
    function Mouse() {
        this.x = 0;
        this.y = 0;
    }
    Mouse.prototype.setCss = function(x, y) {
            this.x = parseInt(x);
            this.y = parseInt(y);
        }
        //#endregion

    //拖拽配置
    var config = {
        dragObj: null,
        mouse: new Mouse(),
        zIndex: 1
    }

    function Drag(ele) {
        this.ele = ele;

        function mousedown(event) {
            var ele = event.target || event.srcElement;
            config.mouse.setXy(event.clientX, event.clientY);
            config.dragObj = new dragEle(ele);
            config.dragObj.setXy(ele.style.left, ele.style.top)
                .setEleCss({ 'zIndex': config.zIndex++, 'position': 'relative' })
        }
        dom.on(ele, 'musedown', mousedown);
    }
    dom.on(document, 'mousemove', function(event) {
        if (config.dragObj) {
            var mouse = config.mouse(),
                dragObj = config.dragObj;
            dragObj.setEleCss({ 'left': event.clientX - mouse.x + dragObj.x, 'top': event.clientY - mouse.y + dragObj.y })
        }
    })
    dom.on(document, 'mouseup', function() {
        config.dragObj = null;
    })

    window.Drag = Drag;
})(window, undefined);
//分页插件
;
(function($, window, document, undefined) {
    "use strict";
    var defaults = {
        pageIndex: 0,
        pageSize: 6,
        itemCount: 50,
        maxButtonCount: 7,
        prevText: "上一页",
        nextText: "下一页",
        buildPageUrl: null,
        onPageChanged: null
    };

    function Pager($ele, options) {
        this.$ele = $ele;
        this.options = options = $.extend(defaults, options || {});
        this.init();
    }
    Pager.prototype = {
        constructor: Pager,
        init: function() {
            this.renderHtml();
            this.bindEvent();
        },
        renderHtml: function() {
            var options = this.options;

            options.pageCount = Math.ceil(options.itemCount / options.pageSize);
            var html = [];

            //生成上一页的按钮
            if (options.pageIndex > 0) {
                html.push('<a page="' + (options.pageIndex - 1) + '" href="' + this.buildPageUrl(options.pageIndex + 1) + '" class="flip">' + options.prevText + '</a>');
            } else {
                html.push('<span class="flip noPage">' + options.prevText + '</span>');
            }

            //这里是关键
            //临时的起始页码中间页码，当页码数量大于显示的最大按钮数时使用
            var tempStartIndex = options.pageIndex - Math.floor(options.maxButtonCount / 2) + 1;

            //计算终止页码，通过max计算一排按钮中的第一个按钮的页码，然后计算出页数量
            var endIndex = Math.min(options.pageCount, Math.max(0, tempStartIndex) + options.maxButtonCount) - 1;
            var startIndex = Math.max(0, endIndex - options.maxButtonCount + 1);

            // 第一页
            if (startIndex > 0) {
                html.push("<a href='" + this.buildPageUrl(0) + "' page='" + 0 + "'>1</a> ");
                html.push("<span>...</span>");
            }

            //生成页码按钮
            for (var i = startIndex; i <= endIndex; i++) {
                if (options.pageIndex == i) {
                    html.push('<span class="curPage">' + (i + 1) + '</span>');
                } else {
                    html.push('<a page="' + i + '" href="' + this.buildPageUrl(options.pageIndex + 1) + '">' + (i + 1) + '</a>');
                }
            }

            // 最后一页
            if (endIndex < options.pageCount - 1) {
                html.push("<span>...</span> ");
                html.push("<a href='" + this.buildPageUrl(options.pageCount - 1) + "' page='" + (options.pageCount - 1) + "'>" + options.pageCount + "</a> ");
            }

            //生成下一页的按钮
            if (options.pageIndex < options.pageCount - 1) {
                html.push('<a page="' + (options.pageIndex + 1) + '" href="' + this.buildPageUrl(options.pageIndex + 1) + '" class="flip">' + options.nextText + '</a>');
            } else {
                html.push('<span class="flip noPage">' + options.nextText + '</span>');
            }

            this.$ele.html(html.join(""));
        },
        bindEvent: function() {
            var that = this;
            that.$ele.on("click", "a", function() {
                that.options.pageIndex = parseInt($(this).attr("page"), 10);
                that.renderHtml();
                that.options.onPageChanged && that.options.onPageChange(that.options.pageIndex);
            })
        },
        buildPageUrl: function() {
            if ($.isFunction(this.options.buildPageUrl)) {
                return this.options.buildPageUrl(pageIndex);
            }
            return "javascript:;";
        }
    };


    $.fn.pager = function(options) {
        options = $.extend(defaults, options || {});

        return new Pager($(this), options);
    }

})(jQuery, window, document);

//面对对象
(function() {
    //私有静态成员
    var user = '';
    //私有静态方法
    function privateStaticMethod() {

    }
    var Box = function(val) {
            //私有成员
            var value = ''
                //私有方法
            function privateMethod() {}
            //公有方法
            this.getUser = function() {}
                //公有属性
            this.user = val
        }
        //公有共享方法
    Box.prototype.shareMethod = function() {}
        //公有共享属性
    Box.prototype.sharePro = ''
        //公有静态方法
    Box.staticMethod = function() {}
        //公有静态属性
    Box.val = '';

})()

//一个社交网络有一组成员（member），每个成员有一个自己的名字，和存储其朋友信息的列表。请实现这样一个Member构造器。
function Member(name) {
    this.name = name
}
Member.prototype.friends = [];

//实现一个inNetwork方法，判断某目标成员是否在另一个对象成员的社交圈中。规定：顺着社交链能找到目标成员，就认为在社交圈中。否则，不在其社交圈。
Member.prototype.inNetWork = function(target) {
    var visits = {}
    var worklist = [this];
    while (worklist.length > 0) {
        var member = worklist.pop();
        // 如果存在环的情况，需要避免重复访问
        if (member.name in visited) {
            continue;
        }
        visited[member.name] = member;
        if (member === target) {
            return true;
        }
        // 将当前成员的朋友列表加入worklist当中，他们都在根节点的社交链上
        member.friends.forEach(function(friend) {
            worklist.push(friend);
        })
    }
    return false;
}

//单例模式
var printer = (function() {
    var printerIntance;

    function create() {
        function print() {}

        function getout() {}
        return {
            print: print,
            getout: getout
        }
    }
    return {
        getIntance: function() {
            printerIntance = new create();
            return printerIntance;
        }
    }

})()

//js 实现css样式的get set
function getStyle(ele, style) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(ele, null).getPropertyValue(style);
    } else {
        if (style == 'opacity') {
            getIEOpacity(ele);
        } else if (style == 'float') {
            return ele.currentStyle.getAttribute('styleFloat');
        } else if (style == 'width' || 'height') {
            var clientRec = ele.getBoundingClientRect();
            return (style == 'width' ? clientRec.right - clientRec.left : clientRec.bottom - clientRec.top);
        }
        return ele.currentStyle.getAttribute(camelize(style));
    }
}

function getIEOpacity(elem) {
    var filter = null;

    // 早期的 IE 中要设置透明度有两个方法：
    // 1、alpha(opacity=0)
    // 2、filter:progid:DXImageTransform.Microsoft.gradient( GradientType= 0 , startColorstr = ‘#ccccc’, endColorstr = ‘#ddddd’ );
    // 利用正则匹配，注意 ?: 的用法
    filter = elem.style.filter.match(/(?:progid:[\w.]+.)?alpha\((?:[^,]+,)?\s*opacity=(\d+)\s*\)/i) || elem.style.filter.match(/alpha\(opacity=(.*)\)/i);

    if (filter) {
        var value = parseFloat(filter);
        if (!isNaN(value)) {
            // 转化为标准结果
            return value ? value / 100 : 0;
        }
    }
    // 默认返回 1
    return 1;
}
// IE 下将 CSS 命名转换为驼峰表示法
// background-color --> backgroundColor
// 利用正则处理一下就可以了
function camelize(str) {
    //正则中（）是用于捕获匹配
    // /\-(\w)/g 正则内的 (\w) 是一个捕获，对应后面 function 的 letter
    // 意思是将 匹配到的 -x 结构的 x 转换为大写的 X (x 这里代表任意字母)
    return str.replace(/\-(\w)/g, function(all, letter) {
        return letter.toUpperCase();
    })
}
//set css
function setCss(ele, style, value) {
    // 如果是设置 opacity ，需要特殊处理
    if (style == "opacity") {

        //IE7 bug:filter 滤镜要求 hasLayout=true 方可执行（否则没有效果）
        if (!elem.currentStyle || !elem.currentStyle.hasLayout) {
            // 设置 hasLayout=true 的一种方法
            elem.style.zoom = 1;
        }
        // IE678 设置透明度叫 filter ，不是 opacity
        style = "filter";

        // !!转换为 boolean 类型进行判断
        if (!!window.XDomainRequest) {
            value = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=" + value * 100 + ")";
        } else {
            value = "alpha(opacity=" + value * 100 + ")"
        }
    } else {
        ele.style.cssText += ';' + (style + ':' + value);
    }
}

//组合模式
var folder = function(name) {
    this.name = name;
    this.files = [];
    this.parents = null;
}
folder.prototype.add = function(file) {
    file.parents = this;
    this.files.push(file);
}
folder.prototype.scan = function() {
    console.log('scan this folder: ' + this.name);
    for (var i = 0; i < this.files.length; i++) {
        this.files[i].scan();
    }
}

var file = function(name) {
    this.name = name;
    this.parents = null;
}
file.prototype.add = function() {
    console.log('error');
}
file.prototype.scan = function() {
    console.log('scan this file:' + this.name)
}
file.prototype.remove = function() {
    if (!this.parents) {
        console.log('false');
        return
    }
    for (var i = 0; i < this.parents.files.length; i++) {
        if (this == this.parents.files[i]) {
            this.parents.files.splice(i, 1);
        }
    }
}

//es5 实现promise
function myPromise(fn) {
    this.value;
    this.status = 'pending';
    this.resolveFunc = function() {};
    this.rejectFunc = function() {}
    fn(this.resolve.bind(this), this.reject.bind(this))
}
myPromise.prototype.reject = function(val) {
    var self = this;
    if (this.status == 'pending') {
        this.status = 'reject';
        this.value = val;
        setTimeout(function() {
            self.rejectFunc(self.value)
        }, 0)
    }
}
myPromise.prototype.resolve = function(val) {
    var self = this;
    if (this.status == 'pending') {
        this.status = 'resolve';
        this.value = val;
        setTimeout(function() {
            self.resolveFunc(self.value)
        }, 0)
    }
}
myPromise.prototype.then = function(resolveFun, rejectFun) {
    var self = this;
    return new myPromise(function(resolve_next, reject_next) {
        function resolveFunWrap() {
            var result = resolveFun(self.value);
            if (result && typeof result.then == 'function') {
                result.then(resolve_next, reject_next)
            } else {
                resolve_next(result);
            }

        }

        function rejectFunWrap() {
            var result = rejectFun(self.value);
            if (result && typeof result.then == 'function') {
                result.then(resolve_next, reject_next)
            } else {
                reject_next(result);
            }
        }
        self.resolveFunc = resolveFunWrap;
        self.rejectFunc = rejectFunWrap;
    })

}

//迭代器
//内部迭代
var each = function(array, callback) {
    for (var i = 0; i < array.length; i++) {
        callback.call(array[i], array[i], i)
    }
}
each([1, 2, 3], function(n, i) { console.log(n + '' + i) })

//外部迭代
var iterator = function(obj) {
        var current = 0;
        var next = function() {
            current++;
        }
        var isDone = function() {
            return current >= obj.length;
        }
        var getCurrent = function() {
            return obj[current];
        }
        return {
            isdone: isDone,
            next: next,
            getCurrent: getCurrent
        }
    }
    //使用外部迭代 比较数组
var compare = function(iterators1, iterator2) {
    while (!iterators1.isdone() && !iterator2.isdone()) {
        if (iterator2.getCurrent() != iterator1.getCurrent()) {
            alert('false');
            return;
        }
        iterator2.next();
        iterators1.next();
    }
    alert('true');
}
var iterator1 = new iterator([1, 2, 3]);
var iterator2 = new iterator([1, 2, 3]);
compare(iterator1, iterator2);

//代理模式
var multi = function() {
    console.log('mutli');
    var a = 1;
    for (var i = 0; i < arguments.length; i++) {
        a = a * arguments[i];
    }
    return a;
}

var getMulti = (function(array) {
    var cache = {};
    return function() {
        var arg = Array.prototype.join.call(arguments, ',');
        if (arg in cache) {
            return cache[arg];
        }
        return cache[arg] = multi.apply(this, arguments);
    }
})()
console.log(getMulti(1, 2, 3, 4));
console.log(getMulti(1, 2, 3, 4));

//判断整数 只能处理32位以内的数字 ES6提供了Number.isInteger
function isInteger(num) {
    return parseInt(num, 10) == num;
}

(function() {
    var types = ['Boolen', 'Number', 'Array', 'Object', 'String', 'Date', 'Function'];
    for (var i = 0; i < types.length; i++) {
        var t = types[i];
        baseValid['is' + t] = (function(type) {
            return function(obj) {
                return object.prototype.toString.call(obj) === '[Oject ' + type + ']';
            }
        })(t)
    }
})()
//单链表反转
//定义两个指针P，Q；
//Q是P的next；
//贯穿的思想是将P后面的一个插入到Head之后，后面的连接起来；
//前提是P的后一个非空
function elList(list) {
    var p = list.head,
        q = null;
    while (p.next != null) {
        q = p.next;
        p.next = q.next;
        q.next = list.head.next;
        list.head.next = q;
    }
    return list;
}
//快排
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    var index = arr.splice(Math.floor(arr.length / 2), 1)[0]
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < index) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([index], quickSort(right));
}
//构造函数
funtion Cat(name, color) {
        this.name = name;
        this.color = color;
        this.meow = function() {
            console.log('wewe')
        }
    }
    //prototype
function Animal(name) {
    this.name = name;
}
Animal.prototype.color = 'white;'

//constructor
function P() {}
p.prototype.constructor = P;
//instanceof
function Pa(name) {
    if (this instanceof Pa) {
        this.name = name;
    } else {
        new Pa(name);
    }
}
//creat
var A = {
    print: function() {
        console.log(1)
    }
}
var B = Object.create(A);
B.print = A.print;

if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        var F = function() {}
        F.prototype = obj;
        return new F()
    }
}
Object.create(Oject.prototype)

//isPrototypeOf
var Obj = {};
var obj1 = Object.create(Obj);
Obj.isPrototypeOf(obj1);
//__proto__
var P = function() {}
var p = new P()
p.__proto__ = P.prototype;
//原型对象
obj.constructor.prototype
p.__proto__
Object.getPrototypeOf(p)

//add(1) 1
//add(1,2) 3
//add(1,2)(3) 6
function add() {
    var arg = Array.prototype.slice.call(arguments);
    var fn = function() {
        var arg_fn = Array.prototype.slice.call(arguments);
        return add.apply(null, arg.concat(arg_fn))
    }
    fn.valueOf = function() {
        return arg.reduce(function(a, b) {
            return a + b
        })
    }
    return fn;
}

//多重继承
function parent1(param) {
    this.param = param
}

function parent2(param) {
    this.param = param
}
parent1.prototype.fn1 = function() {
    console.log('p1+fn1')
}
parent2.prototype.fn2 = function() {
    console.log('p2+fn2')
}

function subFn(child) {
    var F = function() {}
    for (var i = 0; i < arguments.length; i++) {
        var keys = Object.keys(arguments[i].prototype)
        for (var j = 0; j < k.length; j++) {
            F.prototype[key] = arguments[i].prototype[key]
        }
    }
    child.prototype = new F()
    child.prototype.constructor = child
}

function child1(param) {
    parent1.call(this, param)
    parent2.call(this, param)
}
subFn(child1, parent1, parent2)