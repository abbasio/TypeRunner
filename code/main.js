/* eslint-disable no-undef */
import kaboom from 'kaboom';
import load from './load';
import axios from 'axios';
import { ca } from 'date-fns/locale';

kaboom({
  debug: true,
  background: [0, 0, 0],
  width: 1200,
  height: 720,
  crisp: true,
  font: 'sinko',
});
load();

//---------STARTING OBJECTS
scene('game', (speed) => {
  const runner = add([
    sprite('runner', {
      anim: 'run',
    }),
    area(),
    pos(0, 120),
    scale(2),
    body(),
    move(RIGHT, speed),
  ]);

  add([rect(300, 50), pos(0, 360), area(), solid(), color(255, 255, 255)]);

  //---------GET RANDOM QUOTE
  const words = [];
  load(
    new Promise(async () => {
      try {
        const response = await axios.get('https://api.quotable.io/random', {
          timeout: 1000,
        });
        console.log(response);
        const quote = response.data.content;
        const untypedWords = quote.split('');
        untypedWords.forEach((letter, index) => {
          words.push(letter);
          add([
            text(letter),
            pos(index * 50 + 300, 360),
            opacity(0.33),
            scale(6),
          ]);
        });
        add([
          rect(300, 50),
          pos(untypedWords.length * 50 + 300, 360),
          area(),
          solid(),
          color(255, 255, 255),
          'end',
        ]);
      } catch (error) {
        console.log(error);
        const quote =
          'Hello! This quote is generated if the random quote API fails';
        const untypedWords = quote.split('');
        untypedWords.forEach((letter, index) => {
          words.push(letter);
          add([
            text(letter),
            pos(index * 50 + 300, 360),
            opacity(0.33),
            scale(6),
          ]);
        });
        add([
          rect(300, 50),
          pos(untypedWords.length * 50 + 300, 360),
          area(),
          solid(),
          color(255, 255, 255),
          'end',
        ]);
      }
    })
  );

  //---------TYPED OBJECTS

  const typedWords = [];

  const whiteLetter = (char, index) => {
    add([
      text(char),
      pos(index * 50 + 300, 360),
      solid(),
      area(),
      scale(6),
      'correct',
    ]);
  };

  const redLetter = (char, index) => {
    add([
      text(char),
      pos(index * 50 + 300, 360),
      solid(),
      area(),
      color(255, 0, 0),
      scale(6),
      'error',
    ]);
  };

  //---------TYPING

  const wpm = add([rect(0, 0), pos(0, 360), move(RIGHT, speed)]);

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

  onUpdate(() => {
    camPos(wpm.pos);
  });

  runner.onUpdate(() => {
    if (
      runner.pos.y > 720 ||
      runner.pos.x < wpm.pos.x - runner.width / 2 - width() / 2
    ) {
      shake();
      destroy(runner);
      go('menu');
    }
  });

  runner.onCollide('error', () => {
    runner.use(move(RIGHT, speed / 2));
    shake();
  });
  runner.onCollide('correct', () => {
    runner.use(move(RIGHT, speed));
  });

  runner.onCollide('end', () => {
    console.log('Finished!');
  });
});

//---------MAIN MENU

scene('menu', () => {
  add([text('TYPE/RUNNER'), pos(600, 240), origin('center'), scale(6)]);
  add([
    text('> Press Enter', {
      size: 20,
    }),
    color(255, 255, 255),
    pos(600, 360),
    origin('center'),
  ]);

  onKeyPress('enter', () => {
    go('game', 300);
  });
});

go('menu');
