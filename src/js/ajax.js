/*
    封装 ajax
    
    手动抛出异常
        让代码报错,这样就不会执行下面的代码
        语法: throw new Error('xxxx')


    1.验证参数是不是符合规则
        1.1 url 是不是传递了, 是不是一个字符串类型
        1.2 method 可以不传递, 但是只要传递了, 必须是GET 或者 POST
        1.3 data 可以不传递, 但是只要传递了, 必须是 'a=100&b=299'
        1.4 async 可以不传递, 但是只要传递了, 必须是 布尔类型
        1.5 success 可以不传递, 但是只要传递了, 必须是一个函数类型
    2.准备一套默认值
        按照我们的设定准备默认值
        使用 options 里面传递进来的数据, 去把默认值里面的数据替换掉
        判断一下,如果是get 请求,就把data 拼接在 url 的后面
    3.发送请求
    使用_default 里面的一套内容去操作
    把需要参数的位置替换成_default 里面的内容

*/




function ajax(options) {
    // 验证参数
        // 1.1 验证url 必须传递,并且是一个字符串
        // url为undefined是没有传递
        // url的数据类型不是string时,格式错误
        if(options.url === undefined || typeof(options.url) !== 'string' ) {
            throw new Error('URL地址信息错误')
        }
        // 1.2 验证method
        // method可以为 undefined
        // method 可以为 get post 不区分大小写
        if(!(options.method === undefined || /^(get|post)$/i.test(options.method))) {
            throw new Error('目前只支持get 和post 请求方式')
        }
        // 1.3 验证 data
        // data 可以为 undefined
        // data 可以为 'key=value&key=value'
        if(!(options.data === undefined || /^(.+=.+&?)*$/i.test(options.data))) {
            throw new Error('请按照格式传递参数')
        }

        // 1.4 验证async
        // async 可以为 undefined
        // async 可以为布尔值
        if(!(options.async === undefined || typeof(options.async) === 'boolean')) {
            throw new Error('async 只支持布尔值')
        }
        if(!(options.success === undefined || typeof(options.success) === 'function')) {
            throw new Error('success 只能是一个函数类型')
        }


        // 处理默认值
        // 2.1 准备一套默认值
        const _default = {
            // 这里的url必定有值
            url: options.url,
            // 请求方式如果填写了正确的就是填写的,如果没有填写就是默认的GET
            method: options.method || 'GET',
            // data 如果写值了就是填写的,如果没有就是空字符串
            data: options.data || '',
            // 这里只能是一个布尔值,不是true就是false 用三元表达式
            async: typeof(options.async) === 'boolean' ? options.async : true,
            // 这里的success 只能是一个函数,如果没有传进来就是空函数
            success: options.success || function () {}
        }

        // 2.2 判断如果是一个 get 请求, 那么直接把 data 拼接在 url 的后面
        if(_default.method.toUpperCase() === 'GET' && _default.data !== '') {
            _default.url = _default.url + '?' + _default.data
        }
        // 发送请求
        //  3.1 创建对象
        const xhr = new XMLHttpRequest()
        xhr.open(_default.method, _default.url, _default.async)
        xhr.onload = function () {
            // 调用你传递进来的函数
            _default.success(xhr.responseText)
        }

        // 如果是post 请求, 需要设置请求头, 并且在send 的时候填写请求体
        // 如果不是post  直接发送
        if(_default.method.toUpperCase() === 'POST') {
            // 设置请求头
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
            xhr.send(_default.data)
        }else {
            xhr.send()
        }
}


//  promise 的形式进行 ajax 操作的封装
function pAjax(options) {
    return new Promise(function (resolve) {
        ajax({
            url: options.url,
            data: options.data,
            async: options.async,
            method: options.method,
            success (res) {
                resolve(res)
            }
        })
    })
}