"use strict";
const welcomeContainer = document.querySelector(".welcome");
const welcomeLeftArrow = document.querySelector(".welcome .arrow.left");
const welcomeRightArrow = document.querySelector(".welcome .arrow.right");
const welcomeSliderCards = Array.from(document.querySelectorAll(".welcome .slider > div"));
const welcomeNavDots = Array.from(document.querySelectorAll(".welcome .nav-dots > i"));
const images = Array.from(document.querySelectorAll(".welcome .images .image"));
const difficulties = Array.from(document.querySelectorAll(".welcome .choose-difficulty > div"));
const startNowBtn = document.querySelector(".welcome .start-card button");
const partsContainer = document.querySelector(".parts");
const settingsBtn = document.querySelector(".topbar button:has(div.settings)");
const restartBtn = document.querySelector(".topbar button:has(div.restart)");
const timeDiv = document.querySelector("div.time");
const upArrow = document.querySelector(".container .arrow.up");
const leftArrow = document.querySelector(".container .arrow.left");
const downArrow = document.querySelector(".container .arrow.down");
const rightArrow = document.querySelector(".container .arrow.right");
let started = false;
let partsBaseCount = 3;
let partsCount = partsBaseCount * partsBaseCount;
let selectedPhotoName;
let timeTracker;
let oldPartsContainerWidth;
let emptyPart;
let parts;
let lastPart = document.createElement("div");
lastPart.classList.add(`part-${partsCount}`);
// restore from localStorage
images.forEach((image) => {
    const imageName = window.localStorage.getItem("selected-image") || images[0].dataset.name;
    document.documentElement.style.setProperty("--imageUrl", `url('../assets/${imageName}')`);
    if (image.dataset.name === imageName) {
        image.classList.add("selected");
    }
    else {
        image.classList.remove("selected");
    }
});
difficulties.forEach((diff) => {
    const difficulty = window.localStorage.getItem("difficulty") || difficulties[0].dataset.diff;
    partsBaseCount = +difficulty;
    partsCount = partsBaseCount * partsBaseCount;
    if (diff.dataset.diff === difficulty) {
        diff.classList.add("selected");
    }
    else {
        diff.classList.remove("selected");
    }
});
// create, size and shuffle puzzle parts
createParts();
sizeParts();
shuffleParts();
window.addEventListener("resize", () => sizeParts());
welcomeLeftArrow.addEventListener("click", () => {
    welcomeRightArrow.classList.add("available");
    const currentCard = welcomeSliderCards.filter((card) => card.classList.contains("active"))[0];
    const prevCard = currentCard.previousElementSibling;
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
    const nextCard = currentCard.nextElementSibling;
    currentCard.classList.remove("active");
    nextCard.classList.add("active");
    if (nextCard.isSameNode(welcomeSliderCards[welcomeSliderCards.length - 1])) {
        welcomeRightArrow.classList.remove("available");
    }
    const nextCardIndex = welcomeSliderCards.indexOf(nextCard);
    welcomeNavDots[nextCardIndex - 1].classList.remove("active");
    welcomeNavDots[nextCardIndex].classList.add("active");
});
images.forEach((image) => {
    image.addEventListener("click", () => {
        images.forEach((img) => img.classList.remove("selected"));
        image.classList.add("selected");
        const imageName = image.dataset.name;
        document.documentElement.style.setProperty("--imageUrl", `url('../assets/${imageName}')`);
        window.localStorage.setItem("selected-image", imageName);
    });
});
difficulties.forEach((diff) => {
    diff.addEventListener("click", () => {
        difficulties.forEach((img) => img.classList.remove("selected"));
        diff.classList.add("selected");
        partsBaseCount = parseInt(diff.dataset.diff);
        partsCount = partsBaseCount * partsBaseCount;
        window.localStorage.setItem("difficulty", partsBaseCount.toString());
        createParts();
        sizeParts(true);
        shuffleParts();
    });
});
startNowBtn.addEventListener("click", () => {
    welcomeContainer.style.display = "none";
    document.querySelector(".container").classList.remove("hidden");
    window.addEventListener("keydown", handleKeyboardInput);
    upArrow.addEventListener("click", moveEmptyUp);
    leftArrow.addEventListener("click", moveEmptyLeft);
    downArrow.addEventListener("click", moveEmptyDown);
    rightArrow.addEventListener("click", moveEmptyRight);
});
settingsBtn.addEventListener("click", () => window.location.reload());
restartBtn.addEventListener("click", () => {
    createParts();
    sizeParts(true);
    shuffleParts();
    started = false;
    clearInterval(timeTracker);
    timeDiv.innerHTML = `time: 0.0`;
});
function handleKeyboardInput(ev) {
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
function createParts() {
    partsContainer.innerHTML = "";
    for (let i = 1; i <= partsCount; i++) {
        const part = document.createElement("div");
        if (i === partsCount) {
            part.classList.add("empty");
            part.dataset.order = i.toString();
        }
        else {
            part.classList.add(`part-${i}`);
            part.dataset.order = i.toString();
        }
        partsContainer.appendChild(part);
    }
    parts = Array.from(partsContainer.children);
    emptyPart = document.querySelector(".container .empty");
}
function sizeParts(force) {
    let partsContainerWidth;
    let partWidth;
    const windowWidth = window.innerWidth;
    if (windowWidth < 450)
        partsContainerWidth = 300;
    else if (windowWidth < 550)
        partsContainerWidth = 400;
    else if (windowWidth < 650)
        partsContainerWidth = 500;
    else
        partsContainerWidth = 600;
    if (oldPartsContainerWidth !== partsContainerWidth || force) {
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
        let index = 0, row = 0, col = 0;
        for (row = 0; row < partsBaseCount; row++) {
            for (col = 0; col < partsBaseCount; col++) {
                parts[index++].style.backgroundPosition = `-${partWidth * col}px -${partWidth * row}px`;
            }
        }
        lastPart.style.backgroundPosition = `-${partWidth * --col}px -${partWidth * --row}px`;
    }
}
function shuffleParts() {
    do {
        const shuffledParts = [...parts].sort(() => Math.random() - 0.5);
        for (let i = 0; i < partsCount; i++) {
            shuffledParts[i].style.order = (i + 1).toString();
        }
    } while (checkCorrectOrder(false));
}
function moveEmptyUp() {
    const emptyOrder = +emptyPart.style.order;
    if (emptyOrder <= partsCount - partsCount / partsBaseCount) {
        trackTime();
        const partToSwap = parts.find((part) => +part.style.order === emptyOrder + partsBaseCount);
        if (partToSwap)
            swapParts(emptyPart, partToSwap);
    }
    checkCorrectOrder(true);
}
function moveEmptyLeft() {
    const emptyOrder = +emptyPart.style.order;
    if (emptyOrder % partsBaseCount !== 0) {
        trackTime();
        const partToSwap = parts.find((part) => +part.style.order === emptyOrder + 1);
        if (partToSwap)
            swapParts(emptyPart, partToSwap);
    }
    checkCorrectOrder(true);
}
function moveEmptyDown() {
    const emptyOrder = +emptyPart.style.order;
    if (emptyOrder > partsCount / partsBaseCount) {
        trackTime();
        const partToSwap = parts.find((part) => +part.style.order === emptyOrder - partsBaseCount);
        if (partToSwap)
            swapParts(emptyPart, partToSwap);
    }
    checkCorrectOrder(true);
}
function moveEmptyRight() {
    const emptyOrder = +emptyPart.style.order;
    if (emptyOrder % partsBaseCount !== 1) {
        trackTime();
        const partToSwap = parts.find((part) => +part.style.order === emptyOrder - 1);
        if (partToSwap)
            swapParts(emptyPart, partToSwap);
    }
    checkCorrectOrder(true);
}
function trackTime() {
    if (!started) {
        started = true;
        let timePassed = 0;
        timeTracker = setInterval(() => {
            timePassed += 0.1;
            timeDiv.innerHTML = `time: ${timePassed.toFixed(1)}`;
        }, 100);
    }
}
function swapParts(part1, part2) {
    [part1.style.order, part2.style.order] = [part2.style.order, part1.style.order];
}
function checkCorrectOrder(winnable) {
    const correctOrder = parts.every((part) => part.dataset.order === part.style.order);
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
            const congratsDiv = document.querySelector(".congrats");
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
// Not-Implemented Section
const notImplementedDiv = document.querySelector(".not-implemented");
const notImplementedCloseBtn = document.querySelector(".not-implemented .closeBtn");
let notImplementedTime;
notImplementedCloseBtn.addEventListener("click", () => notImplementedDiv.classList.add("hidden"));
function notImplemented() {
    clearTimeout(notImplementedTime);
    if (notImplementedDiv.classList.contains("hidden")) {
        notImplementedDiv.classList.remove("hidden");
    }
    else {
        notImplementedDiv.style.opacity = "0";
        setTimeout(() => (notImplementedDiv.style.opacity = "1"), 100);
    }
    notImplementedTime = setTimeout(() => notImplementedDiv.classList.add("hidden"), 3000);
}
document.querySelector("button.more").onclick = notImplemented;
