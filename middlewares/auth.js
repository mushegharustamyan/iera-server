const { sendResBody } = require("../utils/helpers")

exports.verifyAdmin = (req,res,next) => {
    const {token} = req.headers

    if(!token) return sendResBody(res, 401)
    
    next()
}