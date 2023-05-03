var c = document.getElementById('base');
var ctx = c.getContext('2d');

var creatures = [];

var tailModifierLeft = {
	val: 10,
	direction: true
};

var tailModifierRight = {
	val: -10,
	direction: false
};

var mousePosition = {
	x: 0,
	y: 0
}

setWindowSize();
addEventListeners();
createCreatures();
draw();

function setWindowSize(){
	c.width = window.innerWidth * 2;
	c.height = window.innerHeight * 2;
}

function addEventListeners(){
	
	window.addEventListener('resize', function(){
		setWindowSize();
	});
	
	window.addEventListener('mousemove', function(e){
		mousePosition.x = e.clientX * 2;
		mousePosition.y = e.clientY * 2;
	});
	
}

function createCreatures(){
	var total = 0;
	
	for (i = 0; i < 30; i++){
		for (f = 0; f < 15; f++){
			total += 1;
			
			creatures.push({
				id: total,
				x: i * 200,
				y: f * 230,
				color: 'rgb(0, 225, ' + parseInt((120 + ((total / 6)))) + ')'
			});
		}
	}
}

function draw(){
	tailModifierLeft.val = calcModifier(tailModifierLeft);
	tailModifierRight.val = calcModifier(tailModifierRight);
	
	clearBg();
	
	for (i = 0; i < creatures.length; i++){
		moveCreature(creatures[i], i);
		drawGhost(creatures[i]);
	}
	
	window.requestAnimationFrame(draw);
}

function moveCreature(creature, i){
	if(creatures[i].y < -40){
		creatures[i].y = 230 * 15;
	} else {
		creatures[i].y -= 1;
	}
	
	if(mousePosition.x - creature.x < 300 &&
		 mousePosition.x - creature.x > -300 &&
		 mousePosition.y - creature.y < 300 &&
		 mousePosition.y - creature.y > -300){
		
		var distanceX = mousePosition.x - creature.x;
		var distanceY = mousePosition.y - creature.y;
		var divisionMod = 5;
		var fleeSpeed = 3;
		
		if(distanceX < 0){
			creatures[i].x += fleeSpeed;
		} else {
			creatures[i].x -= fleeSpeed;
		}
		
		if(distanceY < 0){
			creatures[i].y += fleeSpeed;
		} else {
			creatures[i].y -= fleeSpeed;
		}
		
	}
}

function calcModifier(obj){
	
	if(obj.val > 10){
		obj.direction = false;
	} else if (obj.val < -10) {
		obj.direction = true;
	}
	
	if(obj.direction){
		return obj.val + .5;
	} else {
		return obj.val - .5;
	}
	
}

function clearBg(){
	ctx.fillStyle = 'rgb(50, 60, 70)';
	ctx.fillRect(0, 0, c.width, c.height);
	ctx.fill();
}

function drawGhost(ghost){
	
	ctx.beginPath();
	
	ctx.moveTo(ghost.x - 40, ghost.y + 40);
	ctx.lineTo(ghost.x - 40, ghost.y - 40);
	ctx.bezierCurveTo(ghost.x - 40, ghost.y - 100,
										ghost.x + 40, ghost.y - 100,
										ghost.x + 40, ghost.y - 40);
	ctx.lineTo(ghost.x + 40, ghost.y + 40);
	
	ctx.quadraticCurveTo(ghost.x + 20, (ghost.y + 40 + tailModifierLeft.val),
											ghost.x, ghost.y + 40);
	
	ctx.quadraticCurveTo(ghost.x - 20, (ghost.y + 40 + tailModifierRight.val),
											ghost.x -40, ghost.y + 40);
	
	ctx.closePath();
	
	ctx.fillStyle = ghost.color;
	ctx.fill();
	
	drawEye(ghost);
}

function drawEye(ghost){
	
	ctx.beginPath();
	
	ctx.arc(ghost.x, ghost.y - 35, 20, 0, Math.PI * 2);
	
	ctx.closePath();
	
	ctx.fillStyle = 'white';
	ctx.fill();
	
	drawPupil(ghost);
	
}

function drawPupil(ghost){
	
	var pupilX = ghost.x;
	var pupilY = ghost.y - 35;
	
	var offsetMouseY = mousePosition.y;
	var eyeY = ghost.y - 35;
	
	if(ghost.x - mousePosition.x < 10 && ghost.x - mousePosition.x > -10){
		pupilX = mousePosition.x;
	} else if (ghost.x - mousePosition.x < 10) {
		pupilX = ghost.x + 10;
	} else {
		pupilX = ghost.x - 10;
	}
	
	if(eyeY - offsetMouseY < 10 && eyeY - offsetMouseY > -10){
		pupilY = offsetMouseY;
	} else if (eyeY - offsetMouseY < 10) {
		pupilY = eyeY + 10;
	} else {
		pupilY = eyeY - 10;
	}
	
	ctx.beginPath();
	ctx.arc(pupilX, pupilY, 8, 0, Math.PI * 2);
	ctx.closePath();
	
	ctx.fillStyle = 'black';
	ctx.fill();
	
}