const SUITS = ["♥", "♦", "♣", "♠️"];
const VALUES = [
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"J",
	"Q",
	"K",
	"A",
];

export default class Deck {
	constructor(cards = createDeck()) {
		this.cards = cards;
	}

	get numberOfCards() {
		return this.cards.length;
	}

	get lastCard() {
		return this.cards.slice(-1)[0];
	}

	get top() {
		return this.cards[0];
	}

	toString() {
		return this.cards.join(", ");
	}

	shuffle() {
		for (let i = this.numberOfCards - 1; i > 0; i--) {
			let newIndex = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[newIndex]] = [
				this.cards[newIndex],
				this.cards[i],
			];
		}
	}
}

class Card {
	constructor(suit, value) {
		this.suit = suit;
		this.value = value;
	}

	show() {
		return `${this.value} of ${this.suit}`;
	}
}

function createDeck() {
	return SUITS.flatMap((suit) => {
		return VALUES.map((value) => {
			return new Card(suit, value);
		});
	});
}
