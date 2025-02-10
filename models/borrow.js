const express = require("express");
const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({
    bookId: {
    type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date
    }

}
,
{
    timestamps: true,
});

module.exports = mongoose.model("borrow", borrowSchema);
