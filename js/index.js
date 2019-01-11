'use strict';

import ClosestPoints from './closest-points';

import ClosestPointsTest from './closest-points-pure';


function test() {
  const closestPoints = new ClosestPointsTest();

  const smallArray = [{ x: 2, y: 3 }, { x: 12, y: 30 }, { x: 40, y: 50 }, { x: 5, y: 1 }, { x: 12, y: 10 }, { x: 3, y: 4 }];
  console.log('Small test:')
  console.log(closestPoints.divideAndConquer(smallArray));
  console.log(closestPoints.bruteForce(smallArray));

  const mediumArray = Array.from({ length: 100 }, () => {
    return {
      x: Math.floor(Math.random() * 500),
      y: Math.floor(Math.random() * 500)
    };
  });
  console.log('Medium test:')
  console.log(closestPoints.divideAndConquer(mediumArray));
  console.log(closestPoints.bruteForce(mediumArray));

  const bigArray = Array.from({ length: 10000 }, () => {
    return {
      x: Math.floor(Math.random() * 50000),
      y: Math.floor(Math.random() * 50000)
    };
  });
  console.log('Big test:')
  console.log(closestPoints.divideAndConquer(bigArray));
  console.log(closestPoints.bruteForce(bigArray));

  const largeArray = Array.from({ length: 100000 }, () => {
    return {
      x: Math.random() * 500000,
      y: Math.random() * 500000
    };
  });
  console.log('Large test:')
  console.log(closestPoints.divideAndConquer(largeArray));
  console.log(closestPoints.bruteForce(largeArray));
}

// test();


// Drawing
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const pointSize = 7;

const clearButton = document.getElementById('clear');
const nextButton = document.getElementById('next');
const backButton = document.getElementById('back');
const startButton = document.getElementById('start');

let points = [];
let eventIndex = -1;
let events = [];
let closestDistance = 0;

function drawOnClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  drawPoint(x, y);
  points.push({ x, y });
}

function drawPoint(x, y) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);

  ctx.fillStyle = "#4E9AF1";
  ctx.fill();

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawLine(a, b) {
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  points.forEach((p) => drawPoint(p.x, p.y));
}

function drawLabel(text, p1, p2, padding) {
  if (p1.x > p2.x) {
    let t = p1;
    p1 = p2;
    p2 = t;
  }

  let alignment = 'center';
  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;
  let p = p1;
  let pad = 1 / 2;

  ctx.save();
  ctx.textAlign = alignment;
  ctx.fillStyle = '#0E0A19';
  ctx.font = 'bold 17px Arial';
  ctx.translate(p.x + dx * pad, p.y + dy * pad);
  ctx.rotate(Math.atan2(dy, dx));
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function highlightPoint(x, y, color) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);

  ctx.fillStyle = "#0000ff";
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function highlightRect(x, y, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
  points.forEach((p) => drawPoint(p.x, p.y));
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points = [];
  eventIndex = 0;
  nextButton.style.display = 'none';
  backButton.style.display = 'none';
}

function next() {
  if (eventIndex < events.length - 1) {
    if (eventIndex >= 0) {
      let event = events[eventIndex];
      if (event.type == 'highlightRect') {
        highlightRect(event.x, event.y, event.width, event.height, '#C7C4C0');
      } else if (event.type == 'highlightPoints') {
        highlightPoint(event.pointA.x, event.pointA.y, '#00000');
        highlightPoint(event.pointB.x, event.pointB.y, '#00000');
      }
    } else {
      backButton.style.backgroundColor = '#4e9af1';
      backButton.disabled = false;
    }

    eventIndex++;
    let event = events[eventIndex];
    if (event.type == 'highlightRect') {
      highlightRect(event.x, event.y, event.width, event.height, '#fef36f');
    } else if (event.type == 'drawLine') {
      drawLine(event.pointA, event.pointB);
      drawLabel(event.label, event.pointA, event.pointB);
    } else if (event.type == 'highlightPoints') {
      highlightPoint(event.pointA.x, event.pointA.y, '#ff0000');
      highlightPoint(event.pointB.x, event.pointB.y, '#ff0000');
    } else if (event.type == 'combine') {
      highlightRect(event.x, event.y, event.width, event.height, '#fef36f');
      drawLine(event.pointA, event.pointB);
      drawLabel(event.label, event.pointA, event.pointB);
    } else if (event.type == 'highlightStrip') {
      highlightRect(event.x, event.y, event.width, event.height, '#4CAF50');
      drawLine(event.pointA, event.pointB);
    } else if (event.type == 'highlightResult') {
      highlightRect(event.x, event.y, event.width, event.height, '#fef36f');
      drawLine(event.pointA, event.pointB);
      drawLabel(event.label, event.pointA, event.pointB);
    } else if (event.type == 'highlightLeftRight') {
      highlightRect(event.x, event.y, event.width, event.height, '#fef36f');
      drawLine(event.pointLeftA, event.pointLeftB);
      drawLabel(event.labelLeft, event.pointLeftA, event.pointLeftB);
      drawLine(event.pointRightA, event.pointRightB);
      drawLabel(event.labelRight, event.pointRightA, event.pointRightB);
    } else if (event.type == 'highlightFinish') {
      highlightRect(0, 0, 1024, 530, '#C7C4C0');
      drawLine(event.pointA, event.pointB);
      drawLabel(event.label, event.pointA, event.pointB);
    }
  }

  if (eventIndex == events.length - 1) {
    nextButton.disabled = true;
    nextButton.style.backgroundColor = 'gray';
    eventIndex++;
  }
}

