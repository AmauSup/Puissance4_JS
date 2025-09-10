const prompts = require("prompts"); // Module pour poser des questions en console (interaction utilisateur)
const { changeColor } = require("./utils/colors"); // Fonction pour colorer le texte affiché

// ------------------- CONFIGURATION DU JEU -------------------
const AI_PLAY_FIRST = true; // true = l’IA commence, false = le joueur commence
const EMPTY_SYMBOLE = "_"; // Case vide
const AI_SYMBOLE = changeColor("O", "yellow"); // Symbole de l’IA (O en jaune)
const PLAYER_SYMBOLE = changeColor("X", "red"); // Symbole du joueur (X en rouge)

// ------------------- FONCTIONS DE BASE DU PLATEAU -------------------

// Crée un plateau vide (6 lignes × 7 colonnes)
const getEmptyBoard = () => {
  let board = [];
  for (let i = 0; i < 6; i++) {
    board.push(new Array(7).fill(EMPTY_SYMBOLE));
  }
  return board;
};

// Fait une copie indépendante du plateau (évite les modifications par référence)
function createBoardCopy(board) {
  return board.map((item) =>
    Array.isArray(item) ? createBoardCopy(item) : item
  );
}

// Affiche le plateau dans la console
const beautifyBoard = (board) => {
  for (let i = 0; i < board.length; i++) {
    console.log(board[i].join(" "));
  }
  console.log(["1", "2", "3", "4", "5", "6", "7"].join(" ")); // Numéros des colonnes
};

// Vérifie si on peut encore jouer dans une colonne (case du haut vide)
const canAddPiece = (board, column) => {
  return board[0][column] === EMPTY_SYMBOLE;
};

// Ajoute un pion dans la colonne choisie (il tombe en bas comme dans le vrai jeu)
const addPiece = (board, column, player) => {
  if (!canAddPiece(board, column)) {
    throw new Error("Column is full"); // Si colonne pleine → erreur
  }

  // Parcourt de bas en haut et place le pion dans la première case vide
  for (let i = board.length - 1; i >= 0; i--) {
    if (board[i][column] === EMPTY_SYMBOLE) {
      board[i][column] = player;
      return board;
    }
  }

  throw new Error("Unexpected error while adding piece");
};

// ------------------- INTERACTION JOUEUR -------------------

// Prépare les colonnes valides comme options du menu
const getPromptOptions = (board) => {
  const opts = [];
  for (let i = 0; i < board[0].length; i++) {
    if (canAddPiece(board, i)) {
      opts.push({ title: (i + 1).toString(), value: i }); // Ajoute seulement colonnes non pleines
    }
  }
  return {
    type: "select",
    name: "value",
    message: "Select a column", // Question affichée au joueur
    choices: opts,
    initial: 0,
  };
};

// Demande au joueur de choisir une colonne
const playerMove = async (board) => {
  const options = getPromptOptions(board);
  const response = await prompts(options);
  return response.value;
};

// ------------------- CONDITIONS DE VICTOIRE -------------------

// Vérifie si un joueur a gagné (4 alignés)
const isWinner = (board) => {
  // Horizontales
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length - 3; j++) {
      if (
        board[i][j] !== EMPTY_SYMBOLE &&
        board[i][j] === board[i][j + 1] &&
        board[i][j] === board[i][j + 2] &&
        board[i][j] === board[i][j + 3]
      ) {
        return board[i][j]; // Retourne le gagnant
      }
    }
  }

  // Verticales
  for (let i = 0; i < board.length - 3; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (
        board[i][j] !== EMPTY_SYMBOLE &&
        board[i][j] === board[i + 1][j] &&
        board[i][j] === board[i + 2][j] &&
        board[i][j] === board[i + 3][j]
      ) {
        return board[i][j];
      }
    }
  }

  // Diagonales ↘
  for (let i = 0; i < board.length - 3; i++) {
    for (let j = 0; j < board[i].length - 3; j++) {
      if (
        board[i][j] !== EMPTY_SYMBOLE &&
        board[i][j] === board[i + 1][j + 1] &&
        board[i][j] === board[i + 2][j + 2] &&
        board[i][j] === board[i + 3][j + 3]
      ) {
        return board[i][j];
      }

      // Diagonales ↙
      if (
        board[i][j + 3] !== EMPTY_SYMBOLE &&
        board[i][j + 3] === board[i + 1][j + 2] &&
        board[i][j + 3] === board[i + 2][j + 1] &&
        board[i][j + 3] === board[i + 3][j]
      ) {
        return board[i][j + 3];
      }
    }
  }

  return null; // Pas encore de gagnant
};

// Vérifie si le plateau est plein
const isBoardFull = (board) => {
  return board[0].every((cell) => cell !== EMPTY_SYMBOLE);
};

// ------------------- INTELLIGENCE ARTIFICIELLE -------------------

// Évalue le plateau (heuristique pour l’IA)
const evaluateBoard = (board) => {
  let score = 0;

  // Bonus pour contrôler la colonne centrale
  const centerColumn = Math.floor(board[0].length / 2);
  for (let row = 0; row < board.length; row++) {
    if (board[row][centerColumn] === AI_SYMBOLE) {
      score += 3;
    } else if (board[row][centerColumn] === PLAYER_SYMBOLE) {
      score -= 3;
    }
  }

  // Analyse horizontales, verticales et diagonales
  score += evaluateLines(board, AI_SYMBOLE);
  score -= evaluateLines(board, PLAYER_SYMBOLE);

  return score;
};

