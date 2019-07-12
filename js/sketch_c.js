/*
Universidad Nacional de Colombia
Modelos Estocásticos y Simulación en Computación y Comunicaciones
2019-I

El mundo como obra de arte - Frank Wilczek
Belleza cuántica II: exuberancia

Esta visualización muestra las diferentes estructuras de carbono presentadas en el capítulo Belleza Cuántica II.
Por medio de moléculas de Grafeno y Diamante, podemos construir  Grafeno bidimensional, Grafito y Diamante.
*/

// Global var
var bondMolecules = []; // Bonded molecules array
var freeMolecules = []; // Free molecules array

var d = 50; // Bond distance
var r = 10; // Atom radius
var speed = 5;
var id_counter = 0;


var bound = 1000; // -min/+MAX axis value of free molecules

// Sketck modes
var modes = [
  '-- Seleccionar modo --', // 0
  'Grafeno Unitario', // 1
  'Diamante Unitario', // 2
  'Grafeno 2D', // 3
  'Diamante 3D', // 4
  'Buckyball C_20', // 5
  'Buckyball C_60', // 6
];
var curMode = 2;

var menu = {}; // Menu object

var c20;
var c60;
var curModel;

////    ////    ////    ////    ////    ////    ////    ////    ////    ////
////            PRELOAD
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
function preload() {
  c20 = loadModel('obj/c20.obj', true);
  c60 = loadModel('obj/c60.obj', true);
}
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
////            SETUP
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
function setup() {
  // Environment setup
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  createMenu();

  //debugMode();

  push();
  noStroke();
  fill(127);
}
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
////            DRAW
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
function draw() {
  background(250);
  orbitControl();

  if (menu.chkRotate.checked()) {
    rotateX(frameCount * 0.2);
    rotateY(frameCount * 0.2);
  }
  switch (curMode) {
    case 1:
    case 2:
      // Display unit molecules of each kind
      drawUnit(curMode == 1);
      break;

    case 3:
    case 4:
      // Run simulation
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
      break;

    case 5:
    case 6:
      // Draw buckyball models
      curModel = curMode == 5 ? c20 : c60;
      model(curModel);
      break;

    case 0:
    default:
      // No case is default case
      break;
  }
}
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
////            DRAW END
////    ////    ////    ////    ////    ////    ////    ////    ////    ////

function keyTyped() {
  // Insert new molecules to the field with key 'm'
  if (key == 'm') {
    freeMolecules.push(newCarbon('G2D'));
  }
}

function newCarbon(kind) {
  let minBound = bound / 2;
  let maxBound = bound - 100;

  let nx = Math.sign(fullRandom()) * (minBound + (maxBound - minBound) * random());
  let ny = Math.sign(fullRandom()) * (minBound + (maxBound - minBound) * random());
  let nz = kind != 'G2D' ? 0 : Math.sign(fullRandom()) * (minBound + (maxBound - minBound) * random());

  let nm = new Carbon(nx, ny, nz, kind);
  return nm;
}

function createMenu() {
  // MODE SELECT
  menu.slct = createSelect();
  menu.slct.position(10, 10);
  for (let md of modes) {
    menu.slct.option(md);
  }
  menu.slct.changed(function() {
    curMode = modes.indexOf(menu.slct.value());
    console.log('Select changed to: ' + curMode + ', ' + modes[curMode]);
    freeMolecules = [];
    bondMolecules = [];
    //bondMolecules.push();
  });
  // ROTATE CHECK
  menu.chkRotate = createCheckbox('Habilitar Rotación', false);
  menu.chkRotate.position(10, 35);
  // MATERIAL CHECK
  menu.chkMat = createCheckbox('Material Normal', false);
  menu.chkMat.position(10, 55);
  menu.chkMat.changed(function() {
    if (menu.chkMat.checked()) {
      push();
      normalMaterial();
    } else {
      pop();
    }
  });
}



function fullRandom() {
  // -1 <= fullRandom() < 1
  return 2 * Math.random() - 1;
}
// FILE END //
