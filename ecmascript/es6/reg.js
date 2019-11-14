{
    // 正则预定义模式
    console.log('\n正则预定义模式:')

    function codePointLength(text) {
        var result = text.match(/[\s\S]/gu);
        return result ? result.length : 0;
    }

    let s = '𠮷𠮷';

    console.log(s.length) // 4
    console.log(codePointLength(s)) // 2
}

{
    // i 修饰符
    console.log('\ni 修饰符:')
    let a = /[a-z]/i.test('\u212A') // false
    let b = /[a-z]/iu.test('\u212A') // true
    console.log(a)
    console.log(b)
    console.log('\u004B' === '\u212A')
}