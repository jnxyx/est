<?php
//	echo "okxyx";exit;
	if(isset($_FILES["UpFile"]))
	{
//		echo "okxyx";exit;
		$ret = array();
		$uploadDir = 'images'.DIRECTORY_SEPARATOR.date("Ymd").DIRECTORY_SEPARATOR;
		$dir = dirname(__FILE__).DIRECTORY_SEPARATOR.$uploadDir;
		file_exists($dir) || (mkdir($dir,0777,true) && chmod($dir,0777));
		if(!is_array($_FILES["UpFile"]["name"])) //single file
		{
			$fileName = time().uniqid().'.'.pathinfo($_FILES["UpFile"]["name"])['extension'];
			move_uploaded_file($_FILES["UpFile"]["tmp_name"],$dir.$fileName);
			$ret['file'] = DIRECTORY_SEPARATOR.$uploadDir.$fileName;
		}
		echo json_encode($ret);
	}
?>