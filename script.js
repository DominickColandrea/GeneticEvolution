'use strict';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let lastTime =0;
let bird = new Bird();

function Bird() {
  this.x = 20;
  this.y = canvas.height/2;
  this.x = 20;
  this.gravity =0.2;
  this.velocity = 1;

  this.show = function() {
    ctx.fillStyle ="#fff";
    ctx.fillRect(this.x,this.y, this.x, 20);
  }

  this.update = function() {
    this.velocity += this.gravity;
    this.y += this.velocity;
  }
}// end Bird

function draw() {
  ctx.fillStyle ="#000";
  ctx.fillRect(0,0, canvas.width, canvas.height);
  bird.show();
  bird.update();
}//end draw

function update(time=0) {
  const deltaTime = time - lastTime;
  lastTime =time;
draw();
requestAnimationFrame(update);
}//end update

update();
