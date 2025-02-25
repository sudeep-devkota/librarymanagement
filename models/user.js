const express=require('express');
const mongoose=require('mongoose');
const book = require('./book');



const userSchema = new mongoose.Schema({
    name: 
    { 
        type: String,
         required: true 
        },
    email:
     { 
        type: String,
         required: true,
          unique: true
         },

    password: 
    { type: String,
         required: true
         },
    role: {
         type: String,
         enum: ['user', 'admin'],
         default: 'user'
        },
     
        borrowbook:[{
            
           book_id:{ type: mongoose.Schema.Types.ObjectId,
            ref: 'book'},
         borrow_date: { type: Date, default: Date.now },
            returnStatus: { type: Boolean, default: false },
       due_date: { type: Date, default: null },
            fine:{type: Number, default: 0},
           

           
           
        }]

        
  },
  
  {
    timestamps: true,
  } 
  
);
  
  module.exports = mongoose.model("user", userSchema);
  





 
