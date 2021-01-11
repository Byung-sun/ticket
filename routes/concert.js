var express = require("express");
var router = express.Router();
const request = require('request');
var moment = require("moment");
require("moment-timezone");
require('dotenv').config();
moment.tz.setDefault("Asia/Seoul");


var mysql = require("mysql2");
var connection = mysql.createConnection({
  host: process.env.host,
  port: process.env.port, // db 포트
  user: process.env.user, // user 이름
  password: process.env.password, // 비밀번호
  database: process.env.database, // database 이름
});

module.exports = function() {
    

    router.route("/index").get(function(req, res, next){
        var concert = req.query.concert;    
        var x = req.query.x;        
        var y = req.query.y;    
        var time = req.query.time;  
        var name = req.query.name;                                
        console.log(concert)

        var date = moment().format("YYYYMMDDHHmmss");       //moment를 이용한 현재 시간 
        console.log(date);
          connection.query(
            "insert into mouse(time, time2, x_position, y_position, name) values (?,?,?,?,?)",
            [date, time, x, y, name],
            function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log("insert success");
              }
            }
          );

        let options = {                                                                     //request에 들어갈 옵션 값 url, method, json 값 등록
            uri: "http://kairos-link.iptime.org:8080/api/v1/get_concert?concertId="+concert,
            method: 'get',
            json:true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
        };
        request.get(options, function(err,httpResponse,body){                               //contract를 통하여 받은 return 값은 body라는 변수로 등록
            if(err){
            console.log(err)
            }else{
            console.log(body);
            connection.query(
                `select * from concert where id=?`,
                [concert],
                function(err, result){
                    if (err){
                        console.log(err);
                    }else{
                      console.log(result);
                      connection.query(
                          `select * from ticket where concertId = ?`,
                          [concert],
                          function(err2, result2){
                              if(err2){
                                  console.log("err2 =", err2)
                              }else{
                                  console.log(result2);
                                res.render("concert/reserve", {data: body, concert: result, poster_img: result[0].poster_img , info_img: result[0].info_img, ticket:result2, loggedname : req.session.name});   
                              }
                          }
                      )
                    }
                }
              )              
            }
        })
    })

    router.route("/regist").get(function(req, res, next){
        connection.query(
            `select * from hall`,
            function(err, result){
                if(err){
                    console.log("err". err)
                }else{
                    console.log(result);
                    res.render("concert/regist", {hall: result})
                }
            }
        )
    })

    //공연 등록
    router.route("/regist2").post(function(req, res, next){ 
        var concertId = req.body.concertId;                                      
        var name = req.body.name;
        var place = req.body.place;
        var date = Number(req.body.date);
        var time = req.body.time;
        var showtime = req.body.showtime;
        var genre = req.body.genre;
        var rating = req.body.rating;
        var url1 = req.body.url1;
        var url2 = req.body.url2;
        var seat1 = req.body.seat1;
        var seat2 = req.body.seat2;
        var seat3 = req.body.seat3;
        var seat4 = req.body.seat4;
        var seat5 = req.body.seat5;
        var vip = req.body.vip;
        var r = req.body.r;
        var s = req.body.s;
        var a = req.body.a;
        var b = req.body.b;

        console.log(vip, r, s, a, b);

        // for(var i = 0; i < vip; i++){
        //     connection.query(
        //         `insert into ticket (concertId, ticketId, date, time, seat, price, discount, discountRate, 
        //             fee, cancleDate, cancleFee, state) values (?,?,?,?,?,?,?,?,?,?,?,?)`,
        //         [concertId, "vip"+i, date, time, "vip"+i, seat1, 0, 0, 0, 0, 0, 0],
        //         function(err, result){
        //             if(err){
        //                 console.log("ticket insert error = ", err)
        //             }else{
        //                 console.log(result)
        //             }
        //         }
        //     )
        // }
        // for(var i = 0; i < r; i++){
        //     connection.query(
        //         `insert into ticket (concertId, ticketId, date, time, seat, price, discount, discountRate, 
        //             fee, cancleDate, cancleFee, state) values (?,?,?,?,?,?,?,?,?,?,?,?)`,
        //         [concertId, "r"+i, date, time, "r"+i, seat2, 0, 0, 0, 0, 0, 0],
        //         function(err, result){
        //             if(err){
        //                 console.log("ticket insert error = ", err)
        //             }else{
        //                 console.log(result)
        //             }
        //         }
        //     )
        // }
        // for(var i = 0; i < s; i++){
        //     connection.query(
        //         `insert into ticket (concertId, ticketId, date, time, seat, price, discount, discountRate, 
        //             fee, cancleDate, cancleFee, state) values (?,?,?,?,?,?,?,?,?,?,?,?)`,
        //         [concertId, "s"+i, date, time, "s"+i, seat3, 0, 0, 0, 0, 0, 0],
        //         function(err, result){
        //             if(err){
        //                 console.log("ticket insert error = ", err)
        //             }else{
        //                 console.log(result)
        //             }
        //         }
        //     )
        // }
        // for(var i = 0; i < a; i++){
        //     connection.query(
        //         `insert into ticket (concertId, ticketId, date, time, seat, price, discount, discountRate, 
        //             fee, cancleDate, cancleFee, state) values (?,?,?,?,?,?,?,?,?,?,?,?)`,
        //         [concertId, "a"+i, date, time, "a"+i, seat4, 0, 0, 0, 0, 0, 0],
        //         function(err, result){
        //             if(err){
        //                 console.log("ticket insert error = ", err)
        //             }else{
        //                 console.log(result)
        //             }
        //         }
        //     )
        // }
        // for(var i = 0; i < b; i++){
        //     connection.query(
        //         `insert into ticket (concertId, ticketId, date, time, seat, price, discount, discountRate, 
        //             fee, cancleDate, cancleFee, state) values (?,?,?,?,?,?,?,?,?,?,?,?)`,
        //         [concertId, "b"+i, date, time, "b"+i, seat5, 0, 0, 0, 0, 0, 0],
        //         function(err, result){
        //             if(err){
        //                 console.log("ticket insert error = ", err)
        //             }else{
        //                 console.log(result)
        //             }
        //         }
        //     )
        // }


        let options = {                                                                     //request에 들어갈 옵션 값 url, method, json 값 등록
            uri: "http://kairos-link.iptime.org:8080/api/v1/regist_concert",
            method: 'post',
            json: {
                concertId : concertId,
                name:  name,
                place: place,
                date: date 
            },
        };
        console.log(options);
        request.post(options, function(err,httpResponse,body){
            if(err){
            console.log(err)
            res.redirect("/concert")
            }else{
                connection.query(
                  `insert into concert (id, name, place, date, time, showtime, genre, rating, poster_img, info_img, seat1, seat2, seat3, seat4, seat5) 
                  values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                  [concertId, name, place, date, time, showtime, genre, rating, url1, url2, seat1, seat2, seat3, seat4, seat5],
                  function(err, result){
                      if (err){
                          console.log(err);
                      }else{
                        console.log(body);
                        res.redirect("/")
                      }
                  }
                )
            }
        })
    })

    //공연 변경
    router.route("/update").post(function(req, res, next){ 
        var concertId = req.body.concertId;                                     
        var name = req.body.name;
        var place = req.body.place;
        var date = Number(req.body.date);
        var time = req.body.time;
        var showtime = req.body.showtime;
        var genre = req.body.genre;
        var rating = req.body.rating;
        var url1 = req.body.url1;
        var url2 = req.body.url2;
        var seat1 = req.body.seat1;
        var seat2 = req.body.seat2;
        var seat3 = req.body.seat3;
        var seat4 = req.body.seat4;
        var seat5 = req.body.seat5;
        let options = {                                                                     //request에 들어갈 옵션 값 url, method, json 값 등록
            uri: "http://kairos-link.iptime.org:8080/api/v1/update_concert",
            method: 'put',
            json: {
                concertId : concertId,
                name:  name,
                place: place,
                date: date
            },
        };
        console.log(options);
        request.put(options, function(err,httpResponse,body){
            if(err){
            console.log(err)
            res.redirect("/concert")
            }else{
                connection.query(
                  `update concert set name =?, place =?, date=?, time=?, showtime=?, genre=?, rating=?, poster_img=?, info_img=?, seat1=?, seat2=?, seat3=?, seat4=?, seat5=? where id=?`,
                  [name, place, date, time, showtime, genre, rating, url1, url2, seat1, seat2, seat3, seat4, seat5, concertId],
                  function(err, result){
                      if (err){
                          console.log(err);
                      }else{
                        console.log(body);
                        res.redirect("/")
                      }
                  }
                )
            }
        })
    })

 
    
    return router;
}