var MOVE_STEPS_COUNT = 10;
var SLIDE_STEPS_COUNT = 5;

var EMPTY_GROUND = 0;

/*
	For each level we have two players and map.
	First player is one that has fire and he can burn Glue but can not slide on ice.
	Second player can slide on ice but can not burn Glue.
	We can change players' positions.
	Our target is to move our players on exit cells to win.
*/
function Level (player1, player2, board) {
	var player1Target = {'stepsCount': 0};
	var player2Target = {'stepsCount': 0};
	var animations = [];

	// used for calculating players positions and game state (win, lose)
	function update () {
		if (player1Target.stepsCount == 0 && player2Target.stepsCount == 0) {
			if (getCellType(board[player1.y][player1.x]) == CellType.Exit &&
				getCellType(board[player2.y][player2.x]) == CellType.Exit) {

				endGame(true);
			} else {
				isUserInputBlocked = false;
			}
		} else {
			moveStep(player1, player1Target, true);
			moveStep(player2, player2Target, false);
		}
	}

	// used for drawing map and players
	function draw () {
		for (var i=0; i<VERTICAL_CELL_COUNT; i++) {
			for (var j=0; j<HORIZONTAL_CELL_COUNT; j++) {
				var index = board[i][j] % 10;
				if (getCellType(board[i][j]) == CellType.Ground) {
					drawImage(grounds[index], j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
				} else if (getCellType(board[i][j]) == CellType.Grass) {
					drawImage(grass[index], j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
				} else if (getCellType(board[i][j]) == CellType.Glue) {
					drawImage(glues[index], j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
				} else if (getCellType(board[i][j]) == CellType.Stone) {
					drawImage(stones[index], j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
				} else if (getCellType(board[i][j]) == CellType.Ice) {
					drawImage(ice, j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
				} else if (getCellType(board[i][j]) == CellType.Bomb) {
					drawImage(bombs[index], j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
				} else if (getCellType(board[i][j]) == CellType.Exit) {
					drawImage(portal, j * CELL_WIDTH, i * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
				}
			}
		}
		
		drawParticles(player1.x * CELL_WIDTH + CELL_WIDTH/2, player1.y * CELL_HEIGHT + CELL_HEIGHT/2);
		drawImage(player1Img, player1.x * CELL_WIDTH, player1.y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);

		drawImage(player2Img, player2.x * CELL_WIDTH, player2.y * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
	
		for (var i=0; i<CANVAS_WIDTH; i+=CELL_WIDTH) {
			drawLine(i, 0, i, CANVAS_HEIGHT);
		}
		
		for (var i=0; i<CANVAS_HEIGHT; i+=CELL_HEIGHT) {
			drawLine(0, i, CANVAS_WIDTH, i);
		}
		
		function drawLine (mx, my, lx, ly) {
			context.beginPath();
			context.lineWidth = 0.3;
			context.moveTo(mx, my);
			context.lineTo(lx, ly);
			context.stroke();
		}

		function drawImage (img, x, y, width, height) {
  			context.drawImage(img, x, y, width, height);
		}
	}
	
	// user input
	function moveUp () {
		calculatePlayersTargetPos(0, -1);
	}
	
	// user input
	function moveDown () {
		calculatePlayersTargetPos(0, 1);
	}
	
	// user input
	function moveLeft () {
		calculatePlayersTargetPos(-1, 0);
	}
	
	// user input
	function moveRight () {
		calculatePlayersTargetPos(1, 0);
	}
	
	// calculate both players target positions based on user input
	function calculatePlayersTargetPos (offsetX, offsetY) {
		// ignore user input if it is blocked
		if (isUserInputBlocked) {
			return;
		}
		isUserInputBlocked = true;
		
		var player1BlockedX = -1;
		if (getCellType(board[player2.y][player2.x]) == CellType.Glue) {
			player1BlockedX = player2.x;
		} else {
			player1BlockedX = isPlayerBlocked(player2.x + offsetX, player2.y + offsetY) ? player2.x : -1;
		}
		calculatePlayerTargetPos(player1, player1Target, offsetX, offsetY, player1BlockedX, player2.y, MOVE_STEPS_COUNT);

		// do not move second player if he is stacked in Glue cell
		if (getCellType(board[player2.y][player2.x]) != CellType.Glue) {
			var player2BlockedX = isPlayerBlocked(player1.x + offsetX, player1.y + offsetY) ? player1.x : -1;
			calculatePlayerTargetPos(player2, player2Target, offsetX, offsetY, player2BlockedX, player1.y, MOVE_STEPS_COUNT);
		} else {
			// TODO: make Glue animation
		}
	}
	
	// calculate target position of player based on user input
	function calculatePlayerTargetPos (player, playerTarget, offsetX, offsetY, blockedX, blockedY, stepsCount) {
		// check if user is blocked or is going out of board
		var x = player.x + offsetX;
		var y = player.y + offsetY;
		if ((x == blockedX && y == blockedY) ||
			isPlayerBlocked(x, y)) {

			return false;
		}

		setPlayerTarget(playerTarget, x, y, offsetX, offsetY, stepsCount);

		return true;
	}

	// checks if player is blocked by stone cell or border
	function isPlayerBlocked (x, y) {
		if (!isInsideBoard(x, y) ||
			getCellType(board[y][x]) == CellType.Stone) {

			return true;
		}

		return false;
	}

	// set player's target position
	// movement to target position happens in 'update' function
	function setPlayerTarget (playerTarget, x, y, offsetX, offsetY, stepsCount) {
		playerTarget.x = x;
		playerTarget.y = y;
		playerTarget.offsetX = offsetX;
		playerTarget.offsetY = offsetY;
		playerTarget.stepX = offsetX / stepsCount;
		playerTarget.stepY = offsetY / stepsCount;
		playerTarget.stepsCount = stepsCount;
	}

	// check if player is inside board (map)
	function isInsideBoard (x, y) {
		if (x < 0 || x > HORIZONTAL_CELL_COUNT - 1 || 
			y < 0 || y > VERTICAL_CELL_COUNT - 1) {
			
			return false;
		}

		return true;
	}
	
	// changes players' positions
	function changePlayers () {
		//	no need to change playerTargets, because 
		//	change happens only when players are standing

		var player = player2;
		player2 = player1;
		player1 = player;

		checkPlayer1IceOrGlue();
	}

	// calculate and move player's next step
	function moveStep (player, playerTarget, hasFire) {
		if (playerTarget.stepsCount > 0) {
			player.x += playerTarget.stepX;
			player.y += playerTarget.stepY;

			playerTarget.stepsCount--;
			if (playerTarget.stepsCount == 0) {
				player.x = playerTarget.x;
				player.y = playerTarget.y;
				
				endMoveStep(player, playerTarget, hasFire);
			}
		}
	}

	// end step. start anymation burn, melt sliding if needed.
	function endMoveStep (player, playerTarget, hasFire) {
		if (getCellType(board[player.y][player.x]) == CellType.Bomb) {
			if (playSound2) {
				bombSound.play();
			}
			endGame(false);
			
			return;
		}

		if (hasFire) {
			checkPlayer1IceOrGlue();
		} else if (getCellType(board[player.y][player.x]) == CellType.Ice) {
			calculatePlayerTargetPos(player, playerTarget, playerTarget.offsetX, 
				playerTarget.offsetY, player1.x, player1.y, SLIDE_STEPS_COUNT);
		}
	}

	function checkPlayer1IceOrGlue () {
		var cellType = getCellType(board[player1.y][player1.x]);
		if (cellType == CellType.Glue || cellType == CellType.Ice) {
			if (playSound2) {
				burnSound.play();
			}

			board[player1.y][player1.x] = EMPTY_GROUND + board[player1.y][player1.x] % 10;
		}
	}
	
	// list of (public) functions that we wish to be accessed from outside
	var that = {
		update: update,
		draw: draw,
		moveUp: moveUp,
		moveDown: moveDown,
		moveLeft: moveLeft,
		moveRight: moveRight,
		changePlayers: changePlayers,
		board: board
	}
	
	return that;
}