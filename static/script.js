

const numRows =6;
const numCols =7;
let gameBoard = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
let playerturn = 1;
let mode = 0;

const playerVsEasyBotOption = document.getElementById("playerVsEasyBot");
const playerVsMediumBotOption = document.getElementById("playerVsMediumBot");
const playerVsImpossibleOption = document.getElementById("playerVsImpossible");

playerVsEasyBotOption.addEventListener('click', function(){
  mode  = 1
});

playerVsMediumBotOption.addEventListener('click', function(){
  mode = 2
});

playerVsImpossibleOption.addEventListener('click', function(){
  mode = 3
});
const gridItems = document.querySelectorAll(".grid-item");

gridItems.forEach(gridItems => {
  gridItems.addEventListener('click', handleGridItemClick)
  gridItems.addEventListener('mouseover', handleGridItemMouseOver)
});

function handleGridItemMouseOver(event) {
  if (!event.target.classList.contains('filled')) {
    const colIndex = event.target.id % numCols;
    // Find the lowest empty cell in the selected column
    const rowIndex = findLowestEmptyCell(colIndex);
    for(let h = 0; h<numCols; h++) {
      const daRow =findLowestEmptyCell(h)
      if (daRow == -1) {
        continue

      }
      const theOthers = gridItems[daRow* numCols + h]
      theOthers.querySelector(".connect4-piece").classList.remove('highlight')
    }
    if (rowIndex !== -1) {
      const highlightedCell = gridItems[rowIndex * numCols + colIndex]
      highlightedCell.querySelector(".connect4-piece").classList.add('highlight')
    }    
  }
}
function makeMove (rowIndex, colIndex){
      gameBoard[rowIndex][colIndex] = playerturn;

      // Update the visual appearance of the cell
      const lowestEmptyCell = gridItems[rowIndex * numCols + colIndex];
      console.log(lowestEmptyCell)

      lowestEmptyCell.classList.add('filled', `player-${playerturn}`);
      if (playerturn == 1) {
        makeItFall(rowIndex,colIndex)
        lowestEmptyCell.querySelector(".connect4-piece").classList.add('blue');
        // Remove the 'red' class if it's present
        lowestEmptyCell.querySelector(".connect4-piece").classList.remove('red');
        lowestEmptyCell.querySelector(".connect4-piece").classList.remove('highlight');
      } else {
        makeItFall(rowIndex,colIndex)
        console.log(lowestEmptyCell)
        lowestEmptyCell.querySelector(".connect4-piece").classList.add('red');
        // Remove the 'blue' class if it's present
        lowestEmptyCell.querySelector(".connect4-piece").classList.remove('blue');
        lowestEmptyCell.querySelector(".connect4-piece").classList.remove('highlight');
      }
      
      
      if (checkWin(rowIndex,colIndex)) {
        alert("player "+ playerturn + " wins!");
      }
}
// Function to handle grid item click
async function handleGridItemClick(event) {
  if (!event.target.classList.contains('filled')) {
    // Get the clicked cell's column index
    const colIndex = event.target.id % numCols;
    // Find the lowest empty cell in the selected column
    const rowIndex = findLowestEmptyCell(colIndex);
    if (rowIndex !== -1) {
      // Update the game board
      makeMove(rowIndex, colIndex)
      
      if (playerturn == 1) {
        console.log("turn switched here")
        playerturn = 2;
      } else {
        playerturn = 1;
      }


      if(mode==1){
        const aistring = await processFile("/getMove1", gameBoard)
        const aiCol = parseInt(aistring)
        const aiRow = findLowestEmptyCell(aiCol)
        console.log(playerturn)
        makeMove(aiRow, aiCol)
        playerturn = 1
      }

      if(mode==2){
        const aistring = await processFile("/getMove2", gameBoard)
        const aiCol = parseInt(aistring)
        const aiRow = findLowestEmptyCell(aiCol)
        console.log('why')
        makeMove(aiRow,aiCol)
        playerturn = 1
      }

      if(mode==3){
        const aistring = await processFile("/getMove3", gameBoard)
        const aiCol = parseInt(aistring)
        console.log(aiCol)
        const aiRow = findLowestEmptyCell(aiCol)
        
        makeMove(aiRow, aiCol)
        playerturn = 1
      }

    
    }
  }
}
function makeItFall(rowIndex, colIndex) {
  for (let x = 0; x < rowIndex; x++) {
    const theBlip = gridItems[x * numCols + colIndex].querySelector(".connect4-piece");
    setTimeout(() => animate(theBlip), 20 * x); // Delay each animation by 1000ms (1 second)
  }
}

