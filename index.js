const express = require("express")
const cors = require("cors")
const connectionInit = require("./db/init")

const app = express()

app.use(cors({ origin: "*" }))
app.use(express.json())

app.listen(5000 , () => {
  console.log("listen port 5000")
  connectionInit()
  .then(_ => console.log("Database conected"))
})