export default class Player {
	constructor(name, cards) {
		this.name = name;
		this.cards = cards;
	}

	get getCards() {
		return this.cards;
	}

	get getName() {
		return this.name;
	}
}
