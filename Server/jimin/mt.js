var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
var port = new SerialPort('/dev/ttyAMA0', {
	baudRate: 9600
	});

var parser = new Readline();
port.pipe(parser);


port.on('open', function(){
	console.log('serial port is opened');
	for(var i  = 0; i< 100000; i++){

		port.write('kia');
	//	port.write('1');
		console.log(i);
	}

});

parser.on('data', function(data){
	console.log('Data:', data);
	if(Number(data) ==1){
		port.write('0');
		console.log('0');
	}else{
		port.write('1');
		console.log('1');
	}

});

port.on('error', function(err){
	console.log(err);
});


