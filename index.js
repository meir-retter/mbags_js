const numGrids = 2;
const wallProbability = .2;

const ARROWS = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1]
}

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
    this.mbag_mbag_start_c = mbag_c;
    this.walls = new Set(walls.map(arr => JSON.stringify(arr)));

    this.mbag_image_element = document.createElement("img");
    this.mbag_image_element.src = "favicon2.ico";
    this.mbag_image_element.style.objectFit = "cover";
    this.set_up_display()

  }

  set_up_display() {
    const grid_element = this.create_grid_element();
    container.appendChild(grid_element);
    this.refresh_display()
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

  peek_next(r0, c0, unit_vec) {
    let [r_next, c_next] = [r0 + unit_vec[0], c0 + unit_vec[1]];
    if (this.can_move_to(r_next, c_next)) {
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

function solve(grids) {
  let start_multicell = Array.from(grids, (grid) => [grid.mbag_r, grid.mbag_c]);
  console.log(start_multicell);
  let goal_multicell = Array.from(grids, (grid) => [grid.goal_r, grid.goal_c]);
  console.log(goal_multicell);
  let explored = {};
  explored[start_multicell] = '';

  function expand_explored() {
    let newly_explored = {};
    Object.keys(explored).forEach(multicell => {
      let neighbors = get_neighbors(grids, multicell);
      // console.log('neighbors', neighbors);
      zip(Object.keys(ARROWS), neighbors).forEach(([arrow_key, neighbor]) => {
        // console.log(arrow_key);
        // console.log(neighbor);
        console.log(arrow_key);
        console.log(neighbor)
        if (!explored.hasOwnProperty(neighbor)) {
          newly_explored[neighbor] = explored[multicell] + arrow_key[5]
        }
      });
    });
    if (Object.keys(newly_explored).length > 0) {
      Object.assign(explored, newly_explored);
      console.log(explored);
      if (!explored.hasOwnProperty(goal_multicell)) {
        expand_explored()
        // console.log(explored);
      }
    }
  }

  expand_explored()
  return explored[goal_multicell] || 'NO SOLUTION'



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
    }
  }

});

// grids = generate_random_grids(5,3);
grids = load_grids(puzzle1)
console.log(get_neighbors(grids, [[2,2],[2,2]]));
let s = solve(grids);
console.log(s)



