const {User, Role} = require("../db/sequelize")
const jwt = require("jsonwebtoken")

const { sendResBody , sendResStatus} = require("../utils/helpers")

exports.verifyAdmin = (req,res,next) => {
    const {token} = req.headers
  
    if(!token) return sendResStatus(res,401) 
  
    const decoded = jwt.decode(token)
  
    User.findByPk(decoded.id).then((user) => {
      if(!user) return sendResStatus(res,401)
  
      Role.findByPk(user.roleId).then((role) => {
        if(!role) return sendResStatus(res,403)
  
        if(!role.access_level === 1) return sendResStatus(res,403)
        
        next()
      })
    })
}