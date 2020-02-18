var Sequelize = require("sequelize");
var config = require("../config.js");
var userModel = require("./models/user.js");
var itemModel = require("./models/item.js");

//coonfig connection database
var sequelize = new Sequelize(
    config.database,
    config.user,
    config.password,
    {
        dialect: "mysql",
        host: config.host
    }
);

//init model user
var User = sequelize.define("user", userModel);

//init model item
var Item = sequelize.define("item", itemModel);

User.hasMany(Item);

//sync models on database
sequelize.sync().then(result=>{
    //console.log(result);
}).catch(err=> console.log(err));

exports.user = User;
exports.item = Item;