//Initialisation du canvas
const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

// Pour zoomer et voir quelque chose
context.scale(20, 20);

let duration = START_SPEED;

//Définition de la couleur de fond
context.fillStyle = "#000";

//Saisie du pseudo du joueur
function setName() {
  let N = "";
  while (N == "" || N == null) {
    N = prompt("Quel est votre pseudo", "");
  }

  document.getElementById("myName").innerHTML = N;
  player.name = N;
}

//Accélération de la chute des pièces toutes les 5 lignes
function levelUp() {
  if (player.lines % 5 === 0) {
    player.level += 1;
    document.getElementById("levels").innerText = player.level;
    if (duration <= 500) {
      duration -= 50;
    } else {
      duration -= 100;
    }
  }
}

/* Fonction qui permet de vérifier si une ligne est complète
   et si oui, la supprimer et ajouter le score*/
function checkLines() {
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }

    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;
    player.score += 10;
    document.getElementById("myScore").innerText = player.score;
    player.lines += 1;
    document.getElementById("lines").innerText = player.lines;
    levelUp();
  }
}

//Dessine la pièce
function draw() {
  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawPiece(player.piece, player.pos);
  drawPiece(arena, { x: 0, y: 0 });
}

/* Dessine la matrice ( [[],...,[]] )qui défini la pièce 
   à une position donnée dans offset .x et .y */
function drawPiece(thePiece, offset) {
  thePiece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

// Fonction de détection de collision
// Paramètre : la matrice et le joueur pour savoir où est la pièce
// Si la pièce est en collision avec un autre bloc, la fonction retourne true, sinon false
function collide(arena, player) {
  const [m, o] = [player.piece, player.pos];
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        // retoune true si il y a collision et que la piece ne sort pas du tableau
        return true;
      }
    }
  }
  //retoune false si il n'y a pas de collision
  return false;
}

//fonction qui crée la matrice dans laquelle est enregistée la position des pièces et qui est utilisée pour les collisions
// Paramètre de la fonction
// w = width : largeur de la matrice
// h = height : hauteur de la matrice
function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

//Génère les 7 types de pièces possibles
function createPiece(type) {
  if (type === "T") {
    return T_PIECE;
  } else if (type === "O") {
    return O_PIECE;
  } else if (type === "L") {
    return L_PIECE;
  } else if (type === "J") {
    return J_PIECE;
  } else if (type === "I") {
    return I_PIECE;
  } else if (type === "S") {
    return S_PIECE;
  } else if (type === "Z") {
    return Z_PIECE;
  }
}

//fonction qui fait decendre la pièce d'une case
function pieceDown() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    checkLines();
  }
  dropCounter = 0;
}

//fonction qui déplace une pièce
function playerMove(dir) {
  player.pos.x += dir;
  collide(arena, player) ? (player.pos.x -= dir) : null;
}

//Réinitialise le jeu
function resetPlayer() {
  player.level = 0;
  player.lines = 0;
  player.score = 0;
  duration = START_SPEED;
}

//Choisit une pièce aléatoirement
function playerReset() {
  const pieces = "TOLJISZ";
  //Place la pièce suivante dans la pièce actuelle
  player.piece = player.nextPiece;

  //Choisit une pièce aléatoirement pour la prochaine pièce
  player.nextPiece = createPiece(pieces[(pieces.length * Math.random()) | 0]);
  drawNext();

  //Place la pièce sur la grille de jeu
  player.pos.y = 0;
  //Centre la pièce au milieu de la zone
  player.pos.x =
    ((arena[0].length / 2) | 0) - ((player.piece[0].length / 2) | 0);
  //Réinitialise la zone de jeu lorsqu'une brique dépasse du haut de la zone
  if (collide(arena, player)) {
    arena.forEach((row) => row.fill(0));
    saveScore(player.name, player.score); // Appel de la fonction qui enregistre le score
    getScores(); // Appel de la fonction qui affiche les scores
    resetPlayer(); // Réinitialise les variables liées au joueur

  }
  
}

