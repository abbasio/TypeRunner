export default (score, errors, difficulty, quote) => {
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
};
