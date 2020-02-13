var express = require('express');
var mysql = require("mysql2");
var md5 = require('md5');
var config = require("../config.js");
var router = express.Router();


// create pool connect to database
var pool = mysql.createPool({
  connectionLimit: 5,
  host: config.host,
  database: config.database,
  user: config.user,
  password: config.password
});

/* GET home page. */
router.get('/', function(req, res, next) {
	if(!req.session.userId){
		res.render('auth');
		return;
	}
	let userId = req.session.userId;	
	let sortField = req.query.sortField;
	let sortOrder = req.query.sortOrder;
	let querySort;
	let indexSort;
	if(sortField == "value"){
		querySort = "ORDER BY words.value ";
		indexSort = 2;
	}
	else {
		querySort = "ORDER BY words.id ";
		indexSort = 0;
	}
	if(sortOrder == "desc"){
		querySort += "DESC"
		indexSort += 1;
	}
	else{
		querySort += "ASC"
	}
	pool.query("SELECT * FROM words WHERE words.user_id = ? " + querySort, parseInt(userId), function(err, data) {
	    if(err) return console.log(err);
	    else{
	  		res.render('index', { indexSort: indexSort, listItem: data});
	    }
    });
});

/* POST add item to database */
router.post('/', function(req, res, next){
	let userId = req.session.userId;
	let id = req.body.id;
	let value = req.body.value;
	if(!value){ 
		res.send(JSON.stringify({status: "error"}));
		console.log("Значение не задано");
		return;
	}
	if(!id){
		pool.query("INSERT INTO words (value, user_id) VALUES ( ?, ? )", [ value, parseInt(userId) ], function(err, data) {
			if(err){ 
				res.send(JSON.stringify({status: "error"}));
				console.log(err);
			}
			else{
				res.send(JSON.stringify({status: "ok"}));
			}
		});
	}
	else{
		pool.query("INSERT INTO words (id, value, user_id) VALUES ( ?, ?, ? )", [ parseInt(id), value, parseInt(userId) ], function(err, data) {
			if(err){ 
				res.send(JSON.stringify({status: "error"}));
				console.log(err);
			}
			else{
				res.send(JSON.stringify({status: "ok"}));
			}
		});
	}
});

/* POST edit item to database */
router.post('/:id', function(req, res, next){
	let id = req.params.id;
	let value = req.body.value;
	let userId = req.session.userId;
	pool.query("SELECT * FROM words WHERE words.id = ?", id, function(errSel, dataSel) {
		if(errSel){ 
			res.send(JSON.stringify({status: "error"}));
			return console.log(err);
		}
		if(dataSel[0].user_id != parseInt(userId)){ 
			res.send(JSON.stringify({status: "error"}));
			return;
		}
		if(!value){ 
			res.send(JSON.stringify({status: "error"}));
			return console.log("Значение для изменения не задано");
		}
		pool.query("UPDATE words SET value = ? WHERE words.id = ?", [ value, parseInt(id) ], function(err, data) {
			if(err){ 
				res.send(JSON.stringify({status: "error"}));
				console.log(err);
			}
			else{
				res.send(JSON.stringify({status: "ok"}));
			}
		});
    });
});

/* POST delete item to database */
router.post('/delete/:id', function(req, res, next){
	let id = req.params.id;
	let userId = req.session.userId;
	pool.query("SELECT * FROM words WHERE words.id = ?", parseInt(id),  function(errSel, dataSel) {
		if(errSel){ 
			res.send(JSON.stringify({status: "error"}));
			return console.log(err);
		}
		if(dataSel[0].user_id != parseInt(userId)){ 
			res.send(JSON.stringify({status: "error"}));
			return;
		}
		pool.query("DELETE FROM words WHERE words.id = ?", parseInt(id), function(err, data) {
			if(err){ 
				res.send(JSON.stringify({status: "error"}));
				console.log(err);
			}
			else{
				res.send(JSON.stringify({status: "ok"}));
			}
		});
    });
});

/* POST get login by id user */
router.post('/user/get', function(req, res, next){
	let id = req.session.userId;
	pool.query("SELECT login FROM users WHERE users.id = ?", parseInt(id), function(err, data) {
	    if(err){ 
	    	res.send(JSON.stringify({status: "error"}));
	    	console.log(err);
	    }
	    else{
	    	if(data.length == 1){
	    		res.send(JSON.stringify({status: "ok", login: data[0].login}));
	    	}
	    	else{
	    		res.send(JSON.stringify({status: "error"}));
	    	}
	    }
    });
});

/* POST add user to database */
router.post('/user/add', function(req, res, next){
	let login = req.body.login;
	let password = req.body.password;
	let hashPassword = md5(password);
	pool.query("INSERT INTO users (login, password) VALUES ( ?, ? )", login, hashPassword, function(err, data){
	    if(err){ 
	    	res.send(JSON.stringify({status: "error"}));
	    	console.log(err);
	    }
	    else{
			req.session.userId = data.insertId;
	    	res.send(JSON.stringify({status: "ok"}));	
	    	
	    }
    });
});

/* POST valid user to database */
router.post('/user/valid', function(req, res, next){
	let login = req.body.login;
	let password = req.body.password;
	pool.query("SELECT id, password FROM users WHERE users.login = ?", login, function(err, data) {
	    if(err){ 
	    	res.send(JSON.stringify({status: "error"}));
	    	console.log(err);
	    }
	    else{
	    	if(data.length == 1 && data[0].password === md5(password)){
				req.session.userId = data[0].id;
	    		res.send(JSON.stringify({status: "ok"}));
	    	}
	    	else{
	    		res.send(JSON.stringify({status: "error"}));
	    	}
	    }
    });
});

/* POST logout user or close session */
router.post('/user/logout', function(req, res, next){
	if (req.session) {
		req.session.destroy(function() {});
	  }
	res.redirect('/');
});


module.exports = router;
