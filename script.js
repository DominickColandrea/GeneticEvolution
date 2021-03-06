'use strict';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const TOTAL = 500;
let generation =1;
let frameCount= 0;
let lastTime =0;
let birds=[];
let deadBirds =[];
let birdHighestFitness =0;
let currentHighestFitness =0;
let cycles =document.getElementById('slider');
document.getElementById('gen').innerText  = "Generation: "+generation;
for (let i = 0; i < TOTAL; i++) {
  birds[i] = new Bird();
}
let pipes =[];
pipes.push(new Pipe());

function mutate(x) {
  if (Math.random() < 0.01) {
    let offset =x * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

function Bird(brain) {
  this.x = 20;
  this.y = canvas.height/2;
  this.gravity =0.1;
  this.velocity = 0.4;
  this.lift =30;

  this.score = 0;
  this.fitness = 0;

if (brain) {
  this.brain = brain.copy();
}
else {
this.brain = new NeuralNetwork(4,4,1); //4 inputs 1 output
}

this.mutate = function(){
  this.brain.mutate(mutate);
}

  this.up = function() {
    this.velocity -= this.gravity*this.lift;
  }

  this.show = function() {
    ctx.fillStyle ="#f9ff59";
    ctx.fillRect(this.x,this.y, this.x, 10);
  }

this.think = function(pipes) {
let closest = pipes[0];

if (0 > pipes[0].x){//try not to hard code this
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
    this.score++;
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
  this.minWidth=70;
  this.top = Math.random() * (canvas.height/2 - this.minWidth) + 40;
  this.bottom = Math.random() * (canvas.height/2 - this.minWidth) + 40;
  this.w =20;
  this.x = canvas.width;
  this.speed =1;
  this.highlight = false;

this.collide = function(bird) {

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

  for (let n=0; n<cycles.value; n++){
    frameCount++;
    for (let i = pipes.length-1; i >= 0; i--) {
        pipes[i].update();

        for (let j = birds.length-1; j>=0; j--) {
          if (pipes[i].collide(birds[j])) {
            deadBirds.push(birds.splice(j,1)[0]);
          }
        }

        if (pipes[i].offscreen()) {
          pipes.splice(i,1);
        }
      }

  for (let bird of birds){
  bird.think(pipes);
  bird.update();
document.getElementById('birdsLeft').innerText  = "Birds Left: "+birds.length;
  if (bird.score > birdHighestFitness) {
    document.getElementById('fitness').innerText  = "Max Fitness: "+bird.score;
    birdHighestFitness = bird.score;
  }
  document.getElementById('current').innerText  = "Current Fitness: "+bird.score;
}

if (birds.length ===0) {
  nextGen();
}

if (frameCount > 130) {
  frameCount =0;
pipes.push(new Pipe());
}


}//end for cycles

  //all the drawing

  ctx.fillStyle ="#000";
  ctx.fillRect(0,0, canvas.width, canvas.height);
for (let bird of birds){
bird.show();
}
for (let pipe of pipes){
  pipe.show();
}
}//end draw

function update(time=0) {
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
