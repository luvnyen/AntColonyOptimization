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
  MOVE_OFFSET = {x:0 , y:0};
  document.querySelector("body").classList.remove("calculated");
}

function calculate() {
  let iterdata = parseInt(document.querySelector(".inputiter").value);
  let evapdata = parseFloat(document.querySelector(".inputevap").value);
  paths = [];
  let dist = 0;
  circles.forEach((_element, index) => {
    if (circles.length > 1 && index < circles.length - 1) {
      paths.push(new Path(circles[index].p, circles[index + 1].p, { r: 0, g: 0, b: 0, a: 1 }, 10));
      dist+=paths[paths.length-1].d;
    }
  });
  document.querySelector(".resultarea").innerHTML = `Distance: ${dist.toFixed(2)}`;
  document.querySelector("body").classList.add("calculated");
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
    reader.onloadend = event => {
      var arrayBuffer = reader.result;
      var workbook = new ExcelJS.Workbook();
      workbook.xlsx.load(arrayBuffer).then((workbook) => {
        workbook.worksheets[0].eachRow((row) => {
          if(Number.isInteger(row.values[1] )&& Number.isInteger(row.values[2]))
            newCitiesElementData(parseInt(row.values[1]), parseInt(row.values[2]));
        });
      });
    };
    reader.readAsArrayBuffer(filehandle[0]);
  }
}

function addCitiesToList() {
  let data = document.querySelectorAll(".newcity");
  let min = {x:0,y:0};
  let max = {x:0,y:0};
  data.forEach((element,index) => {
    let xd = element.querySelector(".inputnewx");
    let yd = element.querySelector(".inputnewy");
    if (xd.checkValidity() && yd.checkValidity()) {
      xd = parseInt(xd.value)
      yd = parseInt(yd.value)
      addCityNode({ x:xd, y: yd });
      if(index == 0){
        min = {x: xd , y: yd};
        max = {x: xd , y: yd};
      }else{
        if(xd < min.x){
          min.x = xd;
        }
        if(xd > max.x){
          max.x = xd;
        }
        if(yd < min.y){
          min.y = yd;
        }
        if(yd > max.y){
          max.y = yd;
        }
      }
    }
  });
  if(data.length > 0){
    let midx = min.x + (max.x - min.x)/2;
    let midy = min.x + (max.y - min.y)/2;
    if(!Number.isNaN(midx) && !Number.isNaN(midy))
      MOVE_OFFSET = {x: midx, y: midy};
  }
  clearRoute();
  closeAddCities();
}

function removeNewCitiesElement(el) {
  el.parentNode.remove();
}

function clearRoute() {
  paths = [];
  document.querySelector("body").classList.remove("calculated");
}

window.onload = () => {
  document.querySelector(".inputiter").defaultValue = 1;
  document.querySelector(".inputevap").defaultValue = 0.9;

  animate();
  generateGrids();
};
