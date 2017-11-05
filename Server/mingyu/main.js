var express = require('express');
var app = express();
var http = require('http').Server(app);
var serial = require('./serial.js');

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


// router setting
var router = require('./router.js');
app.use('/', router);
http.listen(4000, function(){
		console.log('listening on *:4000');
	}
);

// serial reading part
const NumberCmdToken   = 6;
const IndexPrefix      = 0;
const IndexFromId    = 1;
const IndexResCmd = 2;
const IndexAppendix    = 3;
const IndexReqCmd  = 4;

const CmdRaspPrefix = 'R';
const CmdArduPrefix = 'A';

const CmdRaspRegister = 'R00';
const CmdRaspOff = 'A00';
const CmdRaspOn = 'A01';
const CmdRaspSendSignal = 'C00';
const CmdRaspChangeMode = 'C01';
const CmdArduSendId = 'A00';
const CmdArduSendStatus = 'A01';
const CmdArduSendResult = 'B00';

const PrefixRemote = 'R';
const PrefixButton = 'B';
const PrefixSwitch = 'S';

var data = {};
var readFromSerial = function(data){
		console.log('read from hc11, ', data);
		var splitedData = data.toString().split('/');
		if (splitedData.length != NumberCmdToken){
			console.log('data has few arguments...');
			return;
		}

		var prefix = splitedData[IndexPrefix];
		var fromId = splitedData[IndexFromId];
		var resCmd = splitedData[IndexResCmd];
		var append = splitedData[IndexAppendix];
		var reqCmd = splitedData[IndexReqCmd];
		console.log(
			'Received Data\'s... \n' + 
			'Prefix : ' + prefix + '\n' + 
			'From   : ' + fromId + '\n' + 
			'ResCmd : ' + resCmd + '\n' + 
			'Append : ' + append + '\n' + 
			'ReqCmd : ' + reqCmd + '\n' 
		);

		if (prefix == CmdArduPrefix){ // rasp only process data from arduino
			if (reqCmd in socketTable){
				if(reqCmd == CmdRaspRegister){ // if the data from arduino is result of register command
					console.log('result of Register command is comming');
					socketTable[reqCmd].forEach(function(socket){
						var sendData = {};
						sendData.id = fromId.toString();
						if (fromId.charAt(0) == PrefixRemote){
							sendData.type = '리모콘';
						}
						else if (fromId.charAt(0) == PrefixButton){
							sendData.type = '버튼';
						}
						else if (fromId.charAt(0) == PrefixSwitch){
							sendData.type = '스위치';
						}
						else {
							sendData.type = 'Unknown';
						}
						socket.emit('message', JSON.stringify(sendData));
						console.log('thus send ' + JSON.stringify(sendData));
					});
				}
				else { // data from another command
					var arr = socketTable[reqCmd];
					if (arr && arr.length > 0){
						console.log('result of ' + reqCmd + ' command is comming');
						var sendData = {};
						sendData.target_id = fromId;
						arr[0].emit('message', JSON.stringify(sendData)); // socket queue. fifo
						removeSocket(reqCmd, arr[0]);

						// mysql part
						if (reqCmd == 'C00'){
							//do nothing...	
						}
						else {
							connection.query('USE ' + DATABASE + ';', console.log);
							var queryString = 
								'UPDATE `' + DATABASE + '`.`device` ' +
								'SET `state` = \'' + append + '\' ' +
								'WHERE `device`.`id` = \'' + fromId + '\';' ;
							var query = connection.query(queryString, function(err, rows){
								if (err){
									console.log('MySQL : ', err);
								}
							});
						}
					}
				}
			}
		}
}

//serial.dataEvent(readDataFromSerial);
serial.parser.on('data', readFromSerial);
//serial.parser.on('data', console.log);



// socket connection part
var io = require('socket.io')(http);
var reqCmdList = [
					'R00', // cmd to get device id 
					'A01', // cmd to turn on switch/button
					'A00', // cmd to turn off switch/button
					'B00',
					'C00',
					'C01'
				];
var socketTable = {};

function addSocket(command, socket){
	if (reqCmdList.indexOf(command) > -1){ // if reqCmdList has command of data
		if (command in socketTable){ // if key of command already exist
			var newNum = socketTable[command].push(socket);
			console.log('(old)socket added in ' + command + ' new size : ' + newNum);
		}
		else { // if command (key) not exist
			var newArr = new Array();
			var newNum = newArr.push(socket);
			console.log('(new)socket added in ' + command + ' new size : ' + newNum);
			socketTable[command] = newArr;
		}
		return true;
	}
	return false;
}
function removeSocket(key, socket){
	var socketArr = socketTable[key];
	for (var index = 0; index < socketArr.length; index++){
		if (socket.id == socketArr[index].id){
			if (socketArr.length > 1){
				socketArr.splice(index, 1);
				console.log('from ' + key + ' cmd remove a socket. size ' + socketTable[key].length);
			}
			else {
				socketArr.pop();
				console.log('from ' + key + ' cmd remove a socket. size ' + socketTable[key].length);
			}
			return;
		}
	}
}

function closeSocket(msg, socket){
	socket.emit('message', JSON.stringify({status:msg}));
	removeSocket(socket);
}

function removeSocket(socket){
	Object.keys(socketTable).forEach(function(key){
		var socketArr = socketTable[key];
	for (var index = 0; index < socketArr.length; index++){
		if (socket.id == socketArr[index].id){
			if (socketArr.length > 1){
				socketArr.splice(index, 1);
				console.log('from ' + key + ' cmd remove a socket. size ' + socketTable[key].length);
			}
			else {
				socketArr.pop();
				console.log('from ' + key + ' cmd remove a socket. size ' + socketTable[key].length);
			}
			return;
		}
	}

	});
}



io.on('connection', function(socket){
		console.log('Socket is connected', socket.id);
		socket.on('message', function(msg){
				// register socket on socket table
				// read from serial and process i
				console.log('user send ', msg);
				try{
					var msgObj = JSON.parse(msg);
					var command = msgObj.cmd;
					var target = msgObj.target;
					if (command){ // if command exist
						console.log('socket added : ' + addSocket(command, socket));
						if (command == CmdRaspRegister){ // if socket is for register, then remove it after 5sec
							setTimeout(closeSocket, 5000, 'time_end', socket);
						}
						else { // set time_out
							setTimeout(closeSocket, 3000, 'time_out', socket);
						}
						// send command using serial
						var sendMsg = CmdRaspPrefix + '/' + target + '/' + command + '///\\r\\n\r\n';  
						serial.write(sendMsg);
						console.log('server send to serial ', sendMsg);

					}
				}
				catch (SyntaxError){ // if it is not json format
					if (msg == 'socket_end'){ // if socket send end message
						console.log('receive socket_end message. so remove socket');
						removeSocket(socket);
					}
				}
		});
		
		socket.on('disconnect', function(){
			console.log('socket is disconnected');
			// if socket is registered, then unregister it!
			
			//* Method of copy is very important
			removeSocket(socket);
		});

});
