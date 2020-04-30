const WIDTH = 650;
const HEIGHT = 650;
const N = 1000;
const R = 50;

let points = [];

let turnFraction = 0, turnFractionDelta = 0.00025;
let offset = 0;

function setup() {
  createCanvas(WIDTH, HEIGHT);

  noFill();
  stroke(255, 255, 255);
  strokeWeight(1);

  for (let i = 0; i < N; i++) {
    points.push(createVector(0, 0));
  }
}

function draw() {
  background(0);

  //turnFraction = 0.0478;//1.618;
  for (let i = 0; i < N; i++) {
    let dst = i / (N - 1);
    let angle = TWO_PI * turnFraction * i;
    dst = pow(dst, -0.5);

    let x = R * dst * cos(angle + offset);
    let y = R * dst * sin(angle + offset);

    points[i].set(x + WIDTH/2, y + WIDTH/2);
  }

  for (let i = 0; i < N-1; i++) {
    stroke(255, 255*(i/N), 255*(1-i/N));
    line(points[i].x, points[i].y, points[i+1].x, points[i+1].y);
  }

  // if (turnFraction > 0.03) {
  //   turnFraction = 0.03;
  //   turnFractionDelta *= -1;
  // } else if (turnFraction < 0) {
  //   turnFraction = 0;
  //   turnFractionDelta *= -1;
  // }

  turnFraction += turnFractionDelta;
  offset += 0.01;
}
