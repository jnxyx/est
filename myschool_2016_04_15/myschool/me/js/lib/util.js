function trim(str, ch) {
    if (typeof str == 'undefined') {
        return '';
    }
    ch = ch ? ch : '\s';
    return eval('str.replace(/(^' + ch + '*)|(' + ch + '*$)/g, "")');
}
function checkMobile(mobile) 
{
    if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobile))) {
        return false;
    }
    return true;
}
function isChinese(s) 
{
    var patrn = /^\s*[\u4e00-\u9fa5]{1,15}\s*$/;
    if (!patrn.exec(s)) 
    {
        return false;
    }
    return true;
}
function isNumber(s) 
{
    return $.isNumeric(s);
}
function isIdCard(s) 
{
    var patrn = /^\s*\d{15}\s*$/;
    var patrn1 = /^\s*\d{16}[\dxX]{2}\s*$/;
    if (!patrn.exec(s) && !patrn1.exec(s)) 
    {
        return false;
    }
    return true;
}
function isCardName(s) 
{
    var patrn = /^\s*[\u4e00-\u9fa5]{1,}[\u4e00-\u9fa5.·]{0,15}[\u4e00-\u9fa5]{1,}\s*$/;
    if (!patrn.exec(s)) 
    {
        return false;
    }
    return true;
}

//检查电子邮箱合法性
function checkEmail(email) {
    if (email == '' || email == 'undefined') 
    {
        return false;
    }
    if (!email.match(/^\w+([._-]\w+)*@(\w+\.)+\w+$/)) 
    {
        return false;
    } 
    else 
    {
        return true;
    }

}
// 检测手机号码和固定电话
function checkPhone(phone) 
{
    phone = $.trim(phone);
    if (phone.substring(0, 1) == '1') 
    {
        return checkMobile(phone);
    }
    if (!(/^\d{7,12}$/.test(phone)) && !(/^([0-9]{3,4}[-\s])?[0-9]{7,8}$/.test(phone))) {
        return false;
    } else {
        return true;
    }
}
/**
 * 获取COOKIE
 * @param c_name  //key名称
 * @returns
 */
var DDZ_COOKIE_PREFIX = "ddz_js_cookie";
function getCookie(c_name) 
{
    c_name = DDZ_COOKIE_PREFIX + c_name;
    if (document.cookie.length > 0) 
    {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) 
        {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) 
            {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

/**
 * 设置cookie
 * @param c_name
 * @param value
 * @param expiredays
 */
function setCookie(c_name, value, expiredays) 
{
    c_name = DDZ_COOKIE_PREFIX + c_name;
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null ) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
}

function checkCookie() 
{
    username = getCookie('username')
    if (username != null  && username != "") 
    {
        alert('Welcome again ' + username + '!')
    } 
    else 
    {
        username = prompt('Please enter your name:', "")
        if (username != null  && username != "") 
        {
            setCookie('username', username, 365)
        }
    }
}

/**
 * 只能输入正整数
 */
$('body').delegate('.input-int', 'keyup', function() {
    var inputNum = $(this).val();
    if (inputNum.length == 1) {
        inputNum = inputNum.replace(/[^0-9]/g, '')
    } else {
        inputNum = inputNum.replace(/\D/g, '');
        if (inputNum.substr(0, 1) == '0') {
            inputNum = inputNum.substr(1);
        }
    }
    $(this).val(inputNum);
});
