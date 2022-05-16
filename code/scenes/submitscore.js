import { stringify } from '@firebase/util';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import config from '../../firebaseconfig';
import { DEFAULT_WIDTH } from '../main';

//---------FIREBASE
const app = initializeApp(config);
function saveScore(name, score) {
  const db = getDatabase();
  push(ref(db, 'scores'), {
    name,
    score,
  });
}
//---------SCENE
export default (score) => {
  const CENTER = DEFAULT_WIDTH / 2;
  let name = '';

  add([text('SUBMIT SCORE'), pos(CENTER, 100), scale(4), origin('center')]);

  add([
    text(`Your Score: ${score}`),
    pos(CENTER, 200),
    scale(3),
    origin('center'),
  ]);
  add([
    text('Type in your name, then press Enter'),
    pos(CENTER, 250),
    scale(2),
    origin('center'),
  ]);

  const userName = add([
    text(''),
    pos(CENTER, 400),
    scale(3),
    origin('center'),
  ]);

  const warning = add([
    text(''),
    pos(CENTER, 450),
    color(255, 0, 0),
    scale(2),
    origin('center'),
  ]);

  onCharInput((char) => {
    if (name.length < 3) {
      name += char;
    }
  });
  onKeyPress('backspace', () => {
    name = name.slice(0, name.length - 1);
  });
  onKeyPress('enter', () => {
    if (name.length === 3) {
      saveScore(name.toUpperCase(), score);
      play('select');
      go('highscores', name.toUpperCase(), score);
    } else {
      warning.text = 'Name must be 3 letters!';
      shake();
      play('error');
    }
  });

  onUpdate(() => {
    userName.text = name.toUpperCase();
  });
};
