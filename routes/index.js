var express = require('express');
var mysql = require("mysql2");
var router = express.Router();

// create pool connect to database
var pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  database: "test",
  user: "root",
  password: "t3alert00"
});

/* GET home page. */
router.get('/', function(req, res, next) {
	pool.query("SELECT * FROM words", function(err, data) {
	    if(err) return console.log(err);
	    else{
	    	let indexSort = req.query.sort;
			if(indexSort < 0 || indexSort > 3 || !indexSort) indexSort = 0;
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
