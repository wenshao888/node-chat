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
 * @returns {Promise}
 */
function find(_json) {
    let result = checkParams(_json);
    if (result.code==1){
        throw new Error(result.msg);
    }
    let json = result._json;
    return new Promise((resolve, reject) => {
        let col = currDb.collection(t_message_col);
        col.find(json.select, json.show).sort(json.sort).toArray((err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });

}

function checkParams(_json) {
    if (!_json){
        return {code: 1, msg: "_json错误"};
    }
    if (!("select" in _json) || typeof _json.select != "object") {
        return {code: 1, msg: "select错误"};
    }
    if (!("show" in _json)) {
        _json.show = {}
    }
    if (!("sort" in _json)) {
        _json.sort = {}
    }
    return {code: 0, _json:_json };
}

exports.insert = insert;
exports.find = find;
