const {Subscribe} = require("../db/sequelize")
const { sendResStatus, sendResBody } = require("../utils/helpers")

exports.create = (req, res) => {
    const email = req.body.email
    console.log(email)

    Subscribe.create({email})
        .then(_ => sendResStatus(res,201))
        .catch(e => console.log(e))
}

exports.index = (req, res) => { 
    Subscribe.findAll()
        .then(result =>  sendResBody(res,200,result))
        .catch(e => console.log(e))   
}