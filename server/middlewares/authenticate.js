const jwt = require("jsonwebtoken")

const error = (status, message) => {
    const err = new Error();
    err.status = status;
    err.message = message;
    return err;
};

async function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return next(error(401, "You are not authenticated!"));
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next(createError(401, "You are not authenticated!"));
    const decode = jwt.verify(token, process.env.JWT);
    req.user = decode;
    return next();
}


module.exports = { verifyToken };