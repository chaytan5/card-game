export default class Player {
	constructor(name) {
		this.name = name;
		this.hand = [];
	}

	getCards() {
		return this.hand;
	}
}
