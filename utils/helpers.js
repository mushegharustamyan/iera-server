exports.sendResStatus = (res, status, message = "") => {
	if (message === "")
		switch (status) {
			case 200:
				message = "Success"
				break
			case 201:
				message = "Record created"
				break
			case 202:
				message = "Waiting for approval"
				break
			case 204:
				message = "Record deleted"
				break
			case 400:
				message = "Missing required fileds"
				break
			case 401:
				message = "Unauthorized"
				break
			case 403:
				message = "Access denied"
				break
			case 404:
				message = "Record not found"
				break
			case 409:
				message = "Record already exists"
				break
			case 500:
				message = "Internal server error"
				break
			default:
				message = "Unknown error"
		}

	res.statusMessage = message
	return res.status(status).send()
}
exports.sendResBody = (res, status = 200, body = {}) => {
	res.statusMessage = "success"
	return res.status(status).json(body)
}

//////////////////////////////////////////////////////////////
exports.removeNullOrUndefined = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
};


exports.getEnv = (key) => {
	return process.env[`${key}`]
}
/////////////////////////////////////////////////////////////
const nodeMailer = require("nodemailer")

exports.transporter = nodeMailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_LOGIN,
		pass: process.env.EMAIL_SECRET_KEY
	}
})
////////////////////////////////////////////////////////////////////

const { S3Client } = require("@aws-sdk/client-s3");

exports.s3 = new S3Client({
	credentials: {
	  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
	region: process.env.AWS_REGION,
  });



