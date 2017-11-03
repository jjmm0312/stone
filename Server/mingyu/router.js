var express = require('express');
var router = express.Router();
var url = require('url');

// body parser
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());


router.get('/', function(req,res){
		
	
		//receive the request by GET
		var urlParse = url.parse(req.url, true);
		var queryString = urlParse.query;

		var mode = queryString.mode;

		if(mode == 'onoff' && serialState==0)
		{	
		//	sendMessage.ID = queryString.id;
		//	sendMessage.state = queryString.state;
		//	sendMessage.type = queryString.type;
			res.sendFile(__dirname + '/index.html');
		}
		else if(mode == 'onoff' && serialState==1){
			res.sendFile(__dirname+"/index.html");	

		} if(mode == 'find'){
			res.sendFile(__dirname +  "/find.html");
		}
	});


module.exports = router;
