const WIDTH = 512;
const HEIGHT = 512;

const N = 50;

let envPos;
let lights = [];

function setup() {
  createCanvas(WIDTH, HEIGHT);

  envPos = createVector(WIDTH/2, HEIGHT/2);

  for (let i = 0; i < N; i++) {
    let angle = TWO_PI * i/N;
    let r = (0.2 + 0.7*random())*min(WIDTH/2, HEIGHT/2);
    lights.push(new Light(r*cos(angle), r*sin(angle), 10*random(), envPos));

    // let vel = p5.Vector.random2D();
    // vel.set(vel.x * 2*floor(2*random())-1, vel.y * 2*floor(2*random())-1);
    // vel.mult(0.5);
    // vel.add(0.5, 0.5);
    let vel = p5.Vector.random2D();
    vel.mult(1/sqrt(2));
    vel.add(1-1/sqrt(2), 1-1/sqrt(2));
    vel.mult(25);
    lights[i].setVel(vel);
  }

  background(0);
}

function draw() {
  background(0, 0.1);

  for (let light of lights) {
    light.update(lights);
    light.draw();

    // let distForce = p5.Vector.sub(light.pos, createVector(0, 0));
    // distForce.normalize();
    // distForce.mult(0.01);
    // light.applyForce(distForce);
  }
}

class Light extends Entity {
  constructor(x, y, m, envPos) {
    super(x, y, m);

    this.r = sqrt(m)*5;
    this.envPos = envPos;
  }

  draw() {
    noStroke();
    fill(255*((this.pos.x+this.envPos.x)/WIDTH), 255*((this.pos.y+this.envPos.y)/HEIGHT), 255);
    circle(this.envPos.x + this.pos.x, this.envPos.y + this.pos.y, 2*this.r);
  }

  update(lights) {
    super.update();
    this.checkBounce();

    for (let light of lights) {
      if (light !== this) {
        let g = super.gravityForce(light);
        super.applyForce(g);
      }
    }
  }

  checkBounce() {
    let r = this.r;
    if (this.envPos.x + this.pos.x + r >= WIDTH) { this.vel.set(this.vel.x * -1, this.vel.y); }
    if (this.envPos.x + this.pos.x - r < 0) { this.vel.set(this.vel.x * -1, this.vel.y); }
    if (this.envPos.y + this.pos.y + r >= HEIGHT) { this.vel.set(this.vel.x, this.vel.y * -1); }
    if (this.envPos.y + this.pos.y - r < 0) { this.vel.set(this.vel.x, this.vel.y * -1); }
  }

  setEnvPos(envPos) {
    this.envPos = envPos;
  }
}

// function drawNoise() {
//   noStroke();
//   let xoff = 0;
//   for (let x = 0; x < WIDTH; x++) {
//     let yoff = 0;
//     for (let y = 0; y < HEIGHT; y++) {
//       fill(255, map(noise(xoff, yoff), 0, 1, 0, 255));
//       circle(x, y, 1);
//       yoff += 0.01;
//     }
//     xoff += 0.01;
//   }
// }
