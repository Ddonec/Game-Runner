const horse = document.getElementById("horse");
const grassContainer = document.getElementById("grass-container");
const grassSecond = document.getElementById("second-grass");
const leaderboard = document.getElementById("leaderboard");
const scoreValue = document.getElementById("score-area");
const gameover = document.getElementById("gameover");
const audioHorse = document.getElementById("ahorse");
const audioMenu = document.getElementById("amenu");
const audioFail = document.getElementById("afail");
const horseImage = document.getElementById("horseimage");

let topValueOfHorse = 5;
let isJumping = false;
let isMovingLeft = false;
let jumpInterval;
let moveInterval;
const grassWidth = 4000;
let currentPosition = 0;
let obstacles = [];
let gameStartTime = 0;
let score = 0;
let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let lost = false;
let obstacleInterval;
let randonLevelUpdate = 800;

function menuAudio() {
  audioMenu.play();
}
menuAudio();

audioMenu.addEventListener("ended", function () {
  audioMenu.currentTime = 0;
  audioMenu.play();
});

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    if (lost) {
      gameover.innerHTML = `Press 'Spase' <img id="spaceimg" src="assets/content/icons8-клавиша-пробел-50.png" alt=""> for start to play`;
      scoreValue.textContent = "Score: 0";
      resetGame();
      startGame();
    } else {
      if (!isJumping && topValueOfHorse < 5) {
        toggleJump();
      }
      if (!isMovingLeft) {
        toggleMovementLeft();
        // clearIntervals();
      }
    }
  }
});
function playMusic() {
  audioHorse.play();
}

function stopMusic() {
  audioHorse.pause();
  audioHorse.currentTime = 0;
}
function pauseMusicMenu() {
  audioMenu.pause();
}

function toggleJump() {
  if (isJumping) return;
  jump();
}

function toggleMovementLeft() {
  if (!isMovingLeft) {
    gameover.classList.add("none");
    gameStartTime = Date.now();
    isMovingLeft = true;
    createObstacle();
    startMovingLeft();
    playMusic();
    pauseMusicMenu();
    horseImage.src = "assets/content/horse-runner.gif";
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
    obstacle.style.left = obstaclePosition - 5 + "px"; // скорость препятствий
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
    if (jumpHeight >= 200) {
      clearInterval(jumpInterval);
      fall();
    } else {
      jumpHeight += 10;
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
  }, 15);
}

function updatePlayerPosition(height) {
  horse.style.bottom = height + "px";
}

function createObstacle() {
  if (lost) {
    return;
  }

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.left = "100%";
  document.getElementById("game-container").appendChild(obstacle);
  obstacles.push(obstacle);

  const randomDelay = Math.floor(
    Math.random() * 1000 + randonLevelUpdate - score / 3
  );
  obstacleInterval = setTimeout(createObstacle, randomDelay);
}

function updateScore() {
  const currentTime = Date.now();
  score = Math.floor((currentTime - gameStartTime) / 100);
  document.getElementById("score-area").textContent = `Score: ${score}`;
}

// function startMovingElements() {
//   moveInterval = setInterval(() => {
//     currentPosition -= 50;
//     if (currentPosition <= -grassWidth) {
//       currentPosition = 0;
//     }
//     grassContainer.style.left = currentPosition + "px";
//     grassSecond.style.left = currentPosition + "px";
//     moveObstacles();
//   }, 20);
//   if (isMovingLeft) {
//     createObstacle();
//   }
// }

function resetGame() {
  clearInterval(moveInterval);
  clearInterval(jumpInterval);
  clearInterval(obstacleInterval);

  obstacles.forEach((obstacle) => obstacle.remove());
  obstacles = [];
  currentPosition = 0;
  lost = false;
  score = 0;
  startMovingElements();
  clearIntervals();
}

function startGame() {
  clearIntervals();
  gameStartTime = Date.now();
  horse.style.bottom = "0px";
  obstacles = [];
}

arr.reverse();
leaderboard.textContent = "Top result:";

for (let i = 0; i < arr.length; i++) {
  const item = document.createElement("div");
  item.innerText = `${i + 1} : ${arr[i]}`;
  leaderboard.appendChild(item);
}

let gameOrGameOver;

gameOrGameOver = setInterval(function () {
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
      isJumping = false;
      horseImage.src = "assets/content/horse-stay.png";
      gameover.classList.remove("none");
      gameover.innerHTML =
        "Game over,&nbsp your " +
        scoreValue.textContent +
        "<br />" +
        `Press 'Spase' <img id="spaceimg" src="assets/content/icons8-клавиша-пробел-50.png" alt="">
        for restart`;
      menuAudio();
    }
  });

  if (lost) {
    clearInterval(moveInterval);
    clearInterval(jumpInterval);
    // console.log(`lose, Score: ${score}`);
    handleResult(score);
    stopMusic();
  }
  if (isMovingLeft) {
    updateScore();
  }
  topValueOfHorse = topOfHorse;
//   console.log(score);
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

// function checkState() {
//   if (isJumping) {
//   }
//   if (!isMovingLeft) {
//     console.log("nomov    ");
//   }
//   if (isMovingLeft === true) {
//     console.log("mov");
//   }
// }
// checkState();


//Под тачскрин
document.addEventListener("touchstart", (event) => {
    if (lost) {
      gameover.innerHTML = `Press 'Spase' <img id="spaceimg" src="assets/content/icons8-клавиша-пробел-50.png" alt=""> for start to play`;
      scoreValue.textContent = "Score: 0";
      resetGame();
      startGame();
    } else {
      if (!isJumping && topValueOfHorse < 5) {
        toggleJump();
      }
      if (!isMovingLeft) {
        toggleMovementLeft();
      }
    }
  });