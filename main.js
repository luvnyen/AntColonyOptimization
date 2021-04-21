var paths = [];
var cities = [];

window.onload = () => {
  document.querySelector(".inputiter").defaultValue = ITERATION_VAR;
  document.querySelector(".inputevap").defaultValue = EVAPORATE_VAR;
  document.querySelector(".inputants").defaultValue = ANTS_VAR;

  animate();
  generateGrids();

  toggleNavbar();
};
