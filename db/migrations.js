const bcrypt = require("bcrypt")
const {User, Role} = require("./sequelize")

exports.createRole = async () => {
    const newRole = {name: 'admin', access_level : 1 }

    return Role.findAll().then((roles) => {
        if (roles.length === 0) Role.bulkCreate(newRole).catch(_ => console.log("Error while creating User"))
    })
}

exports.createSuperUser = async () => {
    const hashedPwd = await bcrypt.hash(process.env.ADMIN_PWD, 8)

    const admin = {
        name: process.env.ADMIN_NAME,
        login: process.env.ADMIN_LOGIN,
        password: hashedPwd,
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