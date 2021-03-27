const WIDTH = 512;
const ENTITY_NUM = 100;
const ENTITY_SIZE = 10;

const REPULSION_FACTOR = 0.5;
const ALIGNMENT_FACTOR = 0.1;
const GROUP_FACTOR = 0.1;

let entities = [];

function getRandomLocation() {
  let x = int(ENTITY_SIZE/2+random(WIDTH-ENTITY_SIZE));
  let y = int(ENTITY_SIZE/2+random(WIDTH-ENTITY_SIZE));
  return [x, y];
}

function setup() {
  createCanvas(WIDTH, WIDTH);

  for (let i = 0; i < ENTITY_NUM; i++) {
    let loc = getRandomLocation();
    entities.push(new Entity(loc[0], loc[1], ENTITY_SIZE, color(255*i/ENTITY_NUM, 255*i/ENTITY_NUM, 255)));
  }
}

function draw() {
  background(0, 20);

  for (let e of entities) {
    //Generate forces to apply
    let avgPos = createVector(0, 0);
    let repulsionForce = createVector(0, 0);
    let alignmentForce = createVector(0, 0);

    for (let o of entities) {
      avgPos.add(o.pos);
      repulsionForce.add(p5.Vector.mult(e.getFollowForce(o.pos), -1));
      alignmentForce.add(o.vel);
    }

    avgPos.div(entities.length);
    repulsionForce.div(entities.length);
    alignmentForce.div(entities.length);

    //Apply forces
    e.applyForce(p5.Vector.mult(repulsionForce, REPULSION_FACTOR));
    e.applyForce(p5.Vector.mult(e.getFollowForce(avgPos), GROUP_FACTOR));
    e.applyForce(p5.Vector.mult(alignmentForce, ALIGNMENT_FACTOR));
  }

  for (let e of entities) {
    e.update();
    e.draw();
  }
}
