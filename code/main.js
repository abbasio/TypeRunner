/* eslint-disable no-undef */
import kaboom from 'kaboom';
import load from './load';
import axios from 'axios';

import mainmenu from './scenes/mainmenu';
import gameover from './scenes/gameover';
import complete from './scenes/complete';
import submitscore from './scenes/submitscore';
import highscores from './scenes/highscores';

const ratio = Math.max(
  window.innerWidth / window.innerHeight,
  window.innerHeight / window.innerWidth
);
export const DEFAULT_HEIGHT = 720;
export const DEFAULT_WIDTH = ratio * DEFAULT_HEIGHT;

kaboom({
  debug: true,
  background: [0, 0, 0],
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  crisp: true,
  font: 'sinko',
});
load();

//---------GAME
scene('game', (difficulty) => {
  let speed;
  switch (difficulty) {
    case 0:
      speed = 200;
      break;
    case 1:
      speed = 275;
      break;
    case 2:
      speed = 350;
      break;
    case 3:
      speed = 450;
      break;
  }
  const runner = add([
    sprite('runner', {
      anim: 'run',
    }),
    area(),
    pos(-200, 120),
    scale(2),
    body(),
    move(RIGHT, speed),
  ]);

  add([
    rect(1500, 360),
    pos(-1200, 360),
    area(),
    solid(),
    color(255, 255, 255),
  ]);

  //---------GET RANDOM QUOTE
  const words = [];
  const quoteData = [];
  load(
    new Promise(async () => {
      try {
        const response = await axios.get('https://api.quotable.io/random', {
          timeout: 1000,
        });
        quoteData.push(response.data);
        const quote = response.data.content;
        const untypedWords = quote.split('');
        untypedWords.forEach((letter, index) => {
          words.push(letter);
          add([
            text(letter),
            pos(index * 50 + 300, 360),
            opacity(0.33),
            scale(6),
            `letter${index}`,
          ]);
        });
        const endPlatform = add([
          rect(2000, 360),
          pos(untypedWords.length * 50 + 300, 360),
          area(),
          solid(),
          color(255, 255, 255),
        ]);
        const finishLine = add([
          rect(10, 10),
          pos(untypedWords.length * 50 + 600, 350),
          area(),
          solid(),
          color(0, 0, 0),
          'end',
        ]);
      } catch (error) {
        console.log(error);
        const quote = {
          content:
            'Hello! This quote is generated if the random quote API fails',
          author: 'Omar Abbasi',
        };
        quoteData.push(quote);
        const untypedWords = quote.content.split('');
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
          rect(100, 3600),
          pos(untypedWords.length * 50 + 300, 360),
          area(),
          solid(),
          color(255, 255, 255),
          'end',
        ]);
      }
    })
  );

  //---------SCORING

  let scoreValue = 0;
  const score = add([text('SCORE: 0', pos(0, 0)), fixed(), scale(3)]);
  let errorValue = 0;
  const errors = add([
    text('ERRORS: 0'),
    pos(DEFAULT_WIDTH, 0),
    fixed(),
    origin('topright'),
    color(255, 255, 255),
    scale(3),
  ]);

  //---------TYPED OBJECTS

  const typedWords = [];
  const underline = add([rect(30, 5), pos(300, 420)]);

  const whiteLetter = (char, index) => {
    scoreValue += 10;
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
    errorValue++;
    errors.color.g = 0;
    errors.color.b = 0;
    play('error');
    shake();
    destroyAll(`letter${index}`);
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

  const wpm = add([rect(0, 0), pos(-200, 360), move(RIGHT, speed)]);

  onCharInput((char) => {
    typedWords.push(char);
    const index = typedWords.length - 1;
    if (index <= words.length - 1) {
      underline.pos.x += 50;
      if (typedWords[index] === words[index]) {
        whiteLetter(char, index);
      } else {
        redLetter(char, index);
      }
    }
  });

  onUpdate(() => {
    camPos(wpm.pos);
    score.text = `SCORE: ${scoreValue}`;
    errors.text = `ERRORS: ${errorValue}`;
  });

  runner.onUpdate(() => {
    if (
      runner.pos.y > 720 ||
      runner.pos.x < wpm.pos.x - runner.width / 2 - width() / 2
    ) {
      shake();
      destroy(runner);
      play('death');
      go('gameover', scoreValue, errorValue, difficulty, quoteData[0]);
    }
  });

  runner.onCollide('error', () => {
    runner.use(move(RIGHT, speed / 2));
  });
  runner.onCollide('correct', () => {
    runner.use(move(RIGHT, speed));
  });

  runner.onCollide('end', () => {
    play('win');
    go('complete', scoreValue, errorValue, difficulty + 1, quoteData[0]);
  });
});

//---------SCENES
scene('complete', complete);
scene('gameover', gameover);
scene('menu', mainmenu);
scene('submitscore', submitscore);
scene('highscores', highscores);

go('menu');
