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
    this.#setCard(card);
  }
}
