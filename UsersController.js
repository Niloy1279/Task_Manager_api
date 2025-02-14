import UsersModel from "../model/UsersModel.js";
import {TokenEncode} from "../utility/tokenUtility.js";
import SendEmail from "../utility/emailUtility.js";

export const Registration=async(req,res)=>{

    try{
        let reqBody=req.body;
        await UsersModel.create(reqBody);
        return res.json({status:"Success"})
    }
    catch(err){

        return res.json({status:"Fail","message":err.toString()})
    }


}

export const Login=async(req,res)=>{

    try{
        let reqBody=req.body;
        let data= await UsersModel.findOne(reqBody);

        if(data==null){
            return res.json({status:"Fail. User not found"})
        }
        else{
            console.log(data)
            let token=await TokenEncode(data['email'],data['_id'])
            return res.json({status:"Login Successful",data:{token:token}})
        }
    }
    catch(err){
        return res.json({status:"Login Fail","Message":err.toString()})
    }
}

export const ProfileDetails=async(req,res)=>{
    try{
        let user_id=req.headers['user_id']
        let data =await UsersModel.findOne({"_id": user_id})
        return res.json({status:"Success",message:"User profile successfuly",data:data})
    }
    catch(e){
        return res.json({status:"fail","Message":e.toString()})
    }
}

export const ProfileUpdate=async(req,res)=>{

    try{
        let reqBody=req.body;
        let user_id=req.headers['user_id']
        await UsersModel.updateOne({'_id':user_id},reqBody)
        return res.json({status:"Success",Message:"User Update Successfully"})
    }
    catch(err){

        return res.json({status:"Fail","message":err.toString()})
    }
    return res.json({status:"Success"})

}

export const EmailVerify=async(req,res)=> {
    try {
        let email = req.params.email;
        let otpCode = Math.floor(10000 + Math.random() * 9000000)
        const userCount = await UsersModel.aggregate([{$match: {email: email}}, {$count: "total"}])
        if (userCount.length > 0) {
            await UsersModel.updateOne({email: email, otp: otpCode})
            await SendEmail({email}, "Your Verification Code is " + otpCode, "Inventory PIN")
            return res.json({status: "success", message: "Email Verified"})
        } else {
            return {status: "fail", message: "Email Not Found"};
        }
    } catch (e) {
        return {status: "fail", data: e.toString()}
    }
}


    /* try {
         let email = req.params.email;
         let data = await UsersModel.findOne({email: email})
         if (data == null) {
             return res.json({status: "fail", "Message": "User doesnot exists"})
         } else {

             ///send OTP To Email
             let code = Math.floor(100000 + Math.random() * 900000)
             let EmailTo = data['email'];
             let EmailText = "Your Code is " + code;
             let EmailSubject = "Task Manager Verification Code"

             await SendEmail(EmailTo, EmailText, EmailSubject)

             //Update OTP in USER
             await UsersModel.updateOne({email: email}, {otp: code})
             return res.json({status: "Success", Message: "Verification Successful"})
         }
     } catch (e) {
         return res.json({status: "Fail", "message": e.toString()})
     }*/

export const CodeVerify = async (req, res) => {

    try{
        let reqBody= req.body;
        let data=await UsersModel.findOne({email:reqBody['email'],otp:reqBody['otp']})
        if (data==null){
            return res.json({status:"fail", message:"Wrong Verification Code"})
        }
        else{
            return res.json({status:"Success",message:"Code Verified"})
        }
    }
    catch (e){
        return res.json({status:"fail", message: e.toString()})
    }



}
export const ResetPassword = async (req, res) => {

    try{
        let reqBody= req.body;
        let data=await UsersModel.findOne({email:reqBody['email'],otp:reqBody['otp']})
        if (data==null){
            return res.json({status:"fail", message:"Wrong Verification Code"})
        }
        else{
            await UsersModel.findOne({email:reqBody['email']},{
                otp:"o",
                password:reqBody['password'],

            })
            return res.json({status:"Success",Message:"Password Reset Successfully"})
        }
    }
    catch (e){
        return res.json({status:"fail", message: e.toString()})
    }

}




