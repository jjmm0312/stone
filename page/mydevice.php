<?php
$sql='SELECT * FROM device';
$result=mysqli_query($conn,$sql);
?>
<div class="ui three stackable cards">
<?php
while($row=mysqli_fetch_assoc($result)){
	$type = $row['type'];
	$typeName = 'NULL';
  
    switch ($type){
       // 0 is button
       // 1 is switch
       // 2 is controller
       case 0:
       $on = 'on';
       $off = 'off';
       break;
       case 1:
       $on = 'on';
       $off = 'off';
       break;
       case 2:
       $on = 'signal';
       $off = 'copy';
       break;
       default:
       $on = 'null';
       $off = 'null';
     }
	
    echo '<div class="card">';
	 echo '<div class="burring dimmable image">';
	  echo '<div class="ui dimmer">';
	   echo '<div class="content">';
	    echo '<div class="center">';
          if($row['state']==1){ // on
            echo '<form  class="" action="update_process.php" method="post">';
            echo '<input type="button" class="ui button" value='.$on.' onclick="window.open(\'/mango?id='.$row['id'].'&state=1&type='.$type.'\',\'width=500, height=200\')">';
            echo '<input type="button" class="ui red button" value='.$off.' onclick= "window.open(\'/mango?id='.$row['id'].'&state=0&type='.$type.'\',\'width=500, height=200\')">';
            echo '</form>';
          }else{ // off
            echo '<form  class="" action="update_process.php" method="post">';
            echo '<input type="button" class="ui green button" value='.$on.' onclick="window.open(\'/mango?id='.$row['id'].'&state=1&type='.$type.'\',\'width=500, height=200\')">';
            echo '<input type="button" class="ui button" value='.$off.' onclick= "window.open(\'/mango?id='.$row['id'].'&state=0&type='.$type.'\',\'width=500, height=200\')">';
            echo '</form>';
          }		  
		echo '</div>';
	   echo '</div>';
	  echo '</div>';
	//image load
	 echo '<img src="img/';	
     switch ($type){
       case 0:
       echo 'button.jpg">';
       break;
       case 1:
       echo 'switch.jpg">';
       break;
       case 2:
       echo 'remote.jpg">';
       break;
       default:
     }
	echo '</div>';
	//card name
	echo '<div class="content">';
	echo '<a class="header">'.$row['name'].'</a>';
	//enrolled time
	echo '<div class="meta">';
	echo '<span class="date">Enrolled in '.$row['created'].'</span>';
	echo '</div>';
	//description
	echo '<div class="description">';
    echo  $row['description'];
	echo '</div>';
	echo '</div>';
	//extra content
    echo '<div class="extra content">';
    echo '<a>';
    echo '<i class="idea icon"></i>';
    echo '현재 상태: ';
    echo $row['state']==1 ? $on : $off;
    echo '</a>';
    echo '</div>';
	echo '</div>';
}
 ?>
</div>

<script>
 $('.image').dimmer({
  on: 'hover'
});
</script>