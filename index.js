// --- Subsystem 1: The Game Board ---
// Manages the state of the 3x3 grid.
class GameBoard {
    constructor() {
        this.board = [
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ];
    }

    print() {
        console.log('\n  0   1   2'); // Column headers
        console.log(' ---+---+---');
        this.board.forEach((row, index) => {
            console.log(`${index}| ${row.join(' | ')} `); // Row content
            if (index < 2) {
                console.log(' ---+---+---');
            }
        });
        console.log(' ---+---+---');
    }

    placeMark(player, row, col) {
        if (this.board[row][col] === ' ') {
            this.board[row][col] = player;
            return true; // Move was successful
        }
        return false; // Cell was already taken
    }
    
    isFull() {
        return this.board.every(row => row.every(cell => cell !== ' '));
    }

    reset() {
        this.board = [
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ];
    }
}


// --- Subsystem 2: The Game Logic ---
// Manages the rules, turns, and win conditions.
class GameLogic {
    constructor() {
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.winner = null;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    checkWinner(board) {
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

        for (const combo of winningCombos) {
            if (combo[0] !== ' ' && combo[0] === combo[1] && combo[1] === combo[2]) {
                this.gameOver = true;
                this.winner = combo[0];
                return true; // A winner was found
            }
        }
        return false; // No winner yet
    }
    
    reset() {
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.winner = null;
    }
}


// --- The Facade ---
// The simplified interface that hides the complexity of the subsystems.
class TicTacToeFacade {
    constructor() {
        this.board = new GameBoard();
        this.logic = new GameLogic();
    }

    // A clean method for a player to attempt a move
    makeMove(row, col) {
        // Use the subsystems to perform the action
        if (this.board.placeMark(this.logic.currentPlayer, row, col)) {
            // After a successful move, check the game status
            if (this.logic.checkWinner(this.board.board)) {
                console.log(`\n Congratulations! Player '${this.logic.winner}' wins! `);
            } else if (this.board.isFull()) {
                this.logic.gameOver = true;
                console.log("\n It's a draw! Good game. ");
            } else {
                this.logic.switchPlayer();
            }
            return true; // Move was successful
        }
        return false; // Move was invalid
    }

    // A simple method to start a new game
    startNewGame() {
        this.board.reset();
        this.logic.reset();
        console.log('\n--- New Game Started! ---');
    }

    // Helper methods to give the client controlled access to game state
    isGameOver() {
        return this.logic.gameOver;
    }

    getCurrentPlayer() {
        return this.logic.currentPlayer;
    }
    
    printBoard() {
        this.board.print();
    }
}

/**
 * Runs a non-interactive demo game using the facade.
 */
function runDemoGame(game) {
    console.log("\n--- Running a Non-Interactive Demo ---");
    const moves = [[0,0], [1,1], [0,1], [1,0], [0,2]];
    game.printBoard();
    for(const move of moves) {
        const [row, col] = move;
        console.log(`\nPlayer '${game.getCurrentPlayer()}' moves to ${row},${col}`);
        game.makeMove(row, col);
        game.printBoard();
        if (game.isGameOver()) break;
    }
}


// --- Main Execution ---
// We'll try to run the interactive version, but fall back to a demo if it fails.
try {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const game = new TicTacToeFacade(); // Create the game using our simple facade

    function playTurn() {
        if (game.isGameOver()) {
            rl.question("Play again? (yes/no): ", (answer) => {
                if (answer.toLowerCase() === 'yes') {
                    game.startNewGame();
                    playTurn();
                } else {
                    console.log("Thanks for playing!");
                    rl.close();
                }
            });
            return;
        }
        
        game.printBoard();
        const player = game.getCurrentPlayer();
        rl.question(`Player '${player}', enter your move (row,col): `, (input) => {
            const [row, col] = input.split(',').map(num => parseInt(num.trim(), 10));

            if (isNaN(row) || isNaN(col) || row < 0 || row > 2 || col < 0 || col > 2) {
                console.log(" Invalid input. Please use the format 'row,col' (e.g., '1,2').");
                playTurn();
                return;
            }

            if (!game.makeMove(row, col)) {
                console.log(" That spot is already taken! Try another one.");
            }
            
            playTurn();
        });
    }

    console.log("--- Welcome to Console Tic Tac Toe! ---");
    playTurn();

} catch (error) {
    console.log("--- Interactive Console Not Available ---");
    console.log("This script requires a Node.js terminal to be run interactively.");
    const demoGame = new TicTacToeFacade();
    runDemoGame(demoGame);
}

