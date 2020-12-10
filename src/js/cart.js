$(function(){
    const nickname = getCookie('nickname')
    if (nickname) {
        $('.off').addClass('active')
        $('.on').removeClass('active').text(`您好! ${nickname}`)
    
      } else {
        $('.off').removeClass('active')
        $('.on').addClass('active')
      }

    const cart = JSON.parse(window.localStorage.getItem('cart')) || []
    if(!cart.length) {
        // 表示购物车没有数据
        // 购物车列表添加hide类名,进行隐藏
        $('.on2').addClass('hide')
        $('.off2').removeClass('hide')
        return
    }
    // 来到这里说明有数据,要进行渲染了
    $('.on2').removeClass('hide')
    $('.off2').addClass('hide')


    // 根据cart进行渲染
    bindHtml()
    function bindHtml() {
        // 决定全选按钮是不是选中
        const selectAll = cart.every(item => item.is_select === '1')
        // 计算商品选中的数量和价格
        let total = 0
        let totalMoney = 0
        cart.forEach(item => {
            if(item.is_select === '1') {
                total += item.cart_number - 0
                totalMoney += item.cart_number * item.goods_price
            }
        })

        let str = `
        <div class="panel panel-info">
            <div class="panel-heading">
                <p class="selectAll">
                    <span>全选:</span>
                    <input type="checkbox" ${ selectAll ? 'checked' : '' }>
                    <span class="text"></span>
                </p>
            </div>
            <div class="panel-body">
            <ul class="goodsList">
        `

        cart.forEach(item => {
            str += `
              <li>
                <div class="select">
                  <input data-id="${ item.goods_id }" type="checkbox" ${ item.is_select === '0' ? '' : 'checked' }>
                </div>
                <div class="goodsImg">
                  <img src="${ item.goods_small_logo }" alt="">
                </div>
                <div class="goodsDesc">
                  <p>${ item.goods_name }</p>
                </div>
                <div class="price">
                  ￥ <span class="text-danger">${ item.goods_price }</span>
                </div>
                <div class="count">
                  <button class="subNum" data-id="${ item.goods_id }">-</button>
                  <input type="text" value="${ item.cart_number }">
                  <button class="addNum" data-id="${ item.goods_id }">+</button>
                </div>
                <div class="xiaoji">
                  ￥ <span class="text-danger">${ (item.goods_price * item.cart_number).toFixed(2) }</span>
                </div>
                <div class="operate">
                  <button class="btn btn-danger del" data-id="${ item.goods_id }">删除</button>
                </div>
              </li>
            `
        })
        str += `
            </ul>
                </div>
                <div class="panel-footer">
                <div class="row buyInfo">
                    <p class="col-sm-4 buyNum">
                    购买总数量: <span class="text-danger cartNum">${ total }</span> 件商品
                    </p>
                    <p class="col-sm-4 buyMoney">
                    购买总价格: <span class="text-danger total">${ totalMoney.toFixed(2) }</span> 元
                    </p>
                    <p class="col-sm-4 operate">
                    <button class="btn btn-success pay" ${ totalMoney === 0 ? 'disabled' : '' }>立即付款</button>
                    <button class="btn btn-danger d-cart">清空购物车</button>
                    </p>
                </div>
                </div>
            </div>
        `

        // 添加到指定标签内
        $('.on2').html(str)
    }

    // 全选按钮点击事件
    $('.on2').on('click', '.selectAll > input', function () {
        console.log('123')
        const type = this.checked
        cart.forEach(item => item.is_select = type ? '1' : '0')
        bindHtml()
        window.localStorage.setItem('cart', JSON.stringify(cart))
        
      })

    // 给选择按钮添加点击事件
    $('.on2').on('click', '.select > input', function() {
        // 拿到当前标签的状态
        const type = this.checked
        // 拿到当前标签的id
        const id = $(this).data('id')
        // 去cart里面找到对应的id ,把is_select修改了
        const info = cart.filter(item => item.goods_id == id)[0]
        info.is_select = type ? '1' : '0'
        // 重新渲染
        bindHtml()
        // 重新把cart储存在localStorage里面
        window.localStorage.setItem('cart', JSON.stringify(cart))
    })
    // ++ 事件
    $('.on2').on('click', '.addNum', function() {
        // 拿到商品id
        const id = $(this).data('id')
        // 找到cart中对应的商品
        const info = cart.filter(item => item.goods_id == id)[0]
        // 修改信息
        info.cart_number = info.cart_number - 0 + 1
        bindHtml()
        window.localStorage.setItem('cart', JSON.stringify(cart))
    })
    // -- 事件
    $('.on2').on('click', '.subNum', function () {
        // 拿到商品id
        const id = $(this).data('id')
        const info = cart.filter(item => item.goods_id == id)[0]
        // 如果是1 就什么都不做了
        if(info.cart_number === 1) return
        info.cart_number = info.cart_number - 0 - 1
        bindHtml()
        window.localStorage.setItem('cart', JSON.stringify(cart))
    })
    // 删除操作
    $('.on2').on('click', '.del', function () {
        const id = $(this).data('id')
        for(let i = 0; i < cart.length; i++) {
            if(cart[i].goods_id == id) {
                cart.splice(i, 1)
                break
            }
        }
        
        bindHtml()
        window.localStorage.setItem('cart', JSON.stringify(cart))
        if(!cart.length) return window.location.reload()
    })



   

    // 清空购物车
    $('.d-cart').on('click', function () {
        // for(let i = 0; i < cart.length; i++) {
                cart.splice(0, cart.length)
        // }
        bindHtml()
        window.localStorage.setItem('cart', JSON.stringify(cart))
        if(!cart.length) return window.location.reload()
    })
})