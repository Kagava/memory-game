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

const firstCard = new Card("😀", 1);

body.append(firstCard.getCard());

function addClass(e) {
  const cardTarget = e.target;
  console.log(cardTarget);
  //   cardTarget.classList.add("game__card--right");
  //   setTimeout(() => {
  //     cardTarget.classList.remove("game__card--right");
  //   }, 1000);
}
