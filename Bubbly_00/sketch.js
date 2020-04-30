const WIDTH = 512;
const DOT_X = 11;
const DOT_Y = 17;
const SCALE = 20;

let colours = [];

let env;
let lights;

function setup() {
  createCanvas(WIDTH, WIDTH);

  env = new Environment(DOT_X, DOT_Y, SCALE, width/2, height/2);

  colours = [color(255, 255, 255), color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)];

  //Init lights
  lights = [];
  for (let i = 0; i < DOT_X-2; i++) {
    for (let k = 0; k < colours.length; k++) {
      let pos = env.getPosition(k, i);
      lights.push(new Light(pos, createVector(0.707, 0.707), 5, colours[k], env.getLimits(), env, 1+k/colours.length));
    }
  }
}

function draw() {
  background(0, 15);

  for (let light of lights) {
    for (let i = 0; i <  5; i++) {
      light.update();
      light.draw();
    }
  }
  // env.draw();
}



class Environment {
  constructor(width, height, scale, x, y) {
    this.w = width;
    this.h = height;
    this.scale = scale;
    this.dims = createVector((this.w-1)*this.scale, (this.h-1)*this.scale);
    this.pos = createVector(x - this.dims.x, y - this.dims.y/2);

    this.grid = [];
    this.n = this.initVerticies();
  }

  update() {

  }

  draw() {
    for (let row of this.grid) {
      for (let vertex of row) {
        vertex.draw(this.pos);
      }
    }
  }

  initVerticies() {
    let count = 0;
    let smaller = true;
    this.grid = [];
    for (let row = 0; row < this.h; row++) {
      let curRow = [];
      let adjustment = (smaller ? 1 : 0);
      for (let col = 0; col < this.w - adjustment; col++) {
        let offset = (col == 0) ? 0 : col;
        curRow.push(new Vertex(createVector(col + offset + adjustment, row), this.scale));
        count++;
      }
      smaller = !smaller;
      this.grid.push(curRow);
    }
    return count;
  }

  getPosition(row, col) {
    return this.grid[row][col].getPos(this.pos);
  }

  getLimits() { //[right, bottom, left, top]
    return [this.pos.x + this.dims.x*2, this.pos.y, this.pos.x, this.pos.y + this.dims.y];
  }

  checkDist(pos) {
    let nearest = null;
    for (let row of this.grid) {
      for (let vertex of row) {
        let vPos = vertex.getPos(this.pos);
        let distSq = pow((vPos.x-pos.x)/(this.dims.x*2), 2) + pow((vPos.y-pos.y)/(this.dims.y), 2);
        if (distSq < 0.0001) {
          nearest = vPos;
          break;
        }
      }
      if (nearest != null) break;
    }
    return nearest;
  }
}

class Vertex {
  constructor(pos, scale) {
    this.pos = pos;
    this.scale = scale;
  }

  getPos(envPos) {
    return createVector(envPos.x + this.pos.x * this.scale, envPos.y + this.pos.y * this.scale);
  }

  draw(envPos) {
    noStroke();
    fill(255, 255, 255);
    circle(envPos.x + this.pos.x * this.scale, envPos.y + this.pos.y * this.scale, 5);
  }
}

class Light {
  constructor(pos, vel, size, colour, limits, env, speed) {
    this.pos = pos;
    this.vel = vel;
    this.c = colour;
    this.r = size;
    this.limits = limits;
    this.env = env;

    this.speed = (speed==null) ? 2 : speed;
    this.vel = p5.Vector.mult(this.vel, this.speed);
  }

  update() {
    this.pos.add(this.vel);
    this.updateVel();
  }

  updateVel() {
    let change = false;
    if (this.pos.x > this.limits[0]){
      this.vel.set(-1*this.vel.x, this.vel.y);
      this.pos.set(this.limits[0], this.pos.y);
      change = true;
    }
    if (this.pos.x < this.limits[2]) {
      this.vel.set(-1*this.vel.x, this.vel.y);
      this.pos.set(this.limits[2], this.pos.y);
      change = true;
    }
    if (this.pos.y > this.limits[3]) {
      this.vel.set(this.vel.x, -1*this.vel.y);
      this.pos.set(this.pos.x, this.limits[3]);
      change = true;
    }
    if (this.pos.y < this.limits[1]) {
      this.vel.set(this.vel.x, -1*this.vel.y);
      this.pos.set(this.pos.x, this.limits[1]);
      change = true;
    }

    if (change) {
      let newPos = this.env.checkDist(this.pos);
      if (newPos != null) {
        this.pos.set(newPos.x, newPos.y);
      }
    }
  }

  draw() {
    noStroke();
    fill(this.c);
    circle(this.pos.x, this.pos.y, this.r);
  }
}
