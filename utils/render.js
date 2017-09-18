var fs = require('fs');
var pretty = require('pretty');
var mkdirp =  require('mkdirp');

var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var glob = require("glob");

const renderer = require('vue-server-renderer').createRenderer();
const Vue = require('vue');
const component = require('./component');
var el = '';
function parse( $el ){
    for(var key in $el ){
        el = block(key);
        if( $el[key].attribute ){
            el = el.replace(/{{attribute}}/g, attributes( $el[key].attribute ) );
        }
        if( $el[key].children && $el[key].children.length > 0 ){
            el = el.replace(/{{children}}/g, children( $el[key].children ) );
        }
        if( $el[key].text ){
            el = el.replace(/{{children}}/g, $el[key].text );
        }
    }
    return el;
}

function attributes( $attr ){
    var str = '';
    var prefix = ' ';
    for(var key in $attr){
        str += ' '+key+'="'+$attr[key]+'"';
    }
    return str;
}

function block( name ){
    return '<{{name}}{{attribute}}>{{children}}</{{name}}>'.replace(/{{name}}/g, name);
}
function children( $arr ){
    var str = '';
    $arr.forEach(function(value){
        str += parse(value);
    });
    return str;
}

function clean( html ){
    html = html.replace(/{{attribute}}|{{children}}/g, '')
                .replace(/><\/meta>/g, ' />')
                .replace(/><\/link>/g, ' />')
                .replace(/><\/img>/g, ' />')
                .replace(/><\/br>/g, ' />')
                .replace(/><\/br>/g, ' />')
                .replace(/><\/input>/g, ' />');
    return html;
}

function compile( $path ) {
    if( !$path ) $path = process.argv[2];
    $path = 'app/dev/page'+$path+'/index.xml';
    var dom = new DOMParser().parseFromString( fs.readFileSync('app/dev/config/dom.xml', 'utf-8'),'text/xml' );
    var page = fs.readFileSync($path, 'utf-8');
    var html = dom.documentElement;

    var el = '';
    renderer.renderToString(new Vue({
        template: page
    }), function(err, compile)  {
        if(err) throw err;
        el = compile.replace(/data\-server\-rendered="true"/g, 'class=""');
    } );

    var body = new DOMParser().parseFromString( el,'text/xml' );
    html.appendChild(body);

    var doc = new XMLSerializer().serializeToString(html);
    doc = pretty('<!doctype html>'+doc);

    var path = $path.replace(/dev/g, 'prod').replace(/xml/g,'html');

    var directory = path.split('/').slice(0,-1).join('/');
    mkdirp.sync( directory, function(err){
        if( err ) throw err;
    } );
    return fs.writeFile(path, doc, 'utf8', function(err, data){
        if( err ){
            return false;
        } else {
            return true;
        }
    });
}


function all(){
    glob("app/dev/page/**/*.xml", {}, function (er, files) {
        for(var i = 0, len = files.length; i<len; i++){
            var path = files[i].replace('app/dev/page', '').replace('./', '').replace('/index.xml', '');
            if( !path.length ) path = '/';
            compile( path );
        }

    })
}

//*
module.exports = {
    compile:compile,
    attributes:attributes,
    all:all
};
/*/
module.exports = all();
//*/