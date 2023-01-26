const jwt =require("jsonwebtoken");
const User = require("../models/user");


exports.requireSignin = (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(err);
  }
};

exports.isAdmin = async (req, res, next) => {
  console.log(req.user)
  try {
    const user = await User.findById(req.user._id);
    console.log(user)
    if (user.role ==='admin') {
     next();
    } else {
     
      return res.status(401).send("Unauthorized");
    }
  } catch (err) {
    console.log(err);
  }
};