$(function () {
    const nickname = getCookie('nickname')
    if (nickname) {
        $('.off').addClass('active')
        $('.on').removeClass('active').text(`您好! ${nickname}`)
    
      } else {
        $('.off').removeClass('active')
        $('.on').addClass('active')
      }

    // 准备一个变量, 接受所有的商品信息
    let list = null
    // 准备一个对象, 记录所有可以影响页面主体内容的数据
    const list_info = {
        cat_one: 'all',
        cat_two: 'all',
        cat_three: 'all',
        sort_method: '综合',
        sort_type: 'ASC',
        current: 1,
        pagesize: 12
    }

    // 请求一级分类
    getCateOne()
    async function getCateOne() {
        // 发送请求获取
        const cat_one_list = await $.get('../server/getCateOne.php', null, null, 'json')
        console.log(cat_one_list)

        // 进行渲染
        let str = `<span data-type="all" class="active">全部</span>`
        cat_one_list.list.forEach(item => {
            str += `
                <span data-type="${item.cat_one_id}">${item.cat_one_id}</span>
            `
        })
        $('.cateOneBox > .right').html(str)
    }
    // 请求二级分类
    getCateTwo()
    async function getCateTwo() {
        // 请求二级列表数据
        const cat_two_list = await $.get('../server/getCateTwo.php', {cat_one: list_info.cat_one}, null, 'json')
        console.log(cat_two_list)
        // 渲染二级列表
        let str = '<span data-type="all" class="active">全部</span>'
        cat_two_list.list.forEach(item => {
            str += `<span data-type="${item.cat_two_id}">${item.cat_two_id}</span>`
        })
        $('.catTwoBox > .right').html(str)
    }
    // 请求三级分类
    getCateThree()
    async function getCateThree() {
        const cat_three_list = await $.get('../server/getCateThree.php', {cat_one: list_info.cat_one, cat_two: list_info.cat_two}, null, 'json')
        console.log(cat_three_list)
        // 渲染三级列表
        let str = '<span data-type="all" class="active">全部</span>'
        cat_three_list.list.forEach(item => {
            str += `<span data-type="${item.cat_three_id}">${item.cat_three_id}</span>`
        })
        $('.catThreeBox > .right').html(str)
    }


   
    getTotalPage()
    // 请求总页数,渲染分页器
    async function getTotalPage() {
        const totalInfo = await $.get('./server/getTotalPage.php', list_info, null, 'json')

        // 用jquery-pagination 插件
        $('.pagination').pagination({
            pageCount: totalInfo.total,
            jump: true,
            // 用回调函数,修改current,然后重新申请商品列表数据
            callback (item) {
                list_info.current = item.getCurrent()
                getGoodsList()
            }
        })
    }



     // 请求商品列表
     getGoodsList()
     async function getGoodsList() {
         // 请求商品列表数据
         const goodsList = await $.get('../server/getGoodsList.php', list_info, null, 'json')
         console.log(goodsList)
         // 给全局变量赋值
         list = goodsList.list
 
         // 渲染商品列表
         let str = ''
         goodsList.list.forEach(item => {
             str += `
                 <li class="thumbnail">
                     <img src="${item.goods_big_logo}" alt="..." data-id="${item.goods_id}">
                     <div class="caption">
                         <h3 data-id="${item.goods_id}">${ item.goods_name }</h3>
                         <p class="price">￥ 
                             <span class="text-danger">${item.goods_price}</span>
                         </p>
                             <p> ID: ${item.goods_id}</p>
                         
                     </div>
                 </li>
             `
 
         })
         $('.goodsList > ul').html(str)
 
     }


    // 一级分类列表点击事件, 以委托事件
    $('.cateOneBox').on('click', 'span', function () {
        // 操作类名
        $(this).addClass('active').siblings().removeClass('active')
        // 拿到你点击的那一个
        const type = $(this).data('type')
        // 只要一级分类切换,就把二级三级换成all
        list_info.cat_two = 'all'
        list_info.cat_three = 'all'
        // 把当前页重置到第一页
        list_info.current = 1
        // 修改list_info
        list_info.cat_one = type
        // 从新渲染
        getTotalPage()
        getGoodsList()
        $('.catThreeBox > .right').html('<span data-type="all" class="active">全部</span>')
        // 判断点击的一级分类是否为all
        if(type === 'all') {
            // 让二级列表只显示all
            $('.catTwoBox > .right').html('<span data-type="all" class="active">全部</span>')
        } else {
            // 如果type不是all就 重新渲染二级列表
            getCateTwo()
        }
    })

    // 二级分类点击事件
    $('.catTwoBox').on('click', 'span', function() {
        // 操作类名
        $(this).addClass('active').siblings().removeClass('active')
        // 拿到你点击的那个
        const type = $(this).data('type')
        // 只要二级分类切换, 就把三级重置成all
        list_info.cat_three = 'all'
        // 把当前页重置到第一页
        list_info.current = 1
        // 修改list_info
        list_info.cat_two = type
        // 从新渲染
        getTotalPage()
        getGoodsList()

        // 根据二级的type 来决定是否请求三级分类
        if(type === 'all') {
            $('.catThreeBox > .right').html('<span data-type="all" class="active">全部</span>')
        }else {
            // 如果type不是all 就重新渲染三级列表
            getCateThree()
        }
    })

    // 三级分类点击事件
    $('.catThreeBox').on('click', 'span', function() {
        // 操作类名
        $(this).addClass('active').siblings().removeClass('active')
        // 拿到你点击的那个
        const type = $(this).data('type')
        // 把当前页重置到第一页
        list_info.current = 1
        // 修改list_info
        list_info.cat_three = type
        // 从新渲染
        getTotalPage()
        getGoodsList()
    })
    // 排序点击事件
    $('.sortBox').on('click', 'span', function() {
        // 操作类名
        $(this).addClass('active').siblings().removeClass('active')
        // 拿到这两个的信息
        const method = $(this).attr('data-method')
        const type = $(this).attr('data-type')

        // 修改list_info信息
        list_info.sort_method = method
        list_info.sort_type = type

        // 重新渲染
        getTotalPage()
        getGoodsList()

        // 修改data-type属性
        $(this).attr('data-type', type === 'ASC' ? 'DESC' : 'ASC').siblings().attr('data-type', 'ASC')

    })
    $('.sortBox span:first-child').attr('data-type', 'DESC')

    // 点击跳转详情页
    $('.goodsList ul').on('click', 'img', function () {
        const id = $(this).data('id')
        // console.log(id)
        // 把id设置成cookie
        setCookie('goods_id', id)
        // 跳转详情页
        window.location.href = './detail.html'
    })
    $('.goodsList ul').on('click', 'h3', function () {
        const id2 = $(this).data('id')
        // console.log(id2)
        // 把id设置成cookie
        setCookie('goods_id', id)
        // 跳转详情页
        window.location.href = './detail.html'
    })


})