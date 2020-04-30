const WIDTH = 512;
const HEIGHT = 512;
const N = 10; //Number of particles

let particles = [[], [], [], []];

function setup() {
  createCanvas(WIDTH, HEIGHT);

  for (let r = 30; r > 20; r -= 10) {
    for (let i = 0; i < N; i++) {
      let angle = TWO_PI * i/N;
      for (let j = 0; j < particles.length; j++) {
        particles[j].push(new Particle(createVector(WIDTH/2, HEIGHT/2), angle, r, color(255*i/N, 255*(1-i/N), 255)));
      }
    }
  }
}

function draw() {
  background(0, 10);

  let arr = -1;
  for (let pArray of particles) {
    arr += 1;
    let speed = 0;
    for (let p of pArray) {
      speed += 0.01;
      p.changeAngle(speed);
      if (arr % 4 == 0)
        p.changeRadius(sin(p.getAngle()));
      else if (arr % 4 == 1)
        p.changeRadius(cos(p.getAngle()));
      else if (arr % 4 == 2)
        p.changeRadius(sin(p.getAngle() + PI));
      else if (arr % 4 == 3)
        p.changeRadius(cos(p.getAngle() + PI));
      p.update();
      p.draw();
    }
  }
}

class Particle {
  constructor(pos, angle, radius, colour) {
    this.origPos = pos;
    this.pos = createVector(pos.x, pos.y);
    this.a = angle;
    this.r = radius;
    this.colour = colour;
  }

  update() {
    this.pos.set(this.origPos.x + this.r*cos(this.a), this.origPos.y + this.r*sin(this.a));
  }

  draw() {
    noStroke();
    fill(this.colour);
    circle(this.pos.x, this.pos.y, 10);
  }

  changeAngle(dA) { this.a += dA; }
  setAngle(a) { this.a = a; }
  getAngle() { return this.a; }

  changeRadius(dR) { this.r += dR; }
  setRadius(r) { this.r = r; }
  getRadius() { return this.r; }
}