function back() {
  if (eventIndex > 0) {
    if (eventIndex < events.length) {
      let event = events[eventIndex];
      if (event.type == 'highlightRect') {
        highlightRect(event.x, event.y, event.width, event.height, '#C7C4C0');
      } else if (event.type == 'highlightPoints') {
        highlightPoint(event.pointA.x, event.pointA.y, '#00000');
        highlightPoint(event.pointB.x, event.pointB.y, '#00000');
      }
    } else {
      nextButton.style.backgroundColor = '#4e9af1';
      nextButton.disabled = false;
    }

    eventIndex--;
    let event = events[eventIndex];
    if (event.type == 'highlightRect') {
      highlightRect(event.x, event.y, event.width, event.height, '#fef36f');
    } else if (event.type == 'drawLine') {
      drawLine(event.pointA, event.pointB);
      drawLabel(event.label, event.pointA, event.pointB);
    } else if (event.type == 'highlightPoints') {
      highlightPoint(event.pointA.x, event.pointA.y, '#ff0000');
      highlightPoint(event.pointB.x, event.pointB.y, '#ff0000');
    } else if (event.type == 'combine') {
      highlightRect(event.x, event.y, event.width, event.height, '#fef36f');
      drawLine(event.pointA, event.pointB);
      drawLabel(event.label, event.pointA, event.pointB);
    } else if (event.type == 'highlightStrip') {
      highlightRect(event.x, event.y, event.width, event.height, '#4CAF50');
      drawLine(event.pointA, event.pointB);
    } else if (event.type == 'highlightResult') {
      highlightRect(event.x, event.y, event.width, event.height, '#fef36f');
      drawLine(event.pointA, event.pointB);
      drawLabel(event.label, event.pointA, event.pointB);
    } else if (event.type == 'highlightLeftRight') {
      highlightRect(event.x, event.y, event.width, event.height, '#fef36f');
      drawLine(event.pointLeftA, event.pointLeftB);
      drawLabel(event.labelLeft, event.pointLeftA, event.pointLeftB);
      drawLine(event.pointRightA, event.pointRightB);
      drawLabel(event.labelRight, event.pointRightA, event.pointRightB);
    } else if (event.type == 'highlightFinish') {
      highlightRect(0, 0, 1024, 530, '#C7C4C0');
      drawLine(event.pointA, event.pointB);
      drawLabel(event.label, event.pointA, event.pointB);
    }
  } else {
    backButton.disabled = true;
    backButton.style.backgroundColor = 'gray';
  }
}

function start() {
  eventIndex = -1
  events = [];
  let closestPoints = new ClosestPoints();
  let result = closestPoints.divideAndConquer(points);
  closestDistance = result.distance;
  events = result.events;

  nextButton.style.display = 'inline';
  backButton.style.display = 'inline';
  backButton.disabled = true;
  backButton.style.backgroundColor = 'gray';
  nextButton.style.backgroundColor = '#4e9af1';
  nextButton.disabled = false;
}

canvas.addEventListener('click', drawOnClick);
clearButton.addEventListener('click', clearCanvas);
nextButton.addEventListener('click', next);
backButton.addEventListener('click', back);
startButton.addEventListener('click', start);


