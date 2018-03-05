var myGamePiece;
var myBackground;
var canvasHeight = 470;
var canvasWidth = 750;
var myNoms = [];
var myYucks = [];
var myScore;
var myScoreTotal = 0;
var chompSound;
var gagSound;
var cursorOffset = 0;
var stage = 1;
var background = "prehistbackground.jpg";
var objectXSpeed;
var levelUpScore;
var interval;

function startGame() {
    myBackground = new component(canvasWidth, canvasHeight, background, 0, 0, "image");
    myGamePiece = new component(30, 30, "trex.png", 10, 120, "image");
    myScore = new component("30px", "Consolas", "black", 510, 40, "text");
    chompSound = new sound("dinochomp.mp3");
    gagSound = new sound("dinogag.mp3");
    objectXSpeed = -2;
    myScoreTotal = 0;
    levelupScore = 100;
    interval = 150;
    myGameArea.start();
}

function updateGame() {
    myBackground = new component(canvasWidth, canvasHeight, background, 0, 0, "image");
    myGamePiece = new component(30, 30, "trex.png", myGamePiece.x, myGamePiece.y, "image");
    myScore = new component("30px", "Consolas", "black", 510, 40, "text");
    // chompSound = new sound("dinochomp.mp3");
    // gagSound = new sound("dinogag.mp3");
    interval += 150;
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 750;
        this.canvas.height = 470;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        updateGameArea();
        this.interval = setInterval(updateGameArea, 10);
        window.addEventListener('mousemove', function(e) {
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
    },
    expand: function() {
        this.canvas.width = 1000;
        this.canvas.height = 700;
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;

        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);

            }
        } else {

            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
    }

    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

// function accelerate(n) {
//     if (!myGameArea.interval) {
//         myGameArea.interval = setInterval(updateGameArea, 20);
//     }
//     myGamePiece.gravity = n;
// }

function nextStage() {
    background = "loopingjungle.jpg";
    stage += 1;
    if (stage == 4) {
        expandCanvas();
    }
    //myScore = 0;
    //myScoreTotal = 0;
    levelupScore += 100;
    objectXSpeed -= 1;
    updateGame();
}

function expandCanvas() {
    canvasHeight = 700;
    canvasWidth = 1000;
    myGameArea.expand();
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;

    for (i = 0; i < myNoms.length; i += 1) {
        if (myGamePiece.crashWith(myNoms[i])) {
            myNoms.splice(i, 1);
            myScoreTotal += 10;
            chompSound.play();
        }
    }
    for (i = 0; i < myYucks.length; i += 1) {
        if (myGamePiece.crashWith(myYucks[i])) {
            myYucks.splice(i, 1);
            myScoreTotal -= 10;
            gagSound.play();
        }
    }
    myGameArea.clear();
    // myBackground.speedX = -1;
    // myBackground.newPos();
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        height = 10;
        minGap = 10;
        maxGap = canvasHeight - 50;
        rng1 = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        rng2 = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myNoms.push(new component(50, 50, "sirloin.png", x, rng1, "image"));
        myYucks.push(new component(50, 50, "veggie.png", x + interval, rng2, "image"));
    }
    for (i = 0; i < myNoms.length; i += 1) {
        myNoms[i].x += objectXSpeed;
        myNoms[i].update();
    }
    for (i = 0; i < myYucks.length; i += 1) {
        myYucks[i].x += objectXSpeed;
        myYucks[i].update();
    }

    var xDistance = myGameArea.x - myGamePiece.x + cursorOffset;
    var yDistance = myGameArea.y - myGamePiece.y + cursorOffset;
    var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
    if (distance > 0) {
        myGamePiece.x += -2.5 + xDistance * .1;
        myGamePiece.y += -2.5 + yDistance * .1;
    }
    myScore.text = "SCORE: " + myScoreTotal;

    myScore.update();
    if (myScoreTotal >= levelupScore) {
        nextStage();
    }
    myGamePiece.width = 30 + myScoreTotal;
    myGamePiece.height = 30 + myScoreTotal;
    cursorOffset = -myScoreTotal / 2;
    //myGamePiece.newPos();
    myGamePiece.update();
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function() {
        this.sound.currentTime = 0;
        this.sound.play();
    }
    this.stop = function() {
        this.sound.pause();
    }
}