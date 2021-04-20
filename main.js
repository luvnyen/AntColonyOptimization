var grids = [];
var paths = [];
var circles = [];
var circleCursor = new Circle({ x: 0, y: 0 }, { r: 0, g: 0, b: 255, a: 1.0 });
var navbarStatus = false;

function addCityNode(spawncoord) {
  if (
    circles.every((element) => {
      return element.p.x != spawncoord.x || element.p.y != spawncoord.y;
    })
  ) {
    circles.push(new Circle(spawncoord, { r: 0, g: 0, b: 0, a: 1.0 }));
  }
}

function removeCityNode(spawncoord) {
  circles = circles.filter((element) => {
    return element.p.x != spawncoord.x || element.p.y != spawncoord.y;
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
  circles = [];
  paths = [];
}

function calculate() {
  paths = [];
  circles.forEach((_element, index) => {
    if (circles.length > 1 && index < circles.length - 1) {
      paths.push(new Line(circles[index].p, circles[index + 1].p, { r: 0, g: 0, b: 0, a: 1 }, 10));
    }
  });
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
      <input type="number" class="inputnewx" step=1>
  </div>
  <div class="newcity-yplace">Y:&nbsp;&nbsp;&nbsp;
    <input type="number" class="inputnewy" step=1>
  </div>
  <div class="newcity-cancel" onclick="removeNewCitiesElement(this)">✖</div>
</div>`;
  let parser = new DOMParser();
  let newelement = parser.parseFromString(newelementstr, "text/html").querySelector(".newcity");
  document.querySelector(".addcitieslist").append(newelement);
}

function newCitiesElementData(x, y) {
  let newelementstr = `<div class="newcity">
  <div class="newcity-xplace">X:&nbsp;&nbsp;&nbsp;
      <input type="number" class="inputnewx" step=1>
  </div>
  <div class="newcity-yplace">Y:&nbsp;&nbsp;&nbsp;
    <input type="number" class="inputnewy" step=1>
  </div>
  <div class="newcity-cancel" onclick="removeNewCitiesElement(this)">✖</div>
</div>`;
  let parser = new DOMParser();
  let newelement = parser.parseFromString(newelementstr, "text/html").querySelector(".newcity");
  console.log(x,y);
  newelement.querySelector(".inputnewx").value = x;
  newelement.querySelector(".inputnewy").value = y;
  document.querySelector(".addcitieslist").append(newelement);
}

function importExcel(handle) {
  let filehandle = handle.files;
  if (filehandle.length > 0) {
    var reader = new FileReader();
    reader.onloadend = event => {
      var arrayBuffer = reader.result;
      var workbook = new ExcelJS.Workbook();
      workbook.xlsx.load(arrayBuffer).then((workbook) => {
        workbook.worksheets[0].eachRow((row) => {
          newCitiesElementData(parseInt(row.values[1]), parseInt(row.values[2]) );
        });
      });
    };
    reader.readAsArrayBuffer(filehandle[0]);
  }
}

function addCitiesToList() {
  let data = document.querySelectorAll(".newcity");
  data.forEach((element) => {
    let xd = element.querySelector(".inputnewx");
    let yd = element.querySelector(".inputnewy");
    if (xd.checkValidity() && yd.checkValidity()) addCityNode({ x: parseInt(xd.value), y: parseInt(yd.value) });
  });
  closeAddCities();
}

function removeNewCitiesElement(el) {
  el.parentNode.remove();
}

function clearRoute() {
  paths = [];
}

window.onload = () => {
  animate();
  generateGrids();
};
