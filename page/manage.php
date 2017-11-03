<?php
$sql='SELECT * FROM device';
$result=mysqli_query($conn,$sql);
echo '<input id="bringDeviceSignal" type="submit" class ="ui primary button" value="주변 기기 검색"/>';
echo '<em class="statusOfSignal"></em>';

// 현재 기기출력 및 수정
// 이미 저장 되어 있는 기기일 경우
echo '<h4 class="ui dividing h eader">저장된 기기 목록</h4><br>';
echo '<div class="ui two stackable cards">';
while($row=mysqli_fetch_assoc($result)){
  $type = $row['type'];
  switch ($row['type']){
       case 0:
       $type = "Button";
       break;
       case 1:
        $type = "Switch";
       break;
       case 2:
       $type = "Remote";
       break;
       default:
     }

  echo '<div class="card">
         <div class="content">
          <i id='.$row['id'].'Remove class="right floated disabled red minus large icon"></i>
          <div class="header">'.$type.'</div>
          <div class="description">
            기기id   : '.$row['id'].'<br>
            <input type=hidden name="id" value="'.$row['id'].'" >
            기기이름 : 
            <div class="ui mini icon input">
              <i id='.$row['id'].'NameIcon class="disabled radio icon"></i>
              <input id='.$row['id'].'Name type="text" name="name" value="'.$row['name'].'">
            </div>
             <br>기기정보 : 
             <div class="ui mini icon input">
               <i id='.$row['id'].'DescriptionIcon class="disabled radio icon"></i>
               <input id='.$row['id'].'Description type="text" name="description" value="'.$row['description'].'">
            </div>
            <br>추가시간 : '.$row['created'].'<br>
          </div>
         </div>
          <div id='.$row['id'].' class="ui bottom attached button">
            <i class="large edit icon"></i>
            Edit
          </div>
          
          <script>
          $("#'.$row['id'].'Remove").hover(function(){
            document.getElementById("'.$row['id'].'Remove").className="right floated red minus large icon";
          },function(){
            document.getElementById("'.$row['id'].'Remove").className="right floated disabled red minus large icon";
          })
          
          $("#'.$row['id'].'Remove").click(function(){
            $.ajax({
               url: "process/delete_process.php",
               type: "post",
               data: "id='.$row['id'].'",
               success:function(data){//콜백 함수
                 console.log("'.$row['id'].'");
                 console.log(data);
				 location.reload();
               }
             })      
           })

          // 버튼 클릭시 수정내용 post방식 전송
		  $("#'.$row['id'].'").click(function(){
			var sendData = $("#'.$row['id'].'Name").serialize() +"&" 
						  + $("#'.$row['id'].'Description").serialize() + "&"
						  + "id='.$row['id'].'" ;
            $.ajax({
              url:"process/update_process.php",
              type:"post",
              data: sendData,
              success:function(data){//콜백 함수
			  	console.log(sendData);
                console.log($("#'.$row['id'].'Name").serialize());
                console.log($("#'.$row['id'].'Description").serialize());
                console.log(data);
				location.reload();
              }
            })            
          })

          $("#'.$row['id'].'Name").click(function(){
              document.getElementById("'.$row['id'].'NameIcon").className="disable adjust icon";
            })
          $("#'.$row['id'].'Description").click(function(){
              document.getElementById("'.$row['id'].'DescriptionIcon").className="disable adjust icon";
            })
           </script>';
    //echo  '<button type="button" name="submit" onclick="location.href=\'process/delete_process.php?id='.$row['id'].'\'">삭제</button><br>';
   
  echo '</div>';
 //echo '</form>';
}
echo '</div>';


?>
<script type="text/javascript">

  $('#bringDeviceSignal').click( function(){
          console.log('test');
    var url = "/mango?mode=find";
    window.open(url);
  });
</script>
