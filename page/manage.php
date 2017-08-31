<?php
$sql='SELECT * FROM device';
$result=mysqli_query($conn,$sql);
echo '<input type="submit" class ="bringDeviceSignal" value="신호가져오기"/>';

echo '<h2>연결된 기기 목록</h2>';

echo '<h4>새로운 기기 목록</h4>';
echo '로딩중...';

// 현재 기기출력 및 수정
// 이미 저장 되어 있는 기기일 경우
echo '<h4>저장된 기기 목록</h4>';
while($row=mysqli_fetch_assoc($result)){
  echo '<form id="device_manage_info" class="" action="process/update_process.php" method="post">';
  echo  '기기id   : '.$row['id'].'<br>';
  echo  '<input type=hidden name="id" value="'.$row['id'].'" >';
  echo	'기기타입 : '.$row['type'].'<br>';
  echo  '기기이름 : <input type="text" name="name" value="'.$row['name'].'"><br>';
  echo  '기기정보 : <input type="text" name="description" value="'.$row['description'].'"><br>';
  echo  '기기상태 : ';
  echo   $row['status']==1 ? 'On' : 'Off';
  echo  '<br>추가시간 : '.$row['created'];
  echo  '<br><input type="submit" name="submit" value="변경">';
  echo  '<button type="button" name="submit" onclick="location.href=\'process/delete_process.php?id='.$row['id'].'\'">삭제</button><br>';
  echo '</form>';
}



//기기 추가(임의로 넣어줌)
//추후에 주변에 있는 기기를 탐색해서 추가할 수 있는 방향으로
echo '<form class="" action="process/reg_process.php" method="post">';
echo  '<h2>기기추가</h2>';
echo  '기기이름 : <input type="text" name="name" value="">';
echo  '정보 : <input type="text" name="description" value="">';
echo  '<input type="submit" name="submit" value="추가">';
echo '</form>';
?>
<script type="text/javascript">
  $('.bringDeviceSignal').click( function(){
    if ($('.bringDeviceSignal').val() == "신호가져오기"){
      $('.bringDeviceSignal').val("멈추기");
    }
    else {
      $('.bringDeviceSignal').val("신호가져오기");
    }
  });
</script>
