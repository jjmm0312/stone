<?php

include '/setting/sql_setting.php';

$sql = "DELETE FROM `mango`.`device` WHERE `device`.`id`=".$_GET['id'].";";
$result = mysqli_query($conn, $sql);
header('Location: /index.php?page=manage');
?>
