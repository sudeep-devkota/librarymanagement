const express=require('express');
const mongoose=require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String,
         required: true
         },
    author: {
         type: String, 
         required: true
         },
    ISBN: {
         type: String,
          unique: true 
        },
    publicationYear: { 
        type: Number 
    },
    coverImage: {
         type: String }, 
         // Path to uploaded image
    quantity: {
         type: Number, default: 1 }
  });

module.exports = mongoose.model("book", bookSchema);