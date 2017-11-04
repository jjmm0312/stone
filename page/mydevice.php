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
	
    echo '<div class="card">
	       <div class="burring dimmable image">
	        <div class="ui dimmer">
	         <div class="content">
	          <div class="center">';
          if($row['state']==1){ // on
            echo '<form  class="" action="update_process.php" method="post">
                  <input type="button" class="ui button" value='.$on.' onclick="window.open(\'/mango?id='.$row['id'].'&state=1&mode=onoff&type='.$type.'\',\'width=500, height=200\')">
                  <input type="button" class="ui red button" value='.$off.' onclick= "window.open(\'/mango?id='.$row['id'].'&state=0&mode=onoff&type='.$type.'\',\'width=500, height=200\')">
                  </form>';
          }else{ // off
            echo '<form  class="" action="update_process.php" method="post">
                  <input type="button" class="ui green button" value='.$on.' onclick="window.open(\'/mango?id='.$row['id'].'&state=1&mode=onoff&type='.$type.'\',\'width=500, height=200\')">
                  <input type="button" class="ui button" value='.$off.' onclick= "window.open(\'/mango?id='.$row['id'].'&state=0&mode=onoff&type='.$type.'\',\'width=500, height=200\')">
                  </form>';
          }		  
		echo '</div>
	         </div>
	        </div>
	//image load
	       <img src="img/';	
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
	echo '</div>
	//card name
	      <div class="content">
	      <a class="header">'.$row['name'].'</a>
	//enrolled time
	      <div class="meta">
	      <span class="date">Enrolled in '.$row['created'].'</span>
	      </div>
	//description
	      <div class="description">';
    echo  $row['description'];
	echo '</div>
	      </div>
	//extra content
          <div class="extra content">
          <a>
          <i class="idea icon"></i>
          현재 상태: ';
    echo $row['state']==1 ? $on : $off;
    echo '</a>
          </div>
	      </div>';
}
 ?>
</div>

<script>
 $('.image').dimmer({
  on: 'hover'
});
</script>