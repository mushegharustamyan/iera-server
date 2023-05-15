const AuthRouter = require("../routes/auth");
const adminUserRouter = require("../routes/admin/user");
const adminNewsRouter = require("../routes/news");
const adminEventRouter = require("../routes/event");
const requestRouter = require("../routes/request");
const subscribeRouter = require("../routes/subscribe");
const contactUsRouter = require("../routes/contactUs");

const partnerNewsRouter = require("../routes/partner/news");
const partnerEventRouter = require("../routes/partner/event");

const modearatorNewsRouter = require("../routes/news");
const modearatorEventRouter = require("../routes/event");

const postRouter = require("../routes/post");
const userRouter = require("../routes/users");


exports.ConfigRouter = (app) => {
  const {
    verifyAdmin,
    verifyModerator,
    verifyPartner,
  } = require("../middlewares/verifications");

  // Admin Routes
  app.use("/backend/auth", AuthRouter);

  app.use("/backend/admin/user", verifyAdmin, adminUserRouter);

  app.use("/backend/admin/news", verifyAdmin, adminNewsRouter);

  app.use("/backend/admin/event", verifyAdmin, adminEventRouter);
  app.use("/backend/", subscribeRouter); //admin/subscribers have access only superuser
  app.use("/backend/admin/request", verifyAdmin, requestRouter);

  // Moderator

  app.use("/backend/moderator/news", verifyModerator, modearatorNewsRouter);

  app.use("/backend/moderator/event", verifyModerator, modearatorEventRouter);
  app.use("/backend/moderator/request", verifyModerator, requestRouter);

  // Partner

  app.use("/backend/partner/news", verifyPartner, partnerNewsRouter);

  app.use("/backend/partner/event", verifyPartner, partnerEventRouter);

  //public

  app.use("/backend/news-events", postRouter);
  app.use("/backend/", subscribeRouter); //subscribe
  app.use("/backend/contact-us", contactUsRouter);
  app.use("/backend/user", userRouter);
};
