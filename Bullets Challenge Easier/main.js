let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 600;

let aPressed = false;
let dPressed = false;

function RandomNum(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomColour() {
  return `#` + Math.floor(Math.random() * 16777215).toString(16);
}

let targets = [];
let bullets = [];

let player = {
  x: 400,
  y: 550,
  radius: 20,
  speed: 5,
  colour: "red",
};

function addTargets(count) {
  for (let i = 0; i < count; i++) {
    targets.push({
      x: RandomNum(25, 775),
      y: RandomNum(25, 475),
      radius: RandomNum(10, 25),
      xspeed: RandomNum(-1, 1),
      yspeed: RandomNum(-1, 1),
      colour: getRandomColour(),
    });
  }
}

function addBullets(x, y) {
  bullets.push({
    x: x,
    y: y,
    radius: 4,
    xspeed: 0,
    yspeed: 3,
  });
}

function drawBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }
}

function moveBullets() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    bullet.y += -bullet.yspeed;
  }
}

function drawPlayer(player) {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.colour;
  ctx.fill();

  ctx.stroke();
  ctx.closePath();
  ctx.beginPath()
  ctx.moveTo(player.x,player.y-player.radius)
  ctx.lineTo(player.x,player.y-player.radius/player.radius*2)
  ctx.strokeStyle= "black"
  ctx.stroke()
  ctx.closePath
}

function drawtargets() {
  for (let i = 0; i < targets.length; i++) {
    let target = targets[i];
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = target.colour;
    ctx.fill();
    ctx.closePath();
    target.x += target.xspeed;
    target.y += target.yspeed;
  }
}
function bounceTargets() {
  for (let i = 0; i < targets.length; i++) {
    let target = targets[i];
    if (target.x + target.radius > cnv.width) {
      target.xspeed = -target.xspeed;
    }
    if (target.x - target.radius < 0) {
      target.xspeed = -target.xspeed;
    }
    if (target.y + target.radius > 500 - target.radius) {
      target.yspeed = -target.yspeed;
    }
    if (target.y - target.radius < 0) {
      target.yspeed = -target.yspeed;
    }
  }
}
function movePlayer() {
  if (dPressed && player.x < cnv.width - player.radius) {
    player.x += player.speed;
  }
  if (aPressed && player.x > player.radius) {
    player.x -= player.speed;
  }
}
function bulletBoundaryCollision() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (bullet.y - bullet.radius < 0) {
      bullets.splice(i, 1);
    }
  }
}
function targetCollision() {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];

    for (let p = 0; p < targets.length; p++) {
      let target = targets[p];

      if (
        bullet.x + bullet.radius > target.x - target.radius &&
        bullet.x - bullet.radius < target.x + target.radius &&
        bullet.y + bullet.radius > target.y - target.radius &&
        bullet.y - bullet.radius < target.y + target.radius
      ) {
        bullets.splice(i, 1);
        targets.splice(p, 1);
      }
    }
  }
}
function DrawLine() {
  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.lineTo(cnv.width, 500);
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.closePath();
}

document.addEventListener("keydown", keydownHandler);
function keydownHandler(e) {
  if (e.code === "KeyD") {
    dPressed = true;
  }
  if (e.code === "KeyA") {
    aPressed = true;
  }
}
document.addEventListener("keyup", keyupHandler);
function keyupHandler(e) {
  if (e.code === "KeyD") {
    dPressed = false;
  }
  if (e.code === "KeyA") {
    aPressed = false;
  }
}

document.addEventListener("mousedown", clickEvent);
function clickEvent() {
  addBullets(player.x, player.y);
}

function gameLoop() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  drawPlayer(player);
  drawtargets();
  bounceTargets();
  movePlayer();
  drawBullets();
  moveBullets();
  bulletBoundaryCollision();
  targetCollision();
  DrawLine();
  requestAnimationFrame(gameLoop);
}
addTargets(20);
gameLoop();
