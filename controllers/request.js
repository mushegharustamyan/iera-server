const {Request, Event} = require("../db/sequelize")
const { sendResBody, sendResStatus } = require("../utils/helpers")

exports.index = ( req,res) => {
    Request.findAll()
        .then(result => sendResBody(res,200,result))
        .catch(_ => sendResStatus(res,500))
}

exports.show  = (req,res) => {
    const {postId} = req.body
    Event.findByPk(postId)
        .then(result => sendResBody(res,200,result))
        .catch(result => sendResStatus(res,500))
}