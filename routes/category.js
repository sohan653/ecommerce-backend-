const express = require('express');
const { createCategory, updateCategory, deleteCategory, listCategory, readCatogory } = require('../controllers/category');
const { requireSignin, isAdmin } = require('../middlewar/auth');
const router=express.Router();


router.post('/create-category',requireSignin,isAdmin,createCategory);
router.put('/update-category/:_id', requireSignin,isAdmin,updateCategory);
router.delete('/delete-category/:_id', requireSignin,isAdmin,deleteCategory);
router.get('/category',listCategory)
router.get('/category/:slug',readCatogory)












module.exports=router;