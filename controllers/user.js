const express=require('express');

const bcrypt=require('bcrypt');
const Jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();
const User=require('../models/user');
const book=require('../models/book');



exports.createuser=async(req,res,next)=>{
    const {name,email,password}=req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt,);
        const newUser=new User({name,email,password:hashedPassword,role:"user"});
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch(error){
        next(error);    
    }

}






const adminname=process.env.ADMIN_NAME;
const adminemail=process.env.ADMIN_EMAIL;
const adminpassword=process.env.ADMIN_PASSWORD;
const adminrole=process.env.ADMIN_ROLE;



exports.login = async (req, res) => {

    const {name, email, password} = req.body;

    try {
        // Check if all fields are provided
        if (email===adminemail && password && adminpassword && name===adminname) {
            const token = Jwt.sign(
                {
                    id: adminemail,
                    name: adminname,
                    email: adminemail,
                    role: adminrole
                }, 
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            )
            return res.status(200).json({
            token,
            message: `${adminrole} logged in successfully`,
            redirectUrl:'/auth/admin',
            role:adminrole});

 }

        // Find user by email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Create token with user info
        const token = Jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
             // Token expires in 24 hours
        );

        // Send token in response
       
        // Send success response
       return res.status(200).json({
            token,
            message: `${user.role} logged in successfully`,
          
            redirectUrl : user.role === 'user' ? '/auth/student' : '/auth/admin',
            role: user.role
})
       
    
       
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: "Server error. Please try again later."
        });
    }
};
exports.veriffyUser=(req, res, next)=>{
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')){
        return res.status(401).json({error:"token not found"});
    }
    // token parse the user
    const token=req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({error:"token not found"});
    }
    try{
    const decoded=Jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded;
    // check if user is admin or not
    if(req.user.role==="user"){
        next();
    }

    else{
        res.status(403).json({error:"User access denied"});
    }
    }
    catch(error){
        console.error("JWT Verification Error:", error);
        res.status(401).json({ error: "Invalid or expired token" });
    }
}
exports.verifyAdmin=(req, res, next)=>{
    // token parse the user
    const token=req.headers.authorization.split(" ")[1];
    const decoded=Jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded;
    // check if user is admin or not
    if(req.user.role==="admin"){
        next();
    }

    else{
        res.status(403).json({error:"Admin access denied"});
    }
}

exports.getusers=async(req,res)=>{
    try{
        const users=await User.find({});
        res.status(200).json(users);
    }
    catch(error){
        res.status(400).json({error:error.message});
    }

}
exports.individualuser=async(req,res)=>{
    const user=await User.findById(req.params.id);
    res.status(200).json(user);
}



exports.updateuser=async(req,res)=>{
    try{
        const users=await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(users);
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

exports.deleteuser=async(req,res)=>{
    try{
        const users=await User.findByIdAndDelete(req.params.id);
        res.status(200).json(users);
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
