function loginCheck() {
    var url = globalConfig.url;
    para = { "id": document.getElementById("id").value, "password": document.getElementById("password").value };
    $.ajax({
        method: 'POST',
        xhrFields:{
            withCredentials:true
        },
        url: `http://${url}/login`,
        data: para,
        success: (data) => {
            if (data.code == 200) {
                window.location.href = "posts.html?p=1";
            } else {
                alert("账号不存在或账号密码不匹配");
            }
        },
        error: (xhr, err) => {
            alert('未知原因，登录失败');
        }
    });
}