process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var express = require('express');
var request = require('request');

//session 관리
var redis = require('redis');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

var app = express();

var client = redis.createClient();

app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.engine('html',require('ejs').renderFile);

app.use(express.static('public'));
app.use(session({
  store: new redisStore({
    client : client,
    prefix : "session:",
    host : "localhost",
    port : 6379,
    db : 0
  }),
  secret : 'nike',
  saveUninitialized: true,
  resave: true
}));

app.get('/',function(req,res){
  res.render('index.ejs');
});

app.get('/kakaologin',function(req,res){
  var code = req.query.code;

  getToken(code,function(){
    res.render('main.ejs',{'code':code});
  });

});


function getToken(code,callback){
  console.log('실행');
  var json = '{"grant_type":"authorization_code","client_id":"5cb4b52a3aed06734662d776fdd9dc0d","redirect_uri":"http://localhost:3000/kakaologin","code":'+code+'}';
  var url = "https://cors-anywhere-esko.herokuapp.com/https://kauth.kakao.com/oauth/token";
  request({
    method: 'POST',
    url : url,
    json: true,
  },function(error,response,data){

    console.log(error);
    console.log(response.statusCode);
    console.log(data);
  });
}


app.listen(3000,function(){
  console.log('server is connected....!');
});
























//
