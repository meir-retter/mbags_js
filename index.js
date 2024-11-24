const numGrids = 2;
const numRows = 3;
const numCols = 3;

class GameGrid {
  constructor(grid_index, goal_r, goal_c, mbag_r, mbag_c) {
    this.grid_index = grid_index;
    this.num_rows = numRows;
    this.num_cols = numCols;
    this.goal_r = goal_r;
    this.goal_c = goal_c;
    this.mbag_r = mbag_r;
    this.mbag_c = mbag_c;
  }

  get_grid_element() {
    return document.getElementById("grid" + this.grid_index);
  }

  set_up() {
    let grid_element = this.get_grid_element();
    grid_element.style.setProperty('--grid-rows', numRows);
    grid_element.style.setProperty('--grid-cols', numCols);
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        let cell_num = 3*r + c
        let cell = document.createElement("div");
        cell.setAttribute("id", "grid" + this.grid_index + "cell" + cell_num)
        cell.innerText = ".";
        cell.className = "grid-item";
        grid_element.appendChild(cell);
      }
    }
  }

  refresh() {
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        let cell_num = 3*r + c
        let cell = document.getElementById("grid" + this.grid_index + "cell" + cell_num);
        let symbol;
        if (r === this.mbag_r && c === this.mbag_c) {
          symbol = "M"
        } else if (r === this.goal_r && c === this.goal_c) {
          symbol = "G"
        } else {
          symbol = "."
        }
        cell.innerText = symbol;
      }
    };
  }
}



let grids = [];
for (let i = 0; i < numGrids; i++) {
  grid = new GameGrid(i, 0, 0,0,1);
  grid.set_up()
  grid.refresh()
  grids.push(grid)
}

document.addEventListener('keydown', function(event) {
  grids.forEach((gg, i) => {
    if (event.key === 'ArrowUp') {
      gg.mbag_r -= 1
    } else if (event.key === 'ArrowDown') {
      gg.mbag_r += 1
    } else if (event.key === 'ArrowLeft') {
      gg.mbag_c -= 1
    } else if (event.key === 'ArrowRight') {
      gg.mbag_c += 1
    }
    gg.refresh()
  })

});




