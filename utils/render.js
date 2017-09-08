var fs = require('fs');
var pretty = require('pretty');
var mkdirp =  require('mkdirp');

const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer();

Vue.component('row',{
    template:'<div class="row"><slot></slot></div>'
});
Vue.component('carousel',{
    template:'<div class="carousel"><slot></slot></div>'
});

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

function render( $path ) {
    if( !$path ) $path = process.argv[2];

    var dom = fs.readFileSync('app/dev/config/dom.json', 'utf8');
    var page = fs.readFileSync($path, 'utf8');
    dom = JSON.parse( dom.replace(/\[\"@content\"\]/g, page) );

    var html = '';

    renderer.renderToString(new Vue({
        template: clean( parse( dom ) )
    }), function(err, compile)  {
        if(err) throw err;
        html = compile.replace(/data\-server\-rendered="true"/g, 'class=""');
    } );

    html = pretty('<!doctype html>'+html)
        .replace(/<meta[^>](.*?)>/g, '<meta $1 />')
        .replace(/<input[^>](.*?)>/g, '<input $1 />');

    var path = $path.replace(/dev/g, 'prod').replace(/json/g,'html');
    var directory = path.split('/').slice(0,-1).join('/');
    mkdirp.sync( directory, function(err){
        if( err ) throw err;
    } );

    fs.writeFileSync(path, html, 'utf8');
    return path;
}
exports.compile = render;