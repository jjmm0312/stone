<?php

$conn=mysqli_connect("localhost","root","mango");
mysqli_select_db($conn,"mango");

$sql = "UPDATE `mango`.`device` SET `name` = '".$_POST['name']."', `description` = '".$_POST['description']."' WHERE `device`.`id` = '".$_POST['id']."';";
	
$result = mysqli_query($conn, $sql);
header('Location: /index.php?page=manage');
?>
