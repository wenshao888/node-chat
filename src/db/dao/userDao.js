/**
 * Created by wenshao on 2017/3/12.
 * 用户相关操作
 */

const mongodbClient = require('mongodb').MongoClient;
const ResponseCode = require("../../constant/ResCodeConstant");
const db = require("../../conf/db");
const mongodb = db.getMongodb();
let currDb = null;
const t_users_col = "t_users_col";

mongodbClient.connect(mongodb.url, function (err, _db) {
    if (err) {
        throw err;
    }
    console.log("Connected successfully to server");
    currDb = _db;
});


/**
 * 按条件查找一个值
 */
function findOne(_user_json, select) {
    if (select == null) {
        select = {name: 1, head: 1, user_id: 1};
    }
    return new Promise((resolve, reject) => {
        let col = currDb.collection(t_users_col);
        col.findOne(_user_json, select, function (err, result) {
            if (err) reject(err);
            else (resolve(result));
        })
    });

}


/**
 * 添加用户
 */
function insert(_user_json) {
    return new Promise((resolve, reject) => {
        let col = currDb.collection(t_users_col);
        col.insertOne(_user_json, function (err, result) {
            if (err) reject(err);
            else resolve(result);
        })
    });
}


function findInfoByUserIdList(idList) {
    return new Promise((resolve, reject) => {
        if (idList instanceof Array) {
            let col = currDb.collection(t_users_col);
            console.log(idList);
            col.find({"user_id": {$in: idList}}, {"user_id": 1, "name": 1, "head": 1}).toArray(function (err, result) {
                if (err) reject(err);
                else resolve(result);


            });

        } else {
            resolve("idList error");
        }

    });

}

exports.insert = insert;
exports.findOne = findOne;
exports.findInfoByUserIdList = findInfoByUserIdList;




