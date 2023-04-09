const AuthRouter = require('../routes/auth')
const adminUserRouter = require("../routes/admin/user")
exports.ConfigRouter = (app) => {
    const { verifyAdmin } = require('../middlewares/auth')
    
    app.use("/auth",AuthRouter)

    app.use("/admin" , verifyAdmin , adminUserRouter)
}