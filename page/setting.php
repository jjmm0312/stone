<h1>Setting Page</h1>

  <h3>Password Change</h3>
    Old Password</br>
    <input type="password" id="old_password" name="old_password" value=""><em class="oldPasswordWrong"></em></br></br>
    New Password</br>
    <input type="password" id="new_password" value=""><em class="newPasswordWrong"></em></br></br>
    Confirm New Password</br>
    <input type="password" id="new_password_confirm" value=""><em class="newPasswordConfirmWrong"></em></br></br>
    <input type="submit" class="changePasswordButton" name="" value="변경하기">

  <h3>Reset</h3>

<script type="text/javascript">
  $('.changePasswordButton').click(function (){
    var pwChk = true;

    if (document.getElementById("new_password").value.length < 8){
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
          }
        }
      });
    }

  });
</script>
