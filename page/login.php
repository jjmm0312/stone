<div class="ui piled segment">
 <form id="loginForm" class="ui form" action="/process/login_process.php" method="post">
  <div class='field'>
    <label>Password</label>
      <input id='pwdTextBox' type="password" name="password" value="" placeholder="Password" onkeydown="if(event.keyCode==13) javascript:chkEnter();" >
  </div>
  <div class="field">
    <div class="ui checkbox">
      <input id='pwdSaveCheck' type="checkbox" tabindex="0" class="hidden">
      <label>비밀번호 저장</label>
    </div>
  </div>
  
  <button class="ui button" type="submit">로그인</button>
 
 </form>
</div>
<script>
$('.ui.checkbox')
  .checkbox();
  
/* 비밀번호 기억 function
$(document).ready(function() {
        //Id 쿠키 저장
        var userInputPwd = getCookie("userInputPwd");
        $("input[name='password']").val(userInputPwd); 
         
        if($("input[name='password']").val() != ""){ 
            $("#pwdSaveCheck").attr("checked", true); 
        }
         
        $("#pwdSaveCheck").change(function(){ 
            if($("#pwdSaveCheck").is(":checked")){                     
                   //id 저장 클릭시 pwd 저장 체크박스 활성화
                var userInputpwd = $("input[name='password']").val();
                setCookie("userInputPwd", userInputPwd, 365);
            }else{ 
                deleteCookie("userInputPwd");
            }
        })
});
*/
</script>