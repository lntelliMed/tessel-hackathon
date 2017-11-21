// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This servo module demo turns the servo around
1/10 of its full rotation  every 500ms, then
resets it after 10 turns, reading out position
to the console at each movement.
*********************************************/


// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
Create a server that responds to every request by taking a picture and piping it directly to the browser.
*********************************************/

const fs = require('fs');
const path = require('path');
var av = require('tessel-av');
var os = require('os');
var http = require('http');
var port = 8000;
var camera = new av.Camera();

var tessel = require('tessel');
var servolib = require('servo-pca9685');

var servo = servolib.use(tessel.port['A']);

var servo1 = 1; // We have a servo plugged in at position 1

http.createServer((request, response) => {

  if (request.url === '/') {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<div><img src="/image"><h1>This is what we call MOTION ART!!</h1><script>setTimeout(function(){window.location="http://team14.local:8000/"}, 5000)</script></div>');
    response.end();
  } else if (request.url === '/image') {
    response.writeHead(200, { 'Content-Type': 'image/jpg' });
    camera.capture().pipe(response);
  }
  //
}).listen(port, () => console.log(`http://${os.hostname()}.local:${port}`));


servo.on('ready', function () {
  var position = 0;  //  Target position of the servo between 0 (min) and 1 (max).

  //  Set the minimum and maximum duty cycle for servo 1.
  //  If the servo doesn't move to its full extent or stalls out
  //  and gets hot, try tuning these values (0.05 and 0.12).
  //  Moving them towards each other = less movement range
  //  Moving them apart = more range, more likely to stall and burn out
  servo.configure(servo1, 0.05, 0.12, function () {
    setInterval(function () {
      console.log('Position (in range 0-1):', position);
      //  Set servo #1 to position pos.
      servo.move(servo1, position);


      // var client = http.createClient(8000, 'team14.local');
      // var request = client.request('GET', '/');

      // const capture = camera.capture();
      // capture.on('data', function (data) {
      //   fs.writeFile('/Users/sam/Desktop/tessel/tessel-code/pic.jpg', data, function(err){
      //     if(err){
      //       throw err;
      //     } else {
      //               // console.log(data)
      //     console.log("--------- took a pic!")
      //     }
      //   });

      // capture.on('data', function (data) {
      //   fs.writeFile(__dirname './pic.txt', data, function(err){
      //     console.log(err);
      //   });
      // });

      // http.get('http://team14.local:8000/', (resp) => {
      //   console.log('qqqqqqqqqq', resp);
      // })

      // capture.on('data', function (data) {
      //   console.log(__dirname)
      //   // fs.writeFile(path.join(__dirname, 'captures/captured-via-data-event.jpg'), data, function(err){
      //   //   console.log("----- " + err)
      //   // });

      //   fs.writeFile('~/Users/sam/Desktop/tessel/tessel-code/pic.jpg', data, function (err) {
      //     console.log("----- " + err)
      //   });


      //   // fs.writeFile('testfile1.txt', 'hellllllooooo', (err) => {
      //   //   console.log('errrrorrrr', err);
      //   // })

      // });

      // Increment by 10% (~18 deg for a normal servo)
      position += 0.1;
      if (position > 1) {
        position = 0; // Reset servo position
      }
    }, 250); // Every 500 milliseconds
  });
});






