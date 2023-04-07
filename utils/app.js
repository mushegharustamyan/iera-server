const adminAuthRouter = require('../routes/auth')
const adminUserRouter = require("../routes/admin/user")
exports.ConfigRouter = (app) => {
    const { verifyAdmin } = require('../middlewares/auth')
    
    app.use("/auth", adminAuthRouter)

    app.use("/admin" , verifyAdmin , adminUserRouter)
}