const moment = require("moment");
const { Op } = require("sequelize");
const { Post } = require("../db/sequelize");
const { sendResBody, sendResStatus } = require("../utils/helpers");

const STATUS_APPROVED = "approved";

exports.index = async (req, res) => {
  try {
    const { startDate = "01/01/1999", endDate = "31/12/9999" } = req.query;
    const { order = "ASC" } = req.params;

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
                [Op.between]: [
                  start.format("DD/MM/YYYY"),
                  end.format("DD/MM/YYYY"),
                ],
              },
            },
            {
              type: "event",
              startDate: { [Op.gte]: start.format("DD/MM/YYYY") },
              endDate: { [Op.lte]: end.format("DD/MM/YYYY") },
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
