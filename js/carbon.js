/*
Carbon atom model

Kind is one of:
0 : free Carbon
1 : graphene 2D
2 : graphene 2D+1 up
3 : graphene 2D+1 down
4 : diamond up
5 : diamond down
*/
class Carbon {
  constructor(x, y, z, kind) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.kind = kind;
    this.id = id_counter;
    this.isFull = false;

    bonds = [0, 0, 0, 0];
    drawn = [0, 0, 0, 0];
    if (this.kind == 'G2D') bonds[0] = 'NO';
    this.zeroSpeed();
    id_counter += 1;
  }


  randSpeed() {
    this.xspeed = (-speed) * Math.sign(this.x) * random();
    this.yspeed = (-speed) * Math.sign(this.y) * random();
    if (this.kind != 'G2D') this.zspeed = (-speed) * Math.sign(this.z) * random();
  }
  zeroSpeed() {
    this.xspeed = 0;
    this.yspeed = 0;
    this.zspeed = 0;
  }

  checkBounds() {
    // Check if free molecule has escaped sketch bounds.
    push();
    noFill();
    strokeWeight(5);
    stroke(0);
    box(2 * bound);
    pop();
    if (this.x > bound || this.y > bound || this.z > bound || this.x < -bound || this.y < -bound || this.z < -bound) return false;
    else return true;
  }

  drawCarbon() {


  }
}


// Draw Unit Molecule helper function (at origin)
function drawUnit(isGraphene) {
  push();
  //// C spheres
  sphere(r); // Central C

  push();
  translate(0, 0, d);
  sphere(r); // C Z
  pop();

  push();
  strokeWeight(r / 2);
  stroke(200); // B Color
  if (isGraphene) {
    //// C bonds graphene
    line(0, 0, 0, 0, -d, 0);
    line(0, 0, 0, d * cos(30), d * sin(30), 0);
    line(0, 0, 0, -d * cos(30), d * sin(30), 0);
    line(0, 0, 0, 0, 0, d);
    pop();
  } else {
    //// C bonds diamond
    line(0, 0, 0, 0, -d * cos(30), -d * sin(19.5));
    line(0, 0, 0, d * cos(30) * cos(30), d * cos(30) * sin(30), -d * sin(19.5));
    line(0, 0, 0, -d * cos(30) * cos(30), d * cos(30) * sin(30), -d * sin(19.5));
    line(0, 0, 0, 0, 0, d);
    pop();
    translate(0, 0, -d * sin(19.5));
  }

  push();
  translate(0, -d * cos(30),0);
  sphere(r); // C 12:00
  pop();

  push();
  translate(d * cos(30) * cos(30), d * cos(30) * sin(30), 0);
  sphere(r); // C 4:00
  pop();

  push();
  translate(-d * cos(30) * cos(30), d * cos(30) * sin(30), 0);
  sphere(r); // C 8:00
  pop();

  pop();
}
