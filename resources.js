 var backgroundSound = new Audio("resources/pyramids.wav");
 backgroundSound.addEventListener('ended', function() {
     this.currentTime = 0;
     this.play();
 }, false);

var winSound = new Audio("resources/win.wav");
var loseSound = new Audio("resources/lose.wav");
var burnSound = new Audio("resources/burn.wav");
var bombSound = new Audio("resources/bomb.wav");

var player1Img = getImage("sun.png");

var player2Img = getImage("moon.png");

var portal = getImage("portal.png");
var ice = getImage("ice.png");
var bombs = [ getImage("bomb0.png"), getImage("bomb1.png") ];
var glues = [ getImage("glue0.png"), getImage("glue1.png") ];

var stones = [ getImage("stone0.png"), 
				getImage("stone1.png") ];

var grounds = [ getImage("ground0.png"), 
				getImage("ground1.png") ];

var left = getImage("left.png");
var right = getImage("right.png");

function getImage (name) {
	var img = new Image();
	img.src = "./resources/" + name;

	return img;
}