// Évalue toutes les lignes possibles pour un symbole
const evaluateLines = (board, symbol) => {
  let score = 0;

  // Horizontales
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length - 3; col++) {
      const line = [
        board[row][col],
        board[row][col + 1],
        board[row][col + 2],
        board[row][col + 3],
      ];
      score += evaluateLine(line, symbol);
    }
  }

  // Verticales
  for (let col = 0; col < board[0].length; col++) {
    for (let row = 0; row < board.length - 3; row++) {
      const line = [
        board[row][col],
        board[row + 1][col],
        board[row + 2][col],
        board[row + 3][col],
      ];
      score += evaluateLine(line, symbol);
    }
  }

  // Diagonales ↘
  for (let row = 0; row < board.length - 3; row++) {
    for (let col = 0; col < board[0].length - 3; col++) {
      const line = [
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3],
      ];
      score += evaluateLine(line, symbol);
    }
  }

  // Diagonales ↙
  for (let row = 0; row < board.length - 3; row++) {
    for (let col = 0; col < board[0].length - 3; col++) {
      const line = [
        board[row + 3][col],
        board[row + 2][col + 1],
        board[row + 1][col + 2],
        board[row][col + 3],
      ];
      score += evaluateLine(line, symbol);
    }
  }

  return score;
};

// Évalue une ligne de 4 cases
const evaluateLine = (line, symbol) => {
  let score = 0;
  const oppSymbol = symbol === AI_SYMBOLE ? PLAYER_SYMBOLE : AI_SYMBOLE;

  const countSymbol = (line, sym) => line.filter((cell) => cell === sym).length;
  const countEmpty = (line) =>
    line.filter((cell) => cell === EMPTY_SYMBOLE).length;

  // Bonus si l’IA a 4, 3 ou 2 alignés
  if (countSymbol(line, symbol) === 4) {
    score += 100;
  } else if (countSymbol(line, symbol) === 3 && countEmpty(line) === 1) {
    score += 5;
  } else if (countSymbol(line, symbol) === 2 && countEmpty(line) === 2) {
    score += 2;
  }

  // Malus si le joueur menace avec 3 alignés
  if (countSymbol(line, oppSymbol) === 3 && countEmpty(line) === 1) {
    score -= 4;
  }

  return score;
};

// Choix du meilleur coup pour l’IA avec Minimax
const aiPlay = (board) => {
  let bestScore = -Infinity;
  let bestMove = 0;

  for (let col = 0; col < board[0].length; col++) {
    if (canAddPiece(board, col)) {
      let boardCopy = createBoardCopy(board);
      addPiece(boardCopy, col, AI_SYMBOLE);
      let score = minimax(boardCopy, 3, -Infinity, Infinity, false); // profondeur = 3
      if (score > bestScore) {
        bestScore = score;
        bestMove = col;
      }
    }
  }

  return bestMove;
};

// Algorithme Minimax avec élagage alpha-bêta
const minimax = (board, depth, alpha, beta, maximizingPlayer) => {
  let winner = isWinner(board);
  if (winner === AI_SYMBOLE) return 1000;
  if (winner === PLAYER_SYMBOLE) return -1000;
  if (isBoardFull(board)) return 0;

  if (depth === 0) return evaluateBoard(board);

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (let col = 0; col < board[0].length; col++) {
      if (canAddPiece(board, col)) {
        let boardCopy = createBoardCopy(board);
        addPiece(boardCopy, col, AI_SYMBOLE);
        let eval = minimax(boardCopy, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, eval);
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) break; // Coupure alpha-bêta
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let col = 0; col < board[0].length; col++) {
      if (canAddPiece(board, col)) {
        let boardCopy = createBoardCopy(board);
        addPiece(boardCopy, col, PLAYER_SYMBOLE);
        let eval = minimax(boardCopy, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
};

// ------------------- BOUCLE PRINCIPALE DU JEU -------------------
const main = async () => {
  console.clear();
  let newBoard = getEmptyBoard();

  // Boucle jusqu’à victoire ou plateau plein
  while (!isWinner(newBoard) && !isBoardFull(newBoard)) {
    beautifyBoard(newBoard);

    // Si l’IA commence
    if (AI_PLAY_FIRST) {
      const aiColumn = aiPlay(newBoard);
      newBoard = addPiece(newBoard, aiColumn, AI_SYMBOLE);
      console.clear();
      beautifyBoard(newBoard);
    }

    // Tour du joueur
    const playerColumn = await playerMove(newBoard);
    newBoard = addPiece(newBoard, playerColumn, PLAYER_SYMBOLE);

    // Si l’IA ne jouait pas en premier → elle joue maintenant
    if (!AI_PLAY_FIRST) {
      const aiColumn = aiPlay(newBoard);
      newBoard = addPiece(newBoard, aiColumn, AI_SYMBOLE);
    }

    console.clear();
  }

  // Fin du jeu → affiche résultat
  beautifyBoard(newBoard);
  if (isWinner(newBoard)) {
    console.log("We have a winner!", isWinner(newBoard));
  }

  if (isBoardFull(newBoard)) {
    console.log("It's a tie!");
  }

  // Petit bonus inutile : affiche un nombre aléatoire (debug ?)
  const randomNum = Math.floor(Math.random() * 100);
  console.log("Random Number:", randomNum);
};

main(); // Lance le jeu
