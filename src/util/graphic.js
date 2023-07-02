export default function judgeLinesCross(x1, y1, x2, y2, x3, y3, x4, y4) {

    if (!(
        Math.min(x1, x2) <= Math.max(x3, x4) && 
        Math.min(y3, y4) <= Math.max(y1, y2) && 
        Math.min(x3, x4) <= Math.max(x1, x2) && 
        Math.min(y1, y2) <= Math.max(y3, y4)
    )) {
        return false;
    }

    let u = (x3 - x1) * (y2 - y1) - (x2 - x1) * (y3 - y1);
    let v = (x4 - x1) * (y2 - y1) - (x2 - x1) * (y4 - y1);
    let w = (x1 - x3) * (y4 - y3) - (x4 - x3) * (y1 - y3);
    let z = (x2 - x3) * (y4 - y3) - (x4 - x3) * (y2 - y3);
    return (u * v <= 0.00000001 && w * z <= 0.00000001);
}
