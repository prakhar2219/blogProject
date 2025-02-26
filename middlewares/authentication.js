const { validateTokens } = require("../services/authentication");

function checkForAuthenticationCookies(cookieName){
    return (req,res,next) =>{
        const tokenCookieValue=req.cookies[cookieName];
        if(!tokenCookieValue){
            next();
        }
        try {
            const userPayload = validateTokens(tokenCookieValue);
            req.user= userPayload;
        } catch (error) { }
        next();
    };
}
module.exports={
    checkForAuthenticationCookies,
}