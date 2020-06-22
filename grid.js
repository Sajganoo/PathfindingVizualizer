let removeFromArray = function(arr, element) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == element) {
            arr.splice(i, 1);
        }
    }
}

let heuristic = function(a, b) {
    return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let cols, rows, nodeSize;
let grid = [];

let openSet = [];
let closedSet = [];
let path = [];
let start, target;

const createGrid = function(width, height, cols_l, cols_l) {
    canvas.width = width;
    canvas.height = height;
    cols = cols_l;
    rows = cols_l;
    nodeSize = canvas.width / cols;
}

const initialiseNodes = function() {
    grid = new Array(cols);
    for (let x = 0; x < cols; x++) {
        grid[x] = new Array(rows);
    }

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            grid[x][y] = new Node(x, y);

            if (x === 0 && y === 0) {
                start = grid[x][y];
            } else if (x === cols-1 && y === rows-1) {
                target = grid[x][y];
            }

            grid[x][y].draw('white');
        }
    }

    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            grid[x][y].addNeighbors();
        }
    }
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.neighbors = [];
        this.previous = null;
    }
    draw(color = 'white') {
        ctx.fillStyle = color;
        ctx.fillRect(this.x * nodeSize, this.y * nodeSize, nodeSize, nodeSize);
        ctx.strokeRect(this.x * nodeSize, this.y * nodeSize, nodeSize, nodeSize);
    }
    addNeighbors() {
        let x = this.x;
        let y = this.y;
        if (x < cols - 1) {
            this.neighbors.push(grid[x+1][y]);
        }
        if (x > 0) {
            this.neighbors.push(grid[x-1][y]);
        }
        if (y < rows - 1) {
            this.neighbors.push(grid[x][y+1]);
        }
        if (y > 0) {
            this.neighbors.push(grid[x][y-1]);
        }
    }
}

createGrid(500, 500, 10, 10);
initialiseNodes();
console.log(start);
openSet.push(start);

function vizualizeAStart() {
    let id = requestAnimationFrame(vizualizeAStart);
    if (openSet.length > 0) {
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        var current = openSet[winner];

        removeFromArray(openSet, current);
        closedSet.push(current);

        let neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closedSet.includes(neighbor)) {
                let tempG = current.g + 1;

                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                    }
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                }

                neighbor.h = heuristic(neighbor, target);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
            }
        }

    } else {

    }
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].draw('white');
        }
    }

    for (let i = 0; i < closedSet.length; i++) {
        closedSet[i].draw('red');
    }

    for (let i = 0; i < openSet.length; i++) {
        openSet[i].draw('lime');
    }

    path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }

    for (let i = 0; i < path.length; i++) {
        path[i].draw('blue');
    }

    if (current === target) {
        cancelAnimationFrame(id);
    }
}

vizualizeAStart();