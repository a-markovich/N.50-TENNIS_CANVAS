"use strict"

let getState = 0;
let fontSizeText = 16;
let btnWidth = 70;
let btnHeight = 20;
let leftScore = 0;
let rightScore = 0;
let fieldStroke = 1;

let field = {
    width : 500,
    height : 300,
}

let leftRacquet = {
    posY : field.height/2-90/2+fieldStroke,
    speedY : 0,
    width : 10,
    height: 90,
    update : function() {
        createTennis();
    }
}

let rightRacquet = {
    posY : field.height/2-90/2+fieldStroke,
    speedY : 0,
    width : 10,
    height: 90,
    update : function() {
        createTennis();
    }
}

let ball={
    posX : field.width/2+fieldStroke,
    posY : field.height/2+fieldStroke,
    speedX : 0,
    speedY : 0,
    radius : 15,
    update : function() {
        createTennis();
    }
}

function createTennis() {
    //построение счета
    let cvs=document.getElementById("cvs");
    cvs.setAttribute("width", field.width+fieldStroke*2);
    cvs.setAttribute("height", fontSizeText*2);
    let context=cvs.getContext("2d");

    context.fillStyle='black';
    context.font=`${fontSizeText*2}px sans-serif`;
    let textScore = context.measureText(`${leftScore}:${rightScore}`);
    context.fillText(`${leftScore}:${rightScore}`, (field.width-textScore.width)/2, fontSizeText*2);

    //построение поля
    let cvsField=document.getElementById("cvsField");
    cvsField.setAttribute("width", field.width+fieldStroke*2);
    cvsField.setAttribute("height", field.height+fieldStroke*2);
    let contextField=cvsField.getContext("2d");

    contextField.fillStyle="#F0EE7E";
    contextField.strikeStyle="black";
    contextField.strokeRect(0, 0, field.width+fieldStroke*2, field.height+fieldStroke*2);
    contextField.fillRect(fieldStroke, fieldStroke, field.width, field.height);

    //построение левой ракетки 
    contextField.fillStyle="#09AA57";
    contextField.fillRect(fieldStroke, leftRacquet.posY, leftRacquet.width, leftRacquet.height);

    //построение правой ракетки 
    contextField.fillStyle="#191497";
    contextField.fillRect(fieldStroke+field.width-leftRacquet.width, rightRacquet.posY, rightRacquet.width, rightRacquet.height);

    //построение мяча
    contextField.fillStyle="#F02137";
    contextField.beginPath();
    contextField.arc(ball.posX, ball.posY, ball.radius, 0, Math.PI*2);
    contextField.fill();
}
createTennis();

function tennis() {
    leftRacquet.posY+=leftRacquet.speedY;
    rightRacquet.posY+=rightRacquet.speedY;
    ball.posX+=ball.speedX;
    ball.posY+=ball.speedY;

    if ( leftRacquet.posY+leftRacquet.height > field.height+fieldStroke ) {
        leftRacquet.speedY = 0;
        leftRacquet.posY = field.height+fieldStroke-leftRacquet.height;
    } else if ( leftRacquet.posY < fieldStroke ) {  
        leftRacquet.speedY = 0;
        leftRacquet.posY = fieldStroke;
    } else if ( rightRacquet.posY+rightRacquet.height > field.height+fieldStroke ) {
        rightRacquet.speedY = 0;
        rightRacquet.posY = field.height+fieldStroke-rightRacquet.height;
    } else if ( rightRacquet.posY < fieldStroke ) {
        rightRacquet.speedY = 0;
        rightRacquet.posY = fieldStroke;
    }

    if ( ball.posX+ball.radius > fieldStroke+field.width-rightRacquet.width && 
         ( ball.posY > rightRacquet.posY &&
           ball.posY < (rightRacquet.posY+rightRacquet.height) ) 
        ) {
            ball.speedX=-ball.speedX;
            ball.posX=fieldStroke+field.width-rightRacquet.width-ball.radius;
    } else if ( ball.posX-ball.radius < fieldStroke+leftRacquet.width && 
         ( ball.posY > leftRacquet.posY && 
           ball.posY < (leftRacquet.posY+leftRacquet.height) ) 
        ) {
            ball.speedX=-ball.speedX;
            ball.posX=fieldStroke+leftRacquet.width+ball.radius;
    } else if ( ball.posX+ball.radius > fieldStroke+field.width ) {
            ball.posX=fieldStroke+field.width-ball.radius;
            ball.speedX = 0;
            ball.speedY = 0;
            leftRacquet.speedY = 0; 
            rightRacquet.speedY = 0;
            leftScore++;
            btn.addEventListener("click", start);
            getState = 0;
    } else if ( ball.posX-ball.radius<fieldStroke ) {
            ball.posX = ball.radius+fieldStroke;
            ball.speedX = 0;
            ball.speedY = 0; 
            leftRacquet.speedY = 0; 
            rightRacquet.speedY = 0;
            rightScore++;
            btn.addEventListener("click", start);
            getState = 0;
    } else if ( ball.posY+ball.radius > fieldStroke+field.height ) {
        ball.speedY=-ball.speedY;
        ball.posY=fieldStroke+field.height-ball.radius;
    } else if ( ball.posY-ball.radius < fieldStroke ) {
        ball.speedY=-ball.speedY;
        ball.posY=fieldStroke+ball.radius;
    }

    leftRacquet.update();
    rightRacquet.update();
    ball.update();
}

function keydownFunc(eo) {
    if (eo.key === "Shift" && getState === 1) {
        leftRacquet.speedY = -1;
    } else if (eo.key === "Control" && getState === 1) {
        leftRacquet.speedY = 1;
    } else if (eo.key === "ArrowUp" && getState === 1) {
        rightRacquet.speedY = -1;
    } else if (eo.key === "ArrowDown" && getState === 1) {
        rightRacquet.speedY = 1;
    } 
}

function keyupFunc(eo) {
    if (eo.key === "Shift") {
        leftRacquet.speedY = 0;
    } else if (eo.key === "Control") {
        leftRacquet.speedY = 0;
    } else if (eo.key === "ArrowUp") {
        rightRacquet.speedY = 0;
    } else if (eo.key === "ArrowDown") {
        rightRacquet.speedY = 0;
    }
}

function start() {
    getState = 1;
    btn.removeEventListener("click", start);
    ball.posX = field.width/2;
    ball.posY = field.height/2;

    do {
        ball.speedX = Math.floor((Math.random() - 0.5) * 10);
    } while ( ball.speedX === 0 );
    do {
        ball.speedY = Math.floor((Math.random() - 0.5) * 10);
    } while ( ball.speedY === 0 );
}

window.addEventListener("keydown", keydownFunc);
window.addEventListener("keyup", keyupFunc);

let btn=document.getElementById("button");
btn.addEventListener("click", start);

setInterval(tennis,60);


    