<?php
  require './../setting/sql_setting.php';
  session_start();

  if($_SERVER["REQUEST_METHOD"] == "POST") {
   // username and password sent from form

   //$myusername = mysqli_real_escape_string($db,$_POST['username']);
   $myusername = 'admin';
   $mypassword = mysqli_real_escape_string($conn,$_POST['password']);
   //echo "<h1>'$myusername'</hi>";
   //echo "<h1>'$mypassword'</hi>";

   $sql = "SELECT acc_key FROM account WHERE id = '$myusername' and pw = '$mypassword'";
   $result = mysqli_query($conn,$sql);
   $row = mysqli_fetch_array($result,MYSQLI_ASSOC);

   $count = mysqli_num_rows($result);

   // If result matched $myusername and $mypassword, table row must be 1 row

   if($count == 1) {
      //session_register("myusername");
      $_SESSION['user_id'] = $myusername;
      echo "<script language=javascript>";
      echo "alert('Login Succcess');";
      echo "location.replace('/index.php');";
      echo "</script>";
   }else {
      echo "<script language=javascript>";
      echo "alert('Login Fail');";
      echo "history.back(-2);";
      echo "</script>";
   }
}
?>
