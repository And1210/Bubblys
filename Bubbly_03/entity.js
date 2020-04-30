const G = 5;

class Entity {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = m;

    this.rot = 0;

    this.maxSpeed = 4;
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

  gravityForce(other) { //gravity attraction to another entity
    let unitVec = p5.Vector.sub(other.pos, this.pos);
    let distSq = pow(this.pos.x - other.pos.x, 2) + pow(this.pos.y - other.pos.y, 2);
    let force = G*other.mass*this.mass/(pow(distSq, 1.1));
    unitVec.normalize();

    return p5.Vector.mult(unitVec, force);
  }

  applyForce(force) {
    let accAdd = p5.Vector.mult(force, 1/this.mass);
    this.acc.add(accAdd);
  }

  //Getters and Setters
  setVel(newVel) {
    this.vel = newVel;
  }
}
