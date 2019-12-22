let mysql = require('mysql')
let pool = mysql.createPool({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'demaxiya08',
    database: 'forum',
    connectTimeout: 10
})

var URL = require('url');
let session = require('express-session')
var bodyParser = require('body-parser');
let express = require('express')
let server = express()
let port = 5050


server.use(session({
    secret: "this is a string key",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 30000000
    }
}))

// const path = require('path'); //系统路径模块

// let p = path.join(__dirname, '../frontEnd')
// console.log(p)
// server.use(express.static('E:\forum\frontEnd'));
//自定义中间件：允许指定客户端的跨域访问
server.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', req.get('Origin'))
    //res.set('Access-Control-Allow-Origin',  '*') //当前服务器允许来自任何客户端的跨域访问
    res.set('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,DELETE')
    res.set('Access-Control-Max-Age', '3600')
    res.set('Access-Control-Allow-Headers', 'Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With,userId,token,Access-Control-Allow-Headers')
    res.set('Access-Control-Allow-Credentials', 'true')
    next() //放行，让后续的请求处理方法继续处理
})


server.use(bodyParser.urlencoded({
    extended: false, //扩展模式
    limit: 2 * 1024 * 1024 //限制-2M
}));

server.listen(port, function () {
    console.log('服务器启动成功，正在监听端口：', port)
})


/**
 * API 1、获取好友列表
 */
server.get('/friends/list', function (req, res) {
    let id = req.session.uid
    console.log(req.sessionID)
    if (!id) {
        res.json({
            code: 400,
            msg: 'no logged in'
        })
        return
    } else {
        let output = {}
        //查询数据库
        let sql = 'SELECT twoid as fid,twoname as fname,twoavatar as favatar FROM friend WHERE oneid=?'
        pool.query(sql, [id], function (err, result) {
            if (err) throw err
            else {
                if (result.length > 0)
                    output = result
                else
                    output = []
                let sql = 'select oneid as fid,onename as fname,oneavatar as favatar from friend where twoid=?'
                pool.query(sql, [id], function (err, result) {
                    if (err) throw err
                    if (result.length > 0)
                        output = output.concat(result)
                    res.json(output)
                })
            }
        })
    }
})

/**
 * API 2、获取聊天内容
 */
server.get('/friends/talk', function (req, res) {
    let id = req.session.uid
    if (!id) {
        res.json({
            code: 400,
            msg: 'no logged in'
        })
        return
    }
    let to = req.query.to;
    if (!to) {
        res.json({
            code: 100
        })
        return
    }
    //查询数据库
    let output = {};
    let sql = 'SELECT * FROM talkinfo WHERE (senderid=? and receiverid=?) or (senderid=? and receiverid=?) order by sendtime'
    pool.query(sql, [id, to, to, id], function (err, result) {
        if (err) throw err
        else {
            if (result.length > 0)
                output = result;
            res.json(output)
        }
    })
})

/**
 * API 3、回复
 */
server.post('/post/replyto', function (req, res) {
    let id = req.session.uid
    let nickname = req.session.nickname
    let avatar = req.session.avatar
    // let id = "user1"
    // let nickname = "user1"
    // let avatar = "dad"
    if (!id) {
        res.json({
            code: 400,
            msg: 'no logged in'
        })
        return
    }
    let publishtime = req.body.publishtime
    let directreply = req.body.directreply
    let replyto = req.body.replyto;
    let postgroup = req.body.postgroup
    let content = req.body.content
    if (!publishtime || !replyto || !postgroup) {
        res.json({
            code: 100
        })
        return
    }
    let replygroup = 0
    if(directreply==0){
        replygroup = req.body.replygroup
        if(!replygroup){
            res.json({code:100})
        }
    }
    //查询数据库
    let sql = 'insert into postreply values(null,?,?,?,?,?,?,?,?,?,null)'
    pool.query(sql, [id, nickname, avatar, publishtime, directreply, replyto, postgroup, replygroup, content], function (err, result) {
        if (err)
            res.json({
                code: 0
            })
        else{
            if(directreply == 1){
                let replygroup = result.insertId
                let sql = 'update postreply set replygroup = ? where id = ?'
                pool.query(sql,[replygroup,replygroup],function(err,result){
                    if(err)
                        res.json({
                            code:0
                        })
                    else
                        res.json({
                            code:200
                        })
                })
            }else{
                res.json({
                    code:200
                })
            }
        }
    })
})

