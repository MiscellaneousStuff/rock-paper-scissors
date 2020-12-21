const roomName = document.querySelector(".room-name");
const messages = document.querySelector(".chat-messages");
const userCont = document.querySelector(".users");
const send = document.getElementById("send");
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io();
socket.emit("joinRoom", { username, room });

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    console.log("USERS:", users)
    userCont.innerText = users.map(u => u.username).join("\n");
}

function outputMessage(msg) {
    let div = document.createElement("div");
    div.textContent = `[${msg.time}] ${msg.username}: ${msg.text}`;
    messages.appendChild(div);
}

socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on("message", msg => {
    console.log("MSG:", msg)
    outputMessage(msg);

    messages.scrollTop = messages.scrollHeight;
})

send.addEventListener("submit", e => {
    e.preventDefault();

    let msg = e.target.elements.msg.value;
    msg = msg.trim();

    if (!msg) return false;

    socket.emit("chatMessage", msg);

    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
})