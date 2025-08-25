// --- Game State ---
// This object holds all the data for our game.
let gameState = {
    board: [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ],
    currentPlayer: 'X',
    gameOver: false
};


function printBoard() {
    console.log('\n  0   1   2'); // Column headers
    console.log(' ---+---+---');
    gameState.board.forEach((row, index) => {
        console.log(`${index}| ${row.join(' | ')} `); // Row content
        if (index < 2) {
            console.log(' ---+---+---');
        }
    });
    console.log(' ---+---+---');
}

/**
 * Checks if the last move resulted in a win.
 * @returns {boolean} - True if the current player has won, false otherwise.
 */
function checkWinner() {
    const player = gameState.currentPlayer;
    const board = gameState.board;
    const winningCombos = [
        // Rows
        [board[0][0], board[0][1], board[0][2]],
        [board[1][0], board[1][1], board[1][2]],
        [board[2][0], board[2][1], board[2][2]],
        // Columns
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],
        // Diagonals
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]],
    ];

    // Check if any winning combination is met for the current player
    for (const combo of winningCombos) {
        if (combo.every(cell => cell === player)) {
            return true;
        }
    }
    return false;
}

/**
 * Checks if the game is a draw (all cells are filled).
 * @returns {boolean} - True if the board is full, false otherwise.
 */
function checkDraw() {
    return gameState.board.every(row => row.every(cell => cell !== ' '));
}

/**
 * Switches the turn 
 */
function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
}

/**
 * Resets the game to its initial state to play again.
 */
function resetGame() {
    gameState.board = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
    gameState.currentPlayer = 'X';
    gameState.gameOver = false;
    console.log('\n--- New Game Started! ---');
}


function runDemoGame() {
    console.log("\n--- Running a Non-Interactive Demo ---");
    
    const moves = [[0,0], [1,1], [0,1], [1,0], [0,2]];
    
    printBoard();

    for(const move of moves) {
        const [row, col] = move;
        console.log(`\nPlayer '${gameState.currentPlayer}' moves to ${row},${col}`);
        gameState.board[row][col] = gameState.currentPlayer;
        printBoard();

        if (checkWinner()) {
            console.log(`\n Player '${gameState.currentPlayer}' wins! `);
            return;
        }
        if (checkDraw()) {
            console.log("\n It's a draw! ");
            return;
        }
        switchPlayer();
    }
}



try {
    // This code requires a Node.js terminal environment to run.
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    /**
     * flow of the  game.
     */
    function playTurn() {
        printBoard();
        const player = gameState.currentPlayer;
        rl.question(`Player '${player}', enter your move (row,col): `, (input) => {
            const [row, col] = input.split(',').map(num => parseInt(num.trim(), 10));

            if (isNaN(row) || isNaN(col) || row < 0 || row > 2 || col < 0 || col > 2) {
                console.log("Invalid input. Please use the format 'row,col' (e.g., '1,2').");
                playTurn();
                return;
            }

            if (gameState.board[row][col] !== ' ') {
                console.log(" That spot is already taken! Try another one.");
                playTurn();
                return;
            }

            gameState.board[row][col] = player;

            if (checkWinner()) {
                printBoard();
                console.log(`\nCongratulations! Player '${player}' wins!`);
                gameState.gameOver = true;
            } else if (checkDraw()) {
                printBoard();
                console.log("\nIt's a draw! Good game.");
                gameState.gameOver = true;
            }

            if (gameState.gameOver) {
                rl.question("Play again? (yes/no): ", (answer) => {
                    if (answer.toLowerCase() === 'yes') {
                        resetGame();
                        playTurn();
                    } else {
                        console.log("Thanks for playing!");
                        rl.close();
                    }
                });
            } else {
                switchPlayer();
                playTurn();
            }
        });
    }

    console.log("--- Welcome to Console Tic Tac Toe! ---");
    playTurn();

} catch (error) {
    console.log("--- Interactive Console Not Available ---");
    console.log("This script requires a Node.js terminal to be run interactively.");
    runDemoGame();
}
