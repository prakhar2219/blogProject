const JWT = require('jsonwebtoken');
const { create } = require('../models/user');
const secret="prakhar@2219"
function createTokenForUser(user) {
    const payload={
        _id:user.id,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role,

    };
    const token =JWT.sign(payload,secret);
    return token;
}
function validateTokens(token){
    const payload=JWT.verify(token,secret);
    return payload;
}
module.exports={
createTokenForUser,
validateTokens,
};