const canvasNext = document.getElementById('nextPiece');
const contextNext = canvasNext.getContext('2d');
//pour zommer et voir quelque chose
contextNext.scale(30, 30);


function drawNext() {
    contextNext.fillStyle = BACKGROUND_COLOR;
    contextNext.fillRect(0, 0, canvasNext.width, canvasNext.height);
    drawNextPiece(player.nextPiece);
}

function drawNextPiece(thePiece) {
    thePiece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                contextNext.fillStyle = colors[value];
                contextNext.fillRect(x+1, y+1, 1, 1,);
            }
        });
    });
}