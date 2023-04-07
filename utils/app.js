const adminAuthRouter = require('../routes/auth')

exports.ConfigRouter = (app) => {
    app.use("/auth", adminAuthRouter)
}