var express = require('express');
var router = express.Router();
var fs = require('fs');
var fsx = require('fs-extra');
var path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  fs.exists('app/dev/config/dom.xml', function (exists) {
    if( !exists ) {
      try {
        fsx.copySync(path.resolve(__dirname, '../template/app'), './app');
      } catch (err) {
        res.send(err);
        return false;
      }
    }

    res.render('index', { title: 'Codenut' }, function(err, html){
      res.send(html);
    });
  });
});
module.exports = router;