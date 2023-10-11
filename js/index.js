const horse = document.getElementById("horse");
const grassContainer = document.getElementById("grass-container");
const grassSecond = document.getElementById("second-grass");
let isJumping = false;
let isMovingLeft = false;
let jumpInterval;
let moveInterval;
const grassWidth = 1000;
let currentPosition = 0;

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    if (!isJumping) {
      toggleJump();
    }
    if (!isMovingLeft) {
      toggleMovementLeft();
    }
  }
});

function toggleJump() {
  if (isJumping) return;
  jump();
}

function toggleMovementLeft() {
  if (isMovingLeft) {
    stopMovingLeft();
  } else {
    startMovingLeft();
  }
}

function startMovingLeft() {
  isMovingLeft = true;
  moveInterval = setInterval(() => {
    currentPosition -= 5; 
    if (currentPosition <= -grassWidth) {
      currentPosition = 0; 
    grassContainer.style.left = currentPosition + "px";
    grassSecond.style.left = currentPosition + "px";
  }, 20);
}

function stopMovingLeft() {
  isMovingLeft = false;
  clearInterval(moveInterval);
}

function jump() {
  let jumpHeight = 0;
  isJumping = true;
  jumpInterval = setInterval(() => {
    if (jumpHeight >= 300) {
      clearInterval(jumpInterval);
      fall();
    } else {
      jumpHeight += 10;
      updatePlayerPosition(jumpHeight);
    }
  }, 20);
}

function fall() {
  let fallHeight = 100;
  const fallInterval = setInterval(() => {
    if (fallHeight <= 0) {
      clearInterval(fallInterval);
      updatePlayerPosition(0);
      isJumping = false;
    } else {
      fallHeight -= 5;
      updatePlayerPosition(fallHeight);
    }
  }, 20);
}

function updatePlayerPosition(height) {
  horse.style.bottom = height + "px";
}
