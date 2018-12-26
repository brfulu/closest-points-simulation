'use strict';

import ClosestPoints from './closest-points';

const points = [{ x: 2, y: 3 }, { x: 12, y: 30 }, { x: 40, y: 50 }, { x: 5, y: 1 }, { x: 12, y: 10 }, { x: 3, y: 4 }];
const closestPoints = new ClosestPoints();
console.log(points);
console.log(closestPoints.divideAndConquer(points));
console.log(closestPoints.bruteForce(points));
