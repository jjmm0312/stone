//conmunication rule
var r = "R";
var a = "A";
var none = "";
var end = "\r\n";
var find = "R00";

var to = r + '/' + find + '/' + none + '/' + none + '/' + end;

//set API
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SerialPort = require('serialport'),
	portName = '/dev/ttyAMA0',
	Serial = new SerialPort(portName);
var delay = require('delay');

//send index.html
app.get('/', function(req, res){
	res.sendFile(__dirname +'/index.html')
});


//소켓 연결
io.on('connection',function(socket){
	console.log('a user connected'); 
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	
	//'find' listener
	socket.on('find', function(){
		
		//serial open
		Serial.on('open', function(){
			Serial.on('data', function(){
			//신호 전송
			Serial.write(to);
			//신호가 회신될때 까지 대기(임의의 시간) ms 단위
			delay(1000);
			
			//회신 정보 처리
			var result = data.toString();
			var splitLine = result.splite('\r\n');
			
				for(var i =0; i< spliteLine.length; i++){
					var statement = spliteLine[i].splite('/');
					if(statement.length == 5){
						var sendMessage ={'ID' : statement[3]};
						io.emit('message', sendMessage);
						
					}	
				}

			});	
						
								
		});
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});



