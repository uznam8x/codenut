var express = require('express');
var router = express.Router();
var fr = require('../utils/file-reference.js');
var db = require('../utils/json-db');
var fs = require('fs');
var render = require('../utils/render');
var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;

/* POST api listing. */
var response = function( $meta, $data ){
    if( !$meta ) $meta = 200;
    if( !$data ) $data = [];

    var format = '<response><code>{{value}}</code><data>{{data}}</data></response>';
    format = format.replace(/{{value}}/g, $meta)
        .replace(/{{data}}/g, $data);
    return format;
};

router.get('/nav/show', function(req, res, next) {
    res.set('Content-Type', 'text/xml');
    fs.readFile( 'app/dev/config/nav.xml', 'utf-8', function( err, data ){
        try {
            if (err) {
                res.send(response(500, err));
            } else {
                res.send(response(200, data));
            }
        } catch( err ){
            res.send(response(500, err));
        }
    } );
});

router.post('/nav/update', function(req, res, next) {
    res.set('Content-Type', 'text/xml');
    if( req.body.nav ){
        try{
            fs.writeFile('./app/dev/config/nav.xml', req.body.nav, 'utf-8', function(err, data){
                if( err ){
                    res.send( response( 500, err ) );
                } else{
                    res.send( response( 200, data ) );
                }
            })
        } catch( err ){
            res.send( response( 500, err ) );
        }
    } else {
        res.send( response( 500 ) );
    }
});

router.post('/page/create', function(req, res, next) {
    res.set('Content-Type', 'text/xml');

    if( req.body.path ){

        try{
            var result = fr.create( req.body.path );
            render.compile( req.body.path );
            if( result ){
                res.send( response( 200, req.body.path ) );
            } else {
                res.send( response( 500 ) );
            }
        } catch( err ){
            res.send( response( 500, err ) );
        }
    } else {
        res.send( response( 500 ) );
    }

});
router.post('/page/update', function(req, res, next) {

    if( req.body.src ){
        try{
            fs.writeFile('./app/dev/page'+req.body.src+'/index.xml', req.body.structure, 'utf-8', function(err, data){
                if( err ){
                    res.send( response( 500, err ) );
                } else{
                    render.compile( req.body.src );
                    res.send( response( 200, data ) );
                }
            })
        } catch( err ){
            res.send( response( 500, err ) );
        }
    } else {
        res.send( response( 500 ) );
    }
});

/* GET api */
router.get('/page/show', function(req, res, next) {
    if(req.query.src){
        fs.readFile( 'app/dev/page'+req.query.src+'/index.xml', 'utf-8', function( err, data ){
            try {
                if (err) {
                    res.send(response(500, err));
                } else {
                    res.send(response(200, data));
                }
            } catch( err ){
                res.send(response(500, err));
            }
        } );

    } else {
        res.send( response( 500 ) );
    }
});



router.get('/dom/show', function(req, res, next) {
    fs.readFile( 'app/dev/config/dom.xml', 'utf-8', function( err, data ){
        try {
            if (err) {
                res.send(response(500, err));
            } else {
                res.send(response(200, data));
            }
        } catch( err ){
            res.send(response(500, err));
        }
    } );
});

router.post('/dom/update', function(req, res, next) {
    if( req.body.content ){
        try{
            fs.writeFile('app/dev/config/dom.xml',req.body.content, 'utf-8', function(err, data){
                if( err ) {
                    res.send(response(500, err));
                } else {
                    render.all();
                    res.send( response( 200, data ) );
                }
            } )
        } catch (err){
            res.send(response(500, err));
        }

    } else {
        res.send(response(500));
    }
});
module.exports = router;