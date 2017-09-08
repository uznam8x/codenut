var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  var nav = fs.readFileSync('app/dev/config/nav.json', 'utf8');
  res.render('index', { title: 'Codenut', nav:JSON.stringify( JSON.parse(nav) ) });
});


module.exports = router;
