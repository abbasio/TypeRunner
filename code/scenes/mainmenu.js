import { DEFAULT_WIDTH } from '../main';
export default () => {
  const CENTER = DEFAULT_WIDTH / 2;
  add([text('TYPE/RUNNER'), pos(CENTER, 240), origin('center'), scale(6)]);
  let currentButton = 0;
  add([
    text('Easy'),
    pos(CENTER, 360),
    origin('center'),
    area({ scale: 3 }),
    scale(2),
    {
      num: 0,
      selected: false,
      regularText: 'Easy',
      selectedText: '> Easy',
    },
    'easy',
    'button',
  ]);
  add([
    text('Medium'),
    pos(CENTER, 410),
    origin('center'),
    area({ scale: 3 }),
    scale(2),
    {
      num: 1,
      selected: false,
      regularText: 'Medium',
      selectedText: '> Medium',
    },
    'medium',
    'button',
  ]);
  add([
    text('Hard'),
    pos(CENTER, 460),
    origin('center'),
    area({ scale: 3 }),
    scale(2),
    {
      num: 2,
      selected: false,
      regularText: 'Hard',
      selectedText: '> Hard',
    },
    'hard',
    'button',
  ]);
  add([
    text('Impossible'),
    pos(CENTER, 510),
    origin('center'),
    area({ scale: 3 }),
    scale(2),
    {
      num: 3,
      selected: false,
      regularText: 'Impossible',
      selectedText: '> Impossible',
    },
    'impossible',
    'button',
  ]);
  add([
    text('View Online Leaderboard'),
    pos(CENTER, 610),
    origin('center'),
    area({ scale: 3 }),
    scale(2),
    {
      num: 4,
      selected: false,
      regularText: 'View Online Leaderboard',
      selectedText: '> View Online Leaderboard',
    },
    'high-score',
    'button',
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
    if (selectedButton[0].num === 4) go('highscores');
    else go('game', selectedButton[0].num);
  });

  onClick('easy', () => go('game', 0));
  onClick('medium', () => go('game', 1));
  onClick('hard', () => go('game', 2));
  onClick('impossible', () => go('game', 3));
  onClick('high-score', () => go('highscores'));
  onClick('button', () => play('select'));
};
