let board;
//It will contain the current state of the board.
let score = 0;
//It will monitor the current score of the user.
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
//Variables for checking win

//We will use array of arrays in board (also nested array, 2d array, or matrix).

function setGame() {
//A function that will set the game board.

	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]
	// board = [
	// 	[0, 2, 4, 8],

	// ]

	for(let r = 0; r < rows; r++) {
		for(let c = 0; c < columns; c++) {
			let tile = document.createElement("div");
			//Created <div> tag in the HTML file.
			tile.id = r+"-"+c;
			//Sets the id of the <div>.

			let num = board[r][c];
			//Retrives individual value from the matrix.

			updateTile(tile, num);
			//Sends value to the updateTile 

			document.getElementById("board").append(tile);
		}
	}

	setOne(); 
	setOne();
	//Generates two random tiles on the board. 
}

function updateTile(tile, num) {
//A function to update the appearance on a tile based on its number.

	tile.innerText = "";
	//Clear the tile;

	tile.classList.value = "";
	//Clears the classList to avoid multiple classes

	tile.classList.add("tile");

	if(num>0) {
		tile.innerText = num;

		if(num<=4096) {
			tile.classList.add("x"+num);
		} else {
			tile.classList.add("x8192");
		}
	}
}

window.onload = function() {
//This event is triggered only when the webpage finishes loading. 
	setGame();
}

function handleSlide(e) {
//This function handles the user's keyboard input upon pressing arrow keys. 
	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
	//Will only run if specified keys (arrow keys) were pressed. 

		if(event.code == "ArrowLeft" && canMoveLeft()) {
			slideLeft();
			setOne();
		} else if(event.code == "ArrowRight" && canMoveRight()) {
			slideRight();
			setOne();
		} else if(event.code == "ArrowUp" && canMoveUp()) {
			slideUp();
			setOne();
		} else if(event.code == "ArrowDown" && canMoveDown()) {
			slideDown();
			setOne();
		}
		//Condition based on which arrow key was pressed.
	}

	document.getElementById('score').innerText = score;
	//Changes the inner text of the <span> tag to the updated score set in the slide() function. 

	setTimeout(()=> {
		if(hasLost()){
			alert('Game over! You have lost the game. Game will restart.');
			restartGame();
			alert('Click any arrow key to restart.')
		} else {
			checkWin();
		}
	}, 100)
	//100 is the amount of delay. Millisecond unit is used. 
}
function restartGame() {
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];
	//Reassigns the value of the board. 
	score = 0; 
	//Resets the score to 0. 
	setOne(); 
	//Adds random two tiles on the board upon restarting. 
}

document.addEventListener("keydown", handleSlide);
//Eventlistener waits 

