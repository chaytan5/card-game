import inquirer from "inquirer";

export default class Game {
	constructor() {
		this.players = [];
		this.currentPlayerIndex = 0;
		this.direction = 1;
		this.drawPile = new Deck();
		this.discardPile = [];
		this.winner = null;
		this.actionCardQueue = [];
		this.numPlayers = 0;
	}

	async initializePlayers() {
		const answer = await inquirer.prompt({
			type: "input",
			name: "numPlayers",
			message: "How many players are there? (2-4)",
			validate: (input) => {
				const numPlayers = parseInt(input);
				if (isNaN(numPlayers)) {
					return "Please enter a number.";
				}
				if (numPlayers < 2 || numPlayers > 4) {
					return "Number of players must be between 2 and 4.";
				}
				return true;
			},
		});

		this.numPlayers = answer.numPlayers;

		for (let i = 0; i < this.numPlayers; i++) {
			const answer = await inquirer.prompt({
				type: "input",
				name: `playerName`,
				message: `Enter name for player ${i + 1}:`,
			});
			this.players.push(new Player(answer.playerName));
		}
	}
}
