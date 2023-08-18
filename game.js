const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width= window.innerWidth;
canvas.height= window.innerHeight;
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
let gameOver = false;
ctx.font = '50px Impact';
ctx.fillStyle = "steelblue";

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let gameSpeed = 5;

const backgroundLayer1 = new Image();
backgroundLayer1.src = 'layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'layer-5.png';

class Layer{
    constructor(image, speedModifier){
        this.x=0;
        this.y=0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.image = image;
        this.speedModifier = speedModifier;
               
    }
    update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width){
            this.x=0;
        }
        this.x = Math.floor(this.x-this.speed)
    }

    draw() {

        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);

    }

}

const layer1 = new Layer(backgroundLayer1, 0.2);
const layer2 = new Layer(backgroundLayer2, 0.4);
const layer3 = new Layer(backgroundLayer3, 0.6);
const layer4 = new Layer(backgroundLayer4, 0.8);
const layer5 = new Layer(backgroundLayer5, 1);

const gameObjects = [layer1, layer2, layer3, layer4, layer5];

let ravens = [];

class Raven {

    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 
            Math.floor(Math.random() * 255)];
        this.color = 'rgb(' +this.randomColors[0]+ ',' +this.randomColors[1]+ ',' 
        +this.randomColors[2]+')';

    }
update(deltatime){

    if (this.y < 0 || this.y > canvas.height - this.height){
        this.directionY = this.directionY * -1;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.marketForDeletion = true;
    this.timeSinceFlap += deltatime;
    if (this.timeSinceFlap > this.flapInterval){
        if (this.frame > this.maxFrame) this.frame = 0;
        else this.frame++;
        this.timeSinceFlap = 0;
    }
    if (this.x < 0 -this.width) gameOver = true;
}
draw(){

    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);

}
}

let explosions = []

class Explosion {
    constructor(x, y, size){
        this.image = new Image();
        this.image.src = 'boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }
    update(deltatime){

        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.markedForDeletion = true;
        }

    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.size, this.size);
    }
}

function drawScore() {

    ctx.fillText('Score:' + score, 50, 75);

}

function drawGameOver() {

    ctx.textAlign = 'center';

    ctx.fillText('Game Over, your score is ' + score +'. Press Enter to go back.', canvas.width/2, canvas.height/2);
    document.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          // Redirect to the home page
          window.location.href = "./gamep.html"; 
        }
    });
}

window.addEventListener( 'click', function(e) {

    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    const pc = detectPixelColor.data;
    ravens.forEach(object => {

        if(object.randomColors[0] === pc[0] &&
            object.randomColors[1] === pc[1] &&
            object.randomColors[2] === pc[2]
            ) {
                object.markedForDeletion = true;
                score++;
                explosions.push(new Explosion(object.x, object.y, object.width));
            }

    });
});

function animate(timestamp) {

    ctx.clearRect(0,0, canvas.width, canvas.height);
    collisionCtx.clearRect(0,0, canvas.width, canvas.height);

    gameObjects.forEach( Object => {
        Object.update();
        Object.draw();
    });

    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime
    if (timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven  = 0;
        ravens.sort(function (a,b) {
            return a.width - b.width;
        });
    }; 
    drawScore();
    [...ravens, ...explosions].forEach(object => object.update(deltatime));
    [...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    if (!gameOver) requestAnimationFrame(animate);
    else drawGameOver();

}
 animate(0);
