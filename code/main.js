import kaboom from 'kaboom';
import load from './load';

kaboom({
  background: [0, 0, 0],
  width: 1200,
  height: 720,
  crisp: true,
});
load();

//---------STARTING OBJECTS

const runner = add([
  sprite('runner', {
    anim: 'run',
  }),
  area(),
  pos(0, 120),
  scale(2),
  body(),
  move(RIGHT, 100),
]);

add([rect(300, 48), pos(0, 360), area(), solid(), color(255, 255, 255)]);

let platform = 'test string';
const untypedWords = platform.split('');

untypedWords.forEach((letter, index) => {
  add([text(letter), pos(index * 50 + 300, 360), opacity(0.33)]);
});

//---------TYPED OBJECTS

const typedWords = [];

const whiteLetter = (char, index) => {
  add([text(char), pos(index * 50 + 300, 360), solid(), area()]);
};

const redLetter = (char, index) => {
  add([
    text(char),
    pos(index * 50 + 300, 360),
    solid(),
    area(),
    color(255, 0, 0),
    'mistake',
  ]);
};

//---------TYPING

onCharInput((char) => {
  typedWords.push(char);
  const index = typedWords.length - 1;
  if (typedWords[index] === untypedWords[index]) {
    whiteLetter(char, index);
  } else {
    redLetter(char, index);
  }
});

runner.onUpdate(() => {
  camPos(runner.pos);
  if (runner.pos.y > 720) {
    destroy(runner);
  }
});

runner.onCollide('mistake', () => {
  shake();
});
