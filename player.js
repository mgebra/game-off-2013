function Player (params) {
	function draw () {
		context.fillStyle = params.color;
		context.fillRect(params.x, params.y, params.width, params.height);
	}
	
	function moveUp () {
		move(params.x, params.y - CELL_HEIGHT);
	}
	
	function moveDown () {
		move(params.x, params.y + CELL_HEIGHT);
	}
	
	function moveLeft () {
		move(params.x - CELL_WIDTH, params.y);
	}
	
	function moveRight () {
		move(params.x + CELL_WIDTH, params.y);
	}
	
	function move (x, y) {
		if (map.getCell(getIndex(x, y)) == CellType.Empty) {
			params.x = x;
			params.y = y;
		}
	}
	
	function getIndex (x, y) {
		return { x: Math.floor(x / CELL_WIDTH), y: Math.floor(y / CELL_HEIGHT) };
	}
	
	var that = {
		draw: draw,
		moveUp: moveUp,
		moveDown: moveDown,
		moveLeft: moveLeft,
		moveRight: moveRight,
	}
	
	return that;
}