var particles = [];
var spawnSpeed = 10;
var maxParticles = 500;

var options = {
    xVariance: 5,
    yVariance: 2,
    velocity: {x: 0, y: -1},
    spawnSpeed: 25,
    maxParticles: 500,
    size: 10,
    sizeVariance: 10,
    life: 20,
    lifeVariance: 10,    
    direction: 0,
    directionVariance: 180,
    color: '#cef',
    opacity: 1,
    onDraw: function (age) {
    	var y = -age * 3;
      	this.size *= 0.98;
      	this.color = 'rgb(255, ' + (y + 255) + ', 68)';
      	this.opacity = 0.5 - (age / this.life * 0.4);
    }
}

function Particle (x, y, options) {
  
  	function rand (num) { 
  		return (Math.random() * num << 1) - num; 
  	}

  	function rotate (v, rad) {
    	var cos = Math.cos(rad), sin = Math.sin(rad);
    	
    	return {x: v.x * cos - v.y * sin, y: v.x * sin + v.y * cos};
  	}
  
  	function add (pos, v) {
		pos.x += v.x;
		pos.y += v.y;
	}

  	var pos = {x: x + rand(options.xVariance), y: y + rand(options.yVariance)};
  
  	var direction = options.direction + rand(options.directionVariance);
  
  	var age = 0;
  	var opacity = 1;
  	var life = options.life + rand(options.lifeVariance);
	var size = options.size + rand(options.sizeVariance);
	var active = true;
	var v = rotate(options.velocity, direction * Math.PI/180);
	var color = "#cef";

	function update () {
		if (age >= life) {
			active = false;
		}
    	add(pos, v);
    	age++;
	}

	function draw (ctx) {
    	if (options.onDraw) {
    		//options.onDraw();
    	}
    	var y = -age * 5;
      	size *= 0.98;
      	color = 'rgb(255, ' + (y + 255) + ', 68)';
      	opacity = 0.5 - (age / life * 0.4);

		ctx.save();
		ctx.fillStyle = color;
		try {
		  ctx.globalAlpha = this.opacity;
		} catch(ex) {
		  console.debug(ex); 
		}
		ctx.translate(pos.x, pos.y);

		ctx.beginPath();
		ctx.arc(0, 0, size/2, 0, Math.PI/180, true);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	function getActive () {
		return active;
	}

	var that = {
		update: update,
		draw: draw,
		getActive: getActive
	}

	return that;  
}

function drawParticles(x, y)
{
	for(var i in particles) {
		var particle = particles[i];
		if(!particle.getActive()) {
			particles.splice(i, 1); 
		} else {
			particle.update();
			particle.draw(context);
		}
    }

	for(var spawned = 0; spawned < spawnSpeed; spawned++) {
		if(particles.length >= maxParticles) {
			return;
		}
		particles.push(new Particle(x, y, options));
    }
}