const { createHmac,randomBytes } = require('node:crypto');
const {Schema,model}=require("mongoose");
const { createTokenForUser } = require('../services/authentication');

const userSchema= new Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
        default:"/images/OIP.jpeg",
    },
    role:{
type:String,
enum:["user","admin"],
default:"user",
    },
},{timestamps:true});

userSchema.pre("save",function(next){
    const user=this;
    if(!user.isModified("password")) return;
    //generating a random unique string for every user 
    const salt=randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
               .update(user.password)
               .digest("hex");

               this.salt=salt;
               this.password=hashedPassword;
               next();
               
});

//mongo db virtual functions ,here we use schema.static
//  then we pass the function name and then the function body

userSchema.static("matchPasswordAndGenerateToken",async function (email,password) {
    const user = await this.findOne({email});
    if (!user) throw new Error("user not found!");

    const salt= user.salt;
    const hashedPassword=user.password;
    const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
    
    if(hashedPassword!==userProvidedHash)throw new Error('incorrect password')

      const token =createTokenForUser(user);
        return token;

});

const User=model("user",userSchema);

module.exports=User;