/**
 * API 4、发帖
 */
server.post('/posts/add', function (req, res) {
    let id = req.session.uid
    let nickname = req.session.nickname
    let avatar = req.session.avatar
    // let id = "user1"
    // let nickname = "user1"
    // let avatar = "dad"
    if (!id) {
        res.json({
            code: 400,
            msg: 'no logged in'
        })
        return
    }
    let title = req.body.title
    let content = req.body.content
    //不能通过req.body.publishtime来获得时间戳，因为会自动转化为时间格式
    let publishtime = (new Date()).getTime()
    if (!title || !content || !publishtime) {
        res.json({
            code: 100
        })
        return
    }
    //查询数据库
    let sql = 'insert into postreply values(null,?,?,?,?,-1,-1,null,-1,?,?)'
    pool.query(sql, [id, nickname, avatar, publishtime, content, title], function (err, result) {
        if (err)
            res.json({
                code: 0
            })
        else{
            let sql2 = 'update postreply set postgroup=? where id = ?'
            pool.query(sql2, [result.insertId, result.insertId],function (err,result2){
                if(err){
                    res.json({
                        code: 0
                    })
                }else{
                    res.json({
                        code: 200,
                        id: result.insertId
                    })
                }
            })
        }
    })
})

/**
 * API 5、修改信息
 */
server.post('/info/alter', function (req, res) {
    let id = req.session.uid
    console.log(id)
    // let id = "user1"
    if (!id) {
        res.json({
            code: 400,
            msg: 'no logged in'
        })
        return
    }
    let password = req.body.password
    let nickname = req.body.nickname
    let gender = req.body.gender
    let bornyear = req.body.bornyear
    let description = req.body.description
    if (!password || !nickname || !gender || !bornyear || !description) {
        res.json({
            code: 100
        })
        return
    }
    if (password == "" || nickname == "" || gender == "" || description == "") {
        res.json({
            code: 500,
            msg: 'can not be empty'
        })
        return
    }
    //查询数据库
    let sql = 'update user set password=?,nickname=?,gender=?,bornyear=?,description=? where id=?'
    pool.query(sql, [password, nickname, gender, bornyear, description, id], function (err, result) {
        if (err)
            res.json({
                code: 0
            })
        else
            res.json({
                code: 200
            })
    })
})

/**
 * API 6、注册
 */
server.post('/register', function (req, res) {
    let id = req.body.id;
    let password = req.body.password
    let nickname = req.body.nickname
    let gender = req.body.gender
    let bornyear = req.body.bornyear
    let description = req.body.description
    let avatar = req.body.avatar
    if (!id || !password || !nickname || !gender || !bornyear || !description || !avatar) {
        res.json({
            code: 100
        })
        return
    }
    if (id == "" || password == "" || nickname == "" || gender == "" || description == "" || avatar == "") {
        res.json({
            code: 500,
            msg: 'can not be empty'
        })
        return
    }
    let sql = 'select * from user where id=?'
    pool.query(sql, [id], function (err, result) {
        if (err) throw err
        else {
            if (result.length > 0) {
                res.json({
                    code: 0,
                    msg: 'id already exists'
                })
            } else {
                let sql = 'insert into user values(?,?,?,?,?,?,?)'
                pool.query(sql, [id, password, nickname, gender, bornyear, description, avatar], function (err, result) {
                    if (err)
                        res.json({
                            code: 0
                        })
                    else {
                        res.json({
                            code: 200
                        })
                    }
                })
            }
        }
    })

})

/**
 * API 7、登录
 */
