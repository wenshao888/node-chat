/**
 * Created by wenshao on 2017/3/11.
 */

const mysql = {
    a:1
};
const mongodb={
    url:"mongodb://localhost/chat",
    options:{}
};
const redis={
    port: 6379,          // Redis port
    host: '127.0.0.1',   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: '',
    db: 0
};


const default_val={
    env:"debug",
    head:"/public/head/default.png",
    imageAddress:"http://123.207.55.204:8081"
};



function getMysql() {
    return mysql;
}
function getMongodb() {
    return mongodb;
}
function getRedis() {
    return redis;
}
function getDefault_val() {
    return default_val;
}

exports.getMysql=getMysql;
exports.getMongodb=getMongodb;
exports.getRedis=getRedis;
exports.getDefault_val=default_val;
