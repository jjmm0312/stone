var SerialPort = require('serialport'),
	portName = '/dev/ttyAMA0',
	serial  = new SerialPort(portName),
	sensorVal = 0;
serial.on('open',function(){
	console.log('ok');
	serial.write('ok',function(err){});
	console.log('send');
	serial.on('data',function(data){
		console.log('serial');
	});
});
