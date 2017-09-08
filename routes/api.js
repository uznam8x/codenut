var express = require('express');
var router = express.Router();
var fr = require('../utils/file-reference.js');
var render = require('../utils/render');
/* POST api listing. */
var response = function( $meta, $data ){
    if( !$meta ) $meta = 200;
    if( !$data ) $data = [];
    return {meta:$meta, data:$data};
};
router.post('/nav/update', function(req, res, next) {
    if( req.body.nav ){
        fr.write( './app/dev/config/nav.json', req.body.nav );
        res.send( response( 200, req.param('nav') ) );
    } else {
        res.send( response( 500 ) );
    }
});
router.post('/page/create', function(req, res, next) {
    try{
        var path = fr.create( req.body.path );
        if( path ) render.compile(path );
        res.send( response( 200, path ) );
    } catch( err ){
        res.send( response( 500 ) );
    }
});
router.post('/page/update', function(req, res, next) {
    if( req.body.src ){
        var path = fr.write( './app/dev'+req.body.src+'/index.json', req.body.structure );
        if( path ) render.compile(path );

        res.send( response( 200, path) );
    } else {
        res.send( response( 500 ) );
    }
});

/* GET api */
router.get('/page/show', function(req, res, next) {
    if(req.query.src){
        var data = fr.read( 'app/dev'+req.query.src+'/index.json' );
        res.send( response( 200, data ) );
    } else {
        res.send( response( 500 ) );
    }
});
module.exports = router;