server.post('/login', function (req, res) {
    let id = req.body.id
    let password = req.body.password
    console.log(req.sessionID)
    if (!id || !password) {
        res.json({
            code: 100
        })
        return
    }
    if (id == "" || password == "") {
        res.json({
            code: 0,
            msg: 'can not be empty'
        })
        return
    }
    let sql = 'select * from user where id=? and password=?'
    pool.query(sql, [id, password], function (err, result) {
        if (err) throw err
        else {
            if (result.length > 0) {
                req.session.uid = result[0].id
                req.session.password = result[0].password
                req.session.nickname = result[0].nickname
                req.session.gender = result[0].gender
                req.session.description = result[0].description
                req.session.avatar = result[0].avatar
                console.log(req.sessionID)
                res.json({
                    code: 200,
                    msg: 'login success'
                })
            } else {
                res.json({
                    code: 0,
                    msg: 'login fail'
                })
            }
        }
    })

})

/**
 * 8、建立好友关系
 */
server.get('/friends/add', function (req, res) {
    let oneid = req.session.uid;
    let onename = req.session.nickname
    let oneavatar = req.session.avatar
    if (!oneid) {
        res.json({
            code: 400,
            msg: 'no logged in'
        })
        return
    }
    let twoid = req.query.twoid
    if (!twoid) {
        res.json({
            code: 100
        })
        return
    }
    if (oneid == "" || twoid == "") {
        res.json({
            code: 500,
            msg: 'can not be empty'
        })
        return
    }
    let sql = 'select * from friend where (oneid=? and twoid=?) or (oneid=? and twoid=?)'
    pool.query(sql, [oneid, twoid, twoid, oneid], function (err, result) {
        if (err) throw err
        else {
            if (result.length > 0) {
                res.json({
                    code: 0,
                    msg: 'friend has been added'
                })
            } else {
                let sql = 'select * from user where id = ?'
                pool.query(sql, [twoid], function (err, result) {
                    if (err) throw err
                    else {
                        if (result.length > 0) {
                            let twoname = result[0].nickname
                            let twoavatar = result[0].avatar
                            let sql = 'insert into friend values(null,?,?,?,?,?,?)'
                            pool.query(sql, [oneid, twoid, onename, twoname, oneavatar, twoavatar], function (err, result) {
                                if (err)
                                    res.json({
                                        code: 0
                                    })
                                else {
                                    res.json({
                                        code: 200
                                    })
                                }
                            })
                        }
                    }
                })
            }
        }
    })
})

/**
 * 9、退出
 */
server.get('/user/logout', function (req, res) {
    if (req.session.uid) {
        if (req.session.destroy()) {
            res.json({
                code: 200
            })
        } else {
            res.json({
                code: 0
            })
        }
    } else {
        res.json({
            code: 200
        })
    }
})

/**
 * 10、检查是否已登录
 */
server.get('/islogin', function (req, res) {
    if (req.session.uid) {
        let user = {}
        user.id = req.session.uid
        user.password = req.session.password
        user.nickname = req.session.nickname
        user.gender = req.session.gender
        user.description = req.session.description
        user.avatar = req.session.avatar
        res.json({
            code: 200,
            user: user
        })
    } else {
        res.json({
            code: 0
        })
    }
})
/**
 * 11、获取帖子列表
 */
