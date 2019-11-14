{
    let [a, b, c] = [1, 2, 3]
    console.log(a, b, c)

    let [d, e = 'jnxyx'] = ['hello', 'world']
    console.log(d, e)

    let [f = 1] = [undefined]
    console.log(f)

    function g() {
        console.log('hello world')
    }
    let [h = g()] = [1] // 
    console.log(h)
}