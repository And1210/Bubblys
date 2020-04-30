const SLOW_THRESH = 20;
const STOP_THRESH = 0.01;

class Light extends Entity {
  constructor(x, y, colour, curPoint, points) {
    super(x, y);

    this.colour = colour;
    this.curPoint = curPoint-1;
    this.points = points;

    this.moving = false;

    this.size = 2;
  }

  draw() {
    noStroke();
    fill(this.colour);
    circle(this.pos.x, this.pos.y, this.size);
  }

  update() {
    super.update();

    if (this.moving) {
      let dist = pow(this.target.x - this.pos.x, 2) + pow(this.target.y - this.pos.y, 2);
      if (dist < SLOW_THRESH) {
        if (dist < STOP_THRESH) {
          this.pos.set(this.target.x, this.target.y);
          this.vel.mult(0);
          this.acc.mult(0);
          this.setMoving(false);
        } else {
          super.applyForce(p5.Vector.mult(this.vel, -0.25));
        }
      }
      super.applyForce(super.followForce(this.target));
    }
  }

  updateTarget() {
    this.curPoint = (this.curPoint + 1) % this.points.length;
    this.target = this.points[(this.curPoint + 1) % this.points.length];
  }

  setMoving(m) { this.moving = m; }
  isMoving() { return this.moving; }
}
