const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const bodyParser = require("body-parser");
require("dotenv").config();
//----
const routerNavigation = require("./src/routes/index");

const app = express();
const port = process.env.PORT;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.options("*", cors());
app.use(helmet());
app.use(xss());
app.use(compression());
app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
//---
app.use("/", routerNavigation);

app.use("/*", (request, response) => {
  response.status(404).send("path not found !");
});

app.listen(port, () => {
  console.log(`Express app is listen on port ${port} !`);
});
