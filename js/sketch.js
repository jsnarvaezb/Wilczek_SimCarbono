/*
Universidad Nacional de Colombia
Modelos Estocásticos y Simulación en Computación y Comunicaciones
2019-I

El mundo como obra de arte - Frank Wilczek
Belleza cuántica II: exuberancia

Esta visualización muestra las diferentes estructuras de carbono presentadas en el capítulo Belleza Cuántica II.
Por medio de moléculas de Grafeno y Diamante, podemos construir  Grafeno bidimensional, Grafito y Diamante.
*/

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

// Global var
var bondMolecules = []; // Bonded molecules array
var freeMolecules = []; // Free molecules array

var d = 50; // Bond distance
var r = 10; // Atom radius
var bound = 1000; // -min/+MAX axis value of free molecules
var speed = 5;
var id_counter = 0;

// Sketck modes
var modes = [
  '-- Seleccionar modo --',
  'Grafeno Unitario',
  'Diamante Unitario',
  'Grafeno 2D',
  'Nanotubo 5x0',
  'Nanotubo 5x5',
  'Buckyball C_20',
  'Buckyball C_60',
  'Nanocono'
];
var curMode = '';

var menu = {}; // Menu object
var objFiles = [
  'gr.obj',
  'nt_5x0.obj',
  'nt_5x5.obj',
  'c20.obj',
  'c60.obj',
  'nc.obj'
];
var gr;
var nt50;
var nt55;
var c20;
var c60;
var nc;
var curModel = 0;
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
////            PRELOAD
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
function preload() {
  //gr = loadModel('obj/gr.obj');
  //nt50 = loadModel('obj/nt_5x0.obj');
  //nt55 = loadModel('obj/nt_5x0.obj');
  c20 = loadModel('obj/c20.obj', true);
  c60 = loadModel('obj/c60.obj', true);
  //nc = loadModel('obj/nc.obj');
}
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
////            SETUP
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
function setup() {
  // Environment setup
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  createMenu();

  debugMode();

  // Test objects

  //bondMolecules.push(new Molecule(0, 0, 0, 'D'));
  //bondMolecules.push(new Molecule(0, 0, 0, 'G2D'));
  //bondMolecules.push(new Molecule(0, 0, -100, 'G3D'));
}
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
////            DRAW
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
function draw() {
  background(250);
  orbitControl();

  if (curModel) model(curModel);
  /*
    switch (modes.indexOf(curMode)) {
      case 0:

        break;
      case 1:

        break;
      case 2:

        break;
      case 3:

        break;
      case 4:

        break;
      case 5:

        break;
      case 6:

        break;
      case 7:

        break;
      case 8:

        break;
      case 9:

        break;
      default:
        console.log('default case');
    }
  */
  // TEST
  //console.log(freeMolecules.length);
  //if (freeMolecules.length < 200) freeMolecules.push(newMolecule('G2D'));

  /*
  // Iteration over bondMolecules
  for (let m of bondMolecules) {
    m.drawMolecule();
    m.checkNear();
  }

  // Iteration over freeMolecules
  for (let m of freeMolecules) {
    if (m.updateMolecule()) freeMolecules.splice(freeMolecules.indexOf(m), 1);
  }
  */
}
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
////            DRAW END
////    ////    ////    ////    ////    ////    ////    ////    ////    ////

function keyTyped() {
  // Insert new molecules to the field with key 'm'
  if (key == 'm') {
    freeMolecules.push(newMolecule('G2D'));
  }
}

function newMolecule(type) {
  let minBound = bound / 2;
  let maxBound = bound - 100;
  let nm = new Molecule(Math.sign(fullRandom()) * (minBound + (maxBound - minBound) * random()),
    Math.sign(fullRandom()) * (minBound + (maxBound - minBound) * random()),
    Math.sign(fullRandom()) * (minBound + (maxBound - minBound) * random()), type);
  nm.randSpeed();
  return nm;
}

function createMenu() {
  menu.slct = createSelect();
  menu.slct.position(10, 10);
  for (let md of modes) {
    menu.slct.option(md);
  }
  menu.slct.changed(changedSelect);
}

function changedSelect() {
  curMode = menu.slct.value();
  console.log('Select changed to: ' + curMode);

  if (modes.indexOf(curMode) >= 3) {
    curModel = loadModel('obj/' + objFiles[modes.indexOf(curMode) - 3], true);
  }
}

function fullRandom() {
  // -1 <= fullRandom() < 1
  return 2 * Math.random() - 1;
}
// FILE END //
