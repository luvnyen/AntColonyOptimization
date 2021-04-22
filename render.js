var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var paper = canvas.getContext("2d");

var realmouse = {
  x: undefined,
  y: undefined,
};

var mouse = {
  x: undefined,
  y: undefined,
  lclick: false,
  rclick: false,
  mclick: false,
};

var CENTER = { x: 0, y: 0 };
var SPACING = 30;
var LINE_SPACING = 30;
var ADDRESS_RADIUS = 15;
var PREV_WINSIZE = { x: window.innerWidth, y: window.innerHeight };
var SPEED = 0.1;
var DISP_POS = { x: 0, y: 0 };
var OLD_OFFSET = { x: 0, y: 0 };
var MOVE_OFFSET = { x: 0, y: 0 };
var REAL_OFFSET = { x: 0, y: 0 };
var PAN_START = { x: 0, y: 0 };
var DELTA_START = false;

canvas.addEventListener("mousemove", (event) => {
  if (DELTA_START) {
    MOVE_OFFSET.x = OLD_OFFSET.x + (PAN_START.x - event.x) / SPACING;
    MOVE_OFFSET.y = OLD_OFFSET.y + (PAN_START.y - event.y) / SPACING;

    REAL_OFFSET = coordToCenteredAbs(MOVE_OFFSET);
  }
  realmouse.x = event.x;
  realmouse.y = event.y;
});

canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

canvas.addEventListener("mousedown", (event) => {
  if (event.button == 0) {
    mouse.lclick = true;
  } else if (event.button == 2) {
    mouse.rclick = true;
  } else if (event.button == 1) {
    mouse.mclick = true;
    PAN_START.x = event.x;
    PAN_START.y = event.y;
    OLD_OFFSET.x = MOVE_OFFSET.x;
    OLD_OFFSET.y = MOVE_OFFSET.y;
    DELTA_START = true;
  }
});

canvas.addEventListener("mouseup", (event) => {
  if (event.button == 0) {
    mouse.lclick = false;
  } else if (event.button == 2) {
    mouse.rclick = false;
  } else if (event.button == 1) {
    mouse.mclick = false;
    DELTA_START = false;
  }
});

