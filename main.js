const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const rows = 6;
const cols = 6;
const cardSize = 100;
var chosenCards = false;
var card1;
var card2;
var busy = false;

const cards = [];
const imgs = new Array(18).fill(0);

// Variables for scoring system
let start_score = 1000;
let score = start_score;

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        cards.push({
            x: col * cardSize,
            y: row * cardSize,
            visible: true,
            image: null,
            imgid: null,
        });
    }
}

drawImages();

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const card of cards) {
        if (card.visible) {
            drawCard(card.x, card.y);
        } else {
            if (card.image && card.image.complete) {
                ctx.drawImage(
                    card.image,
                    card.x,
                    card.y,
                    cardSize - 2,
                    cardSize - 2
                );
            }
        }
    }

    let scoreDiv = document.getElementById("score");
    scoreDiv.innerHTML = score;

    if (score <= 0) {
        const image = new Image();
        image.src = `images/sadcat.jpg`; 
        ctx.drawImage(
            image,
            0,
            100,
            650,
            340
        );
    }

}

function drawCard(x, y) {
    ctx.fillStyle = "#cccccc";
    ctx.fillRect(x, y, cardSize - 2, cardSize - 2);
    ctx.strokeStyle = "#999";
    ctx.strokeRect(x, y, cardSize - 2, cardSize - 2);
}

function pickrand() {
    do {
        var i = Math.floor(Math.random() * 18);
    } while (imgs[i] == 2);

    imgs[i]++;
    console.log(i);
    return i;
}

function drawImages() {
    for (let idx = 0; idx < rows * cols; idx++) {
        const rnd = pickrand();
        const imgPath = `images/${rnd + 1}.jpg`;

        const image = new Image();
        image.src = imgPath;

        cards[idx].image = image;
        cards[idx].imgid = rnd;
    }
}

function flipCard(card) {
    if (busy || card == card1 || score <= 0) {
        drawBoard();
        return;
    };
    if (chosenCards == false) {
        card1 = card;
        card1.visible = false;
        drawBoard();
        chosenCards = true;
        console.log("revealing first card");
    } else {
        console.log("revealing second card for 1 sec");
        card2 = card;
        card2.visible = false;
        drawBoard();
        busy = true;
        setTimeout(() => {
            if (card1.imgid != card2.imgid) {
                card1.visible = true;
                card2.visible = true;
                updateScore(50);
            }
            console.log("redrawing");
            drawBoard();
            chosenCards = false;
            card1 = null;
            card2 = null;
            busy = false;
        }, 1500);
        
        // Check if all cards are matched after the timeout
        setTimeout(() => {
            checkWinCondition();
        }, 1600);
    }
}

function checkWinCondition() {
    const allMatched = cards.every(card => !card.visible);
    
    if (allMatched) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "bold 48px Arial";
        ctx.fillStyle = "#4CAF50";
        ctx.textAlign = "center";
        ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.font = "24px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
    }
}

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    var card1;
    var card2;
    for (const card of cards) {
        if (
            card.visible &&
            clickX >= card.x &&
            clickX < card.x + cardSize &&
            clickY >= card.y &&
            clickY < card.y + cardSize
        ) {
            flipCard(card);

            break;
        }
    }
});

function updateScore(penalty) {
    score = score - penalty;
}

drawBoard();
