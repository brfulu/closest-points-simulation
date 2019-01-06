'use strict';

import ClosestPoints from './closest-points';

const points = [{ x: 2, y: 3 }, { x: 12, y: 30 }, { x: 40, y: 50 }, { x: 5, y: 1 }, { x: 12, y: 10 }, { x: 3, y: 4 }];
const closestPoints = new ClosestPoints();
console.log(points);
console.log(closestPoints.divideAndConquer(points));
console.log(closestPoints.bruteForce(points));

// Drawing

const canvas = document.getElementById('canvas');
const pointSize = 7;

const clearButton = document.getElementById('clear');
const nextButton = document.getElementById('next');
const backButton = document.getElementById('back');

function drawPoint(event) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;

  const ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);

  ctx.fillStyle = "#0000ff";
  ctx.fill();

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function clearCanvas() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('click', drawPoint);
clearButton.addEventListener('click', clearCanvas);