server.get('/posts/list', function (req, res) {
    console.log(req.sessionID)
    let output = {
        totalPage: {},
        post: {
            title: {},
            id: {},
            content: {},
            publishtime: {}
        }
    }
    let pageload = false //totalpage是否完成查询
    let postload = false //post是否完成查询
    let page = req.query.page
    let pagesize = req.query.pagesize
    let limit1 = (page - 1) * pagesize

    //查询总页数output.totalPage
    let sql1 = 'select count(id) num from postreply where directreply=-1'
    pool.query(sql1, function (err, result) {
        if (err)
            throw err
        pageload = true
        //获取总共页数totalPage
        if (result[0].num % pagesize != 0)
            output.totalPage = Math.ceil(result[0].num / pagesize) //向上取整
        else
            output.totalPage = result[0].num / pagesize
        if (postload) {
            console.log(output)
            res.json(output)
        }
    })

    //查询帖子信息output.post
    let sql2 = 'select id,title,content,publishtime from postreply where directreply=-1 order by publishtime limit ' + limit1 + ',' + pagesize
    pool.query(sql2, function (err, result) {
        if (err)
            throw err
        if (result.length > 0) {
            postload = true
            if (pageload) {
                //JSON格式化处理
                var dataString = JSON.stringify(result)
                var data = JSON.parse(dataString)
                output.post = data
                console.log(output)
                res.json(output)
            }
        } else {
            postload = true
            if (pageload) {
                res.json({})
            }
        }
    })
})
/**
 * 12、好友发送信息
 */
server.post("/friends/sendmsg", function (req, res) {
    let content = req.body.content
    let rid = req.body.receiverid //接收者id
    let rname = req.body.receivername //接收者name
    let sendtime = req.body.sendtime //发送时间
    let ravatar = req.body.receiveravata //接收者头像
    let sid = req.session.uid //发送者id
    let sname = req.session.nickname //发送者name
    let savatar = req.session.avatar //发送者avatar
    if (!sid) {
        res.json({
            code: 400,
            msg: "no logged in"
        })
        return
    }
    let sql = "insert into talkinfo values(null,?,?,?,?,?,?,?,?)"
    pool.query(sql, [content, sid, sname, rid, rname, sendtime, savatar, ravatar], function (err, result) {
        if (err)
            res.json({
                code: 0
            })

        else
            res.json({
                code: 200,
            })
    })
})






/**
 * API 13、获得帖子细节alldetail
 */
server.get('/post/alldetail', function (req, res) {
    let output = {}
    let countload = 0
    let info = URL.parse(req.url, true).query
    let page = info.page
    let id = info.id
    let pagesize = info.pagesize
    let limit1 = (page - 1) * pagesize;
    if (page == 1) {
        pagesize = pagesize - 1
    }
    if (page != 1) {
        limit1 = limit1 - 1
    }

    //1.查询总页数output.totalPage
    let sql1 = 'select count(id) num from postreply where (directreply=1 or directreply=-1) and postgroup=?'
    pool.query(sql1, [id], function (err, result) {
        if (err)
            throw err

        if (page == 1) {
            pagesize++
        }
        if (result[0].num % pagesize != 0)
            output.totalPage = Math.ceil(result[0].num / pagesize) //向上取整
        else
            output.totalPage = result[0].num / pagesize

        countload++;
        if (countload == 3) {
            res.json(output)
        }

    })


    //2.查找顶楼信息
    let sql2 = 'select id,title,content,uid,nickname,avatar,publishtime from postreply where postgroup=?'
    pool.query(sql2, [id], function (err, result) {
        if (err)
            throw err
        countload++
        if (page == 1) {
            output.topPost = result[0]
        }
        if (countload == 3) {
            res.json(output)
        }
    })

    //3.查找直接回复的楼层
    let length = 0
    let sql3 = 'select id,uid,nickname,avatar,publishtime,replygroup,content from postreply where directreply=1 and postgroup=? order by publishtime limit ' + limit1 + ',' + pagesize
    pool.query(sql3, [id], function (err, result) {
        if (err)
            throw err
        if (result.length > 0) {
            var dataString = JSON.stringify(result)
            var data = JSON.parse(dataString)
            output.post = data
            length = output.post.length
        } else {
            if (page != 1) {
                output.post = {}
            }
            length = 0
        }

        let sql4 = 'select count(replygroup) num from postreply where directreply=0 and replygroup=?'
        if (length > 0) {
            for (let i = 0; i < length; i++) {
                let replygroup = output.post[i].id
                pool.query(sql4, [replygroup], function (err, result) {
                    if (err)
                        throw err
                    if (result[0].num > 0) {
                        var dataString = JSON.stringify(result[0].num)
                        var data = JSON.parse(dataString)
                        output.post[i].replys = data
                        console.log("s:", output.post[i].replys)
                    } else {
                        output.post[i].replys = 0
                    }
                    if (i == output.post.length - 1) {
                        countload++
                        if (countload == 3) {
                            res.json(output)
                        }
                    }
                })
            }
        } else {
            countload++
            if (countload == 3)
                res.json(output)
        }
    })
})


