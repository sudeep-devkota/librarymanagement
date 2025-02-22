const express   = require('express');
const user       = require('../controllers/user');
const book=require('../controllers/book');
const borrow=require('../controllers/borrow');

const router= express.Router();





 


router.post("/createuser",user.createuser);




router.post("/login",user.login);
router.get("/getuser", user.verifyAdmin,
    user.getusers);
router.get("/getuser/:id",user.verifyAdmin, user.individualuser);
router.put("/updateuser/:id", user.verifyAdmin,user.updateuser);
router.delete("/deleteuser/:id", user.verifyAdmin,user.deleteuser);






module.exports=router;


