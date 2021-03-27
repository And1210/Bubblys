class Entity {
  constructor(x, y, size, colour) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.size = size;
    this.colour = colour;

    this.rot = 0;

    this.maxSpeed = 3;
    this.maxForce = 0.1;
  }

  update() {
    this.updateRot();
    this.updateVel();
    this.bounds();
    this.updatePos();
  }

  draw() {
    // noStroke();
    // fill(255);
    // circle(this.pos.x, this.pos.y, this.size);
    let offset = this.size;
    noStroke();
    fill(this.colour);
    push()
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading()+PI/2);
    triangle(-offset*0.5, offset, offset*0.5, offset, 0, -offset/2);
    pop();
  }

  updatePos() {
    this.pos.add(this.vel);
  }

  updateVel() {
    this.vel.add(this.acc);
    this.acc.mult(0);
    this.vel.limit(this.maxSpeed);
  }

  updateRot() {
    let heading = this.vel.heading();
    this.rot = PI/2 - heading;
  }

  getFollowForce(target) {
    let targetDelta = p5.Vector.sub(target, this.pos);
    let idealTrajectory = p5.Vector.sub(targetDelta, this.vel);
    idealTrajectory = idealTrajectory.limit(this.maxForce);
    return idealTrajectory;
    // this.applyForce(idealTrajectory);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  bounds() {
    if (this.pos.x + this.size/2 >= width || this.pos.x - this.size/2 <= 0) {
      this.vel = createVector(this.vel.x*-1, this.vel.y);
    }
    if (this.pos.y + this.size/2 >= height || this.pos.y - this.size/2 <= 0) {
      this.vel = createVector(this.vel.x, this.vel.y*-1);
    }
  }

  //Getters and Setters
  setVel(newVel) {
    this.vel = newVel;
  }
}
