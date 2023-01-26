const express = require('express');
const { register, login, updateProfile, getOrders, allOrders } = require('../controllers/user');
const { requireSignin, isAdmin } = require('../middlewar/auth');

const router=express.Router();

router.post('/register',register)
router.post('/login',login);
router.get('/auth-check',requireSignin,(req,res)=>{
    res.json({ok:true})
})
router.get('/check-admin',requireSignin,isAdmin,(req,res)=>{
    res.json({ok:true})
})

router.put('/update-profile',requireSignin,updateProfile)

// orders
router.get("/orders", requireSignin, getOrders);
router.get("/all-orders", requireSignin, isAdmin, allOrders);



module.exports =router;