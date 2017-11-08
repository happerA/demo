/**
 * class 发布类observer that are attached to each observed
 * param{[type]} value[vm参数]
 */
function observe(value, asRootData) {
    if (!value || typeof value !== 'object') {
        return
    }
    return new Observer(value)
}

function Observer(value) {
    this.value = value
    this.walk(value)
}
Observer.prototype = {
    walk: function(obj) {
        var self = this
        Object.keys(obj).forEach(key => {
            self.observerProperty(obj, key, obj[key])
        })
    },
    observerProperty: function(obj, key, value) {
        let dep = new Dep()
        let childOb = observe(value)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                if (Dep.target) {
                    dep.depend()
                }
                if (childOb) {
                    childOb.dep.depend()
                }
                return value;
            },
            set: function(newval) {
                if (value === newval || (newval !== newval && value !== value)) {
                    return
                }
                value = newval
                childOb = observe(newval)
                dep.notify()
            }
        })
    }
}

/** 
 * class 依赖Dep
 */

let uid = 0

function Dep() {
    this.id = uid + 1
    this.subs = []
}
Dep.target = null
Dep.prototype = {
    /**
     * 添加订阅
     * param{[watcher]}sub[订阅者]
     */
    addSub: function(sub) {
        this.subs.push(sub)
    },
    /**
     * [移除订阅者]
     * param{[watcher]}sub[订阅者]
     */
    removeSub: function(sub) {
        let index = this.subs.indexOf(sub)
        if (index != -1) {
            this.subs.splice(index, 1)
        }
    },
    /**
     * [通知数据变更]
     */
    notify: function() {
        this.subs.forEach(sub => {
            sub.update()
        })
    },
    //add Watcher
    depend: function() {
        Dep.target.addDep(this)
    }
}

//compile
/**
 * 
 * @param {*} el 
 * @param {*} value 

function Compile(el, value) {
    this.$val = value
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    if (this.$el) {
        this.compileElement(this.$el)
    }
}
Compile.prototype = {
    compileElement: function(el) {
        let self = this
        let childNodes = el.childNodes;
        Array.prototype.slice.call(childNodes).forEach(node => {
            let text = node.textContent
            let reg = /\{\{((?:.|\n)+?)\}\}/

            //如果是element节点
            if (self.isElementNode(node)) {
                self.compile(node)
            }
            //是text节点
            else if (self.isTextNode(node) && reg.test(text)) {
                //匹配第一个选项
                self.compileText(node, RegExp.$1.trim())
            }
            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node)
            }
        })
    },
    compile: function(node) {
        let nodeAttrs = node.attributes
        let self = this;
        Array.prototype.slice.call(nodeAttrs).forEach(attr => {
            var attrName = attr.name
            if (self.isDirective(attrName)) {
                var exp = attr.value
                node.innerHTML = typeof this.$val[exp] === 'undefined' ? '' : this.$val[exp]
                node.removeAttribute(attrName)
            }
        })
    },
    compileText: function(node, exp) {
        node.textContent = typeof this.$val[exp] === 'undefined' ? '' : this.$val[exp]
    },
    isElementNode: function(node) {
        return node.nodeType === 1
    },
    isTextNode: function(node) {
        return node.nodeType === 3
    },
    isDirective: function(attr) {
        return attr.indexOf('x-') === 0
    }
} */
/**
 * class 指令解析类compile
 * param {[type]} el [element节点]
 * param{[type]}vm[mvvm实例]
 */
function Compile(el, vm) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)

    if (this.$el) {
        this.$fragment = this.nodeFragment(this.$el)
        this.compileElement(this.$fragment)

        //将文档啊碎片放回dom中
        this.$el.appendChild(this.$fragment)
    }
}
Compile.prototype = {
    compileElement: function(el) {
        let self = this
        let childNodes = el.childNodes
        Array.prototype.slice.call(childNodes).forEach(node => {
            let text = node.textContent
            let reg = /\{\{((?:.|\n)+?)\}\}/

            if (self.isElementNode(node)) {
                self.compile(node)
            } else if (self.isTextNode && reg.test(text)) {
                self.compileText(node, RegExp.$1)
            }
            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node)
            }
        })
    },
    nodeFragment: function(el) {
        let fragment = document.createDocumentFragment()
        let child

        while (child = el.firstChild) {
            fragment.appendChild(child)
        }
        return fragment
    },
    compile: function(node) {
        let nodeAttrs = node.attributes
        let self = this

        Array.prototype.slice.call(nodeAttrs).forEach(attr => {
            var attrName = attr.name
            if (self.isDirective(attrName)) {
                var exp = attr.value
                var dir = attrName.substring(2)
                console.log(dir)

                //事件指令
                if (self.isEventDirective(dir)) {
                    compileUtil.eventHandler(node, self.$vm, exp, dir)
                } else {
                    compileUtil[dir] && compileUtil[dir](node, self.$vm, exp, dir)
                }

                node.removeAttribute(attrName)
            }
        })
    },
    compileText: function(node, exp) {
        compileUtil.text(node, this.$vm, exp)
    },
    isElementNode: function(node) {
        return node.nodeType === 1
    },
    isTextNode: function(node) {
        return node.nodeType === 3
    },
    isDirective: function(attr) {
        return attr.indexOf('x-') === 0
    },
    isEventDirective: function(dir) {
        return dir.indexOf('on') === 0
    }
}

