const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3500;
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

app.post('/api/products', (req, res) => {
    const products = Array.isArray(req.body) ? req.body : [req.body];
    const values = products.map(product => [product.brand, product.model, product.price_in_rs, product.country]);

    let sql = "insert into products(brand,model,price_in_rs,country) values ?";
    con.query(sql, [values], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/products/', (req, res) => {
    const { user_id } = req.query;

    if (isNaN(user_id)) {
        res.send({ message: `${user_id} ID is not valid` });
    } else {
        let userTableSql = `select * from users where id = ${user_id}`;
        con.query(userTableSql, (err, result) => {
            if (err) {
                res.send({ message: `${err}` });
            }
            else if (result.length == 0) {
                res.send({ message: `User not found with ID ${user_id}` });
            }
            else {
                let productTableSql = `select * from products`;
                con.query(productTableSql, (err, result) => {
                    if (err) throw err;
                    res.send(result);
                });
            }
        });
    }

});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));