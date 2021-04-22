// class sebuah kota
class City {
  constructor(x, y) {
    // koordinat dari kota
    this.x = x;
    this.y = y;

    // element untuk render
    this.circle_element = new Circle({ x: x, y: y }, { r: 0, g: 0, b: 0, a: 1.0 });
  }
  isSamePlace(city) {
    // fungsi untuk test jika kotanya sama
    return this.x == city.x && this.y == city.y;
  }
}

// class sebuah semut yang berjalan
class Ant {
  constructor(city) {
    // kota yang sudah dikunjungi
    this.visited = [];
    this.visited.push(city);

    // jalan yang dilalui
    this.paths = [];

    // kota pertama yang dikunjungi
    this.starting = city;

    // kota yang sedang dikunjungi
    this.current = city;

    // jarak yang ditempuh
    this.cost = 0;
  }
  hasVisited(city) {
    // apakah sudah mengunjungi kota
    return this.visited.includes(city);
  }
  hasWalked(path) {
    // apakah melalui suatu jalan
    let result = false;
    this.paths.forEach((path_a) => {
      if (path_a.isOneOf(path.city_a) && path_a.isOneOf(path.city_b)) {
        result = true;
        return true;
      }
    });
    return result;
  }
  // fungsi memindah semut
  goToCity(city) {
    // menambah daftar yang sudah dikunjungi
    this.visited.push(city);

    // menambah jalan yang sudah dilewati
    let newpath = map.getPath(this.current, city);
    this.paths.push(newpath);

    // menghitung distance ulang
    this.cost += newpath.distance();

    // set city yang dikunjungi
    this.current = city;
  }
  // get kota sekarang
  currentCity() {
    return this.current;
  }
}

// class jalan yang dapat di tempuh
class Path {
  constructor(city_a, city_b) {
    // feromon, bahan kimia sebagai penanda yang digunakan semut
    this.pheromones = 1;

    // kota yang menghubungkan 2 tempat
    this.city_a = city_a;
    this.city_b = city_b;
  }
  // jarak suatu jalan
  distance() {
    let delta_y = this.city_a.y - this.city_b.y;
    let delta_x = this.city_a.x - this.city_b.x;
    // menggunakan euclidean
    return Math.hypot(delta_y, delta_x);
  }
  //check kalau salah satu kota ada dalam path
  isOneOf(city) {
    return this.city_a.isSamePlace(city) || this.city_b.isSamePlace(city);
  }
}

// class kumpulan dari path path membentu suatu map
class Map {
  constructor(cities) {
    // generate array yang merupakan setiap kemungkinan jalan dari 2 kota (map)
    this.map = [];
    // feromon terbesar buat render
    this.maxpheromones = 1;
    // membuat map yang pathnya tidak dobel (xx A-B B-A) dan path yang tidak menunjuk diri sendiri (xx A-A)
    cities.forEach((city_a) => {
      cities.forEach((city_b) => {
        // cek kalau kotanya sama
        if (!city_a.isSamePlace(city_b)) {
          // kalau kota tidak sama cek apakah path sudah ada
          if (!this.getPath(city_a, city_b)) {
            // jika belum tambah ke map
            this.map.push(new Path(city_a, city_b));
          }
        }
      });
    });
  }

  // melakukan pencarian jalan
  getPath(city_a, city_b) {
    let result = false;
    // untuk setiap path dalam map
    this.map.some((path) => {
      if (path.isOneOf(city_a) && path.isOneOf(city_b)) {
        // jika menemukan jalan yang ujungnya sesuai dengan yang diminta
        // return jalan
        result = path;
        return true;
      }
    });
    // jika tidak ketemu
    return result;
  }
}

// fungsi roulettewheel mengambil data secara random
function rouletteWheel(pairs) {
  let rand = Math.random();
  let sum = pairs.reduce((tot, cur) => {
    return tot + cur.p;
  }, 0);
  // pencegahan error ketika jumlah probabilitas 0
  let app_sum = sum == 0 ? 1 : sum;
  let offset = 0;
  let result;
  pairs.some((pair) => {
    // jika jumlah probabilitas 0, semua memiliki probabilitas sama
    if (sum == 0) offset += 1 / pairs.length;
    else offset += pair.p / app_sum;
    if (offset > rand) {
      result = pair;
      return true;
    }
  });
  return result.c;
}

// menghitung kemungkinan semut dari satu kota ke kota lain
function getProbability(current, destination) {
  //path yang dipakai
  let selected_path = map.getPath(current, destination);
  // tingkat kuat feromon
  let pheromones_level = Math.pow(selected_path.pheromones, ALPHA_VAR);
  // tingkat ketertarikan
  let attractiveness = Math.pow(1 / selected_path.distance(), BETA_VAR);
  return pheromones_level * attractiveness;
}

//fungsi untuk mengupdate feromon
function updatePheromone() {
  //untuk setiap path dalam map
  map.map.forEach((path) => {
    // feromon lama di evaporasi
    let temp = path.pheromones * EVAPORATE_VAR;
    // untuk setiap semut
    ants.forEach((ant) => {
      // ditambah dengan setiap semut yang melewati path
      if (ant.hasWalked(path)) temp += ant.cost;
    });
    // set feromon baru
    path.pheromones = temp;
    if (map.maxpheromones < temp) map.maxpheromones = temp;
  });
}

// masukkan data city

// mempersiapkan ACO
function initializeACO() {
  // buat map (paths)
  map = new Map(cities);
  ants = [];
}

// menjalankan simulasi
function iterateACO() {
  ants = [];
  for (let i = 0; i < ANTS_VAR; i++) {
    ants.push(new Ant(cities[Math.floor(Math.random() * cities.length)]));
  }

  // untuk setiap kota
  cities.forEach((_element, index) => {
    // untuk setiap semut
    ants.forEach((ant) => {
      // jika bukan kota terakhir (ketika semua kota telak dikunjungi)
      if (index < cities.length - 1) {
        // untuk setiap kota
        // array probabilitias untuk roulete wheel
        let probability_pairs = [];
        cities.forEach((city) => {
          if (!ant.hasVisited(city)) {
            // jika kotanya belum dikunjungi, hitung probabilitas
            probability_pairs.push({ c: city, p: getProbability(ant.currentCity(), city) });
          }
        });
        // ambil 1 dari array setelah dirandom
        let next_city = rouletteWheel(probability_pairs);
        // set kota selantjutnya
        ant.goToCity(next_city);
      } else {
        // jika kota terakhir (ketika semua kota telak dikunjungi)
        // pergi ke tempat awal
        ant.goToCity(ant.starting);
      }
    });
  });
  //update feromon
  updatePheromone();
}

//mendapatkan semut terbaik
function getBestAnt() {
  // sorting semut dari cost terkecil
  ants.sort((a, b) => {
    if (a.cost < b.cost) {
      return -1;
    }
    if (a.cost > b.cost) {
      return 1;
    }
    return 0;
  });
  // return semut cost terkecil
  return ants[0];
}

// menjalankan fungsi keseluruhan
function runACO() {
  initializeACO();
  for (let i = 0; i < ITERATION_VAR; i++) {
    iterateACO();
  }
  return getBestAnt();
}
