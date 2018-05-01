'use strict';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const TOTAL = 250;

let frameCount= 0;
let lastTime =0;
let birds=[];

for (let i = 0; i < TOTAL; i++) {
  birds[i] = new Bird();
}
let pipes =[];
pipes.push(new Pipe());
function Bird() {
  this.x = 20;
  this.y = canvas.height/2;
  this.gravity =0.1;
  this.velocity = 0.4;
  this.lift =30;

  this.brain = new NeuralNetwork(4,4,1); //4 inputs 1 output

  this.up = function() {
    this.velocity -= this.gravity*this.lift;
  }

  this.show = function() {
    ctx.fillStyle ="#f9ff59";
    ctx.fillRect(this.x,this.y, this.x, 10);
  }

this.think = function(pipes) {
let closest = pipes[0];

if (20 > pipes[0].x){//try not to hard code this
closest = pipes[1];
}



    let inputs = [];
    inputs[0] = this.y / canvas.height;
    inputs[1] = closest.top / canvas.height;
    inputs[2] = closest.bottom / canvas.height;
    inputs[3] = closest.x / canvas.width;

    let output = this.brain.predict(inputs);

    if (output[0] > 0.5) {
      this.up();
    }
}

  this.update = function() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y > canvas.height) {
      this.y = canvas.height-5;
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
  this.highlight = false;

this.collide = function(bird) {///////problem child

  if (bird.y < this.top || bird.y+5 > canvas.height - this.bottom) {
    if (bird.x+20 > this.x && bird.x < this.x + this.w) {
      this.highlight =true;
      return true;
    }
  }

}

this.offscreen = function() {
  if (this.x<-40) {
    return true;
  }
}

  this.show = function() {
    ctx.fillStyle ="#fff";
    if (this.highlight) {
      ctx.fillStyle ="#ff1111";
    }
    ctx.fillRect(this.x,0, this.w, this.top);
    ctx.fillRect(this.x, canvas.height -this.bottom, this.w, this.bottom);
  }

  this.update = function() {
    this.x -= this.speed;
  }
}// end Pipe

function draw() {
  ctx.fillStyle ="#000";
  ctx.fillRect(0,0, canvas.width, canvas.height);
  for (let bird of birds){
  bird.think(pipes);
  bird.update();
  bird.show();
}

if (birds.length ===0) {
  nextGen();
}

if (frameCount > 130) {
  frameCount =0;
pipes.push(new Pipe());
}


for (let i = pipes.length-1; i >= 0; i--) {
  pipes[i].show();
    pipes[i].update();

    for (let j = birds.length-1; j>=0; j--) {
      if (pipes[i].collide(birds[j])) {
        birds.splice(j,1);
      }
    }

if (pipes[i].offscreen()) {
    pipes.splice(i,1);
}


}
}//end draw

function update(time=0) {
  frameCount++;
  const deltaTime = time - lastTime;
  lastTime =time;
draw();
requestAnimationFrame(update);
}//end update

// document.addEventListener('keydown',event =>{
// if(event.keyCode ==32){
//  bird.up();
// }
// });//end addEventListener


update();
