;
(function() {
	//数组移除某个元素
	Array.prototype.remove = function(val) {
		var index = this.indexOf(val);
		if (index > -1) {
			this.splice(index, 1);
		}
	};
	
	//字符串连接
	function StringBuilder() {
		this.data = [];
	}
	StringBuilder.prototype.append = function(item) {
		this.data.push(item);
		return this;
	};
	StringBuilder.prototype.toString = function() {
		return this.data.join("");
	};
	
	//字符串替换
	String.prototype.replaceAll = function(s1, s2) {　　
		return this.replace(new RegExp(s1, "gm"), s2);
	};

	// 两种调用方式
	// var template1="我是{0}，今年{1}了";
	// var template2="我是{name}，今年{age}了";
	// var result1=template1.format("loogn",22);
	// var result2=template2.format({name:"loogn",age:22});
	String.prototype.format = function(args) {
		var result = this;
		if (arguments.length > 0) {
			if (arguments.length == 1 && typeof(args) == "object") {
				for (var key in args) {
					if (args[key] != undefined) {
						var reg = new RegExp("({" + key + "})", "g");
						result = result.replace(reg, args[key]);
					}
				}
			} else {
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] != undefined) {
						var reg = new RegExp("({[" + i + "]})", "g");
						result = result.replace(reg, arguments[i]);
					}
				}
			}
		}
		return result;
	};
})()