const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 7500;
const buddy = require('./buddy.json');
const con = require('./database');
const storeProducts = require('./middlewareFunctions');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/users', (req, res) => {
    const users = Array.isArray(req.body) ? req.body : [req.body];
    const values = users.map(user => [user.name, user.email, user.number, user.role, user.store_id]);

    let sql = "insert into users(name,email,number,role,store_id) values ?";
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/store', (req, res) => {
    const store = Array.isArray(req.body) ? req.body : [req.body];
    const values = store.map(stores => [stores.id, stores.name, stores.address]);

    let sql = "insert into store(id,name,address) values ?";
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.post('/api/products', (req, res) => {
    const products = Array.isArray(req.body) ? req.body : [req.body];
    const values = products.map(product => [product.id, product.product_name, product.description, product.store_id]);

    let sql = "insert into products(id,name,description,store_id) values ?";
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/store', storeProducts, (req, res) => {
    let sql;
    sql = `select * from users where id = ${req.user_id}`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length == 0) {
            res.send({ message: `user not found with ID ${req.user_id}` });
        }
        else {
            sql = `select store.id, store.name, store.address, products.product_name,products.description, products.store_id, products.id
            from store
            inner join products on store.id = products.store_id
            where store.id = ?`;

            con.query(sql, [result[0].store_id], (err, resu lt) => {
                if (err) throw err;
                if (result.length == 0) {
                    res.send({ message: "No products found for this user." });
                }
                const productInfo = {
                    id: result[0].store_id,
                    name: result[0].store_name,
                    address: result[0].address,
                    products: result.map(row => ({
                        product_name: row.product_name,
                        description: row.description,
                        store_id: row.store_id,
                        id: row.id
                    }))
                };
                res.send(productInfo);
            });
        }
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} `));