const express = require('express');
const app = express();
const port = 80;
const qs = require('qs');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const conn = {  // mysql 접속 설정
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '2467',
    database: 'menu'
};

let connection = mysql.createConnection(conn); // DB 커넥션 생성
connection.connect();   // DB 접속
let sqls;
let param;

//이미지 링크
app.get('/logo', (req,res) => {
    res.sendFile(__dirname + "/logo_k_e.png");
});

app.get('/srbutton', (req,res) => {
    res.sendFile(__dirname + "/srbutton.png");
});

app.get('/combutton', (req,res) => {
    res.sendFile(__dirname + "/combutton.png");
});

//화면 링크(프론트)
app.get('/', (req,res) => {
    res.sendFile(__dirname + "/sugarhigh.html");
});

app.get('/search', (req,res) => {
    res.sendFile(__dirname + "/searchpage.html");
});

app.get('/community', (req,res) => {
    res.sendFile(__dirname + "/community.html");
});

app.get('/modify', (req,res) => {
    res.sendFile(__dirname + "/modify.html");
});

app.get('/certification', (req,res) => {
    res.sendFile(__dirname + "/certificate.html");
});

app.get('/writer', (req,res) => {
    res.sendFile(__dirname + "/writer.html");
});

//백 서버
app.get('/menu', (req, res) => {
    let sql = "SELECT * FROM menu";
connection.query(sql, function (err, results, fields) { 
    if (err) {
        console.log(err);
    }
    console.log('ok');
    list = JSON.stringify(results);
    res.send(list);
});
    
})

app.get('/root', (req, res) => {
    let sql = "SELECT * FROM account";
    connection.query(sql, function (err, results, fields) { 
        if (err) {
            console.log(err);
        }
        console.log('ok');
        list = JSON.stringify(results);
        res.send(list);
    });
    
})

app.get('/request', (req, res) => {
    let sql = "SELECT * FROM community";
    var list;
    connection.query(sql, function (err, results, fields) { 
        if (err) {
            console.log(err);
        }
        console.log('ok');
        list = JSON.stringify(results);
        res.send(list);
    });
})

app.get('/buffer', (req, res) => {
    var sql = sqls;
    var list;
    connection.query(sql, param, function (err, results, fields) { 
        if (err) {
            console.log(err);
        }
        console.log('ok');
        list = JSON.stringify(results);
        res.send(list);
    });
})

app.post('/requestconfirm', (req, res) => {
    var flag=false;
    var body='';
    req.on('data', function(data) {body=body+data;});
    req.on('end', function() {
        var post = qs.parse(body);
        const obj=JSON.parse(JSON.stringify(post));
        var keys=Object.keys(obj);
        let sql="INSERT INTO community(code, nickname, request) VALUES(?, ?, ?)"
        var params = [Number(obj[keys[0]]), obj[keys[1]], obj[keys[2]]];
        if(obj[keys[0]]==0) {flag=true;}
        if(flag==false){
        connection.query(sql, params, function (err, rows, fields) { 
            if (err) {
                console.log(err);
            }
            console.log('confirm');
        });
    }
        res.writeHead(302, {Location : `/community`});
        res.end();
    })
})

app.post('/comdelete', (req, res) => {
    var body='';
    var flag = false;
    req.on('data', function(data) {body=body+data;});
    req.on('end', function() {
        var post = qs.parse(body);
        const obj=JSON.parse(JSON.stringify(post));
        var keys=Object.keys(obj);
        let sql="DELETE FROM community WHERE code=?"
        var params = [Number(obj[keys[0]])];
        params.forEach(element => { if(element==null || element==NaN) flag=true; });
        if(flag!=true){
            connection.query(sql, params, function (err, rows, fields) { 
                    if (err) {
                    console.log(err);
                    }
                    console.log("ok");
             });
            res.writeHead(302, {Location : `/modify`});
            res.end();}
        else {
            console.log("삭제할 수 없습니다.")
            res.writeHead(302, {Location : `/modify`});
            res.end(); }
    })
})

