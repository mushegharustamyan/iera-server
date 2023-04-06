const adminAuthRouter = require('../routes/auth')

const ConfigRouter = (app) => {
    app.use("/auth", adminAuthRouter)
}