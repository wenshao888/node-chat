let koa_router = require("koa-router");
const Response = require("./Response");
const ResCodeConstant = require("../constant/ResCodeConstant");
const userDao = require("../db/dao/userDao");
const CryptoUtil=require("../utils/CryptoUtil");



let router = koa_router();
const UserBean = require("../bean/UserBean");


router.post('/register', async(ctx) => {
    let params = ctx.request.body;
    const userBean = new UserBean();
    userBean.setJson(params);

    userBean.head=ctx.default_val.head;
    userBean.user_id=CryptoUtil.getSoleId();
    userBean.type=["common"];
    userBean.register_time=new Date().getTime();

    userBean.getJson();

    // 检查数据是否合法
    let err = UserBean.check(userBean);
    if (err) {
        Response.httpJson(ctx, ResCodeConstant.PARAMETER_ERROR);
        return;
    }
    let resultMsg=null;

    try {
        let result = await userDao.findOne({"uuid":userBean.uuid});
        if (result==null){
            let insert = await userDao.insert(userBean.getJson());
            if (insert.insertedCount==1){
                resultMsg=ResCodeConstant.SUCCESS;
            }else{
                resultMsg=ResCodeConstant.MONGODB_INSERT_ERROR;
            }

        }else{
            resultMsg=ResCodeConstant.USER_EXIST;
        }

    }catch (e){
        console.log(e);
        //Response.httpJson(ctx, ResCodeConstant.MONGODB_INSERT_ERROR);
        resultMsg=ResCodeConstant.MONGODB_INSERT_ERROR;
    }finally {
        Response.httpJson(ctx, resultMsg);

    }

});



//noinspection JSUnresolvedFunction
router.post("/login",async (ctx)=>{
    let resultMsg=null;
    let params = ctx.request.body;
    try {
        let result = await userDao.findOne({"name":params.name,"password":params.password});
        if (result==null){
            resultMsg=ResCodeConstant.USER_LOGIN_FAILED;
        }else{  //登录成功
            ctx.Token.cookie.userinfo={
                user_id:result.user_id,
                name:result.name,
                head:ctx.default_val.imageAddress+result.head,

            };
            resultMsg=JSON.parse(JSON.stringify(ResCodeConstant.SUCCESS));
            resultMsg.user={
                name:result.name,
                head:ctx.default_val.imageAddress+result.head
            };
        }

    }catch (e){
        console.log(e);
        //Response.httpJson(ctx, ResCodeConstant.MONGODB_INSERT_ERROR);
        resultMsg=ResCodeConstant.MONGODB_INSERT_ERROR;
    }finally {
        Response.httpJson(ctx, resultMsg);
    }

});
//noinspection JSUnresolvedFunction
router.post("/userInfo",async (ctx)=>{
    let resultMsg=null;
    let params = ctx.request.body;
    let user_id=ctx.user_id;
    try {
        let result = await userDao.findOne({user_id:user_id},{friends:1});
        if (result==null){
            resultMsg=ResCodeConstant.USER_INFO_ERROR;
        }else{  //登录成功 加载好友列表   加载未读消息
            let friends = result.friends;
            if (friends instanceof Array){
                for (let val of friends){
                    val.friend_info_list=await userDao.findInfoByUserIdList(val.friend_id_list);
                    for (let temp of val.friend_info_list){
                        temp.head=ctx.default_val.imageAddress+temp.head;
                    }
                }
            }else {
                friends=[];
            }
            resultMsg=JSON.parse(JSON.stringify(ResCodeConstant.SUCCESS));
            resultMsg.friends=result.friends;
        }

    }catch (e){
        console.log(e);
        //Response.httpJson(ctx, ResCodeConstant.MONGODB_INSERT_ERROR);
        resultMsg=ResCodeConstant.MONGODB_INSERT_ERROR;
    }finally {
        Response.httpJson(ctx, resultMsg);
    }

});

module.exports = router;
