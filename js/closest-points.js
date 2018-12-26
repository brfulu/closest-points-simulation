export default class ClosestPoints {

  constructor() { }

  bruteForce(points) {
    let minDistance = Number.MAX_VALUE;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        let distance = this._getDistance(points[i], points[j]);
        if (distance < minDistance) {
          minDistance = distance;
        }
      }
    }
    return minDistance;
  }

  divideAndConquer(points) {
    this.points = points;
    this.pointsOrderedByX = points.sort((a, b) => a.x - b.x);
    this.pointsOrderedByY = points.sort((a, b) => a.y - b.y);
    return this._closestPair(this.pointsOrderedByX);
  }

  _closestPair(points) {
    if (points.length <= 3) {
      return this.bruteForce(points);
    }

    let middleIndex = Math.floor(points.length / 2);
    let middlePoint = points[middleIndex];

    let leftPoints = points.slice(0, middleIndex);
    let rightPoints = points.slice(middleIndex);

    let minDistanceLeft = this._closestPair(leftPoints);
    let minDistanceRight = this._closestPair(rightPoints);
    let minDinstanceCombined = Math.min(minDistanceLeft, minDistanceRight);

    let strip = this.pointsOrderedByY.filter(point => this._getDistance(point, middlePoint));
    let minDistanceStrip = this._getMinimumDistanceStrip(strip);

    return Math.min(minDinstanceCombined, minDistanceStrip);
  }

  _getDistance(first, second) {
    return Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2));
  }

  _getMinimumDistanceStrip(strip) {
    let minDistance = Number.MAX_VALUE;
    for (let i = 0; i < strip.length; i++) {
      for (let j = i + 1; j < strip.length && j - i <= 15; j++) {
        minDistance = Math.min(minDistance, this._getDistance(strip[i], strip[j]));
      }
    }
    return minDistance;
  }
}
