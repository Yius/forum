function queryPosts() {
    var originKeyword = window.location.href.substring(window.location.href.indexOf("w")+2);
    var keyword = decodeURI(originKeyword)
    var url = globalConfig.url;
    let curCul = window.location.href;
    let start = curCul.indexOf("=")+1;
    let end = curCul.indexOf("&");
    var currentPage = parseInt(curCul.substring(start,end));
    var page = currentPage;
    var para = { "keyword": keyword, "page": page, "pagesize": 20 };
    $.ajax({
        xhrFields:{
            withCredentials:true
        },
        method: 'GET',
        url: `http://${url}/posts/search`,
        data: para,
        success: (data) => {
            if(JSON.stringify(data)==="{}")return;
            let totalPage = data.totalPage;
            let postArr = data.post;
            let curCul = window.location.href;
            curCul.substring(curCul.indexOf('w')+2)
            let pageHTML =
                `<li class="page-item">
                    <a class="page-link disabled">
                        <span>&laquo;</span>
                    </a>
                </li>`;
            if (totalPage <= 10) {
                for (let i = 1; i <= totalPage; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active"><a class="page-link" href="posts.html?kp=${i}&kw=${originKeyword}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="posts.html?kp=${i}&kw=${originKeyword}">${i}</a></li>`
                    }
                }
            } else if (currentPage + 4 >= totalPage) {
                for (let i = totalPage - 9; i <= totalPage; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active"><a class="page-link" href="posts.html?kp=${i}&kw=${originKeyword}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="posts.html?kp=${i}"&kw=${originKeyword}>${i}</a></li>`
                    }
                }
            } else {
                for (let i = currentPage - 5; i <= currentPage + 4; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active"><a class="page-link" href="posts.html?kp=${i}&kw=${originKeyword}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="posts.html?kp=${i}&kw=${originKeyword}">${i}</a></li>`
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

            let postHTML = ""
            for (let i = 0; i < postArr.length; ++i) {
                postHTML +=
                    `
                    <div class="media card-body" style="border-bottom: solid gainsboro 1px;">
                        <img class="align-self-start mr-3 indexBox" src="${'userImg/'+postArr[i].avatar}" >
                        <div class="media-body">
                            <h5 class="mt-0"><a href="post.html?id=${postArr[i].id}&p=1&pagesize=20">${postArr[i].title}</a></h5>
                            <p>${postArr[i].content}</p>
                            <span style="font-size:10px;float:right;">发贴时间:${transformTime(postArr[i].publishtime)}</span>
                        </div>
                    </div>
                    `
            }
            $('#postPosition').html(postHTML);
        },
        error: (xhr, err) => {
            alert('查询失败');
        }
    })
}

function showPosts() {

    var currentPage = parseInt(window.location.href.substring(window.location.href.indexOf("=")+1))
    var para = { "page": currentPage, "pagesize": 20 };
    var url = globalConfig.url;
    $.ajax({
        xhrFields:{
            withCredentials:true
        },
        method: 'GET',
        url: `http://${url}/posts/list`,
        data: para,
        success: (data) => {
            let totalPage = data.totalPage;
            let postArr = data.post;
            let pageHTML =
                `<li class="page-item">
            <a class="page-link disabled">
                <span>&laquo;</span>
            </a>
        </li>`;
            if (totalPage <= 10) {
                for (let i = 1; i <= totalPage; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active"><a class="page-link" href="posts.html?p=${i}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="posts.html?p=${i}">${i}</a></li>`
                    }
                }
            } else if (currentPage + 4 >= totalPage) {
                for (let i = totalPage - 9; i <= totalPage; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active"><a class="page-link" href="posts.html?p=${i}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="posts.html?p=${i}">${i}</a></li>`
                    }
                }
            } else {
                for (let i = currentPage - 5; i <= currentPage + 4; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active"><a class="page-link" href="posts.html?p=${i}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="posts.html?p=${i}">${i}</a></li>`
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
            for (let i = 0; i < postArr.length; ++i) {
                postHTML +=
                    `<div class="media card-body" style="border-bottom: solid gainsboro 1px;">
                        <img class="align-self-start mr-3 indexBox" src="${'userImg/'+postArr[i].avatar}" >
                        <div class="media-body">
                            <h5 class="mt-0"><a href="post.html?id=${postArr[i].id}&p=1&pagesize=20">${postArr[i].title}</a></h5>
                            <p>${postArr[i].content}</p>
                            <span style="font-size:10px;float:right;">发贴时间:${transformTime(postArr[i].publishtime)}</span>
                        </div>
                    </div>`
            }
            $('#postPosition').html(postHTML);
        },
        error: (xhr, err) => {
            alert('贴子加载失败');
        }
    });

}


function searchWord(){
    //不要叫做search()，可能会与原有函数重名
    var keyword = document.getElementById("search").value;
    //传入不用encodeURI,读出却要URI
    window.location.href=`posts.html?kp=1&kw=${keyword}`;
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


function addPost(){
    var title = document.getElementById('title').value;
    var content = document.getElementById('content').value;
    var para = {"title":title,"content":content};
    var url = globalConfig.url;
    $.ajax({
        method: 'POST',
        xhrFields:{
            withCredentials:true
        },
        url: `http://${url}/posts/add`,
        data: para,
        success: (data) => {
            if(data.code==200){
                location.reload();
            }else{
                alert('未知原因，发帖失败');
            }
        },
        error: (xhr, err) => {
            alert('发贴失败');
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
                if (window.location.href.indexOf("k") == -1) {
                    $(window).on('load',showPosts());
                } else {
                    $(window).on('load',queryPosts());
                }
            }
        },
        error: (xhr, err) => {
            alert('用户登录校验失败');
        }
    });
}