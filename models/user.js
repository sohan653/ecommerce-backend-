const mongoose =require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    }
    ,
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 100
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum:['admin' ,'user'],
      default:'user',
    },
  },
  { timestamps: true,versionKey:false }
);

const User = mongoose.model("User", userSchema);
module.exports = User;