import {
  getDatabase,
  ref,
  query,
  orderByChild,
  onValue,
} from 'firebase/database';
import { DEFAULT_WIDTH } from '../main';
export default (name, score) => {
  const CENTER = DEFAULT_WIDTH / 2;
  let isHighScore = false;
  try {
    add([
      text('HIGH SCORES'),
      pos(CENTER, 50),
      scale(4),
      color(0, 255, 0),
      origin('center'),
    ]);
    const db = getDatabase();

    const topScores = query(ref(db, 'scores'));
    onValue(topScores, (snapshot) => {
      const data = snapshot.val();
      let highScores = Object.values(data);
      highScores.sort((a, b) => {
        return b.score - a.score;
      });
      if (highScores.length > 10) highScores = highScores.slice(0, 10);

      highScores.forEach((highscore, index) => {
        if (
          highscore.name.toUpperCase() === name &&
          highscore.score === score
        ) {
          add([
            text(
              `${index + 1}. ${highscore.name.toUpperCase()} ............... ${
                highscore.score
              }`
            ),
            pos(CENTER, (index + 2) * 50),
            scale(3),
            color(0, 255, 255),
            origin('center'),
          ]);
          isHighScore = true;
        } else {
          add([
            text(
              `${index + 1}. ${highscore.name.toUpperCase()} ............... ${
                highscore.score
              }`
            ),
            pos(CENTER, (index + 2) * 50),
            scale(3),
            origin('center'),
          ]);
        }
      });
      console.log(highScores);
    });
  } catch (error) {
    console.log(error);
    add([
      text('ERROR: Database could not be reached'),
      pos(CENTER, 100),
      scale(3),
      color(255, 0, 0),
      origin('center'),
    ]);
  }
  const myScore = add([
    text(`11. ${name} ............... ${score}`),
    pos(CENTER, 600),
    scale(3),
    color(0, 255, 255),
    origin('center'),
  ]);

  add([
    text('> Return to Menu'),
    pos(CENTER, 650),
    origin('center'),
    area({ scale: 3 }),
    scale(2),
    'menu',
  ]);

  onUpdate(() => {
    if (isHighScore) myScore.text = '';
    if (!name || !score) myScore.text = '';
  });

  onKeyPress('enter', () => {
    play('select');
    go('menu');
  });

  onClick('menu', () => {
    play('select');
    go('menu');
  });
};
