const body = document.body;

class Card {
  #card = null;

  #status = null; // Open/Closed
  #state = null; // Clear/Right/Wrong

  #cardValue = null; // Value to display
  #cardNumber = null; // Value to compare

  constructor(value, number) {
    this.#cardValue = value;
    this.#cardNumber = number;
    this.#createCard();
  }

  getCard() {
    console.log(this.#card);
    return this.#card;
  }

  #setCard(card) {
    this.#card = card;
  }

  #createCard() {
    const card = document.createElement("div");
    card.className = "game__card";
    card.textContent = this.#cardValue;
    card.dataset.number = this.#cardNumber;

    card.addEventListener("click", addClass);

    this.#setCard(card);
  }
}

function addClass(e) {
  const cardTarget = e.target;
  console.log(cardTarget);

  cardTarget.classList.add("card--clicked");
  setTimeout(() => {
    cardTarget.classList.remove("card--clicked");
  }, 1000);
}

class GameField {
  #emojiArray = ["😀", "🙈", "🥵", "🥶", "💀", "👽", "👾", "🐷"];

  #gameMatrix = null;
  #gameGrid = null;

  constructor() {
    this.#createBoard();
  }

  #createBoard() {
    this.#createMatrix();
    this.#suffleArray();
    this.#createGameField();
  }

  #createMatrix() {
    let gameMatrix = new Array(4);

    for (let i = 0; i < gameMatrix.length; i++) {
      gameMatrix[i] = new Array(4);
    }

    this.#gameMatrix = gameMatrix;
  }

  #suffleArray() {
    const suffletdArray = [];
    const copyEmoji = this.#emojiArray.slice();
    const copyEmojiCounter = new Map();
    while (copyEmoji.length) {
      const emojiIndex = Math.floor(Math.random() * copyEmoji.length);
      const emoji = copyEmoji[emojiIndex];

      if (copyEmojiCounter[emoji] === undefined) {
        copyEmojiCounter[emoji] = 1;
        suffletdArray.push(emoji);
      } else {
        suffletdArray.push(emoji);
        copyEmoji.splice(emojiIndex, 1);
      }
    }
    this.#fillMatrix(suffletdArray);
  }

  #fillMatrix(suffledArray) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.#gameMatrix[i][j] = suffledArray[4 * i + j];
      }
    }
    console.log(this.#gameMatrix);
  }

  #createGameField() {
    this.#createGrid();
    this.#fillGrid();
    body.append(this.#gameGrid);
  }

  #createGrid() {
    const grid = document.createElement("div");
    grid.className = "game__grid";
    this.#gameGrid = grid;
  }

  #fillGrid() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const currentEmoji = this.#gameMatrix[i][j];
        const emojiIndex = this.#emojiArray.indexOf(currentEmoji);
        const card = new Card(currentEmoji, emojiIndex);
        this.#gameGrid.append(card.getCard());
      }
    }
  }
}

const gameFiled = new GameField();

/* 0 1 2 3
  4 5 6 7
  8 9 10 11
  12 13 14 15
*/
// Math.floor(x / 4) - i
// x - 4 * Math.floor(x / 4) - j
