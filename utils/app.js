
const AuthRouter = require('../routes/auth')
const adminUserRouter = require("../routes/admin/user")
const adminNewsRouter = require("../routes/news")
const adminEventsRouter = require("../routes/events")

const modearatorNewsRouter = require("../routes/news")
const modearatorEvents = require("../routes/events")

exports.ConfigRouter = (app) => {
    const { verifyAdmin,verifyModerator,verifyPartner } = require('../middlewares/verifications')
    
    // Admin Routes
    app.use("/auth",AuthRouter)

    app.use("/admin/user" , verifyAdmin , adminUserRouter)

    app.use("/admin/news", verifyAdmin , adminNewsRouter)

    app.use("/admin/events", verifyAdmin , adminEventsRouter)

    // Moderator

    app.use("/moderator/news", verifyModerator,modearatorNewsRouter)
    app.use("/moderator/events", verifyModerator, modearatorEvents)
}