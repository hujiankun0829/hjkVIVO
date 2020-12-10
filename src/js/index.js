$(function() {
    const nickname = getCookie('nickname')
    if (nickname) {
        $('.off').addClass('active')
        $('.on').removeClass('active').text(`您好! ${nickname}`)
    
      } else {
        $('.off').removeClass('active')
        $('.on').addClass('active')
      }
    $('.sousuo').on('click', '.icon', function() {
        const sousuo = $(this).siblings().attr('class')
        console.log(sousuo)
        if(sousuo){
            $(this).siblings().removeClass('sousuolan')
        }else{
            $(this).siblings().addClass('sousuolan')
        }
    })
})
const input = $('.sousuo > .icon').siblings()[0]
const ul = $('.sousuo > .icon').siblings()[1]
console.log(input, ul)

input.addEventListener('keyup', function () {
    // 拿到文本框输入内容
    // trim() 去除首尾空格
    const value = this.value.trim()
    if (!value) {
        ul.classList.remove('active')
        return
    }
    // 准备发送请求
    const script = document.createElement('script')
    const url = `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1463,33037,33058,33098,33100,32961,31709&wd=${value}&req=2&csor=1&cb=bindHtml&_=1605925703796`
    script.src = url
    document.body.appendChild(script)
    script.remove()
})
function bindHtml(res) {
    if(!res.g) {
        ul.classList.remove('active')
        return
    }
    let str = ''
    for(let i = 0; i < res.g.length; i++) {
        str += `
            <li>${ res.g[i].q}</li>
        `
    }

    ul.innerHTML = str
    ul.classList.add('active')
}
