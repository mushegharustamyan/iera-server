
const AuthRouter = require('../routes/auth')
const adminUserRouter = require("../routes/admin/user")
const adminNewsRouter = require("../routes/news")
const adminEventRouter = require("../routes/event")

const partnerNewsRouter = require("../routes/partner/news")
const partnerEventRouter = require("../routes/partner/event")

const modearatorNewsRouter = require("../routes/news")
const modearatorEventRouter = require("../routes/event")

const postRouter = require("../routes/post")

const subscribeRouter = require("../routes/subscribe")

exports.ConfigRouter = (app) => {
    const { verifyAdmin,verifyModerator,verifyPartner } = require('../middlewares/verifications')
    
    // Admin Routes
    app.use("/auth",AuthRouter)

    app.use("/admin/user" , verifyAdmin , adminUserRouter)

    app.use("/admin/news", verifyAdmin , adminNewsRouter)

    app.use("/admin/event" , verifyAdmin , adminEventRouter) 

    // Moderator

    app.use("/moderator/news", verifyModerator,modearatorNewsRouter)

    app.use("/moderator/event", verifyModerator, modearatorEventRouter)

    // Partner

    app.use("/partner/news",verifyPartner ,partnerNewsRouter)

    app.use("/partner/event",verifyPartner,partnerEventRouter)

    //publick

    app.use("/news-events", postRouter)

    app.use("/subscribe", subscribeRouter)
}