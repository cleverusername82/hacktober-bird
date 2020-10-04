var player;
var myObstacles = [];
var score;

// Starts game and creates player
function startGame() {
  player = new component(30, 30, "red", 10, 120);
  player.gravity = 0.1;
  score = new component("30px", "Arial", "black", 280, 40, "text");
  gameArea.start();
}

// Creates canvas for game background, player, and walls
var gameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 800;
    this.canvas.height = 400;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  gameOver: function(score){
    gameArea.clear();
    gameoverMessage = new component("30px", "Arial", "black", 200, 200, "text");
    gameoverMessage.text = "Game Over: your score is " + score;
    gameoverMessage.update();
    clearInterval(this.interval);
  }
};

function component(width, height, color, x, y, type) {
  this.type = type;
  this.score = 0;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.gravity = 0;
  this.gravitySpeed = 0;
  this.update = function () {
    ctx = gameArea.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.newPos = function () {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBottom();
  };
  this.hitBottom = function () {
    var rockbottom = gameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.gravitySpeed = 0;
    }
  };
  this.crashWith = function (otherobj) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + otherobj.width;
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + otherobj.height;
    var crash = true;
    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }
    return crash;
  };
}

function updateGameArea() {
  var x, height, gap, minHeight, maxHeight, minGap, maxGap;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (player.crashWith(myObstacles[i])) {
      gameArea.gameOver(gameArea.frameNo);
      return;
    }
  }
  gameArea.clear();
  gameArea.frameNo += 1;
  if (gameArea.frameNo == 1 || everyinterval(150)) {
    x = gameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    );
    minGap = 60;
    maxGap = 200;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    myObstacles.push(new component(20, height, "#3e8e41", x, 0));
    myObstacles.push(
      new component(20, x - height - gap, "#3e8e41", x, height + gap)
    );
  }
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }
  score.text = "SCORE: " + gameArea.frameNo;
  score.update();
  player.newPos();
  player.update();
  
}

function everyinterval(n) {
  if ((gameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

function accelerate(n) {
  player.gravity = n;
}

function restart(){
  window.location.reload();
}