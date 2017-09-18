var fs = require('fs');
var path =  require('path');
var mkdirp =  require('mkdirp');
var render = require('../utils/render');
var rimraf = require('rimraf');
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

var write = function( $path, $content ){
    try{
        fs.writeFileSync($path, $content, 'utf-8');
        return $path;
    } catch( err ){
        return false;
    }
};

var uuid = function(){
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

var create = function( $path ){
    var source = parse('app/dev/page'+$path+'/index.xml');
    var path = source.directory.join('/');

    mkdirp.sync( path, function(err){
        if( err ) throw err;
    } );

    if( source.file.length ){
        path = path+'/'+source.file;
        var welcome = $path.split('/').pop();

        var resolve = path.replace('app/dev/page', '').replace('/index.xml', '').replace('\.\/', '');
        try{
            fs.writeFileSync( path, '<body><div data-codenut-path="/div" data-codenut-uuid="'+uuid()+'">' + welcome + ' works</div></body>', 'utf-8');
            return true
        } catch( err ){
            return false;
        }
    }

    return false;
};

var move  = function( $old, $new ){
    try {
        fs.renameSync( $old, $new );
        console.log('move : '+$old+' => '+$new );
        return true;
    } catch( err ){
        return false;
    }
};

var remove = function( $path ){
    try {
        rimraf( $path, function(){
            console.log('delete : '+$path );
        } );
        return true;
    } catch( err ){
        return false;
    }
};

var test = '[{"index":{"attribute":{},"status":{"path":"/"},"children":[{"home":{"attribute":{},"status":{"path":"/home"},"children":[{"news":{"attribute":{},"status":{"path":"/news","move-path":"/home/news"},"children":[]}}]}},{"compnay":{"attribute":{},"status":{"path":"/compnay"},"children":[]}}]}}]';
var analysis = function( $obj ){
    function deep( $model ){
        for(var i = 0; i<$model.length; i++){
            for(var key in $model[i]){
                if( $model[i][key].status['move-path'] && $model[i][key].status['path'] !== $model[i][key].status['move-path'] ){
                    move( 'app/dev/page'+$model[i][key].status['path'], 'app/dev/page'+$model[i][key].status['move-path'] );
                    move( 'app/prod/page'+$model[i][key].status['path'], 'app/prod/page'+$model[i][key].status['move-path'] );

                    $model[i][key].status['path'] = $model[i][key].status['move-path'];
                }

                delete $model[i][key].status['move-path'];
                if( $model[i][key].children && $model[i][key].children.length ){
                    deep( $model[i][key].children );
                }
            }
        }

        return JSON.stringify($model);
    }
    return deep( $obj );
};
var read = function( $path ){
    return JSON.parse( fs.readFileSync($path, 'utf-8') );
};

//*
module.exports = {
    write:write,
    read:read,
    analysis:analysis,
    move:move,
    create:create
};
/*/
module.exports = analysis( JSON.parse(test) );
//*/
