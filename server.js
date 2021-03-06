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
var mysqlPort = process.env.MYSQL_PORT || 8888;
var mysqlUser = process.env.MYSQL_USER || 'root';
var mysqlPass = process.env.MYSQL_PASSWORD || 'Mp_3232b';
var mysqlDb   = process.env.MYSQL_DATABASE || 'finance';

/*
var mysqlString = 'mysql://'   + mysqlUser + ':' + mysqlPass + '@' + mysqlHost + ':' + mysqlPort + '/' + mysqlDb;

//connect to mysql
var mysqlClient = mysql.createConnection(mysqlString);
mysqlClient.connect(function(err){
  if (err) console.log(err);
});
*/

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : mysqlHost,
  port            : mysqlPort,
  user            : mysqlUser,
  password        : mysqlPass,
  database        : mysqlDb
});

// app is running!
app.get('/', function(req, res) {
  res.send('OK');
});

app.get('/mysql', function(req, res) {

  pool.getConnection(function(err, connection) {
    pool.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
      if (err) {
        res.send('NOT OK' + JSON.stringify(err));
      } else {
        res.send('OK: ' + rows[0].solution);
      }
    });
  });
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

/*
initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});
*/

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
