#!/usr/bin/env node

import inquirer from "inquirer";
import Deck from "./deck.js";
import Player from "./player.js";

//

startGame();

async function startGame() {
	const deck = new Deck();
	deck.shuffle();
	let gameOver = false;
	let currentPlayer = 0;

	const numOfPlayers = await askNumberOfPlayers();
	const names = await askNameOfPlayers(numOfPlayers);
	const { players, drawPile } = await dealCards(deck, names);

	while (!gameOver) {
		let cardPlayed = false;
		console.log(
			"\n Top card of draw pile is " + JSON.stringify(drawPile.lastCard.show())
		);

		if (
			await playCard(players[currentPlayer % numOfPlayers], drawPile.lastCard)
		);

		gameOver = true;
	}
	/**  create discard pile -> done
    1. show the top card of draw pile and start turn of player 1 -> done
    2. take the input of player 1 -> done
    3. check if the card played is valid
    4. check if the card played is a special card and do changes accordingly
    5. repeat for rest of the players

    if draw pile if empty -> game draw
    if a player runs out of cards -> he is declared winner
  */
}

async function askNumberOfPlayers() {
	const answer = await inquirer.prompt({
		name: "number_of_players",
		type: "input",
		message:
			"Welcome to the Card Game! \n How many players want to play? (Min 2 and Max 4)",
	});

	return answer.number_of_players;
}

async function askNameOfPlayers(numOfPlayers) {
	let names = [];

	for (let i = 0; i < numOfPlayers; i++) {
		const answer = await inquirer.prompt({
			name: "name_of_player",
			type: "input",
			message: `Enter name of player ${i + 1}`,
		});

		names.push(answer.name_of_player);
	}

	return names;
}

async function dealCards(deck, names) {
	const players = [];
	for (let i = 0; i < names.length; i++) {
		const hand = new Deck(deck.cards.slice(i * 5, (i + 1) * 5));
		players.push(new Player(names[i], hand.cards));
	}
	const drawPile = new Deck(
		deck.cards.slice(names.length * 5, deck.numberOfCards)
	);

	const answer = await inquirer.prompt({
		name: "continue",
		type: "confirm",
		message:
			"Player decks and Draw pile have been created, press enter to continue.",
	});

	if (answer.continue) {
		return { players, drawPile };
	} else {
		process.exit(1);
	}
}

async function playCard(player, topCard) {
	const playerCards = player.getCards;
	console.log(playerCards);
	const answer = await inquirer.prompt({
		name: "select_card",
		type: "list",
		message: `It is the turn of ${player.getName}. Select the card you want to play`,
		choices: playerCards.map((card) => `${card.value} of ${card.suit}`),
	});

	// console.log(answer.select_card, topCard);

	const isValid = canPlayCard(answer.select_card, topCard);
	console.log(isValid);
}

function canPlayCard(cardPlayed, topCard) {
	const value = cardPlayed.split(" ")[0];
	const suit = cardPlayed.split(" ")[2];

	if (suit === topCard.suit || value === topCard.value) {
		return "valid";
	}
	return "invalid";
}
