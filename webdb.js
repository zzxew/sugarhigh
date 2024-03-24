const mysql = require('mysql');
var search = document.getElementById('search');
search.addEventListener('click', function () {
    console.log('완료');
    const conn = {  // mysql 접속 설정
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '2467',
        database: 'menu'
    };
    
    let connection = mysql.createConnection(conn); // DB 커넥션 생성
    connection.connect();   // DB 접속
    
    let sql = "SELECT * FROM menu";
     console.log('ok');
    connection.query(sql, function (err, results, fields) { 
        if (err) {
            console.log(err);
        }
        console.log(results);
    });
     
    connection.end(); // DB 접속 종료
})

//const mysql = require('mysql');  // mysql 모듈 로드

