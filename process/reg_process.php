<?php

require './../setting/sql_setting.php';

echo '<script language="javascript">';
echo 'alert("message successfully sent")'.$db_ip;
echo '</script>';

$sql = "INSERT INTO `mango`.`device` (`id`, `type`, `name`, `description`, `created`, `status`) VALUES (NULL, '-1','".$_POST['name']."','".$_POST['description']."',now(), '-1');";
$result = mysqli_query($conn, $sql);

header('Location: /index.php?page=manage');

?>
