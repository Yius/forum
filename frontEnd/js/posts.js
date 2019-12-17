function queryPosts(page) {
    var keyword = document.getElementById("search").value;
    var url = "127.0.0.1";
    var currentPage = parseInt(window.location.href.indexOf("=") + 1)
    page = page || currentPage
    var para = { "keyword": keyword, "page": page, "pagesize": 20 };
    $.ajax({
        method: 'GET',
        url: `http://${url}/posts/search`,
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
                        pageHTML += `<li class="page-item active><a class="page-link" href="posts.html?kp=${i}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="posts.html?kp=${i}">${i}</a></li>`
                    }
                }
            } else if (currentPage + 4 >= totalPage) {
                for (let i = totalPage - 9; i <= totalPage; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active><a class="page-link" href="posts.html?kp=${i}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="posts.html?kp=${i}">${i}</a></li>`
                    }
                }
            } else {
                for (let i = currentPage - 5; i <= currentPage + 4; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active><a class="page-link" href="posts.html?kp=${i}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="posts.html?kp=${i}">${i}</a></li>`
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
                    `<li class="media">
                        <img class="mr-3 indexBox" src="images/index_box.jfif" >
                        <div class="media-body">
                            <h5 class="mt-0 mb-1"><a href="post.html?p=${postArr[i].id}">${postArr[i].title}</a></h5>
                            ${postArr[i].content}
                        </div>
                    </li>`
            }
            $('#postPosition').html(postHTML);
        },
        error: (xhr, err) => {
            alert('查询失败：');
        }
    })
}

function showPosts() {

    var currentPage = parseInt(window.location.href.indexOf("=") + 1)
    var para = { "page": currentPage, "pagesize": 20 };
    var url = "127.0.0.1";
    $.ajax({
        method: 'GET',
        url: `http://${url}/list`,
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
                        pageHTML += `<li class="page-item active><a class="page-link" href="posts.html?p=${i}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="posts.html?p=${i}">${i}</a></li>`
                    }
                }
            } else if (currentPage + 4 >= totalPage) {
                for (let i = totalPage - 9; i <= totalPage; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active><a class="page-link" href="posts.html?p=${i}">${i}</a></li>`
                    } else {
                        pageHTML += `<li class="page-item"><a class="page-link" href="posts.html?p=${i}">${i}</a></li>`
                    }
                }
            } else {
                for (let i = currentPage - 5; i <= currentPage + 4; ++i) {
                    if (currentPage == i) {
                        pageHTML += `<li class="page-item active><a class="page-link" href="posts.html?p=${i}">${i}</a></li>`
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

            let postHTML = ""
            for (let i = 0; i < postArr.length; ++i) {
                postHTML +=
                    `<li class="media">
                        <img class="mr-3 indexBox" src="images/index_box.jfif" >
                        <div class="media-body">
                            <h5 class="mt-0 mb-1">${postArr[i].title}</h5>
                            ${postArr[i].content}
                        </div>
                    </li>`
            }
            $('#postPosition').html(postHTML);
        },
        error: (xhr, err) => {
            // alert('贴子加载失败');
        }
    })

}