function showPostDetail() {
    var url = globalConfig.url;
    var curCul = location.href.substring(location.href.indexOf("?")+1);
    var start = curCul.indexOf("=") + 1;
    var end = curCul.indexOf("&");
    var id = parseInt(curCul.substring(start, end))
    var pstart = curCul.indexOf("p") + 2;
    var pend = curCul.lastIndexOf("&");
    var currentPage = parseInt(curCul.substring(pstart, pend));
    var pagesize = 20;
    var para = { "id": id, "page": currentPage, "pagesize": pagesize };
    $.ajax({
        xhrFields:{
            withCredentials:true
        },
        method: 'GET',
        url: `http://${url}/post/alldetail`,
        data: para,
        success: (data) => {
            if (JSON.stringify(data) === "{}") return;
            let totalPage = data.totalPage;
            let pageHTML =
                `<li class="page-item">
                    <a class="page-link disabled">
                        <span>&laquo;</span>
                    </a>
                </li>`;
            if (totalPage <= 10) {
                for (let i = 1; i <= totalPage; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active"><a class="page-link" href="post.html?id=${id}&p=${i}&pagesize=${pagesize}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="post.html?id=${id}&p=${i}&pagesize=${pagesize}">${i}</a></li>`
                    }
                }
            } else if (currentPage + 4 >= totalPage) {
                for (let i = totalPage - 9; i <= totalPage; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active"><a class="page-link" href="post.html?id=${id}&p=${i}&pagesize=${pagesize}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="post.html?id=${id}&p=${i}&pagesize=${pagesize}">${i}</a></li>`
                    }
                }
            } else {
                for (let i = currentPage - 5; i <= currentPage + 4; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active"><a class="page-link" href="post.html?id=${id}&p=${i}&pagesize=${pagesize}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="post.html?id=${id}&p=${i}&pagesize=${pagesize}">${i}</a></li>`
                    }
                }
            }
            pageHTML +=
                `<li class="page-item disabled">
                    <a class="page-link">
                        <span>&raquo;</span>
                    </a>
                </li>`
            $('#bottomPage').html(pageHTML);
            let postHTML = "";
            if (data.hasOwnProperty("topPost")) {
                postHTML +=
                `<nav>
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item" >${data.topPost.title}</li>
                    </ol>
                </nav>`;
                postHTML +=
                `<div class="media card-body" style="border-bottom: solid gainsboro 1px;">
                    <div onclick="infoInjectAndShowModal(${data.topPost.uid})">
                        <img class="align-self-start mr-5 avatarBox " src="${'userImg/'+data.topPost.avatar}">
                        <br>
                        <p style="margin-top: 5%;text-align: center;padding-right: 3em;">${data.topPost.nickname}</p>
                    </div>
                    <div class="media-body">
                        <p>${data.topPost.content}</p>
                        <span style="font-size:12px;float:right;">1楼 发布时间:${transformTime(data.topPost.publishtime)}</span>
                    </div>
                </div>`;
            }
            let delta = -1;
            if (data.hasOwnProperty("post")) {
                let postArr = data.post;
                if(currentPage==1){
                    delta = 0;
                }
                for (let i = 0; i < postArr.length; ++i) {
                    postHTML +=
                        `<div class="media card-body" style="border-bottom: solid gainsboro 1px;">
                            <div onclick="infoInjectAndShowModal(${postArr[i].uid})">
                                <img class="align-self-start mr-4 avatarBox " src="${'userImg/'+postArr[i].avatar}">
                                <br>
                                <p style="margin-top: 5%;text-align: center;padding-right: 2em;" id="name${postArr[i].id}">${postArr[i].nickname}</p>
                            </div>
                            <div class="media-body">
                                <p>${postArr[i].content}</p>
                                <span style="font-size:12px;float:right;">${(currentPage-1)*pagesize+i+2+delta}楼 回复时间:${transformTime(postArr[i].publishtime)}</span>
                                <br>
                                <a style="float: right;" data-toggle="collapse" href="#replyCollapse${postArr[i].id}" onclick="showReplys(${postArr[i].id},1)" role="button" data-field=${postArr[i].id}>
                                    查看回复(${postArr[i].replys})
                                </a>
                                <br>
                                <div class="collapse list-unstyled card" id="replyCollapse${postArr[i].id}">
                                </div>
                            </div>
                        </div>`
                }
            }
            $('#detailPosition').html(postHTML);

        },
        error: (xhr, err) => {
            alert('查看贴子详情失败');
        }
    })
}

function showReplys(replygroup,page){
    var url = globalConfig.url;
    var para = { "replygroup": replygroup, "page": page };
    $.ajax({
        xhrFields:{
            withCredentials:true
        },
        method: 'GET',
        url: `http://${url}/post/replys`,
        data: para,
        success: (data) => {
            if (JSON.stringify(data) === "{}") return;
            let postArr = data.post;
            let postHTML = "";
            
            //外楼部分
            for (let i = 0; i < postArr.length; ++i) {
                postHTML +=
                    `<div class="media card-body" style="border-bottom: solid gainsboro 1px;">
                        <div>
                        <img class="align-self-start mr-4 avatarBox " src="${'userImg/'+postArr[i].avatar}">
                        <br>
                        <p style="margin-top: 5%;text-align: center;padding-right: 2em;" id="name${postArr[i].id}">${postArr[i].nickname}</p>
                        </div>
                        <div class="media-body">
                        <p>${postArr[i].content}</p>
                        <span style="font-size:12px;float:right;">
                            回复时间:${transformTime(postArr[i].publishtime)}</span>
                        <br>
                        <a style="float: right;" href="javascript:void(0)" onclick="innerReplyToOthersHelper(${replygroup},${postArr[i].id})" role="button" data-field=${postArr[i].id}>
                            回复
                        </a>
                        </div>
                    </div>`;
            }

            let totalPage = data.totalPage;
            postHTML +=
            `<nav>
                <ul class="pagination justify-content-center" style="margin-top: 2%;" id="bottomPage">
                <li class="page-item">
                    <a class="page-link disabled">
                        <span>&laquo;</span>
                    </a>
                </li>
            `;

            if (totalPage <= 10) {
                for (let i = 1; i <= totalPage; ++i) {
                    if (page == i) {
                        postHTML += `<li class="page-item active"><a class="page-link" href="javascript:void(0)" onclick="showReplys(${replygroup},${i})">${i}</a></li>`;
                    } else {
                        postHTML += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="showReplys(${replygroup},${i})">${i}</a></li>`;
                    }
                }
            } else if (page + 4 >= page) {
                for (let i = totalPage - 9; i <= totalPage; ++i) {
                    if (page == i) {
                        postHTML += `<li class="page-item active"><a class="page-link" href="javascript:void(0)" onclick="showReplys(${replygroup},${i})">${i}</a></li>`;
                    } else {
                        postHTML += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="showReplys(${replygroup},${i})">${i}</a></li>`;
                    }
                }
            } else {
                for (let i = page - 5; i <= page + 4; ++i) {
                    if (page == i) {
                        postHTML += `<li class="page-item active"><a class="page-link" href="javascript:void(0)" onclick="showReplys(${replygroup},${i})">${i}</a></li>`;
                    } else {
                        postHTML += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="showReplys(${replygroup},${i})">${i}</a></li>`;
                    }
                }
            }
            postHTML +=
                    `<li class="page-item disabled">
                        <a class="page-link">
                            <span>&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>`;

            postHTML += 
            `<button class="btn btn-primary" style="width: 10%;margin-left: 85%;margin-bottom: 2%;"
                data-toggle="collapse" href="#cc${replygroup}">我说几句</button>
            <div class="collapse" id="cc${replygroup}">
                <div class="card">
                    <div class="card-body">
                        <div class="form-group">
                            <textarea class="form-control" id="content${replygroup}" rows="3"></textarea>
                        </div>
                        <button type="button" class="btn btn-primary" style="float: right;" onclick="addInnerReply(${replygroup})">回复</button>
                    </div>
                </div>
            </div>
            <div class="collapse" id="ccc${replygroup}">
                <div class="card">
                    <div class="card-body">
                        <div class="form-group">
                            <textarea class="form-control" id="contentc${replygroup}" rows="3"></textarea>
                        </div>
                        <button type="button" class="btn btn-primary" style="float: right;" onclick="addInnerReplyToOthers(${replygroup})">回复</button>
                    </div>
                </div>
            </div>`;

            $(`#replyCollapse${replygroup}`).html(postHTML);
        },
        error: (xhr, err) => {
            alert('显示所有回复失败');
        }
    })
}

//跟帖回复
function addReply(){
    var id = parseInt(window.location.href.substring(window.location.href.indexOf("=")+1));
    var url = globalConfig.url;
    var content = document.getElementById('content').value;
    var publishtime = (new Date()).getTime();
    var para = {"directreply":1,"content":content,"publishtime":publishtime,
                "replyto":id,"postgroup":id};
    $.ajax({
        method: 'POST',
        xhrFields:{
            withCredentials:true
        },
        url: `http://${url}/post/replyto`,
        data: para,
        success: (data) => {
            if(data.code==200){
                location.reload();
            }else if(data.code==400){
                alert('您的登录已失效，即将返回登录页');
                window.location.href = "login.html";
            }else{
                alert('未知原因，更贴失败');
                alert(code);
            }
        },
        error: (xhr, err) => {
            alert('更贴失败');
        }
    });
}

function addInnerReply(id){
    var postgroup = parseInt(window.location.href.substring(window.location.href.indexOf("=")+1));
    var para = {"directreply":0,"content":$(`#content${id}`).val(),"publishtime":(new Date()).getTime(),
                "replyto":id,"postgroup":postgroup,"replygroup":id};
    var url = globalConfig.url;
    $.ajax({
        method: 'POST',
        xhrFields:{
            withCredentials:true
        },
        url: `http://${url}/post/replyto`,
        data: para,
        success: (data) => {
            if(data.code==200){
                location.reload();
                //TODO:
                // 后续考虑是否异步
            }else{
                alert('未知原因，楼中跟帖失败');
            }
        },
        error: (xhr, err) => {
            alert('楼中跟帖失败');
        }
    });
}

function addInnerReplyToOthers(replygroup){
    var replyto = $('#innerReplyToOthersDiv').attr('data-field');
    var postgroup = parseInt(window.location.href.substring(window.location.href.indexOf("=")+1));
    var content = "回复" + $(`#name${replyto}`).text()+':'+document.getElementById(`contentc${replygroup}`).value;
    var para = {"directreply":0,"content":content,"publishtime":(new Date()).getTime(),
                "replyto":replyto,"postgroup":postgroup,"replygroup":replygroup};
    var url = globalConfig.url;
    $.ajax({
        method: 'POST',
        xhrFields:{
            withCredentials:true
        },
        url: `http://${url}/post/replyto`,
        data: para,
        success: (data) => {
            if(data.code==200){
                location.reload();
                //TODO:
                // 后续考虑是否异步
            }else{
                alert('未知原因，楼中楼回复失败');
            }
        },
        error: (xhr, err) => {
            alert('楼中楼回复失败');
        }
    });
}

function transformTime(timestamp = +new Date()) {
    if (timestamp) {
        var time = new Date(timestamp);
        var y = time.getFullYear(); //getFullYear方法以四位数字返回年份
        var M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
        var d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
        var h = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
        var m = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
        var s = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
        return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
      } else {
          return '';
      }
}

function innerReplyToOthersHelper(replygroup,replyto){
    $('#innerReplyToOthersDiv').attr('data-field',replyto);
    //注意，两个div不可以重id
    $(`#ccc${replygroup}`).collapse('show');
}

function infoInjectAndShowModal(id){
    $('#interestsUserIDDiv').attr('data-field',id);
    $('#infoModal').modal('show');
}

function becomeFriends(){
    $('#infoModal').modal('hide');
    var url = globalConfig.url;
    var twoid = $('#interestsUserIDDiv').attr('data-field');
    var para = {"twoid":twoid};
    $.ajax({
        method: 'GET',
        xhrFields:{
            withCredentials:true
        },
        url: `http://${url}/friends/add`,
        data: para,
        success: (data) => { 
            if(data.code==200){
                alert('添加成功！');
            }else{
                alert('你好像已经加过Ta了哦');
            }
        },
        error: (xhr, err) => {
            alert('未知原因，添加失败');
        }
    });
}


function sessionCheck(){
    var url = globalConfig.url;
    $.ajax({
        method: 'GET',
        xhrFields:{
            withCredentials:true
        },
        url: `http://${url}/session/check`,
        success: (data) => {
            if(data.code==0){
                alert('好像还没登录呢，先去登录吧');
                window.location.href = "login.html";
            }else{
                showPostDetail();
            }
        },
        error: (xhr, err) => {
            alert('用户登录校验失败');
        }
    });
}