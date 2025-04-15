const welcomeContainer = document.querySelector(".welcome") as HTMLDivElement;
const welcomeLeftArrow = document.querySelector(".welcome .arrow.left") as HTMLButtonElement;
const welcomeRightArrow = document.querySelector(".welcome .arrow.right") as HTMLButtonElement;
const welcomeSliderCards = Array.from(
  document.querySelectorAll(".welcome .slider > div"),
) as HTMLDivElement[];
const welcomeNavDots = Array.from(
  document.querySelectorAll(".welcome .nav-dots > i"),
) as HTMLElement[];
const startNowBtn = document.querySelector(".welcome .start-card button") as HTMLButtonElement;

welcomeLeftArrow.addEventListener("click", () => {
  welcomeRightArrow.classList.add("available");
  const currentCard = welcomeSliderCards.filter((card) => card.classList.contains("active"))[0];
  const prevCard = currentCard.previousElementSibling as HTMLDivElement;
  currentCard.classList.remove("active");
  prevCard.classList.add("active");
  if (prevCard.isSameNode(welcomeSliderCards[0])) {
    welcomeLeftArrow.classList.remove("available");
  }
  const prevCardIndex = welcomeSliderCards.indexOf(prevCard);
  welcomeNavDots[prevCardIndex + 1].classList.remove("active");
  welcomeNavDots[prevCardIndex].classList.add("active");
});

welcomeRightArrow.addEventListener("click", () => {
  welcomeLeftArrow.classList.add("available");
  const currentCard = welcomeSliderCards.filter((card) => card.classList.contains("active"))[0];
  const nextCard = currentCard.nextElementSibling as HTMLDivElement;
  currentCard.classList.remove("active");
  nextCard.classList.add("active");
  if (nextCard.isSameNode(welcomeSliderCards[welcomeSliderCards.length - 1])) {
    welcomeRightArrow.classList.remove("available");
  }
  const nextCardIndex = welcomeSliderCards.indexOf(nextCard);
  welcomeNavDots[nextCardIndex - 1].classList.remove("active");
  welcomeNavDots[nextCardIndex].classList.add("active");
});

startNowBtn.addEventListener("click", () => {
  welcomeContainer.style.display = "none";
  (document.querySelector(".container") as HTMLDivElement).classList.remove("hidden");
});

const partsContainer = document.querySelector(".parts") as HTMLDivElement;
const partsBaseCount: number = 3;
const partsCount: number = partsBaseCount * partsBaseCount;

// create the parts and add them to the container
for (let i = 1; i <= partsCount; i++) {
  const part = document.createElement("div");
  if (i === partsCount) {
    part.classList.add("empty");
    part.dataset.order = i.toString();
  } else {
    part.classList.add(`part-${i}`);
    part.dataset.order = i.toString();
  }
  partsContainer.appendChild(part);
}

// size the parts according to the browser width
const parts = Array.from(partsContainer.children) as HTMLDivElement[];
let oldPartsContainerWidth: number;
let lastPart = document.createElement("div") as HTMLDivElement;
lastPart.classList.add(`part-${partsCount}`);
resizeParts();
window.addEventListener("resize", resizeParts);

// shuffle the parts "randomize the orders"
do {
  // TODO: improve the shuffling
  const shuffledParts = [...parts].sort(() => Math.random() - 0.5);
  for (let i = 0; i < partsCount; i++) {
    shuffledParts[i].style.order = (i + 1).toString();
  }
} while (checkCorrectOrder(false));

const upArrow = document.querySelector(".container .arrow.up") as HTMLDivElement;
const leftArrow = document.querySelector(".container .arrow.left") as HTMLDivElement;
const downArrow = document.querySelector(".container .arrow.down") as HTMLDivElement;
const rightArrow = document.querySelector(".container .arrow.right") as HTMLDivElement;
const emptyPart = document.querySelector(".container .empty") as HTMLDivElement;
let started: boolean = false;
let timeTracker: number;

window.addEventListener("keydown", handleKeyboardInput);
upArrow.addEventListener("click", moveEmptyUp);
leftArrow.addEventListener("click", moveEmptyLeft);
downArrow.addEventListener("click", moveEmptyDown);
rightArrow.addEventListener("click", moveEmptyRight);

function handleKeyboardInput(ev: KeyboardEvent) {
  switch (ev.key) {
    case "ArrowUp":
      moveEmptyUp();
      break;
    case "ArrowLeft":
      moveEmptyLeft();
      break;
    case "ArrowDown":
      moveEmptyDown();
      break;
    case "ArrowRight":
      moveEmptyRight();
      break;
  }
}

