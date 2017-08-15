<?php

$conn=mysqli_connect("localhost","root","mango");
mysqli_select_db($conn,"mango");

$sql = "DELETE FROM `mango`.`device` WHERE `device`.`id`=".$_GET['id'].";";
$result = mysqli_query($conn, $sql);
header('Location: /index.php?page=manage');
?>
