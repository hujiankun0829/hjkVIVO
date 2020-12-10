$(function(){
    // 修改登录状态
    const nickname = getCookie('nickname')
    if (nickname) {
        $('.off').addClass('active')
        $('.on').removeClass('active').text(`您好! ${nickname}`)
    
      } else {
        $('.off').removeClass('active')
        $('.on').addClass('active')
      }
    //  准备一个变量拿出商品信息
    let info = null
    // 拿到cookie中的goods_id
    const id = getCookie('goods_id')
    // console.log(id)
    // 根据id去请求数据
    getGoodsInfo()
    async function getGoodsInfo() {
        const goodsInfo = await $.get('../server/getGoodsInfo.php', {goods_id: id}, null, 'json')
        // console.log(goodsInfo)
        // 渲染页面
        bindHtml(goodsInfo.info)
        // 给准备好的变量赋值
        new Enlarge('.enlargeBox')
        info = goodsInfo.info
    }
    

    function bindHtml(info) {
        console.log(info)

        // 渲染左边放大镜位置
        $('.enlargeBox').html(`
            <div class="show">
                <img src="${info.goods_big_logo}" alt="">
                <div class="mask"></div>
            </div>
            <div class="list">
                <p class="active">
                <img src="${info.goods_small_logo}" show="${info.goods_small_logo}" enlarge="${info.goods_small_logo}" alt="">
                </p>
                <p>
                <img src="${info.goods_small_logo}" show="${info.goods_small_logo}" enlarge="${info.goods_small_logo}" alt="">
                </p>
                <p>
                <img src="${info.goods_small_logo}" show="${info.goods_small_logo}" enlarge="${info.goods_small_logo}" alt="">
                </p>
                
            </div>
            <div class="enlarge" style="background-image: url(${info.goods_big_logo});">

            </div>
        `)
        // 商品信息渲染
        $('.goodsInfo').html(`
            <p class="desc">${ info.goods_name }</p>
            <div class="btn-group size">
                <button type="button" class="btn btn-default">S</button>
                <button type="button" class="btn btn-default">M</button>
                <button type="button" class="btn btn-default">L</button>
                <button type="button" class="btn btn-default">XL</button>
            </div>
            <p class="price">
                ￥ <span class="text-danger">${ info.goods_price }</span>
            </p>
            <div class="num">
                <button class="subNum">-</button>
                <input type="text" value="1" class="cartNum">
                <button class="addNum">+</button>
            </div>
            <div>
                <button class="btn btn-success addCart">加入购物车</button>
                <button class="btn btn-warning continue"><a href="./list.html">继续去购物</a></button>
            </div>
        `)
    }

    // 加入购物车点击事件
    $('.goodsInfo').on('click', '.addCart', function () {
        // 拿到localStorage 里面有没有数组
        const cart = JSON.parse(window.localStorage.getItem('cart')) || []
        // 拿到input的value值
        let num = $('.cartNum').val() - 0
        // 判断一下 cart 数组里面有没有这个数据
        const flag = cart.some(item => item.goods_id == id)
        if(flag) {
            // 如果有就拿到这个信息
            const cart_goods = cart.filter(item => item.goods_id == id)[0]
            cart_goods.cart_number = cart_goods.cart_number - 0 + ($('.cartNum').val() - 0)
        }else {
            info.cart_number = num
            cart.push(info)
        }
        // 添加完毕,储存到localStorage
        window.localStorage.setItem('cart', JSON.stringify(cart))
    })

    // - + 事件
    $('.goodsInfo').on('click', '.subNum', function() {
        // 拿到input的value值
        let num = $('.cartNum').val() - 0
        console.log(num)
        // 判断input里的值,如果是1就什么都不做
        if(num == 1) return
        // 否则进行--操作
        $('.cartNum').val(num - 1)
    }).on('click', '.addNum', function() {
        // 拿到input的value值
        let num = $('.cartNum').val() - 0
        console.log(num)
        // 进行++操作
        $('.cartNum').val(num + 1)
    })
    // 放大镜
    function Enlarge(ele) {
        this.ele = document.querySelector(ele)
        this.show = this.ele.querySelector('.show')
        this.mask = this.ele.querySelector('.mask')
        this.enlarge = this.ele.querySelector('.enlarge')
        this.show_width = this.show.clientWidth
        this.show_height = this.show.clientHeight
        this.enlarge_width = parseInt(window.getComputedStyle(this.enlarge).width)
        this.enlarge_height =  parseInt(window.getComputedStyle(this.enlarge).height)
        this.bg_width = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[0])
        this.bg_height = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[1])
        this.list = this.ele.querySelector('.list')
        this.init()
    }
  
    Enlarge.prototype.init = function() {
        this.setScale()
        this.overOut()
        this.move()
        this.change()
    }



    // 调整mask宽高比例
    Enlarge.prototype.setScale = function () {
        this.mask_width = this.show_width * this.enlarge_width / this.bg_width
        this.mask_height = this.show_height * this.enlarge_height / this.bg_height
        this.mask.style.width = this.mask_width + 'px'
        this.mask.style.height = this.mask_height + 'px'

    }


    // 移入移出
    Enlarge.prototype.overOut = function () {
    this.show.addEventListener('mouseover', () => {
        this.mask.style.display = 'block'
        this.enlarge.style.display = 'block'
    })
    this.show.addEventListener('mouseout', () => {
        this.mask.style.display = 'none'
        this.enlarge.style.display = 'none'
    })
    }

    Enlarge.prototype.move = function () {
          // 给show盒子绑定move事件 
        this.show.addEventListener('mousemove', (e) => {
            e = e || window.event
            // 获取坐标点位
            let x = e.offsetX - this.mask_width / 2
            let y = e.offsetY - this.mask_height / 2
            // 边界值判定
            if( x <= 0 ) x = 0
            if( y <= 0 ) y = 0
            if(x >= this.show_width - this.mask_width) x = this.show_width - this.mask_width
            if(y >= this.show_height - this.mask_height) y = this.show_height - this.mask_height
            // 给mask盒子进行left 和top 赋值
            this.mask.style.left = x + 'px'
            this.mask.style.top = y + 'px'
            // 根据公式计算出背景图片移动的距离
            const bg_x = this.enlarge_width * x / this.mask_width
            const bg_y= this.enlarge_height * y / this.mask_height
            // 给enlarge盒子的背景图片定位赋值
            this.enlarge.style.backgroundPosition = `-${ bg_x }px -${ bg_y }px`
        })
    }
    //   图片切换
    Enlarge.prototype.change = function () {
        // 绑定事件

        this.list.addEventListener('click', (e) => {
            e = e || window.event
            const tg = e.target || e.srcElement

            // 判断点击的是哪一个 img 元素
            if(tg.nodeName === 'IMG'){
                // 拿到点击元素的身上的自定义属性
                const show_url = tg.getAttribute('show')
                const enlarge_url = tg.getAttribute('enlarge')
                // 给元素赋值
                this.show.firstElementChild.src = show_url
                this.enlarge.style.backgroundImage = `url(${ enlarge_url })`

                // 给所有P标签取消active
                for(let i = 0; i < this.list.children.length; i++){
                    this.list.children[i].classList.remove('active')
                }
                tg.parentElement.classList.add('active')
            
            }



        })
    }


})
 