<?php
$conn = mysqli_connect("localhost","root","mango");
mysqli_select_db($conn,"mango");
$result = mysqli_query($conn, "SELECT * FROM device");
?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <title>Mango Block</title>
  </head>
  <body>

    <header>
      <h1><a href = "/">Mango block</a></h1>
    </header>
    <nav>
      <ul id="menubar">
        <li><a href="index.php?page=manage">기기관리</a></li>
        <li><a href="index.php?page=mydevice">내 장치</a></li>
        <li><a href="index.php?page=setting">설정</a></li>
        <!--
          // 이제부터 사용하지 않을 예정.
          // while($row=mysqli_fetch_assoc($result))
          // {
          //   echo '<li><a href="index.php?id='.$row['id'].'">'.$row['name'].'</a></li>';
          // }
        -->

      </ul>
    </nav>

    <!--id : 메뉴 ,num : 기기넘버-->

    <article>
      <?php
        if(empty($_GET['id'])===false)
        {
          $sql='select * from device where id='.$_GET['id'];
          $result=mysqli_query($conn,$sql);
          $row=mysqli_fetch_assoc($result);

          echo '<h2>'.$row['name'].'</h2>';
          echo '<a href="process.php?state=on"><input type="button" value="on"></a>';
          echo '<a href="process.php?state=off"><input type="button" value="off"></a>';
        }

    if (empty($_GET['page']) == false){
      include 'page/'.$_GET['page'].'.php';
    }
    else {

    }


    ?>
    </article>
  </body>
</html>
