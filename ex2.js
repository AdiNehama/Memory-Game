document.addEventListener("DOMContentLoaded", function () {
  const inputScreen = document.getElementById("input-screen");
  const gameScreen = document.getElementById("game-screen");
  const endScreen = document.getElementById("end-screen");
  const nameInput = document.getElementById("name-input");
  const cardInput = document.getElementById("card-input");
  const startButton = document.getElementById("start-button");
  const timer = document.getElementById("timer");
  const playerNameGame = document.getElementById("player-name-game");
  const playerNameEnd = document.getElementById("player-name-end");
  const cardsContainer = document.getElementById("cards-container");
  const playAgainButton = document.getElementById("play-again");
  const timeTaken = document.getElementById("time-taken");

  let cards = [];
  let revealedCards = [];
  let matchedPairs = 0;
  let totalPairs = 0;
  let moves = 0;
  let timerInterval = null;
  let playerName = "";

  startButton.addEventListener("click", startGame);
  playAgainButton.addEventListener("click", resetGame);

  function startGame() {
    playerName = nameInput.value.trim();
    const name = nameInput.value.trim();
    const numCards = parseInt(cardInput.value);

    if (name === "" || isNaN(numCards) || numCards < 2 || numCards > 30) {
      alert("Please enter a valid name and number of cards (2-30).");
      return;
    }

    playerNameGame.textContent = playerName;
    playerNameEnd.textContent = playerName;

    inputScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    // Clear the input fields
    nameInput.value = "";
    cardInput.value = "";

    createCards(numCards);
    startTimer();
  }

  function createCards(numCards) {
    totalPairs = numCards;
    const cardValues = Array.from(
      { length: numCards },
      (_, index) => index + 1
    );
    cards = shuffle([...cardValues, ...cardValues]);

    cards.forEach((cardValue, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.value = cardValue;
      card.addEventListener("click", () => revealCard(card));
      cardsContainer.appendChild(card);
    });
  }

  function revealCard(card) {
    if (
      revealedCards.length < 2 &&
      !revealedCards.includes(card) &&
      !card.classList.contains("revealed")
    ) {
      card.textContent = card.dataset.value;
      card.classList.add("revealed");
      revealedCards.push(card);

      if (revealedCards.length === 2) {
        moves++;
        setTimeout(checkMatch, 1000);
      }
    }
  }

  function checkMatch() {
    const [card1, card2] = revealedCards;
    const value1 = card1.dataset.value;
    const value2 = card2.dataset.value;

    if (value1 === value2) {
      card1.removeEventListener("click", () => revealCard(card1));
      card2.removeEventListener("click", () => revealCard(card2));
      revealedCards = [];
      matchedPairs++;

      if (matchedPairs === totalPairs) {
        endGame();
      }
    } else {
      card1.textContent = "";
      card1.classList.remove("revealed");
      card2.textContent = "";
      card2.classList.remove("revealed");
      revealedCards = [];
    }

    updateMoves();
  }

  function updateMoves() {
    const movesElement = document.getElementById("moves");
    movesElement.textContent = moves.toString();
  }

  function startTimer() {
    let seconds = 0;
    timerInterval = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      timer.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, 1000);
  }

  function endGame() {
    clearInterval(timerInterval);
    gameScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
    timeTaken.textContent = `Time taken: ${timer.textContent}`;
  }

  function resetGame() {
    inputScreen.classList.remove("hidden");
    endScreen.classList.add("hidden");
    cardsContainer.innerHTML = "";
    timer.textContent = "00:00";
    matchedPairs = 0;
    moves = 0;
    clearInterval(timerInterval);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
});