app.post('/dbupdate', (req, res) => {
    var body='';
    var flag = false;
    req.on('data', function(data) {body=body+data;});
    req.on('end', function() {
        var post = qs.parse(body);
        const obj=JSON.parse(JSON.stringify(post));
        var keys=Object.keys(obj);
        let sql;
        var params = [obj[keys[0]], obj[keys[1]], obj[keys[2]]];
        params.forEach(element => { if(element==null || element==NaN) flag=true; });
        if(obj[keys[0]]=="name") {sql="UPDATE menu SET name = ? WHERE mid=?"; params = [obj[keys[1]], Number(obj[keys[2]])];}
        else if(obj[keys[0]]=="sugar") {sql="UPDATE menu SET sugar = ? WHERE mid=?"; params = [Number(obj[keys[1]]), Number(obj[keys[2]])];}
        else if(obj[keys[0]]=="kcal") {sql="UPDATE menu SET kcal = ? WHERE mid=?"; params = [Number(obj[keys[1]]), Number(obj[keys[2]])];}
        else if(obj[keys[0]]=="percentage") {sql="UPDATE menu SET percentage = ? WHERE mid=?"; params = [Number(obj[keys[1]]), Number(obj[keys[2]])];}
        else if(obj[keys[0]]=="color") {sql="UPDATE menu SET color = ? WHERE mid=?"; params = [obj[keys[1]], Number(obj[keys[2]])];}
        else if(obj[keys[0]]=="brand") {sql="UPDATE menu SET brand = ? WHERE mid=?"; params = [obj[keys[1]], Number(obj[keys[2]])];}
        else { flag=true; }
        if(flag!=true){
            connection.query(sql, params, function (err, rows, fields) { 
                    if (err) {
                    console.log(err);
                    }
                    console.log("ok");
             });
            res.writeHead(302, {Location : `/modify`});
            res.end();}
        else {
            console.log("null값은 넣을 수 없습니다.")
            res.writeHead(302, {Location : `/modify`});
            res.end(); }
    })
})

app.post('/dbdelete', (req, res) => {
    var body='';
    var flag = false;
    req.on('data', function(data) {body=body+data;});
    req.on('end', function() {
        var post = qs.parse(body);
        const obj=JSON.parse(JSON.stringify(post));
        var keys=Object.keys(obj);
        let sql="DELETE FROM menu WHERE mid=?"
        var params = [Number(obj[keys[0]])];
        params.forEach(element => { if(element==null || element==NaN) flag=true; });
        if(flag!=true){
            connection.query(sql, params, function (err, rows, fields) { 
                    if (err) {
                    console.log(err);
                    }
                    console.log("ok");
             });
            res.writeHead(302, {Location : `/modify`});
            res.end();}
        else {
            console.log("삭제할 수 없습니다.")
            res.writeHead(302, {Location : `/modify`});
            res.end(); }
    })
})

app.post('/dbinsert', (req, res) => {
    var body='';
    var flag = false;
    req.on('data', function(data) {body=body+data;});
    req.on('end', function() {
        var post = qs.parse(body);
        const obj=JSON.parse(JSON.stringify(post));
        var keys=Object.keys(obj);
        let sql="INSERT INTO menu VALUES(?, ?, ?, ?, ?, ?, ?)"
        var params = [Number(obj[keys[0]]), obj[keys[1]], Number(obj[keys[2]]), Number(obj[keys[3]]), Number(obj[keys[4]]), obj[keys[5]], obj[keys[6]]];
        params.forEach(element => {
             if(element==null || element==NaN) flag=true;
             });
    if(flag!=true){
        connection.query(sql, params, function (err, rows, fields) { 
                if (err) {
                console.log(err);
                }
                console.log("ok");
        });
        res.writeHead(302, {Location : `/modify`});
        res.end();}
    else {
        console.log("null값은 넣을 수 없습니다.")
        res.writeHead(302, {Location : `/modify`});
        res.end(); }
    })
})

app.post('/src', (req, res) => {
    var list;
    var body='';
    var flag = false;
    req.on('data', function(data) {body=body+data;});
    req.on('end', function() {
        var post = qs.parse(body);
        const obj=JSON.parse(JSON.stringify(post));
        var keys=Object.keys(obj);
        var params = [obj[keys[0]], obj[keys[1]]];
        params.forEach(element => { if(element==null || element==NaN) flag=true; });
        if(obj[keys[0]]=="name") {sqls="SELECT * FROM menu WHERE name LIKE ?"; param = '%' + [obj[keys[1]]] + '%';}
        else if(obj[keys[0]]=="sugar") {sqls="SELECT * FROM menu WHERE sugar<?"; param = [Number(obj[keys[1]])]; }
        else if(obj[keys[0]]=="kcal") {sqls="SELECT * FROM menu WHERE kcal<?"; param = [Number(obj[keys[1]])];}
        else if(obj[keys[0]]=="percentage") {sqls="SELECT * FROM menu WHERE percentage<?"; param = [Number(obj[keys[1]])];}
        else if(obj[keys[0]]=="color") {sqls="SELECT * FROM menu WHERE color LIKE ?"; param = '%' + [obj[keys[1]]] + '%';}
        else if(obj[keys[0]]=="brand") {sqls="SELECT * FROM menu WHERE brand LIKE ?"; param = '%' + [obj[keys[1]]] + '%';}
        else { flag=true; }
        if(flag!=true){
            connection.query(sqls, param, function (err, results, fields) { 
                    if (err) {
                    console.log(err);
                    }
                    list = JSON.stringify(results);
                    console.log("ok");
             });
            res.writeHead(302, {Location : `/search`});
            res.end();}
        else {
            console.log("값이 잘못되었습니다.")
            res.writeHead(302, {Location : `/search`});
            res.end(); }
    })
})

//접속
app.listen(port, () => {
    console.log('test')
})