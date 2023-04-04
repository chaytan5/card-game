# Card game

## Installation

```
git clone https://github.com/chaytan5/card-game
cd card-game
npm install
```

## Usage

1. Program runs in the command line. Start it with `npm start`.
2. Enter the number of players(2-4).
3. Each player gets their turn and they can choose which card they want to play.
4. The player who finishes their cards first wins and if the draw pile gets empty, the game results in a draw.

## Rules

- Player can only play a card if it matches either the suit or the rank of the top card on the discard pile.
- If a player can't play a card, they must draw a card from the draw pile.
- If the draw pile is empty, the game ends in a draw, and no player is declared winner.
- Ace(A), King(K), Queen(Q) and Jacks(J) are action cards and if one of these is played, the following occurs:
  - Ace(A): Skip the next player in turn.
  - King(K): Reverse the sequence of turns.
  - Queen(Q): Next player has to draw 2 cards.
  - Jack(J): Next player has to draw 4 cards.
- Actions are not stackable i.e. if a player plays an action card, next player can not use the same card.
