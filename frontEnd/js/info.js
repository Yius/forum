function loadInfo() {
    var url = globalConfig.url;
    var href = window.location.href;
    var ind = href.indexOf('?');
    var para;
    if (ind != -1) {
        para = { "id": href.substring(href.indexOf('=') + 1)};
    }
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        method: 'GET',
        url: `http://${url}/info/peek`,
        data: para,
        success: (data) => {
            $('#id').attr('value', data.id);
            $('#nickname').attr('value', data.nickname);
            if (data.gender == 'M') {
                $('#sex').attr('value', '男');
            }else{
                $('#sex').attr('value', '女');
            }
            $('#bornyear').attr('value', data.bornyear);
            $('#description').html(data.description);
            $('#head').attr('src', 'userImg/'+data.avatar);
        },
        error: (xhr, err) => {
            alert('个人信息加载失败');
        }
    });
}

function alterInfo() {
    var url = globalConfig.url;
    var choices = document.getElementsByName("sexChoices");
    var gender = "";
    for (let i = 0; i < choices.length; ++i) {
        if (choices[i].checked) {
            gender = choices[i].value;
        }
    }
    var bornyear = document.getElementById("bornyear").value;
    bornyear = bornyear.substring(0,4);
    var para;
    para = {
        "password": $('#change_password').val(),
        "nickname": $('#change_nickname').val(), "gender": gender,
        "bornyear":bornyear, "description": $('#change_description').val()
    };
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        method: 'POST',
        url: `http://${url}/info/alter`,
        data: para,
        success: (data) => {
            if(data.code!=200){
                alert('未知原因，修改失败');
                alert(data.code);
            }
            $('#info_change').modal('hide');
            location.reload();
        },
        error: (xhr, err) => {
            alert('个人信息修改失败');
        }
    });
}

function uploadImg() {
    var file = $('#change_head')[0].files[0];
    if(file.size > 1024*1024){
        alert('图片太大了，重新选择一张吧');
        return;
    }
    var url = globalConfig.url;
    var formData = new FormData();
    var href = window.location.href;
    var ind = href.indexOf('?');
    var id = "";
    if (ind != -1) {
        id = href.substring(href.indexOf('=') + 1);
    }
    formData.append('id',id);
    formData.append('avatar', file);
    $.ajax({
        method: "POST",
        url: `http://${url}/upload/img`,
        data: formData,
        dataType: 'json',
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        xhrFields: { 
            withCredentials: true 
        },
        success: function (data) {
            if(data.code!=200){
                alert('未知原因，头像上传失败');
            }
        },
        error: function (xhr, err) {
            alert('头像上传修改失败');
        },
    });
}

function identityCheck(){
    var href = window.location.href;
    var ind = href.indexOf('?');
    if (ind != -1) {
        $('#change').attr('style','display:none;');
        $('#logOut').attr('style','display:none;');
    }
}

function init(){
    identityCheck();
    loadInfo();
}