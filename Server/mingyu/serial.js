var portName = '/dev/ttyAMA0';

var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;

var port = new SerialPort(portName, {
	baudRate: 9600	
});
var parser = new Readline();
port.pipe(parser);

port.open(function (err){
		if (err){
			return console.log('Error opening port:', err.message);
		}
	}
);

port.on('open', function(){
		console.log('callback: open');
		console.log('send test code');
		port.write("R/Z9999/R00//\\r\\n", function(err){console.log(err.message)});
	}
);

port.on('error', function(err){
		console.log('Error ', err.message);
	}
);

port.on('close', function(err){
		console.log('Close Error ', err.message);
	}
);

exports.parser = parser;

/*
exports.dataEvent = function(callback){
	parser.on('data', callback{
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
	);
}*/
