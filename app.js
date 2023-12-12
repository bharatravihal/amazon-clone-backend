require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const router = require("./routes/router");
require("./db/connection");

const Products = require("./models/productsSchema");
const User = require("./models/userSchema");
const Defaultdata = require("./defaultdata");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Use body-parser middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.port || 8005;
app.use(express.json());
app.use(cors());
app.use(cookieParser(""));
app.use(router);
app.listen(port, () => {
  console.log(`server connected to ${process.env.port}`);
});
Defaultdata();
