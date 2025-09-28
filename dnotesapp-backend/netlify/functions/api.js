const serverless = require("serverless-http");
const cors = require("cors");
const { app } = require("../../connections/server");
app.get("/", (req, res) => {
    res.send("API is working 🚀");
});
// Export serverless handlerr
module.exports.handler = serverless(app);