const { transporter, sendResStatus, sendResBody } = require("../utils/helpers");
const express = require("express");
const router = express.Router();
const axios = require("axios")

router.post("/", async (req, res) => {
  const options = req.body;
  const recaptchaToken = req.body.recaptchaToken;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
  );
  const data = response.data;

  if (!data.success) {
    sendResBody(res, 400, "Invalid reCAPTCHA token");
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
        sendResStatus(res, 201, "Email Sent");
      })
      .catch((e) => sendResStatus(res, 400, "Something went wrong"));
  }
});

module.exports = router;
