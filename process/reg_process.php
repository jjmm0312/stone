<?php

$conn=mysqli_connect("localhost:3307","root","mango");
mysqli_select_db($conn,"mango");
$sql = "INSERT INTO `mango`.`device` (`id`, `type`, `name`, `description`, `created`, `status`) VALUES (NULL, '-1','".$_POST['name']."','".$_POST['description']."',now(), '-1');";
$result = mysqli_query($conn, $sql);

header('Location: /index.php?page=manage');

?>
