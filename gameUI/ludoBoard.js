import {
  BASE_POSITIONS,
  PLAYERS,
  SAFE_POSITIONS,
  COORDINATES_MAP,
} from "../utils/constants.js";

export class LudoBoard {
  constructor() {
    this.mainBoard = document.getElementById("ludoBoard");
    this.colors = {
      red: "#e75053",
      blue: "#6593f4",
      green: "#49a580",
      yellow: "#dcc64d",
      white: "#fff",
    };
    this.piecesElements = [];
    this.boardSize = 15;
    this.createBoard();
    this.setBases();
    this.setStartingPoint();
    this.addSafePostionsOnBase();
    this.setWinningPath();
    this.addPiecesOnBase();
  }

  addPiecesOnBase() {
    PLAYERS.forEach((player) => {
      BASE_POSITIONS[player].forEach((position, index) => {
        const [baseX, baseY] = COORDINATES_MAP[position];
        this.addDivAtCoordinates(player, index, baseX, baseY);
      });
    });
  }

  addSafePostionsOnBase() {
    SAFE_POSITIONS.forEach((item) => {
      const [x, y] = COORDINATES_MAP[item];
      this.setBackgroundImageStyle(x, y, "./assets/Logo/safePos2.png");
    });
  }

  addDivAtCoordinates(playerId, pieceIndex, x, y) {
    const cell = document.querySelector(`.field.line-${x}.col-${y}`);
    if (cell) {
      const div = document.createElement("div");
      const img = document.createElement("img");
      img.className = 'pieceIgm'
      div.appendChild(img);
      div.id = playerId;
      div.className = "player-piece highlight";
      div.setAttribute("piece", pieceIndex);
      cell.appendChild(div);
      this.piecesElements.push(div);
    }
  }

  setPosition(piece, x, y) {
    const cell = document.querySelector(`.field.line-${x}.col-${y}`);
    if (cell) {
      cell.appendChild(piece);
    }
  }

  createBoard() {
    for (let cols = 1; cols <= this.boardSize; cols++) {
      const divRow = document.createElement("div");
      this.mainBoard.appendChild(divRow);

      for (let lines = 1; lines <= this.boardSize; lines++) {
        const divCell = document.createElement("div");
        divCell.className = `field line-${lines} col-${cols}`;
       // divCell.innerText = `${lines},${cols}`;
        divRow.appendChild(divCell);
      }
    }
  }

  setBorderStyle(line, col, borderColor, borderWidth) {
    const boardFieldElement = document.querySelector(
      `.field.line-${line}.col-${col}`
    );
    if (boardFieldElement) {
      boardFieldElement.style.borderColor = borderColor;
      boardFieldElement.style.borderWidth = `${borderWidth}px`;
    }
  }

  setBackgroundImageStyle(line, col, backgroundImageUrl) {
    const boardFieldElement = document.querySelector(
      `.field.line-${line}.col-${col}`
    );
    if (boardFieldElement) {
      boardFieldElement.style.backgroundImage = `url(${backgroundImageUrl})`;
      boardFieldElement.style.width = "100%";
      boardFieldElement.style.backgroundSize = "cover";
    }
  }

  setBases() {
    this.setColor(1, 6, 1, 6, this.colors.red);
    this.setColor(2, 5, 2, 5, this.colors.white);
    this.setColor(3, 4, 3, 4, this.colors.red);

    this.setColor(10, 15, 1, 6, this.colors.blue);
    this.setColor(11, 14, 2, 5, this.colors.white);
    this.setColor(12, 13, 3, 4, this.colors.blue);

    this.setColor(1, 6, 10, 15, this.colors.green);
    this.setColor(2, 5, 11, 14, this.colors.white);
    this.setColor(3, 4, 12, 13, this.colors.green);

    this.setColor(10, 15, 10, 15, this.colors.yellow);
    this.setColor(11, 14, 11, 14, this.colors.white);
    this.setColor(12, 13, 12, 13, this.colors.yellow);
  }

  setStartingPoint() {
    this.setColor(7, 7, 2, 2, this.colors.red);
    this.setColor(9, 9, 14, 14, this.colors.yellow);
    this.setColor(14, 14, 7, 7, this.colors.blue);
    this.setColor(2, 2, 9, 9, this.colors.green);
  }

  setWinningPath() {
    this.setColor(8, 8, 2, 7, this.colors.red);
    this.setColor(8, 8, 9, 14, this.colors.yellow);
    this.setColor(2, 7, 8, 8, this.colors.green);
    this.setColor(9, 14, 8, 8, this.colors.blue);
  }

  setColor(startLine, endLine, startCol, endCol, color) {
    for (let line = startLine; line <= endLine; line++) {
      for (let col = startCol; col <= endCol; col++) {
        const boardFieldElement = document.querySelector(
          `.field.line-${line}.col-${col}`
        );
        if (boardFieldElement) {
          boardFieldElement.style.backgroundColor = color;
        }
      }
    }
  }
}
