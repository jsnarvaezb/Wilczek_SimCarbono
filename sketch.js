var d = 50;
var r = 10;
var molecules = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  molecules.push(new Molecule(0, 0, 0, 'D'));
  molecules.push(new Molecule(0, 0, 100, 'G2D'));
  molecules.push(new Molecule(0, 0, -100, 'G3D'));
}



function draw() {
  background(250);
  for (let m of molecules) {
    m.updateMolecule();
    if (checkBounds(m)) molecules.splice(molecules.indexOf(m), 1);
  }
  //drawGraphene(0, 0);
  //drawDiamond(0, 0);
  orbitControl();

}

function keyTyped() {
  if (key == 'm') {
    nm = new Molecule(200 * fullRandom(), 200 * fullRandom(), 200 * fullRandom(), 'D');
    nm.randSpeed();

    molecules.push(nm);
  }

}

function fullRandom() {
  return 2 * Math.random() - 1;
}

function checkBounds(m) {
  push();
  var bound = 1000;
  noFill();
  strokeWeight(5);
  stroke(0);
  box(2*bound);
  pop();
  if (m.x > bound || m.y > bound || m.z > bound || m.x < -bound || m.y < -bound || m.z < -bound) return true;
  else return false;
}


class Molecule {
  constructor(x, y, z, type) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.type = type;

    this.bonds2D = [null, null, null, null, null, null];
    this.bonds3D = [null, null, null, null];

    this.zeroSpeed();
  }

  randSpeed() {
    this.xspeed = fullRandom();
    this.yspeed = fullRandom();
    this.zspeed = fullRandom();
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

    this.drawMolecule();
  }

  drawMolecule() {
    if (this.type == 'D') this.drawDiamond();
    else this.drawGraphene();
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

//TODO
/*
Visualizations:


- Unidad de la estructura del diamante. (Tetraedro)
- Unidad de la estructura del grafeno. (Colmena)

- Diamante (3-D)
- Grafeno (2-D)
- Grafito (2+1)
- Nanotubos (1-D)
- Buckyballs (0-D)
  - C_20
  - C_60

MODES:
Single Graphene
Graphene
Graphite

Single Diamond
Diamond

Nanotubes (En Veremos 2.0)

HAND DESIGNED:
Buckyballs C_20 / C_60 (En Veremos)

MODULOS DE LA VISUALIZACIÓ

1. Grafeno
  1.1 Estructura Grafeno
    1.1.1 drawGraphene // DONE
    1.1.2 Def. clase (enlaces) // DONE

  1.2 Colmena
    1.2.1 Añadir Grafeno al plano // DONE
    1.2.2 Hacer enlace a la molécula

  1.3 Grafito
    1.3.1 Añadir Grafeno al campo // DONE
    1.3.2 Hacer enlace a la molécula 3D

2. Diamante
  2.1 Estructura Diamante
    2.1.1 Dibujar diamante //DONE
    2.1.2 Def. clase (enlaces) (modificar ángulos 1.1.2) // DONE

  2.2 Diamante
    2.2.1 Añadir diamante al campo (modificar 1.3.1) // DONE
    2.2.2 Hacer enlace a la molécula 3D (modificar 1.3.2)


# ELEMENTOS INTERACCIÓN
Seleccionar modo
Cámara MOUSE SCROLL(?)
Ingresar molécula // DONE

// #VEREMOS
3. Buckyballs // Revisar sección del libro (Modelo Estático)
  3.1 C_20
    3.1.1 Dibujar C_20

  3.2 C_60
    3.2.1 Dibujar C_60

4. Nanotubos
  4.1 Enrollar Grafeno 2D
    4.1.1 Calcular diámetro del tubo
    4.1.2 Diseñar anillo
    4.1.3 Replicar anillo en ambos sintidos

*/
