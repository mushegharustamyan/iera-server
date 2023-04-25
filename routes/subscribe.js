const { transporter, sendResStatus, sendResBody } = require("../utils/helpers");
const express = require("express");
const router = express.Router();
const session = require("express-session");

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

function generateCaptcha() {
  const captcha = Math.random().toString(36).substr(2, 5);
  return captcha;
}

router.get("/", (req, res) => {
  req.session.captcha = generateCaptcha();
  res.json({ captcha: req.session.captcha });
});

router.post("/", (req, res) => {
  const options = req.body;
  const userCaptcha = req.body.captcha;

  const captcha = req.session.captcha;

  if (!captcha || captcha !== userCaptcha) {
    sendResBody(res, 400, "invalid Captcha");
  } else {
    const message = `from - ${options.email} ${options.text}`;

    transporter
      .sendMail({
        from: process.env.EMAIL_LOGIN,
        to: process.env.EMAIL_LOGIN,
        subject: `${options.name} ${options.surname}`,
        text: message,
      })
      .then((_) => {
        delete req.session.captcha;
        sendResStatus(res, 201, "Email Sent");
      })
      .catch((e) => sendResStatus(res, 400, "Something went wrong"));
  }
});

module.exports = router;
