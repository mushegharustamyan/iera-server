const { sendResStatus, sendResBody } = require("../../utils/helpers")

exports.index = (req , res) => {
  sendResBody(res , 200)
}