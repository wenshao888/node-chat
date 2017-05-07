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

/**
 * 按用户id列表查找用户信息列表
 * @param idList
 * @returns {Promise}
 */
function findInfoByUserIdList(idList) {
    return new Promise((resolve, reject) => {
        if (idList instanceof Array) {
            let col = currDb.collection(t_users_col);
            col.find({"user_id": {$in: idList}}, {"user_id": 1, "name": 1, "head": 1}).toArray(function (err, result) {
                if (err) reject(err);
                else resolve(result);


            });

        } else {
            reject("idList error");
        }

    });

}

// 获取好友列表
function getUserFriends(params) {

    return findOne({user_id: params.user_id}, {friends: 1}).then(async function (result) {
        let friends = result.friends;
        for (let obj of friends) {
            obj.friend_info_list = await findInfoByUserIdList(obj.friend_id_list);
            for (let temp of obj.friend_info_list) {
                temp.head = params.imageAddress + temp.head;
                temp.groupId=obj.id;
            }
        }
        console.log(friends);
        return friends;


    });
}


function checkParams(_json) {
    if (!_json) {
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
    return {code: 0, _json: _json};
}
exports.insert = insert;
exports.findOne = findOne;
exports.findInfoByUserIdList = findInfoByUserIdList;
exports.getUserFriends = getUserFriends;





