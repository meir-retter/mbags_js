const numGrids = 2;
const numRows = 3;
const numCols = 3;



const ARROWS = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1]
}


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
  }

  has_wall(r, c, r_neighbor, c_neighbor) {
    let cell = [r, c];
    let cell_neighbor = [r_neighbor, c_neighbor];
    return this.walls.has(JSON.stringify([cell, cell_neighbor])) || this.walls.has(JSON.stringify([cell_neighbor, cell]));
  }



  get_grid_element() {
    return document.getElementById("grid" + this.grid_index);
  }

  get_cell_element_id_name(cell_index) {
    return "grid" + this.grid_index + "cell" + cell_index;
  }

  initialize_display() {
    let grid_element = this.get_grid_element();
    grid_element.style.setProperty('--grid-rows', numRows);
    grid_element.style.setProperty('--grid-cols', numCols);
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        let cell_index = numCols*r + c
        let cell = document.createElement("div");
        cell.setAttribute("id", this.get_cell_element_id_name(cell_index))
        if (r === this.goal_r && c === this.goal_c) {
          cell.style.setProperty("background-color", "yellow")
        }
        cell.innerText = ".";
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
    };
  }
}

walls0 = [[[0,0],[0,1]], [[1,0],[1,1]]];
walls1 = [[[2,0],[2,1]]];

wallss = [walls0, walls1];

let grids = [];
for (let i = 0; i < numGrids; i++) {
  let grid = new GameGrid(i, 0, 0,0,1, wallss[i]);
  grid.initialize_display()
  grid.refresh_display()
  grids.push(grid)
}

document.addEventListener('keydown', function(event) {
  grids.forEach((gg, i) => {
    if (ARROWS.hasOwnProperty(event.key)) {
      let mbag_r_new = gg.mbag_r + ARROWS[event.key][0];
      let mbag_c_new = gg.mbag_c + ARROWS[event.key][1];
      if (mbag_r_new >= 0 && mbag_r_new < numRows && mbag_c_new >= 0 && mbag_c_new < numCols) {
        if (!gg.has_wall(gg.mbag_r, gg.mbag_c, mbag_r_new, mbag_c_new)) {
          gg.mbag_r = mbag_r_new;
          gg.mbag_c = mbag_c_new;
          gg.refresh_display();
        }
      }
    }
  })

});




