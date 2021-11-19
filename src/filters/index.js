import Vue from "vue";
import moment from "moment";
moment.locale('zh-cn');
Vue.filter('getFromNow', function (value) {
    return moment(value, "YYYY-MM-DD hh-mm-ss").fromNow();
})