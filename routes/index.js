var express = require('express');
var mysql = require("mysql2");
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
	if(!req.cookies.userId){
		res.render('auth');
		return;
	}
	let userId = req.cookies.userId;	
	let indexSort = req.query.sort;
	let querySort;
	switch (indexSort) {
		case "0":{
			querySort = "ORDER BY words.id ASC";
		}	
			break;
		case "1":{
			querySort = "ORDER BY words.id DESC";
		}	
			break;
		case "2":{
			querySort = "ORDER BY words.value ASC";
		}	
			break;
		case "3":{
			querySort = "ORDER BY words.value DESC";
		}
			break;
		default:{
			indexSort = 0;
			querySort = "ORDER BY words.id ASC";
		}
			break;
	}
	pool.query("SELECT * FROM words WHERE words.user_id = '"+userId+"' " + querySort, function(err, data) {
	    if(err) return console.log(err);
	    else{
	  		res.render('index', { indexSort: indexSort, listItem: data});
	    }
    });
});

/* POST add item to database */
router.post('/', function(req, res, next){
	let userId = req.cookies.userId;
	let id = req.body.id;
	let value = req.body.value;
	if(!value){ 
		res.send(JSON.stringify({status: "error"}));
		console.log("Значение не задано");
	}
	else{
		if(!id){
			pool.query("INSERT INTO words (value, user_id) VALUES ('"+value+"', '"+userId+"')", function(err, data) {
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
			pool.query("INSERT INTO words (id, value, user_id) VALUES ('"+id+"', '"+value+"''"+userId+"')", function(err, data) {
			    if(err){ 
			    	res.send(JSON.stringify({status: "error"}));
			    	console.log(err);
			    }
			    else{
			    	res.send(JSON.stringify({status: "ok"}));
			    }
		    });
		}
	}
});

/* POST edit item to database */
router.post('/:id', function(req, res, next){
	let id = req.params.id;
	let value = req.body.value;
	let userId = req.cookies.userId;
	pool.query("SELECT * FROM words WHERE words.id = "+id, function(err, data) {
	    if(err) return console.log(err);
	    else{
	  		if(data[0].user_id != parseInt(userId)){ 
	  			res.send(JSON.stringify({status: "error"}));
	  		}
	  		else{
	  			if(!value){ 
					res.send(JSON.stringify({status: "error"}));
					console.log("Значение не задано");
				}
				else{
						pool.query("UPDATE words SET value = '"+value+"' WHERE words.id = "+id, function(err, data) {
						    if(err){ 
						    	res.send(JSON.stringify({status: "error"}));
						    	console.log(err);
						    }
						    else{
						    	res.send(JSON.stringify({status: "ok"}));
						    }
					    });
				}
	  		}
	    }
    });
});

/* POST delete item to database */
router.post('/delete/:id', function(req, res, next){
	let id = req.params.id;
	let userId = req.cookies.userId;
	pool.query("SELECT * FROM words WHERE words.id = "+id, function(err, data) {
	    if(err) return console.log(err);
	    else{
	  		if(data[0].user_id != parseInt(userId)){ 
	  			res.send(JSON.stringify({status: "error"}));
	  		}
	  		else{
	  			pool.query("DELETE FROM words WHERE words.id = "+id, function(err, data) {
				    if(err){ 
				    	res.send(JSON.stringify({status: "error"}));
				    	console.log(err);
				    }
				    else{
				    	res.send(JSON.stringify({status: "ok"}));
				    }
		    	});
	  		}
	    }
    });
});

/* POST get login by id user */
router.post('/user/get', function(req, res, next){
	let id = req.body.id;
	console.log(id);
	pool.query("SELECT * FROM users WHERE users.id = "+id, function(err, data) {
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
	pool.query("INSERT INTO users (login, password) VALUES ('"+login+"', '"+password+"');", function(err, data){
	    if(err){ 
	    	res.send(JSON.stringify({status: "error"}));
	    	console.log(err);
	    }
	    else{
	    	res.send(JSON.stringify({status: "ok", id: data.insertId}));	
	    	
	    }
    });
});

/* POST valid user to database */
router.post('/user/valid', function(req, res, next){
	let login = req.body.login;
	let password = req.body.password;
	pool.query("SELECT id, login, password FROM users WHERE users.login = '"+login+"'", function(err, data) {
	    if(err){ 
	    	res.send(JSON.stringify({status: "error"}));
	    	console.log(err);
	    }
	    else{
	    	if(data.length == 1 && data[0].password == password){
	    		res.send(JSON.stringify({status: "ok", id: data[0].id}));
	    	}
	    	else{
	    		res.send(JSON.stringify({status: "error"}));
	    	}
	    }
    });
});


module.exports = router;
