<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>my - php</title>
</head>

<body>
	<?php
		include('my.class.php');
		$my = new myClass(array(
			'name' => '张三',
			'age'  => 18,
			'sex'  => 'M'
		));
		//$my -> setName('zhangwei');
		echo $my -> getName();
	?>

	<div><?php echo $my -> getAge();  ?></div>
</body>

</html>
