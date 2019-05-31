require("dotenv").config();
const http = require("http");
const express = require("express");
const path = require("path");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const bodyParser = require("body-parser");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));

app.use(express.static(path.join(__dirname, "static")));

app.post("/sms", (req, res) => {
  const twiml = new MessagingResponse();
  twiml.message("The Robots are coming! Head for the hills!");
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.post("/send", async (req, res) => {
  const { phone, text } = req.body;

  if (!phone) res.send("incorrect phone");

  const result = await client.messages.create({
    to: phone,
    from: "+12566459240",
    body: text
  });
  res.send(result.sid);
});

app.post("/addNumber", async (req, res) => {
  if (!req.body.number) res.send("Error number is undefined");
  const hosted_number_order = await client.preview.hosted_numbers
    .hostedNumberOrders(req.body.number)
   // .fetch();
  res.send(hosted_number_order.friendlyName);
});

http.createServer(app).listen(process.env.PORT, () => {
  console.log("Express server listening on port 3001");
});
