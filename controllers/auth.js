const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const {User} = require('../db/sequelize')
const { sendResStatus, getEnv } = require('../utils/helpers')

exports.signin = (req,res) => {
    const { login , password} = req.body
    User.findOne({
        where: {
            login
         }
    }) 
        .then(async user => {
            const decoded = await bcrypt.compare(password , user.password)
            if(!user || !decoded){
                return sendResStatus(res,409 , "Invalid Login or Password")
            }
            const token = jwt.sign({id : user.id}, getEnv("JWT_SECRET"), {
                expiresIn: 80000
            })

            return res.send({token})
        })
        .catch(_ => sendResStatus(res, 500))
}