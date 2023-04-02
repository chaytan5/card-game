#!/usr/bin/env node

import inquirer from "inquirer";
import Deck from "./deck.js";
import Player from "./player.js";

//

startGame();

async function startGame() {
	const deck = new Deck();
	deck.shuffle();

	const numOfPlayers = await askNumberOfPlayers();

	const names = await askNameOfPlayers(numOfPlayers);

	const { players, drawPile } = await dealCards(deck, names);
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
			"Player decks and Draw pile have been created, press enter to continue...",
	});

	if (answer.continue) {
		return { players, drawPile };
	} else {
		process.exit(1);
	}
}
