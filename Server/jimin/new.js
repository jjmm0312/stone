var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyAMA0',{
	baudrate
	: 9600,
	
});

port.on('open',function(){
	port.write('1',function(err){
		if(err){
			return console.log('Error on write: ',err.message);
		}
		console.log(' 1 written');
	});
});

//open errors will be emitted as an error event
port.on('error',function(err){
	console.log('Error: ',err.message);
})

port.on('data', function(data){
	console.log('read and send Data : ' + data);
	port.write(data);
});

