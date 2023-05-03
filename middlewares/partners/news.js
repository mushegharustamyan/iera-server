const { Post } = require("../../db/sequelize")
const { sendResStatus } = require("../../utils/helpers")
const {jwt_decode} = require("jwt-decode")

exports.verifyOwn = (req, res, next) => {
    const {id} = req.params
    const { token } = req.headers

    Post.findByPk(id)
    .then(post => {
        if(post.authorId !== jwt_decode(token).id) return sendResStatus(res , 403)

        next()
    })
}