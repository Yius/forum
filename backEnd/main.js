let mysql = require('mysql')
let pool = mysql.createPool({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'demaxiya08',
    database: 'forum',
    connectTimeout: 10
})

var http = require('http');
var URL = require('url');

let express = require('express')
let server = express()
let port = 5050

server.listen(port, function () {
    console.log('服务器启动成功，正在监听端口：', port)
})

//使用Express提供的中间件：处理POST请求中的主体数据，保存在req.body属性中
//处理application/x-www-form-urlencoded类型的请求数据
server.use(express.urlencoded({
    extended: false //是否使用扩展工具解析请求主体
}))
//自定义中间件：允许指定客户端的跨域访问
server.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*') //当前服务器允许来自任何客户端的跨域访问
    next() //放行，让后续的请求处理方法继续处理
})


//注册
server.post('/register', function (req, res) {
    let id = req.body.id
    let password = req.body.password
    let nickname = req.body.nickname
    let gender = req.body.gender
    let age = req.body.age
    let description = req.body.description
    let avatar = req.body.avatar
    // if(!id){
    //     res.send({msg:'账号不能为空'})
    //     return
    // }
    // if(!password){
    //     res.send({msg:'密码不能为空'})
    //     return
    // }

    let sql = "select * from user where name=?"
    pool.query(sql, [id], function (err, result) {
        if (err) throw err
        if (result.length > 0) {
            //res.json({code:0,msg:'用户已存在'})
            res.send({
                code: 0
            })
            return
        }
        let sql = "insert into user(id,password,nickname,gender,age,description,avatar)"
        pool.query(sql, [id, password, nickname, gender, age, description, avatar], function (err, result) {
            if (err) throw err
            //向客户端输出响应消息——返回数据中附加了新增的用户自增编号
            res.send({
                code: 200
            })
        })
    })
})

//登录
server.post('/login', function (req, res) {
    let uid = req.body.uid
    let pwd = req.body.pwd
    // if(!id){
    //     res.send({msg:'账号不能为空'})
    //     return
    // }
    // if(!password){
    //     res.send({msg:'密码不能为空'})
    //     return
    // }

    let sql2 = "select * from user where name=? and passwd=?"
    pool.query(sql2, [uid, pwd], function (err, result) {
        if (err) throw err
        if (result.length > 0) {
            res.send({
                code: 200
            })
        } else {
            res.send({
                code: 0
            })
        }
    })
})

//获取个人信息
server.get('/info/myinfo', function (req, res) {
    let info=URL.parse(req.url,true).query
})

//获得帖子列表
server.get('/posts/list', function (req, res) {
    let output={
        totalPage:{},
        post:{
            title:{},
            id:{},
            content:{},
            publishtime:{}
        }
    }
    let pageload=false  //totalpage是否完成查询
    let postload=false  //post是否完成查询
    let info = URL.parse(req.url, true).query
    let page = info.page
    let pagesize = info.pagesize
    let limit1 = (page - 1) * pagesize

    //查询总页数output.totalPage
    let sql1='select count(id) num from post'
    pool.query(sql1,function(err,result){
        if(err) 
            throw err
        pageload=true
        //获取总共页数totalPage
        if(result[0].num%pagesize!=0)
            output.totalPage=Math.ceil(result[0].num/pagesize)  //向上取整
        else
            output.totalPage=result[0].num/pagesize 
        if(postload){
            console.log(output)
            res.json(output)
        }
    })

    //查询帖子信息output.post
    let sql2 = 'select id,title,content from post order by publishtime limit '+limit1+','+pagesize
    pool.query(sql2,function (err, result) {
        if (err) 
            throw err
        if (result.length > 0) {
            postload=true
            if(pageload){
                //JSON格式化处理
                var dataString = JSON.stringify(result)
                var data = JSON.parse(dataString)
                output.post=data
                console.log(output)
                res.json(output)
            }
        }
        else{
            postload=true
            if(pageload){
                res.json({})
            }
        }
    })
})

//帖子查找
server.get('/posts/search',function(req,res){
    let output={
        totalPage:{},
        post:{
            title:{},
            id:{},
            content:{},
            publishtime:{}
        }
    }
    let pageload=false  //totalpage是否完成查询
    let postload=false  //post是否完成查询
    let info = URL.parse(req.url, true).query
    let page = info.page
    let pagesize = info.pagesize
    let keyword=info.keyword
    let limit1 = (page - 1) * pagesize

    //查询总页数output.totalPage
    let sql1='select count(id) num from post where title like "%'+keyword+'%"'
    pool.query(sql1,function(err,result){
        if(err) 
            throw err
        pageload=true
        //获取总共页数totalPage
        if(result[0].num%pagesize!=0)  
            output.totalPage=Math.ceil(result[0].num/pagesize)  //向上取整
        else
            output.totalPage=result[0].num/pagesize
        if(postload){
            console.log(output)
            res.json(output)
        }
    })

     //查询帖子信息output.post
    let sql2 = 'select id,title,content from post where title like "%'+keyword+'%" order by publishtime limit '+limit1+','+pagesize
    pool.query(sql2,function (err, result) {
        if (err) 
            throw err
        if (result.length > 0) {
            postload=true
            if(pageload){
                //JSON格式化处理
                var dataString = JSON.stringify(result)
                var data = JSON.parse(dataString)
                output.post=data
                console.log(output)
                res.json(output)
            }
        }
        else{
            postload=true
            if(pageload){
                res.json({})
            }
        }
    })
})