{
    // Unicode 正规化
    console.log('Unicode 正规化：')
    let [a, b] = ['\u01D1', '\u004F\u030C']
    console.log(a, b, a === b)
    console.log('a.normalize() === b.normalize():', a.normalize() === b.normalize())
}

{
    // 字符串包含判断
    console.log('\n字符串包含判断：')
    let a = 'jnxyx normal string!'
    console.log(a.startsWith('jnxyx'))
    console.log(a.endsWith('g!'))
    console.log(a.includes('string'))
}

{
    // 字符串重复
    console.log('\n字符串重复：')
    console.log('jnxyx'.repeat(2.9))
}

{
    // 字符串补全
    console.log('\n字符串补全：')
    let [a, b, c, d] = [
        'abc'.padStart(10, '0123456789'),
        '123456'.padStart(10, '0'),
        'x'.padEnd(4),
        '09-12'.padStart(10, 'YYYY-MM-DD')
    ]
    console.log(a, b, c, d)
}

{
    // 模板字符串(增强版的字符串)
    console.log('\n模板字符串：')
    let x = 'jnxyx'
    let a = `<body>
				<div id="location" class="location">
			        ${x}
			    </div>
			</body>`
    console.log(a)
}

{
    // 标签模板
    console.log('\n标签模板：')
    let a = 5;
    let b = 10;
    let tag = (a, b, c) => {
    	console.log(a.raw)
        console.log(a, b, c)
    }

    tag `Hell\no ${ a + b } world ${ a * b }`;
}