function animate(cell) {
  if (playerturn == 2) {
    cell.classList.add('blue');
    setTimeout(() => cell.classList.remove('blue'), 20); // Remove 'blue' class after 100ms
  } else {
    cell.classList.add('red');
    setTimeout(() => cell.classList.remove('red'), 20); // Remove 'red' class after 100ms
  } 
}

function findLowestEmptyCell(colIndex) {
  for (let row = numRows - 1; row >= 0; row--) {
    if (gameBoard[row][colIndex] === 0) {
      return row;
    }
  }
  return -1
}


function checkWin(rowIndex, col_index) {
  if (checkRow(rowIndex) || checkCol(rowIndex, col_index) || checkSL(rowIndex, col_index) || checkSR(rowIndex, col_index) ){
    return true
  } 

  return false;
}

function VerifyArray(arrayOfFour) {
  let theFour = true
  for(x = 0; x<4; x++) {
    if (playerturn != arrayOfFour[x]){
      
      theFour = false
    }

  }
return theFour;
}

function checkCol(rowIndex, col_index) {

  for(x = 0; x<4; x++) {
    if (rowIndex + x >= numRows) {
      return false;
    }
    if (playerturn != gameBoard[rowIndex+x][col_index]) {
      return false;
    }
  }
  return true;
}

function checkRow(rowIndex) {
  const returnerRow = [0, 0, 0, 0]
  for(let x = 0; x < 4; x++) {
    for(let j = 0; j<4; j++) {
      returnerRow[j] = gameBoard[rowIndex][x+j]
    }
    if(VerifyArray(returnerRow)) {
      console.log("called here")
      return true;

    }
  }
  return false;
}

function checkSL(rowIndex, col_index) {  
  for (let x = 0; x < 4; x++) {
    const returnerSL = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      const new_x = rowIndex + i - x;
      const new_y = col_index + i - x;
      
      if (new_x >= numRows || new_x < 0 || new_y >= numCols || new_y < 0) {
        continue;
      }
      
      returnerSL[i] = gameBoard[new_x][new_y];
    }
    // console.log("returnerSL:", returnerSL);

    if (VerifyArray(returnerSL)) {
      console.log("Sl")
      return true;
    }
  }
  
  return false;
}


function checkSR(rowIndex, col_index) {
  const returnerSR = [0, 0, 0, 0]

  for(let x = 3 ; x > -1 ; x--) {
    const returnerSR = [0, 0, 0, 0]
    for(let i = 0; i < 4; i++) {
      console.log(col_index)
      const new_x = rowIndex - i + x;
      const new_y = col_index + i - x;
      if (new_x >= numRows || new_x <0 || new_y >= numCols || new_y <0){
        continue;
      }
      returnerSR[i] = gameBoard[new_x][new_y]
    }
    if(VerifyArray(returnerSR)) {
      console.log(returnerSR)
      return true;
    }
  }
  return false;
}

function processFile(url, board) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
            resolve(xhr.response);
        } else {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        }
    };
    xhr.onerror = function () {
        reject({
            status: this.status,
            statusText: xhr.statusText
        });
    };
    xhr.send(JSON.stringify(board));
  });
}