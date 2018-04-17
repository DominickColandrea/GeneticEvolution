'use strict';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let frameCount= 0;
let lastTime =0;
let bird = new Bird();
let pipes =[];
pipes.push(new Pipe());

function Bird() {
  this.x = 20;
  this.y = canvas.height/2;
  this.x = 20;
  this.gravity =0.2;
  this.velocity = 0.4;
  this.lift =30;

  this.up = function() {
    this.velocity -= this.gravity*this.lift;
  }

  this.show = function() {
    ctx.fillStyle ="#f9ff59";
    ctx.fillRect(this.x,this.y, this.x, 20);
  }

  this.update = function() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y > canvas.height) {
      this.y = canvas.height-10;
      this.velocity =0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity =0;
    }

  }
}// end Bird

function Pipe() {
  this.top = Math.random() * (canvas.height/2 - 1) + 1;
  this.bottom = Math.random() * (canvas.height/2 - 1) + 1;
  this.w =20;
  this.x = canvas.width;
  this.speed =1;


  this.show = function() {
    ctx.fillStyle ="#fff";
    ctx.fillRect(this.x,0, this.w, this.top);
    ctx.fillRect(this.x, canvas.height -this.bottom, this.w, this.bottom);
  }

  this.update = function() {
    this.x -= this.speed;
  }
}// end Bird

function draw() {
  ctx.fillStyle ="#000";
  ctx.fillRect(0,0, canvas.width, canvas.height);
  bird.update();
  bird.show();

if (frameCount > 100) {
  frameCount =0;
pipes.push(new Pipe());
}


for (let i = 0; i < pipes.length; i++) {
  pipes[i].show();
    pipes[i].update();
}
}//end draw

function update(time=0) {
  frameCount++;
  const deltaTime = time - lastTime;
  lastTime =time;
draw();
requestAnimationFrame(update);
}//end update

document.addEventListener('keydown',event =>{
if(event.keyCode ==32){
 bird.up();
}
});//end addEventListener


update();
