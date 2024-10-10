const cookieTextureCount = 3; // Must be in the interval [0, 9]
const cookieCount = 50; // The number of cookie instances
const cookieBaseSize = 200; // In pixels



class Cookie {
    static greatestId = 0;


    constructor() {
        Cookie.greatestId++;
        this.id = Cookie.greatestId;

        this.domEl = new Image();

        this.x = 0;
        this.y = 0;
        this.setDistance(1.0);
        this.rotation = 0.0;
        this.flip = false;

        this.setTextureIndex(0);
        this.domEl.alt = `Cookie ${this.id}`;

        this.domEl.style.width = `${cookieBaseSize}px`;
        this.domEl.style.height = `${cookieBaseSize}px`;
        this.domEl.style.position = "absolute";

        this.updateTransform();

        document.body.appendChild(this.domEl);
    }


    setTextureIndex(index) {
        this.domEl.src = `textures/cookie-${index}.png`;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setDistance(distance) {
        this.distance = distance;
        // Set the z index to one of a million integer values
        this.domEl.style.zIndex = `${-Math.floor(1000000 * distance)}`;
    }

    setRotation(rotation) {
        this.rotation = rotation;
    }

    setFlip(flip) {
        this.flip = flip;
    }

    updateTransform() {
        // Multiply the x scale by -1 if the cookie is flipped
        let flipMult = this.flip ? -1.0 : 1.0;

        let scale = 1.0 / this.distance;

        // Transformation string for CSS
        let translateString =
            `translate(${this.x - cookieBaseSize / 2}px, \
            ${this.y - cookieBaseSize / 2}px)`;
        let rotateString = `rotate(${this.rotation}deg)`;
        let scaleString = `scale(${flipMult * scale}, ${scale})`;

        this.domEl.style.transform =
            `${translateString} ${rotateString} ${scaleString}`;
    }
}



let windowWidth = window.innerWidth
let windowHeight = window.innerHeight;

let prevTime = Date.now();

let cookies = [];

let cookieSpeed = 0.125;


function setCookie(cookie) {
    let x = Math.random() * windowWidth; // Distribute horizontally
    let y = -cookieBaseSize * (1.0 + 5.0 * Math.random()); // Vertical spacing

    cookie.setTextureIndex(Math.floor(cookieTextureCount * Math.random()));
    cookie.setPosition(x, y);
    cookie.setDistance(1.0 + 1.0 * Math.random());
    cookie.setRotation(Math.random() * 360.0);
    cookie.setFlip(Math.random() < 0.5);

    cookie.updateTransform();
}


function ioLoop() {
    // Update window dimensions
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight;

    let deltaTime = Date.now() - prevTime;

    for (let c of cookies) {
        if (c.y < windowHeight + 3.0 * cookieBaseSize) {
            c.y += cookieSpeed * deltaTime / (c.distance * c.distance);
            c.updateTransform();
        } else {
            setCookie(c);
        }
    }

    prevTime = Date.now();
    requestAnimationFrame(ioLoop);
}


function main() {
    for (let i = 0; i < cookieCount; i++) {
        let c = new Cookie(0);
        setCookie(c);

        cookies.push(c);
    }

    ioLoop();
}



main();
