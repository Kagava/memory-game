const body = document.body;
const lbKey = "LEADERBOARD";

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

  #valueOfMoves = 0;
  #valueOfRightPairs = 0;

  #gameContainer = null;
  #gameMatrix = null;
  #gameGrid = null;
  #movesContainer = null;
  #pairsContainer = null;

  #openFreeCardFlag = false;
  #fixedCard = null;
  #fixedCardIndex = null;

  constructor() {
    this.#createBoard();
  }

  getMetrix() {
    return { moves: this.#valueOfMoves };
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
    this.#valueOfMoves++;
    this.#changeValueOfMoves();
    if (card.dataset.number === this.#fixedCard.dataset.number) {
      this.#makeRight(card, this.#fixedCard);
      this.#valueOfRightPairs++;
      this.#changeValueOfRightPairs();
      this.#resetFixedCard();
    } else {
      this.#makeWrong(card, this.#fixedCard);
      this.#resetFixedCard();
    }
  }

  restertGame() {
    this.#valueOfMoves = 0;
    this.#valueOfRightPairs = 0;
    this.#movesContainer.textContent = `${this.#valueOfMoves}`;
    this.#pairsContainer.textContent = `${this.#valueOfRightPairs}/8`;
    this.#suffleArray();
    this.#gameGrid.innerHTML = "";
    this.#fillGrid();
  }

  #createBoard() {
    this.#createGameContainer();
    this.#createMatrix();
    this.#suffleArray();
    this.#createInfo();
    this.#createGameField();
  }

  #createGameContainer() {
    const gameContainer = document.createElement("div");
    gameContainer.className = "game";
    this.#gameContainer = gameContainer;
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
    this.#gameContainer.append(this.#gameGrid);
    body.append(this.#gameContainer);
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

  #createInfo() {
    const movesContainer = document.createElement("div");
    movesContainer.className = "game__moves-container";
    movesContainer.textContent = `${this.#valueOfMoves}`;
    this.#movesContainer = movesContainer;

    const pairsContainer = document.createElement("div");
    pairsContainer.className = "game__pairs-container";
    pairsContainer.textContent = `${this.#valueOfRightPairs}/8`;
    this.#pairsContainer = pairsContainer;

    this.#gameContainer.prepend(this.#pairsContainer);
    this.#gameContainer.prepend(this.#movesContainer);
  }

  #changeValueOfMoves() {
    this.#movesContainer.textContent = `${this.#valueOfMoves}`;
  }

  #changeValueOfRightPairs() {
    this.#pairsContainer.textContent = `${this.#valueOfRightPairs}/8`;
    if (this.#valueOfRightPairs === 1) {
      endGame();
    }
  }
}

class ModalWindow {
  #modal = null;
  #curtain = null;

  constructor() {
    this.#createModal();
  }

  openModalEnd(metrix) {
    if (!this.#modal) {
      this.#createModal();
    }
    this.#fillModalHeader("Winner winner, chicken dinner!".toUpperCase());
    this.#endModal(metrix);
    this.#curtain.classList.remove("curtain--closed");
  }

  openModalWinners() {
    if (!this.#modal) {
      this.#createModal();
    }
    console.log("OPEN");
  }

  #createModal() {
    const curtain = document.createElement("div");
    curtain.className = "curtain curtain--closed";
    // curtain.className = "curtain";
    curtain.addEventListener("click", this.#closeModal.bind(this));
    const modal = document.createElement("div");
    modal.className = "modal";
    this.#modal = modal;
    this.#fillDefaultModal();

    curtain.append(modal);
    this.#curtain = curtain;
    body.append(this.#curtain);
  }

  #closeModal(e) {
    const target = e.target;
    if (target.classList.contains("modal")) {
      return;
    }
    console.log(target);
    this.#curtain.classList.add("curtain--closed");
  }

  #fillDefaultModal() {
    const closeButton = document.createElement("button");
    closeButton.className = "modal__close-button";
    closeButton.textContent = "Закрыть";
    const header = document.createElement("h2");
    header.className = "modal__header";
    const modalContent = document.createElement("div");
    modalContent.className = "modal__content";

    this.#modal.append(closeButton);
    this.#modal.append(header);
    this.#modal.append(modalContent);
  }

  #fillModalHeader(headerText) {
    const header = this.#modal.querySelector(".modal__header");
    header.textContent = headerText;
  }

  #endModal(metrix) {
    const movesContainer = document.createElement("div");
    console.log(metrix);
    movesContainer.className = "modal__moves";
    movesContainer.innerText = `Количество ходов ${metrix.moves}`;

    const newGameButton = document.createElement("button");
    newGameButton.className = "modal__new-game";
    newGameButton.textContent = "НОВАЯ ИГРА";
    newGameButton.addEventListener("click", newGame);
    const modalContent = this.#modal.querySelector(".modal__content");
    modalContent.innerHTML = "";
    modalContent.append(movesContainer);
    modalContent.append(newGameButton);
  }
}

class LocalStorage {
  #leaderboardObj = null;

  constructor() {
    localStorage.getItem(lbKey);
  }
}

function gridClick(e) {
  const target = e.target;
  if (
    !target.classList.contains("game__card") ||
    gameFiled.getFixedCardIndex() === target.dataset.index
  ) {
    return;
  }
  target.classList.add("card--clicked");
  if (gameFiled.getOpenCardFlag()) {
    gameFiled.checkCards(target);
  } else {
    gameFiled.fixFirst(target);
  }
}

function endGame() {
  const moves = gameFiled.getMetrix();
  const date = new Date();
  const currentDate = `${String(date.getDay()).padStart(2, 0)}:${String(date.getMonth()).padStart(2, 0)}:${date.getFullYear()}`;
  console.log(currentDate);

  gameModal.openModalEnd(moves);

  const lb = JSON.parse(localStorage.getItem(lbKey));

  const newRecord = {
    moves,
    time: currentDate,
  };

  if (!lb) {
    const lcArray = [newRecord];
    localStorage.setItem(lbKey, JSON.stringify(lcArray));
  } else {
    lb.push(newRecord);
    localStorage.setItem(lbKey, JSON.stringify(lb));
  }
}

function newGame() {
  gameFiled.restertGame();
}

const gameModal = new ModalWindow();

const gameFiled = new GameField();
