/**
 * Created by wenshao on 2017/4/9.
 * 消息对象
 */


const BaseBean=require("./BaseBean");

class MessageBean extends BaseBean{
    static restraint(){
        return {
            send_id:{type:"string",maxLength:50,required:true},
            receive_id:{type:"string",maxLength:50,required:true},
            type:{type:"string",maxLength:20,required:true},
            create_time:{type:"number",maxLength:20,required:true},
            content:{type:"string",maxLength:500,required:true},
            duration:{type:"number"},
            sendCode:{type:"string",maxLength:50,required:true},
        }
    }
    static check(Bean){
        return super._check(Bean,this.restraint());
    }



    constructor() {
        super();
        this._send_id=null;
        this._receive_id=null;
        this._type=null;
        this._create_time=null;
        this._content=null;
        this._duration=null;
        this._sendCode=null;

    }

    get send_id() {
        return this._send_id;
    }

    set send_id(value) {
        this._send_id = value;
    }

    get receive_id() {
        return this._receive_id;
    }

    set receive_id(value) {
        this._receive_id = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get create_time() {
        return this._create_time;
    }

    set create_time(value) {
        this._create_time = value;
    }

    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
    }

    get duration() {
        return this._duration;
    }

    set duration(value) {
        this._duration = value;
    }

    get sendCode() {
        return this._sendCode;
    }

    set sendCode(value) {
        this._sendCode = value;
    }
}
module.exports=MessageBean;