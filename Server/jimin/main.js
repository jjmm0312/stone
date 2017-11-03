var express = require('express');
var app = express();
var http = require('http').Server(app);
var serial = require('./serial.js');


// serial reading part
const NumberCmdToken   = 6;
const IndexPrefix      = 0;
const IndexFromId    = 1;
const IndexResCmd = 2;
const IndexAppendix    = 3;
const IndexReqCmd  = 4;

var data = {};
var readDataFromSerial = function(data){
		console.log('read from hc11, ', data);
		var splitedData = data.split('/');
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

serial.dataEvent(readDataFromSerial);


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


io.on('connection', function(socket){
		console.log('Socket is connected');
		console.log('Socket... ', socket);
		socket.on('message', function(msg){
				// register socket on socket table
				// read from serial and process it
			}
		);
				

	}
);
