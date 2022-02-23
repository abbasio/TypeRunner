import kaboom from 'kaboom';

kaboom();

loadSprite('runner', '../public/sprites/run.png', {
  sliceX: 8,
  anims: {
    run: {
      from: 0,
      to: 7,
      loop: true,
    },
  },
});

add([
  sprite('runner', {
    anim: 'run',
  }),
  area(),
  pos(480, 120),
  scale(2),
  body(),
  move(RIGHT, 50),
]);
let platform = 'test string';
const untypedWords = platform.split('');

untypedWords.forEach((letter, index) => {
  add([text(letter), pos(index * 50 + 480, 620), opacity(0.5)]);
});

const typedWords = [];

const whiteLetter = (char, index) => {
  add([text(char), pos(index * 50 + 480, 620), solid(), area()]);
};

const redLetter = (char, index) => {
  add([
    text(char),
    pos(index * 50 + 480, 620),
    solid(),
    area(),
    color(255, 0, 0),
  ]);
};

onCharInput((char) => {
  typedWords.push(char);
  const index = typedWords.length - 1;
  if (typedWords[index] === untypedWords[index]) {
    whiteLetter(char, index);
  } else {
    redLetter(char, index);
  }
});
