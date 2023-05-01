const { transporter, sendResStatus, sendResBody } = require("../utils/helpers");
const express = require("express");
const router = express.Router();

function generateCaptcha() {
  const captcha = Math.random().toString(36).substr(2, 5);
  return captcha;
}

let storedCaptcha = null;

router.get("/", (req, res) => {
  storedCaptcha = generateCaptcha();
  res.json({ captcha: storedCaptcha });
});

router.post("/", (req, res) => {
  const options = req.body;
  const userCaptcha = req.body.captcha;

  if (!storedCaptcha || storedCaptcha !== userCaptcha) {
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
        storedCaptcha = null;
        sendResStatus(res, 201, "Email Sent");
      })
      .catch((e) => sendResStatus(res, 400, "Something went wrong"));
  }
});

module.exports = router;
