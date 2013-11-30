var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 500;
var CELL_WIDTH = 50;
var CELL_HEIGHT = 50;
var HORIZONTAL_CELL_COUNT = parseInt(CANVAS_WIDTH / CELL_WIDTH);
var VERTICAL_CELL_COUNT = parseInt(CANVAS_HEIGHT / CELL_HEIGHT);

var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");

var isUserInputBlocked = false;
var isGameEnding = false;

var levelIndex = 0;
var level = getLevel();

var showLevels = false;
var open = false;
var close = false;
var leftX = CANVAS_WIDTH / 2;
var rightX = 0;
var levelsDiv = document.getElementById('levels');
var playDiv = document.getElementById('play');
var menuDiv = document.getElementById('menu');
var sound1Div = document.getElementById('sound1Div');
var sound2Div = document.getElementById('sound2Div');

var playSound1 = true;
var playSound2 = true;

sound1Div.onclick = function () {
	playSound1 = !playSound1;
	if (playSound1) {
		sound1Div.src = 'resources/sound1.png';
		backgroundSound.play();
	} else {
		sound1Div.src = 'resources/sound1t.png';
		backgroundSound.pause();
	}
}

sound2Div.onclick = function () {
	playSound2 = !playSound2;
	if (playSound2) {
		sound2Div.src = 'resources/sound2.png';
	} else {
		sound2Div.src = 'resources/sound2t.png';
	}
}

levelsDiv.style.display = 'none';

playDiv.onclick = function () {
	showLevels = false;
	openMenu();
	startLevel(levelIndex);
	hideShowMenu(true);
}

menuDiv.onclick = function () {
	showLevels = true;
	levelsMenu();
	openMenu();
	hideShowMenu(true);
}

function hideShowMenu (hide) {
	playDiv.style.display = hide ? 'none' : 'block';
	menuDiv.style.display = hide ? 'none' : 'block';
}

window.onload = function () {
	var FPS = 60;
	// game's main loop
	setInterval(function() {
		update();
		draw();
	}, 1000/FPS);
}

// to handle user input
window.addEventListener("keydown", onKeyDown, false);
function onKeyDown (e) {
	if (!isUserInputBlocked && !isGameEnding) {
		// up - w ↑
		if (e.keyCode == 87 || e.keyCode == 38) {
			level.moveUp();
		}
		// right - d →
		if (e.keyCode == 68 || e.keyCode == 39) {
			level.moveRight();
		}
		// down - s ↓
		if (e.keyCode == 83 || e.keyCode == 40) {
			level.moveDown();
		}
		// left - a ↑
		if (e.keyCode == 65 || e.keyCode == 37) {
			level.moveLeft();
		}

		// change - space, enter, ctrl, shift, x
		if (e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 17 || e.keyCode == 16 || e.keyCode == 88) {
			level.changePlayers();
		}

		// discard changes
		if (e.keyCode == 27) {
			endGame(false);
		}
		

		// used for easy level creation; click 1 to log board;
		if (e.keyCode == 49) {
			var t = "";
			for (var i in level.board) {
				t += "[";
				var b = false;
				for (var j in level.board[i]) {
					if (b) {
						t += ", ";
					} else {
						b = true;
					}
					t += level.board[i][j];
				}
				t += "],\n";
			}
			console.log(t);
		}
	}
}

// used for calculating positions, animations and game state
function update () {
	level.update();

	if (close) {
		if (rightX < 0) {
			rightX += 5;
			leftX -= 5;
		} else {
			close = false;
			hideShowMenu(false);
		}
	}
	if (open) {
		if (rightX > - CANVAS_WIDTH / 2) {
			rightX -= 5;
			leftX += 5;
		} else {
			open = false;
			if (showLevels) {
				canvas.style.display = 'none';
			}
		}
	}
}

// used for drawing game
function draw () {
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	
	if (!showLevels) {
		level.draw();
	}

	context.drawImage(right, rightX, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT);
	context.drawImage(left, leftX, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT);
}

function openMenu () {
	close = false;
	open = true;
}

function closeMenu () {
	close = true;
	open = false;
}

function levelsMenu () {
	levelsDiv.style.display = 'block';
	levelsDiv.innerHTML = '';
	for (var i=0; i<9; i++) {
		createLevelElement((i + 1), i);
	}
}

function createLevelElement (text, index) {
	var level = document.createElement('div');
	levelsDiv.appendChild(level);
	level.className = 'level';
	level.innerHTML = text;

	if (levelIndex == index) {
		level.className += ' activeLevel';
	}

	level.onclick = function () {
		levelsDiv.style.display = 'none';
		canvas.style.display = 'block';
		startLevel(index);
	}
}

function endGame (win) {
	if (isGameEnding) {
		return;
	}

	backgroundSound.pause();
	backgroundSound.currentTime = 0;

	isUserInputBlocked = true;
	isGameEnding = true;

	if (win) {
		levelIndex++;
		if (playSound2) {
			winSound.play();
		}
		if (levelIndex == 9) {
			levelIndex = 0;
		}
	} else if (playSound2) {
		loseSound.play();
	}
	closeMenu();
}

function startLevel (index) {
	levelIndex = index;
	level = getLevel();
	isUserInputBlocked = false;
	isGameEnding = false;
	showLevels = false;
	if (playSound1) {
		backgroundSound.play();
	}
}

// needed to copy level data
function getLevel () {
	var p1 = {}; 
	p1.x = levels[levelIndex].player1.x;
	p1.y = levels[levelIndex].player1.y;

	var p2 = {}; 
	p2.x = levels[levelIndex].player2.x;
	p2.y = levels[levelIndex].player2.y;
	
	var b = [];
	var board = levels[levelIndex].board.slice();
	for (var i in board) {
		b.push(board[i].slice());
	}

	return Level(p1, p2, b);
}

/* 
// used for creating levels, uncoment if u want to create your own levels easily ;)

var activeImage = null;
var activeIndex = null;
var rect = canvas.getBoundingClientRect();
var mouseX = 0, mouseY = 0;
canvas.addEventListener("mousedown", mousedown, false);
function mousedown (e) {
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    getCoords(mouseX, mouseY);
}

function getCoords (mouseX, mouseY) {
	var x = (mouseX / CELL_WIDTH)|0;
	var y = (mouseY / CELL_HEIGHT)|0;

	level.board[y][x] = activeIndex;
}

var imgHolder = document.createElement('div');
imgHolder.className = 'imgHolder';
document.body.appendChild(imgHolder);

for (var i in grounds) {
	createImg(grounds[i], i);
}

for (var i in glues) {
	createImg(glues[i], 20 + parseInt(i));
}

for (var i in stones) {
	createImg(stones[i], 30 + parseInt(i));
}

createImg(ice, 40);
for (var i in bombs) {
	createImg(bombs[i], 50 + parseInt(i));
}
createImg(portal, 60);

function createImg (img, index) {
	imgHolder.appendChild(img);
	img.className = 'normal';
	img.onclick = function () {
		activeIndex = index;
		img.className = 'active';
		if (activeImage) {
			activeImage.className = 'normal';
		}
		activeImage = img;

	}
}
*/