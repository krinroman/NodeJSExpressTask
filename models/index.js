var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var Sequelize = require("sequelize");
var cls = require('continuation-local-storage');
var ns = cls.createNamespace('transaction-namespace');
var clsBluebird = require('cls-bluebird');
var config = require("../config.js");

var db = {};

clsBluebird(ns, Promise);
Sequelize.useCLS(ns);

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

console.log(__dirname);

fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== "seeds");
}).forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

sequelize.sync({ force: false });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;