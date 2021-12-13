const { is } = require("cheerio/lib/api/attributes");

function seed(...args) {
    return args;
}

function same([x, y], [j, k]) {
    return (x == j) && (y == k);
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
    let found = false;
    [x, y] = cell;

    this.forEach((element) => {
        [j, k] = element;
        if (x === j && y === k) {
            found = true;
        }
    });
    return found;
}

const printCell = (cell, state) => {
    return contains.call(state, cell) ? '\u25A3' : '\u25A2';
};

const corners = (state = []) => {
    let maiorX = 0;
    let maiorY = 0;
    let menorX = 0;
    let menorY = 0;
    for (let index = 0; index < state.length; index++) {
        const element = state[index];
        [x, y] = element;
        if (index == 0) {
            maiorX = x;
            maiorY = y;
            menorX = x;
            menorY = y;
        } else {
            if (x > maiorX) maiorX = x;
            if (y > maiorY) maiorY = y;
            if (x < menorX) menorX = x;
            if (y < menorY) menorY = y;
        }
    }
    return { topRight: [maiorX, maiorY], bottomLeft: [menorX, menorY] };
};

const printCells = (state) => {
    texto = '';
    let { topRight, bottomLeft } = corners(state);
    for (let coluna = topRight[1]; coluna >= bottomLeft[1]; coluna--) {
        for (let linha = bottomLeft[0]; linha <= topRight[0]; linha++) {
            texto += (printCell([linha, coluna], state) + ' ');
        }
        texto += '\n';
    }
    return texto;
};
// ENTRADA
// printCells([
//     [3, 1],
//     [2, 3],
//     [3, 3],
//     [3, 4],
//     [4, 5]
// ]);
// SAÍDA
// o o x
// o x o
// x x o
// o o o
// o x o

const getNeighborsOf = ([x, y]) => {
    neighbors = [];
    [menorX, menorY] = [x - 1, y - 1];
    [maiorX, maiorY] = [x + 1, y + 1];
    for (let coluna = menorY; coluna <= maiorY; coluna++) {
        for (let linha = menorX; linha <= maiorX; linha++) {
            if (x != linha || y != coluna) {
                neighbors.push([linha, coluna]);
            }
        }
    }
    return neighbors;
};

const getLivingNeighbors = (cell, state) => {
    result = [];
    neighbors = getNeighborsOf(cell);
    neighbors.forEach(element => {
        if (contains.call(state, element))
            result.push(element);
    });
    return result;
};

const willBeAlive = (cell, state) => {
    neighbors = getLivingNeighbors(cell, state);
    return (neighbors.length == 3 || (contains.call(state, cell) && neighbors.length == 2));
};

const calculateNext = (state) => {
    result = [];
    let { topRight, bottomLeft } = corners(state);
    // console.log(topRight, bottomLeft);
    topRight = [topRight[0] + 1, topRight[1] + 1];
    bottomLeft = [bottomLeft[0] - 1, bottomLeft[1] - 1];
    // console.log(topRight, bottomLeft);
    for (let coluna = bottomLeft[1]; coluna <= topRight[1]; coluna++) {
        for (let linha = bottomLeft[0]; linha <= topRight[0]; linha++) {
            // console.log('Entrou');
            // console.log([linha, coluna]);
            if (willBeAlive([linha, coluna], state)) {
                // console.log('Saida');
                // console.log([linha, coluna]);
                result.push([linha, coluna]);
            }
        }
    }
    return result;
};
// calculateNext([
//     [2, 2],
//     [3, 2],
//     [2, 3],
//     [2, 4],
//     [3, 4],
//     [4, 4]
// ]);
const iterate = (state, iterations) => {
    result = [];
    for (let index = 0; index < iterations; index++) {
        result.push(calculateNext(state));
    }
    return result;
};

const main = (pattern, iterations) => {
    state = startPatterns[pattern];
    printCells(state);
    for (let index = 0; index < iterate(state, iterations); index++) {
        const element = iterate(state, iterations)[index];
        printCells(element);
    }
};

const startPatterns = {
    rpentomino: [
        [3, 2],
        [2, 3],
        [3, 3],
        [3, 4],
        [4, 4]
    ],
    glider: [
        [-2, -2],
        [-1, -2],
        [-2, -1],
        [-1, -1],
        [1, 1],
        [2, 1],
        [3, 1],
        [3, 2],
        [2, 3]
    ],
    square: [
        [1, 1],
        [2, 1],
        [1, 2],
        [2, 2]
    ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
        main(pattern, parseInt(iterations));
    } else {
        console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;