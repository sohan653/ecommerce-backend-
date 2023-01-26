const express = require('express');
const app=express()
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config()
const {readdirSync} =require('fs')
const fileUpload=require('express-fileupload')



// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());
app.use(fileUpload({
    useTempFiles : true,
    
}));



// check response 
app.get('/', function(req, res){
    res.json({
        message: "Hello World!"
    })
})

// routes middleware
readdirSync("./routes").map(r => app.use("/api/v1", require(`./routes/${r}`)));

// server port

const port= process.env.PORT || 4000;

// connect to db and start server

mongoose.connect(process.env.DATABASE)
.then(()=>{
    app.listen(port,()=>{
        console.log("Server listening on port " + port)
    })
})
.catch(err => console.error(err));