const horse = document.getElementById("horse");
const grassContainer = document.getElementById("grass-container");
const grassSecond = document.getElementById("second-grass");
let isJumping = false;
let isMovingLeft = false;
let jumpInterval;
let moveInterval;
const grassWidth = 1000;
let currentPosition = 0;
let obstacles = [];
let gameStartTime = 0;
let score = 0;
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let lost = false;
let obstacleInterval;

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    if (lost) {
      clearInterval(obstacleInterval);
      resetGame();
      startGame();
    } else {
      if (!isJumping) {
        toggleJump();
      }
      if (!isMovingLeft) {
        toggleMovementLeft();
      }
    }
    // if (!gameStartTime) {
    //   startGame();
    //   startMovingElements();
    //   updateScore();
    // }
  }
});

function toggleJump() {
  if (isJumping) return;
  jump();
}

function toggleMovementLeft() {
  if (!isMovingLeft) {
    isMovingLeft = true;
    createObstacle();
    startMovingLeft();
  }
}

function startMovingLeft() {
  moveInterval = setInterval(() => {
    currentPosition -= 5;
    if (currentPosition <= -grassWidth) {
      currentPosition = 0;
    }
    grassContainer.style.left = currentPosition + "px";
    grassSecond.style.left = currentPosition + "px";
    moveObstacles();
  }, 20);
}

function shouldCreateObstacle() {
  const playerPosition = parseInt(getComputedStyle(horse).left);
  return playerPosition % 300 === 0 && playerPosition < 0;
}

function moveObstacles() {
  obstacles.forEach((obstacle, index) => {
    const obstaclePosition = parseInt(getComputedStyle(obstacle).left);
    obstacle.style.left = obstaclePosition - 5 + "px";
    if (obstaclePosition <= -50) {
      obstacles.splice(index, 1);
      obstacle.remove();
    }
  });
}

function jump() {
  let jumpHeight = 0;
  isJumping = true;
  jumpInterval = setInterval(() => {
    if (jumpHeight >= 300) {
      clearInterval(jumpInterval);
      fall();
    } else {
      jumpHeight += 20;
      updatePlayerPosition(jumpHeight);
    }
  }, 10);
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

function createObstacle() {
  if (lost) {
    return; // Если игра завершена, не создавайте новые препятствия
  }

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.left = "100%";
  document.getElementById("game-container").appendChild(obstacle);
  obstacles.push(obstacle);

  const randomDelay = Math.floor(Math.random() * 1000) + 800;
  obstacleInterval = setTimeout(createObstacle, randomDelay);
}

function updateScore() {
  const currentTime = Date.now();
  score = Math.floor((currentTime - gameStartTime) / 100);
  document.getElementById("score-area").textContent = `Score: ${score}`;
}

function startMovingElements() {
  moveInterval = setInterval(() => {
    currentPosition -= 5;
    if (currentPosition <= -grassWidth) {
      currentPosition = 0;
    }
    grassContainer.style.left = currentPosition + "px";
    grassSecond.style.left = currentPosition + "px";
    moveObstacles();
  }, 20);
  if (isMovingLeft) {
    createObstacle();
  }
}

function resetGame() {
  clearInterval(moveInterval);
  clearInterval(jumpInterval);
  clearInterval(obstacleInterval);

  obstacles.forEach((obstacle) => obstacle.remove());
  obstacles = [];
  currentPosition = 0;
  lost = false;
  score = 0;
  updateScore();
  startMovingElements();
  clearIntervals();
}

function startGame() {
  // Останавливаем все интервалы
  clearIntervals();

  gameStartTime = Date.now();
  horse.style.bottom = "0px";
  obstacles = [];
  clearObstacles();
}

const leaderboard = document.getElementById("leaderboard");

arr.reverse();
leaderboard.textContent = "Top result:";

for (let i = 0; i < arr.length; i++) {
  const item = document.createElement("div");
  item.innerText = `${i + 1} : ${arr[i]}`;
  leaderboard.appendChild(item);
}

let gameOrGameOver = setInterval(function () {
  let topOfHorse = parseInt(
    window.getComputedStyle(horse).getPropertyValue("bottom")
  );
  let fences = document.querySelectorAll(".obstacle");

  fences.forEach((fence) => {
    let leftOfFence = parseInt(
      window.getComputedStyle(fence).getPropertyValue("left")
    );

    if (topOfHorse < 20 && leftOfFence < 90 && leftOfFence > 50) {
      lost = true;
      isMovingLeft = false;
    }
  });

  if (lost) {
    clearInterval(moveInterval);
    clearInterval(jumpInterval);
    console.log(`lose, Score: ${score}`);
    handleResult(score);
  }
  if (isMovingLeft) {
    updateScore();
  }
}, 100);

function handleResult(score) {
  if (score === Math.max(...arr) || arr.includes(score)) {
  } else if (score >= Math.max(...arr)) {
    arr.unshift(score);
    arr.pop();
  } else {
    for (let i = 0; i < arr.length; i++) {
      if (score > arr[i]) {
        arr.splice(i, 0, score);
        arr.pop();
        break;
      }
    }
  }

  updateLeaderboard();
  arr = arr;
  localStorage.setItem("myArray", JSON.stringify(arr));
}

function updateLeaderboard() {
  const leaderboard = document.getElementById("leaderboard");
  leaderboard.textContent = "Top results:";
  for (let i = 0; i < arr.length; i++) {
    const item = document.createElement("div");
    item.innerText = `${i + 1}: ${arr[i]}`;
    leaderboard.appendChild(item);
  }
}

startGame();

function clearIntervals() {
  clearInterval(moveInterval);
  clearInterval(jumpInterval);
  clearInterval(obstacleInterval);
}
clearIntervals();
