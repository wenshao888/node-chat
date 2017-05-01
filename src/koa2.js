/**
 * Created by wenshao on 2017/3/11.
 */
const Koa = require('koa');
const app = new Koa();
const cors=require("koa-cors");
const morgan = require("./modules/morgan");
const bodyParser=require("koa-bodyparser");
const token=require("./modules/token");
let redis = require("./conf/db").getRedis();
const router = require('koa-router')();
const convert =require('koa-convert');

const users = require('./routes/users');
const db=require("./conf/db");




app.use(morgan(db.getDefault_val));
app.use(bodyParser());
app.use(token({
        "maxAge":1000*60*60*24,
        "redisStore":redis
    })
);

app.use(cors())

app.use(async (ctx,next)=>{
    if (ctx.ws_cookie!=null && "userinfo" in ctx.ws_cookie && "user_id"  in ctx.ws_cookie.userinfo){
        ctx.user_id=ctx.ws_cookie.userinfo.user_id;
    }

    await next();
});
//noinspection JSUnresolvedFunction
router.use('/users', users.routes(), users.allowedMethods());

//noinspection JSUnresolvedFunction
app.use(router.routes(), router.allowedMethods());


app.listen(3000);