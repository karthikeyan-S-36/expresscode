const con = require('./database');

const check_user_id_query = function (req, res, next) {
    const { user_id } = req.query;

    if (isNaN(user_id)) {
        res.send({ message: `${user_id} ID is not valid` });
    }
    else {
        let userTableSql = `select * from users where id = ${user_id}`;
        con.query(userTableSql, (err, result) => {
            if (err) {
                res.send({ message: `${err}` });
            }
            else if (result.length == 0) {
                res.send({ message: `User not found with ID ${user_id}` });
            }
            else {
                next();
            }
        });
    };
};

module.exports = check_user_id_query;