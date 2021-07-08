const drawRotatedImage = (image, x, y, degrees) => {
    context.save();
    context.translate(x, y);
    context.rotate(degrees * Math.PI / 180);
    drawPic(image, -image.width / 2, -image.height / 2);
    context.restore();
}
const loadImg = (path, width, height) => {
    const img = new Image(width, height);
    img.src = path;
    return img;
}
const loadPersonImg = (path) => loadImg(path, DIAMETER * 3 / 5, DIAMETER * 3 / 5);
// const loadManyImg = (pathArr, w, h) => pathArr.map(path => loadImg(path, w, h));
const getAudioPath = pathArr => pathArr.map(path => 'audio/' + path);
const getRandom = (min, max) => parseInt(Math.random() * (max - min) + min);
const drawPic = (pic, x, y) => context.drawImage(pic, x, y, pic.width, pic.height);

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const h = document.documentElement.clientHeight;
const w = document.documentElement.clientWidth;
const DIAMETER = w < h ? w - 50 : h - 50;
canvas.height = DIAMETER;
canvas.width = DIAMETER;

const ONE_CIRCLE_TIME = 500; // milliseconds 500ms = 0,5sec
const ONE_ANGLE = 13;
const ONE_ANGLE_TIME = ONE_CIRCLE_TIME / 360 * ONE_ANGLE;
const MIN_TIMES_SCROLL = 100;
const MAX_TIMES_SCROLL = 300;

console.log(`Один круг пройдет за: ${ONE_CIRCLE_TIME / 1000} секунд.\n`
    + `Угол одного поворота: ${ONE_ANGLE} градусов.\n`
    + `Время одного поворота: ${Math.round(ONE_ANGLE_TIME) / 1000} секунд.`);

const ball = loadImg("assets/img/elements/ball_with_defect.svg", DIAMETER, DIAMETER);
const darkBall = loadImg("assets/img/elements/dark_ball.svg", DIAMETER, DIAMETER);
const pointer = loadImg("assets/img/elements/pointer.svg", DIAMETER, DIAMETER);
const mainPic = loadImg("assets/img/elements/main.jpg", DIAMETER, DIAMETER);
const bigFrame = loadImg("assets/img/elements/big-frame.svg", DIAMETER, DIAMETER);
const text = loadImg("assets/img/elements/text.png", DIAMETER, DIAMETER);
const frame = loadImg("assets/img/elements/frame.svg", DIAMETER, DIAMETER);

let soundTrack = new Audio(); // Сделана общая дорожка чтобы на телефоне работало

const unCodingAudio = "data:audio/mp3;base64,";
const RICK = {
    name: 'Рик',
    img: [1, 2, 3, 4].map(el => 'assets/img/rick/' + el + '.jpg').map(el => loadPersonImg(el)),
    audio: [RICK_AUDIO_BASE64_1, RICK_AUDIO_BASE64_2, RICK_AUDIO_BASE64_3, RICK_AUDIO_BASE64_4,
        RICK_AUDIO_BASE64_5, RICK_AUDIO_BASE64_6, RICK_AUDIO_BASE64_7]
        .map(el => unCodingAudio + el)
};
const MORTY = {
    name: 'Морти',
    img: [1, 2, 3, 4, 5, 6].map(el => 'assets/img/morty/' + el + '.jpg').map(el => loadPersonImg(el)),
    audio: [MORTY_AUDIO_BASE64_1, MORTY_AUDIO_BASE64_2].map(el => unCodingAudio + el)
};
const ASS = {
    name: 'Жопосранчик',
    img: [1, 2, 3, 4].map(el => 'assets/img/ass/' + el + '.jpg').map(el => loadPersonImg(el)),
    audio: [ASS_AUDIO_BASE64_1, ASS_AUDIO_BASE64_2, ASS_AUDIO_BASE64_3].map(el => unCodingAudio + el)
};
const CUCUMBER = {
    name: 'Огурчик',
    img: [1, 2, 3].map(el => 'assets/img/cuc/' + el + '.jpg').map(el => loadPersonImg(el)),
    audio: [CUC_AUDIO_BASE64_1, CUC_AUDIO_BASE64_2].map(el => unCodingAudio + el)
};


mainPic.onload = () => {
    drawPic(mainPic, 0, 0);
    text.onload = () => {
        const drawAnimation = yArr => {
            const draw = y => {
                drawPic(mainPic, 0, 0);
                drawPic(bigFrame, 0, 0);
                drawPic(text, 0, y);
            };
            const timeouts = yArr.map((y, i) => setTimeout(draw.bind(this, y), (i + 1) * 100));

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

function run(timeouts = []) {
    timeouts.forEach(timeoutID => clearTimeout(timeoutID))
    context.clearRect(0, 0, canvas.width, canvas.height);
    soundTrack.src = wheelAudio;
    soundTrack.play();
    document.getElementById('btn').disabled = true;

    const times = getRandom(MIN_TIMES_SCROLL, MAX_TIMES_SCROLL);
    for (let i = 0; i < times; i++) {
        setTimeout(e => {
            drawRotatedImage(ball, ball.width / 2, ball.height / 2, i * ONE_ANGLE);
            drawPic(pointer, DIAMETER / 2 - pointer.width / 2, 1)
        }, i * ONE_ANGLE_TIME);
    }

    const finishAngle = ((times - 1) * ONE_ANGLE) % 360;
    setTimeout(getResults.bind(this, finishAngle), times * ONE_ANGLE_TIME + 200);
}

function getResults(finishAngle) {
    console.log('---------------------');
    console.log('ИТОГОВЫЙ УГОЛ:', finishAngle);
    let person;
    if (finishAngle < 90) person = RICK;
    else if (finishAngle < 180) person = ASS;
    else if (finishAngle < 270) person = CUCUMBER;
    else if (finishAngle < 360) person = MORTY;

    console.log('Тебе выпал ' + person.name + '!');
    const randAudio = getRandom(0, person.audio.length);
    const randImg = getRandom(0, person.img.length);
    console.log(`Выпала ${randAudio + 1}/${person.audio.length} аудио и ${randImg + 1}/${person.img.length} пикча.`);
    soundTrack.src = person.audio[randAudio];
    soundTrack.play();

    drawPic(darkBall, 0, 0);
    drawPic(person.img[randImg], DIAMETER / 5, DIAMETER / 5);
    drawPic(frame, 0, 0);
    // alert('ТЫ ' + person.name + '!');
    context.beginPath();
    context.font = "42px Bradley Hand";
    context.fillStyle = "DarkCyan"; // DarkCyan, MediumTurquoise
    context.strokeStyle = "White";
    context.fontWeight = "bolder";
    context.textAlign = "center"; // x,y текста - его центр
    context.textBaseline = "bottom";
    context.strokeText('ТЫ ' + person.name + '!', DIAMETER * 200 / 400, DIAMETER * 261 / 320);
    context.fillText('ТЫ ' + person.name + '!', DIAMETER * 201 / 400, DIAMETER * 260 / 320);
    context.closePath();

    document.getElementById('btn').disabled = false;
}