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
  if(req.query){
    var sliders = [req.query.s0, req.query.s1, req.query.s2, req.query.s3, req.query.s4];
    res.render('index', {slides: sliders});
    console.log(req.query);
  } else{
    res.render('index');
  }
});

app.post('/',function(req,res){
});
app.listen(8080,function(req, res){
  console.log("heh");
    
});