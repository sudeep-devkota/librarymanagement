const express=require('express');
const mongoose=require('mongoose');
const book=require('../models/book');
const user=require('../models/user');



exports.createbook=async(req,res)=>{
    
const{title,
author,
genre,
publication_year,
copies_available,
copies_issued,
book_status}=req.body;

try{
   if(!title || !author || !genre || !publication_year || !copies_available || !copies_issued || !book_status){
       return res.status(400).json({message:"All fields are required"});
    
   }
   const existingBook=await book.findOne({title});
   if(existingBook){
       return res.status(400).json({message:"Book already exists"});
   }
    const books=new book({
        title,
        author,
      
        genre,
        publication_year,
        copies_available,
        copies_issued,
        book_status
     
    });
   
    await books.save();
    res.status(201).json({message:"book created successfully"}).json(book);

}
catch(error){
    res.status(400).json({message:error.message});
}
}

exports.getallbooks=async(req,res)=>{

    try{

        const books=await book.find({});
        res.status(200).json(books);
    }
    
    catch(error){
        res.status(400).json({message:error.message});


         }
}
