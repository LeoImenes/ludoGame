import { LudoGame } from "../index.js";
import { PLAYERS, COORDINATES_MAP } from "../utils/constants.js";
import metalicAudio from "../assets/audio/metallic-clink.wav"

const diceButtonElement = document.querySelector("#dice-btn");
let playerNames = [];

export class Elementhandling {
  static listenDiceClick(callback) {
    diceButtonElement.addEventListener("click", callback);
  }

  static listenResetClick(callback) {
    document
      .querySelector("button#reset-btn")
      .addEventListener("click", callback);
  }

  static listenPlayClick(callback) {
    document.querySelector(".playBtn").addEventListener("click", callback);
  }

  static playWinAudio() {
    const audio = new Audio("/assets/audio/victory_sJDDywi.mp3");
    audio.play();
  }
  static playDeathAudio() {
    const audio = new Audio("/assets/audio/roblox-death-sound_1.mp3");
    audio.play();
  }
  static playDiceAudio() {
    const audio = new Audio("/assets/audio/shake-and-roll-dice-soundbible.mp3");
    audio.play();
  }
  static playAvailableAudio() {
    const audio = new Audio(metalicAudio);
    audio.play();
  }
  static playMoveAudio() {
    const audio = new Audio("/assets/audio/move-self.mp3");
    audio.play();
  }

  static clearInputFields() {
    const playerForms = document.querySelectorAll('input[type="text"]');
    playerForms.forEach((player) => {
      player.value = "";
    });
  }

  static playerForm() {
    const playBtn = document.querySelector(".playBtn");
    const playerForms = document.querySelectorAll('input[type="text"]');

    playBtn.addEventListener("click", () => {
      playerForms.forEach((player) => {
        playerNames.push(player.value.trim()); // Adiciona os nomes dos jogadores ao array
      });
      this.closeModal();
    });
  }

  static listenPieceClick(callback) {
    const element = document.querySelectorAll(".player-piece");
    element.forEach((item) => {
      item.addEventListener("click", callback);
    });
  }

  static enableDice() {
    diceButtonElement.removeAttribute("disabled");
  }

  static disableDice() {
    diceButtonElement.setAttribute("disabled", "");
  }

  static setPiecePosition(player, piece, newPosition) {
    const pieceElement = document.querySelector(
      `div[id="${player}"][piece="${piece}"]`
    );
    const [x, y] = COORDINATES_MAP[newPosition];
    const newParentElement = document.querySelector(
      `div.field.line-${x}.col-${y}`
    );
    newParentElement.insertBefore(pieceElement, newParentElement.firstChild);
    this.playMoveAudio();
  }

  static openModal() {
    playerNames = [];
    const modal = document.querySelector(".players-modal");
    modal.style.display = "flex";
    this.playerForm();
  }
  static closeModal() {
    const modal = document.querySelector(".players-modal");
    modal.style.display = "none";
  }

  /**
   *
   * @param {string} player
   * @param {Number[]} pieces
   */
  static highliightPieces(player, pieces) {
    this.playAvailableAudio();
    pieces.map((piece) => {
      document
        .querySelector(`div[id="${player}"][piece="${piece}"]`)
        .classList.add("highlight");
    });
  }

  static unhighlightPieces() {
    document.querySelectorAll(".player-piece.highlight").forEach((ele) => {
      ele.classList.remove("highlight");
    });
  }

  static setDiceValue(value) {
    const diceImage = document.querySelector(".dice-value");
    diceImage.src = `assets/dice/dice${value}.png`;
  }

  static updatePlayers() {
    const playerElements = document.querySelectorAll(".player-name");
    playerElements.forEach((element, index) => {
      element.textContent = playerNames[index] || "Player " + (index + 1);
    });
  }

  static setTurn(index) {
    if (index < 0 || index >= PLAYERS.length) {
      return;
    }
    const PawnImage = document.querySelector(".PawnImage");

    PawnImage.src = `assets/pawns/${PLAYERS[index]}.png`;

    const activePlayerSpan = document.querySelector(".active-player span");
    const playerName =
      playerNames[index] !== ""
        ? `Sua vez: ${playerNames[index]}`
        : `Sua vez: ${PLAYERS[index]}`;

    activePlayerSpan.innerText = playerName;
  }
  static enableDice() {
    diceButtonElement.removeAttribute("disabled");
  }

  static disableDice() {
    diceButtonElement.setAttribute("disabled", "");
  }
}
