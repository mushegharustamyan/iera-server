const { Event } = require("../../db/sequelize")
const { sendResStatus } = require("../../utils/helpers")

exports.verifyPost = (req , res , next) => {
  const {id} = req.params

  Event.findByPk(id)
  .then((post) => {
    if(!post) return sendResStatus(res , 404)

    next()
  })
}

exports.verifyCreate = (req , res , next) => {
  const {title , description , img, date} = req.body

  if(!title || !description || !img || !date ) return sendResStatus(res , 409 , "Missing Required fields")

  next()
}