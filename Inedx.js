class Node {
    constructor(name, data=null, visited=false, neighbors=[]) {
       this.name = name;
       this.visited = visited;
       this.neighbors = neighbors;
       this.data = data;
    }
    get_name() { 
        return this.name;
    }
    add_neighbors(neighbor){
        this.neighbors.push(neighbor);
    }
    set_visited(visited){
        this.visited = visited;
    }
    get_neighbors(){
        return this.neighbors;
    }
    is_visited(){
        return this.visited;
    }
    set_data(data){
        this.data = data;
    }
    get_data(){
        return this.data;
    }
}

class Board{
    constructor(board,turn='O',point=0){
        this.board = board;
        this.turn = turn;
        this.score = this.cal_score(point);
    }
    cal_score(point){
        if(this.turn === 'X'){
            return point;
        }else{
            return -1*point;
        }
    }
}

function BFS_print(node) {
    let root = Object.create( node );
    let queue = [];  
    root.set_visited(true);
    queue.push(root);
    while(queue.length > 0) {
        root = queue.shift();
        console.log(root.get_neighbors(),root.get_data().board,root.get_data().score);
        root.get_neighbors().forEach(v => {
            v = Object.create( v );
            if (!v.is_visited()){
                v.set_visited(true);
                queue.push(v);
            }
        });
    }
}

function BFS_search(node,children) {
    let root = Object.create( node );
    let queue = [];  
    root.set_visited(true);
    queue.push(root);
    while(queue.length > 0) {
        root = queue.shift();
        if(JSON.stringify(root.get_data().board)==JSON.stringify(children.get_data().board)){
            console.log("Has been exist", root.get_data().board);
            return root;
        } 
        root.get_neighbors().forEach(v => {
            v = Object.create( v );
            if (!v.is_visited()){
                v.set_visited(true);
                queue.push(v);
            }
        });
    }
    return false;
}

function BFS_score(node) {
    let root = Object.create( node );
    let queue = []; 
    let score = 0; 
    root.set_visited(true);
    queue.push(root);
    while(queue.length > 0) {
        root = queue.shift();
        score += root.get_data().score;
        root.get_neighbors().forEach(v => {
            v = Object.create( v );
            if (!v.is_visited()){
                v.set_visited(true);
                queue.push(v);
            }
        });
    }
    return score;
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return 1;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return 0;
    }

    handlePlayerChange();
    return 0;
}

function game(){
    if(currentPlayer === 'O'){
        let choose = null;
        let min = Number.MAX_VALUE;
        for(let n of move[0].get_neighbors()){
            if(BFS_score(n)<min && n){
                choose = n;
            }
        }
        if(!choose){
            rand = Math.floor(Math.random() * 8);
            while (gameState[rand] !== "") {
                gameState[rand] = 'O';
            }
        }else{
            console.log(choose);
            gameState = choose.get_data().board.slice();
        }
        document.querySelectorAll('.cell')[rand].innerHTML = currentPlayer;
    }

}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }
    handleCellPlayed(clickedCell, clickedCellIndex);
    let child = new Node(0,new Board(gameState.slice(),currentPlayer,handleResultValidation()));
    let check_exsit = BFS_search(root,child);
    if(!check_exsit) {
        move.pop().add_neighbors(child);
        move.push(child);
    }else{
        move.pop().add_neighbors(check_exsit);
        move.push(check_exsit);
    }
}

function handleRestartGame() {
    BFS_print(root);
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    move.pop();
    move.push(root);
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}
// Game part 

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

const statusDisplay = document.querySelector('.game--status');
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const move = [];
const root = new Node(0,new Board(gameState.slice(),currentPlayer,handleResultValidation()));
statusDisplay.innerHTML = currentPlayerTurn();
move.push(root);

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);