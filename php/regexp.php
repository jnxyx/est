<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>正则测试 - php</title>
</head>

<body>
	<?php
		$data00 = 'body" : "{"status":"0","errorCode":null,"errorMsg":null,"data":[]}"} "time" : {"0.023010015487671"}';
		$data = '<body><div>这是Div里面的内容</div><a>这是Archor里面的内容</a></body>';
		$string = 'aa2a1';

		// preg_match('/(?<=(<a>)).*?(?=(<\/a>))/' , $data , $result );
		preg_match('/(?<=(time" : {"))(.*?)(?=("})$)/' , $data00 , $result );

		var_dump( $result);
		echo  $result[1]  ;
		echo  $result[0]  ;
		echo  $result[2]  ;

		$replaceString = preg_replace('/(?<![a-zA-Z])(a\\d+)((?=[a-zA-Z])|$)/','',$string);
		echo '<br>';
		echo $string;
		echo '<br>';
		echo $replaceString;
		
		$replaceString = preg_replace('/(?<!([a-zA-Z]a))(?<=a)(\\d+)((?=[a-zA-Z])|$)/','',$string);
		echo '<br>';
		echo $string;
		echo '<br>';
		echo $replaceString;
	?>
</body>

</html>
