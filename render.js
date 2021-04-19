var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var paper = canvas.getContext("2d");

var mouse = {
  x: undefined,
  y: undefined,
  click: false,
};

var center = { x: 0, y: 0 };

var SPACING = 10;
var LINE_SPACING = 10;
var ADDRESS_RADIUS = 5;

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
  let truc = mouseToCoord(mouse);
  let calc = coordToCentered(truc);
  console.log(calc);
  document.querySelector(".coordbox").style.transform = `translate3d(${calc.x}px,${-calc.y}px,0)`;
  document.querySelector(".coordisp").innerHTML = `X: ${truc.x}, Y: ${truc.y}`;
});

window.addEventListener("mousedown", (event) => {
  mouse.click = true;
});

window.addEventListener("mouseup", (event) => {
  mouse.click = false;
});

window.addEventListener("wheel", (event) => {
  SPACING += event.deltaY * -0.05;
  LINE_SPACING += event.deltaY * -0.05;
  ADDRESS_RADIUS = SPACING / 2;

  if (ADDRESS_RADIUS < 5) {
    ADDRESS_RADIUS = 5;
  }

  if (SPACING < 10) {
    SPACING = 10;
    LINE_SPACING = 10;
  } else if (SPACING > 200) {
    SPACING = 200;
    LINE_SPACING = 200;
  }
});

// //drawing lines
// paper.beginPath();
// paper.moveTo(50, 300);
// paper.lineTo(300, 100);
// paper.lineTo(400, 300);
// paper.strokeStyle = "#002FFF";
// paper.stroke();

function Line(s, e, c) {
  this.sx = s.x;
  this.sy = s.y;
  this.ex = e.x;
  this.ey = e.y;
  this.c = c;

  this.draw = () => {
    paper.beginPath();
    paper.moveTo(center.x + this.sx, center.y + -this.sy);
    paper.lineTo(center.x + this.ex, center.y + -this.ey);
    paper.strokeStyle = `rgba(${this.c.r},${this.c.g},${this.c.b},${this.c.a})`;
    paper.lineWidth = LINE_SPACING / 75;
    paper.stroke();
  };

  this.update = () => {
    this.draw();
  };
}

function mouseToCoord(mouse) {
  let centeredx = mouse.x - center.x;
  let centeredy = -(mouse.y - center.y);
  let processedx = parseInt((((centeredx / Math.abs(centeredx)) * SPACING) / 2 + centeredx) / SPACING);
  let processedy = parseInt((((centeredy / Math.abs(centeredy)) * SPACING) / 2 + centeredy) / SPACING);
  return { x: processedx == NaN ? 0 : processedx, y: processedy == NaN ? 0 : processedy };
}

function coordToCentered(coord) {
  return { x: SPACING * coord.x, y: SPACING * coord.y };
}

function Circle(p, c) {
  this.p = p;
  this.c = c;

  this.draw = () => {
    paper.beginPath();
    let calc = coordToCentered(this.p);
    paper.arc(center.x + calc.x, center.y - calc.y, ADDRESS_RADIUS, 0, 2 * Math.PI);
    paper.fillStyle = `rgba(${this.c.r},${this.c.g},${this.c.b},${this.c.a})`;
    paper.fill();
  };

  this.update = () => {
    this.draw();
  };

  this.setPos = (p) => {
    this.p = p;
  };
}

var grids = [];
function generateGrids() {
  for (let i = -window.innerWidth; i < window.innerWidth * 2; i++) {
    if ((i - (center.x % center.x)) % LINE_SPACING == 0) {
      let realwidth = i - (center.x % center.x);
      let top = -center.y * 2;
      let bot = center.y * 2;
      grids.push(new Line({ x: realwidth, y: -top }, { x: realwidth, y: -bot }, { r: 0, g: 0, b: 0, a: 1 }));
    }
  }
  for (let i = -window.innerHeight; i < window.innerHeight * 2; i++) {
    if ((i - (center.y % center.y)) % LINE_SPACING == 0) {
      let realheight = i - (center.y % center.y);
      let top = -center.x * 2;
      let bot = center.x * 2;
      grids.push(new Line({ x: top, y: -realheight }, { x: bot, y: -realheight }, { r: 0, g: 0, b: 0, a: 1 }));
    }
  }
}

var circles = [];

circles.push(new Circle({ x: 0, y: 0 }, { r: 0, g: 0, b: 0, a: 1.0 }));

var circleCursor = new Circle({ x: 0, y: 0 }, { r: 0, g: 0, b: 255, a: 1.0 });

function animate() {
  requestAnimationFrame(animate);
  center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  circleCursor.setPos(mouseToCoord(mouse));

  paper.clearRect(0, 0, innerWidth, innerHeight);

  if (mouse.click) {
    circles.push(new Circle(mouseToCoord(mouse), { r: 0, g: 0, b: 0, a: 1.0 }));
  }

  grids = [];
  generateGrids();

  circles.forEach((element) => {
    element.update();
  });
  circleCursor.update();
  grids.forEach((element) => {
    element.update();
  });
}

animate();
generateGrids();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
