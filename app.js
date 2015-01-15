var express = require('express'),
    fs = require('fs'),
    SerialPort = require('serialport').SerialPort,
    port = '/dev/tty.usbmodem1411',
    webport = (process.env.NODE_ENV == 'production') ? process.env.PORT : 8000,
    serial = null,
    interval = null,
    lightOn = false,
    app = express(),
    turnOn = (function(_this){
      return function(){
        lightOn = true;
        return serial.write(new Buffer([0x01]));
      };
    })(this),
    turnOff = (function(_this){
      return function(){
        lightOn = false;
        return serial.write(new Buffer([0x00]));
      };
    })(this),
    toggle = (function(_this){
      return function(){
        if(lightOn){
          return turnOff();
        } else {
          return turnOn();
        }
      };
    })(this);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  return res.sendFile(__dirname + '/public/index.html');
});

app.get('/on', function(req, res){
  clearInterval(interval);
  turnOn();
  return res.end();
});

app.get('/off', function(req, res){
  clearInterval(interval);
  turnOff();
  return res.end();
});

fs.stat(port, function(err, stats){
  if(err !== null){
    console.log("Couldn't stat " + port);
    process.exit();
  } else {
    console.log('Successfully started');
    serial = new SerialPort(port, { baudrate: 9600 });
    return app.listen(webport);
  }
});
