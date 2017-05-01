let koa_router = require("koa-router");
const Response = require("./Response");
const ResCodeConstant = require("../constant/ResCodeConstant");
const userDao = require("../db/dao/userDao");
const messageDao = require("../db/dao/messageDao");
const CryptoUtil = require("../utils/CryptoUtil");


let router = koa_router();
const UserBean = require("../bean/UserBean");


router.post('/register', async(ctx) => {
    let params = ctx.request.body;
    const userBean = new UserBean();
    userBean.setJson(params);

    userBean.head = ctx.default_val.head;
    userBean.user_id = CryptoUtil.getSoleId();
    userBean.type = ["common"];
    userBean.register_time = new Date().getTime();

    userBean.getJson();

    // 检查数据是否合法
    let err = UserBean.check(userBean);
    if (err) {
        Response.httpJson(ctx, ResCodeConstant.get("PARAMETER_ERROR"));
        return;
    }
    let resultMsg = null;

    try {
        let result = await userDao.findOne({"uuid": userBean.uuid});
        if (result == null) {
            let insert = await userDao.insert(userBean.getJson());
            if (insert.insertedCount == 1) {
                resultMsg = ResCodeConstant.get("SUCCESS");
            } else {
                resultMsg = ResCodeConstant.get("MONGODB_INSERT_ERROR");
            }

        } else {
            resultMsg = ResCodeConstant.get("USER_EXIST");
        }

    } catch (e) {
        console.log(e);
        resultMsg = ResCodeConstant.get("MONGODB_INSERT_ERROR");
    } finally {
        Response.httpJson(ctx, resultMsg);

    }

});


//noinspection JSUnresolvedFunction
router.post("/login", async(ctx) => {
    let resultMsg = null;
    let params = ctx.request.body;
    try {
        let result = await userDao.findOne({"name": params.name, "password": params.password});
        if (result == null) {
            resultMsg = ResCodeConstant.get("USER_LOGIN_FAILED");
        } else {  //登录成功
            ctx.Token.cookie.userinfo = {
                user_id: result.user_id,
                name: result.name,
                head: ctx.default_val.imageAddress + result.head,

            };
            resultMsg = ResCodeConstant.get("SUCCESS");
            resultMsg.user = {
                user_id: result.user_id,
                name: result.name,
                head: ctx.default_val.imageAddress + result.head
            };
        }

    } catch (e) {
        console.log(e);
        resultMsg = ResCodeConstant.get("MONGODB_INSERT_ERROR");
    } finally {
        Response.httpJson(ctx, resultMsg);
    }

});
//noinspection JSUnresolvedFunction
router.post("/userInfo", async(ctx) => {
    let resultMsg = null;
    let params = ctx.request.body;
    let user_id = ctx.user_id;
    try {
        let result = await userDao.findOne({user_id: user_id}, {friends: 1});
        if (result == null) {
            resultMsg = ResCodeConstant.get("USER_INFO_ERROR");
        } else {  //登录成功 加载好友列表   加载未读消息
            let friends = result.friends;
            if (friends instanceof Array) {
                for (let val of friends) {
                    val.friend_info_list = await userDao.findInfoByUserIdList(val.friend_id_list);
                    for (let temp of val.friend_info_list) {
                        temp.head = ctx.default_val.imageAddress + temp.head;
                    }
                }
            } else {
                friends = [];
            }
            resultMsg = ResCodeConstant.get("SUCCESS");
            resultMsg.friends = result.friends;
        }

    } catch (e) {
        console.log(e);
        resultMsg = ResCodeConstant.get("MONGODB_INSERT_ERROR");
    } finally {
        Response.httpJson(ctx, resultMsg);
    }

});
router.post("/message/friend", async(ctx) => {
    let params = ctx.request.body;
    let resultMsg = null;
    try {
        let result = await messageDao.find(
            {
                select: {
                    "$or": [
                        {"send_id": ctx.user_id, "receive_id": params.receive_id},
                        {"send_id": params.receive_id, "receive_id": ctx.user_id}
                    ]
                },
                sort: {"create_time": 1}
            }
        );

        for (let val of result) {
            if ("type" in val && val.type != "text") {
                val.content = ctx.default_val.imageAddress + val.content;
            }
        }
        // 查询聊天室所有人的信息 id name head
        let userInfoList = await userDao.findInfoByUserIdList([ctx.user_id, params.receive_id]);
        for (let temp of userInfoList) {
            temp.head = ctx.default_val.imageAddress + temp.head;
        }
        resultMsg = ResCodeConstant.get("SUCCESS");
        resultMsg.messageList = result;
        resultMsg.userInfoList = userInfoList;
    } catch (e) {
        console.log(e);
        resultMsg = ResCodeConstant.get("MONGODB_QUERY_ERROR");
    } finally {
        Response.httpJson(ctx, resultMsg);
    }


});
router.all("/test", async(ctx) => {
    var data = {
        code:0,
        data: [
            {"id":"1","username":"demo",
                "name":"\u59d3\u540d","phone":"13882500000"},
            {"id":"2","username":"user","name":"\u540d\u5b57",
                "phone":"0731-8888888"}
        ]

    }
    ctx.body = data;
});
router.all("/save", async(ctx) => {
    console.log(ctx.request.body);
    ctx.body = {code:0,data:{"id":66}};
});

module.exports = router;
