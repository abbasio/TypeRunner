import kaboom from 'kaboom';

kaboom();

let platform = 'test string';
const untypedWords = platform.split('');

untypedWords.forEach((letter, index) => {
  add([text(letter), pos(index * 50 + 480, 320), opacity(0.5)]);
});

const typedWords = [];

const whiteLetter = (char, index) => {
  add([text(char), pos(index * 50 + 480, 320), solid(), area()]);
};

const redLetter = (char, index) => {
  add([
    text(char),
    pos(index * 50 + 480, 320),
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
