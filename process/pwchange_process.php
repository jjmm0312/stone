<?php
  require './../setting/sql_setting.php';

  session_start();
  $userid = $_SESSION['user_id'];
  $userpw = $_POST['old_pw'];
  $usernewpw = $_POST['new_pw'];
  $sql = "UPDATE account SET pw = '$usernewpw' WHERE id = '$userid' and pw = '$userpw'";
  mysqli_query($conn,$sql);

  // If result matched $myusername and $mypassword, table row must be 1 row
  echo '{ "suc": true }';
?>
