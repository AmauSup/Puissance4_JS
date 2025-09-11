# 🎮 Connect Four – Solo Console Game with AI (Node.js)

##🧠 Project Overview

This project is a solo version of Connect Four, played in the terminal against an AI opponent.
The AI uses the Minimax algorithm with alpha–beta pruning to analyze the board and make strategic decisions.

Key features:

🟨 AI opponent (no multiplayer mode)

🎨 Colored symbols for better readability in the console

✅ Automatic detection of wins, losses, and draws

⚡ Efficient AI with a depth-limited search for smooth gameplay

📂 Project Structure

```
.
├── node_modules/       # Installed dependencies
├── utils/
│   └── colors.js       # Utility to colorize console output
├── index.js            # Main game logic (entry point)
├── package.json        # Project metadata and dependencies
└── package-lock.json   # Auto-generated lockfile

```
📦 Requirements

Node.js v18+ → Download

npm (comes with Node.js)

Dependencies:

prompts– interactive CLI prompts

🚀 Installation & Usage

1️⃣ Clone the repository:
```
git clone https://github.com/your-username/connect-four-ai.git
cd connect-four-ai
```

2️⃣ Install dependencies:
```
npm install
```

3️⃣ Start the game:
```
node index.js
```

⚙️ Configuration

At the top of index.js, you can change some settings:
```
// Decide who plays first
const AI_PLAY_FIRST = true; // true = AI starts, false = player starts

// Customize symbols and colors
const AI_SYMBOLE = changeColor("O", "yellow");
const PLAYER_SYMBOLE = changeColor("X", "red");
```

🎲 Gameplay

The board starts empty:
```
_ _ _ _ _ _ _
_ _ _ _ _ _ _
_ _ _ _ _ _ _
_ _ _ _ _ _ _
_ _ _ _ _ _ _
_ _ _ _ _ _ _
1 2 3 4 5 6 7

```
Player’s turn → choose a column (1–7)

AI’s turn → instantly responds with its move

The game ends when either:

🏆 A player aligns 4 pieces in a row (horizontal, vertical, or diagonal)

🤝 The board is full (draw)

🧠 AI Algorithm

The AI evaluates moves using Minimax with alpha–beta pruning (depth = 3).

Evaluation Function:

+3 → AI controls center column

+100 → AI has 4 in a row (winning state)

+5 → AI has 3 in a row with one empty

+2 → AI has 2 in a row with two empties

-4 → Player has 3 in a row (threat)

This makes the AI play offensively and defensively, balancing attack and block strategies.

📜 Main Loop Example
```
const main = async () => {
  console.clear();
  let newBoard = getEmptyBoard();

  while (!isWinner(newBoard) && !isBoardFull(newBoard)) {
    beautifyBoard(newBoard);

    if (AI_PLAY_FIRST) {
      const aiColumn = aiPlay(newBoard);
      newBoard = addPiece(newBoard, aiColumn, AI_SYMBOLE);
      console.clear();
      beautifyBoard(newBoard);
    }

    const playerColumn = await playerMove(newBoard);
    newBoard = addPiece(newBoard, playerColumn, PLAYER_SYMBOLE);

    if (!AI_PLAY_FIRST) {
      const aiColumn = aiPlay(newBoard);
      newBoard = addPiece(newBoard, aiColumn, AI_SYMBOLE);
    }

    console.clear();
  }

  beautifyBoard(newBoard);
  console.log(isWinner(newBoard) ? "We have a winner!" : "It's a tie!");
};

main();
```

🚀 Future Improvements

🔧 Difficulty levels (adjustable AI depth)

🏅 Scoring system (track wins/losses)

🖥️ Web-based UI version

🎨 Improved console visuals





















