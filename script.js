let flores = [];
let luciernagas = [];
let mariposas = [];
let estrellas = [];
let creciendo = false;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('jardin-canvas');

    const crearJardinBtn = document.getElementById('crearJardin');
    crearJardinBtn.addEventListener('click', iniciarJardin);

    colorMode(HSB, 360, 100, 100, 1);
    crearEstrellas();
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

        for (let mariposa of mariposas) {
            mariposa.mover();
            mariposa.dibujar();
        }
    }
    moverEstrellas();
}

function drawStarryBackground() {
    background(220, 50, 15); // Fondo azul oscuro
    for (let estrella of estrellas) {
        estrella.dibujar();
    }
}

function crearEstrellas() {
    for (let i = 0; i < 200; i++) {
        estrellas.push(new Estrella());
    }
}

function moverEstrellas() {
    for (let estrella of estrellas) {
        estrella.mover();
    }
}

function iniciarJardin() {
    const overlay = document.getElementById('overlay');
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';

    setTimeout(() => {
        overlay.style.display = 'none';
        crearJardin();
    }, 1000); // Espera 1 segundo antes de crear el jardín
}

function crearJardin() {
    console.log("Creando jardín...");
    flores = [];
    luciernagas = [];
    mariposas = [];
    creciendo = true;

    // Crear una cuadrícula para distribuir las flores
    const gridSize = 30; // Reducimos el tamaño de la cuadrícula para permitir flores más juntas
    const gridWidth = Math.ceil(width / gridSize);
    const gridHeight = Math.ceil(height / gridSize);
    const grid = new Array(gridWidth).fill().map(() => new Array(gridHeight).fill(false));

    // Función para verificar si una posición está disponible
    function posicionDisponible(x, y, tamaño) {
        const gridX = Math.floor(x / gridSize);
        const gridY = Math.floor(y / gridSize);
        const radio = Math.ceil(tamaño / (2 * gridSize));

        for (let i = -radio; i <= radio; i++) {
            for (let j = -radio; j <= radio; j++) {
                if (gridX + i >= 0 && gridX + i < gridWidth && gridY + j >= 0 && gridY + j < gridHeight) {
                    if (grid[gridX + i][gridY + j]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // Función para marcar una posición como ocupada
    function marcarPosicion(x, y, tamaño) {
        const gridX = Math.floor(x / gridSize);
        const gridY = Math.floor(y / gridSize);
        const radio = Math.ceil(tamaño / (2 * gridSize));

        for (let i = -radio; i <= radio; i++) {
            for (let j = -radio; j <= radio; j++) {
                if (gridX + i >= 0 && gridX + i < gridWidth && gridY + j >= 0 && gridY + j < gridHeight) {
                    grid[gridX + i][gridY + j] = true;
                }
            }
        }
    }

    // Crear flores
    for (let i = 0; i < 300; i++) { // Aumentamos el número de flores a 300
        let intentos = 0;
        while (intentos < 100) { // Aumentamos el número de intentos
            let x, y;
            if (random() < 0.6) { // 60% de probabilidad de crear flores en los lados y abajo
                if (random() < 0.7) { // Más probabilidad de flores en los lados
                    x = random() < 0.5 ? random(width * 0.15) : random(width * 0.85, width);
                    y = random(height * 0.1, height - 20);
                } else { // Algunas flores en la parte inferior
                    x = random(width);
                    y = random(height * 0.7, height - 20);
                }
            } else {
                x = random(width);
                y = random(height * 0.1, height - 20);
            }
            let tamaño = random(20, 50); // Reducimos ligeramente el tamaño máximo

            if (posicionDisponible(x, y, tamaño)) {
                let petalos = floor(random(5, 12));
                let color = [random(360), 80, 90];
                flores.push(new Flor(x, y, tamaño, petalos, color));
                marcarPosicion(x, y, tamaño);
                break;
            }
            intentos++;
        }
    }

    // Crear luciérnagas y mariposas (aumentamos la cantidad)
    for (let i = 0; i < 100; i++) {
        luciernagas.push(new Luciernaga());
    }

    for (let i = 0; i < 40; i++) {
        mariposas.push(new Mariposa());
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
        this.crecimiento = random(0.2, 0.8); // Reducimos la velocidad de crecimiento
        this.angulo = 0;
        this.opacidad = 0; // Nueva propiedad para la animación de aparición
    }

    crecer() {
        if (this.tamaño_actual < this.tamaño) {
            this.tamaño_actual += this.crecimiento;
            this.tamaño_actual = min(this.tamaño_actual, this.tamaño);
        }
        this.angulo += 0.01;
        if (this.opacidad < 1) {
            this.opacidad += 0.01; // Reducimos la velocidad de aparición
        }
    }

    dibujar() {
        push();
        translate(this.x, this.y);
        rotate(sin(this.angulo) * 0.05);

        // Dibujar tallo
        stroke(this.talloColor[0], this.talloColor[1], this.talloColor[2], this.opacidad);
        strokeWeight(3);
        line(0, 0, 0, this.tamaño_actual * 2);

        // Dibujar pétalos
        fill(this.color[0], this.color[1], this.color[2], this.opacidad);
        for (let i = 0; i < this.petalos; i++) {
            push();
            rotate(TWO_PI * i / this.petalos);
            beginShape();
            vertex(0, 0);
            bezierVertex(this.tamaño_actual / 2, -this.tamaño_actual / 4,
                         this.tamaño_actual, -this.tamaño_actual / 4,
                         this.tamaño_actual, 0);
            bezierVertex(this.tamaño_actual, this.tamaño_actual / 4,
                         this.tamaño_actual / 2, this.tamaño_actual / 4,
                         0, 0);
            endShape(CLOSE);
            pop();
        }

        // Dibujar centro de la flor
        fill(60, 100, 100, this.opacidad);
        noStroke();
        ellipse(0, 0, this.tamaño_actual / 3);

        // Dibujar pistilos
        stroke(30, 100, 100, this.opacidad);
        strokeWeight(2);
        for (let i = 0; i < 12; i++) { // Aumentamos el número de pistilos
            let angle = TWO_PI * i / 12;
            let x = cos(angle) * this.tamaño_actual / 6;
            let y = sin(angle) * this.tamaño_actual / 6;
            line(0, 0, x, y);
            fill(30, 100, 100, this.opacidad);
            noStroke();
            ellipse(x, y, 4);
        }

        // Añadir detalles adicionales
        this.dibujarVenas();

        pop();
    }

    dibujarVenas() {
        stroke(this.color[0], this.color[1] - 20, this.color[2] - 20, this.opacidad * 0.5);
        strokeWeight(1);
        for (let i = 0; i < this.petalos; i++) {
            push();
            rotate(TWO_PI * i / this.petalos);
            line(0, 0, this.tamaño_actual * 0.8, 0);
            pop();
        }
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

class Mariposa {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(10, 20);
        this.color = [random(360), 80, 90];
        this.speed = random(1, 3);
        this.angle = random(TWO_PI);
        this.wingAngle = 0;
    }

    mover() {
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
        this.angle += random(-0.2, 0.2);

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        this.wingAngle += 0.4; // Aumentamos la velocidad del aleteo
    }

    dibujar() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);

        // Dibujar alas
        fill(this.color[0], this.color[1], this.color[2]);
        noStroke();
        for (let i = -1; i <= 1; i += 2) {
            push();
            rotate(i * PI / 4);
            let wingY = sin(this.wingAngle) * 5;
            ellipse(i * 10, wingY, this.size, this.size / 2);
            pop();
        }

        // Dibujar cuerpo
        fill(0);
        ellipse(0, 0, this.size / 5, this.size / 2);

        pop();
    }
}

class Estrella {
    constructor() {
        this.reiniciar();
        this.y = random(height);
    }

    reiniciar() {
        this.x = random(width);
        this.y = random(-10, -5);
        this.speed = random(1, 3);
        this.size = random(1, 3);
        this.brightness = random(70, 100);
    }

    mover() {
        this.y += this.speed;
        if (this.y > height) {
            this.reiniciar();
        }
    }

    dibujar() {
        noStroke();
        fill(60, 30, this.brightness);
        ellipse(this.x, this.y, this.size);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
