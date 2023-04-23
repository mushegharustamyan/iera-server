const { sequelize } = require("../db/sequelize");
const { sendResBody, sendResStatus } = require("../utils/helpers");

exports.index = (req, res) => {
    const { startDate, endDate } = req.body;
    const { order } = req.params;

    const validOrder = ["DESC, ASC"];
    const selectedOrder = validOrder.includes(order) ? order : "ASC";

    if(startDate && endDate) {
        sequelize.query(`SELECT * FROM 'News' UNION SELECT * FROM EVENTS ORDER By 'date' ${selectedOrder} WHERE 'date' BETWEEN ${startDate} AND ${endDate}`)
            .then((result) => sendResBody(res , 200 , result))
            .catch(_ => sendResStatus(res , 500))
    } else {
        sequelize.query(`SELECT * FROM 'News' UNION SELECT * FROM EVENTS ORDER By 'date' ${selectedOrder}`)
            .then((result) => sendResBody(res , 200, result))
            .catch(_ => sendResStatus(res , 500))
    }
  };