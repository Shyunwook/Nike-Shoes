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
  if(req.session.token){
    getUserInfo(req.session.token,function(info){
      info = JSON.parse(info);
      req.session.user_info= info.properties;
      req.session.user_id = info.id;

      res.redirect('/main');
    });
  }else{
    getToken(code,function(token){
      req.session.token = token;
      getUserInfo(req.session.token,function(info){
        info = JSON.parse(info);
        req.session.user = info.properties;
        req.session.user_id = info.id;
        res.redirect('/main');
      });
    });
  }
});

app.get('/main',function(req,res){
  if(req.session.user){
    res.render('main.ejs',{'info':req.session.user});
  }else{
    res.redirect('/');
  }
})

app.get('/logout',function(req,res){
  var headers = {"Authorization":"Bearer "+req.session.token};
  request({
    url: "https://kapi.kakao.com/v1/user/logout",
    method: 'POST',
    headers: headers
  },function(error,response,data){
    if(error){
      console.log(error);
    }else if(response.statusCode==200){
      req.session.destroy();
      res.redirect('/');
    }
  })
})

app.get('/resignation',function(req,res){
  var headers = {"Authorization":"Bearer "+req.session.token};
  request({
    url: "https://kapi.kakao.com/v1/user/unlink",
    method: 'POST',
    headers: headers
  },function(error,response,data){
    if(error){
      console.log(error);
    }else if(response.statusCode==200){
      req.session.destroy();
      res.redirect('/');
    }
  })
})

function getToken(code,callback){
  var data = "?grant_type=authorization_code&client_id=5cb4b52a3aed06734662d776fdd9dc0d&redirect_uri=http://localhost:3000/kakaologin&code="+code;
  var url = "https://kauth.kakao.com/oauth/token";
  request({
    method: 'POST',
    url : url+data,
    body : "{}",
    json: true,
  },function(error,response,data){
    if(error){
      console.log(error);
    }else if(response.statusCode==200){
      callback(data.access_token);
    }
  });
}

function getUserInfo(token,callback){
  var headers = {"Authorization":"Bearer "+token};
  request({
    url: "https://kapi.kakao.com/v1/user/me",
    method: 'GET',
    headers: headers
  },function(error,response,data){
    if(error){
      console.log(error);
    }else if(response.statusCode==200){
      callback(data);
    }
  })

}


app.listen(3000,function(){
  console.log('server is connected....!');
});
























//
