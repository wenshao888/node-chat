/**
 * Created by wenshao on 2017/3/13.
 * 加密相关
 */
const crypto=require("crypto");



function getSoleId() {
    const secret = 'token';
    return crypto.createHmac('md5', secret)
        .update(new Date().getTime()+" "+Math.ceil(Math.random()*100))
        .digest('hex');
}

exports.getSoleId=getSoleId;
