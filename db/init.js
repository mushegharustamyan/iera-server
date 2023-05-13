const mysql = require('mysql2')

const connectionInit = async () =>
    new Promise((resolove, reject) => {
        const connection = mysql.createConnection({
            host: "mysql",
            user: "root",
            password: "root",
            port: "3306"
        })
        connection.query('CREATE DATABASE IF NOT EXISTS iera', (err , res) => {
            if(err) console.log(err)

            resolove(res)
        })
    })  

module.exports = connectionInit
