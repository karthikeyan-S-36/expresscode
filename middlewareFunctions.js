const con = require('./database');

const storeProducts = function(req,res,next){
      let {user_id} = req.headers;
       
      if(isNaN(user_id)){
        return res.send({message : `user ID ${user_id} is not valid.`})
      }
      else{
        req.user_id = user_id;
        next();
      }
};

module.exports = storeProducts;