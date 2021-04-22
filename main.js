var circleCursor = new Circle({ x: 0, y: 0 }, { r: 0, g: 0, b: 255, a: 1.0 });
var navbarStatus = false;
var realtimeIntervalHandle;
var grids = [];
var paths = [];
var pheromonepaths = [];
var loopCount = 0;
var cityAnchor;

const ALPHA_VAR = 1;
const BETA_VAR = 2;
var cities = [];
var map = [];
var ants = [];
var EVAPORATE_VAR = 0.6;
var ITERATION_VAR = 30;
var ANTS_VAR = 30;

window.onload = () => {
  document.querySelector(".inputiter").defaultValue = ITERATION_VAR;
  document.querySelector(".inputevap").defaultValue = EVAPORATE_VAR;
  document.querySelector(".inputants").defaultValue = ANTS_VAR;

  animate();
  generateGrids();

  toggleNavbar();
};
