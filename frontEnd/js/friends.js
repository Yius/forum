var last = null;
function getFriends(){
    var url = globalConfig.url;
    $.ajax({
        xhrFields:{
            withCredentials:true
        },
        method: 'GET',
        url: `http://${url}/friends/list`,
        success: (data) => {
            let friendsHTML =
            `<nav>
                <ol class="breadcrumb" style="background-color:#93d5dc;">
                    <li class="breadcrumb-item"><span style="font-size: large;">好友列表</span></li>
                </ol>
            </nav>`;
            for(let i=0;i<data.length;++i){
                friendsHTML +=
                `<div onclick="go('${data[i].fid}','${data[i].fname}','${data[i].favatar}')" class="media card-body" style="border-bottom: solid gainsboro 1px;height: 90px">
                    <img style="margin-top: -12px;" class="align-self-start mr-4 avatarBox img-thumbnail" src="images/index_box.png">
                    <div class="media-body" style="margin-top: -20px;">
                        <br>
                        <p class="nameFont">${data[i].fname}</p>
                    </div>
                </div>`;
            }
            friendsHTML +=
            `<div class="media card-body" style="height: 300px;">
            </div>`

            $('#friendsList').html(friendsHTML);
        },
        error: (xhr, err) => {
            alert('好友列表加载失败');
        }
    });
}


function showTalkHistory(to,receiverName,receiverAvatar){
    let receiverInfo = {"receiverid":to,"receivername":receiverName,"receiveravatar":receiverAvatar};
    $("#data").attr("data-field",JSON.stringify(receiverInfo));
    var para = { "to": to};
    var url = globalConfig.url;
    $.ajax({
        xhrFields:{
            withCredentials:true
        },
        method: 'GET',
        url: `http://${url}/friends/talk`,
        data: para,
        success: (data) => {
            let talkHTML = "";

            for(let i=0;i<data.length;++i){
                if(data[i].senderid!=to){
                    talkHTML +=
                    `<div class="rightTalkDiv">
                        <div class="right_bubble" style="margin-left: -500%;margin-top: 5%;word-break: break-all;width: 435%;">
                            ${data[i].content}</div>
                        <img src="images/index_box.png" class="rightTalkAvatar">
                    </div>`;
                }else{
                    talkHTML +=
                    `<div class="leftTalkDiv">
                        <img src="images/index_box.png" class="talkAvatar">
                        <div class="bubble" style="margin-top: 0.5%; margin-left: 14%;word-break: break-all;width: 32%;">
                            ${data[i].content}</div>
                    </div>`;
                }
    
            }


            $('#talk_div').html(talkHTML);
        },
        error: (xhr, err) => {
            alert('贴子加载失败');
        }
    });
}

function showInputBar(){
    let sendHTML = 
    `<input type="text" class="inputBar" id="inputContent">
    <button onclick="sendMessage()" type="button" class="btn btn-primary" style="width: 10%;margin-left: 3% ;">发送</button>`;
    $('#send_div').html(sendHTML);
}

function sendMessage(){
    var content =  $("#inputContent").val();
    let length = 0;
    for(let i=0;i<content.length;++i){
        if(isChinese(content[i])){
            length += 2;
        }else{
            ++length;
        }
    }
    if(length>100){
        alert("想说的话太多了，尝试分多次说吧~");
        return;
    }
    var jsonObject = $.parseJSON($("#data").attr("data-field"));
    var para = {"content":content,"receiverid":jsonObject.receiverid,
                "receivername":jsonObject.receivername,"sendtime":(new Date()).getTime(),
                "receiveravatar":jsonObject.receiveravatar};
    $.ajax({
        method: 'POST',
        xhrFields:{
            withCredentials:true
        },
        url: `http://${globalConfig.url}/friends/sendmsg`,
        data: para,
        success: (data) => {
            document.getElementById("inputContent").value = "";
            if(data.code!=200){
                alert("发送失败");
            }
        },
        error: (xhr, err) => {
            alert('未知原因，发送失败');
        }
    });
}


function isChinese(temp){
    var re=/[^\u4E00-\u9FA5]/;
    if (re.test(temp)) return false ;
    return true ;
}

function go(fid,receiverName,receiverAvatar){
    if(last==null){
        showInputBar();
    }
    clearInterval(last);
    last = setInterval(`showTalkHistory('${fid}','${receiverName}','${receiverAvatar}')`,1000);
}