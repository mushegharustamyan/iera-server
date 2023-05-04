const {Request, Event, Post} = require("../db/sequelize")
const { sendResBody, sendResStatus } = require("../utils/helpers")

exports.index = ( req,res) => {
    Request.findAll()
        .then(result => sendResBody(res,200,result))
        .catch(_ => sendResStatus(res,500))
}

exports.show  = (req,res) => {
    const {id} = req.params
    Post.findByPk(id)
        .then(result => sendResBody(res,200,result))
        .catch(result => sendResStatus(res,500))
}
 