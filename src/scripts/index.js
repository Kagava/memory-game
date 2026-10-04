const body = document.body;

class Card {
  #card = null;

  #status = null; // Open/Closed
  #state = null; // Clear/Right/Wrong

  #cardValue = null; // Value to display
  #cardNumber = null; // Value to compare
  #cardIndex = null; // id

  constructor(value, number, index) {
    this.#cardValue = value;
    this.#cardNumber = number;
    this.#cardIndex = index;
    this.#createCard();
  }

  getCard() {
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
    card.dataset.index = this.#cardIndex;

    this.#setCard(card);
  }
}

class GameField {
  #emojiArray = ["😀", "🙈", "🥵", "🥶", "💀", "👽", "👾", "🐷"];

  #gameMatrix = null;
  #gameGrid = null;

  #openFreeCardFlag = false;
  #fixedCard = null;
  #fixedCardIndex = null;

  constructor() {
    this.#createBoard();
  }

  getOpenCardFlag() {
    return this.#openFreeCardFlag;
  }

  getFixedCardIndex() {
    return this.#fixedCardIndex;
  }

  fixFirst(card) {
    this.#openFreeCardFlag = true;
    this.#fixedCard = card;
    this.#fixedCardIndex = card.dataset.index;
  }

  checkCards(card) {
    if (card.dataset.number === this.#fixedCard.dataset.number) {
      this.#makeRight(card, this.#fixedCard);
      this.#resetFixedCard();
    } else {
      this.#makeWrong(card, this.#fixedCard);
      this.#resetFixedCard();
    }
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
  }

  #createGameField() {
    this.#createGrid();
    this.#fillGrid();
    body.append(this.#gameGrid);
  }

  #createGrid() {
    const grid = document.createElement("div");
    grid.className = "game__grid";
    grid.addEventListener("click", gridClick);
    this.#gameGrid = grid;
  }

  #fillGrid() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const currentEmoji = this.#gameMatrix[i][j];
        const emojiIndex = this.#emojiArray.indexOf(currentEmoji);
        const card = new Card(currentEmoji, emojiIndex, i * 4 + j);
        this.#gameGrid.append(card.getCard());
      }
    }
  }

  #makeRight(card1, card2) {
    this.#gameGrid.classList.add("grid-no-click");
    card1.classList.add("game__card--right");
    card2.classList.add("game__card--right");
    card1.classList.add("game__card-fix");
    card2.classList.add("game__card-fix");
    setTimeout(() => {
      card1.classList.remove("game__card--right");
      card2.classList.remove("game__card--right");
      this.#gameGrid.classList.remove("grid-no-click");
    }, 1000);
  }

  #makeWrong(card1, card2) {
    console.log(this.#gameGrid);
    const grid = this.#gameGrid;
    this.#gameGrid.classList.add("grid-no-click");
    card1.classList.add("game__card--wrong");
    card2.classList.add("game__card--wrong");
    setTimeout(() => {
      card1.classList.remove("game__card--wrong");
      card2.classList.remove("game__card--wrong");
      card1.classList.remove("card--clicked");
      card2.classList.remove("card--clicked");
      this.#gameGrid.classList.remove("grid-no-click");
    }, 1000);
  }

  #resetFixedCard() {
    this.#openFreeCardFlag = false;
    this.#fixedCard = null;
    this.#fixedCardIndex = null;
  }
}

function gridClick(e) {
  const target = e.target;
  if (
    !target.classList.contains("game__card") ||
    gameFiled.getFixedCardIndex() === target.dataset.index
  ) {
    console.log(gameFiled.getFixedCardIndex(), target.dataset.index);
    return;
  }
  console.log(gameFiled.getFixedCardIndex(), target.dataset.index);
  target.classList.add("card--clicked");
  if (gameFiled.getOpenCardFlag()) {
    gameFiled.checkCards(target);
  } else {
    gameFiled.fixFirst(target);
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
