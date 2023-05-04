
const AuthRouter = require('../routes/auth')
const adminUserRouter = require("../routes/admin/user")
const adminNewsRouter = require("../routes/news")
const adminEventRouter = require("../routes/event")
const requestRouter = require("../routes/request")
const subscribeRouter = require("../routes/subscribe")
const contactUsRouter = require("../routes/contactUs")


const partnerNewsRouter = require("../routes/partner/news")
const partnerEventRouter = require("../routes/partner/event")

const modearatorNewsRouter = require("../routes/news")
const modearatorEventRouter = require("../routes/event")

const postRouter = require("../routes/post")
const userRouter = require("../routes/users")

const approveDeclineRouter = require("../routes/approve-decline")


exports.ConfigRouter = (app) => {
    const { verifyAdmin,verifyModerator,verifyPartner } = require('../middlewares/verifications')
    
    // Admin Routes
    app.use("/auth",AuthRouter)

    app.use("/admin/user" , verifyAdmin , adminUserRouter)

    app.use("/admin/news", verifyAdmin , adminNewsRouter)

    app.use("/admin/event" , verifyAdmin , adminEventRouter)
    app.use("/",  subscribeRouter)//admin/subscribers have access only superuser
    app.use("/admin/request" , verifyAdmin,requestRouter )
    app.use("/admin", approveDeclineRouter)
    // Moderator

    app.use("/moderator/news", verifyModerator,modearatorNewsRouter)

    app.use("/moderator/event", verifyModerator, modearatorEventRouter)
    app.use("/moderator/request", verifyModerator, requestRouter)
    app.use("/moderator",approveDeclineRouter)

    // Partner

    app.use("/partner/news",verifyPartner ,partnerNewsRouter)

    app.use("/partner/event",verifyPartner,partnerEventRouter)

    //public

    app.use("/news-events", postRouter)
    app.use("/", subscribeRouter)//subscribe
    app.use("/contact-us", contactUsRouter)
    app.use("/user",userRouter )
}