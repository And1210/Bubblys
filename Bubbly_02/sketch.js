const WIDTH = 512;
const HEIGHT = 512;

const NAME = "CLICK";
const TITLE_SIZE = 100;
const BODY_SIZE = 20;

let interval;
let canClick = true;

let font;
let message;

let nameOrigPoints;
let namePoints = [];
let messageOrigPoints = [];
let messagePoints = [];

let x = 0, y = 0;
let nameWidth = 0, nameHeight = 0;

let lights = [];

function preload() {
  font = loadFont('./LemonMilkRegular-X3XE2.otf');
  message = loadStrings('./message.txt');
}

function setup() {
  createCanvas(WIDTH, HEIGHT);

  nameOrigPoints = font.textToPoints(NAME, 0, 0, TITLE_SIZE,  {
    sampleFactor: 1,
    simplifyThreshold: 0
  });
  let count = 0;
  for (let line of message) {
    messageOrigPoints.push(font.textToPoints(line, 0, ((BODY_SIZE + 10)*(count+1) % (HEIGHT-BODY_SIZE)), BODY_SIZE, {
      sampleFactor: 0.5,
      simplifyThreshold: 0
    }));
    count++;
  }

  let bounds = getPointBounds(nameOrigPoints);
  x = WIDTH/2 - bounds.x/2;
  y = HEIGHT/2 + bounds.y/2;

  for (let p of nameOrigPoints) {
    let pos = createVector(x + p.x, y + p.y);
    namePoints.push(pos);
  }
  for (let line of messageOrigPoints) {
    let linePoints = []
    for (let p of line) {
      linePoints.push(createVector(p.x, p.y));
    }
    messagePoints.push(linePoints);
  }

  let targets = [];
  for (let j = 0; j < namePoints.length; j++) {
    targets.push([namePoints[j]]);
  }
  let light = 0;
  let i = 0;
  while (i < messagePoints.length) {
    let j = 0;
    while (j < messagePoints[i].length) {
      targets[light].push(messagePoints[i][j]);
      light = (light + 1) % namePoints.length;
      j++;
    }
    i++;
  }

  count = 0;
  for (let p of namePoints) {
    lights.push(new Light(p.x, p.y, color(255*count/targets.length, 255*(1-count/targets.length), 255), 0, targets[count]));
    count++;
  }

  // interval = setInterval(function() {
  //   updateLightTargets();
  //   moveLights();
  // }, 5000);
  setInterval(function () { canClick = true; }, 5000);
}

function draw() {
  background(0, 50);

  for (let light of lights) {
    light.draw();
    light.update();
  }
}

function mousePressed() {
  if (canClick) {
    updateLightTargets();
    moveLights();
    canClick = false;
  }
}

function getPointBounds(points) {
  let minX = WIDTH, maxX = 0;
  let minY = HEIGHT, maxY = 0;
  for (let p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return createVector(maxX - minX, maxY - minY);
}

function moveLights() {
  for (let light of lights) {
    light.setMoving(true);
  }
}

function updateLightTargets() {
  for (let light of lights) {
    light.updateTarget();
  }
}
