const partsContainer = document.querySelector(".parts") as HTMLDivElement;
const parts = Array.from(partsContainer.children) as HTMLDivElement[];
const partsCount: number = parts.length;
const partsCountInRow: number = Math.sqrt(partsCount);
const emptyPart = document.querySelector(".empty") as HTMLDivElement;
const upArrow = document.querySelector(".arrow.up") as HTMLDivElement;
const leftArrow = document.querySelector(".arrow.left") as HTMLDivElement;
const downArrow = document.querySelector(".arrow.down") as HTMLDivElement;
const rightArrow = document.querySelector(".arrow.right") as HTMLDivElement;

// shuffle the parts "randomize the orders"
const shuffledParts = [...parts].sort(() => Math.random() - 0.5);
for (let i = 0; i < partsCount; i++) {
  shuffledParts[i].style.order = (i + 1).toString();
  parts[i].dataset.order = (i + 1).toString();
}

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

function moveEmptyUp() {
  const emptyOrder: number = +emptyPart.style.order;
  if (emptyOrder <= partsCount - partsCount / partsCountInRow) {
    const partToSwap = parts.find((part) => +part.style.order === emptyOrder + partsCountInRow);
    if (partToSwap) swapParts(emptyPart, partToSwap);
  }
}

function moveEmptyLeft() {
  const emptyOrder: number = +emptyPart.style.order;
  if (emptyOrder % partsCountInRow !== 0) {
    const partToSwap = parts.find((part) => +part.style.order === emptyOrder + 1);
    if (partToSwap) swapParts(emptyPart, partToSwap);
  }
}

function moveEmptyDown() {
  const emptyOrder: number = +emptyPart.style.order;
  if (emptyOrder > partsCount / partsCountInRow) {
    const partToSwap = parts.find((part) => +part.style.order === emptyOrder - partsCountInRow);
    if (partToSwap) swapParts(emptyPart, partToSwap);
  }
}

function moveEmptyRight() {
  const emptyOrder: number = +emptyPart.style.order;
  if (emptyOrder % partsCountInRow !== 1) {
    const partToSwap = parts.find((part) => +part.style.order === emptyOrder - 1);
    if (partToSwap) swapParts(emptyPart, partToSwap);
  }
}

function swapParts(part1: HTMLDivElement, part2: HTMLDivElement) {
  [part1.style.order, part2.style.order] = [part2.style.order, part1.style.order];
}

function checkWinningCondition() {}

function stopMoving() {
  upArrow.removeEventListener("click", moveEmptyUp);
  leftArrow.removeEventListener("click", moveEmptyLeft);
  downArrow.removeEventListener("click", moveEmptyDown);
  rightArrow.removeEventListener("click", moveEmptyRight);
  window.removeEventListener("keydown", handleKeyboardInput);
}
