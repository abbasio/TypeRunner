import { DEFAULT_WIDTH } from '../main';
export default (score, errors, difficulty, quote) => {
  const CENTER = DEFAULT_WIDTH / 2;
  add([
    text('GAME OVER'),
    pos(CENTER, 150),
    scale(4),
    color(255, 0, 0),
    origin('center'),
  ]);

  add([text(`SCORE: ${score}`), pos(CENTER, 250), scale(3), origin('center')]);
  add([
    text(`ERRORS: ${errors}`),
    pos(CENTER, 350),
    color(255, 0, 0),
    scale(3),
    origin('center'),
  ]);

  let currentButton = 0;
  add([
    text('Retry'),
    pos(CENTER, 450),
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
    pos(CENTER, 500),
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

  onUpdate(() => {
    buttons[currentButton].selected = true;
  });

  onUpdate('button', (button) => {
    if (button.selected) button.text = button.selectedText;
    else button.text = button.regularText;
    if (button.isHovering()) {
      currentButton = button.num;
    } else {
      if (button.num !== currentButton) button.selected = false;
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

  onClick('menu', () => go('menu'));
  onClick('retry', () => go('game', difficulty));
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
