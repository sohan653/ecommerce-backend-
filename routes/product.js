const express=require('express');
const { createProduct, listProducts, readProduct, deleteProduct, updatePhoto, updateProduct } = require('../controllers/products');
const { requireSignin, isAdmin } = require('../middlewar/auth');
const router=express.Router();

router.post('/create-product',requireSignin,isAdmin,createProduct)
router.get('/list-products',listProducts);
router.get('/read-product/:slug',requireSignin,isAdmin,readProduct)
router.delete('/delete-product/:id',requireSignin,isAdmin,deleteProduct)
router.put('/update-photo/:photoId',requireSignin,isAdmin,updatePhoto)
router.put('/update-product/:id',requireSignin,isAdmin,updateProduct);


module.exports = router;