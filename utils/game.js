const randint = max => { return Math.floor(Math.random() * Math.floor(max)); }

class Game {
    constructor() {
        this.players = [];
        this.turn = null;
        this.choices = []; // Records game choices
        this.done = true; // Set to true when two choices entered
        this.result = [false, false];
    }
    // SETTERSf
    setNextTurn() {
        this.turn = (0) ? this.turn == 1 : 1;
    }
    // GETTERS
    getPlayerTurn() {
        return this.players[this.turn];
    }
    correctPlayerCount() {
        return (true) ? (this.players.length == 2) : false;
    }
    getPlayers() {
        return this.players;
    }
    getTurn() {
        return this.players[this.turn];
    }
    getChoices() {
        return this.choices;
    }
    getDone() {
        return this.done;
    }
    getResult() {
        let firstWin = this.result[0];
        let secondWin = this.result[1];
        let res = "";

        if (!firstWin && !secondWin) {
            res = "The game is a draw!";
        } else if (firstWin && !secondWin) {
            res = `${this.players[0]} is the winner!`;
        } else if (!firstWin && secondWin) {
            res = `${this.players[1]} is the winner!`;
        }

        console.log(firstWin, secondWin, res);
        
        return res;
    }
    // PLAYER MANAGEMENT
    addPlayer(name) {
        /* Returns true if the player didn't already exist, false otherwise */
        if (!this.players.includes(name)) {
            this.players.push(name);
            return true;
        } else {
            return false;
        }
    }
    deletePlayer(name) {
        /* Returns true if the player existed, false otherwise */
        if (this.players.includes(name)) {
            this.players = this.players.filter(n => n != name);
            return true;
        } else {
            return false;
        }
    }
    // GAME FUNCTIONS
    reset() {
        /* Returns true if successful, false if otherwise */
        if (this.players.length != 2 && !this.done) {
            // Reset unsuccessful
            return false;
        } else {
            // Randomly set first players turn and clear choices, done and result
            this.turn = randint(1);
            this.choices = [];
            this.done = false;
            this.result = [false, false];

            // Reset successful
            return true;
        }
    }
    setResult() {
        // Determine the result!
        let firstChoice = this.choices[0];
        let secondChoice = this.choices[1];

        console.log("FIRST CHOICE, SECOND CHOICE:", this.choices, firstChoice, secondChoice)
        if (firstChoice == secondChoice) {
            this.result = [false, false];
        } else if (firstChoice == "paper") {
            if (secondChoice == "rock") {
                this.result = [true, false];
            } else {
                this.result = [false, true];
            }
        } else if (firstChoice == "rock") {
            if (secondChoice == "scissors") {
                this.result = [true, false];
            } else {
                this.result = [false, true];
            }
        } else if (firstChoice == "scissors") {
            if (secondChoice == "paper") {
                this.result = [true, false];
            } else {
                this.result = [false, true];
            }
        }
    }
    step(player, choice) {
        /* Returns true if successful, false if otherwise */
        if (this.getTurn() == player && !this.done) {
            // Append choice
            this.choices.push(choice);
            this.setNextTurn();

            // Check for done
            if (this.choices.length == 2) {
                // If we have two choices, we're done
                this.done = true;
                this.setResult();
            }
            return true;
        } else {
            return false;
        }
    }
}

module.exports = { Game };