const http = require('http');
var url = require('url');
var psql = require('pg-promise')();
var express = require('express');
var app = express();

const conf = {
  user: 'postgres',
  host: 'localhost',
  database: 'roam_db',
  password: '',
  port: 5432,
};

var db = psql(conf);
var data;
var query = "select * from roam;";

db.any(query).then(function (rows){
  data = rows;
});
app.set('view engine', 'ejs');
app.get('/', function(req,res){
  var sliders;
  var modal;
  if(req.query){
    sliders = [req.query.s0, req.query.s1, req.query.s2, req.query.s3, req.query.s4];
    max = 0;
    for(i = 0; i < Object.keys(data).length; i++){
      var num = (6 - Math.abs(sliders[0]/20 - data[i].touristy))/6;
      num *= (6 - Math.abs(sliders[1]/20 - data[i].luxury))/6;
      num *= (6 - Math.abs(sliders[2]/20 - data[i].expense))/6;
      num *= (6 - Math.abs(sliders[3]/20 - data[i].popage))/6;
      num *= (6 - Math.abs(sliders[4]/20 - data[i].faraway))/6;
      console.log(Math.abs(sliders[0]/20 - data[i].touristy));
      if(max < num){
        max = num;
        modal = data[i].location;
      }
    }
    console.log(modal);
  } else{
    sliders = [50,50,50,50,50];
  }
  res.render('index', {slides: sliders, modal: modal});
});

app.post('/',function(req,res){
});
app.listen(8080,function(req, res){
  console.log("heh");
    
});