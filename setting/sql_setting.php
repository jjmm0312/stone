<?php

$db_ip = 'localhost';
//when using variable of port, raspberry pi server could not connet my sql.
//so, removing port.
//$db_port = '3307';
$db_id = 'root';
$db_pw = 'mango';
$db_database = 'mango';

$conn = mysqli_connect($db_ip, $db_id, $db_pw);
mysqli_select_db($conn,$db_database);
?>
