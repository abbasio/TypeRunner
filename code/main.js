import kaboom from 'kaboom';

kaboom();

let platform = 'test string';
add([text(platform), pos(480, 320), opacity(0.5)]);
const untypedWords = platform.split('');
let typedPlatform = '';
const typedWords = [];

onCharInput((char) => {
  typedWords.push(char);
  const index = typedWords.length - 1;
  if (typedWords[index] === untypedWords[index]) {
    typedPlatform += char;
    add([text(typedPlatform), pos(480, 320), solid(), area()]);
  } else {
    typedPlatform += char;
    add([
      text(typedPlatform),
      pos(480, 320),
      solid(),
      area(),
      color(255, 0, 0),
    ]);
  }
});
