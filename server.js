var express = require('express');
var request = require('request');

var app = express();


app.set('views',__dirname+'/views');
app.set('view engine','ejs');

app.engine('html',require('ejs').renderFile);

app.use(express.static('public'));

app.get('/',function(req,res){
  res.render('index.ejs');
});

app.get('/kakaologin',function(req,res){
  var code = req.query.code;
  // var url = "https://kauth.kakao.com/oauth/token";
  // var body = {"grant_type":"authorization_code","client_id":"5cb4b52a3aed06734662d776fdd9dc0d","redirect_uri":"https://localhost:3000/kakaologin","code":code};
  // request({
  //   url : url,
  //   method : "POST",
  //   body : body,
  //   json : true,
  //   function(error,response,body){
  //     // if(error){
  //     //   console.log(error);
  //     // }else if(response.statusCode=="200"){
  //     //   console.log('헤헤');
  //     //   console.log(body);
  //     // }else{
  //     //   console.log(response.statusCode);
  //     // }
  //     console.log('왓더!');
  //   }
  // });
  res.render('login.ejs',{'code':code});
});

app.listen(3000,function(){
  console.log('server is connected....!');
});
