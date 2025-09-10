// Importe la librairie @colors/colors/safe
// → permet de colorer le texte affiché dans la console (ex: rouge, jaune, etc.)
var colors = require("@colors/colors/safe");

// Fonction utilitaire pour changer la couleur d'une chaîne de caractères
const changeColor = (string, color) => {
  switch (color) {
    case "red": // Si la couleur demandée est rouge
      return colors.red.bold(string); // Retourne le texte en rouge + gras
    case "yellow": // Si la couleur demandée est jaune
      return colors.yellow.bold(string); // Retourne le texte en jaune + gras
    default: // Si la couleur n’est pas reconnue
      return string; // Retourne le texte normal (pas de couleur)
  }
};

// Exporte la fonction pour qu’elle puisse être utilisée dans d’autres fichiers
module.exports = {
  changeColor,
};
