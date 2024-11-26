const numGrids = 2;
const numRows = 4;
const numCols = 3;
const wallProbability = .2;

const ARROWS = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1]
}

const puzzle0 = [
  {
    num_rows: 3,
    num_cols: 3,
    goal: [2,2],
    mbag_start: [1,1],
    walls: [
      [[0,1],[0,2]],
      [[0,1],[1,1]],
      [[1,1],[2,1]],
    ]
  },
  {
    num_rows: 3,
    num_cols: 3,
    goal: [1,1],
    mbag_start: [0,1],
    walls: [
      [[1,0],[1,1]],
    ]
  },
]

const puzzle1 = [
  {
    num_rows: 3,
    num_cols: 3,
    goal: [1,2],
    mbag_start: [0,1],
    walls: [
      [[1,0],[2,0]],
      [[2,0],[2,1]],
    ]
  },
  {
    num_rows: 3,
    num_cols: 3,
    goal: [1,0],
    mbag_start: [2,2],
    walls: [
      [[0,0],[0,1]],
    ]
  },
]

function in_pyrange(n, start, end) {
  return n >= start && n < end;
}

function arrayRange(start, stop, step) {
  return Array.from(
      { length: (stop - start) / step },
      (value, index) => start + index * step
  );
}

function rand_int(n) {
  return Math.floor(Math.random() * n);
}

const container = document.getElementById("container");

class GameGrid {
  constructor(grid_index, goal_r, goal_c, mbag_r, mbag_c, walls) {
    this.grid_index = grid_index;
    this.goal_r = goal_r;
    this.goal_c = goal_c;
    this.mbag_r = mbag_r;
    this.mbag_c = mbag_c;
    this.walls = new Set(walls.map(arr => JSON.stringify(arr)));

    this.mbag_image_element = document.createElement("img");
    this.mbag_image_element.src = "favicon2.ico";
    this.mbag_image_element.style.objectFit = "cover";
  }

  is_solved() {
    return this.mbag_r === this.goal_r && this.mbag_c === this.goal_c;
  }

  has_wall(r, c, r_neighbor, c_neighbor) {
    let cell = [r, c];
    let cell_neighbor = [r_neighbor, c_neighbor];
    return this.walls.has(JSON.stringify([cell, cell_neighbor])) || this.walls.has(JSON.stringify([cell_neighbor, cell]));
  }

  get_cell_element_id_name(cell_index) {
    return "grid" + this.grid_index + "cell" + cell_index;
  }

  create_grid_element() {
    const grid_element = document.createElement("div");
    grid_element.classList.add("grid");
    grid_element.id = `grid${this.grid_index}`;

    grid_element.style.setProperty('--grid-rows', numRows);
    grid_element.style.setProperty('--grid-cols', numCols);
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        let cell_index = numCols*r + c
        let cell = document.createElement("div");
        cell.setAttribute("id", this.get_cell_element_id_name(cell_index))
        if (r === this.goal_r && c === this.goal_c) {
          cell.style.setProperty("background-color", "lightgreen")
        }
        cell.className = "grid-item";

        if (this.has_wall(r, c, r+1, c)) {
          cell.style.setProperty("border-bottom", "2px solid black")
        }
        if (this.has_wall(r, c, r-1, c)) {
          cell.style.setProperty("border-top", "2px solid black")
        }
        if (this.has_wall(r, c, r, c+1)) {
          cell.style.setProperty("border-right", "2px solid black")
        }
        if (this.has_wall(r, c, r, c-1)) {
          cell.style.setProperty("border-left", "2px solid black")
        }
        grid_element.appendChild(cell);
      }
    }
    return grid_element;
  }

  refresh_display() {
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        let cell_index = numCols*r + c
        let cell = document.getElementById(this.get_cell_element_id_name(cell_index));
        if (r === this.mbag_r && c === this.mbag_c) {
          cell.innerHTML = null;
          cell.appendChild(this.mbag_image_element);
        } else {
          cell.innerHTML = null;
        }

      }
    }
  }
}

function generate_walls(probability) {
  let res = [];
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols-1; c++) {
      if (Math.random() < probability) {
        res.push([[r,c],[r,c+1]])
      }
    }
  }
  for (let r = 0; r < numRows-1; r++) {
    for (let c = 0; c < numCols; c++) {
      if (Math.random() < probability) {
        res.push([[r,c],[r+1,c]])
      }
    }
  }
  return res;

}

function generate_random_grid(i) {
  let grid = new GameGrid(i, rand_int(numRows), rand_int(numCols),rand_int(numRows),rand_int(numCols), generate_walls(wallProbability));
  const grid_element = grid.create_grid_element();
  container.appendChild(grid_element);
  grid.refresh_display()
  return grid;
}


function generate_random_grids() {
  return Array.from(arrayRange(0, numGrids, 1), (i) => generate_random_grid(i));
}

let grids = [];

document.addEventListener('keydown', function(event) {
  if (ARROWS.hasOwnProperty(event.key)) {
    if (!grids.every(grid => grid.is_solved())) {
      grids.forEach((gg, i) => {
        let mbag_r_new = gg.mbag_r + ARROWS[event.key][0];
        let mbag_c_new = gg.mbag_c + ARROWS[event.key][1];
        if (in_pyrange(mbag_r_new, 0, numRows) && in_pyrange(mbag_c_new, 0, numCols)) {
          if (!gg.has_wall(gg.mbag_r, gg.mbag_c, mbag_r_new, mbag_c_new)) {
            gg.mbag_r = mbag_r_new;
            gg.mbag_c = mbag_c_new;
            gg.refresh_display();
          }
        }
      })
    }
  }

});

grids = generate_random_grids();



