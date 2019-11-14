function inherit(childClass, superClass) {
	var childProto = childClass.prototype,
	super = new superClass();
	var extend = Object.assign(super,childProto)
	childClass.prototype = extend
}