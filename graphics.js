// any kind of graphics/onscreen objects (buttons, models, etc.)

function Button(x, y, text, fn, scale=1, fill){
    this.width = scale * 300*G_PREFERED_SCALAR;
    this.height = scale * 45*G_PREFERED_SCALAR;
    this.x = x - this.width*0.5;
    this.y = y - this.height*0.5;
    this.color = Color.RED;
    this.text = text;
    this.fn = fn;
    this.scale = scale;
    this.lineWidth = 4;
    this.fill = fill;
}

class ButtonHelper {
    static drawButtons() {
        for(let i = 0; i < g_buttonsList.length; i++){
            drawButton(g_buttonsList[i]);
        }
    }
}

function rectangleContainsPoint(x, y, width, height, x0, y0) {
    return x0 >= x && x0 <= x + width &&
           y0 >= y && y0 <= y + height;
}

function checkIfButtonClicked(button){
    if(
        rectangleContainsPoint(
            button.x, button.y, 
            button.width, button.height, 
            g_mouse.x, g_mouse.y
        )
    ) {
        button.fn();
    }
}

/*function RGBAtoRGBandA(rgba) {
    if (rgba.length == 7) return [rgba, 1];
    if (rgba.length != 9) throw new Error("CustomError: not valid rgb or rgba value: "+rgba)
    let rgb = rgba.substring(0, 7);
    let alpha = parseInt(rgba.substring(8), 16);
    return [rgb, alpha/255];
}*/ //garbage never use

// code from https://stackoverflow.com/questions/17433015/change-the-hue-of-a-rgb-color-in-javascript
// maybe temporary

// Changes the RGB/HEX temporarily to a HSL-Value, modifies that value 
// and changes it back to RGB/HEX.

function changeHue(rgb, degree) {
    let hsl = rgbToHSL(rgb);
    hsl.h += degree;
    if (hsl.h > 360) {
        hsl.h -= 360;
    }
    else if (hsl.h < 0) {
        hsl.h += 360;
    }
    return hslToRGB(hsl);
}

// exepcts a string and returns an object
function rgbToHSL(rgb) {
    // strip the leading # if it's there
    rgb = rgb.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(rgb.length == 3){
        rgb = rgb.replace(/(.)/g, '$1$1');
    }

    let r = parseInt(rgb.substr(0, 2), 16) / 255,
        g = parseInt(rgb.substr(2, 2), 16) / 255,
        b = parseInt(rgb.substr(4, 2), 16) / 255,
        cMax = Math.max(r, g, b),
        cMin = Math.min(r, g, b),
        delta = cMax - cMin,
        l = (cMax + cMin) / 2,
        h = 0,
        s = 0;

    if (delta == 0) {
        h = 0;
    }
    else if (cMax == r) {
        h = 60 * (((g - b) / delta) % 6);
    }
    else if (cMax == g) {
        h = 60 * (((b - r) / delta) + 2);
    }
    else {
        h = 60 * (((r - g) / delta) + 4);
    }

    if (delta == 0) {
        s = 0;
    }
    else {
        s = (delta/(1-Math.abs(2*l - 1)))
    }

    return {
        h: h,
        s: s,
        l: l
    }
}

// expects an object and returns a string
function hslToRGB(hsl) {
    let h = hsl.h,
        s = hsl.s,
        l = hsl.l,
        c = (1 - Math.abs(2*l - 1)) * s,
        x = c * ( 1 - Math.abs((h / 60 ) % 2 - 1 )),
        m = l - c/ 2,
        r, g, b;

    if (h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else {
        r = c;
        g = 0;
        b = x;
    }

    r = normalize_rgb_value(r, m);
    g = normalize_rgb_value(g, m);
    b = normalize_rgb_value(b, m);

    return rgbToHex(r,g,b);
}

function normalize_rgb_value(color, m) {
    color = Math.floor((color + m) * 255);
    if (color < 0) {
        color = 0;
    }
    return color;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
