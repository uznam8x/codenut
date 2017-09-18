var db = {
    explode: function( $path ){
        return $path.split('/').splice(1);
    },
    query: function( $obj, $key, $uuid ){
        var data = $obj;
        var parse = db.explode( $key );
        for(var i = 0; i<parse.length; i++){
            data = db.search( data, parse[i], i >= parse.length-1, $uuid );
        }
        return data;
    },
    search: function( $obj, $key, $last, $uuid ){
        var data = [];
        for(var i = 0, len = $obj.length; i<len; i++){
            if( $obj[i][ $key ] ){
                if( $uuid ){
                    if( $obj[i][ $key ]['property']['uuid'] === $uuid ){
                        data = $obj[i][$key];
                    }
                } else {
                    if( $last ){
                        data = data.concat( $obj[i] );
                    } else {
                        data = data.concat( $obj[i][$key].children );
                    }
                }
            }
        }

        return data;
    }
};
module.exports = db;