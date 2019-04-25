const http = require('http');
var url = require('url');
var psql = require('pg-promise')();
var express = require('express');
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added

app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const dbConfig = process.env.DATABASE_URL;
var db = psql(dbConfig);
var data;
var query = "select * from roam;";
var user;
var firebase = require('firebase');
require('firebase/auth');
require('firebase/database');
// Initialize Firebase for the application
db.any(query).then(function (rows) {
  data = rows;
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
  res.render('pages/login', {
    my_title: "Roam. login"
  });
});

app.get('/login', function (req, res) {
  res.render('pages/login', {
    my_title: "Login Page"
  });
});
var config = {
  apiKey: "AIzaSyBmO7JGyWsFJ01gQnAKrJdWSVtbAASD1qk",
  authDomain: "roam-57db5.firebaseapp.com",
  databaseURL: "https://roam-57db5.firebaseio.com",
  projectId: "roam-57db5",
  storageBucket: "roam-57db5.appspot.com",
  messagingSenderId: "646835090112"
};
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function (u) {
  if (u) {
    user = u;
  }
});
app.get('/home/', function (req, res) {
  var sliders;
  var modal;
  user = firebase.auth().currentUser;
  if (Object.keys(req.query).length) {
    sliders = [req.query.s0, req.query.s1, req.query.s2, req.query.s3, req.query.s4];
    min = Number.MAX_SAFE_INTEGER;
    for (i = 0; i < Object.keys(data).length; i++) {
      var num = (s = Math.abs(sliders[0] / 20 - data[i].touristy)) * s;
      num += (s = Math.abs(sliders[1] / 20 - data[i].luxury)) * s;
      num += (s = Math.abs(sliders[2] / 20 - data[i].expense)) * s;
      num += (s = Math.abs(sliders[3] / 20 - data[i].popage)) * s;
      num += (s = Math.abs(sliders[4] / 20 - data[i].faraway)) * s;
      if (min > num) {
        min = num;
        modal = data[i].location;
      }
    }
    if (user) {
      var histquery = 
      "insert into histories(email, loc, touristy, luxury, expense, popage, faraway) values("
        + user.email + "," +
        modal + "," + sliders[0] + "," 
        + sliders[1] + "," + sliders[2] + "," + 
        sliders[3] + "," + sliders[4] + ");";
        db.query(histquery);
    }
    //console.log(modal);
  } else {
    sliders = ["50", "50", "50", "50", "50"];
  }
  if(user){
    var histquery = "select * from histories where email = " + user.email + ";";
    var hist;
    db.any(histquery).then(function (rows) {
      hist = rows;
    });
    res.render('pages/home', { slides: sliders, modal: modal, my_title: "Roam. home", hist: hist });
  } else{
    res.render('pages/home', { slides: sliders, modal: modal, my_title: "Roam. home", hist:null });

  }
});

app.get('/learn', function (req, res) {
  db.any('select id, country from countries;')
    .then(function (rows) {
      res.render('pages/learn', {
        my_title: "Learn",
        data: rows,
        details: ''
      })
    })
});

app.get('/learn/post', function (req, res) {
  var cntrs = 'select ID, Country from countries;';
  var cntr = 'select * from countries where ID = ' + req.query.country_choice + ';';
  db.task('get-info', task => {
    return task.batch([
      task.any(cntrs),
      task.any(cntr)
    ]);
  })
    .then(info => {
      res.render('pages/learn', {
        my_title: "Learn",
        data: info[0],
        details: info[1][0]
      })
    })
});

app.post('/pages/home/', function (req, res) {
});
app.listen(process.env.PORT, function (req, res) {
  console.log('Listening on port %d', process.env.PORT);
});