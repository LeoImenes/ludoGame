import { LudoBoard } from "./gameUI/ludoBoard.js";
import {
  PLAYERS,
  COORDINATES_MAP,
  BASE_POSITIONS,
  START_POSITIONS,
  STATE,
  SAFE_POSITIONS,
  TURNING_POINTS,
  FINAL_POSITIONS,
  HOME_ENTRANCE,
} from "./utils/constants.js";
import { Elementhandling } from "./gameUI/UI.js";

export class LudoGame {
  currentPositions = {
    P1: [],
    P2: [],
    P3: [],
    P4: [],
  };

  _turn;
  get turn() {
    return this._turn;
  }
  set turn(value) {
    this._turn = value;
    const player = PLAYERS[value];

    document.querySelector(".active-player span").innerText = player;
    //alert("Vez do player " + player);
  }

  _state;
  get state() {
    return this._state;
  }
  set state(value) {
    this._state = value;

    if (value === STATE.DICE_NOT_ROLLED) {
      Elementhandling.enableDice();
      Elementhandling.unhighlightPieces();
    } else {
      Elementhandling.disableDice();
    }
  }

  _diceValue;
  get diceValue() {
    return this._diceValue;
  }
  set diceValue(value) {
    //MUDAR AQUI DPS
    this._diceValue = value;
    Elementhandling.setDiceValue(value);
  }
  _turn;
  get turn() {
    return this._turn;
  }

  /**
   * @param {Number} value
   */
  set turn(value) {
    this._turn = value;
    Elementhandling.setTurn(value);
  }

  listenDiceClick() {
    Elementhandling.listenDiceClick(this.onDiceClick.bind(this));
  }

  listenResetClick() {
    Elementhandling.listenResetClick(this.resetGame.bind(this));
  }

  listenPieceClick() {
    Elementhandling.listenPieceClick(this.onPieceClick.bind(this));
  }

  onPieceClick(event) {
    const target = event.target;
    const className = "player-piece";
    if (
      !target.classList.contains("player-piece") ||
      !target.classList.contains("highlight")
    ) {
      return;
    }

    const player = target.id;
    const piece = target.getAttribute("piece");
    this.handlePieceClick(player, piece);
  }

  handlePieceClick(player, piece) {
    const currentPosition = this.currentPositions[player][piece];

    if (BASE_POSITIONS[player].includes(currentPosition)) {
      this.setPiecePosition(player, piece, START_POSITIONS[player]);
      this.state = STATE.DICE_NOT_ROLLED;
      return;
    }

    Elementhandling.unhighlightPieces();
    this.movePiece(player, piece, this.diceValue);
  }

  constructor() {
    Elementhandling.openModal();

    Elementhandling.listenPlayClick(() => {
      const footer = document.querySelector(".footerRow");
      this.startGame();
      footer.style.display = "flex";
    });
  }

  startGame() {
    this.ludo = new LudoBoard();
    this.listenDiceClick();
    this.listenResetClick();
    this.listenPieceClick();
    this.resetGame();
    alert("Para iniciar, clique no dado");
  }
  onDiceClick() {
    Elementhandling.playDiceAudio();
    this.diceValue = 1 + Math.floor(Math.random() * 6);
    this.state = STATE.DICE_ROLLED;

    this.checkAvailablePieces();
  }

  getAvailablePieces(player) {
    return [0, 1, 2, 3].filter((piece) => {
      const currentPosition = this.currentPositions[player][piece];

      if (currentPosition === FINAL_POSITIONS[player]) {
        return false;
      }

      if (
        BASE_POSITIONS[player][piece] === currentPosition &&
        this.diceValue !== 6
      ) {
        return false;
      }

      if (
        HOME_ENTRANCE[player].includes(currentPosition) &&
        this.diceValue > FINAL_POSITIONS[player] - currentPosition
      ) {
        return false;
      }

      return true;
    });
  }

  checkAvailablePieces() {
    const player = PLAYERS[this.turn];
    const eligiblePieces = this.getAvailablePieces(player);
    if (eligiblePieces.length) {
     
      Elementhandling.highliightPieces(player, eligiblePieces);
    } else {
      this.incrementTurn();
    }
  }

  checkForKill(player, piece) {
    const currentPosition = this.currentPositions[player][piece];
    const opponents = {
      P1: ["P2", "P3", "P4"],
      P2: ["P1", "P3", "P4"],
      P3: ["P1", "P2", "P4"],
      P4: ["P1", "P2", "P3"],
    };

    let kill = false;

    opponents[player].forEach((opponent) => {
      const opponentPieces = this.currentPositions[opponent];
      opponentPieces.forEach((item, index) => {
        if (
          currentPosition === item &&
          !SAFE_POSITIONS.includes(currentPosition)
        ) {
          this.setPiecePosition(
            opponent,
            index,
            BASE_POSITIONS[opponent][index]
          );
          kill = true;
          Elementhandling.playDeathAudio();
        }
      });
    });

    return kill;
  }

  hasPlayerWon(player) {
    return [0, 1, 2, 3].every(
      (piece) =>
        this.currentPositions[player][piece] === FINAL_POSITIONS[player]
    );
  }

  incrementTurn() {
    this._turn = (this._turn + 1) % 4;
    Elementhandling.setTurn(this._turn);
    this.state = STATE.DICE_NOT_ROLLED;
  }
  resetGame() {
    this.currentPositions = structuredClone(BASE_POSITIONS);

    PLAYERS.forEach((player) => {
      [0, 1, 2, 3].forEach((piece) => {
        this.setPiecePosition(
          player,
          piece,
          this.currentPositions[player][piece]
        );
      });
    });

    this.turn = 0;
    Elementhandling.setTurn(this.turn);
    this.state = STATE.DICE_NOT_ROLLED;
  }

  incrementPiecePosition(player, piece) {
    this.setPiecePosition(
      player,
      piece,
      this.getIncrementedPosition(player, piece)
    );
  }

  getIncrementedPosition(player, piece) {
    var currentPosition = this.currentPositions[player][piece];

    if (currentPosition === TURNING_POINTS[player]) {
      return HOME_ENTRANCE[player][0];
    }
    if (currentPosition === 55) {
      return 0;
    }
    return currentPosition + 1;
  }

  setPiecePosition(player, piece, newPosition) {
    this.currentPositions[player][piece] = newPosition;
    Elementhandling.setPiecePosition(player, piece, newPosition);
  }

  movePiece(player, piece, moveBy) {
    const interval = setInterval(() => {
      this.incrementPiecePosition(player, piece);
      moveBy--;

      if (moveBy === 0) {
        clearInterval(interval);

        if (this.hasPlayerWon(player)) {
          Elementhandling.playWinAudio();
          alert(`Player: ${player} has won!`);
          this.resetGame();
          return;
        }

        const isKill = this.checkForKill(player, piece);

        if (isKill || this.diceValue === 6) {
          this.state = STATE.DICE_NOT_ROLLED;
          this.incrementTurn();
          return;
        }

        this.incrementTurn();
      }
    }, 200);
  }
}
const ludoGame = new LudoGame();