canvas.addEventListener("wheel", (event) => {
  SPACING += event.deltaY * -0.025;
  LINE_SPACING += event.deltaY * -0.025;

  ADDRESS_RADIUS = SPACING / 2;

  if (ADDRESS_RADIUS < 1) {
    ADDRESS_RADIUS = 1;
  }
  if (LINE_SPACING < 5) {
    LINE_SPACING = 5;
  } else if (LINE_SPACING > 100) {
    LINE_SPACING = 100;
  }

  if (SPACING < 5) {
    SPACING = 5;
  } else if (SPACING > 100) {
    SPACING = 100;
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function getTranslate3d(el) {
  var values = el.style.transform.split(/\w+\(|\);?/);
  if (!values[1] || !values[1].length) {
    return [0, 0, 0];
  }
  return values[1].split(/,\s?/g);
}

function updateCoordDisplay() {
  let truc = mouseToCoord(mouse);
  DISP_POS = coordToCentered(truc);
  document.querySelector(".coordisptext").innerHTML = `X: ${truc.x}, Y: ${truc.y}`;

  let curtrans = getTranslate3d(document.querySelector(".coordbox"));
  curtrans[0] = parseFloat(curtrans[0]);
  curtrans[1] = parseFloat(curtrans[1]);
  curtrans[2] = parseFloat(curtrans[2]);

  curtrans[0] += (DISP_POS.x - curtrans[0]) * SPEED;
  curtrans[1] += (-DISP_POS.y - curtrans[1]) * SPEED;

  document.querySelector(".coordbox").style.transform = `translate3d(${curtrans[0]}px,${curtrans[1] - SPACING / 20}px,0)`;
}

function mouseToCoord(mouse) {
  let centeredx = mouse.x - CENTER.x;
  let centeredy = -(mouse.y - CENTER.y);
  let processedx = parseInt((((centeredx / Math.abs(centeredx)) * SPACING) / 2 + centeredx) / SPACING);
  let processedy = parseInt((((centeredy / Math.abs(centeredy)) * SPACING) / 2 + centeredy) / SPACING);
  processedx = Number.isNaN(processedx) ? 0 : processedx;
  processedy = Number.isNaN(processedy) ? 0 : processedy;
  return { x: processedx, y: processedy };
}

function coordToCenteredAbs(coord) {
  return { x: SPACING * coord.x, y: SPACING * coord.y };
}

function coordToCentered(coord) {
  let off = { x: -MOVE_OFFSET.x, y: MOVE_OFFSET.y };
  return { x: SPACING * (coord.x + off.x), y: SPACING * (coord.y + off.y) };
}

function coordToLineCentered(coord) {
  let off = { x: -MOVE_OFFSET.x, y: MOVE_OFFSET.y };
  return { x: LINE_SPACING * (coord.x + off.x), y: LINE_SPACING * (coord.y + off.y) };
}

//draw via converted coordinate
class Line {
  constructor(s, e, c, w = 1) {
    this.s = s;
    this.ts = coordToCentered(s);
    this.e = e;
    this.te = coordToCentered(e);
    this.c = c;
    this.w = w;
    this.tw = w;
  }
  draw() {
    paper.beginPath();
    paper.moveTo(CENTER.x + this.ts.x, CENTER.y + -this.ts.y);
    paper.lineTo(CENTER.x + this.te.x, CENTER.y + -this.te.y);
    paper.strokeStyle = `rgba(${this.c.r},${this.c.g},${this.c.b},${this.c.a})`;
    paper.lineWidth = (LINE_SPACING / 75) * this.tw;
    paper.stroke();
  }
  update() {
    let calcs = coordToLineCentered(this.s);
    let calce = coordToLineCentered(this.e);
    this.ts.x += (calcs.x - this.ts.x) * SPEED;
    this.ts.y += (calcs.y - this.ts.y) * SPEED;
    this.te.x += (calce.x - this.te.x) * SPEED;
    this.te.y += (calce.y - this.te.y) * SPEED;
    this.tw += (this.w - this.tw) * SPEED;
    this.draw();
  }
  setWidth(neww) {
    this.w = neww;
  }
}

//draw via converted coordinate
class PathLine {
  constructor(s, e, c, w = 1) {
    this.s = s;
    this.ts = coordToCentered(s);
    this.e = e;
    this.ste = coordToCentered(s);
    this.te = coordToCentered(e);
    this.c = c;
    this.w = w;
    this.d = Math.hypot(e.y - s.y, e.x - s.x);
    this.st = false;
  }

  draw() {
    let offsx = CENTER.x + this.ts.x;
    let offsy = CENTER.y + -this.ts.y;
    let offex = CENTER.x + this.ste.x;
    let offey = CENTER.y + -this.ste.y;
    paper.beginPath();
    paper.moveTo(offsx, offsy);
    paper.lineTo(offex, offey);
    paper.strokeStyle = `rgba(${this.c.r},${this.c.g},${this.c.b},${this.c.a})`;
    paper.lineWidth = (LINE_SPACING / 75) * this.w;
    paper.stroke();
    paper.font = `700 ${LINE_SPACING}px Open Sans`;
    paper.textAlign = "center";
    paper.fillStyle = "rgba(255,255,255,1)";
    paper.strokeStyle = "rgba(0,0,0,1)";
    paper.lineWidth = (LINE_SPACING / 4);
    paper.strokeText(this.d.toFixed(2), offsx - (offsx - offex) / 2, offsy - (offsy - offey) / 2);
    paper.fillText(this.d.toFixed(2), offsx - (offsx - offex) / 2, offsy - (offsy - offey) / 2);
  }

  update() {
    let calcs = coordToLineCentered(this.s);
    let calce = coordToLineCentered(this.e);
    this.ts.x += (calcs.x - this.ts.x) * SPEED;
    this.ts.y += (calcs.y - this.ts.y) * SPEED;
    this.te.x += (calce.x - this.te.x) * SPEED;
    this.te.y += (calce.y - this.te.y) * SPEED;
    if (!this.st) {
      this.ste.x += ((calce.x - this.ste.x) * SPEED) / 1.5;
      this.ste.y += ((calce.y - this.ste.y) * SPEED) / 1.5;
      if (Math.abs(calce.x - this.ste.x) < 10) {
        this.st = true;
      }
    } else {
      this.ste.x = this.te.x;
      this.ste.y = this.te.y;
    }
    this.d = Math.hypot(this.e.y - this.s.y, this.e.x - this.s.x);
    this.draw();
  }

  setEnds(s, e) {
    // let offs = Math.hypot(this.s.x - s.x, this.s.y - s.y);
    // let offe = Math.hypot(this.s.x - e.x, this.s.y - e.y);
    // if (offs < offe) {
    //   this.s = s;
    //   this.e = e;
    // } else {
    this.s = e;
    this.e = s;
    // }
  }
}

//draw via converted coordinate
class Circle {
  constructor(p, c, rm = 1) {
    this.p = p;
    this.t = coordToCentered(p);
    this.c = c;
    this.tc = c;
    this.r = ADDRESS_RADIUS;
    this.rm = rm;
  }

  draw() {
    paper.beginPath();
    paper.arc(CENTER.x + this.t.x, CENTER.y - this.t.y, this.r, 0, 2 * Math.PI);
    paper.fillStyle = `rgba(${this.tc.r},${this.tc.g},${this.tc.b},${this.tc.a})`;
    paper.fill();
  }

  update() {
    let calc = coordToCentered(this.p);
    this.t.x += (calc.x - this.t.x) * SPEED;
    this.t.y += (calc.y - this.t.y) * SPEED;
    this.r += (ADDRESS_RADIUS * this.rm - this.r) * SPEED;
    this.tc.r += (this.c.r - this.tc.r) * SPEED;
    this.tc.g += (this.c.g - this.tc.g) * SPEED;
    this.tc.b += (this.c.b - this.tc.b) * SPEED;
    this.tc.a += (this.c.a - this.tc.a) * SPEED;
    this.draw();
  }

  setPos(p) {
    this.p = p;
  }
}

function generateGrids() {
  for (let i = (-window.innerWidth / SPACING) * 10; i < (window.innerWidth / SPACING) * 10; i++) {
    let realwidth = i * SPACING - (CENTER.x % CENTER.x);
    let top = -CENTER.y * 10;
    let bot = CENTER.y * 10;
    grids.push(new Line(mouseToCoord({ x: realwidth, y: -top }), mouseToCoord({ x: realwidth, y: -bot }), { r: 0, g: 0, b: 0, a: 1 }));
  }
  for (let i = (-window.innerHeight / SPACING) * 10; i < (window.innerHeight / SPACING) * 10; i++) {
    let realheight = i * SPACING - (CENTER.y % CENTER.y);
    let top = -CENTER.x * 10;
    let bot = CENTER.x * 10;
    grids.push(new Line(mouseToCoord({ x: top, y: -realheight }), mouseToCoord({ x: bot, y: -realheight }), { r: 0, g: 0, b: 0, a: 1 }));
  }
}

function animate() {
  requestAnimationFrame(animate);
  paper.clearRect(0, 0, innerWidth, innerHeight);
  mouse.x = realmouse.x + MOVE_OFFSET.x * SPACING;
  mouse.y = realmouse.y + MOVE_OFFSET.y * SPACING;
  CENTER = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let spawncoord = mouseToCoord(mouse);
  circleCursor.setPos(spawncoord);

  if (mouse.lclick) {
    clearRoute();
    addCityNode(spawncoord);
    circleCursor.c = { r: 0, g: 255, b: 0, a: 1.0 };
  } else if (mouse.rclick) {
    clearRoute();
    removeCityNode(spawncoord);
    circleCursor.c = { r: 255, g: 0, b: 0, a: 1.0 };
  } else if (mouse.mclick) {
    canvas.style.cursor = "grab";
  } else {
    canvas.style.cursor = "pointer";
    circleCursor.c = { r: 0, g: 0, b: 255, a: 1.0 };
  }

  if (PREV_WINSIZE.x != window.innerWidth || PREV_WINSIZE.y != window.innerHeight) {
    grids = [];
    generateGrids();
    PREV_WINSIZE = { x: window.innerWidth, y: window.innerHeight };
  }

  updateCoordDisplay();
  grids.forEach((element) => {
    element.update();
  });
  cities.forEach((element) => {
    element.circle_element.update();
  });
  pheromonepaths.forEach((element) => {
    element.update();
  });
  paths.forEach((element) => {
    element.update();
  });
  circleCursor.update();
}
