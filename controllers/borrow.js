const express=require('express');
const mongoose=require('mongoose');
const borrow=require('../models/book');
const user=require('../models/user');

exports.borrowbook=async(req,res)=>{
    const {user_id,book_id}=req.body;
    try{
        if(!user_id || !book_id){
            return res.status(400).json({message:"user_id and book_id are required"});
        }
        const user=await user.findById(user_id);
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        const book=await book.findById(book_id);
        if(!book){
            return res.status(400).json({message:"book not found"});



        }
        

//set due date
        const due_date=new Date(new Date().setDate(new Date().getDate()+7));
        const borrow_date=new Date();

       if(book.copies_available>0){
        book.copies_available=book.copies_available-1;
        book.copies_issued=book.copies_issued+1;
   
        user.book.push({book_id:book_id,
            borrow_date:borrow_date,
            due_date:borrow_date

        });
        

        await user.save();
        await book.save();
        return res.status(200).json({message:"book borrowed successfully",
        user:user_id,
        book:book_id,
        borrow_date:borrow_date,
        due_date:due_date
        });
       }
       else{
        return res.status(400).json({message:"book not available"});
       }
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
}

