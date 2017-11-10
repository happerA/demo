function INTERNAL() {}

function isFunction(fn) {
    return typeof fn === 'function';
}

function isObjct(obj) {
    return typeof obj === 'object';
}

function isObjectOrFunction(x) {
    return isFunction(x) || (typeof x === 'object' && x !== null)
}

function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

var PENDING = 'pending';
var FULFILLED = 'fulfilled';
var REJECTED = 'rejected';

//异步调用
function asyncCall(fn, args) {
    setTimeout(() => {
        fn.apply(null, args)
    })
}

function initPromise(promise, resolver) {
    //调用传入的resolver函数抛出异常 使用reject当前promise
    try {
        resolver(function(value) {
            //封装函数 resolve(value)
            resolve(promise, value)
        }, function(reason) {
            //封装函数 reject(reson)
            reject(promise, reason)
        })
    } catch (e) {
        reject(promise, e)
    }
}
//promise resolve
function resolve(promise, value) {
    //promise value指向同一对象
    if (promise === value) {
        reject(promise, new TypeError('不可以resolve promise 本地实例'))
    }
    //value是promise对象
    else if (value instanceof Promise) {
        //value处于fulfilled状态 使用相同value值fulfill promise
        if (value._status == FULFILLED) {
            fulfill(promise, value._result)
        }
        //value处于reject状态 使用相同reason值reject promise
        else if (value._status == REJECTED) {
            reject(promise, value._result)
        }
        //value处于pending状态 promise同样pending知道value状态改变
        //重新把resolve(promise, value)添加到队列
        else {
            asyncCall(resolve, [promise, value])
        }
    }
    //value 是对象或者是func
    else if (isObjectOrFunction(value)) {
        //value.then的值抛出异常 通过该异常reject promise
        try {
            let then = value.then
                //then是函数
            if (isFunction(then)) {
                try {
                    handleThenable(promise, value, then)
                } catch (e) {
                    reject(promise, e)
                }
            } else {
                fulfill(promise, value)
            }
        } catch (e) {
            reject(promise, e)
        }
    }
    //value不是对象或函数
    else {
        fulfill(promise, value)
    }
}

function handleThenable(promise, value, then) {
    //是否fulfilled或者rejected
    let settled = false
    try {
        //then是个函数 则把value作为函数中this指向来调用它
        then.call(value, (othervalue) => {
            if (settled) { return }
            resolve(promise, othervalue)
            settled = true
        }, (reason) => {
            if (settled) { return }
            reject(promise, reason)
            settled = true
        })
    } catch (e) {
        if (settled) { return }
        settled = true
        reject(promise, e)
    }
}

function fulfill(promise, value) {
    //状态不是pending 直接返回return
    if (promise._status !== PENDING) { return }
    //状态为fulfilled 设置最终结果
    promise._status = FULFILLED
    promise._result = value
    if (promise._fulfillArr.length > 0) {
        //promise fulfilled 所有的onFulfilled回调函数按照添加顺序执行
        promise._fulfillArr.forEach(function(k, index) {
            asyncCall(dealThen, [promise, promise._childArr[index], k])
        }, this);
    }
}

function reject(promise, reason) {
    //状态不是pending 直接返回return
    if (promise._status !== PENDING) { return }
    //设置状态为rejected 并设置最终结果
    promise._status = REJECTED
    promise._result = reason

    //异步调用onRejected方法
    if (promise._rejectArr.length > 0) {
        //promise rejected所有的onRejected回调函数按照添加顺序执行
        promise._rejectArr.forEach((k, index) => {
            asyncCall(dealThen, [promise, promise._rejectArr[index], k])
        })
    }
}

