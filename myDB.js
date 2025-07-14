const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 6500;
const buddy = require('./buddy.json');
const con = require('./database')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/users', Validate, (req, res) => {

    const users = Array.isArray(req.body) ? req.body : [req.body];
    const values = users.map(user => [user.name, user.email, user.age]);

    let sql = "insert into users(name,email,age) values ?";
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        res.send(result);
    });

});

app.get('/api/users/:id', Validate, (req, res) => {
    const { id } = req.params;
    let sql = "select * from users where id = ?";
    con.query(sql, [id], function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/users', Validate, (req, res) => {
    const { searchbyname } = req.query;

    let sql = `select id,name,email from users where name like ?`;
    con.query(sql, [`%${searchbyname}%`], function (err,result) {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/api/users', Validate, (req, res) => {
    let sql = "select * from users"
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.put('/api/users/:id', Validate, (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;

    let columns = [];
    let values = [];

    name != undefined ? (columns.push("name=?"), values.push(name)) : null;
    email != undefined ? (columns.push("email=?"), values.push(email)) : null;
    age != undefined ? (columns.push("age=?"), values.push(age)) : null;

    if (columns.length == 0) {
        return res.status(400).send({ error: "No valid columns to update." });
    }

    let sql = `update users set ${columns.join(", ")} WHERE id = ${id}`;
    con.query(sql, values, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.delete('/api/users', (req, res) => {
    let sql = "delete table users";

    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
});

app.delete('/api/users/:id', Validate, (req, res) => {
    const { id } = req.params;
    let selectsql = "select * from users where id = ?";
    
    con.query(selectsql, [id], function(err,results){
        if(err) throw err;
        if(results.length==0){
            res.status(404).send({error:`User not found with ID ${id}`});
        }
        let deletesql = "delete from users where id = ?";
        con.query(deletesql, [id], function(err,result){
            if(err) throw err;
            res.send({message: `User with ID ${id} deleted successfully`});
        });
    });
});

function Validate(req, res, next) {
    const { id } = req.params;
    const searchbyname = req.query.searchbyname;
    const reqbody = req.body;

    if (reqbody) {
        next();
    }
    else if (id) {
        if (isNaN(id) || parseInt(id) <= 0) {
            res.status(400).json({ message: "Invalid ID format." });
        } else {
            next();
        }
    }
    else if (searchbyname) {
        next();
    }
    else {
        next();
    }
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
