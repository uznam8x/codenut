
var fs = require('fs');
var render = require('./render.js');
var db = require('./json-db.js');

var helper = function( app ){
    app.locals.dom = {
        getSource: function(  ){
            return JSON.parse( fs.readFileSync('app/dev/config/dom.json', 'utf-8'));
        },
        getLanguage: function(){
            var data = app.locals.dom.getSource();
            var html = db.search( data, '/html' );
            return html.attribute.lang;
        },
        getTitle: function( ){
            var data = app.locals.dom.getSource();
            var head = db.search( data, '/html/head' );
            var title = '';
            for ( var i = 0, len = head.length; i<len; i++ ){
                if(head[i].title) title = head[i].title.text;
            }
            return title;
        },
        getMeta: function(){
            var data = app.locals.dom.getSource();
            var head = data.html.children[0].head.children;
            var source = [];
            for ( var i = 0, len = head.length; i<len; i++ ){
                if(head[i].meta) source.push( head[i].meta.attribute );
            }
            return source;
        },
        getLink: function(){
            var data = app.locals.dom.getSource();
            var head = data.html.children[0].head.children;
            var source = [];
            for ( var i = 0, len = head.length; i<len; i++ ){
                if(head[i].link) source.push( head[i].link.attribute );
            }

            return source;
        },
        getScript: function(){
            var data = app.locals.dom.getSource();
            var head = data.html.children[0].head.children;
            var source = [];
            for ( var i = 0, len = head.length; i<len; i++ ){
                if(head[i].script) source.push( head[i].script.attribute );
            }
            return source;
        },

    };
};

module.exports = helper;