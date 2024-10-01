let flores = [];
let luciernagas = [];
let creciendo = false;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('jardin-canvas');

    const crearJardinBtn = document.getElementById('crearJardin');
    crearJardinBtn.addEventListener('click', crearJardin);

    colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
    clear();
    drawStarryBackground();
    if (creciendo) {
        for (let flor of flores) {
            flor.crecer();
            flor.dibujar();
        }

        for (let luciernaga of luciernagas) {
            luciernaga.mover();
            luciernaga.dibujar();
        }
    }
}

function drawStarryBackground() {
    for (let i = 0; i < 100; i++) {
        let x = random(width);
        let y = random(height);
        let size = random(0.5, 2);
        fill(60, 20, 100, random(0.1, 0.5));
        noStroke();
        ellipse(x, y, size);
    }
}

function crearJardin() {
    console.log("Creando jardín...");
    flores = [];
    luciernagas = [];
    creciendo = true;

    for (let i = 0; i < 20; i++) {
        let x = random(width);
        let y = random(height * 0.4, height - 50);
        let tamaño = random(40, 80);
        let petalos = floor(random(5, 12));
        let color = [random(360), 80, 90];
        flores.push(new Flor(x, y, tamaño, petalos, color));
    }

    for (let i = 0; i < 50; i++) {
        luciernagas.push(new Luciernaga());
    }
}

class Flor {
    constructor(x, y, tamaño, petalos, color) {
        this.x = x;
        this.y = y;
        this.tamaño = tamaño;
        this.tamaño_actual = 0;
        this.petalos = petalos;
        this.color = color;
        this.talloColor = [120, 70, 50];
        this.crecimiento = random(0.5, 1.5);
        this.angulo = 0;
    }

    crecer() {
        if (this.tamaño_actual < this.tamaño) {
            this.tamaño_actual += this.crecimiento;
        }
        this.angulo += 0.01;
    }

    dibujar() {
        push();
        translate(this.x, this.y);
        rotate(sin(this.angulo) * 0.05);

        // Dibujar tallo
        stroke(this.talloColor[0], this.talloColor[1], this.talloColor[2]);
        strokeWeight(3);
        line(0, 0, 0, this.tamaño_actual * 2);

        // Dibujar pétalos
        fill(this.color[0], this.color[1], this.color[2]);
        for (let i = 0; i < this.petalos; i++) {
            push();
            rotate(TWO_PI * i / this.petalos);
            ellipse(this.tamaño_actual / 2, 0, this.tamaño_actual, this.tamaño_actual / 2);
            pop();
        }

        // Dibujar centro de la flor
        fill(60, 100, 100);
        noStroke();
        ellipse(0, 0, this.tamaño_actual / 3);

        // Dibujar pistilos
        stroke(30, 100, 100);
        strokeWeight(2);
        for (let i = 0; i < 8; i++) {
            let angle = TWO_PI * i / 8;
            let x = cos(angle) * this.tamaño_actual / 6;
            let y = sin(angle) * this.tamaño_actual / 6;
            line(0, 0, x, y);
            fill(30, 100, 100);
            noStroke();
            ellipse(x, y, 4);
        }

        pop();
    }
}

class Luciernaga {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(2, 5);
        this.brightness = random(50, 100);
        this.speed = random(0.5, 2);
        this.angle = random(TWO_PI);
    }

    mover() {
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
        this.angle += random(-0.1, 0.1);

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        this.brightness = 50 + 50 * sin(frameCount * 0.1 + this.x * 0.01 + this.y * 0.01);
    }

    dibujar() {
        noStroke();
        fill(60, 100, this.brightness, 0.7);
        ellipse(this.x, this.y, this.size);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
