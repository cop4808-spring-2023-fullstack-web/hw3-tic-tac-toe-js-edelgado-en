const statusDisplay = document.querySelector('.status');

//Declare variables to keep track of the your score and the computer's score.
let score = 0;
let computerScore = 0;
const scoreDisplay = document.querySelector('.score');
const computerScoreDisplay = document.querySelector('.computer-score');


let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

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

// Randomly pick who starts - You are X, computer is O. Randomly pick a number between 0 and 1. 
let random = Math.floor(Math.random() * 2);
if (random === 0) {
    currentPlayer = "O";
    statusDisplay.innerHTML = currentPlayerTurn();
    computerTurn();
} else {
    statusDisplay.innerHTML = "Your turn";
}


/**
 * Computer's turn. Randomly pick a cell to play.
 * There are 9 cells, so the random number will be between 0 and 8.
 * if the cell is empty, play there. Otherwise, call the function again.
 * if the game is over, just return.
 * 
 * @returns {void}
 */
function computerTurn() {
    if (!gameActive) {
        return;
    }

    let random = Math.floor(Math.random() * 9);
    if (gameState[random] === "") {
        gameState[random] = "O";
        document.querySelectorAll('.cell')[random].innerHTML = "O";
        handleResultValidation();
    } else {
        computerTurn();
    }
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

/**
 * Change the current player. If the current player is X,
 * change it to O and let the computer play.
 * 
 */
function handlePlayerChange() {
    if (currentPlayer === "X") {
        currentPlayer = "O";
        statusDisplay.innerHTML = "Computer's turn";
        computerTurn();
    } else {
        currentPlayer = "X";
        statusDisplay.innerHTML = "Your turn";
    }
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
            //Highlight what tiles triggered the win - the winning squares. Should be 3 tiles.
            document.querySelectorAll('.cell')[winCondition[0]].style.color = "rgb(251,100,204)";
            document.querySelectorAll('.cell')[winCondition[1]].style.color = "rgb(251,100,204)";
            document.querySelectorAll('.cell')[winCondition[2]].style.color = "rgb(251,100,204)";
            
            //Update the score depending on who won. Update the corresponding display div.
            if (currentPlayer === "X") {
                score++;
                scoreDisplay.innerHTML = score;
            } else {
                computerScore++;
                computerScoreDisplay.innerHTML = computerScore;
            }

            break
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        statusDisplay.style.color = "rgb(251,100,204)";
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        statusDisplay.style.color = "rgb(251,100,204)";
        return;
    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.style.color = "rgb(65, 65, 65)";
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.restart').addEventListener('click', handleRestartGame);