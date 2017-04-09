/**
 * Created by wenshao on 2017/3/11.
 */
const db = require("../conf/db");
const mongodb = db.getMongodb();

const mongooseConnect = require('mongoose');
mongooseConnect.Promise = Promise;
/**
 * 连接
 */
mongooseConnect.connect(mongodb.url, mongodb.options);


/**
 * 连接成功
 */
mongooseConnect.connection.on('connected', function () {
    console.log('Mongoose connection open to' );
});

/**
 * 连接异常
 */
mongooseConnect.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongooseConnect.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});
module.exports = mongooseConnect;