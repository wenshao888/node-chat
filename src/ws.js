/**
 * Created by wenshao on 2017/4/8.
 */
'use strict'
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 3001});
const CryptoUtil = require("./utils/CryptoUtil");
const ioredis = require("ioredis");
const db = require("./conf/db");
const messageDao = require("./db/dao/messageDao");
const MessageBean = require("./bean/MessageBean");
const ResCodeConstant = require("./constant/ResCodeConstant");
const URL=require("url-parse");

let tokenRedis = new ioredis(db.getRedis());


WebSocket.prototype.getUserInfo = function () {
    return this.userInfo;
};

WebSocket.prototype.setUserInfo = function (userInfo) {
    this.userInfo = userInfo;
};


WebSocket.prototype.push = function (eventName, msg) {
    if (typeof eventName == "string" && typeof msg == "object") {
        let sendString = {"eventName": eventName, message: msg};
        let stringify = JSON.stringify(sendString);
        console.log(stringify)
        this.send(stringify);
    } else {
        console.log("格式错误！");
    }

};
// 当前连接的所有id
let socketId = new Map();


// 获取UserInfo
function getRedisUserInfo(ws) {
    let headers = ws.upgradeReq.headers;
    if (headers != null && "token" in headers) {
        tokenRedis.get("token:" + headers.token, (err, result) => {
            try {
                let userInfo = JSON.parse(result).cookie.userinfo;
                if ("user_id" in userInfo) {
                    ws.setUserInfo(userInfo);
                    socketId.set(userInfo.user_id, ws);
                }


            } catch (e) {

            }
        });

    }

}
// 保存当前的连接
function label(ws) {
    let soleId = CryptoUtil.getSoleId();
    socketId.set(soleId, ws);
}


wss.on('connection', function connection(ws) {
    getRedisUserInfo(ws);
    //label(ws);

    ws.on('message', function incoming(message) {
        let jsonMessage;
        try {
            jsonMessage = JSON.parse(message);

        } catch (e) {
            console.log(e);
        }

        if ("eventName" in jsonMessage && typeof jsonMessage.eventName == "string") {
            let userInfo = ws.getUserInfo();
            if (!userInfo || !"user_id" in userInfo) {
                //ws.send();
            } else {
                ws.emit(jsonMessage.eventName, jsonMessage);
            }
        }
    });


    ws.on("postMsg", async(msg) => {
        // 参数检查
        let messageBean = new MessageBean();
        messageBean.setJson(msg);
        messageBean.send_id = ws.getUserInfo().user_id;
        messageBean.create_time = new Date().getTime();



        if (MessageBean.check(messageBean)) {
            let resultMsg = ResCodeConstant.get("PARAMETER_ERROR");
            ws.push("responseMsg", resultMsg);
            return;

        }
        // TODO 权限检查

        let jsonObj = messageBean.getJson();
        // 替换非文字类型的绝对路径
        if (jsonObj.type!="text" && jsonObj.content){
            let url = new URL(jsonObj.content);
            if (url.slashes){
                jsonObj.content=url.pathname;
            }

        }
        messageDao.insert(jsonObj);
        // 推送给指定的用户
        if (socketId.has(messageBean.receive_id)){
            let receive_ws = socketId.get(messageBean.receive_id);
            receive_ws.push("newMsg",messageBean.getJson());
        }
        let resultMsg = ResCodeConstant.get("SUCCESS");
        resultMsg.sendCode = msg.sendCode; // 返回发送码
        ws.push("responseMsg", resultMsg);
    })


});