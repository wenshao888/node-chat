/**
 * Created by wenshao on 2017/4/9.
 * 消息集合相关操作
 */
const mongodbClient = require('mongodb').MongoClient;
const ResponseCode = require("../../constant/ResCodeConstant");
const db = require("../../conf/db");
const mongodb = db.getMongodb();
let currDb = null;
const t_message_col = "t_message_col";

mongodbClient.connect(mongodb.url, function (err, _db) {
    if (err) {
        throw err;
    }
    console.log("Connected successfully to server");
    currDb = _db;
});


/**
 * 插入消息
 */
function insert(_message_json) {
    return new Promise((resolve, reject) => {
        let col = currDb.collection(t_message_col);
        col.insertOne(_message_json, function (err, result) {
            if (err) reject(err);
            else resolve(result);
        })
    });
}


/**
 * 根据条件查询数据
 * @param _json
 * @param select
 * @returns {Promise}
 */
function find(_json,select) {
    if (!select){
        select={};
    }
    console.log(_json,select);

    return new Promise((resolve, reject) => {
        let col = currDb.collection(t_message_col);
        col.find(_json,select).toArray( (err, result)=> {
            if (err) reject(err);
            else resolve(result);
        })
    });

}

exports.insert = insert;
exports.find = find;
