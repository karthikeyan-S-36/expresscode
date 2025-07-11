const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 6500;
const buddy = require('./buddy.json');
const mysql = require('mysql');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testdb"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});