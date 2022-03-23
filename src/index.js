const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const bodyParser = require("body-parser");
//----
const routerNavigation = require("./routes/index");

const app = express();
const port = 3001;

// midleware
app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());
app.use(helmet());
app.use(xss());
app.use(compression());
app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());
//---
app.use("/", routerNavigation);

app.use("/*", (request, response) => {
  response.status(404).send("path not found !");
});

// app.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("hello world");
// });

app.listen(port, () => {
  console.log(`Express app is listen on port ${port} !`);
});
