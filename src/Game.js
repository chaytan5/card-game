import inquirer from "inquirer";
import Deck from "./Deck.js";
import Player from "./Player.js";

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

	dealCards() {
		for (let i = 0; i < 5; i++) {
			for (const player of this.players) {
				player.hand.push(this.drawPile.draw());
			}
		}
		this.discardPile.push(this.drawPile.draw());
	}

	isValidCard(card) {
		const topCard = this.discardPile[this.discardPile.length - 1];
		return card.rank === topCard.rank || card.suit === topCard.suit;
	}

	async run() {
		await this.initializePlayers();
		this.dealCards();
		while (this.winner === null) {
			await this.playTurn();
			const confirm = await inquirer.prompt({
				name: "confirm",
				type: "confirm",
				message: "Press enter to play turn for next player.",
			});
			if (confirm.confirm) {
				continue;
			} else {
				process.exit(1);
			}
		}
	}

	handleActionCards(card) {
		switch (card.rank) {
			case "ace":
				console.log(`Player ${this.currentPlayerIndex + 1} will be skipped!`);
				this.currentPlayerIndex = this.direction + 2;
				if (this.currentPlayerIndex < 0) {
					this.currentPlayerIndex = this.numPlayers - 1;
				} else if (this.currentPlayerIndex >= this.numPlayers) {
					this.currentPlayerIndex = 0;
				}
				break;

			case "king":
				this.direction *= -1;
				console.log(`The turn order has been reversed!`);
				break;

			case "queen":
				this.currentPlayerIndex += this.direction;
				if (this.currentPlayerIndex < 0) {
					this.currentPlayerIndex = this.numPlayers - 1;
				} else if (this.currentPlayerIndex >= this.numPlayers) {
					this.currentPlayerIndex = 0;
				}
				this.players[this.currentPlayerIndex].hand.push(this.drawPile.draw());
				this.players[this.currentPlayerIndex].hand.push(this.drawPile.draw());
				console.log(`Player ${this.currentPlayerIndex + 1} draws 2 cards!`);
				break;

			case "jack":
				this.currentPlayerIndex += this.direction;
				if (this.currentPlayerIndex < 0) {
					this.currentPlayerIndex = this.numPlayers - 1;
				} else if (this.currentPlayerIndex >= this.numPlayers) {
					this.currentPlayerIndex = 0;
				}
				this.players[this.currentPlayerIndex].hand.push(this.drawPile.draw());
				this.players[this.currentPlayerIndex].hand.push(this.drawPile.draw());
				this.players[this.currentPlayerIndex].hand.push(this.drawPile.draw());
				this.players[this.currentPlayerIndex].hand.push(this.drawPile.draw());
				console.log(`Player ${this.currentPlayerIndex + 1} draws 4 cards!`);
				break;
		}
	}

	getNextPlayer() {
		let nextPlayer = this.currentPlayerIndex + this.direction;
		if (nextPlayer < 0) {
			nextPlayer = this.numPlayers - 1;
		} else if (nextPlayer >= this.numPlayers) {
			nextPlayer = 0;
		}
		return nextPlayer;
	}

	async playTurn() {
		const currentPlayerHand = this.players[this.currentPlayerIndex].getCards();
		console.log(`\nPlayer ${this.currentPlayerIndex + 1}'s turn!`);
		console.log(
			`Top card: ${this.discardPile[this.discardPile.length - 1].rank} of ${
				this.discardPile[this.discardPile.length - 1].suit
			}`
		);

		console.log(
			`Your hand: ${currentPlayerHand
				.map((card) => `${card.rank} of ${card.suit}`)
				.join(", ")}`
		);

		const playableCards = currentPlayerHand.filter((card) =>
			this.isValidCard(card)
		);
		if (playableCards.length === 0) {
			console.log(
				`You don't have any playable cards, so you have to draw a card.`
			);
			if (this.drawPile.cards.length === 0) {
				console.log("Draw pile is empty. The game ends in a draw.");
				process.exit(0);
			}
			const drawnCard = this.drawPile.draw();
			console.log(`You drew the ${drawnCard.rank} of ${drawnCard.suit}.`);
			if (this.isValidCard(drawnCard)) {
				console.log(`You can play the ${drawnCard.rank} of ${drawnCard.suit}!`);
				currentPlayerHand.push(drawnCard);
				this.discardPile.push(
					currentPlayerHand.splice(currentPlayerHand.indexOf(drawnCard), 1)[0]
				);
				if (
					drawnCard.rank === "ace" ||
					drawnCard.rank === "king" ||
					drawnCard.rank === "queen" ||
					drawnCard.rank === "jack"
				) {
					this.handleActionCards(drawnCard);
				} else {
					this.currentPlayerIndex = this.getNextPlayer();
				}
			} else {
				console.log(
					`Sorry, you still can't play any cards. It's the next player's turn.`
				);
				this.currentPlayerIndex = this.getNextPlayer();
			}
		} else {
			const cardChoices = playableCards.map((card) => ({
				name: `${card.rank} of ${card.suit}`,
				value: card,
			}));
			cardChoices.push({ name: "Draw a card", value: null });
			const { chosenCard } = await inquirer.prompt([
				{
					type: "list",
					name: "chosenCard",
					message: "Choose a card to play or draw a card:",
					choices: cardChoices,
				},
			]);
			if (chosenCard === null) {
				const drawnCard = this.drawPile.draw();
				console.log(`You drew the ${drawnCard.rank} of ${drawnCard.suit}.`);
				if (this.isValidCard(drawnCard)) {
					console.log(
						`You can play the ${drawnCard.rank} of ${drawnCard.suit}!`
					);
					currentPlayerHand.push(drawnCard);
					this.discardPile.push(
						currentPlayerHand.splice(currentPlayerHand.indexOf(drawnCard), 1)[0]
					);
					if (
						drawnCard.rank === "ace" ||
						drawnCard.rank === "king" ||
						drawnCard.rank === "queen" ||
						drawnCard.rank === "jack"
					) {
						this.handleActionCards(drawnCard);
					} else {
						this.currentPlayerIndex = this.getNextPlayer();
					}
				} else {
					console.log(
						`Sorry, you still can't play any cards. It's the next player's turn.`
					);
					this.currentPlayerIndex = this.getNextPlayer();
				}
			} else {
				this.discardPile.push(
					currentPlayerHand.splice(currentPlayerHand.indexOf(chosenCard), 1)[0]
				);
				console.log(`You played the ${chosenCard.rank} of ${chosenCard.suit}.`);

				if (currentPlayerHand.length === 0) {
					console.log(`Congratulations! You win!`);
					process.exit();
				}
				if (
					chosenCard.rank === "ace" ||
					chosenCard.rank === "king" ||
					chosenCard.rank === "queen" ||
					chosenCard.rank === "jack"
				) {
					this.handleActionCards(chosenCard);
				} else {
					this.currentPlayerIndex = this.getNextPlayer();
				}
			}
		}
	}
}
