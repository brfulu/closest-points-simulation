export default class ClosestPoints {

  constructor() { }

  bruteForce(points) {
    let minDistance = Number.MAX_VALUE;
    let pointA, pointB;

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        let distance = this._getDistance(points[i], points[j]);
        if (distance < minDistance) {
          minDistance = distance;
          pointA = points[i];
          pointB = points[j];
        }
      }
    }
    return {
      distance: minDistance,
      pointA,
      pointB
    };
  }

  divideAndConquer(points) {
    this.points = points;

    points.sort((a, b) => a.x - b.x);
    this.pointsOrderedByX = points.slice();

    points.sort((a, b) => a.y - b.y);
    this.pointsOrderedByY = points.slice();

    let result = this._closestPair(this.pointsOrderedByX);
    return {
      distance: result.distance,
      pointA: result.pointA,
      pointB: result.pointB
    };
  }

  _closestPair(points) {
    if (points.length <= 3) {
      let bruteResult = this.bruteForce(points);
      return bruteResult;
    }

    let middleIndex = Math.floor(points.length / 2);
    let middlePoint = points[middleIndex];

    let leftPoints = points.slice(0, middleIndex);
    let rightPoints = points.slice(middleIndex);

    let leftResult = this._closestPair(leftPoints);
    let rightResult = this._closestPair(rightPoints);
    let combinedResult = leftResult.distance < rightResult.distance ? leftResult : rightResult;

    let strip = [];
    for (let i = 0; i < points.length; i++) {
      let point = points[i];
      if (Math.abs(point.x - middlePoint.x) <= combinedResult.distance && point.x >= points[0].x && point.x <= points[points.length - 1].x) {
        strip.push(point);
      }
    }

    let stripResult = this._getMinimumDistanceStrip(strip, combinedResult.distance);
    let totalResult = stripResult.distance < combinedResult.distance ? stripResult : combinedResult;

    return totalResult;
  }

  _getDistance(first, second) {
    return Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2));
  }

  _getMinimumDistanceStrip(strip, d) {
    let minDistance = d;
    let pointA, pointB;
    for (let i = 0; i < strip.length; i++) {
      for (let j = i + 1; j < strip.length && (strip[j].y - strip[i].y) < d; j++) {
        if (this._getDistance(strip[i], strip[j]) < minDistance) {
          minDistance = this._getDistance(strip[i], strip[j]);
          pointA = strip[i];
          pointB = strip[j];
        }
      }
    }
    return {
      distance: minDistance,
      pointA,
      pointB
    };
  }
}
