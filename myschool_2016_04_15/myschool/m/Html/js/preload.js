preloadimages(['http://www1.chnindustry.cn/Public/img/rotateImg/xzl4.jpg', 'http://www1.chnindustry.cn/Public/img/rotateImg/xzl2.jpg', 'http://www1.chnindustry.cn/Public/img/rotateImg/xzl1.jpg']).done(function(images){
 //当图片全部加载完成之后，执行此处的代码
 //images参数是Array类型，对应加载进来的图像
 //images[0] 对应的是第一张图像
})
 

function preloadimages(arr) {
	var newimages = [],
		loadedimages = 0;
	var postaction = function() {console.log(this)} //此处增加了一个postaction函数
	var arr = (typeof arr != "object") ? [arr] : arr

	function imageloadpost() {
		loadedimages++
		console.log(this)
		if (loadedimages == arr.length) {
			postaction.call(newimages) //加载完成用我们调用postaction函数并将newimages数组做为参数传递进去
		}
	}
	for (var i = 0; i < arr.length; i++) {
		newimages[i] = new Image()
		newimages[i].src = arr[i]
		newimages[i].onload = function() {
			imageloadpost.call(this)
		}
		newimages[i].onerror = function() {
			imageloadpost.call(this)
		}
	}
	return { //此处返回一个空白对象的done方法
		done: function(f) {
			postaction = f || postaction
		}
	}
}