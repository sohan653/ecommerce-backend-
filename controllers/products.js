const { default: slugify } = require('slugify');
const Product = require('../models/product');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


exports.createProduct=async(req,res)=>{
   
    try {
        const file =req?.files?.photo;
      if(!file){
        return res.status(400).json({
                  message: "Please upload a photo"
                })
              }
      
     const hostedPhoto= await cloudinary.uploader.upload(file.tempFilePath);


     const product=await Product.create({...req.body,slug:slugify(req.body.name),photoUrl:hostedPhoto.url,photoId:hostedPhoto.public_id})
       
     res.json(product);
    } catch (error) {
        res.json(error.message);
    }  
  }

  exports.listProducts=async(req,res)=>{
    try {
        const products=await Product.find({}).populate('category').limit(12).sort({createdAt:-1})
        res.json(products);
    } catch (error) {
        res.json(error.message);
    }
  }


  exports.readProduct=async(req,res)=>{
    try {
        const product=await Product.findOne({slug:req.params.slug}).populate('category').exec();
        res.json(product);
    } catch (error) {
        res.json(error.message);
    }
  }


  exports.updatePhoto=async(req,res)=>{
    const photo=req.files.photo;
    try {
      // delete previous photo
      cloudinary.uploader.destroy(req.params.photoId,async(err,result)=>{
        if (err){
          return res.status(400).json({ message: 'Failed to delete previous image.' });
        }
        // update new photo
        await cloudinary.uploader.upload(photo.tempFilePath,(err,result)=>{
          if (err) {
            return res.status(400).json({ message: 'Failed to upload new image.' });
          }
          if (result){
            // filter & update
             Product.findOneAndUpdate(
              {photoId:req.params.photoId},
              {photoUrl:result.url,photoId:result.public_id},
              {returnDocument:'after'}
              ,
              (err,product)=>{
                  if(!err)   { return res.json({ message: 'Image updated successfully.',product })}
             })
            ;
          }
         
        })
      })
    } catch (error) {
      
    }
  }



  exports.updateProduct=async(req,res)=>{
    try {

      const updateProduct= await Product.findByIdAndUpdate(req.params.id,{...req.body,slug:slugify(req.body.name)},{new:true})
      res.json(updateProduct)
    } catch (error) {
      
    }
  }



  exports.deleteProduct=async(req,res)=>{
    const id=req.params.id;
    console.log(id)
   try {
    const product=await Product.findById(id);
   if(!product){
    res.json({message: "Product not found"})
   }
  await cloudinary.uploader.destroy(product.photoId);
  const deleteProduct=await Product.findByIdAndDelete(id)
  res.json(deleteProduct)
   
    
   } catch (error) {
    
   }
  }