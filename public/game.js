const choiceButtons = document.querySelectorAll(".game__choice");
const gameInfo = document.querySelector(".game__info");
const resetButton = document.querySelector(".game__reset");

const outputInfo = info => {
    gameInfo.textContent = info;
}

const choiceHandler = e => {
    let choice = e.target.innerHTML;
    choice = choice.toLowerCase();

    socket.emit("choice", choice);
}

socket.on("turn", turn => {
    if (turn != username) {
        outputInfo("Other player choosing...");
    } else {
        outputInfo("Your turn! Choose an option...");
    }
});

socket.on("result", result => {
    outputInfo(result);
})

choiceButtons.forEach(button => button.addEventListener("click", choiceHandler));

resetButton.addEventListener("click", () => {
    socket.emit("reset");
})