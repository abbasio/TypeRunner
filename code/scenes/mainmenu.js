export default () => {
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
};
