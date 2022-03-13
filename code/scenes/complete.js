import { DEFAULT_WIDTH } from '../main';
export default (score, errors, difficulty, quote) => {
  const CENTER = DEFAULT_WIDTH / 2;
  let totalScore = (score - errors * 100) * difficulty;
  add([
    text('QUOTE COMPLETE!'),
    pos(CENTER, 50),
    scale(4),
    color(0, 255, 0),
    origin('center'),
  ]);

  add([
    text(`BASE SCORE: ${score}`),
    pos(CENTER, 150),
    scale(3),
    origin('center'),
  ]);

  add([
    text(`DIFFICULTY BONUS: X${difficulty}`),
    pos(CENTER, 200),
    scale(3),
    origin('center'),
  ]);

  if (errors === 0) {
    totalScore *= 2;
    add([
      text('PERFECT SCORE: 2X BONUS'),
      color(0, 255, 0),
      pos(CENTER, 250),
      scale(3),
      origin('center'),
    ]);
  } else {
    add([
      text(`ERRORS: ${errors}`),
      pos(CENTER, 250),
      color(255, 0, 0),
      scale(3),
      origin('center'),
    ]);
  }

  add([
    text(`TOTAL SCORE: ${totalScore}`),
    pos(CENTER, 300),
    scale(4),
    origin('center'),
  ]);

  let currentButton = 0;
  add([
    text('Submit Score'),
    pos(CENTER, 400),
    origin('center'),
    area({ scale: 3 }),
    scale(2),
    {
      num: 0,
      selected: false,
      regularText: 'Submit Score',
      selectedText: '> Submit Score',
    },
    'button',
    'submitScore',
  ]);
  add([
    text('Retry'),
    pos(CENTER, 450),
    origin('center'),
    area({ scale: 3 }),
    scale(2),
    {
      num: 1,
      selected: false,
      regularText: 'Retry',
      selectedText: '> Retry',
    },
    'button',
    'retry',
  ]);
  add([
    text('Return to Menu'),
    pos(CENTER, 500),
    origin('center'),
    area({ scale: 3 }),
    scale(2),
    {
      num: 2,
      selected: false,
      regularText: 'Return to Menu',
      selectedText: '> Return to Menu',
    },
    'button',
    'menu',
  ]);

  const buttons = get('button');
  onUpdate('button', (button) => {
    if (button.selected) button.text = button.selectedText;
    else button.text = button.regularText;
    if (button.num === currentButton) button.selected = true;
    if (button.isHovering()) {
      currentButton = button.num;
    } else {
      if (button.num !== currentButton) button.selected = false;
      else button.selected = true;
    }
  });

  onKeyPress('down', () => {
    if (currentButton === buttons.length - 1) currentButton = 0;
    else currentButton++;
  });
  onKeyPress('up', () => {
    if (currentButton === 0) currentButton = buttons.length - 1;
    else currentButton--;
  });
  onKeyPress('enter', () => {
    play('select');
    const selectedButton = buttons.filter((button) => button.selected);
    if (selectedButton[0].num === 0) go('submitscore', totalScore);
    if (selectedButton[0].num === 1) go('game', difficulty - 1);
    if (selectedButton[0].num === 2) go('menu');
  });

  onClick('retry', () => go('game', difficulty - 1));
  onClick('menu', () => go('menu'));
  onClick('submitScore', () => go('submitscore', totalScore));
  onClick('button', () => play('select'));

  add([
    text(`${quote.content}`, {
      size: 20,
      width: 600,
    }),
    pos(CENTER, 600),
    origin('center'),
    color(0, 255, 255),
  ]);
  add([
    text(`- ${quote.author}`, {
      size: 20,
      width: 600,
    }),
    pos(CENTER, 700),
    origin('left'),
    color(0, 255, 255),
  ]);
};
