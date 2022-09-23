
let img;
let mask;

let width;
let height;

let w;
let h;

let globLineCount;

let grid = []
let lines = []

let globCount;
let borderSize;

let nSize = 0.05;

let globColor;
let background;

let doDraw = true

let globRotation = 0;

function buildGrid(dw, dh) {
    for (let x = 0; x < dw; x++) {
        let b = []

        for (let y = 0; y < dh; y++) {
            let n = {
                angle: Math.floor(noise(x * nSize, y * nSize) * 360),
                visited: false,
            }
            b.push(n)
        }
        grid.push(b)
    }
} 

function makeLines(count) {
    for (let index = 0; index < count; index++) {
        lines.push({
            points: [{ x : Math.floor(fxrand() * w), y : Math.floor(fxrand() * h)}, { x : Math.floor(fxrand() * w), y : Math.floor(fxrand() * h)}]
        })
        
    }
}

function updateLines() {

    let size = h / grid.length

    let k = true

    for (const line of lines) {
        
        let lastPoint = line.points[line.points.length - 1]

        let lastX = Math.round(lastPoint.x / size)
        let lastY = Math.round(lastPoint.y / size)

        if (lastX < 0 || lastX >= grid.length) {
            continue
        }

        if (lastY < 0 || lastY >= grid[lastX].length) {
            continue
        }

        k = false

        // if (grid[lastX][lastY].visited) {
        //     continue
        // }
        // console.log("e")


        let angle = grid[lastX][lastY].angle

        let newPoint = pFromC(lastPoint.x, lastPoint.y, angle, 20)

        line.points.push(newPoint)
        grid[lastX][lastY].visited = true

    }

    for (const line of lines) {

        if (line.points.length < 3) {
            continue
        }

        img.strokeWeight(20)
        img.stroke(globColor)
        
        let slast = line.points[line.points.length - 2]
        let last = line.points[line.points.length - 1]

        img.line(slast.x, slast.y, last.x, last.y)
        



    }

    return k
}

function setup() {

    w = 8000
    h = 8000

    noiseSeed(fxrand() * 100)

    let ks = min(windowHeight, windowWidth)

    width = ks / 4 * 3
    height = ks / 4 * 3

    createCanvas(width, height);
    
    mask = createGraphics(w, h);

    img = createGraphics(w, h);

    let p = getPalette()

    background = color(p.background)
    globColor = color(p.foreground)

    img.background(background)


    globCount = Math.floor(fxrand() * 100) + 1
    buildGrid(globCount, globCount)

    borderSize = Math.floor(fxrand() * 50)

    globLineCount = Math.floor(fxrand() * 200) + 100
    makeLines(globLineCount)

    globRotation = Math.floor(fxrand() * 4) * 90

    
    window.$fxhashFeatures = {
        "Grid Resolution" : globCount,
        "Border Size": borderSize,
        "Chaos": globLineCount,
        "Color": p.name,
    }

    console.log(window.$fxhashFeatures)
}

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function pFromC(cx, cy, angle, r) {
    let a = degrees_to_radians(angle)

    let X = cx + (r * Math.cos(a))  
    let Y = cy + (r * Math.sin(a))

    return {x:X, y:Y}
}

function drawGrid() {
    let size = h / grid.length
    console.log(size)

    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            // img.rect(x * size, y * size, size, size)
            // img.textSize(10);
            // img.text(`${grid[x][y]}`, x * size, y * size + size );

            let mx = x * size + size / 2
            let yx = y * size + size / 2

            let p = pFromC(mx, yx, grid[x][y].angle, size)

            img.stroke(0)
            img.line(mx, yx, p.x, p.y)
        }
    }
}

function getPalette() {
    colors = [
        {
            name: "Coffee Bean",
            background: "#fefae0",
            foreground: "#353535",
        },
        {
            name: "Mossy",
            background: "#f0ead2",
            foreground: "#adc178",
        },
        {
            name: "Peaches",
            background: "#f08080",
            foreground: "#ffdab9",
        },
        {
            name: "Passion",
            background: "#ffe1a8",
            foreground: "#e26d5c",
        },
        {
            name: "Navy",
            background: "#0d3b66",
            foreground: "#faf0ca",
        },
    ]

    let choice = Math.floor(fxrand() * colors.length)
    return colors[choice]
}

function draw() {

    // drawGrid()

    if (!doDraw) {
        return
    }

    let r = updateLines()
    if (r) {
        doDraw = false
        fxpreview()
    }
    

    image(img, 0, 0, width, height)

    fill(background)
    noStroke()
    beginShape();
    // Exterior part of shape, clockwise winding
    vertex(0, 0);
    vertex(width, 0);
    vertex(width, height);
    vertex(0, height);
    // Interior part of shape, counter-clockwise winding
    beginContour();
    vertex(borderSize, height-borderSize);
    vertex(width - borderSize, height - borderSize);
    vertex(width - borderSize, borderSize);
    vertex(borderSize, borderSize);

    endContour();
    endShape(CLOSE);

}