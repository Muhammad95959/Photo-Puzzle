const partsContainer = document.querySelector(".parts") as HTMLDivElement;
const partsCountInRow: number = 3;
const partsCount: number = partsCountInRow * partsCountInRow;

// create the parts and add them to the container
for (let i = 1; i <= partsCount; i++) {
  const part = document.createElement("div");
  if (i === partsCount) part.classList.add("empty");
  else part.classList.add(`part-${i}`);
  partsContainer.appendChild(part);
}

// size the parts according to the browser width
const parts = Array.from(partsContainer.children) as HTMLDivElement[];
let oldPartsContainerWidth: number;
resizeParts();
window.addEventListener("resize", resizeParts);

// shuffle the parts "randomize the orders"
do {
  const shuffledParts = [...parts].sort(() => Math.random() - 0.5);
  for (let i = 0; i < partsCount; i++) {
    shuffledParts[i].style.order = (i + 1).toString();
    parts[i].dataset.order = (i + 1).toString();
  }
} while (checkCorrectOrder(false));

const upArrow = document.querySelector(".arrow.up") as HTMLDivElement;
const leftArrow = document.querySelector(".arrow.left") as HTMLDivElement;
const downArrow = document.querySelector(".arrow.down") as HTMLDivElement;
const rightArrow = document.querySelector(".arrow.right") as HTMLDivElement;
const emptyPart = document.querySelector(".empty") as HTMLDivElement;

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
    partsContainer.style.gridTemplateColumns = `repeat(${partsCountInRow}, auto)`;
    partWidth = partsContainerWidth / partsCountInRow;
    parts.forEach((part) => {
      part.style.backgroundSize = `${partsContainerWidth}px ${partsContainerWidth}px`;
      part.style.width = partWidth + "px";
      part.style.height = partWidth + "px";
    });
    let index = 0;
    for (let i = 0; i < partsCountInRow; i++) {
      for (let j = 0; j < partsCountInRow; j++) {
        parts[index++].style.backgroundPosition = `-${partWidth * j}px -${partWidth * i}px`;
      }
    }
  }
}

function moveEmptyUp() {
  const emptyOrder: number = +emptyPart.style.order;
  if (emptyOrder <= partsCount - partsCount / partsCountInRow) {
    const partToSwap = parts.find((part) => +part.style.order === emptyOrder + partsCountInRow);
    if (partToSwap) swapParts(emptyPart, partToSwap);
  }
  checkCorrectOrder(true);
}

function moveEmptyLeft() {
  const emptyOrder: number = +emptyPart.style.order;
  if (emptyOrder % partsCountInRow !== 0) {
    const partToSwap = parts.find((part) => +part.style.order === emptyOrder + 1);
    if (partToSwap) swapParts(emptyPart, partToSwap);
  }
  checkCorrectOrder(true);
}

function moveEmptyDown() {
  const emptyOrder: number = +emptyPart.style.order;
  if (emptyOrder > partsCount / partsCountInRow) {
    const partToSwap = parts.find((part) => +part.style.order === emptyOrder - partsCountInRow);
    if (partToSwap) swapParts(emptyPart, partToSwap);
  }
  checkCorrectOrder(true);
}

function moveEmptyRight() {
  const emptyOrder: number = +emptyPart.style.order;
  if (emptyOrder % partsCountInRow !== 1) {
    const partToSwap = parts.find((part) => +part.style.order === emptyOrder - 1);
    if (partToSwap) swapParts(emptyPart, partToSwap);
  }
  checkCorrectOrder(true);
}

function swapParts(part1: HTMLDivElement, part2: HTMLDivElement) {
  [part1.style.order, part2.style.order] = [part2.style.order, part1.style.order];
}

function checkCorrectOrder(winnable: boolean): boolean {
  const correctOrder: boolean = parts.every((part) => part.dataset.order === part.style.order);
  if (correctOrder) {
    if (winnable) {
      setTimeout(() => window.alert("Congratulations"));
      stopMoving();
    }
    return true;
  }
  return false;
}

function stopMoving() {
  upArrow.removeEventListener("click", moveEmptyUp);
  leftArrow.removeEventListener("click", moveEmptyLeft);
  downArrow.removeEventListener("click", moveEmptyDown);
  rightArrow.removeEventListener("click", moveEmptyRight);
  window.removeEventListener("keydown", handleKeyboardInput);
}
