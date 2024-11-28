const numGrids = 3;
const wallProbability = .1;

const ARROWS = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1]
}

const NO_SOLUTION = 'NO SOLUTION FROM THIS POINT';
const SOLVED = 'SOLVED'
console.log(window.location.href)
function load_grids(puzzle) {
  if (!(puzzle.length === numGrids)) {
    throw "error";
  }
  let res = [];
  for (let i = 0; i < puzzle.length; i++) {
    let obj = puzzle[i];
    let [g_r, g_c] = obj.goal;
    let [m_r, m_c] = obj.mbag_start;
    res.push(new GameGrid(i, obj.num_rows, obj.num_cols, g_r, g_c, m_r, m_c, obj.walls))
  }
  return res;
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

function zip(...arrays) {
  const shortestLength = Math.min(...arrays.map(arr => arr.length));
  return Array.from({ length: shortestLength }, (_, i) =>
      arrays.map(arr => arr[i])
  );
}

const container = document.getElementById("container");

class GameGrid {
  constructor(grid_index, num_rows, num_cols, goal_r, goal_c, mbag_r, mbag_c, walls) {
    this.grid_index = grid_index;
    this.num_rows = num_rows;
    this.num_cols = num_cols;
    this.goal_r = goal_r;
    this.goal_c = goal_c;
    this.mbag_r = mbag_r;
    this.mbag_c = mbag_c;
    this.mbag_start_r = mbag_r;
    this.mbag_start_c = mbag_c;
    this.walls = new Set(walls.map(arr => JSON.stringify(arr)));

    this.mbag_image_element = document.createElement("img");
    this.mbag_image_element.src = "favicon2.ico";
    this.mbag_image_element.style.objectFit = "cover";

  }

  set_up_display() {
    const grid_element = this.create_grid_element();
    container.appendChild(grid_element);
    this.refresh_display()
  }

  reset() {
    this.mbag_r = this.mbag_start_r;
    this.mbag_c = this.mbag_start_c;
    this.refresh_display();
  }



  is_solved() {
    return this.mbag_r === this.goal_r && this.mbag_c === this.goal_c;
  }

  has_wall(r, c, r_neighbor, c_neighbor) {
    let cell = [r, c];
    let cell_neighbor = [r_neighbor, c_neighbor];
    return this.walls.has(JSON.stringify([cell, cell_neighbor])) || this.walls.has(JSON.stringify([cell_neighbor, cell]));
  }

  has_coord(r, c) {
    return in_pyrange(r, 0, this.num_rows) && in_pyrange(c, 0, this.num_cols);
  }

  can_move_to(r, c) {
    return this.has_coord(r, c) && !this.has_wall(this.mbag_r, this.mbag_c, r, c);
  }

  can_move_from_to(r0, c0, r1, c1) {
    return this.has_coord(r1, c1) && !this.has_wall(r0, c0, r1, c1);
  }

  peek_next(r0, c0, unit_vec) {
    let [r_next, c_next] = [r0 + unit_vec[0], c0 + unit_vec[1]];
    if (this.can_move_from_to(r0, c0, r_next, c_next)) {
      return [r_next, c_next];
    } else {
      return [r0, c0];
    }
  }

  get_cell_element_id_name(cell_index) {
    return "grid" + this.grid_index + "cell" + cell_index;
  }

  create_grid_element() {
    const grid_element = document.createElement("div");
    grid_element.classList.add("grid");
    grid_element.id = `grid${this.grid_index}`;

    grid_element.style.setProperty('--grid-rows', this.num_rows);
    grid_element.style.setProperty('--grid-cols', this.num_cols);
    for (let r = 0; r < this.num_rows; r++) {
      for (let c = 0; c < this.num_cols; c++) {
        let cell_index = this.num_cols*r + c
        let cell = document.createElement("div");
        cell.setAttribute("id", this.get_cell_element_id_name(cell_index))
        if (r === this.goal_r && c === this.goal_c) {
          cell.style.setProperty("background-color", "lightgreen")
        }
        cell.className = "grid-item";

        if (r === this.num_rows-1 || this.has_wall(r, c, r+1, c)) {
          cell.style.setProperty("border-bottom", "2px solid black")
        }
        if (r === 0 || this.has_wall(r, c, r-1, c)) {
          cell.style.setProperty("border-top", "2px solid black")
        }
        if (c === this.num_cols-1 || this.has_wall(r, c, r, c+1)) {
          cell.style.setProperty("border-right", "2px solid black")
        }
        if (c === 0 || this.has_wall(r, c, r, c-1)) {
          cell.style.setProperty("border-left", "2px solid black")
        }
        grid_element.appendChild(cell);
      }
    }
    return grid_element;
  }

  refresh_display() {
    for (let r = 0; r < this.num_rows; r++) {
      for (let c = 0; c < this.num_cols; c++) {
        let cell_index = this.num_cols*r + c
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

function generate_walls(probability, num_rows, num_cols) {
  let res = [];
  for (let r = 0; r < num_rows; r++) {
    for (let c = 0; c < num_cols-1; c++) {
      if (Math.random() < probability) {
        res.push([[r,c],[r,c+1]])
      }
    }
  }
  for (let r = 0; r < num_rows-1; r++) {
    for (let c = 0; c < num_cols; c++) {
      if (Math.random() < probability) {
        res.push([[r,c],[r+1,c]])
      }
    }
  }
  return res;

}

function generate_random_grid(i, num_rows, num_cols) {
  return new GameGrid(i, num_rows, num_cols, rand_int(num_rows), rand_int(num_cols),rand_int(num_rows),rand_int(num_cols), generate_walls(wallProbability, num_rows, num_cols));
}


function generate_random_grids(num_rows, num_cols) {
  return Array.from(arrayRange(0, numGrids, 1), (i) => generate_random_grid(i, num_rows, num_cols));
}

function get_neighbors(grids, multicell) {

  return Array.from(
      Object.values(ARROWS),
      (arrow) =>
          Array.from(
            zip(grids, multicell),
              ([gg, [r, c]]) => gg.peek_next(r, c, arrow)
          )
  )
}

function all_solved(grids) {
  return grids.every(grid => grid.is_solved())
}

function are_boring(grids) {
  let goal_r_0 = grids[0].goal_r;
  let goal_c_0 = grids[0].goal_c;
  if (grids.every(grid => grid.goal_r === goal_r_0 && grid.goal_c === goal_c_0)) {
    return true;
  }

  let delta_r_0 = grids[0].goal_r - grids[0].mbag_r;
  let delta_c_0 = grids[0].goal_c - grids[0].mbag_c;

  if (grids.every(grid => grid.goal_r - grid.mbag_r === delta_r_0 && grid.goal_c - grid.mbag_c === delta_c_0)) {
    return true;
  }

  return false;
}

function solve(grids) {
  if (all_solved(grids)) {
    return SOLVED
  }
  let start_multicell = JSON.stringify(Array.from(grids, (grid) => [grid.mbag_r, grid.mbag_c]));
  let goal_multicell = JSON.stringify(Array.from(grids, (grid) => [grid.goal_r, grid.goal_c]));
  let explored = {};
  explored[start_multicell] = '';
  let to_explore = [start_multicell];

  function expand_explored() {
    let new_items = [];
    to_explore.forEach(multicell => {
      let neighbors = get_neighbors(grids, JSON.parse(multicell));
      let x = zip(Object.keys(ARROWS), neighbors);
      x.forEach(([arrow_key, neighbor]) => {
        let jsn = JSON.stringify(neighbor);
        if (!explored.hasOwnProperty(jsn)) {
          explored[jsn] = explored[multicell] + arrow_key[5];
          new_items.push(jsn)
        }
      });
    });
    if (new_items.length > 0) {
      to_explore = new_items;
      if (!explored.hasOwnProperty(goal_multicell)) {
        expand_explored()
      }
    }
  }

  expand_explored()
  return explored[goal_multicell] || NO_SOLUTION



}

let grids = [];

document.addEventListener('keydown', function(event) {
  if (ARROWS.hasOwnProperty(event.key)) {
    if (!grids.every(grid => grid.is_solved())) {
      grids.forEach((gg, i) => {
        let mbag_r_new = gg.mbag_r + ARROWS[event.key][0];
        let mbag_c_new = gg.mbag_c + ARROWS[event.key][1];
        if (gg.can_move_to(mbag_r_new, mbag_c_new)) {
          gg.mbag_r = mbag_r_new;
          gg.mbag_c = mbag_c_new;
          gg.refresh_display();
        }
      })
      if (all_solved(grids)) {
        solutionLabel.textContent = SOLVED;
      }
    }
  }

});
let sol = NO_SOLUTION;
while (sol === NO_SOLUTION) {
  grids = generate_random_grids(3,2);
  if (!are_boring(grids)) {
    sol = solve(grids);
  }
}
grids.forEach((grid) => grid.set_up_display());
let solutionLabel = document.getElementById("solutionLabel");
solutionLabel.textContent = '';


function refresh_solution_label() {
  solutionLabel.textContent = solve(grids);
}

function reset_grids() {
  grids.forEach((grid) => grid.reset());
}




