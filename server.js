//  OpenShift sample Node application
var express = require('express');
var app     = express();
var morgan  = require('morgan');

var mysql = require('mysql');

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


//mysql configuration
var mysqlHost = process.env.MYSQL_HOST || 'localhost';
var mysqlPort = 3306;
var mysqlUser = process.env.MYSQL_USER || 'root';
var mysqlPass = process.env.MYSQL_PASSWORD;
var mysqlDb   = process.env.MYSQL_DATABASE;

var mysqlString = 'mysql://'   + mysqlUser + ':' + mysqlPass + '@' + mysqlHost + ':' + mysqlPort + '/' + mysqlDb;

//connect to mysql
var mysqlClient = mysql.createConnection(mysqlString);
mysqlClient.connect(function(err){
  if (err) console.log(err);
});

// app is running!
app.get('/', function(req, res) {
  res.send('OK');
});

//MySQL is running!
app.get('/mysql', function(req, res) {
  mysqlClient.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) {
      res.send('NOT OK' + JSON.stringify(err));
    } else {
      res.send('OK: ' + rows[0].solution);
    }
  });
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
