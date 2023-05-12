const bcrypt = require("bcrypt")
const {User, Role} = require("./sequelize")
const { getEnv } = require("../utils/helpers")

exports.createRole = async () => {
    const superUser  = {name: 'admin', access_level : 1 }
    const moderator = {name: "moderator", access_level : 2}
    const partner = {name :"partner", access_level: 3}

    return Role.findAll().then((roles) => {
        if (roles.length === 0) Role.bulkCreate([superUser , moderator , partner]).catch(_ => console.log("Error while creating User"))
    })
}

exports.createSuperUser = async () => {
    const hashedPwd = await bcrypt.hash(getEnv("ADMIN_PWD"), 8)

    const admin = {
        name: getEnv("ADMIN_NAME"),
        login: getEnv("ADMIN_LOGIN"),
        password: hashedPwd,
        roleId: 1
    }

    User.findOne({
        where: {
            login: admin.login
        }
    })
    .then((user) => {
        if(!user) return User.create(admin).then(_ => console.log("Admin Created"))
    })
}