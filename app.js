const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const h = document.documentElement.clientHeight;
const w = document.documentElement.clientWidth;

const DIAMETER = w < h ? w - 50 : h - 50;

canvas.height = DIAMETER;
canvas.width = DIAMETER;

const ONE_CIRCLE_TIME = 500; // milliseconds 500ms = 0,5sec
const ONE_ANGLE = 10;
const ONE_ANGLE_TIME = ONE_CIRCLE_TIME / 360 * ONE_ANGLE;
const MIN_TIMES_SCROLL = 100;
const MAX_TIMES_SCROLL = 300;
const MORTY_SECTOR = 'MORTY';
const CUCUMBER_SECTOR = 'CUCUMBER';
const MR_ASS_SECTOR = 'ASS';
const RICK_SECTOR = 'RICK';

let ANGLE_RES = 0;

console.log(`Один круг пройдет за: ${ONE_CIRCLE_TIME / 1000} секунд.\n`
    + `Угол одного поворота: ${ONE_ANGLE} градусов.\n`
    + `Время одного поворота: ${Math.round(ONE_ANGLE_TIME) / 1000} секунд.`);

const ball = loadImg("image/ball.svg", DIAMETER, DIAMETER);
ball.onload = () => {
    document.getElementById('canvas').insertAdjacentHTML(
        'afterend',
        '<br><button onclick="run()" id="btn">Вращайте барабан</button>'
    );
};

const pointer = loadImg("image/pointer.svg", DIAMETER / 6, DIAMETER / 3)

context.drawImage(ball, 0, 0, ball.width, ball.height);
context.drawImage(pointer, DIAMETER / 2 - pointer.width / 2, 0, pointer.width, pointer.height);

function loadAudio(path) {
    const audio = new Audio();
    audio.src = path;
    return audio;
}

const rickAudio = [
    loadAudio("audio/rick1.wav"), loadAudio("audio/rick2.wav"), loadAudio("audio/rick3.wav"),
    loadAudio("audio/rick4.wav"), loadAudio("audio/rick5.wav"), loadAudio("audio/rick6.wav")
];
const mortyAudio = [loadAudio("audio/morty1.wav"), loadAudio("audio/morty2.wav")];
const assAudio = [loadAudio("audio/ass1.wav")];
const cucAudio = [loadAudio("audio/cucumber1.wav")];
const wheelAudio = loadAudio("audio/wheel.mp3");
let audioPerson = wheelAudio;

const rickImg = [
    loadImg("image/rick1.PNG", DIAMETER * 3 / 5, DIAMETER * 3 / 5),
    loadImg("image/rick2.PNG", DIAMETER * 3 / 5, DIAMETER * 3 / 5),
    loadImg("image/rick3.JPG", DIAMETER * 3 / 5, DIAMETER * 3 / 5)
];
const mortyImg = [
    loadImg("image/morty1.PNG", DIAMETER * 3 / 5, DIAMETER * 3 / 5),
    loadImg("image/morty2.PNG", DIAMETER * 3 / 5, DIAMETER * 3 / 5),
    loadImg("image/morty3.PNG", DIAMETER * 3 / 5, DIAMETER * 3 / 5)
];
const assImg = [
    loadImg("image/ass1.PNG", DIAMETER * 3 / 5, DIAMETER * 3 / 5),
    loadImg("image/ass2.PNG", DIAMETER * 3 / 5, DIAMETER * 3 / 5),
    loadImg("image/ass3.PNG", DIAMETER * 3 / 5, DIAMETER * 3 / 5),
];
const cucImg = [
    loadImg("image/cuc1.JPG", DIAMETER * 3 / 5, DIAMETER * 3 / 5),
    loadImg("image/cuc2.PNG", DIAMETER * 3 / 5, DIAMETER * 3 / 5),
    loadImg("image/cuc3.PNG", DIAMETER * 3 / 5, DIAMETER * 3 / 5),
];

const darkBall = loadImg("image/dark_ball.svg", DIAMETER, DIAMETER);

function loadImg(path, w, h) {
    const img = new Image();
    img.width = w;
    img.height = h;
    img.src = path;
    return img;
}

function myFunction() {
    const popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function drawRotatedImage(image, x, y, degrees) {
    // save the current co-ordinate system before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our angle from degrees to radians
    context.rotate(degrees * Math.PI / 180);

    // draw it up and to the left by half the width and height of the image
    context.drawImage(image, -(image.width / 2), -(image.height / 2), image.width, image.height);

    ANGLE_RES = degrees;
    // console.log(degrees);

    // and restore the co-ords to how they were when we began
    context.restore();
}

function getRandom(min, max) { // return [min, max) int
    return parseInt(Math.random() * (max - min) + min);
}

function run() {
    audioPerson.pause();
    audioPerson.currentTime = 0.0;
    wheelAudio.play();
    document.getElementById('btn').disabled = true;

    const times = getRandom(MIN_TIMES_SCROLL, MAX_TIMES_SCROLL);
    for (let i = 0; i < times; i++) {
        setTimeout(e => {
            drawRotatedImage(ball, ball.width / 2, ball.height / 2, i * ONE_ANGLE);
            context.drawImage(pointer, DIAMETER / 2 - pointer.width / 2, 0, pointer.width, pointer.height);
        }, i * ONE_ANGLE_TIME);
    }

    setTimeout(getResults, times * ONE_ANGLE_TIME + 200);
}

function getResults() {
    wheelAudio.pause();
    wheelAudio.currentTime = 0.0;
    ANGLE_RES = ANGLE_RES % 360;
    console.log('angle: ', ANGLE_RES);
    let img;

    if (ANGLE_RES < 90) {
        console.log(RICK_SECTOR);
        audioPerson = rickAudio[getRandom(0, rickAudio.length)];
        img = rickImg[getRandom(0, rickImg.length)];
    } else if (ANGLE_RES < 180) {
        console.log(MR_ASS_SECTOR);
        audioPerson = assAudio[getRandom(0, assAudio.length)];
        img = assImg[getRandom(0, assImg.length)];
    } else if (ANGLE_RES < 270) {
        audioPerson = cucAudio[getRandom(0, cucAudio.length)];
        console.log(CUCUMBER_SECTOR);
        img = cucImg[getRandom(0, cucImg.length)];
    } else if (ANGLE_RES < 360) {
        audioPerson = mortyAudio[getRandom(0, mortyAudio.length)];
        console.log(MORTY_SECTOR);
        img = mortyImg[getRandom(0, mortyImg.length)];
    }

    audioPerson.play();
    context.drawImage(darkBall, 0, 0, darkBall.width, darkBall.height);
    context.drawImage(img, DIAMETER / 5, DIAMETER / 5, img.width, img.height);

    document.getElementById('btn').disabled = false;
}