/**
 * API 14、显示所有回复
 */
server.get('/post/replys', function (req, res) {
    let output = {
        totalPage: {},
        post: {
            id: {},
            uid: {},
            nickname: {},
            avatar: {},
            publishtime: {},
        }
    }
    let info = URL.parse(req.url, true).query
    let replygroup = info.replygroup
    let page = info.page
    let countload = 0
    let num = 0
    let limit1 = (page - 1) * 3
    let sql1 = 'select count(id) num from postreply where replygroup=? and directreply=0 '
    pool.query(sql1, [replygroup], function (err, result) {
        if (err)
            throw err
        countload++
        if (result.length == 0) //如果没有结果
            num = 0
        else
            num = result[0].num

        if (num % 3 != 0)
            output.totalPage = Math.ceil(num / 3) //向上取整
        else
            output.totalPage = num / 3
        if (countload == 2)
            res.json(output)
    })

    let sql2 = 'select id,uid,nickname,avatar,publishtime,content from postreply where replygroup=? and directreply=0 limit ' + limit1 + ',3'
    pool.query(sql2, [replygroup], function (err, result) {
        if (err)
            throw err
        console.log("2")
        if (result.length > 0) {
            var dataString = JSON.stringify(result)
            var data = JSON.parse(dataString)
            output.post = data
            console.log(data)
        } else {
            output.post = {}
        }
        countload++
        if (countload == 2)
            res.json(output)
    })

})

/**
 * API 15、帖子查找
 */
server.get('/posts/search', function (req, res) {
    let output = {
        totalPage: {},
        post: {
            title: {},
            id: {},
            content: {},
            publishtime: {}
        }
    }
    let pageload = false //totalpage是否完成查询
    let postload = false //post是否完成查询
    let info = URL.parse(req.url, true).query
    let page = info.page
    let pagesize = info.pagesize
    let keyword = info.keyword
    let limit1 = (page - 1) * pagesize

    //查询总页数output.totalPage
    let sql1 = 'select count(id) num from postreply where title like "%' + keyword + '%"'
    pool.query(sql1, function (err, result) {
        if (err)
            throw err
        pageload = true
        //获取总共页数totalPage
        if (result[0].num % pagesize != 0)
            output.totalPage = Math.ceil(result[0].num / pagesize) //向上取整
        else
            output.totalPage = result[0].num / pagesize
        if (postload) {
            res.json(output)
        }
    })

    //查询帖子信息output.post
    let sql2 = 'select id,title,content,publishtime from postreply where title like "%' + keyword + '%" order by publishtime limit ' + limit1 + ',' + pagesize
    pool.query(sql2, function (err, result) {
        if (err)
            throw err
        if (result.length > 0) {
            postload = true
            if (pageload) {
                //JSON格式化处理
                var dataString = JSON.stringify(result)
                var data = JSON.parse(dataString)
                output.post = data
                console.log(output)
                res.json(output)
            }
        } else {
            postload = true
            if (pageload) {
                res.json({})
            }
        }
    })
})


/**
 * API 16、获取个人信息
 */
server.get('/info/mine', function (req, res) {
    let output = {
        id: {},
        nickname: {},
        gender: {},
        age: {},
        description: {},
        avatar: {}
    }
    let id = req.query.id
    let sql = "select * from user where id=?"
    pool.query(sql, [id], function (err, result) {
        if (err)
            throw err
        if (result.length > 0) {
            var dataString = JSON.stringify(result[0])
            var data = JSON.parse(dataString)
            output = data
            res.json(output)
        } else {
            res.json({})
        }
    })
})