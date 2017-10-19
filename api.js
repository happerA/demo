//浮点数取整 
//位运算 浮点数先转化为整数http://www.cnblogs.com/xljzlw/p/4231354.html
const x = 12.3456789
x | 0;
x >> 0;
~~x;
Math.floor(x);

//获取6位数字验证码
Math.random().toString.slice(-6)
    ('000000' + Math.floor(Math.random() * 999999)).slice(-6)
'' + Math.random().toFixed(6).slice(-6)
'' + Math.floor(Math.random() * 999999)

//16进制颜色代码转化
(function() {
    return '#' + ('00000' + (Math.random() * 0xffffff >> 0).toString(16)).slice(-6)
})()

//驼峰命名转化为下划
str = str.replace(/[A_Z]/g, function(t) {
    return '_' + t.toLowerCase();
})
'componentMapModelRegistry'.match(/^[a-z0-9]+|[A-Z][a-z0-9]*/g).join('_')

//n纬数组展开为一纬数组
var foo = [1, [2, '3'],
    [4, 5, [3]]
]
foo.toString().split(',')
JSON.parse(`[${JSON.stringify(foo).replace(/\[|]/g, '')}]`)
    //日期格式化
Date.prototype.format = function(fmt) {
    var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds()
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var key in o) {
        if (new RegExp("(" + key + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[key]) : (("00" + o[key]).substr(("" + o[key]).length)))
        }
    }

    return fmt
}
new Date().format('yyyy-MM-dd hh:mm:ss')
    //统计文字个数
function wordCount(str) {
    var pattern = /[a-zA-Z0-9_\u0392-\u03c9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
    var m = str.match(pattern),
        count = 0;
    if (m === null) return count;
    for (var i = 0; i < m.length; i++) {
        if (m[i].charCodeAt(0) >= 0x4E00) {
            count += m[i].length;
        } else {
            count += 1
        }
    }
    return count;
}

//特殊字符转义
function htmlspecialchars(str) {
    str = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/, '&quot;')
    return str
}
//动态插入script
function injectScript(src) {
    var s, t;
    s = document.createElement('script')
    s.type = 'text/javascript';
    s.src = src;
    s.async = true;
    t = document.getElementsByTagName('script')[0]
    t.parentNode.insertBefore(s, t)
}
//格式化数量
function formatNum(num) {
    num = String(num || 0)
    var re = /(-?\d+)(\d{3})/;
    n = re.test(num)
    while (n) {
        num = num.replace(re, '$1,$2')
        n = re.test(num)
    }
    return num;
}
//检测质数
function isPrimeNum(num) {
    if (!isNum(num)) return false
    if (!isInteger(num)) return false
    if (!isDral(num)) return false
    for (var i = 2; i < n / 2 + 1; i++) {
        if (num % i == 0) {
            return true
        }
    }
    return false
}

function isNum(num) {
    return num == +num ? true : false
}

function isInteger(num) {
    return num == ~~num ? true : false
}

function isDural(num) {
    var lastNum = num.toString().slice(-1);
    return lastNum == '2' || lastNum == '5' ? true : false
}
//统计字符相同的次数
var arr = 'asadsadasqqwqw',
    obj = { value: 0 };
arr.split('').map((item) => {
    obj[item] ? obj[item]++ : (obj[item] = 1)
    obj.value = obj[item] > obj.value ? obj[item] : obj.value
});

//两个整数交换数字
var a = 20,
    b = 30;
a ^= b;
b ^= a;
a ^= b;

//数字字符转化为数字
var a = '1223'
a = +a;
//最短数组去重
[...new Set([1, 2.2, 1, 2, 3, 1, 3, 4, 5, 6, 4])]
//长度为6 值为8
Array(6).fill(8)

//arguments 转化为数组
var argArray = Object.prototype.slice.call(arguments);
var argArray = Array.from(arguments)
var argArray = [...arguments];

//时间戳
new Date().getTime() +
    new Date()

//使用~x.indexOf('y')简化 x.indexOf('y')>-1
if (str.indexOf('lo') > -1) {
    //
}
if (~str.indexOf('lo')) {
    //
}
//parseInt Number 
//解析和转化 解析允许字符串有非数字 从左到右解析直到非数字转化不允许有非数字
var a = '530px'
var b = '530';
parseInt(a) //530
Number(a) //NaN
parseInt(b) //530
Number(b) //530

//+拼接操作 +x or String(x)
//a+''隐式转化使用valueof String()使用toString()
[1, 2] + [3, 4]; // "1,23,4"不能通过valueof得到剪短基本类型使用toString()

//数字字面量 像对象那个一样使用
//2.toString() 会报错
2..toString()
    //2 .toString()
    (2).toString()

//四舍五入
11212.1212.toFixed(2)

//v: 值p:精度
function round(v, p) {
    p = Math.pow(10, p >> 31 ? 0 : p | 0)
    v *= p
    return (v + 0.5 + (v >> 31) | 0) / p
}
round(123.23, 2)

//uuid
function uuId() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}