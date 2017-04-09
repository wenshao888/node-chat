/**
 * Created by wenshao on 2017/3/12.
 * user对象
 */
const BaseBean=require("./BaseBean");

class UserBean extends BaseBean{

    static restraint(){
        return {
            uuid:{type:"string",maxLength:50,required:true},
            name:{type:"string",maxLength:20},
            head:{type:"string",maxLength:100,required:true},
            password:{type:"string",maxLength:50,required:true},
            user_id:{type:"string",maxLength:50,required:true},
            type:{type:"array",required:true},
            register_ip:{type:"string",maxLength:20},
            register_time:{type:"number",maxLength:20,required:true},
            register_source:{type:"string",maxLength:20,required:true},
            friends:{type:"array"},
            group_list:{type:"array"}
        }
    }
    static check(Bean){
        return super._check(Bean,this.restraint());
    }

    constructor(){
        super();
        this._uuid=null;
        this._name=null;
        this._head=null;
        this._password=null;
        this._user_id=null;
        this._type=null;
        this._register_ip=null;
        this._register_time=null;
        this._register_source=null;
        this._friends=null;
        this._group_list=null;
    }


    get uuid() {
        return this._uuid;
    }

    set uuid(value) {
        this._uuid = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get head() {
        return this._head;
    }

    set head(value) {
        this._head = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    get user_id() {
        return this._user_id;
    }

    set user_id(value) {
        this._user_id = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get register_ip() {
        return this._register_ip;
    }

    set register_ip(value) {
        this._register_ip = value;
    }

    get register_time() {
        return this._register_time;
    }

    set register_time(value) {
        this._register_time = value;
    }

    get register_source() {
        return this._register_source;
    }

    set register_source(value) {
        this._register_source = value;
    }

    get friends() {
        return this._friends;
    }

    set friends(value) {
        this._friends = value;
    }

    get group_list() {
        return this._group_list;
    }

    set group_list(value) {
        this._group_list = value;
    }
    hasOwnProperty(key){

    }



}
module.exports=UserBean;