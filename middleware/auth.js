const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = Auth = () => {
    return (req, res, next) => {
        let tok = req.headers['authorization'];
        const token = tok.split(" ");
        if (!token[1])
            return res.send({ status: false, message: 'Authentication Error!', statCode: 401 });
        try {
            var verifyToken = jwt.verify(token[1], process.env.SecretKey);
            let obj = verifyToken 
            req.users = obj;
            next();
        } catch (error) {
            res.send({ status: false, message: 'Invalid Token', statCode: 401 });
        }
    }
}