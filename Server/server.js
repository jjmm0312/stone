// server part

// communication rule
var r = "0x52";
var a = "0x41";
var none = "0xFF";
var on = "0x01";
var off = "0x00";
var end = "0xFF";

var to = none+none+none+none+none;   // from server to arduino
var from = none+none+none+none+none; // from arduino to server

// information for request 
var sendMessage = {
		'mode':'none',
		'type':'none',
		'ID':'',
		'state':''
}

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql')
	, DATABASE = 'mango'
	, TABLE = 'test'
	, connection = mysql.createConnection({
		port:3306,
		host : 'localhost',
		user : 'root'
		, password : 'jjmm0312' // server : mango
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
							to = r + '/' + '0x02' + '/' + none + '/' + sendMessage.ID + '/' + none;
							from = a + '/'+'0x02'+'/'+off+'/'+sendMessage.ID+'/'+none;
						}
					else // on signal
						{
							to = r + '/' + '0x02' + '/' + none + '/' + sendMessage.ID + '/' + none;
							from = a + '/'+'0x02'+'/'+on+'/'+sendMessage.ID+'/'+none;
						}
					}
				// remote controller
				else 
					{
						if(sendMessage.state=='0') // copy signal
						{
							to = r + '/' + '0x05' + '/' + none + '/' + sendMessage.ID + '/' + none;
							from = a + '/'+'0x04'+'/'+on+'/'+sendMessage.ID+'/'+none;
						}
						else // send signal
						{
							to = r + '/' + '0x04' + '/' + none + '/' + sendMessage.ID + '/' + none;
							from = a + '/'+'0x04'+'/'+on+'/'+sendMessage.ID+'/'+none;
						}
					}
				
				//////////////// wait arduino send message part(to)
				
				//////////////// if okay message arrive(from)
				
				// send to client okay message
				io.emit('message', sendMessage);
				
				// mysql upload
				connection.connect();
				connection.query('USE ' + DATABASE);
				var query = connection.query('UPDATE test SET state=\'' + msg.state + '\' WHERE id='+msg.ID, function(err, rows){
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