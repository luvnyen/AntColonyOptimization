var grids = [];
var circleCursor = new Circle({ x: 0, y: 0 }, { r: 0, g: 0, b: 255, a: 1.0 });
var navbarStatus = false;

function addCityNode(spawncoord) {
  if (
    cities.every((element) => {
      return element.x != spawncoord.x || element.y != spawncoord.y;
    })
  ) {
    cities.push(new City(spawncoord.x, spawncoord.y));
  }
}

function removeCityNode(spawncoord) {
  cities = cities.filter((element) => {
    return element.x != spawncoord.x || element.y != spawncoord.y;
  });
}

function toggleNavbar() {
  let navhandle = document.querySelector("body");
  if (navbarStatus) {
    navhandle.classList.remove("ham-active");
  } else {
    navhandle.classList.add("ham-active");
  }
  navbarStatus = !navbarStatus;
}

function clearAll() {
  cities = [];
  paths = [];
  MOVE_OFFSET = { x: 0, y: 0 };
  document.querySelector("body").classList.remove("calculating");
  document.querySelector("body").classList.remove("calculated");
}

function calculate() {
  document.querySelector("body").classList.add("calculating");
  setTimeout(() => {
    ITERATION_VAR = parseInt(document.querySelector(".inputiter").value);
    EVAPORATE_VAR = parseFloat(document.querySelector(".inputevap").value);
    ANTS_VAR = parseFloat(document.querySelector(".inputants").value);
    let starttime = performance.now();
    let best_ants = runACO(cities);
    let endtime = performance.now();
    paths = [];
    best_ants.paths.forEach((path) => {
      paths.push(new PathLine({ x: path.city_a.x, y: path.city_a.y }, { x: path.city_b.x, y: path.city_b.y }, { r: 0, g: 0, b: 0, a: 1 }, 10));
    });
    document.querySelector(".resultdist").innerHTML = `Distance: <br>${best_ants.cost.toFixed(3)}u`;
    document.querySelector(".resultspacer").innerHTML = `Time: <br>${((endtime - starttime) / 1000).toFixed(4)}s`;
    document.querySelector(".outputiter").innerHTML = ITERATION_VAR;
    document.querySelector(".outputevap").innerHTML = EVAPORATE_VAR;
    document.querySelector(".outputants").innerHTML = ANTS_VAR;
    setTimeout(() => {
      document.querySelector("body").classList.add("calculated");
    }, 100);
  }, 50);
}

function openAddCities() {
  document.querySelector("body").classList.add("add-open");
}

function closeAddCities() {
  document.querySelector("body").classList.remove("add-open");
  setTimeout(() => {
    document.querySelector(".addcitieslist").innerHTML = "";
  }, 300);
}

function newCitiesElement() {
  let newelementstr = `<div class="newcity">
  <div class="newcity-xplace">X:&nbsp;&nbsp;&nbsp;
      <input type="number" class="inputnewx" oninput="this.checkValidity()" step=1>
  </div>
  <div class="newcity-yplace">Y:&nbsp;&nbsp;&nbsp;
    <input type="number" class="inputnewy" oninput="this.checkValidity()" step=1>
  </div>
  <div class="newcity-cancel" onclick="removeNewCitiesElement(this)">✖</div>
</div>`;
  let parser = new DOMParser();
  let newelement = parser.parseFromString(newelementstr, "text/html").querySelector(".newcity");
  // newelement.querySelector(".inputnewx").defaultValue = 0;
  // newelement.querySelector(".inputnewy").defaultValue = 0;
  document.querySelector(".addcitieslist").append(newelement);
}

function newCitiesElementData(x, y) {
  let newelementstr = `<div class="newcity">
  <div class="newcity-xplace">X:&nbsp;&nbsp;&nbsp;
      <input type="number" class="inputnewx" oninput="this.checkValidity()" step=1>
  </div>
  <div class="newcity-yplace">Y:&nbsp;&nbsp;&nbsp;
    <input type="number" class="inputnewy" oninput="this.checkValidity()" step=1>
  </div>
  <div class="newcity-cancel" onclick="removeNewCitiesElement(this)">✖</div>
</div>`;
  let parser = new DOMParser();
  let newelement = parser.parseFromString(newelementstr, "text/html").querySelector(".newcity");
  // newelement.querySelector(".inputnewx").defaultValue = 0;
  // newelement.querySelector(".inputnewy").defaultValue = 0;
  newelement.querySelector(".inputnewx").value = x;
  newelement.querySelector(".inputnewy").value = y;
  document.querySelector(".addcitieslist").append(newelement);
}

function importExcel(handle) {
  let filehandle = handle.files;
  if (filehandle.length > 0) {
    var reader = new FileReader();
    reader.onloadend = (event) => {
      var arrayBuffer = reader.result;
      var workbook = new ExcelJS.Workbook();
      workbook.xlsx.load(arrayBuffer).then((workbook) => {
        workbook.worksheets[0].eachRow((row) => {
          if (Number.isInteger(row.values[1]) && Number.isInteger(row.values[2])) newCitiesElementData(parseInt(row.values[1]), parseInt(row.values[2]));
        });
      });
    };
    reader.readAsArrayBuffer(filehandle[0]);
  }
}

function addCitiesToList() {
  let data = document.querySelectorAll(".newcity");
  let min = { x: 0, y: 0 };
  let max = { x: 0, y: 0 };
  data.forEach((element, index) => {
    let xd = element.querySelector(".inputnewx");
    let yd = element.querySelector(".inputnewy");
    if (xd.checkValidity() && yd.checkValidity()) {
      xd = parseInt(xd.value);
      yd = parseInt(yd.value);
      addCityNode({ x: xd, y: yd });
      if (index == 0) {
        min = { x: xd, y: yd };
        max = { x: xd, y: yd };
      } else {
        if (xd < min.x) {
          min.x = xd;
        }
        if (xd > max.x) {
          max.x = xd;
        }
        if (yd < min.y) {
          min.y = yd;
        }
        if (yd > max.y) {
          max.y = yd;
        }
      }
    }
  });
  if (data.length > 0) {
    let midx = min.x + (max.x - min.x) / 2;
    let midy = min.x + (max.y - min.y) / 2;
    if (!Number.isNaN(midx) && !Number.isNaN(midy)) MOVE_OFFSET = { x: midx, y: midy };
  }
  clearRoute();
  closeAddCities();
}

function removeNewCitiesElement(el) {
  el.parentNode.remove();
}

function clearRoute() {
  paths = [];
  document.querySelector("body").classList.remove("calculating");
  document.querySelector("body").classList.remove("calculated");
}
