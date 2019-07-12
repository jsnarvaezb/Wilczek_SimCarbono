/*
Carbon atom model

Kind is one of:
0 : free Carbon
1 : graphene 2D
2 : graphene 2D+1 up
3 : graphene 2D+1 down
4 : diamond up
5 : diamond down

status is one of:
free: free carbon
bond: bonded carbon
full: full carbon
*/
class Carbon {
  constructor(x, y, z, kind, status) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.kind = kind;
    id_counter += 1;
    this.id = id_counter;
    this.isFull = false;
    this.status = status;

    this.bonds = [0, 0, 0, 0];
    this.drawn = [0, 0, 0, 0];
    if (this.kind == 'G2D' || this.kind == 'G2DU' || this.kind == 'G2DD') this.bonds[0] = 'NO';
    this.zeroSpeed();

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

  updateCarbon() {
    // update values
    this.x += this.xspeed;
    this.y += this.yspeed;
    this.z += this.zspeed;

    if (this.checkBounds()) {
      this.drawCarbon();
      return false;
    } else return true;
  }
  bondLocation(x, y, z, iBond) {
    if (this.kind == 'G2DU' || this.kind == 'G3DU') {
      if (iBond == 1) {
        this.x = x;
        this.y = y + d;
      } else if (iBond == 2) {
        this.x = x - d * cos(30);
        this.y = y - d * sin(30);
      } else if (iBond == 3) {
        this.x = x + d * cos(30);
        this.y = y - d * sin(30);
      }
      if (this.kind == 'G3DU') {
        if (iBond == 0) this.z = z + d;
      }
    } else if (this.kind == 'G2DD' || this.kind == 'G3DD') {
      if (iBond == 1) {
        this.x = x;
        this.y = y - d;
      } else if (iBond == 2) {
        this.x = x + d * cos(30);
        this.y = y + d * sin(30);
      } else if (iBond == 3) {
        this.x = x - d * cos(30);
        this.y = y + d * sin(30);
      }
      if (this.kind == 'G3DD') {
        if (iBond == 0) this.z = z - d;
      }
    } else if (this.kind == 'D3DU') {

    } else if (this.kind == 'D3DD') {

    } else console.log('incorrect kind: ' + this.kind);
  }

  checkBounds() {
    // Check if free molecule has escaped sketch bounds.
    if (this.x > bound || this.y > bound || this.z > bound || this.x < -bound || this.y < -bound || this.z < -bound) return false;
    else return true;
  }

  drawCarbon() {
    // draw atoms
    push();
    translate(this.x, this.y, this.z);
    sphere(r);

    // draw bonds
    push();
    strokeWeight(r / 2);
    stroke(200); // B Color
    for (let i = (this.kind == 'G2DU' || this.kind == 'G2DD') ? 0 : 1; i < this.bonds.length; i += 1) {
      if (this.bonds[i] == 'NO' || this.bonds[i] == 0) continue
      if (this.kind == 'G2DU' || this.kind == 'G3DU') {
        if (i == 0) line(0, 0, 0, 0, 0, d);
        else if (i == 1) line(0, 0, 0, 0, -d, 0);
        else if (i == 2) line(0, 0, 0, d * cos(30), d * sin(30), 0);
        else if (i == 3) line(0, 0, 0, -d * cos(30), d * sin(30), 0);
      }
      if (this.kind == 'G3DD' || this.kind == 'G3DD') {
        if (i == 0) line(0, 0, 0, 0, 0, -d);
        else if (i == 1) line(0, 0, 0, 0, d, 0);
        else if (i == 2) line(0, 0, 0, -d * cos(30), -d * sin(30), 0);
        else if (i == 3) line(0, 0, 0, d * cos(30), -d * sin(30), 0);
      }
      if (this.kind == 'D3DU') {

      }
      if (this.kind == 'D3DD') {

      }
    }
    pop();
    pop();
  }
}
// CARBON CLASS END

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
  translate(0, -d * cos(30), 0);
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
