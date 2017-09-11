// server part

// communication rule
var r = "R";
var a = "A";
var none = "";
var on = "1";
var off = "0";
var end = "\r\n";

var to = none+none+none+none+none;   // from server to arduino
var from = none+none+none+none+none; // from arduino to server

// information for request 
var sendMessage = {
		'mode':'none',
		'type':'none',
		'ID':'',
		'state':''
};

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql')
	, DATABASE = 'mango'
	, TABLE = 'device'
	, connection = mysql.createConnection({
		port:3306,
		host : 'localhost',
		user : 'root'
		, password : 'mango' 
	});


// send index.html
app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

	console.log('a user connected');
	socket.on('message', function(msg){
		console.log(msg);
		console.log(sendMessage);
		
		// if request is onoff mode
		if(msg.mode === 'onoff')
			{
				sendMessage.ID = msg.ID;
				sendMessage.state = msg.state;
				sendMessage.type = msg.type;
				
				console.log(sendMessage);
				
				// button, switch
				if(sendMessage.type != 'controller')
					{
					if(sendMessage.state=='0') // off signal
						{
							to = r + '/' + 'A00' + '/' + none + '/' + sendMessage.ID + '/' + none;
							from = a + '/'+'A01'+'/'+off+'/'+sendMessage.ID+'/'+none;
						}
					else // on signal
						{
							to = r + '/' + 'A11' + '/' + none + '/' + sendMessage.ID + '/' + none;
							from = a + '/'+'A01'+'/'+on+'/'+sendMessage.ID+'/'+none;
						}
					}
				// remote controller
				else 
					{
						if(sendMessage.state=='0') // copy signal
						{
							to = r + '/' + 'C01' + '/' + none + '/' + sendMessage.ID + '/' + none;
							from = a + '/'+'B00'+'/'+on+'/'+sendMessage.ID+'/'+none;
						}
						else // send signal
						{
							to = r + '/' + 'C00' + '/' + none + '/' + sendMessage.ID + '/' + none;
							from = a + '/'+'B00'+'/'+on+'/'+sendMessage.ID+'/'+none;
						}
					}

				// send signal to arduino
				
				var start = new Date().getTime();
				var end =0;
				var time=0;;
				
				var SerialPort = require('serialport'),
					portName = '/dev/ttyAMA0',
					Serial = new SerialPort(portName);
				
				Serial.on('open', function(){
					console.log('Serial Port OPEN');
					Serial.on('data', function(data){
						while(data.toString() != from || time != 5000){
							Serial.write(to);
							end = new Date().getTime();
							time = end-start;
						}
					});				
				});		
				
				if(time == 5000){
					sendMessage.state = 0; //fail
					}
				else
					{
						sendMessage.state = 1; // success
					}
				// send to client okay message
				io.emit('message', sendMessage);
				
				// mysql upload
				connection.connect();
				connection.query('USE ' + DATABASE);
				var query = connection.query('UPDATE device SET state=\'' + msg.state + '\' WHERE id='+msg.ID, function(err, rows){
					if(err) 
						{
						throw err;
						}
					else{
						console.log(rows);
						}
				});
				connection.end();				
			}
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});