//处理then
function dealThen(promise, child, x) {
    //onFulfilled onRejected 是个函数
    if (isFunction(x)) {
        //如果onFulfilled onRejected返回一个值 执行resolve(child, value)
        try {
            resolve(child, x(promise._result))
        } catch (e) {
            //如果onFulfilled onRejected异常 执行reject(child, value)
            reject(child, e)
        }
    } else {
        try {
            //onFulfilled 不是函数 则忽略
            if (promise._status = FULFILLED) {
                resolve(child, promise._result)
            } else {
                //onRejected 不是函数 则忽略
                reject(child, promise._result)
            }
        } catch (e) {
            reject(child, e)
        }
    }
}
//内部创建Promise对象时使用的空函数
function noop() {}

class Promise {
    constructor(resolver) {
        this._status = PENDING //保存内部的状态
        this._result = undefined //保存promise对象fulfill reject结果
        this._childArr = [] //调用then方法创建的子promise对象
        this._fulfillArr = [] //调用then方法添加的onFulfilled方法
        this._rejectArr = [] //调用then方法添加的onRejected方法

        if (resolver === noop) { return } //then方法内部创建promise使用

        //resolver 不是函数 抛出错误
        if (!isFunction(resolver)) {
            throw new TypeError('参数不为function')
        }
        //要通过new创建使用
        if (this instanceof Promise) {
            initPromise(this, resolver)
        } else {
            throw new TypeError('Promise不能直接调用')
        }

    }

    then(onFulfilled, onRejected) {
        let child = new Promise(noop)

        //如果状态改变 则直接根据状态调用响应的回调
        if (this._status !== PENDING) {
            if (this._status == FULFILLED) {
                asyncCall(() => {
                    dealThen(this, child, onFulfilled)
                })
            } else {
                asyncCall(() => {
                    dealThen(this, child, onRejected)
                })
            }
        }
        //当前状态是pending 则添加onFulfilled onRejected
        else {
            this._childArr.push(child)
            this._fulfillArr.push(onFulfilled)
            this._rejectArr.push(onRejected)
        }
        //返回新的promise对象
        return child
    }
    catch (onRejected) {
        return this.then(undefined, onRejected)
    }
}

Promise.resolve = function(value) {
    return new Promise(function(resolve) {
        resolve(value)
    })
}
Promise.reject = function(reason) {
    return new Promise(function(resolve, rejct) {
        reject(reason)
    })
}
Promise.all = function(arr) {
    let newPromise = new Promise(noop),
        value = [],
        num = 0
    if (({}).toString.call(arr) === '[object Array') {
        try {
            arr.forEach((k, index) => {
                if (k instanceof Promise) {
                    let timer = setInterval(() => {
                        if (k._status === FULFILLED) {
                            value[index] = k._result;
                            num++
                            clearInterval(timer)
                            if (num == arr.length) {
                                fulfill(newPromise, value)
                            }
                        } else if (k._status == REJECTED) {
                            reject(newPromise, k._result)
                            clearInterval(timer)
                        }
                    }, 0)
                } else {
                    value[index] = k
                    num++
                    if (num === arr.length) {
                        fulfill(newPromise, value)
                    }
                }
            })
        } catch (e) {
            reject(newPromise, e)
        }
    } else {
        reject(newPromise, new TypeError('参数应为promsie数组'))
    }
    return newPromise
}

Promise.race = function(arr) {
    let newPromise = new Promise(noop)
    if (({}).toString.call(arr) === '[object Array]') {
        try {
            arr.forEach((k, index) => {
                if (k instanceof Promise) {
                    let timer = setInterval(() => {
                        if (k._status === FULFILLED) {
                            fulfill(newPromise, k._result)
                            clearInterval(timer)
                        } else if (k._status === REJECTED) {
                            reject(newPromise, k._result)
                            clearInterval(timer)
                        }
                    }, 0)
                } else {
                    fulfill(newPromise, value)
                }
            })
        } catch (e) {
            reject(newPromise, e)
        }
    } else {
        reject(newPromise, new TypeError('参数需是个promise数组'))
    }
    return newPromise
}