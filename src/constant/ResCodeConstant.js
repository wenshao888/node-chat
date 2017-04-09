/**
 * Created by wenshao on 2017/3/11.
 * 0 suc
 * 1-200前端参数等错误错误  与前端有关系的错误
 * 201-300 后端node错误
 * 301-400 mysql错误
 * 401-500 redis错误
 * 501-550 nginx错误
 * 601-700 mongodb错误
 */
const code = {
    "SUCCESS":{
        code:0,
        error_msg_ch:"响应成功"
    },
    "PARAMETER_ERROR":{
        code:1,
        error_msg_ch:"参数错误"
    },
    "USER_INFO_ERROR":{
        code:2,
        err_msg_ch:"用户未登录"
    },
    "USER_EXIST":{
        code:3,
        err_msg_ch:"用户已经注册"
    },
    "USER_LOGIN_FAILED":{
        code:4,
        err_msg_ch:"用户名或密码错误"
    },
    "MYSQL_CONNECT_ERROR":{
        code:301,
        err_msg_ch:"sql连接错误错误"
    },
    "MONGODB_CONNECT_ERROR":{
        code:601,
        err_msg_ch:"连接失败"
    },
    "MONGODB_INSERT_ERROR":{
        code:602,
        err_msg_ch:"插入记录失败"

    },
    "MONGODB_QUERY_ERROR":{
        code:603,
        err_msg_ch:"查询记录失败"

    }




};
module.exports = code;