function slideLeft() {
	for(let r=0; r<rows; r++) {
		let row = board[r];
		//Retrieves the current array row by row

		let originalRow = row.slice();

		row = slide(row);

		board[r] = row;
		//Updates the board after runing functions.

		for(let c=0; c<columns; c++) {
		//Updates the values of the tiles. 
			let tile = document.getElementById(r+"-"+c);
			let num = board[r][c];

			if(originalRow[c]!=num && num!=0) {
				tile.style.animation = "slide-from-right 0.3s";
				//Adds animation to the rows with changes. 
				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
				//Removes the animation after 3 seconds before updating the board. 
			}

			updateTile(tile, num);
		}
	}
}
function slideRight() {
	for(let r=0; r<rows; r++) {
		let row = board[r];

		let originalRow = row.slice();

		row = row.reverse();

		row = slide(row);

		row = row.reverse();
		//Conducts same process with slideLeft() but it is reversed then reversed again. 

		board[r] = row;

		for(let c=0; c<columns; c++) {
			let tile = document.getElementById(r+"-"+c);
			let num = board[r][c];

			if(originalRow[c]!=num && num!=0) {
				tile.style.animation = "slide-from-left 0.3s";
				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
			}

			updateTile(tile, num);
		}
	}
}
function slideUp() {
	for(let c=0; c<columns; c++) {
		let col = board.map(row => row[c]);

		let originalCol = col.slice();

		col = slide(col);

		for(let r=0; r<rows; r++) {
		//Updates the id of the tile
			board[r][c] = col[r];

			let tile = document.getElementById(r+"-"+c);

			let num = board[r][c];

			if(originalCol[r]!=num && num!=0) {
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(() => {
					tile.style.animation = ""
				}, 300);
			}

			updateTile(tile, num);
		}
	}
}
function slideDown() {
	for(let c=0; c<columns; c++) {
		let col = board.map(row => row[c]);

		let originalCol = col.slice();

		col = col.reverse();

		col = slide(col);

		col = col.reverse();

		for(let r=0; r<rows; r++) {
		//Updates the id of the tile
			board[r][c] = col[r];

			let tile = document.getElementById(r+"-"+c);
			let num = board[r][c];

			if(originalCol[r]!=num && num!=0) {
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(() => {
					tile.style.animation = ""
				}, 300); 
			}
			updateTile(tile, num);
		}
	}
}
function filterZero(row) {
//A function to remove zeroes in the array.
	return row.filter(num => num != 0);
}
function slide(row) {
	row = filterZero(row);

	for(let i=0; i<row.length; i++) {
		if(row[i] == row[i+1]) {
		//Condition to compare an array value to the array value next to it.

			row[i]*=2;
			//Multiplies the array value to two then;
			
			row[i+1] = 0; 
			//sets the next array value to 0.

			score += row[i];
			//Updates the score

		}
	}

	row = filterZero(row);
	//Filters zeroes again.

	while(row.length < columns) {
	//Fills in zeroes. 
		row.push(0);
	}
	
	return row;
}
function hasEmptyTile() {
//Checks if there is an empty tile on the board. It returns a true if there is a 0 in the array. Otherwise, it returns false. 
	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++){
			if(board[r][c]==0) {
				return true;
			} 
		}
	}
	return false; 
}
function setOne() {
//A function that randomly creates or adds a tile in the board. 
//It includes an early exit (exit the function) if hasEmptyTile() function returns false. 
	if(!hasEmptyTile()) {
		return; 
	} 

	let found = false; 

	while(!found) {
	//Randomizes a spot for the new tile to spawn. 
		let r = Math.floor(Math.random()*rows);
		let c = Math.floor(Math.random()*columns);
		//random() function generates a random number from 0 to the number of rows or columns. 
		//floor() function gets the whole number. 

		if(board[r][c] == 0) {
		//Checks if the generated coordinate is not occupied. 

			board[r][c] = 2; 
			//Sets the array value to 2.

			let tile = document.getElementById(r+"-"+c);
			let num = board[r][c]; 
			updateTile(tile, num);

			found = true; 
			//Stops the while loop from generating a coordinate and checking availability. 
		}
	}
}
function canMoveLeft() {
//A function for checking if there is a possible move going left. 
	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {
			if(board[r][c]!=0) {
			//Checks only tiles with values.
				if(board[r][c]==board[r][c-1] ||board[r][c-1]==0) {
				//The function returns true if the tile is equal to the tile on the left or if the tile on the left 0. 
					return true;
				}
			}
		}
	}
	return false
}
function canMoveRight() {
	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {
			if(board[r][c]!=0) {
				if(board[r][c]==board[r][c+1] || board[r][c+1]==0) {
					return true;
				}
			}
		}
	}
	return false;
}
function canMoveUp(){
	for(let c = 0; c < columns; c++){
		for(let r = 1; r <rows; r++){
			if(board[r][c] != 0){
				if(board[r-1][c] == 0 || board[r-1][c] == board[r][c]){
					return true;
				}
			}
		}
	}

	return false;
}
function canMoveDown(){
	for(let c=0; c<columns; c++){
		for(let r=rows-2; r>=0 ; r--){
			if(board[r][c]!=0){
				if(board[r+1][c]==0 || board[r+1][c]==board[r][c]){
					return true;
				}
			}
		}
	}
	return false;
}
function checkWin(){
//A function for checking if the usesr already won. Checks if 2048 tile existing. 
	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {
			if(board[r][c]==2048 && is2048Exist==false) {
			//Checks if there is a 2048 tile and makes sure that the alert happens only once. 
				alert('You win! You got the 2048!');
				is2048Exist = true; 
			} else if (board[r][c]==4096 && is4096Exist==false) {
				alert('You are unstoppoble at 4096! You are fantastically unstoppable!');
				is4096Exist = true;
			} else if(board[r][c]==8192 && is8192Exist==false) {
				alert('Victory! You have reached 8192! You are incredibly awesome!')
				is8192Exist = true;
			}
		}
	}
}
function hasLost() {
	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {
			if(board[r][c]==0) {
				return false; 
			}

			let currentTile = board[r][c];

			if(r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile) {
				return false; 
			}
		}
	}
	return true;
}