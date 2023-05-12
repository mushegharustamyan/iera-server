const { where } = require("sequelize");
const { Subscribe } = require("../db/sequelize");
const { sendResStatus, sendResBody } = require("../utils/helpers");
const ExcelJS = require("exceljs");
const axios = require("axios");

exports.create = async (req, res) => {
  try {
    const email = req.body.email;
    const recaptchaToken = req.body.recaptchaToken;

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
    );
    const data = response.data;

    if (!data.success) {
      sendResBody(res, 400, "Invalid reCAPTCHA token");
    } else {
      const subscribtion = await Subscribe.findOne({ where: { email } });;
      if (subscribtion) return sendResStatus(res, 409);
      await Subscribe.create({ email });
      sendResStatus(res, 201);
    }
  } catch (error) {
    sendResStatus(res, 500);
  }
};

exports.index = (req, res) => {
  Subscribe.findAll()
    .then((result) => sendResBody(res, 200, result))
    .catch((e) => sendResStatus(res, 500));
};

exports.delete = async (req, res) => {
  try {
    const { id } = await req.params;
    const count = await Subscribe.destroy({ where: { id } });
    if (count === 0) {
      return sendResStatus(res, 404);
    }
    sendResStatus(res, 204);
  } catch (error) {
    sendResStatus(res, 500);
  }
};

exports.downloadAll = async (req, res) => {
  try {
    const result = await Subscribe.findAll();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("sheet1");

    const columns = [
      { header: "ID", key: "id" },
      { header: "Email", key: "email" },
    ];
    worksheet.columns = columns;

    worksheet.addRows(result);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=subscribers.xlsx"
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    res.status(500).send("Error exporting data to Excel file");
  }
};
