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
app.get('/',function(req,res){
  res.render('index');
  console.log(data);
});

app.post('/',function(req,res){

});

app.listen(8080, function(){
  console.log("heh");
});