/**
 * Created by wenshao on 2017/3/11.
 * 统一响应出口
 */
const ResCodeConstant = require("../constant/ResCodeConstant");

function httpJson(ctx, data) {
    try {
        if (data.code == ResCodeConstant.get("SUCCESS").code) {
            ctx.body=data;
        } else {
            ctx.body=data;
        }
    } catch (e) {  //不是标准的返会格式
        console.log(JSON.stringify(e) + "不是标准的返回格式");
        throw e;
    }

}

function httpHtml(req, res, html, data) {
    // TODO

}
exports.httpJson = httpJson;







