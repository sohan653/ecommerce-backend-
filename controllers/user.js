const { hashPassword, comparePassword } = require("../helper/user");
const User = require("../models/user");
const jwt=require('jsonwebtoken')


// register

exports.register=async(req,res)=>{
    try {
            //object distructure
        const {name,email,password}=req.body;
           // 2. all fields require validation
        if (!name.trim()) {
            return res.json({ error: "Name is required" });
          }
          if (!email) {
            return res.json({ error: "Email is taken" });
          }
          if (!password || password.length < 6) {
            return res.json({ error: "Password must be at least 6 characters long" });
          }
          // 3. check if user exists
          const existingUser=await User.findOne({email:email});
          if (existingUser) {
            return res.json({ error: "User already exists" });
          }
          // 4. hash password
          const hashedPassword=await hashPassword(password)
        //   5. save user
        const newUser=await User.create({
            name:name,
            email:email,
            password:hashedPassword
        })
        // 6.create jwt token for user
        const token=await jwt.sign({ _id:newUser._id, },process.env.JWT_SECRET, { expiresIn: "7d" });
        // 7.send response
        return res.json({
          user: {
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            address: newUser.address,
          },
          token,
        });
         
    } catch (error) {
       console.log(error);
        
    }
}

// login

exports.login=async(req,res)=>{
    try {
        // 1. object distructure
        const {email,password}=req.body;
           // 2. all fields require validation
        if (!email.trim()) {
            return res.json({ error: "Email is required" });
          }
          if (!password || password.length < 6) {
            return res.json({ error: "Password must be at least 6 characters long" });
          }
          // 3. check if user exists
          const user=await User.findOne({email:email});
          // 4.match password
          const isMacth=await comparePassword(password,user.password)
          if (!user) {
            return res.json({ error: "email or password not match" });
          }else{
            if(!isMacth){
                return res.json({ error: "email or password not match" });
            }else{
                const token=await jwt.sign({ _id:user._id,},process.env.JWT_SECRET,{expiresIn:"7d"})

                    return res.json({
                      user: {
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        address: user.address,
                      },
                      token,
                    });

            }
          }
          
    } catch (error) {
        console.log(error);
    }
        
    }


 exports.secret=async(req,res)=>{
  res.json({currentUser:req.user})
 }   



 exports.updateProfile = async (req, res) => {
  try {
    const { name, password, address } = req.body;
    const user = await User.findById(req.user._id);
    console.log(user)
    // check password length
    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and should be min 6 characters long",
      });
    }
    // hash the password
    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        address: address || user.address,
      },
      { new: true }
    );

    updated.password = undefined;
    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (err) {
    console.log(err);
  }
};

exports.allOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (err) {
    console.log(err);
  }
};
