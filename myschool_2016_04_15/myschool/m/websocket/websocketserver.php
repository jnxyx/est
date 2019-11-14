<?php
//2、服务器端

//封装的类为WebSocket，address和port为类的属xìng。
//（1）建立socket并监听

function createSocket() {
	$this -> master = socket_create(AF_INET, SOCK_STREAM, SOL_TCP) or die("socket_create() failed:" . socket_strerror(socket_last_error()));

	socket_set_option($this -> master, SOL_SOCKET, SO_REUSEADDR, 1) or die("socket_option() failed" . socket_strerror(socket_last_error()));

	socket_bind($this -> master, $this -> address, $this -> port) or die("socket_bind() failed" . socket_strerror(socket_last_error()));

	socket_listen($this -> master, 20) or die("socket_listen() failed" . socket_strerror(socket_last_error()));

	$this -> say("Server Started : " . date('Y-m-d H:i:s'));
	$this -> say("Master socket  : " . $this -> master);
	$this -> say("Listening on   : " . $this -> address . " port " . $this -> port . "\n");

}

//然后启动监听，同时要维hù连接到服务器的用户的一个数组（连接池），每连接一个用户，就要push进一个，同时关闭连接后要删除相应的用户的连接。

public function __construct($a, $p)
{
	if ($a == 'localhost')
	$this->address = $a;
	else if (preg_match('/^[\d\.]*$/is', $a))
	$this->address = long2ip(ip2long($a));
	else
	$this->address = $p;
	
	if (is_numeric($p) && intval($p) > 1024 && intval($p) < 65536)
	$this->port = $p;
	else
	die ("Not valid port:" . $p);
	
	$this->createSocket();
	array_push($this->sockets, $this->master);
}

//（2）建立连接

//维hù用户的连接池

public function connect($clientSocket)
{
	$user = new User();
	$user->id = uniqid();
	$user->socket = $clientSocket;
	array_push($this->users,$user);
	array_push($this->sockets,$clientSocket);
	$this->log($user->socket . " CONNECTED!" . date("Y-m-d H-i-s"));
}
//（3）回复响应头

//首先要获取请求头，从中取出Sec-Websocket-Key，同时还应该取出Host、请求方式、Origin等，可以进行安全检查，防止未知的连接。

public function getHeaders($req)
{
	$r = $h = $o = null;
	if(preg_match("/GET (.*) HTTP/"   , $req, $match))
	$r = $match[1];
	if(preg_match("/Host: (.*)\r\n/"  , $req, $match))
	$h = $match[1];
	if(preg_match("/Origin: (.*)\r\n/", $req, $match))
	$o = $match[1];
	if(preg_match("/Sec-WebSocket-Key: (.*)\r\n/", $req, $match))
	$key = $match[1];
	
	return array($r, $h, $o, $key);
}
//之后是得到key然后进行websocket协议规定的加密算法进行计算，返回响应头，这样浏览器验证正确后就握手成功了。这里涉及的详细解析信息过程参见另一篇博文http://blog.csdn.net/u010487568/article/details/20569027

protected function wrap($msg="", $opcode = 0x1)
{
	//默认控制帧为0x1（文本数据）
	$firstByte = 0x80 | $opcode;
	$encodedata = null;
	$len = strlen($msg);
	
	if (0 <= $len && $len <= 125)
	$encodedata = chr(0x81) . chr($len) . $msg;
	else if (126 <= $len && $len <= 0xFFFF)
	{
	$low = $len & 0x00FF;
	$high = ($len & 0xFF00) >> 8;
	$encodedata = chr($firstByte) . chr(0x7E) . chr($high) . chr($low) . $msg;
}

return $encodedata;
}
//其中我只实现了发送数据长度在2的16次方以下个字符的情况，至于长度为8个字节的超大数据暂未考虑。
private function doHandShake($user, $buffer)
{
	$this->log("\nRequesting handshake...");
	$this->log($buffer);
	list($resource, $host, $origin, $key) = $this->getHeaders($buffer);
	
	//websocket version 13
	$acceptKey = base64_encode(sha1($key . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', true));
	
	$this->log("Handshaking...");
	$upgrade  = "HTTP/1.1 101 Switching Protocol\r\n" .
	"Upgrade: websocket\r\n" .
	"Connection: Upgrade\r\n" .
	"Sec-WebSocket-Accept: " . $acceptKey . "\r\n\r\n";  //必须以两个回车结尾
	$this->log($upgrade);
	$sent = socket_write($user->socket, $upgrade, strlen($upgrade));
	$user->handshake=true;
	$this->log("Done handshaking...");
	return true;
}
//二、数据传输
//1、客户端
//客户端websocket的API非常容易，直接使用websocket对象的send方法即可。
//       ws.send(message);
//2、服务器端
//客户端发送的数据是经过浏览器支持的websocket进行了maskchǔ理的，而根据规定服务器端返回的数据不能进行掩码chǔ理，但是需要按照协议的数据帧规定进行封装后发送。因此服务器需要接收数据必须将接收到的字节流进行解码。
protected function unwrap($clientSocket, $msg="")
{
	$opcode = ord(substr($msg, 0, 1)) & 0x0F;
	$payloadlen = ord(substr($msg, 1, 1)) & 0x7F;
	$ismask = (ord(substr($msg, 1, 1)) & 0x80) >> 7;
	$maskkey = null;
	$oridata = null;
	$decodedata = null;
	//关闭连接
	if ($ismask != 1 || $opcode == 0x8)
	{
		$this->disconnect($clientSocket);
		return null;
	}
	//获取掩码密钥和原始数据
	if ($payloadlen <= 125 && $payloadlen >= 0)
	{
		$maskkey = substr($msg, 2, 4);
		$oridata = substr($msg, 6);
	}
	else if ($payloadlen == 126)
	{
		$maskkey = substr($msg, 4, 4);
		$oridata = substr($msg, 8);
	}
	else if ($payloadlen == 127)
	{
		$maskkey = substr($msg, 10, 4);
		$oridata = substr($msg, 14);
	}
	$len = strlen($oridata);
	for($i = 0; $i < $len; $i++)
	{
		$decodedata .= $oridata[$i] ^ $maskkey[$i % 4];
	}
	return $decodedata;
}
//其中得到掩码和控制帧后需要进行验证，如果掩码不为1直接关闭，如果控制帧为8也直接关闭。后面的原始数据和掩码获取是通过websocket协议的数据帧规范进行的。
//三、连接关闭
//1、客户端
//      ws.close();
//2、服务器端
//需要将维hù的用户连接池移除相应的连接用户。 
public function disconnect($clientSocket)
{
	$found = null;
	$n = count($this->users);
	for($i = 0; $i<$n; $i++)
	{
		if($this->users[$i]->socket == $clientSocket)
		{ 
			$found = $i;
			break;
		}
	}
	$index = array_search($clientSocket,$this->sockets);
	
	if(!is_null($found))
	{ 
		array_splice($this->users, $found, 1);
		array_splice($this->sockets, $index, 1); 
		
		socket_close($clientSocket);
		$this->say($clientSocket." DISCONNECTED!");
	}
}
//其中遇到的一个问题就是，如果将上述函数中的socket_close语句提出到if语句外面的时候，当浏览器连接到服务器后，F5刷新页面后会发现出错： 
?>