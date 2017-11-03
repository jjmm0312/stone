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
var deviceFind = r + '/' + find


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


// send index.html and receive the request

app.get('/', function(req,res){
		
	
		//receive the request by GET
		var urlParse = url.parse(req.url, true);
		var queryString = urlParse.query;

		sendMessage.mode = queryString.mode;

		if(sendMessage.mode == 'onoff' && serialState==0){
			sendMessage.ID = queryString.id;
			sendMessage.state = queryString.state;
			sendMessage.type = queryString.type;
			res.sendFile(__dirname + '/index.html');
		}
		else if(sendMessage.mode == 'onoff' && serialState==1){
			io.on('connection',function(socket){
			io.emit('message', 'wait');
			res.sendFile(__dirname + '/index.html');

			});
		}else if(sendMessage.mode == 'find'){
			res.sendFile(__dirname +  "/find.html");
		}
	});

// WebSocket on

io.on('connection', function(socket){
		console.log('a user connected');
		console.log('sendMessage : '+ sendMessage.state);
	
		// if request is onoff mode
	
		if(sendMessage.mode === 'onoff')
		{	
			console.log('we send : ' + sendMessage.ID);
			console.log(sendMessage.type);				
			// button, switch
			if(sendMessage.type != '2')
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
			serial = new SerialPort(portName);

			serial.on('open', function(){
				console.log('Serial Port OPEN');
				serial.write('write ok', function(err){}); //send test message
				serial.write(to, function(err){}); // send message
				serialState = 1; // we have to wait arduino respond
				
				Serial.on('data', function(data){
					// success
					if(data.toString() == from){  
						// mysql upload
						connection.connect();
						connection.query('USE ' + DATABASE);
						var query = connection.query('UPDATE device SET state=\'' + sendMessage.state + '\' WHERE id='+sendMessage.ID, function(err, rows){
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
				}

				// fail
				else{
					io.emit('message', 'fail');
					serialState = 0; // now we can receive new request
				}
			});
		});	//serial end
			
	}else if(sendMessage.mode == 'find'){ 
		Serial.on('open',function(){
			console.log('Serial port open');
			serial.write(to, function(err){});
		});
		Serial.on('readable',function(){
			var info = port.read().split('/');
			var data = { 'type' : info[0], 'ID' : info[1] };
			var to = JSON.stringify(data);
			io.emit(to);  
		});
	}

});

http.listen(4000, function(){
		console.log('listening on *:3000');
}
);