//定义$elm 缓存当前执行input事件的input 的dom对象
let $elm
let timer = null
const compileUtil = {
    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html')
    },
    text: function(node, vm, exp) {
        this.bind(node, vm, exp, 'text')
    },
    class: function(node, vm, exp) {
        this.bind(node, vm, exp, 'class')
    },
    model: function(node, vm, exp) {
        this.bind(node, vm, exp, 'model')
        let self = this
        let val = this._gettVmval(vm, exp)

        //监听input事件
        node.addEventListener('input', function(e) {
            let newVal = e.target.value
            $elm = e.target
            if (val === newVal) {
                return
            }
            clearTimeout(timer)
            timer = setTimeout(function() {
                self._setVmval(vm, exp, newVal)
                val = newVal
            }, 0)
        })
    },
    bind: function(node, vm, exp, dir) {
        let updaterFn = updater[dir + 'Updater']

        updaterFn && updaterFn(node, this._gettVmval(vm, exp))
        new Watcher(vm, exp, function(val, oldVal) {
            updaterFn && updaterFn(node, val, oldVal)
        })
    },
    //事件处理
    eventHandler: function(node, vm, exp, dir) {
        let eventType = dir.split(':')[1]
        let fn = vm.$options.methods && vm.$options.methods[exp]

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false)
        }
    },
    /**
     * [获取挂载在vm实例的value]
     * param {[type]} vm[mvvm实例]
     * param {[type]} exp[expression]
     */
    _gettVmval: function(vm, exp) {
        let val = vm
        exp = exp.split('.')
        exp.forEach(key => {
            key = key.trim()
            val = val[key]
        })
        return val
    },
    /**
     * [设置挂载在vm实例的value]
     * param {[type]} vm[mvvm实例]
     * param {[type]} exp[expression]
     * param {[type]} val[新值]
     */
    _setVmval: function(vm, exp, value) {
        let val = vm
        exps = exp.split('.')
        exps.forEach((key, index) => {
            key = key.trim()
            if (index < exps.length - 1) {
                val = val[key]
            } else {
                val[key] = value
            }
        })
        return val
    }
}

//指令渲染集合
const updater = {
    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value
    },
    textUpdater: function(node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value
    },
    classUpdater: function() {},
    modelUpdater: function(node, value, oldVal) {
        //不对当前操作input进行渲染
        if ($elm === node) { return false }
        $elm = undefined
        node.value = typeof value === 'undefined' ? '' : value
    }
}

/**
 * class 观察类
 * param {[type]} vm [实例]
 * param {[type]} expOrFn [属性表达式]
 * param {[function]} cb [回调函数]
 */
function Watcher(vm, expOrFn, cb) {
    this.vm = vm
    expOrFn = expOrFn.trim()
    this.expOrFn = expOrFn
    this.cb = cb
    this.depIds = {}
    if (typeof expOrFn === 'function') {
        this.getter = expOrFn
    } else {
        this.getter = this.parseGetters(expOrFn)
    }
    this.value = this.get()
}
Watcher.prototype = {
    update: function() {
        this.run()
    },
    run: function() {
        let newVal = this.get()
        let oldVal = this.value
        if (newVal === oldVal) {
            return
        }
        this.value = newVal

        //将newVal oldVal挂载在mvvm实例上
        this.cb.call(this.vm, newVal, oldVal)
    },
    get: function() {
        Dep.target = this
        let value = this.getter.call(this.vm, this.vm)
        Dep.target = null
        return value
    },
    addDep: function(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this)
            this.depIds[dep.id] = dep
        }
    },
    parseGetters: function(exp) {
        if (/[^\w.$]/.test(exp)) return
        let exps = exp.split('.')

        //简易的循环依赖处理
        return function(obj) {
            for (let i = 0; i < exps.length; i++) {
                if (!obj) return
                obj = obj[exps[i]]
            }
            return obj
        }
    }
}

/**
 * class 双向绑定 mvvm
 * param {[type]} options [description]
 */
function Mvvm(options) {
    this.$options = options || {}
    let data = this._data = this.$options.data
    let self = this
    Object.keys(data).forEach(key => {
        self._proxyData(key)
    })
    observe(data, this)
    new Compile(options.el || document.body, this)
}
Mvvm.prototype = {
    /**
     * [属性代理]
     * param {[type]} key [数据key]
     * param {[type]} setter [属性set]
     * param {[type]} getter [属性get]
     */
    _proxyData: function(key, setter, getter) {
        let self = this
        setter = setter || Object.defineProperty(self, key, {
            configurable: true,
            enumerable: true,
            get: function proxyData() {
                return self._data[key]
            },
            set: function proxySetter(newVal) {
                self._data[key] = newVal
            }
        })
    }
}