var express = require('express');
var app = express();
var http = require('http').Server(app);
var serial = require('./serial.js');

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
	if (command){ // if command exist
		if (reqCmdList.indexOf(command) > -1){ // if reqCmdList has command of data
			if (command in socketTable){ // if key of command already exist
				var newNum = socketTable[command].push(socket);
				console.log('(old)socket added in ' + command + ' new size : ' + newNum);
			}
			else { // if command (key) not exist
				var newArr = new Array();
				var newNum = newArr.push(command);
				console.log('(new)socket added in ' + command + ' new size : ' + newNum);
				socketTable[command] = newArr;
			}
			return true;
		}
	}
	return false;
}

io.on('connection', function(socket){
		console.log('Socket is connected');
		socket.on('message', function(msg){
				// register socket on socket table
				// read from serial and process i
				console.log('user send ', msg);
				var msgObj = JSON.parse(msg);
				var command = msgObj.cmd;
				console.log('socket added : ' + addSocket(command, socket));
		});
		
		socket.on('disconnect', function(){
			console.log('socket is disconnected');
			// if socket is registered, then unregister it!
			/* not working... uu 
			
			* Method of copy is very important

			Object.keys(socketTable).forEach(function(key){
					console.log('key is ' + key);
					socketArr = socketTable[key];
					console.log('arr size (before remove) is ' + socketArr.length);
					var index = socketArr.indexOf(socket);
					console.log('index is ' + index);
					if (index > -1){
						socketArr.slice(index, 1);
						console.log('socket is removed. (after remove) size' + socketArr.length);
						return;
					}
			});
			*/
			Object.keys(socketTable).forEach(function(key){
				for (var index = 0; index < socketArr.length; index++){
					if (socket == socketArr[index]){
						var newArr = socketArr.slice(index, 1);
						socketTable[key] = newArr;
					}
				}
			});
		});

});
