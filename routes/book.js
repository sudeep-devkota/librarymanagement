const express=require('express');
const router=express.Router();
const book=require('../controllers/book');
const borrow=require('../controllers/borrow');
const user=require('../controllers/user');




                                             
router.post("/createbook",
    
    
    book.createbook);
router.get("/getallbooks",book.getallbooks);

router.post("/borrowbook",
    user.veriffyUser,
    borrow.borrowbook);












module.exports=router