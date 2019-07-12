class Molecule {
  constructor(x, y, z, type) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.type = type;
    this.id = id_counter;
    this.isFull = false;
    
    this.bonds2D = [null, null, null, null, null, null]; // Clockwise: 1, 3, 5, 7, 9, 11.
    this.bonds3D = [null, null, null, null, null, null]; // Clockwise: U2, U6, U10, D12, D4, D8.

    this.zeroSpeed();

    id_counter += 1;
  }

  randSpeed() {
    this.xspeed = (-speed) * Math.sign(this.x) * random();
    this.yspeed = (-speed) * Math.sign(this.y) * random();
    this.zspeed = (-speed) * Math.sign(this.z) * random();
  }
  zeroSpeed() {
    this.xspeed = 0;
    this.yspeed = 0;
    this.zspeed = 0;
  }

  updateMolecule() {
    // update values
    this.x += this.xspeed;
    this.y += this.yspeed;
    this.z += this.zspeed;

    if (this.checkBounds()) {
      this.drawMolecule();
      return false;
    } else return true;
  }

  checkNear() {
    for (let m of freeMolecules) {
      if (dist(this.x, this.y, this.z, m.x, m.y, m.z) <= 20 * d) {
        var newx = this.x - m.x;
        var newy = this.y - m.y;
        var h = sqrt(sq(newx) + sq(newy));
        var angle = acos(newx / h);
        if (0 <= angle && angle < 60 && this.bonds2D[0] == null) {
          this.bonds2D[0] = m.id;
          m.bonds2D[3] = this.id;
          m.y = this.y + d * sin(30);
          m.x = this.x + d + d * cos(30);
          m.z = this.z;
          m.zeroSpeed();
          bondMolecules.push(m);
        }
      }
    }
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

  drawMolecule() {
    push();
    rotate(90);
    if (this.type == 'D') this.drawDiamond();
    else this.drawGraphene();
    pop();
  }

  drawGraphene() {
    push();
    noStroke();
    fill(150); // C Colors
    translate(this.x, this.y, this.z); // Central C coordinates

    //// C spheres
    sphere(r); // Central C
    // C 12:00
    push();
    translate(0, -d, 0);
    sphere(r);
    pop();
    // C 4:00
    push();
    translate(d * cos(30), d * sin(30), 0);
    sphere(r);
    pop();
    // C 8:00
    push();
    translate(-d * cos(30), d * sin(30), 0);
    sphere(r);
    pop();
    if (this.type == 'G3D') {
      // C Z
      push();
      translate(0, 0, d);
      sphere(r);
      pop();
    }

    //// C bonds
    strokeWeight(r / 2);
    stroke(200); // B Color
    line(0, 0, 0, 0, -d, 0);
    line(0, 0, 0, d * cos(30), d * sin(30), 0);
    line(0, 0, 0, -d * cos(30), d * sin(30), 0);
    if (this.type == 'G3D') line(0, 0, 0, 0, 0, d);
    //// C bonds end
    pop();
  }

  drawDiamond() {
    push();
    noStroke();
    fill(150); // C Colors
    translate(this.x, this.y, this.z); // Central C coordinates

    //// C spheres
    sphere(r); // Central C
    // C 12:00
    push();
    translate(0, -d * cos(30), -d * sin(30));
    sphere(r);
    pop();
    // C 4:00
    push();
    translate(d * cos(30) * cos(30), d * cos(30) * sin(30), -d * sin(30));
    sphere(r);
    pop();
    // C 8:00
    push();
    translate(-d * cos(30) * cos(30), d * cos(30) * sin(30), -d * sin(30));
    sphere(r);
    pop();
    // C Z
    push();
    translate(0, 0, d);
    sphere(r);
    pop();


    //// C bonds
    strokeWeight(r / 2);
    stroke(200); // B Color
    line(0, 0, 0, 0, -d * cos(30), -d * sin(30));
    line(0, 0, 0, d * cos(30) * cos(30), d * cos(30) * sin(30), -d * sin(30));
    line(0, 0, 0, -d * cos(30) * cos(30), d * cos(30) * sin(30), -d * sin(30));
    line(0, 0, 0, 0, 0, d);
    //// C bonds end
    pop();
  }
}
