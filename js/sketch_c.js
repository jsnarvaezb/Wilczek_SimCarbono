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
var molecules = []; // Molecules array

var d = 50; // Bond distance
var r = 10; // Atom radius
var b = 100;
var speed = 5;
var id_counter = 0;


var bound = 1000; // -min/+MAX axis value of free molecules

// Sketck modes
var modes = [
  '-- Seleccionar modo --', // 0
  'Grafeno Unitario', // 1
  'Diamante Unitario', // 2
  'Grafeno 2D', // 3
  'Grafeno 2D+1', // 4
  'Buckyball C_20', // 5
  'Buckyball C_60', // 6
];
var curMode = 0;

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

  push();
  noFill();
  strokeWeight(5);
  stroke(0);
  box(2 * bound);
  pop();

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

      // Iteration over molecules
      for (let m of molecules) {
        switch (m.status) {
          case 'free': // case free: update (draw)
            if (m.updateCarbon()) molecules.splice(molecules.indexOf(m), 1);
            break;
          case 'bond': // case bond: iterate over molecules
            for (let n of molecules) {
              if (n.status == 'free') { // find free molecules
                if (dist(m.x, m.y, m.z, n.x, n.y, n.z) <= 2 * d) { // check distance
                  ibond = m.bonds.indexOf(0);

                  if (m.kind == 'G2DU') n.kind = 'G2DD';
                  else if (m.kind == 'G2DD') n.kind = 'G2DU';
                  else if (m.kind == 'G3DU') n.kind = 'G3DD';
                  else if (m.kind == 'G3DD') n.kind = 'G3DU';

                  m.bonds[ibond] = n.id;
                  n.bonds[ibond] = m.id;
                  n.bondLocation(m.x, m.y, m.z, ibond);
                  n.zeroSpeed();
                  n.status = 'bond';


                }
              } else if (n.status == 'bond' && curMode == 3) {
                if (m.id != n.id && (dist(m.x, m.y, m.z, n.x, n.y, n.z) <= 1.01 * d)) {
                  if ((m.z > n.z && m.kind == 'G3DD' && n.kind == 'G3DU')||(m.z < n.z && m.kind == 'G3DU' && n.kind == 'G3DD')) {
                    m.bonds[0] = n.id;
                    n.bonds[0] = m.id;
                  } else if (dist(m.x, 0, n.x, 0) <= 0.1 * d) {
                    m.bonds[1] = n.id;
                    n.bonds[1] = m.id;
                  } else if (m.x - n.x < 0) {
                    m.bonds[m.kind[3] == 'U' ? 2 : 3] = n.id;
                    n.bonds[m.kind[3] == 'U' ? 2 : 3] = m.id;
                  } else if (m.x - n.x > 0) {
                    m.bonds[m.kind[3] == 'U' ? 3 : 2] = n.id;
                    n.bonds[m.kind[3] == 'U' ? 3 : 2] = m.id;
                  }
                }
              } else if (n.status == 'bond' && curMode == 4) {
                if (m.id != n.id && (dist(m.x, m.y, m.z, n.x, n.y, n.z) <= 1.01 * d)) {
                  if (m.z != n.z) {
                    m.bonds[0] = n.id;
                    n.bonds[0] = m.id;
                  } else if (dist(m.x, 0, n.x, 0) <= 0.1 * d) {
                    m.bonds[1] = n.id;
                    n.bonds[1] = m.id;
                  } else if (m.x - n.x < 0) {
                    m.bonds[m.kind[3] == 'U' ? 2 : 3] = n.id;
                    n.bonds[m.kind[3] == 'U' ? 2 : 3] = m.id;
                  } else if (m.x - n.x > 0) {
                    m.bonds[m.kind[3] == 'U' ? 3 : 2] = n.id;
                    n.bonds[m.kind[3] == 'U' ? 3 : 2] = m.id;
                  }
                }
              }
              if (n.bonds.indexOf(0) == -1) n.status = 'full';
              if (m.bonds.indexOf(0) == -1) {
                m.status = 'full';
                break;
              }
            }
            m.drawCarbon();
            break;

          case 'full': // case full: just draw
            m.drawCarbon();
            break;

          default:
            console.log('carbon ' + m + 'with wrong status');
            break;
        }

      }
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
  } // CURMODE SWITCH END
}
////    ////    ////    ////    ////    ////    ////    ////    ////    ////
////            DRAW END
////    ////    ////    ////    ////    ////    ////    ////    ////    ////

function keyTyped() {
  // Insert new molecules to the field with key 'm'
  if (curMode == 3 || curMode == 4) {
    if (key == 'm') {
      molecules.push(newCarbon(curMode == 3 ? 'G2D' : 'G3D'));
    }
  }
}

function newCarbon(kind) {
  let minBound = bound / 2;
  let maxBound = bound - 100;

  let nx = Math.sign(fullRandom()) * (minBound + (maxBound - minBound) * random());
  let ny = Math.sign(fullRandom()) * (minBound + (maxBound - minBound) * random());
  let nz = kind == 'G2D' ? 0 : Math.sign(fullRandom()) * (minBound + (maxBound - minBound) * random());

  let nm = new Carbon(nx, ny, nz, kind, 'free');
  nm.randSpeed();
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
    molecules = [];
    id_counter = 0;

    if (curMode == 3) {
      molecules.push(new Carbon(0, 0, 0, 'G2DU', 'bond'));
    } else if (curMode == 4) {
      molecules.push(new Carbon(0, 0, 0, 'G3DU', 'bond'));
    }
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
    } else pop();
  });
}



function fullRandom() {
  // -1 <= fullRandom() < 1
  return 2 * Math.random() - 1;
}
// FILE END //
