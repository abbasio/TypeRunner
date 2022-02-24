import kaboom from 'kaboom';
import load from './load';
import axios from 'axios';

kaboom({
  debug: true,
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
  move(RIGHT, 200),
]);

add([rect(300, 50), pos(0, 360), area(), solid(), color(255, 255, 255)]);

//---------GET RANDOM QUOTE
const words = [];
load(
  new Promise(async (resolve, reject) => {
    const response = await axios.get('https://api.quotable.io/random');
    const quote = response.data.content;
    const untypedWords = quote.split('');
    untypedWords.forEach((letter, index) => {
      words.push(letter);
      add([text(letter), pos(index * 50 + 300, 360), opacity(0.33)]);
    });
    add([
      rect(300, 50),
      pos(untypedWords.length * 50 + 300, 360),
      area(),
      solid(),
      color(255, 255, 255),
      'end',
    ]);
  })
);

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
    'error',
  ]);
};

//---------TYPING

onCharInput((char) => {
  typedWords.push(char);
  const index = typedWords.length - 1;
  if (index <= words.length - 1) {
    if (typedWords[index] === words[index]) {
      whiteLetter(char, index);
    } else {
      redLetter(char, index);
    }
  }
});

runner.onUpdate(() => {
  camPos(runner.pos);
  if (runner.pos.y > 720) {
    destroy(runner);
  }
});

runner.onCollide('error', () => {
  shake();
});

runner.onCollide('end', () => {
  console.log('Finished!');
});
