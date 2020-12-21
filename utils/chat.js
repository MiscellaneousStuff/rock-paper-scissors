const moment = require("moment");

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

const botName = "Big Man Bot";

let users = [];

const userJoin = (id, username, room) => {
    const user = { id, username, room };

    users.push(user);
    console.log(`Users: ${users}`);
    return user;
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

module.exports = {
    formatMessage,
    botName,
    users,
    userJoin,
    getRoomUsers,
    getCurrentUser,
    userLeave
}