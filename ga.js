function nextGen() {

  calculateFitness();

  for (let i = 0; i < TOTAL; i++) {
  birds[i] = highestFitness();
  }
  pipes =[];
  deadBirds =[];
  frameCount =0;
  pipes.push(new Pipe());
}

function highestFitness() {

let index =0;
let r = Math.random();

while (r>0) {
    r = r-deadBirds[index].fitness;
    index++;
}
index--;

let bird = deadBirds[index];
let child = new Bird(bird.brain);
child.mutate();
return child;
}

function calculateFitness() {
  let sum =0;

  for(let bird of deadBirds){
    sum+=bird.score;
  }

  for(let bird of deadBirds){
    bird.fitness = bird.score / sum;
  }
}
