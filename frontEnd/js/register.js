function registerHelp(){
    var url = globalConfig.url;
    var year = document.getElementById("bornyear").value;
    year = year.substring(0,4);
    var choices = document.getElementsByName("sex");
    var gender = "M";
    for(let i =0;i<choices.length;++i){
        if(choices[i].checked){
            gender = choices[i].value;
        }
    }
    para = { "id": document.getElementById("id").value, "password": document.getElementById("password").value ,
                "nickname":document.getElementById("nickname").value,"bornyear":year,"description":document.getElementById("description").value,
                "gender":gender};
    $.ajax({
        method: 'POST',
        url: `http://${url}/register`,
        data: para,
        success: (data) => {
            if (data.code == 200) {
                window.location.href = "login.html";
            } else {
                alert("注册失败");
            }
        },
        error: (xhr, err) => {
            alert('未知原因，登录失败');
        }
    });
}