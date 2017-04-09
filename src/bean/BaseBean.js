/**
 * Created by wenshao on 2017/3/12.
 * 约束检查对象
 */
class BaseBean{

    static _check(Bean,restraint){
        let err=null;
        for (let _key in restraint){
            if (!_key in restraint && typeof restraint[_key] !="object"){
                err={error:"restraint error"};
                return;
            }
            let schema_val =restraint[_key];


            if (schema_val.required && ! _key in Bean ){//判断是否为必填
                err={error:`${_key}为必填项`};
                break;
            }
            let input_val=Bean[_key];





            if (schema_val.type!=null && schema_val.type!="" && input_val!=null && input_val!=""
                && typeof input_val !=schema_val.type){
                if (schema_val.type=="array" && input_val instanceof Array){

                }else{
                    err={error:`${_key}类型必须为${schema_val.type}`};
                    break;
                }


            }

            if (schema_val.type=="string") {  //根据不同的类型判断不同的属性
                err = this.check_length(schema_val, input_val, _key);
                if (err) break;
            }else if (schema_val.type=="array"){
                err = this.check_length(schema_val,input_val,_key);
                if (err) break;
            }else if (schema_val.type=="number") {
                err = this.check_length(schema_val, input_val, _key);
                if (err) break;
            }else{
                err = {error:"类型输入错误"};
                break;
            }
        }
        return err;
    }
    static check_length(schema_val,input_val,_key){
        let err=null;
        if ("maxLength" in schema_val && typeof schema_val.maxLength =="number" && schema_val.maxLength<input_val[_key]){
            err ={error:`${_key}长度不符合`};
        }
        return err;
    }
    constructor(){

    }
    setJson (obj){
        if (typeof obj =="object"){
            for (let _key in obj){
                this[_key]=obj[_key];
            }
        }

    }
    getJson(){
        let data={};
        let key;
        for (let _key in this){
            key=_key.substr(1);
            if (this[key]!=null){
                data[key]=this[key];

            }
        }
        return data;
    }


}
module.exports=BaseBean;