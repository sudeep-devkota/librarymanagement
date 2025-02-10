const express=require('express');

const bcrypt=require('bcrypt');
const Jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();
const user=require('../models/user');
const book=require('../models/book');
const borrow=require('../models/borrow');

exports.createuser=async(req,res,next)=>{
    const {name,email,password}=req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser=await user.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt,);
        const newUser=new user({name,email,password:hashedPassword,role:"user"});
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch(error){
        next(error);    
    }

}

exports.createadmin=async(req,res,next)=>{
    const name="admin";
    const email="admin@gmail.com";
    const password="admin123";
    try{
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }    
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new user({name,email,password:hashedPassword,role:"admin"});
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch(error){
        next(error);    
    }
      
}
verifyAdmin=(req, res, next)=>{
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

