var fs = require('fs');
var path =  require('path');
var mkdirp =  require('mkdirp');
var render = require('../utils/render');
var parse = function( $path ){
    var arr = $path.split('/');
    var isFile = arr[ arr.length-1 ].indexOf('.') > -1;
    var filename = '';
    if( isFile ){
        filename = arr[ arr.length-1 ];
        arr.splice( arr.length-1, 1);
    }
    if( !arr[ arr.length-1 ].length ){
        arr.splice( arr.length-1, 1);
    }
    return { directory:arr, file:filename };
};
exports.write = function( $path, $content ){
    try{
        fs.writeFileSync($path, $content, 'utf-8');
        return $path;
    } catch( err ){
        return false;
    }
};
exports.create = function( $path ){
    var source = parse('app/dev/page'+$path+'/index.json');
    var path = source.directory.join('/');
    mkdirp.sync( path, function(err){
        if( err ) throw err;
    } );

    if( source.file.length ){
        path = path+'/'+source.file;
        var welcome = $path.split('/').pop();
        write( path, [{"div":{"text":"'+welcome+' works"}}] );
    }
    return path;
};
exports.read = function( $path ){
    return JSON.parse( fs.readFileSync($path, 'utf-8') );
};