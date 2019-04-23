const http = require('http');
var url = require('url');
var psql = require('pg-promise')();
var express = require('express');
var app = express();

const conf = {
  user: 'xnkgmeyyqssnlq',
  host: 'ec2-184-73-210-189.compute-1.amazonaws.com',
  database: 'd8579a8ksq8je1',
  password: '11996758fb18b10fbce4cf8b6b918830ed04101fc2a654d89abf950a27d76f23',
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
  if(Object.keys(req.query).length){
    sliders = [req.query.s0, req.query.s1, req.query.s2, req.query.s3, req.query.s4];
    min = Number.MAX_SAFE_INTEGER;
    for(i = 0; i < Object.keys(data).length; i++){
      var num = Math.abs(sliders[0]/20 - data[i].touristy);
      num *= Math.abs(sliders[1]/20 - data[i].luxury);
      num *= Math.abs(sliders[2]/20 - data[i].expense);
      num *= Math.abs(sliders[3]/20 - data[i].popage);
      num *= Math.abs(sliders[4]/20 - data[i].faraway);
      if(min > num){
        min = num;
        modal = data[i].location;
      }
    }
    //console.log(modal);
  } else{
    sliders = ["50","50","50","50","50"];
  }
  res.render('index', {slides: sliders, modal: modal});
});

app.post('/',function(req,res){
});
app.listen(process.env.port,function(req, res){
  console.log("heh");
    
});