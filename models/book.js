const express=require('express');
const mongoose=require('mongoose');

const bookSchema = new mongoose.Schema({
     title: String,
     author: String,
     genre: String,
     publication_year: Number,
     copies_available: Number,
     copies_issued: Number,
     book_status: String,
    }   
    
  );

module.exports = mongoose.model("book", bookSchema);