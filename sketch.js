let car;
let pedestrian;
let collisions = [];
let neuralNet;
let prediction = "unknown";

function preload() {
  // Load the trained model
  neuralNet = ml5.neuralNetwork({ task: 'classification' });
  neuralNet.load('model/model.json', modelLoaded);
}

function modelLoaded() {
  console.log('ML model loaded');
  neuralNet.ready = true;
}

function setup() {
  createCanvas(600, 600);
  car = new Car(0, height / 2, 4);
  pedestrian = new Pedestrian(width / 2, 0);
}

function draw() {
  background(220);
  drawRoad();

  car.move();
  car.display();

  pedestrian.move();
  pedestrian.display();

  checkCollision();
  predictCollision();

  fill(0);
  textSize(14);
  text("Collisions: " + collisions.length, 10, 20);
  text("Prediction: " + prediction, 10, 40);
}

function drawRoad() {
  fill(180);
  rect(0, height / 2 - 15, width, 30);        // horizontal road
  rect(width / 2 - 15, 0, 30, height);        // vertical road
}

function checkCollision() {
  let d = dist(car.x + 20, car.y, pedestrian.x, pedestrian.y);
  if (d < 30) {
    collisions.push({ x: pedestrian.x, y: pedestrian.y });

    fill(255, 0, 0, 150);
    ellipse(pedestrian.x, pedestrian.y, 50, 50);
    textSize(20);
    text("💥", pedestrian.x - 10, pedestrian.y - 20);
    console.log('Collide');

    car.x = 0;
    pedestrian.y = 0;
  }
}

function predictCollision() {
  let distance = dist(car.x + 20, car.y, pedestrian.x, pedestrian.y);
  let relativeSpeed = car.speed + pedestrian.speed;

  console.log('predict');

  if (neuralNet.ready) {
    console.log('ready');

    neuralNet.classify([distance, relativeSpeed], (err, results) => {
      console.log('classify');

      if (results && results[0]) {
        console.log('results', results);

        prediction = results[0].label;
      }
    });
  }
}

class Car {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
  }

  move() {
    this.x += this.speed;
    if (this.x > width) this.x = 0;
  }

  display() {
    fill(0, 100, 255);
    rect(this.x, this.y - 10, 40, 20);
  }
}

class Pedestrian {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 2.5;
  }

  move() {
    this.y += this.speed;
    if (this.y > height) this.y = 0;
  }

  display() {
    fill(0);
    ellipse(this.x, this.y, 20, 20);
  }
}