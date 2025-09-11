#🎮 Puissance 4 – Jeu solo en console avec IA (Node.js)

---

## 🧠 Présentation du projet

Ce projet est une version solo de Puissance 4, jouée dans le terminal contre un adversaire IA.  
L’IA utilise l’algorithme Minimax avec élagage alpha–bêta pour analyser le plateau et prendre des décisions stratégiques.

Fonctionnalités principales :

🟨 Adversaire IA (pas de mode multijoueur)

🎨 Symboles colorés pour une meilleure lisibilité dans la console

✅ Détection automatique des victoires, défaites et matchs nuls

⚡ IA efficace avec une profondeur de recherche limitée pour un gameplay fluide

---

## 📂 Structure du projet

```
.
├── node_modules/       # Installed dependencies
├── utils/
│   └── colors.js       # Utility to colorize console output
├── index.js            # Main game logic (entry point)
├── package.json        # Project metadata and dependencies
└── package-lock.json   # Auto-generated lockfile

```
## 📦 Prérequis

- Node.js v18+ → [Télécharger](https://nodejs.org/)  
- npm (inclus avec Node.js)  

Dépendances :

- `prompts` – pour les invites interactives en CLI

---

# 🚀 Installation & Utilisation

### 1️⃣ Cloner le dépôt :

```
git clone https://github.com/your-username/connect-four-ai.git
cd connect-four-ai
```

### 2️⃣ Installer les dépendances :
```
npm install
```

### 3️⃣ Lancer le Jeu:
```
node index.js
```

# ⚙️ Configuration

En haut du fichier 'index.js', vous pouvez modifier certains paramètres :
```javascript
// Déterminer qui joue en premier
const AI_PLAY_FIRST = true; // true = l'IA commence, false = le joueur commence

// Personnaliser les symboles et les couleurs
const AI_SYMBOLE = changeColor("O", "yellow");
const PLAYER_SYMBOLE = changeColor("X", "red");

```

## 🎲 Gameplay

Le plateau commence vide :

```
_ _ _ _ _ _ _
_ _ _ _ _ _ _
_ _ _ _ _ _ _
_ _ _ _ _ _ _
_ _ _ _ _ _ _
_ _ _ _ _ _ _
1 2 3 4 5 6 7

```
Tour du joueur → choisissez une colonne (1–7)

Tour de l’IA → répond immédiatement avec son coup

Le jeu se termine lorsque l’une des conditions suivantes est remplie :


```
🏆 Un joueur aligne 4 jetons d’affilée (horizontal, vertical ou diagonal)

🤝 Le plateau est rempli (match nul)

---

## 🧠 Algorithme de l’IA

L’IA évalue les coups en utilisant Minimax avec élagage alpha–bêta (profondeur = 3).

```
## Fonction d’évaluation :
```text
+3 → L’IA contrôle la colonne centrale

+100 → L’IA a 4 jetons d’affilée (état gagnant)

+5 → L’IA a 3 jetons d’affilée avec une case vide

+2 → L’IA a 2 jetons d’affilée avec deux cases vides

-4 → Le joueur a 3 jetons d’affilée (menace)

```
Cela permet à l’IA de jouer à la fois de manière offensive et défensive, en équilibrant les stratégies d’attaque et de blocage.

---

## 📜 Exemple de boucle principale

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
# 🚀 Améliorations futures

### 🔧 Niveaux de difficulté (profondeur de l’IA ajustable)

### 🏅 Système de score (suivi des victoires/défaites)

### 🖥️ Version avec interface web

### 🎨 Amélioration des visuels en console






















