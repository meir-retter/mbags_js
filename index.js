

class GameGrid {
  constructor(num_rows, num_cols, goal_r, goal_c, mbag_r, mbag_c) {
    this.num_rows = num_rows
    this.num_cols = num_cols
    this.goal_r = goal_r;
    this.goal_c = goal_c;
    this.mbag_r = mbag_r;
    this.mbag_c = mbag_c;
  }
}

const container = document.getElementById("container");
function makeRows(rows, cols) {
  container.style.setProperty('--grid-rows', rows);
  container.style.setProperty('--grid-cols', cols);
  for (r = 0; r < rows; r++) {
    for (c = 0; c < cols; c++) {
      cell_num = 3*r + c
      let cell = document.createElement("div");
      cell.setAttribute("id", "cell" + cell_num)
      cell.innerText = ".";
      container.appendChild(cell).className = "grid-item";
    }
  };
};

function populateRows(rows, cols, goal_r, goal_c, mbag_r, mbag_c) {
  for (r = 0; r < rows; r++) {
    for (c = 0; c < cols; c++) {
      cell_num = 3*r + c
      let cell = document.getElementById("cell" + cell_num);
      let symbol;
      if (r === mbag_r && c === mbag_c) {
        symbol = "M" 
      } else if (r === goal_r && c === goal_c) {
        symbol = "G"
      } else {
        symbol = "."
      }
      cell.innerText = symbol;
      container.appendChild(cell).className = "grid-item";
    }
  };
};

let gg = new GameGrid(3, 3, 0,0,0,1);
makeRows(gg.num_rows, gg.num_cols);
populateRows(gg.num_rows, gg.num_cols, gg.goal_r, gg.goal_c, gg.mbag_r, gg.mbag_c);

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp') {
    gg.mbag_r -= 1
  } else if (event.key === 'ArrowDown') {
    gg.mbag_r += 1
  } else if (event.key === 'ArrowLeft') {
    gg.mbag_c -= 1
  } else if (event.key === 'ArrowRight') {
    gg.mbag_c += 1
  }
  populateRows(gg.num_rows, gg.num_cols, gg.goal_r, gg.goal_c, gg.mbag_r, gg.mbag_c);
});




