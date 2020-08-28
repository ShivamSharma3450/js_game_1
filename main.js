// ****** NOTE: Many things are missing to implement: 
// One is to get user name from prompt,
// Second to add timer and also chage the sentence of U win to u tooked this much time, 
// Save the time taken in web storage and compare previous time taken to the current time taken,
// Also after game overs just show options to restart the game,
// With that do provide controllers for ball's sensitivity also (velocity of evil user), and also velocity of the game, 
// Set the game mode (simple and time limit mode), in simple it will be as it is, in tough U will have to constraint time (this all settings U will need to ask while the game begging),
// Also change the CSS of the page.
// Handle alert with sweet alert
// Make 4 such games and deploy it on freehosting site with a shining index page for all the games, and add it to your resume/ LinkedIn/ Blogger/ Stackoverflow etc.


// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}


//Ball circles
function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists)
  this.color = color;
  this.size = size;
}

Ball.prototype = new Shape()
Ball.prototype.constructor = Ball

//Ball's methods
//Ball draw
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

// Move balls
Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

//Collision detection and change color
Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}





//Evil Circle
function EvilCircle(x, y, velX, velY, exists, color, size){
	Shape.call(this, x, y, 20, 20, exists)
  this.color = 'white';
  this.size = 10;
}

EvilCircle.prototype = new Shape()
EvilCircle.prototype.constructor = EvilCircle

//Evil circle's methods
EvilCircle.prototype.draw = function() {
	ctx.lineWidth = 5
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}

EvilCircle.prototype.checkBounds = function() {
  if ((this.x + this.size) >= width) {
    this.x -= (this.size);
  }

  if ((this.x - this.size) <= 0) {
    this.x += (this.size);
  }

  if ((this.y + this.size) >= height) {
    this.y -= (this.size);
  }

  if ((this.y - this.size) <= 0) {
    this.y += (this.size);
  }
}

EvilCircle.prototype.setControls = function() {
	let _this = this;
	window.onkeydown = function(e) {
    if (e.key === 'a' || e.keyCode == '37') {
      _this.x -= _this.velX;
    } else if (e.key === 'd' || e.keyCode == '39') {
      _this.x += _this.velX;
    } else if (e.key === 'w' || e.keyCode == '38') {
      _this.y -= _this.velY;
    } else if (e.key === 's' || e.keyCode == '40') {
      _this.y += _this.velY;
    }
  }
}

EvilCircle.prototype.collisionDetect = function(){
	for (let j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false
      }
    }
  }
}


// Create balls
let balls = [];
let evilBall = new EvilCircle( 20, 20, 20, 20, true, 'white', 10)
evilBall.setControls()
let para = document.getElementById('ballCount')
var remaningBallsCount = 25


while (balls.length < 25) {
  let size = random(10,20);
  let ball = new Ball(
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );

  balls.push(ball);
}


function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'; //The 0.25 value gives the tailing effect, change it to see effects
  ctx.fillRect(0, 0, width, height);
  remaningBallsCount = 0
  for (let i = 0; i < balls.length; i++) {
  	if(balls[i].exists){
  		balls[i].draw();
	    balls[i].update();
	    balls[i].collisionDetect();
	    remaningBallsCount += 1
  	}
  }
  if(remaningBallsCount === 0){
  	alert("You Won!, Timer need to make")
  }else{
  	para.innerHTML = "Remaining Balls count: " + remaningBallsCount
	  evilBall.draw();
	  evilBall.checkBounds();
	  evilBall.collisionDetect();
	  requestAnimationFrame(loop);
  }
}

//Calling loop function to start  the animation
loop();

function toggleInfoScreen() {
  var infoButt = document.getElementById('info-button');
  var infoScr = document.getElementById('info-screen');
  infoScr.classList.toggle('hidden');
  infoButt.innerHTML = (infoScr.className === 'hidden') ? '?' : 'X';
}

// ****** NOTE: Many things are missing to implement: 
// One is to get user name from prompt,
// Second to add timer and also chage the sentence of U win to u tooked this much time, 
// Save the time taken in web storage and compare previous time taken to the current time taken,
// Also after game overs just show options to restart the game,
// With that do provide controllers for ball's sensitivity also (velocity of evil user), and also velocity of the game, 
// Set the game mode (simple and time limit mode), in simple it will be as it is, in tough U will have to constraint time (this all settings U will need to ask while the game begging),
// Also change the CSS of the page.
// Handle alert with sweet alert
// Make 4 such games and deploy it on freehosting site with a shining index page for all the games, and add it to your resume/ LinkedIn/ Blogger/ Stackoverflow etc.

