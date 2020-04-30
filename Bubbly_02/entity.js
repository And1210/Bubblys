class Entity {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.rot = 0;

    this.maxSpeed = 3;
    this.maxForce = 0.1;
  }

  update() {
    this.updateRot();
    this.updateVel();
    this.updatePos();
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

  followForce(target) {
    let targetDelta = p5.Vector.sub(target, this.pos);
    let idealTrajectory = p5.Vector.sub(targetDelta, this.vel);
    idealTrajectory = idealTrajectory.limit(this.maxForce);
    return idealTrajectory;
    // this.applyForce(idealTrajectory);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  //Getters and Setters
  setVel(newVel) {
    this.vel = newVel;
  }
}
