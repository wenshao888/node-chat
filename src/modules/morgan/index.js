/**
 * Created by wenshao on 2017/3/11.
 * 控制台日志输出中间件
 */

'use strict';
/**
 * Module exports.
 * @public
 */
module.exports = morgan;

const ipv4_re=new RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g);


function morgan(default_val) {
    if (default_val==null || default_val==undefined){
        default_val={env:"debug"};
    }
    return async(ctx, next) => {
        ctx.default_val=default_val;
        let start = new Date();
        const ipv4 = getIpv4(ctx.request.ip);
        ctx.ipv4 = ipv4;
        await next();
        let ms = new Date() - start;
        console.log(`[${start.format("yyyy-MM-dd hh:mm:ss:S")}] ${ipv4} ${ctx.method} ${ctx.status} ${ctx.url} ${ms}ms`);
    };
}

function getIpv4(ip) {
    let result = ip.match(ipv4_re);
    return (result && result.length > 0) ? result[0] : ip;

}


Date.prototype.format = function format(format) {
    let o = {

        "M+": this.getMonth() + 1, //month

        "d+": this.getDate(), //day

        "h+": this.getHours(), //hour

        "m+": this.getMinutes(), //minute

        "s+": this.getSeconds(), //second

        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter

        "S": this.getMilliseconds() //millisecond

    };


    if (/(y+)/.test(format)) {

        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

    }


    for (let k in o) {

        if (new RegExp("(" + k + ")").test(format)) {

            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));

        }

    }

    return format;

};
