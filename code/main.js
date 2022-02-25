/* eslint-disable no-undef */
import kaboom from 'kaboom';
import load from './load';
import axios from 'axios';

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
scene('game', (difficulty) => {
  console.log(difficulty);
  let speed;
  switch (difficulty) {
    case 1:
      speed = 200;
      break;
    case 2:
      speed = 275;
      break;
    case 3:
      speed = 350;
      break;
    case 4:
      speed = 450;
      break;
  }

  console.log(speed);
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
    pos(1200, 0),
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
    go('complete', scoreValue, errorValue, difficulty, quoteData[0]);
  });
});

//---------MAIN MENU

scene('menu', () => {
  add([text('TYPE/RUNNER'), pos(600, 240), origin('center'), scale(6)]);
  add([
    text('Easy'),
    pos(600, 360),
    origin('center'),
    area(),
    scale(2),
    {
      regularText: 'Easy',
      selectedText: '> Easy',
    },
    'easy',
    'button',
  ]);
  add([
    text('Medium'),
    pos(600, 410),
    origin('center'),
    area(),
    scale(2),
    {
      regularText: 'Medium',
      selectedText: '> Medium',
    },
    'medium',
    'button',
  ]);
  add([
    text('Hard'),
    pos(600, 460),
    origin('center'),
    area(),
    scale(2),
    {
      regularText: 'Hard',
      selectedText: '> Hard',
    },
    'hard',
    'button',
  ]);
  add([
    text('Impossible'),
    pos(600, 510),
    origin('center'),
    area(),
    scale(2),
    {
      regularText: 'Impossible',
      selectedText: '> Impossible',
    },
    'impossible',
    'button',
  ]);

  onUpdate('button', (button) => {
    if (button.isHovering()) {
      button.text = button.selectedText;
    } else {
      button.text = button.regularText;
    }
  });

  onClick('easy', () => go('game', 1));
  onClick('medium', () => go('game', 2));
  onClick('hard', () => go('game', 3));
  onClick('impossible', () => go('game', 4));
  onClick('button', () => play('select'));
});

//---------RUN COMPLETE
scene('complete', (score, errors, difficulty, quote) => {
  let totalScore = (score - errors * 10) * difficulty;
  add([
    text('QUOTE COMPLETE!'),
    pos(600, 100),
    scale(4),
    color(0, 255, 0),
    origin('center'),
  ]);

  add([
    text(`BASE SCORE: ${score}`),
    pos(600, 200),
    scale(3),
    origin('center'),
  ]);

  add([
    text(`DIFFICULTY BONUS: X${difficulty}`),
    pos(600, 250),
    scale(3),
    origin('center'),
  ]);

  if (errors === 0) {
    totalScore += 1000;
    add([
      text('PERFECT BONUS: +1,000'),
      color(0, 255, 0),
      pos(600, 300),
      scale(3),
      origin('center'),
    ]);
  } else {
    add([
      text(`ERRORS: ${errors}`),
      pos(600, 300),
      color(255, 0, 0),
      scale(3),
      origin('center'),
    ]);
  }

  add([
    text(`TOTAL SCORE: ${totalScore}`),
    pos(600, 400),
    scale(4),
    origin('center'),
  ]);
  add([
    text('Retry'),
    pos(600, 450),
    origin('center'),
    area(),
    scale(2),
    {
      regularText: 'Retry',
      selectedText: '> Retry',
    },
    'button',
    'retry',
  ]);
  add([
    text('Return to Menu'),
    pos(600, 500),
    origin('center'),
    area(),
    scale(2),
    {
      regularText: 'Return to Menu',
      selectedText: '> Return to Menu',
    },
    'button',
    'menu',
  ]);

  onUpdate('button', (button) => {
    if (button.isHovering()) {
      button.text = button.selectedText;
    } else {
      button.text = button.regularText;
    }
  });
  onClick('retry', () => go('game', difficulty));
  onClick('menu', () => go('menu'));
  onClick('button', () => play('select'));

  add([
    text(`${quote.content}`, {
      size: 20,
      width: 600,
    }),
    pos(600, 600),
    origin('center'),
    color(0, 255, 255),
  ]);
  add([
    text(`- ${quote.author}`, {
      size: 20,
      width: 600,
    }),
    pos(600, 700),
    origin('left'),
    color(0, 255, 255),
  ]);
});

//---------GAME OVER
scene('gameover', (score, errors, difficulty, quote) => {
  add([
    text('GAME OVER'),
    pos(600, 150),
    scale(4),
    color(255, 0, 0),
    origin('center'),
  ]);

  add([text(`SCORE: ${score}`), pos(600, 250), scale(3), origin('center')]);
  add([
    text(`ERRORS: ${errors}`),
    pos(600, 350),
    color(255, 0, 0),
    scale(3),
    origin('center'),
  ]);

  add([
    text('Retry'),
    pos(600, 450),
    origin('center'),
    area(),
    scale(2),
    {
      regularText: 'Retry',
      selectedText: '> Retry',
    },
    'button',
    'retry',
  ]);

  add([
    text('Return to Menu'),
    pos(600, 500),
    origin('center'),
    area(),
    scale(2),
    {
      regularText: 'Return to Menu',
      selectedText: '> Return to Menu',
    },
    'button',
    'menu',
  ]);

  onUpdate('button', (button) => {
    if (button.isHovering()) {
      button.text = button.selectedText;
    } else {
      button.text = button.regularText;
    }
  });
  onClick('menu', () => go('menu'));
  onClick('retry', () => go('game', difficulty));
  onClick('button', () => play('select'));
  add([
    text(`${quote.content}`, {
      size: 20,
      width: 600,
    }),
    pos(600, 600),
    origin('center'),
    color(0, 255, 255),
  ]);
  add([
    text(`- ${quote.author}`, {
      size: 20,
      width: 600,
    }),
    pos(600, 700),
    origin('left'),
    color(0, 255, 255),
  ]);
});

go('menu');
