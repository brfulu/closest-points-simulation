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
    this.events = []
    this.points = points;

    points.sort((a, b) => a.x - b.x);
    this.pointsOrderedByX = points.slice();

    points.sort((a, b) => a.y - b.y);
    this.pointsOrderedByY = points.slice();

    let result = this._closestPair(this.pointsOrderedByX);
    return {
      distance: result.distance,
      events: this.events
    };
  }

  _closestPair(points) {
    this.events.push({
      type: 'highlightRect',
      x: points[0].x - 6,
      y: 0,
      width: points[points.length - 1].x - points[0].x + 12,
      height: 530
    });

    if (points.length <= 3) {
      let bruteResult = this.bruteForce(points);
      this.events.push({
        type: 'drawLine',
        pointA: bruteResult.pointA,
        pointB: bruteResult.pointB,
        label: 'd'
      });
      return bruteResult;
    }

    let middleIndex = Math.floor(points.length / 2);
    let middlePoint = points[middleIndex];

    let leftPoints = points.slice(0, middleIndex);
    let rightPoints = points.slice(middleIndex);

    let leftResult = this._closestPair(leftPoints);
    let minDistanceLeft = leftResult.distance;

    let rightResult = this._closestPair(rightPoints);
    let minDistanceRight = rightResult.distance;

    this.events.push({
      type: 'highlightLeftRight',
      x: points[0].x - 6,
      y: 0,
      width: points[points.length - 1].x - points[0].x + 12,
      height: 530,
      pointLeftA: leftResult.pointA,
      pointLeftB: leftResult.pointB,
      labelLeft: 'dl',
      pointRightA: rightResult.pointA,
      pointRightB: rightResult.pointB,
      labelRight: 'dr'
    });

    let combinedResult = leftResult.distance < rightResult.distance ? leftResult : rightResult;

    this.events.push({
      type: 'combine',
      x: points[0].x - 6,
      y: 0,
      width: points[points.length - 1].x - points[0].x + 12,
      height: 530,
      pointA: combinedResult.pointA,
      pointB: combinedResult.pointB,
      label: 'd'
    });

    let strip = [];
    for (let i = 0; i < points.length; i++) {
      let point = points[i];
      if (Math.abs(point.x - middlePoint.x) <= combinedResult.distance && point.x >= points[0].x && point.x <= points[points.length - 1].x) {
        strip.push(point);
      }
    }

    this.events.push({
      type: 'highlightStrip',
      x: Math.max(points[0].x - 6, middlePoint.x - combinedResult.distance - 6),
      y: 0,
      width: Math.min(points[points.length - 1].x - Math.max(points[0].x, middlePoint.x - combinedResult.distance - 6), 2 * combinedResult.distance + 12),
      height: 530,
      pointA: combinedResult.pointA,
      pointB: combinedResult.pointB
    });

    let stripResult = this._getMinimumDistanceStrip(strip, combinedResult.distance);
    let totalResult = stripResult.distance < combinedResult.distance ? stripResult : combinedResult;

    this.events.push({
      type: (points.length == this.points.length ? 'highlightFinish' : 'highlightResult'),
      x: points[0].x - 6,
      y: 0,
      width: points[points.length - 1].x - points[0].x + 12,
      height: 530,
      pointA: totalResult.pointA,
      pointB: totalResult.pointB,
      label: 'd'
    });
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
        this.events.push({
          type: 'highlightPoints',
          pointA: strip[i],
          pointB: strip[j]
        });
      }
    }
    return {
      distance: minDistance,
      pointA,
      pointB
    };
  }
}
