// server part

// communication rule
var r = "R";
var a = "A";
var none = "";
var on = "1";
var off = "0";
var find = "R00"
var end = "\\r\\n";


var serialState = 0; // case 1 : we wait the arduino respond
var to = none+none+none+none+none;   // from server to arduino
var from = none+none+none+none+none; // from arduino to server
var deviceFind = r + '/' + find + '/' + none + '/' + end;


// information for request 
var sendMessage = {
	'mode':'none',
	'type':'none',
	'ID':'',
	'state':''
};


var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var mysql = require('mysql')
, DATABASE = 'mango'
, TABLE = 'device'
, connection = mysql.createConnection({
port:3306,
host : 'localhost',
user : 'root'
, password : 'mango' 
});

// body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());




// send index.html and receive the request

app.post('/', function(req, res){
	
	// sql save

	var urlParse = url.parse(req.url, true);
	var queryString = urlParse.query;

	sendMessage.mode = queryString.mode;

	console.log('1');
	console.log(req.body);
	// if post to /mango?mode=save
	if (sendMessage.mode == 'save'){
		console.log('2');
		console.log(req.body.type);
		connection.connect();
		connection.query('USE ' + DATABASE,function(err){
			if(err){
				console.log('err');
			}else{
				console.log('not err');
		}});

		var insert = 'INSERT INTO `'+DATABASE +'`.`'+TABLE+'` (`id`, `type`, `name`, `description`, `created`, `state`) VALUES (\''+ req.body.id +'\', \''+ req.body.type + '\', \'' +'edit\', \'' + req.body.memo + '\', NULL, \'-1\')';
		console.log(insert);
		connection.query(insert,function (err){
				if(err){
					res.send('fail');
				}else{
					res.send('success');
				}

		});
	}

	});

app.get('/', function(req,res){
		
	
		//receive the request by GET
		var urlParse = url.parse(req.url, true);
		var queryString = urlParse.query;

		sendMessage.mode = queryString.mode;

		if(sendMessage.mode == 'onoff' && serialState==0)
		{	
			io.on('connection', function(socket){
				io.emit('message','ok');
			});
			sendMessage.ID = queryString.id;
			sendMessage.state = queryString.state;
			sendMessage.type = queryString.type;
			res.sendFile(__dirname + '/index.html');
		}
		else if(sendMessage.mode == 'onoff' && serialState==1){
			res.sendFile(__dirname+"/index.html");	
			io.on('connection',function(socket){
			io.emit('message', 'wait');

			});
		} if(sendMessage.mode == 'find'){
			res.sendFile(__dirname +  "/find.html");
		}
	});

// WebSocket

io.on('connection', function(socket){
		console.log('a user connected');
		console.log('sendMessage : '+ sendMessage.state);
	
	
		if(sendMessage.mode == 'onoff')
		{	
			console.log('we send : ' + sendMessage.ID);
			console.log(sendMessage.type);				
			// button, switch
			if(sendMessage.type != '2' && sendMessage.type !=' 3')
			{
				if(sendMessage.state=='0') // off signal
				{
					to = r + '/' + sendMessage.ID + '/' + 'A00'  + '/' + none + '/' + end;
					from = a + '/'+ sendMessage.ID +'/'+ 'A01' + '/' + off +'/'+ end;
				}
				else // on signal
				{
					console.log('state' + sendMessage);
					to = r + '/' + sendMessage.ID + '/' +  'A11' + '/' + none + '/' + end;
					from = a + '/'+ sendMessage.ID + '/'+ 'A01'+'/'+on+'/'+end;
					console.log('to'+ to);
					console.log('from'+from);
				}
			}
					
			// remote controller
			else
			{
				if(sendMessage.state=='0') // copy signal
				{
					to = r + '/'+sendMessage.ID + '/'  + 'C01' + '/' + none + '/' + end;
					from = a + '/'+sendMessage.ID + '/' + 'B00'+'/'+on+'/'+end;
				}
				else // send signal
				{
					console.log('state' + sendMessage);
					to = r + '/' + sendMessage.ID + '/'+ 'C00' + '/' + none + '/' + end;
					from = a + '/'+sendMessage.ID + '/' + 'B00'+'/'+on+'/'+end;
					console.log('to'+ to);
					console.log('from'+from);
				}
			}

		// send signal to arduino
		
		/*testcode
		var testStr = 'A/57/B00/1/'+end;
		if(testStr == from){
		
			console.log("here");
			io.emit('message', 'wait');
		}
		// 57 signal
		*/

		//Serial start	
		
	var SerialPort = require('serialport'),
	portName = '/dev/ttyAMA0',
	serial = new SerialPort(portName);// if request[MaÁ is onoff mode



			serial.on('open', function(){
				console.log('Serial Port OPEN');
				//serial.write('write ok', function(err){}); //send test message
				serial.write(to, function(err){}); // send message
				//serialState = 1; // we have to wait arduino respond
				

				serial.on('data', function(data){
					console.log('data');
					console.log(data.toString());
					// success
					if(data.toString() == from){  
						// mysql upload
						connection.connect();
						connection.query('USE ' + DATABASE);
						var query = connection.query('UPDATE device SET state=\'' + sendMessage.state + '\' WHERE id=\''+sendMessage.ID, function(err, rows){
						if(err){
							throw err;
						}
						else{
							console.log(rows);
						}
					});
					connection.end();	
	
					// send to client okay message
					io.emit('message', 'success');
					serialState = 0; // now we can receive new request
					serial.close();
				}

				// fail
				else{
					io.emit('message', 'fail');
					serialState = 0; // now we can receive new request
					serial.close();
				}
			});
		serialState = 0;
		
		});	//serial end
		
	}else if(sendMessage.mode == 'find'){ 
		
			
			serial.on('open',function(){
			console.log('Serial port open');
			serial.write(deviceFind, function(err){});
			/* 연습
			console.log('send data');
			var info = deviceFind.split('/');
			var data = { 'type' : info[0], 'ID' : info[1] };
			//var to = JSON.stringify(data);
			console.log(data);
			io.emit('message' , data);  
			*/


		});

				
		serial.on('data',function(data){
			console.log('data read');
			var info = data.split('/');
			var data = { 'type' : info[0], 'ID' : info[1] };
			var to = JSON.stringify(data);
			console.log(to);
			io.emit('message' , to);  
		});
	}

});

http.listen(4000, function(){
		console.log('listening on *:4000');
});

