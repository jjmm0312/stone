var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');

// my sql setting
var mysql = require('mysql')
	, DATABASE = 'mango'
	, TABLE = 'device'
	, connection = mysql.createConnection({
		port: 3306,
		host: 'localhost',
		user: 'root',
		password: 'mango'
	});
connection.connect(function(err){
	if (err){
		console.log('Can not Connect to MySQL', err);
	}
	else {
		console.log('MySQL Connect!');
	}
});


// body parser
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

const onoffFileName = './index.html';
var onoffFileString = '';
fs.readFile( onoffFileName, 'utf8', function(err, data){
	onoffFileString = data;
});


router.get('/', function(req,res){
		
	
		//receive the request by GET
		var urlParse = url.parse(req.url.replace('mango?',''), true);
		var queryString = urlParse.query;

		var mode = queryString.mode;
		console.log(queryString);
		if(mode == 'onoff'){	
			//res.sendFile(__dirname + '/index.html');
			// for socket communication, change string in index.html to command, id.
			var id = queryString.id;
			var state = queryString.state;
			var type = queryString.type;
			console.log(mode + ',' +id + ',' + state + ',' + type);
			var command = '';
			if (id.charAt(0) == 'R'){ // remote controller
				if (state == 0){ // copy
					command = 'C01';
				}
				else if (state == 1){ // send signal
					command = 'C00';
				}	
			}
			else if (id.charAt(0) == 'B' || id.charAt(0) == 'S'){ // button and switch
				if (state == 0){ // off
					command = 'A00';
				}
				else if (state == 1){ // on
					command = 'A11';
				}
			}
		   	var sendStr = (onoffFileString.replace('#command', command).replace('#target_id', id));
			res.send(sendStr);
		}
		else if(mode == 'find'){
			res.sendFile(__dirname +  "/find.html");
		}
});

router.post('/', function(req, res){
		// sql save

	var urlParse = url.parse(req.url, true);
	var queryString = urlParse.query;

	var mode = queryString.mode;
	console.log('req.url ' + req.url);
	console.log('req.mode ' + mode);
	console.log('1');
	console.log(req.body);
	// if post to /mango?mode=save
	if (mode == 'save'){
		console.log('2');
		console.log(req.body.type);
		connection.query('USE ' + DATABASE,function(err){
			if(err){
				console.log('err');
			}else{
				console.log('not err');
		}});
		
		var type = 0;
		if (req.body.type == '버튼'){
			type = 0;
		}
		else if (req.body.type == '스위치'){
			type = 1;
		}
		else if (req.body.type == '리모콘'){
			type = 2;
		}
		var insert =
		'INSERT INTO `'+ DATABASE + '`.`' + TABLE + '` ' +
		 '(`id`, `type`, `name`, `description`, `created`, `state`) ' +
		'VALUES (\''+ req.body.id +'\', \''+ type + '\', \'' +'edit\', \'' + req.body.memo + '\', NULL, \'-1\');';
		console.log(insert);
		connection.query(insert,function (err){
				if(err){
					var to = {id : req.body.id, msg: 'fail'};
					console.log(err);
					
				}else{
					var to = {id : req.body.id, msg: 'success'};
				}	
				res.send(to);
		});
	}
});


module.exports = router;
