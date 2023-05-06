const moment = require("moment");
const { Op } = require("sequelize");
const { Post } = require("../db/sequelize");
const { sendResBody, sendResStatus } = require("../utils/helpers");

const STATUS_APPROVED = "approved";

exports.index = async (req, res) => {
  try {
    const { startDate = "01/01/1900", endDate = "31/12/3000" } = req.query;
    const { order = "ASC" } = req.params;
    console.log(startDate, endDate);

    const validOrder = ["DESC", "ASC"];
    const selectedOrder = validOrder.includes(order) ? order : "ASC";

    const start = moment(startDate, "DD/MM/YYYY");
    const end = moment(endDate, "DD/MM/YYYY");

    const [result] = await Promise.all([
      Post.findAll({
        where: {
          status: STATUS_APPROVED,
          [Op.or]: [
            {
              date: {
                [Op.between]: [startDate, endDate],
              },
              startDate: { [Op.between]: [startDate, endDate] },
              endDate: {
                [Op.between]: [startDate, endDate],
              },
            },
          ],
        },
        order: [["date", selectedOrder]],
      }),
    ]);

    sendResBody(res, 200, result);
  } catch (e) {
    console.log(e);
    sendResStatus(res, 500);
  }
};

exports.show = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Post.findByPk(id);

    if (!result) {
      sendResStatus(res, 404);
    }

    sendResBody(res, 200, result);
  } catch (e) {
    console.error(e);
    sendResStatus(res, 500);
  }
};
