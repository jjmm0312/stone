<?php

$sql='SELECT * FROM device';
$result=mysqli_query($conn,$sql);
while($row=mysqli_fetch_assoc($result)){
  echo '<form id="device_manage_info" class="" action="update_process.php" method="post">';
  echo  '기기id   : '.$row['id'].'<br>';
  
  $type = $row['type'];
  $typeName = 'NULL';
  switch ($type){
    case 0:
	$on = 'on';
	$off = 'off';
	$typeName = 'button';
    break;
    case 1:
	$on = 'on';
	$off = 'off';
	$typeName = 'switch';
    break;
    case 2:
	$on = 'signal';
	$off = 'copy';
	$typeName = 'controller';
    break;
	default:
	$on = 'null';
	$off = 'null';
  }

// 0 is button
// 1 is switch
// 2 is controller
 
  echo  '기기종류   : '.$typeName.'<br>';
  echo  '기기이름 : '.$row['name'].'<br>';
  echo  '기기정보 : '.$row['description'].'<br>';
  echo  '기기상태 : ';
  echo   $row['state']==1 ? $on : $off;

  echo  '<br>추가시간 : '.$row['created'];
  echo '<br><input type="button" value='.$off.' onclick= "window.open(\'/mango?id='.$row['id'].'&state=0&type='.$type.'\',\'width=500, height=200\')">';
  echo '<br><input type="button" value='.$on.'  onclick="window.open(\'/mango?id='.$row['id'].'&state=1&type='.$type.'\',\'width=500, height=200\')">';
  echo '</form>';
}

 ?>
