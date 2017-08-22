<?php
  require './../setting/sql_setting.php';

  session_start();
  $userid = $_SESSION['user_id'];
  $userpw = $_POST['pw'];
  $sql = "SELECT acc_key FROM account WHERE id = '$userid' and pw = '$userpw'";
  $result = mysqli_query($conn,$sql);
  $row = mysqli_fetch_array($result,MYSQLI_ASSOC);

  $count = mysqli_num_rows($result);

  // If result matched $myusername and $mypassword, table row must be 1 row

  if($count == 1) {
     echo '{ "suc": true }';
  }else {
     echo '{ "suc": false }';
  }
?>
