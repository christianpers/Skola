var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

function cubicBezier(p1, p2, p3, p4, t) {
		
    
    //(1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
    
    
    const x1 = Math.pow(1-t, 3) * p1.x;
    const x2 = 3 * Math.pow(1-t, 2) * t * p2.x;
    const x3 = 3 * (1-t) * Math.pow(t, 2) * p3.x;
    const x4 = Math.pow(t, 3) * p4.x;
    
    const y1 = Math.pow(1-t, 3) * p1.y;
    const y2 = 3 * Math.pow(1-t, 2) * t * p2.y;
    const y3 = 3 * (1-t) * Math.pow(t, 2) * p3.y;
    const y4 = Math.pow(t, 3) * p4.y;
    
    const x = x1 + x2 + x3 + x4;
    const y = y1 + y2 + y3 + y4;
    return { x, y };
}

function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) + (sin * (x - cx)) + cy;
    return {x: nx, y: ny};
}

function getPoints(centerX, centerY, sizeX, sizeY, reverse) {
	const points= [];
	const detail = 10;
  const angle = 340;
  const p1 = {x: centerX - sizeX, y: centerY - 0};
  const p2 = {x: centerX - sizeX, y: centerY - (0.552 * sizeY) };
  const p3 = {x: centerX - (0.552 * sizeX), y: centerY - sizeY};
  const p4 = {x: centerX - 0, y: centerY - sizeY};
  
  if (reverse) {
  	for (let i = detail; i > 0; i--) {
      const t = i / detail;
      const point = cubicBezier(p1, p2, p3, p4, t);
      const rpoint = rotate(180, 180, point.x, point.y, angle);
      points.push(rpoint);
    }
  } else {
  	for (let i = 0; i < detail; i++) {
      const t = i / detail;
      const point = cubicBezier(p1, p2, p3, p4, t);
      const rpoint = rotate(180, 180, point.x, point.y, angle);
      points.push(rpoint);
    }
  }
  
  return points;
}

function drawPoints(points) {
	const length = points.length;
  for (let i = 0; i < length; i++) {
  	ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, 2, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

function drawBezierOval(centerX, centerY, sizeX, sizeY) {
    const offset = 0;
    const secOffset = sizeX * 2 + offset;
    
    const points0 = getPoints(centerX + secOffset, centerY, sizeX, sizeY); //top left right
    const points1 = getPoints(centerX + offset, centerY, sizeX, sizeY, true); //top left left
    const points2 = getPoints(centerX + offset, centerY, sizeX, -sizeY); //bottm left left
    const points3 = getPoints(centerX + offset, centerY, -sizeX, -sizeY, true); // bottom left right
    
    const points4 = getPoints(centerX + secOffset, centerY, -sizeX, sizeY, true); // top right right
    const points5 = getPoints(centerX + offset, centerY, -sizeX, sizeY); // top right left
    const points6 = getPoints(centerX + secOffset, centerY, sizeX, -sizeY, true); // bottom right left
    const points7 = getPoints(centerX + secOffset, centerY, -sizeX, -sizeY); 
    
    const points = [
    	...points1, ...points2, ...points3, ...points0,
      ...points4, ...points7, ...points6,  ...points5,
    ];
    
    let val = 2;
    
    //const interval = setInterval(() => {
    	
    //  if (val >= points.length) {
    //  	clearInterval(interval);
    //  }
    //  drawPoints(points.slice(val, val + 2));
    //  val+=2;
    //}, 100);
    
    drawPoints(points);
}

function drawCircle(centerX, centerY, sizeX, sizeY) {
	const points0 = getPoints(centerX, centerY, -sizeX, sizeY); //top left right
  const points1 = getPoints(centerX, centerY, sizeX, sizeY, true); //top left left
  const points2 = getPoints(centerX, centerY, sizeX, -sizeY); //bottm left left
  const points3 = getPoints(centerX, centerY, -sizeX, -sizeY, true); // bottom left right
  
  const points = [
    ...points1, ...points2, ...points3, ...points0,
  ];
  
  console.log(points);
  
  drawPoints(points);
}

function drawBezierCircle(centerX, centerY, size) {
    drawBezierOval(centerX, centerY, size, size)
    //drawCircle(centerX, centerY, size, size);
}

drawBezierCircle(180, 180, 40)