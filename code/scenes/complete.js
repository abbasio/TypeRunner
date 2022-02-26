export default (score, errors, difficulty, quote) => {
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

  let currentButton = 0;
  add([
    text('Retry'),
    pos(600, 450),
    origin('center'),
    area({ scale: 3 }),
    scale(2),
    {
      num: 0,
      selected: false,
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
    area({ scale: 3 }),
    scale(2),
    {
      num: 1,
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
    if (selectedButton[0].num === 1) go('menu');
    else go('game', difficulty);
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
};
