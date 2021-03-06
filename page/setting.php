<h1 class="ui dividing header">Setting Page</h1>

  <div class="ui form">
    <h4 class="ui dividing header">Password Change</h3>
      <div class="field">
       <label>Old Password</label>
       <input type="password" id="old_password" name="old_password" value=""><em class="oldPasswordWrong"></em>
      </div>
      <div class="field">
        <label>New Password</label>
        <input type="password" id="new_password" value=""><em class="newPasswordWrong"></em>
      </div>
      <div class="field">
        <label>Confirm New Password</label>
        <input type="password" id="new_password_confirm" value=""><em class="newPasswordConfirmWrong"></em>
      </div>
      <input type="submit" class="ui button changePasswordButton" name="" value="변경하기">
      
  </div>
  
    

   
    

<script type="text/javascript">
  $('.changePasswordButton').click(function (){
    var pwChk = true;

    if (document.getElementById("new_password").value.length < 4){
      $('.newPasswordWrong').html("비밀번호가 너무 짧습니다. 8글자 이상");
      pwChk = false;
    }
    else {
        $('.newPasswordWrong').html("");
    }

    if (document.getElementById("new_password").value != document.getElementById("new_password_confirm").value){
      $('.newPasswordConfirmWrong').html("새로운 비밀번호가 다릅니다.");
      pwChk = false;
    }
    else {
      $('.newPasswordConfirmWrong').html("");
    }

    $.ajax({
      url: './../process/pwchk_process.php',
      data: "pw="+document.getElementById("old_password").value,
      type: 'post',
      success: function(result){
        var obj = $.parseJSON(result);

        if (obj.suc == false){
          $('.oldPasswordWrong').html("기존 비밀번호가 다릅니다.");
          pwChk = false;
        }
        else {
            $('.oldPasswordWrong').html("");
        }
      }
    });

    if (pwChk == true){
      $.ajax({
        url: './../process/pwchange_process.php',
        data: "old_pw=" + document.getElementById("old_password").value + "& new_pw=" + document.getElementById("new_password").value,
        type: 'post',
        success: function(result){
          var obj = $.parseJSON(result);
          if (obj.suc == true){
            alert("성공!");
            document.getElementById('old_password').value = "";
            document.getElementById('new_password').value = "";
            document.getElementById('new_password_confirm').value = "";
          }
        }
      });
    }

  });
</script>
