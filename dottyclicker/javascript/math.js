function MathHelper_rotate(vx, vy, rx, ry) {
    return [vx * rx - vy * ry, vx * ry + vy * rx];
}

function MathHelper_expDecay(a, b, decay, dt) {
    return b + (a - b) * Math.exp(-decay * dt);
}
    
function MathHelper_dot2D(v1, v2) {
    let [x1, y1] = v1;
    let [x2, y2] = v2;
    return x1 * x2 + y1 * y2;
}

function MathHelper_normalize(v) {
    let inv_magnitude = 1 / Math.hypot(...v);
    if (v.length == 2) return this.scale2(inv_magnitude, v);
    if (v.length == 3) return this.scale3(inv_magnitude, v);
}

function MathHelper_setMagnitude(m, v) {
    let new_magnitude = m / Math.hypot(...v);
    if (v.length == 2) return this.scale2(new_magnitude, v);
    if (v.length == 3) return this.scale3(new_magnitude, v);
}

function MathHelper_cross(v1, v2) {
    let [x1, y1, z1] = v1;
    let [x2, y2, z2] = v2;
    
    return [y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2];
}

function MathHelper_scale2(s, v1) {
    let [x1, y1] = v1;
    
    return [s * x1, s * y1];
}

function MathHelper_scale3(s, v1) {
    let [x1, y1, z1] = v1;
    
    return [s * x1, s * y1, s * z1];
}

function MathHelper_mult2(v1, v2) {
    let [x1, y1] = v1;
    let [x2, y2] = v2;
    
    return [x1 * x2, y1 * y2];
}

function MathHelper_mult3(v1, v2) {
    let [x1, y1, z1] = v1;
    let [x2, y2, z2] = v2;
    
    return [x1 * x2, y1 * y2, z1 * z2];
}

function MathHelper_add2(v1, v2) {
    let [x1, y1] = v1;
    let [x2, y2] = v2;
    
    return [x1 + x2, y1 + y2];
}

function MathHelper_add3(v1, v2) {
    let [x1, y1, z1] = v1;
    let [x2, y2, z2] = v2;
    
    return [x1 + x2, y1 + y2, z1 + z2];
}

function MathHelper_subtract2(v1, v2) {
    let [x1, y1] = v1;
    let [x2, y2] = v2;
    
    return [x1 - x2, y1 - y2];
}
    
function MathHelper_subtract3(v1, v2) {
    let [x1, y1, z1] = v1;
    let [x2, y2, z2] = v2;
    
    return [x1 - x2, y1 - y2, z1 - z2];
}