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

const ball = loadImg("ball_with_defect.svg", DIAMETER, DIAMETER);
const darkBall = loadImg("dark_ball.svg", DIAMETER, DIAMETER);
const pointer = loadImg("pointer.svg", DIAMETER, DIAMETER);
const mainPic = loadImg("main.jpg", DIAMETER, DIAMETER);
const bigFrame = loadImg("big-frame.svg", DIAMETER, DIAMETER);
const text = loadImg("text.png", DIAMETER, DIAMETER);
const frame = loadImg("frame.svg", DIAMETER, DIAMETER);
const rickImg = loadManyImg(["rick1.png", "rick2.png", "rick3.jpg"], DIAMETER * 3 / 5, DIAMETER * 3 / 5);
const mortyImg = loadManyImg(["morty1.png", "morty2.png", "morty3.png"], DIAMETER * 3 / 5, DIAMETER * 3 / 5);
const assImg = loadManyImg(["ass1.png", "ass2.png", "ass3.png"], DIAMETER * 3 / 5, DIAMETER * 3 / 5);
const cucImg = loadManyImg(["cuc1.jpg", "cuc2.png", "cuc3.png"], DIAMETER * 3 / 5, DIAMETER * 3 / 5);

const wheelAudio = loadAudio("wheel.mp3");
// let audioPerson = wheelAudio;
const rickAudio = loadManyAudio(["rick1.mp3", "rick2.mp3", "rick3.mp3", "rick4.mp3", "rick5.mp3", "rick6.mp3"]);
const mortyAudio = loadManyAudio(["morty1.mp3", "morty2.mp3"]);
const assAudio = loadManyAudio(["ass1.mp3"]);
const cucAudio = loadManyAudio(["cuc1.mp3"]);

let soundTrack = new Audio();

mainPic.onload = () => {
    drawPic(mainPic, 0, 0);
    text.onload = () => {
        const drawAnimation = yArr => {
            const draw = y => {
                drawPic(mainPic, 0, 0);
                drawPic(bigFrame, 0, 0);
                drawPic(text, 0, y);
            };
            const timeouts = [];
            for (let i = 0; i < yArr.length; i++) {
                timeouts[i] = setTimeout(draw.bind(this, yArr[i]), i * 100 + 100);
            }

            document.getElementById('canvas').insertAdjacentHTML(
                'afterend',
                `<br><button onclick="run([${timeouts}])" id="btn">Вращайте барабан</button>`
            )
        };

        drawAnimation([-10, -20, -30, -40, -30, -20, -10, 0, 10, 20, 30, 40,
            30, 20, 10, 0, -10, -20, -30, -40, -30, -20, -10, 0, -10, -20, -30, -40, -30, -20, -10, 0, 10, 20, 30, 40,
            30, 20, 10, 0, -10, -20, -30, -40, -30, -20, -10, 0]);

    };
};

function loadAudio(path) {
    // const audio = new Audio();
    // audio.src = 'audio/' + path;
    return 'audio/' + path;
}

function loadManyAudio(pathArr) {
    const arr = [];
    for (let i = 0; i < pathArr.length; i++) {
        arr.push(loadAudio(pathArr[i]));
    }
    return arr;
}

function loadImg(path, w, h) {
    const img = new Image();
    img.width = w;
    img.height = h;
    img.src = 'img/' + path;
    return img;
}

function loadManyImg(pathArr, w, h) {
    const arr = [];
    for (let i = 0; i < pathArr.length; i++) {
        arr.push(loadImg(pathArr[i], w, h));
    }
    return arr;
}

function drawRotatedImage(image, x, y, degrees) {
    context.save();
    context.translate(x, y);
    context.rotate(degrees * Math.PI / 180);
    drawPic(image, -(image.width / 2), -(image.height / 2));
    ANGLE_RES = degrees;
    context.restore();
}

function getRandom(min, max) { // return [min, max) int
    return parseInt(Math.random() * (max - min) + min);
}

function drawPic(pic, x, y) {
    context.drawImage(pic, x, y, pic.width, pic.height);
}

function run(timeouts = []) {
    for (let i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    soundTrack.pause();
    soundTrack.currentTime = 0.0;
    soundTrack.src = wheelAudio;
    soundTrack.play();
    //audioPerson.pause();
    //audioPerson.currentTime = 0.0;
    //wheelAudio.play();
    document.getElementById('btn').disabled = true;

    const times = getRandom(MIN_TIMES_SCROLL, MAX_TIMES_SCROLL);
    for (let i = 0; i < times; i++) {
        setTimeout(e => {
            drawRotatedImage(ball, ball.width / 2, ball.height / 2, i * ONE_ANGLE);
            drawPic(pointer, DIAMETER / 2 - pointer.width / 2, 1)
        }, i * ONE_ANGLE_TIME);
    }

    setTimeout(getResults, times * ONE_ANGLE_TIME + 200);
}

function getResults() {

    // wheelAudio.pause();
    // wheelAudio.currentTime = 0.0;
    ANGLE_RES = ANGLE_RES % 360;
    console.log('angle: ', ANGLE_RES);
    let img;

    let audioPerson;

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

    soundTrack.pause();
    soundTrack.currentTime = 0.0;
    soundTrack.src = audioPerson;
    soundTrack.play();

    drawPic(darkBall, 0, 0);
    drawPic(img, DIAMETER / 5, DIAMETER / 5);
    drawPic(frame, 0, 0);

    document.getElementById('btn').disabled = false;
}