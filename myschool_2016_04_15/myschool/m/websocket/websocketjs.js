//一、 握手
//1、 客户端发送请求
//websocket协议提供给javascript的API就是特别简洁易用。
var url = "ws://localhost:8081";
var ws = new WebSocket(url);
ws.onopen = function() {
	console.log("握手成功，打开socket连接了。。。");
	console.log("ws.send(Websocket opened)");
	ws.send(("Websocket opened!"));
};
ws.onmessage = function(e) {
	console.log("message:" + e.data);
};
ws.onclose = function() {
	console.log("断开socket连接了。。。");
};
ws.onerror = function(e) {
	console.log("ERROR:" + e.data);
};