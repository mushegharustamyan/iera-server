const AuthRouter = require('../routes/auth')
const adminUserRouter = require("../routes/admin/user")
const adminNewsRouter = require("../routes/admin/news")
exports.ConfigRouter = (app) => {
    const { verifyAdmin } = require('../middlewares/auth')
    
    app.use("/auth",AuthRouter)

    app.use("/admin/user" , verifyAdmin , adminUserRouter)

    app.use("/admin/news", verifyAdmin , adminNewsRouter)
}