const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3500;
const con = require('./database');
const check_user_id_query = require("./middlewareFunctions");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/products', (req, res) => {
    const products = Array.isArray(req.body) ? req.body : [req.body];
    const values = products.map(product => [product.brand, product.model, product.price_in_rs, product.country]);

    let sql = "insert into products(brand,model,price_in_rs,country) values ?";
    con.query(sql, [values], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/products/', check_user_id_query, (req, res) => {
    let productTableSql = `select * from products`;
    con.query(productTableSql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));