function resizeParts() {
  let partsContainerWidth: number;
  let partWidth: number;
  const windowWidth = window.innerWidth;
  if (windowWidth < 450) partsContainerWidth = 300;
  else if (windowWidth < 550) partsContainerWidth = 400;
  else if (windowWidth < 650) partsContainerWidth = 500;
  else partsContainerWidth = 600;
  if (oldPartsContainerWidth !== partsContainerWidth) {
    oldPartsContainerWidth = partsContainerWidth;
    partsContainer.style.gridTemplateColumns = `repeat(${partsBaseCount}, auto)`;
    partWidth = partsContainerWidth / partsBaseCount;
    parts.forEach((part) => {
      part.style.backgroundSize = `${partsContainerWidth}px ${partsContainerWidth}px`;
      part.style.width = partWidth + "px";
      part.style.height = partWidth + "px";
    });
    lastPart.style.backgroundSize = `${partsContainerWidth}px ${partsContainerWidth}px`;
    lastPart.style.width = partWidth + "px";
    lastPart.style.height = partWidth + "px";
    let index = 0,
      row = 0,
      col = 0;
    for (row = 0; row < partsBaseCount; row++) {
      for (col = 0; col < partsBaseCount; col++) {
        parts[index++].style.backgroundPosition = `-${partWidth * col}px -${partWidth * row}px`;
      }
    }
    lastPart.style.backgroundPosition = `-${partWidth * --col}px -${partWidth * --row}px`;
  }
}

function moveEmptyUp() {
  const emptyOrder: number = +emptyPart.style.order;
  if (emptyOrder <= partsCount - partsCount / partsBaseCount) {
    trackTime();
    const partToSwap = parts.find((part) => +part.style.order === emptyOrder + partsBaseCount);
    if (partToSwap) swapParts(emptyPart, partToSwap);
  }
  checkCorrectOrder(true);
}

function moveEmptyLeft() {
  const emptyOrder: number = +emptyPart.style.order;
  if (emptyOrder % partsBaseCount !== 0) {
    trackTime();
    const partToSwap = parts.find((part) => +part.style.order === emptyOrder + 1);
    if (partToSwap) swapParts(emptyPart, partToSwap);
  }
  checkCorrectOrder(true);
}

function moveEmptyDown() {
  const emptyOrder: number = +emptyPart.style.order;
  if (emptyOrder > partsCount / partsBaseCount) {
    trackTime();
    const partToSwap = parts.find((part) => +part.style.order === emptyOrder - partsBaseCount);
    if (partToSwap) swapParts(emptyPart, partToSwap);
  }
  checkCorrectOrder(true);
}

function moveEmptyRight() {
  const emptyOrder: number = +emptyPart.style.order;
  if (emptyOrder % partsBaseCount !== 1) {
    trackTime();
    const partToSwap = parts.find((part) => +part.style.order === emptyOrder - 1);
    if (partToSwap) swapParts(emptyPart, partToSwap);
  }
  checkCorrectOrder(true);
}

function trackTime() {
  if (!started) {
    started = true;
    const timeDiv = document.querySelector("div.time") as HTMLDivElement;
    let timePassed = 0;
    timeTracker = setInterval(() => {
      timePassed += 0.1;
      timeDiv.innerHTML = `time: ${timePassed.toFixed(1)}`;
    }, 100);
  }
}

function swapParts(part1: HTMLDivElement, part2: HTMLDivElement) {
  [part1.style.order, part2.style.order] = [part2.style.order, part1.style.order];
}

function checkCorrectOrder(winnable: boolean): boolean {
  const correctOrder: boolean = parts.every((part) => part.dataset.order === part.style.order);
  if (correctOrder) {
    if (winnable) {
      stopMoving();
      emptyPart.remove();
      lastPart.style.order = partsCount.toString();
      partsContainer.appendChild(lastPart);
      partsContainer.style.gap = "0";
      parts.forEach((part) => (part.style.borderWidth = "0"));
      lastPart.style.borderWidth = "0";
      partsContainer.style.borderWidth = "1px";
      const congratsDiv = document.querySelector(".congrats") as HTMLDivElement;
      congratsDiv.style.visibility = "visible";
      setTimeout(() => (congratsDiv.style.opacity = "1"), 500);
      congratsDiv.addEventListener("click", () => {
        congratsDiv.style.opacity = "0";
        setTimeout(() => (congratsDiv.style.visibility = "hidden"), 500);
      });
    }
    return true;
  }
  return false;
}

function stopMoving() {
  clearInterval(timeTracker);
  upArrow.removeEventListener("click", moveEmptyUp);
  leftArrow.removeEventListener("click", moveEmptyLeft);
  downArrow.removeEventListener("click", moveEmptyDown);
  rightArrow.removeEventListener("click", moveEmptyRight);
  window.removeEventListener("keydown", handleKeyboardInput);
}
