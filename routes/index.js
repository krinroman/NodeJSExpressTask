var express = require('express');
var md5 = require('md5');
var fs = require("fs");
var db = require("../models");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
    if(!req.session.userId){
        res.render('auth');
        return;
    }
    next();
}, function(req, res, next) {
    let userId = req.session.userId;    
    let sortField = req.query.sortField;
    let sortOrder = req.query.sortOrder;
    let indexSort;
    if(sortField != 'value' && sortField != 'id') sortField = 'id';
    if(sortOrder != 'DESC' && sortOrder != 'ASC') sortOrder = 'ASC';
    
    if(sortField == 'id') indexSort = 0;
    if(sortField == 'value') indexSort = 2;
    if(sortOrder == 'DESC') indexSort += 1; 
    

    db.item.findAll({where: {userId: userId}, order: [[sortField, sortOrder]], raw: true})
        .then(items=>{
            res.render('index', { indexSort: indexSort, listItem: items, page: "list"});
        }).catch((err) => {
            console.log(err);
        });
});

router.get('/lk', function(req, res, next){
    if(!req.session.userId){
        res.render('auth');
        return;
    }
    next();
}, function(req, res, next){
    res.render('account', { page: "lk" });
});

/* POST add item to database */
router.post('/add', function(req, res, next){
    let userId = req.session.userId;
    let id = req.body.id;
    let value = req.body.value;
    if(!value){ 
        res.send(JSON.stringify({status: "error", message: "Значение не задано"}));
        return;
    }
    if(!id){
        db.item.create({ value: value, userId: userId })
            .then(() => {
                res.send(JSON.stringify({status: "ok"}));
            }).catch((err) => {
                console.log(err);
                res.send(JSON.stringify({status: "error", message: "Ошибка запроса к базе данных, обратитесь к администратору"}));
            });
    }
    else{
        db.item.create({ id: id, value: value, userId: userId })
            .then(() => {
                res.send(JSON.stringify({status: "ok"}));
            }).catch((err) => {
                console.log(err);
                res.send(JSON.stringify({status: "error", message: "Ошибка запроса к базе данных, обратитесь к администратору"}));
            });
    }
});

/* POST edit item to database */
router.post('/edit/:id', function(req, res, next){
    let id = req.params.id;
    let value = req.body.value;
    let userId = req.session.userId;
    if(!value){ 
        res.send(JSON.stringify({status: "error"}));
        return console.log("Значение для изменения не задано");
    }
    db.item.update({ value: value }, {where: {id: id, userId: userId}})
        .then(item=>{
            if(!item){
                res.send(JSON.stringify({status: "error", message: "Пользователь не определен"}));
                console.log("Доступ запрещен для пользователя " + userId);
                return;
            }
            res.send(JSON.stringify({status: "ok"}));
        }).catch((err) => {
            console.log(err);
            res.send(JSON.stringify({status: "error", message: "Ошибка запроса к базе данных, обратитесь к администратору"}));
        });
});

/* POST delete item to database */
router.post('/delete/:id', function(req, res, next){
    let id = req.params.id;
    let userId = req.session.userId;
    db.item.destroy({where: {id: id, userId: userId}})
        .then(item=>{
            if(!item){
                res.send(JSON.stringify({status: "error", message: "Пользователь не определен"}));
                console.log("Доступ запрещен для пользователя " + userId);
                return;
            }
            res.send(JSON.stringify({status: "ok"}));
        }).catch((err) => {
            console.log(err);
            res.send(JSON.stringify({status: "error", message: "Ошибка запроса к базе данных, обратитесь к администратору"}));
        });
});

/* POST get login by id user */
router.post('/user/get', function(req, res, next){
    let id = req.session.userId;
    db.user.findByPk(id)
        .then(user=>{
            if(!user){
                res.send(JSON.stringify({status: "error"}));
                return;
            }
            res.send(JSON.stringify({status: "ok", login: user.login}));
        }).catch((err) => {
            console.log(err);
            res.send(JSON.stringify({status: "error", message: "Ошибка запроса к базе данных, обратитесь к администратору"}));
        });
});

/* POST add user to database */
router.post('/user/add', function(req, res, next){
    let login = req.body.login;
    let password = req.body.password;
    let hashPassword = md5(password);
    console.log("add user: " + login);
    db.user.findOne({where: {login: login}})
        .then(user=>{
            if(!user){
                db.user.create({login: login, password: hashPassword})
                    .then(user=>{
                        if (!req.session.key) req.session.key = req.sessionID;
                        req.session.userId = user.id;
                        console.log(req.session.key + " " + req.session.userId);
                        res.send(JSON.stringify({status: "ok"}));
                    }).catch((err) => {
                        console.log(err);
                        res.send(JSON.stringify({status: "error", message: "Ошибка запроса к базе данных, обратитесь к администратору"}));
                    });
            }
            else{
                res.send(JSON.stringify({status: "error", message: "Пользователь с таким именем уже существует"}));
            }
        }).catch((err) => {
            console.log(err);
            res.send(JSON.stringify({status: "error", message: "Ошибка запроса к базе данных, обратитесь к администратору"}));
        });
    
});

/* POST valid user to database */
router.post('/user/valid', function(req, res, next){
    let login = req.body.login;
    let password = req.body.password;
    db.user.findOne({where: {login: login}})
        .then(user=>{
            if(!user){
                res.send(JSON.stringify({status: "error", message: "Пользователь не найден, пожалуйста зарегистрируйтесь"}));
                return;
            }
            if(user.password !== md5(password)){
                res.send(JSON.stringify({status: "error", message: "Неверный пароль"}));
                return;
            }
            if (!req.session.key) req.session.key = req.sessionID;
            req.session.userId = user.id;
            res.send(JSON.stringify({status: "ok"}));
        }).catch((err) => {
            console.log(err);
            res.send(JSON.stringify({status: "error", message: "Ошибка запроса к базе данных, обратитесь к администратору"}));
        });
});

/* POST logout user or close session */
router.post('/user/logout', function(req, res, next){
    if (req.session) {
        req.session.destroy(function() {});
      }
    res.redirect('/');
});

/* POST download image */
router.post('/image/download', function(req, res, next){
    let filedb = req.file;
    if(req.file){
      res.send(JSON.stringify({status: "ok"}));
    }
    else{
      res.send(JSON.stringify({status: "error", message: "Файл не был загружен на сервер"}));
    }
});

/* POST valid image */
router.post('/image/valid', function(req, res, next){
    let userId = req.session.userId;
    if(!userId){
        res.send(JSON.stringify({status: "error", message: "Пользователь не определен"}));
        return;
    }
    fs.access("public/images/image_user_" + userId + ".jpg", function(error){
        if (!error){
            res.send(JSON.stringify({status: "ok", imgSrc: "/images/image_user_" + userId + ".jpg"}));
        }
        else{
            res.send(JSON.stringify({status: "error", message: "Ошибка загрузки файла"}));
        }
    });
});


module.exports = router;
