// importing instaleed package
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.get("/", function(req, res) {
    res.send("<h1>HI</h1>");
}) 

app.listen(6969, function() {
    console.log("Server Started");
})
