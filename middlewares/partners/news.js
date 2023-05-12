const { Post } = require("../../db/sequelize")
const { sendResStatus } = require("../../utils/helpers")
const jwt  = require("jsonwebtoken")

exports.verifyOwn = (req, res, next) => {
    const {id} = req.params
    const { token } = req.headers

    Post.findByPk(id)
    .then(post => {
        if(post.authorId !== jwt.decode(token).id) return sendResStatus(res , 403)

        next()
    })
}