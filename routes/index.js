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
	console.log(querySort);
	pool.query("SELECT * FROM words " + querySort, function(err, data) {
	    if(err) return console.log(err);
	    else{
	    	console.log(indexSort);
	    	console.log(data);
	  		res.render('index', { indexSort: indexSort, listItem: data});
	    }
     });
});

/* POST add item to database */
router.post('/', function(req, res, next){
	let id = req.body.id;
	let value = req.body.value;
	if(!value){ 
		res.send(JSON.stringify({status: "error"}));
		console.log("Значение не задано");
	}
	else{
		if(!id){
			pool.query("INSERT INTO words (value) VALUES ('"+value+"')", function(err, data) {
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
			pool.query("INSERT INTO words (id, value) VALUES ('"+id+"', '"+value+"')", function(err, data) {
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
});

/* POST delete item to database */
router.post('/delete/:id', function(req, res, next){
	let id = req.params.id;
	pool.query("DELETE FROM words WHERE words.id = "+id, function(err, data) {
	    if(err){ 
	    	res.send(JSON.stringify({status: "error"}));
	    	console.log(err);
	    }
	    else{
	    	res.send(JSON.stringify({status: "ok"}));
	    }
    });
});

module.exports = router;
