import Card from "./card";

export default class Deck {
	constructor() {
		const suits = ["hearts", "diamonds", "clubs", "spades"];
		const ranks = [
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"10",
			"jack",
			"queen",
			"king",
			"ace",
		];
		this.cards = [];
		for (const suit of suits) {
			for (const rank of ranks) {
				this.cards.push(new Card(rank, suit));
			}
		}
		this.shuffle();
	}

	shuffle() {
		for (let i = this.cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		}
	}

	draw() {
		return this.cards.pop();
	}
}
