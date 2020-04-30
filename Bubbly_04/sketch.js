/*
CREATED BY ANDREW FARLEY
*/

//Constants
const WIDTH = 512;
const HEIGHT = 512;
const N = 4;

//GLobal variables
let blobs = []
let cur = 0;

//Recording variables
let capturer = new CCapture({
  format: 'webm',
  framerate: 30,
  quality: 100,
  name: "Bubbly 04"
});;
let recording = false;
let p5Canvas;
let canvas;

function setup() {
  //p5 config
  p5Canvas = createCanvas(WIDTH, HEIGHT);
  colorMode(HSB);

  //Variable initialization
  for (let i = 0; i < N*360; i++) {
    blobs.push(new Blob(createVector(WIDTH/2, HEIGHT/2), color(i%360, 100, 100)));
  }
}

function draw() {
  background(0);

  //Circle (blob) draw and update
  for (let i = 0; i <= cur; i++) { //blobs need to be staggered
    let blob = blobs[i];
    blob.update();
  }
  for (let blob of blobs) {
    if (blob.getSize() < WIDTH*1.2) { //only draw what is actually on screen
      blob.draw();
    }
  }
  addColour(); //add next colour to draw

  //Recording
  if (recording) {
    if (cur == 100) {
      // startCap();
      capturer.start()
    }
    if (cur == 460) {
      capturer.stop();
      capturer.save();
      // stopCap();
      // saveCap();
      recording = false;
    }
    // updateCap();
  }
  capturer.capture(p5Canvas.canvas);
}

//Adds another colour to the queue through cur variable
function addColour() {
  cur++;
  if (cur >= blobs.length) { //reset all blobs if end is reached
    for (let blob of blobs) {
      blob.reset();
    }
    cur = 0;
  }

  //Move center of new circle around using perlin noise
  let offsetX = map(noise(cur/50), 0, 1, -100, 100);
  let offsetY = map(noise((cur+360)/50), 0, 1, -100, 100);
  blobs[cur].setPos(WIDTH/2 + offsetX, HEIGHT/2 + offsetY);
  blobs[cur].setSize(25);
}





//The circle to be rendered
class Blob {
  constructor(pos, c) {
    this.pos = pos;

    this.colour = c;
    this.r = 0;

    this.speed = 1;
  }

  draw() {
    noStroke();
    fill(this.colour);
    // noFill();
    // stroke(this.colour);
    circle(this.pos.x, this.pos.y, this.r*2);
  }

  update() {
    this.r += (this.r/10 + this.speed);
  }

  getSize() {
    return this.r;
  }

  setSize(r) {
    this.r = 0;
  }

  setPos(x, y) {
    this.pos.set(x, y);
  }

  reset() {
    this.r = 0;
  }
}
