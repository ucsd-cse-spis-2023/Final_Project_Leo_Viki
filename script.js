// JavaScript to add event listeners to each grid item
const gridItems = document.querySelectorAll(".grid-item");

const numRows =6;
const numCols =7;
let Gameboard = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
let playerturn = 1;

gridItems.forEach(gridItems => {
  gridItems.addEventListener('click', handleGridItemClick)
});

// Function to handle grid item click
function handleGridItemClick(event) {
  if (!isGameOver() && !event.target.classList.contains('filled')) {
    // Get the clicked cell's column index
    const colIndex = Array.from(gridItems).indexOf(event.target) % numCols;

    // Find the lowest empty cell in the selected column
    const rowIndex = findLowestEmptyCell(colIndex);

    if (rowIndex !== -1) {
      // Update the game board
      gameBoard[rowIndex][colIndex] = currentPlayer;

      // Update the visual appearance of the cell
      const lowestEmptyCell = gridItems[rowIndex * numCols + colIndex];

      lowestEmptyCell.classList.add('filled', `player-${currentPlayer}`);



    }
  }
}
function findLowestEmptyCell(colindex) {
  for (let row = numRows - 1; row >= 0; row--) {
    if (gameBoard[row][colIndex] === 0) {
      return row;
    }
  }
  return -1
}


function checkWin(rowIndex, col_index) {
  let output = false
  if (!checkRow( col_index) || !checkCol(rowIndex) || !checkSL(rowIndex, col_index) || !checkSR(rowIndex, col_index) ){
    output = true
  } 

  return output;
}

function checkRow