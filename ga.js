function nextGen() {
  for (let i = 0; i < TOTAL; i++) {
  birds[i] = new Bird();
  }
  pipes.length =0;
  frameCount =0;
  pipes.push(new Pipe());
}
