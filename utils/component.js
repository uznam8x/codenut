var fs = require('fs');
const Vue = require('vue');
Vue.component('row',{
    template:'<div class="row"><slot></slot></div>'
});

Vue.component('carousel',{
    template:'<div class="carousel"><slot></slot></div>'
});

Vue.component('nut',{
    props:['uid'],
    methods:{
        load:function(){
            return fs.readFileSync('app/dev/partial/uuid.html', 'utf-8');
        }
    },
    template:'<div class="nut" ><div class="nut__content" v-html="load()"></div><slot></slot></div>'
});

exports = this;