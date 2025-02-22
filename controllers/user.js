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

exports.loginadmin=async(req, res, next)=>{
    const{
        name,
        email,
        password,
       
    }=req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
       const findUser=await User.findOne({email,role:"admin"});
       if(!findUser){
        return res.status(400).json({message:"user not found"});
       }
       const isPasswordValid=await bcrypt.compare(password,findUser.password);
       if(!isPasswordValid){
        return res.status(400).json({message:"invalid password"});
       }
       const role=admin;
       const token=Jwt.sign({id:findUser._id,
        name:findUser.name,
        email:findUser.email,
        role:"admin"},process.env.JWT_SECRET);
        
      
       res.status(200).json({token,role:"admin",message:"admin logged in successfully"});
       console.log(role);
      
       
    }
    catch(error){
        next(error);


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
exports.login = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        // Check if all fields are provided
        if (!email || !password || !name) {
            return res.status(400).json({
                message: "All fields are required"
            });
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
            { expiresIn: '24h' }  // Token expires in 24 hours
        );

        // Send success response
        res.status(200).json({
            token,
            role: user.role,
            message: `${user.role} logged in successfully`
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: "Server error. Please try again later."
        });
    }
};
exports.veriffyUser=(req, res, next)=>{
    // token parse the user
    const token=req.headers.authorization.split(" ")[1];
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

exports.getusers=async(req,res)=>{
    try{
        const users=await user.find({});
        res.status(200).json(users);
    }
    catch(error){
        res.status(400).json({error:error.message});
    }

}
exports.individualuser=async(req,res)=>{
    const user=await user.findById(req.params.id);
    res.status(200).json(user);
}



exports.updateuser=async(req,res)=>{
    try{
        const users=await user.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(users);
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

exports.deleteuser=async(req,res)=>{
    try{
        const users=await user.findByIdAndDelete(req.params.id);
        res.status(200).json(users);
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}