//Fonction qui permet au joueur de faire tourner la pièce
//Paramètre : la direction
function playerRotate(dir) {
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.piece, dir);

  //Joue le son de rotation
  movesSound.play();

  //Permet d'éviter un problème d'encastrement de la pièce sur les côtés lors de la rotation
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    //Ecarte la pièce lorsqu'elle tourne le long d'un côté
    if (offset > player.piece[0].length) {
      rotate(player.piece, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

//Fonction permettant de tourner une pièce : 
//Transposition des lignes de la matrice en colonnes, puis inversion de chaque ligne de la nouvelle matrice obtenue
function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }

  if (dir > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}

function update() {
  interval = setTimeout(() => {
    pieceDown();
    draw();
    update();
  }, duration);
}

function merge(arena, player) {
  player.piece.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

const player = {
  name: "",
  score: 0,
  pos: { x: 4, y: 0 },
  piece: createPiece("T"),
  nextPiece: createPiece("L"),
  lines: 0,
  level: 0,
};

//Met en pause/en marche le jeu
function playPause(event) {
  let textPause = document.getElementById("playPauseText").innerText;

  if (textPause == "⏸") {
    clearTimeout(interval);
    document.removeEventListener("keydown", addMoveEvent);
    document.getElementById("playPauseText").innerText = "⏵";
  } else if (textPause == "⏵") {
    update();
    document.addEventListener("keydown", addMoveEvent);
    document.getElementById("playPauseText").innerText = "⏸";
  }
}

function addMoveEvent(event) {
  if (event.keyCode === KEY.LEFT) {
    playerMove(-1);
  } else if (event.keyCode === KEY.RIGHT) {
    playerMove(1);
  } else if (event.keyCode === KEY.DOWN) {
    //arrête la boucle de descente de la pièce auto et la remet a 0 pour fluidifier le jeu
    clearInterval(interval);
    update();
    pieceDown();
    //Permet de faire tourner une pièce en appuyant sur la touche "A" ou "Q"
  } else if (event.keyCode === KEY.A) {
    playerRotate(-1);
  } else if (event.keyCode === KEY.Q || event.keyCode === KEY.UP) {
    playerRotate(1);
  } else if (event.keyCode === KEY.SPACE) {
    // Fait descendre la pièce instantanément en bas de la zone de jeu
    while (!collide(arena, player)) {
      player.pos.y++;
    }
    player.pos.y--;
    merge(arena, player);
    playerReset();
    checkLines();

    dropSound.play();
  }
  draw();
}

// Paramètres:
// url: l'url de l'audio à jouer
function playAudio(url) {
  const button = document.querySelector("#button");
  const icon = document.querySelector("#button > i");

  const audio = document.querySelector("#audio");

  // Source de l'audio à jouer : le paramètre url
  audio.setAttribute("src", url);

  // Type de l'url
  audio.setAttribute("type", "audio/mp3");

  //Ajout d'un eventListener sur le bouton 
  button.addEventListener("click", () => {
    if (audio.paused) {
      audio.volume = 0.2;
      audio.play();
      icon.classList.remove("fa-volume-off");
      icon.classList.add("fa-volume-up");
    } else {
      audio.pause();
      icon.classList.remove("fa-volume-up");
      icon.classList.add("fa-volume-off");
    }
  });
}

const arena = createMatrix(PLAYGROUND_WIDTH, PLAYGROUND_HEIGHT);

update();
$(document).ready(function () {
  getScores();
  setName();
  drawNext();

  // Appel de la fonction playAudio pour jouer le son
  playAudio("assets/sounds/Original_Tetris_theme_Tetris_Soundtrack.mp3");

  //Event qui déplace la pièce avec les flêches du clavier
  document.addEventListener("keydown", addMoveEvent);
  document.getElementById("playPauseDiv").addEventListener("click", playPause);

  window.addEventListener("DOMContentLoaded", event => {
    const audio = document.querySelector("#audio");
    audio.volume = 0.2;
    audio.play();
  });

});
