<?php
  //include 는 파일이 없을 경우 계속 하지만
  //require 는 파일이 없으면 멈춘다.
  require './setting/sql_setting.php';
?>


<!DOCTYPE html>
<html>
    <head>
       <meta charset="utf-8" name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width, height=device-height">
       <link rel="stylesheet" type="text/css" href="css/style.css">
       <link rel="stylesheet" type="text/css" href="semantic/semantic.css">
        <script
          src="https://code.jquery.com/jquery-3.1.1.min.js"
          integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
          crossorigin="anonymous"></script>
        <script src="semantic/semantic.js"></script>
        <title>Mango Block</title>
    </head>
      
    <body>
      <div class="ui sidebar inverted vertical menu labeled inline left icon" style="">
         <a class="item"></a>
          <?php
          //login session start
          session_start();
          if (!isset($_SESSION['user_id'])){
            echo '<a id="login" class="item">';
            echo '<i class="power icon"></i>';
            echo '로그인';
          }
          else {
            echo '<a id="logout" class="item">';
            echo '<i class="power icon"></i>';
            echo '로그아웃';
          }
         ?>
         </a>
        <a id="manage" class="item">
         <i class="tablet icon"></i>
          기기관리
        </a>
        <a id="mydevice" class="item">
         <i class="disk outline icon"></i>
          내 장치
        </a>
        <a id="setting" class="item">
         <i class="setting icon"></i>
          설정
        </a>
      </div>
      <div class="pusher">
       <header>
          <h1><i id ="menu" class="disabled sidebar icon"></i><a href = "/"> Mango block</a></h1>
       </header>
       <div id='contents' class="ui text container">
       
        <?php
            //메뉴를 클릭시 페이지 이동
            if (empty($_GET['page']) == false){
              if ($_GET['page'] == 'login'){
                    include 'page/login.php';
              }
              else {
                if (isset($_SESSION['user_id'])){
                    echo '<div class="ui piled segment">';
                    include 'page/'.$_GET['page'].'.php';
                    echo '</div>';
                }
                else {
                  echo "<script language=javascript>";
                  echo "alert('로그인이 필요합니다.');";
                  echo "</script>";
                  include 'page/login.php';
                }
              }
            }
            else {	}
         ?>
        
       </div>
       <?php
       if(empty($_GET['page'])){
         echo '<div">';
         echo '<img id="mangoImg" src="img/mango.jpg">';
         echo '</div>';
       }
         
        
        ?>
        </div>
      <script>
        $('#menu').hover(function(){
            document.getElementById('menu').className='sidebar icon';
        },function(){
            document.getElementById('menu').className='disabled sidebar icon';           
        });
        
        // 메뉴 클릭 이벤트
        $('#menu').click(function(){
            $('.ui.sidebar').sidebar('toggle');
        }); 
        $('#login').click(function(){
            location.href="index.php?page=login";
        });
        $('#logout').click(function(){
            location.href="/process/logout_process.php";
        });
        $('#manage').click(function(){
            location.href="index.php?page=manage";
        });
        $('#mydevice').click(function(){
            location.href="index.php?page=mydevice";
        });
        $('#setting').click(function(){
            location.href="index.php?page=setting";
        });
      </script>
    </body>
</html>
