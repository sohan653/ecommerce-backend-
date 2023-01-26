const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema= new mongoose.Schema(
    {
      name: {
        type: String,
        trim: true,
        required: [true,'name is required'],
        maxlength: 160,

      },
      slug: {
        type: String,
        lowercase: true,
      },
      description: {
        type:{},
        trim: true,
        required: [true,'description is required'],
        maxlength: 2000,
      },
      price: {
        type: Number,
        trim: true,
        required: true,
      },
      category: {
        type: ObjectId,
        ref: "Category",
        trim: true,
      },
      quantity: {
        type: Number,
        trim: true,
        required: true,
        default:0
      },
      sold: {
        type: Number,
        default: 0,
      },
      photoUrl: {
        type: String,
        trim: true,
        required: true,
       
      },
      photoId:{
        type: String,
        trim: true,
        required: true,
      }
      ,
      shipping: {
        required: false,
        type: Boolean,
      },
    },
    { timestamps: true, versionKey: false }
  );
  
  const Product = mongoose.model('Product', productSchema);
  module.exports = Product;
