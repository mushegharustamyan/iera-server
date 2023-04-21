
const AuthRouter = require('../routes/auth')
const adminUserRouter = require("../routes/admin/user")
const adminNewsRouter = require("../routes/news")

const modearatorNewsRouter = require("../routes/news")

exports.ConfigRouter = (app) => {
    const { verifyAdmin,verifyModerator,verifyPartner } = require('../middlewares/verifications')
    
    // Admin Routes
    app.use("/auth",AuthRouter)

    app.use("/admin/user" , verifyAdmin , adminUserRouter)

    app.use("/admin/news", verifyAdmin , adminNewsRouter)

    // Moderator

    app.use("/moderator/news", verifyModerator,modearatorNewsRouter)
}