/*
CREATED BY ANDREW FARLEY
A simple CCapture API to interface with p5.js more easily
*/

//The capture object, can be configured however needed according to
//CCapture documentation
let capturer = new CCapture({
  format: 'webm',
  framerate: 30,
  name: "Bubbly 04"
});

//Start the capture
function startCap() {
  capturer.start();
}

//To be called after every new frame
//Param:
//  canvas - The p5.js canvas object
function updateCap() {
  capturer.capture(document.getElementById('defaultCanvas0'));
}

//Stops the capture
function stopCap() {
  capturer.stop();
}

function saveCap() {
  capturer.save();
}
