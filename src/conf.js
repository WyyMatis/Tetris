const NB_BESTSCORE_DISPLAYED = 8;

// Les différentes pieces du jeu
const T_PIECE = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
];

const O_PIECE = [
    [2,2],
    [2,2],
];

const L_PIECE = [
    [0,3,0],
    [0,3,0],
    [0,3,3],
];

const J_PIECE = [
    [0,4,0],
    [0,4,0],
    [4,4,0],
];

const I_PIECE = [
    [0,5,0,0],
    [0,5,0,0],
    [0,5,0,0],
    [0,5,0,0],
];

const S_PIECE = [
    [0,6,6],
    [6,6,0],
    [0,0,0],
];

const Z_PIECE = [
    [7,7,0],
    [0,7,7],
    [0,0,0],
];

const colors = [
    //Pour la valeur 0 : rien
    null,
    //Pour la valeur 1 : violet
    '#6600A1',
    //Pour la valeur 2 : jaune
    '#FFD700',
    //Pour la valeur 3 : orange
    '#FF8300',
    //Pour la valeur 4 : bleu
    '#4169E1',
    //Pour la valeur 5 : cyan
    '#00ECFA',
    //Pour la valeur 6 : vert
    '#3A9D23',
    //Pour la valeur 7 : rouge
    '#E32636'
];

const KEY = {
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    P: 80,
    Q: 81,
    A: 65
};

const BACKGROUND_COLOR = '#CDCEAE';

const START_SPEED = 1000;

const PLAYGROUND_WIDTH = 10;
const PLAYGROUND_HEIGHT = 20;