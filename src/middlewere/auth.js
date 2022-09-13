const jwt = require('jsonwebtoken');

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-auth-key"];
        if (!token) {
            return res.status(400).send({ status: false, msg: "token must be present" });
        }
        let decodedToken = jwt.verify(token, "narendra123")
         req.userId = decodedToken.userId;
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message });
    }
}



module.exports=authentication