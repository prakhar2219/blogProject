const express = require('express');
const path = require('path');
const userRoute=require('./routes/user.js');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { log } = require('console');
const { checkForAuthenticationCookies } = require('./middlewares/authentication.js');

const app=express();
PORT=8000;

mongoose.connect('mongodb://localhost:27017/blogify')
 .then(e=>console.log("Mongo db connected"));

app.set("view engine","ejs")
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({ extended:false}));
app.use(cookieParser);
app.use(checkForAuthenticationCookies("token"))

app.get('/',(req,res)=>{
    return res.render("home",{
        user:req.user,
    });
});
app.use('/user',userRoute);

app.listen(PORT,()=>console.log(`Server started ${PORT}`));
