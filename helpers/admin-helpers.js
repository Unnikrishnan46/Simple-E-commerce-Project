var db = require('../config/connection')
var collection=require('../config/collections')
const { Db } = require('mongodb')
const { ADMIN_COLLECTION } = require('../config/collections')

module.exports={

    doAdminLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let adminLoginStatus=false
            let response={}
            let admin= await db.get().collection(collection.ADMIN_COLLECTION).findOne({username:adminData.username, password:adminData.password})
            if(admin){
                console.log("login success");
                        response.admin=admin
                        response.status=true
                        resolve(response)
            }
            else{
                console.log('login failed');
                resolve({status:false})

            }
        })
    }

}