const svgCaptcha = require("svg-captcha");
const { transporter, sendResStatus } = require("../utils/helpers");
const express = require("express");
const router = express.Router();

router.post("/subscribe", (req, res) => {
  const options = req.body;

  // Generate a CAPTCHA
  const captcha = svgCaptcha.create();

  transporter
    .sendMail({
      from: process.env.EMAIL_LOGIN,
      to: process.env.EMAIL_LOGIN,
      subject: `${options.name} ${options.surname}`,
      text: ` From - ${options.name}: \n\n ${options.text}`,
      html: `
          <p>Please complete the CAPTCHA below:</p>
          <img src="data:image/svg+xml;base64,${captcha.data}" alt="CAPTCHA">
          <br>
          <input type="text" name="captcha" placeholder="Enter CAPTCHA">
        `,
    })
    .then((_) => sendResStatus(res, 201, "Email Sent"))
    .catch((e) => sendResStatus(res,400,"Something went wrong"));
});
