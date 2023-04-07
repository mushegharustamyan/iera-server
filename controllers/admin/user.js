const bcrypt = require("bcrypt")
const { User } = require("../../db/sequelize")

const { sendResStatus } = require("../../utils/helpers")

exports.create = async (req , res) => {
    const {name , password , login , roleId} = req.body

    const hashedPwd = await bcrypt.hash(password, 8)

    User.create({
        name,
        password: hashedPwd,
        login,
        roleId
    })
    .then((_) => sendResStatus(res, 201, "User Created"))
    .catch((_) => sendResStatus(res, 500))
}

exports.delete = (req , res) => {
    const {id} = req.params

    User.destroy({where: {id}})
    .then((_) => sendResStatus(res , 204))
    .catch((_) => sendResStatus(res, 500))
}