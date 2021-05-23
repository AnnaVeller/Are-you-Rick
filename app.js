const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
canvas.height = document.documentElement.clientHeight - 50;
canvas.width = document.documentElement.clientWidth - 50;

const diameter = canvas.width < canvas.height ? canvas.width : canvas.height;

const ball = loadImg("ball.svg", diameter, diameter);
const pointer = loadImg("pointer.svg", diameter / 6, diameter / 3)


context.drawImage(ball, 0, 0, ball.width, ball.height);
context.drawImage(pointer, diameter / 2 - pointer.width / 2, 0, pointer.width, pointer.height);


function loadImg(path, w, h) {
    const img = new Image();
    img.width = w;
    img.height = h;
    img.src = path;
    return img;
}

function drawRotatedImage(image, x, y, angle) {
    const TO_RADIANS = Math.PI / 180;
    // save the current co-ordinate system
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our
    // angle from degrees to radians
    context.rotate(angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image
    context.drawImage(image, -(image.width / 2), -(image.height / 2), image.width, image.height);

    // and restore the co-ords to how they were when we began
    context.restore();
}


function run() {
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    for (let i = 0; i < getRandom(10, 50); i++) {
        setTimeout(e => {
            drawRotatedImage(ball, ball.width / 2, ball.height / 2, i * 15);
            context.drawImage(pointer, diameter / 2 - pointer.width / 2, 0, pointer.width, pointer.height);
        }, i * 50);
    }
}