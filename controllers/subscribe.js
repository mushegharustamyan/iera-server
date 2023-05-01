const {Subscribe} = require("../db/sequelize")
const { sendResStatus, sendResBody } = require("../utils/helpers")

exports.create = (req, res) => {
    const {email} = req.body

    Subscribe.create(email)
        .then(_ => sendResStatus(res,201))
        .catch(_ => sendResStatus(res,500))
}

exports.index = (req, res) => { 
    Subscribe.findAll()
        .then(result =>  sendResBody(res,200,result))
        .catch(_ => sendResStatus(res, 500))   
}